#!/usr/bin/env python3
"""Author the requested large, weathered GDR enemies and migrate ownership.

Each family shares one source scale across its six poses. Explicit planted
sole centres exclude hands and raised feet. Run without arguments, then
sprites.py. Combat radii/reference sizes are validated separately in JS.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/12-gdr-enemy-proportions'
POSES = ['idle', 'walk-a', 'walk-b', 'attack-a', 'attack-b', 'hit']
SPECS = {
    'uhr': (64, 22, .25, 'giant', 'humanoid-clockwork',
            [[268.5, 465], [243.5, 464], [236.5, 465], [252, 461], [218, 460], [265, 460]]),
    'brigadeghoul': (44, 20, .4, 'medium', 'square-collar',
                     [[255, 417], [254.5, 417], [240.5, 418], [255.5, 416], [225, 416], [245.5, 416]]),
}


def write(path, value):
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + '\n')


def run():
    picks = {}
    for kind, (target, radius, ground, height_class, outline, soles) in SPECS.items():
        with Image.open(RAW / (kind + '.png')) as image:
            if image.size != (1536, 1024) or image.mode != 'RGBA':
                raise ValueError(f'{kind}: expected 1536x1024 RGBA')
            alpha = np.asarray(image)[:, :, 3].copy()
        cells = []
        for i in range(6):
            x, y = i % 3 * 512, i // 3 * 512
            ys, xs = np.nonzero(alpha[y:y + 512, x:x + 512] > 128)
            if len(xs) < 30:
                raise ValueError(f'{kind}/{POSES[i]}: empty cell')
            cells.append((x, y, int(ys.max() - ys.min() + 1)))
        scale = target / cells[0][2]
        for i, (x, y, height) in enumerate(cells):
            ax, ay = soles[i]
            picks[f'enemies/{kind}-{POSES[i]}'] = {
                'source': kind + '.png', 'crop': [x, y, x + 512, y + 512],
                'alpha_threshold': 128, 'height': round(height * scale, 6),
                'anchor': [x + ax, y + ay], 'for': f'drawEnemy {kind} {POSES[i]}',
                'authored_radius': radius, 'ground_offset': ground,
                'height_class': height_class, 'outline_family': outline,
                'reason': 'User-requested believable large GDR body, matching collider and post-apocalyptic wear; Pioneer colours and hammer-and-sickle retained',
            }
    write(RAW / 'picks.json', picks)
    for task in ['00-tooling', '01-enemies', '01b-enemy-redesign']:
        recipe = RAW.parent / task / 'picks.json'
        old = json.loads(recipe.read_text())
        new = {key: spec for key, spec in old.items() if key not in picks}
        if new != old:
            write(recipe, new)
    print(f'Selected {len(picks)} large GDR frames with explicit soles.')


if __name__ == '__main__':
    run()
