#!/usr/bin/env python3
"""Build task03 painted faces only; never re-encode another task's assets.

Run with the repo Python (Pillow/numpy). Generated source atlases are immutable.
Rectangular surface extraction and colour-only variants use the normalizer's
existing API, and preserve the game's real footprint/rotation at runtime.
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image
from sprites import normalise, read_object

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/03-vehicles'
def write_json(path, data):
    path.write_text(json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False, allow_nan=False)+'\n', encoding='utf8')

FACES = ['side', 'end', 'top', 'glass-side', 'glass-end', 'roof']
SMALL = {
    'car': {'colour': (45, 73, 60), 'size': [(96, 12), (44, 12), (96, 44), (44, 11), (44, 11), (26, 32)],
            'crops': [[28, 138, 750, 258], [819, 125, 1090, 255], [1175, 57, 1740, 253], [270, 58, 593, 128], [845, 54, 1068, 121], [1400, 78, 1578, 228]],
            'variants': {'green': None, 'red': (139, 52, 43), 'blue': (53, 95, 133)}},
    'trabi': {'colour': (119, 166, 162), 'size': [(79, 11), (44, 11), (79, 44), (36, 10), (44, 10), (22, 32)],
              'crops': [[69, 422, 697, 540], [808, 418, 1086, 543], [1200, 351, 1695, 537], [285, 345, 556, 411], [849, 343, 1061, 405], [1380, 365, 1562, 523]],
              'variants': {'turquoise': None, 'cream': (199, 176, 128), 'red': (156, 70, 56)}},
    'van': {'colour': (57, 96, 135), 'size': [(106, 24), (44, 24), (106, 44), (91, 12), (44, 12), (75, 32)],
            'crops': [[38, 746, 720, 861], [813, 737, 1083, 854], [1184, 645, 1738, 848], [178, 638, 700, 737], [850, 648, 1061, 726], [1314, 659, 1713, 832]],
            'variants': {'blue': None, 'cream': (186, 174, 143)}},
}


def palette(im, family, target):
    if target is None:
        return im
    a = np.array(im)
    rgb = a[:, :, :3].astype(float)
    # Keep glass, cream patches, rusty orange and black ink. Shift only the
    # family enamel hues; material highlights and all authored damage survive.
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    if family == 'car':
        mask = (rgb[:, :, 1] > rgb[:, :, 0] * 1.06) & (rgb[:, :, 1] >= rgb[:, :, 2] * .96)
    elif family == 'trabi':
        mask = (rgb[:, :, 2] > rgb[:, :, 0] * 1.02) & (rgb[:, :, 1] > rgb[:, :, 0] * 1.04)
    else:
        mask = (rgb[:, :, 2] > rgb[:, :, 0] * 1.12) & (rgb[:, :, 2] > rgb[:, :, 1] * 1.04)
    mask &= (mx - mn > 9) & (mx > 24)
    ref = np.array(SMALL[family]['colour'], dtype=float)
    luminance = rgb.mean(axis=2) / ref.mean()
    shifted = np.clip(np.array(target)[None, None, :] * luminance[:, :, None], 0, 255)
    a[:, :, :3][mask] = shifted[mask].astype(np.uint8)
    return Image.fromarray(a)


def main():
    RAW.mkdir(parents=True, exist_ok=True)
    picks = {}
    atlas = Image.open(RAW / 'small-atlas.png').convert('RGBA')
    for family, spec in SMALL.items():
        if family != 'car':
            continue  # Trabi/Barkas use the user-requested refinement sources.
        for variant, target in spec['variants'].items():
            if variant == 'red':
                continue  # Independently painted burned wreck replaces red.
            for face, crop, size in zip(FACES, spec['crops'], spec['size']):
                part = atlas.crop(crop)
                # Faces are opaque planes. Fill tiny transparent edge pixels
                # from the generated cutout with matching base enamel.
                flat = Image.new('RGBA', part.size, spec['colour'] + (255,))
                flat.alpha_composite(part)
                flat = palette(flat, family, target)
                if face.startswith('glass-'):
                    # Atlas glass was pale; cool the reflected light to the
                    # darker canvas/board value while retaining painted cracks.
                    a = np.array(flat)
                    a[:, :, :3] = (a[:, :, :3].astype(float) * .55).astype(np.uint8)
                    flat = Image.fromarray(a)
                flat = flat.resize((size[0] * 3, size[1] * 3), Image.Resampling.LANCZOS)
                filename = f'{family}-{variant}-{face}.png'
                flat.save(RAW / filename)
                picks[f'vehicles/{family}-{variant}-{face}'] = {'source': filename, 'height': size[1], 'anchor': [0, 0], 'for': f'drawVehBox {family}: orthographic {face} surface; actual P3 rotation', 'footprint': [size[0], size[1]]}
    atlas = Image.open(RAW / 'transit-atlas.png').convert('RGBA')
    transit = {
        'bus': {'crops': [[46, 94, 1070, 342], [1130, 104, 1384, 343], [1447, 135, 2157, 276]], 'sizes': [(230, 36), (46, 36), (230, 46)]},
        'tram': {'crops': [[36, 445, 1085, 679], [1143, 446, 1374, 679], [1441, 495, 2153, 610]], 'sizes': [(250, 36), (44, 36), (250, 44)]},
    }
    for family, spec in transit.items():
        for face, crop, size in zip(FACES[:3], spec['crops'], spec['sizes']):
            part = atlas.crop(crop)
            flat = Image.new('RGBA', part.size, (204, 158, 33, 255))
            flat.alpha_composite(part)
            flat = flat.resize((size[0] * 3, size[1] * 3), Image.Resampling.LANCZOS)
            filename = f'{family}-yellow-{face}.png'
            flat.save(RAW / filename)
            picks[f'vehicles/{family}-yellow-{face}'] = {'source': filename, 'height': size[1], 'anchor': [0, 0], 'for': f'drawVehBox {family}: orthographic {face} surface; actual P3 rotation', 'footprint': [size[0], size[1]]}
    recipe = RAW / 'picks.json'
    write_json(recipe, picks)
    manifest = read_object(ROOT / 'assets/manifest.json')
    for key, spec in picks.items():
        image, entry = normalise(key, spec, recipe)
        destination = ROOT / 'assets' / f'{key}.webp'
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, 'WEBP', quality=88, method=6)
        assert destination.stat().st_size < 400000, destination
        manifest[key] = entry
    write_json(ROOT / 'assets/manifest.json', manifest)
    from build_vehicle_refinement import main as refinement
    refinement()
    manifest = read_object(ROOT / 'assets/manifest.json')
    keys = [k for k in manifest if k.startswith('vehicles/')]
    stats = {'textures': len(keys), 'decodedBytes': sum(manifest[k]['w'] * manifest[k]['h'] * 4 for k in keys), 'fileBytes': sum((ROOT / 'assets' / (k+'.webp')).stat().st_size for k in keys), 'largestFileBytes': max((ROOT / 'assets' / (k+'.webp')).stat().st_size for k in keys), 'runtimeTotalLimitBytes': 40000000, 'choices': 'Cream-only rounded Trabi; windowed blue/cream Barkas B1000; green/blue sedans plus independently painted partly burned red wreck; BVG yellow bus/tram. Refinement sources and prompts preserved.'}
    assert stats['decodedBytes'] < stats['runtimeTotalLimitBytes']
    write_json(RAW / 'build-stats.json', stats)
    print(json.dumps(stats, indent=2))


if __name__ == '__main__':
    main()
