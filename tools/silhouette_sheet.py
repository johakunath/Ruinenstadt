#!/usr/bin/env python3
"""Render enemy idle silhouettes at 64 px on light grey (Pillow/numpy only).

No arguments writes silhouettes-current.png and a matching JSON inventory in
the latest completed 01b proof directory. Use --output to retain a named baseline, and
--root/--manifest to compare a checkout or exported asset tree. --picks may be
repeated to attach height_class and outline_family annotations (directly on a
pick or inside its silhouette object). Unknown annotations remain explicit;
the script never guesses an outline family from pixels.

--thumbnails renders every source selection from the supplied --picks files
instead of manifest idles. Selections use the sprites.py source/crop/background/
alpha_threshold convention; height, anchor and pivots are unnecessary here.
Optional luminance_threshold (0..255) selects dark pixels from RGB thumbnail
canvases, intersected with the alpha mask; omitted preserves alpha-only masks.
All visible masks are proportionally scaled to 64 px tall. World height is
listed separately, since equal display height must not hide the height class.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from sprites import read_object, remove_background

ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = '#e6e6e6'


def proof_directory(root):
    second = root / 'pipeline/proof/01b-enemy-redesign-batch-2'
    return second if (second / 'silhouette-classes-current.json').exists() else root / 'pipeline/proof/01b-enemy-redesign'


def annotation(spec, name):
    nested = spec.get('silhouette', {})
    return spec.get(name, nested.get(name) if isinstance(nested, dict) else None)


def source_mask(path, spec):
    with Image.open(path) as image:
        im = image.convert('RGBA')
    if 'crop' in spec:
        crop = spec['crop']
        if (not isinstance(crop, list) or len(crop) != 4
                or not all(type(n) is int for n in crop)
                or not 0 <= crop[0] < crop[2] <= im.width
                or not 0 <= crop[1] < crop[3] <= im.height):
            raise ValueError(f'{path}: crop must be inside source')
        im = im.crop(crop)
    if 'background' in spec:
        im = remove_background(im, spec['background'], spec.get('tolerance', 24))
    threshold = spec.get('alpha_threshold', 16)
    if type(threshold) is not int or not 0 <= threshold <= 254:
        raise ValueError(f'{path}: alpha_threshold must be 0..254')
    pixels = np.asarray(im)
    selected = pixels[:, :, 3] > threshold
    if 'luminance_threshold' in spec:
        luminance = spec['luminance_threshold']
        if type(luminance) is not int or not 0 <= luminance <= 255:
            raise ValueError(f'{path}: luminance_threshold must be 0..255')
        rgb = pixels[:, :, :3].astype(np.uint32)
        selected &= (299 * rgb[:, :, 0] + 587 * rgb[:, :, 1] + 114 * rgb[:, :, 2]) <= luminance * 1000
    mask = Image.fromarray(np.uint8(selected) * 255)
    box = mask.getbbox()
    if not box:
        raise ValueError(f'{path}: empty silhouette')
    return mask.crop(box)


def collect(args, root):
    recipes = args.picks or sorted((root / 'assets/raw/codex').glob('*/picks.json'))
    annotations = proof_directory(root) / 'silhouette-classes-current.json'
    if not args.picks and annotations.exists():
        recipes = [*recipes, annotations]
    selections = {}
    for recipe in recipes:
        for key, spec in read_object(recipe).items():
            if not isinstance(spec, dict):
                raise ValueError(f'{recipe}: {key}: expected an object')
            selections[key] = (recipe, spec)
    if args.thumbnails:
        if not args.picks:
            raise ValueError('--thumbnails requires explicit --picks')
        entries = {key: spec for key, (_, spec) in selections.items() if 'source' in spec}
    else:
        manifest = args.manifest or root / 'assets/manifest.json'
        entries = {key: spec for key, spec in read_object(manifest).items()
                   if key.startswith('enemies/') and key.endswith('-idle')}
    if not entries:
        raise ValueError('no enemy idle frames / source thumbnails found')
    result = []
    for key, entry in sorted(entries.items()):
        recipe, pick = selections.get(key, (None, {}))
        if args.thumbnails:
            path = (recipe.parent / pick['source']).resolve()
            if not path.is_relative_to(recipe.parent.resolve()):
                raise ValueError(f'{key}: source must stay inside picks directory')
            mask = source_mask(path, pick)
            world_height = pick.get('height')
        else:
            path = root / 'assets' / (key + '.webp')
            mask = source_mask(path, {})
            units = entry.get('units', 3)
            if not isinstance(units, (int, float)) or units <= 0:
                raise ValueError(f'{key}: positive units required')
            world_height = round(mask.height / units, 2)
        spec = dict(entry)
        spec.update(pick)
        result.append({'key': key, 'height_class': annotation(spec, 'height_class'),
                       'outline_family': annotation(spec, 'outline_family'),
                       'world_height': world_height, 'source_sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                       'mask': mask})
    return result


def render(records, output, title):
    font = ImageFont.load_default()
    # Wide silhouettes (rats/crows) remain 64 px tall without clipping.
    widths = [max(1, round(r['mask'].width * 64 / r['mask'].height)) for r in records]
    cell_w = max(210, max(widths) + 24)
    columns = min(4, len(records))
    cell_h, top = 142, 64
    sheet = Image.new('RGB', (columns * cell_w, top + math.ceil(len(records) / columns) * cell_h), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    draw.text((12, 10), title, fill='black', font=font)
    draw.text((12, 28), '64 px tall | black alpha masks | class/family: ? = unannotated', fill='black', font=font)
    inventory = []
    for i, (record, width) in enumerate(zip(records, widths)):
        x, y = (i % columns) * cell_w, top + (i // columns) * cell_h
        mask = record['mask'].resize((width, 64), Image.Resampling.NEAREST)
        sheet.paste('black', (x + (cell_w - width) // 2, y), mask)
        draw.line((x + 10, y + 66, x + cell_w - 10, y + 66), fill='#cccccc')
        label = record['key'].removeprefix('enemies/')
        draw.text((x + 10, y + 74), label, fill='black', font=font)
        draw.text((x + 10, y + 90), f"height: {record['height_class'] or '?'} | world: {record['world_height'] if record['world_height'] is not None else '?'}", fill='black', font=font)
        draw.text((x + 10, y + 106), f"outline: {record['outline_family'] or '?'}", fill='black', font=font)
        inventory.append({k: v for k, v in record.items() if k != 'mask'})
    groups = {}
    for record in inventory:
        if record['height_class'] and record['outline_family']:
            group = (str(record['height_class']), str(record['outline_family']))
            groups.setdefault(group, []).append(record['key'])
    pairs = [[left, right] for keys in groups.values() for i, left in enumerate(keys) for right in keys[i + 1:]]
    report = {'display_height_px': 64, 'title': title, 'sprites': inventory,
              'unannotated': [r['key'] for r in inventory if not r['height_class'] or not r['outline_family']],
              'failing_pairs': pairs,
              'gate_complete': all(r['height_class'] and r['outline_family'] for r in inventory)}
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, 'PNG')
    output.with_suffix('.json').write_text(json.dumps(report, indent=2, sort_keys=True) + '\n')
    print(f'{output}: {len(records)} silhouettes; {len(pairs)} annotated failing pair(s); {len(report["unannotated"])} unannotated')


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--root', type=Path, default=ROOT, help='checkout root containing assets/')
    parser.add_argument('--manifest', type=Path, help='alternate manifest JSON')
    parser.add_argument('--picks', type=Path, action='append', help='selection/metadata JSON, repeatable')
    parser.add_argument('--thumbnails', action='store_true', help='render source crops from explicit picks')
    parser.add_argument('--output', type=Path, help='PNG output, matching JSON report is also written')
    parser.add_argument('--title', default='Enemy silhouettes - current idle frames')
    args = parser.parse_args()
    root = args.root.resolve()
    output = args.output or proof_directory(root) / 'silhouettes-current.png'
    try:
        render(collect(args, root), output, args.title)
    except (OSError, ValueError, KeyError, TypeError) as exc:
        parser.exit(1, f'{exc}\n')


if __name__ == '__main__':
    main()
