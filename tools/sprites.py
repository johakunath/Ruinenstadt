#!/usr/bin/env python3
"""Normalise selected world sprites; run with no arguments, or --check.

Selections live in assets/raw/codex/<task>/picks.json, keyed like the manifest:
{"enemies/ghoul-idle": {"source": "ghoul.png", "height": 48,
  "anchor": [200, 780], "pivots": {"jaw": [300, 130]},
  "for": "drawEnemy ghoul"}}

source is relative to picks.json. Optional crop [left,top,right,bottom], anchor
and pivots use ORIGINAL source pixels. height is the trimmed height in world
units. Optional background [r,g,b] removes only matching border-connected
pixels (tolerance defaults to 24); existing alpha is preserved. Transparent
sources need no background. Output is trimmed, padded by 1 px, at 3 px/unit.
Only approved selections belong in picks.json; review sheets are never input.
"""
import argparse
import json
import math
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex'
MANIFEST = ROOT / 'assets/manifest.json'
KEY = re.compile(r'^(?:(?:buildings|vehicles|nature|enemies|bosses|props)/|hero/rig/)[a-z0-9]+(?:-[a-z0-9]+)*$')
UNITS = 3
LIMIT = 400 * 1024


def number(n):
    return isinstance(n, (int, float)) and not isinstance(n, bool) and math.isfinite(n)


def point(p):
    return isinstance(p, list) and len(p) == 2 and all(number(n) for n in p)


def read_object(path):
    def unique(pairs):
        obj = {}
        for key, value in pairs:
            if key in obj:
                raise ValueError(f'{path}: duplicate key {key}')
            obj[key] = value
        return obj
    data = json.loads(path.read_text(), object_pairs_hook=unique)
    if not isinstance(data, dict):
        raise ValueError(f'{path}: expected an object')
    return data


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False, allow_nan=False) + '\n')


def remove_background(im, colour, tolerance):
    """Flood from all four borders, keeping enclosed detail of the same colour."""
    if not isinstance(colour, list) or len(colour) != 3 or not all(type(n) is int and 0 <= n <= 255 for n in colour):
        raise ValueError('background must be [r,g,b], each 0..255')
    if not number(tolerance) or not 0 <= tolerance <= 255:
        raise ValueError('tolerance must be 0..255')
    a = np.array(im)
    near = (np.max(np.abs(a[:, :, :3].astype(np.int16) - colour), axis=2) <= tolerance) | (a[:, :, 3] == 0)
    mask = Image.new('L', (im.width + 2, im.height + 2), 255)
    mask.paste(Image.fromarray(np.uint8(near) * 255), (1, 1))
    ImageDraw.floodfill(mask, (0, 0), 128)
    outside = np.asarray(mask)[1:-1, 1:-1] == 128
    a[outside, 3] = 0
    return Image.fromarray(a)


def normalise(key, spec, recipe):
    if not KEY.fullmatch(key) or not isinstance(spec, dict):
        raise ValueError(f'{key}: invalid sprite key or selection')
    source = spec.get('source')
    if not isinstance(source, str):
        raise ValueError(f'{key}: source is required')
    path = (recipe.parent / source).resolve()
    if not path.is_relative_to(recipe.parent.resolve()):
        raise ValueError(f'{key}: source must stay inside the task raw folder')
    height = spec.get('height')
    if not number(height) or height <= 0:
        raise ValueError(f'{key}: positive height in world units is required')
    if not isinstance(spec.get('for'), str) or not spec['for'].strip():
        raise ValueError(f'{key}: for is required')
    with Image.open(path) as src:
        im = src.convert('RGBA')
    crop = spec.get('crop', [0, 0, im.width, im.height])
    if (not isinstance(crop, list) or len(crop) != 4 or not all(type(n) is int for n in crop)
            or not 0 <= crop[0] < crop[2] <= im.width or not 0 <= crop[1] < crop[3] <= im.height):
        raise ValueError(f'{key}: crop must be inside source')
    im = im.crop(crop)
    if 'background' in spec:
        im = remove_background(im, spec['background'], spec.get('tolerance', 24))
    box = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    if not box:
        raise ValueError(f'{key}: empty sprite after background removal')
    # Discard near-invisible generation noise outside the visible silhouette.
    im = im.crop(box)
    height_px = max(1, round(height * UNITS))
    width_px = max(1, round(im.width * height_px / im.height))
    sx, sy = width_px / im.width, height_px / im.height
    out = Image.new('RGBA', (width_px + 2, height_px + 2))
    out.paste(im.resize((width_px, height_px), Image.Resampling.LANCZOS), (1, 1))

    def transform(p):
        if not point(p):
            raise ValueError(f'{key}: anchor/pivot must be [x,y]')
        q = [round((p[0] - crop[0] - box[0]) * sx + 1, 3),
             round((p[1] - crop[1] - box[1]) * sy + 1, 3)]
        if not 0 <= q[0] < out.width or not 0 <= q[1] < out.height:
            raise ValueError(f'{key}: anchor/pivot outside trimmed image: {p}')
        return q

    default_anchor = [crop[0] + (box[0] + box[2]) / 2, crop[1] + box[3] - 1]
    entry = {'w': out.width, 'h': out.height, 'units': UNITS,
             'anchor': transform(spec.get('anchor', default_anchor)), 'for': spec['for']}
    if 'pivots' in spec:
        if not isinstance(spec['pivots'], dict):
            raise ValueError(f'{key}: pivots must be an object')
        entry['pivots'] = {k: transform(v) for k, v in spec['pivots'].items()}
    if 'footprint' in spec:
        if not point(spec['footprint']) or min(spec['footprint']) <= 0:
            raise ValueError(f'{key}: footprint must be two positive world sizes')
        entry['footprint'] = spec['footprint']
    return out, entry


def check(manifest, root=ROOT):
    errors = []
    for key, entry in manifest.items():
        if not KEY.fullmatch(key) or not isinstance(entry, dict):
            errors.append(f'{key}: invalid key or entry')
            continue
        path = root / 'assets' / (key + '.webp')
        if not path.is_file():
            errors.append(f'{key}: missing file')
        else:
            if path.stat().st_size > LIMIT:
                errors.append(f'{key}: file exceeds 400 KB')
            try:
                with Image.open(path) as im:
                    if im.format != 'WEBP':
                        errors.append(f'{key}: expected WebP')
                    if list(im.size) != [entry.get('w'), entry.get('h')]:
                        errors.append(f'{key}: image size does not match manifest')
                    if 'A' not in im.getbands() or im.getchannel('A').getextrema()[0] == 255:
                        errors.append(f'{key}: missing transparency')
                    elif im.getchannel('A').getextrema()[1] == 0:
                        errors.append(f'{key}: empty image')
            except (OSError, ValueError) as exc:
                errors.append(f'{key}: unreadable image: {exc}')
        w, h = entry.get('w'), entry.get('h')
        if type(w) is not int or type(h) is not int or min(w, h) < 1:
            errors.append(f'{key}: invalid dimensions')
        else:
            pts = {'anchor': entry.get('anchor')}
            if not isinstance(entry.get('pivots', {}), dict):
                errors.append(f'{key}: invalid pivots')
            else:
                pts.update(entry.get('pivots', {}))
            for name, p in pts.items():
                if not point(p) or not 0 <= p[0] < w or not 0 <= p[1] < h:
                    errors.append(f'{key}: {name} outside image or invalid')
        expected_units = 6 if key.startswith('hero/rig/') else UNITS
        if entry.get('units') != expected_units:
            errors.append(f'{key}: units must be {expected_units}')
        if not isinstance(entry.get('for'), str) or not entry['for'].strip():
            errors.append(f'{key}: missing for')
        if 'footprint' in entry and (not point(entry['footprint']) or min(entry['footprint']) <= 0):
            errors.append(f'{key}: invalid footprint')
    return errors


def build():
    manifest = read_object(MANIFEST) if MANIFEST.exists() else {}
    selected = {}
    for recipe in sorted(RAW.glob('*/picks.json')):
        for key, spec in read_object(recipe).items():
            if key in selected:
                raise ValueError(f'{key}: selected in more than one task')
            selected[key] = normalise(key, spec, recipe)
    for key, (im, entry) in selected.items():
        path = ROOT / 'assets' / (key + '.webp')
        path.parent.mkdir(parents=True, exist_ok=True)
        im.save(path, 'WEBP', quality=88, method=6, exact=True)
        manifest[key] = entry
        print(f'{key}: {im.width}x{im.height}, anchor {entry["anchor"]}')
    write_json(MANIFEST, manifest)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--check', action='store_true', help='validate manifest and files without writing')
    args = parser.parse_args()
    try:
        manifest = read_object(MANIFEST) if args.check else build()
        errors = check(manifest)
    except (OSError, ValueError, KeyError) as exc:
        parser.exit(1, f'{exc}\n')
    if errors:
        parser.exit(1, '\n'.join(errors) + '\n')
    print(f'Checked {len(manifest)} sprite(s).' + (' No approved selections yet.' if not manifest else ''))


if __name__ == '__main__':
    main()
