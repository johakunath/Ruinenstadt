#!/usr/bin/env python3
"""Select task 01b's redesigned enemies and migrate their frame ownership.

Run without arguments, then tools/sprites.py. Six 512 px cells share the idle
scale, preserving authored squash and stretch. The >128 alpha mask removes
generation halos; the lowest solid sole strip excludes the raser's raised tail.
Mouth coordinates and selection metadata are explicit, not inferred at runtime.
Legacy recipes lose only keys owned here; rejected raw generations stay intact.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/01b-enemy-redesign'
POSES = ['idle', 'walk-a', 'walk-b', 'attack-a', 'attack-b', 'hit']
DESIGNS = {
    'ghoul': (32, 'medium', 'crooked-longarm', 'Crooked spine and dangling long arms distinguish the medium scavenger.'),
    'spitter': (24, 'short', 'balloon-throat', 'Low inflated throat and long snout give the ranged enemy a broad nonhuman outline.'),
    'bomb': (28, 'short', 'round-boiler', 'Round boiler body separates the explosive enemy from upright humanoids.'),
    'howl': (50, 'tall', 'arched-trumpet', 'Tall arched trumpet silhouette makes the caller identifiable without colour.'),
    'raser': (18, 'low', 'horizontal-tail', 'Low horizontal runner with a raised long tail reads distinctly during a charge.'),
    'shield': (32, 'medium', 'vaulted-carapace', 'U-Bahn canvas variant 03: a vaulted shell distinguishes the defender while the separate directional panel retains its shield arc.'),
    'brigadeghoul': (20, 'low', 'square-collar', 'Alexanderplatz variant 01 silhouette, regenerated on user request with Pioneer blue/yellow and a red hammer-and-sickle medallion.'),
    'uhr': (44, 'medium', 'clock-robot', 'Existing clockwork body and poses retained; user-requested Pioneer blue/yellow and a large hammer-and-sickle badge replace the olive livery.'),
    'schrottkoloss': (83, 'giant', 'chimney-triangle', 'U-Bahn canvas variant 01: tall chimneys and a triangular scrap body distinguish the giant from the bulky worker.'),
}
SELECTED_VARIANTS = {'shield': '03'}
MOUTH = [[448, 180], [455, 176], [455, 176], [435, 84], [479, 178], [443, 198]]
# Low hands/claws overlap a broad bottom strip: author the planted sole centres.
SOLES = {
    'shield': [[254, 442], [263.5, 441], [252, 440], [253, 442], [228, 438], [255, 438]],
    'schrottkoloss': [[282.5, 454], [280.5, 453], [254, 452], [265.5, 449], [223.5, 448], [281.5, 450]],
}


def write(path, value):
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + '\n')


def run():
    picks = {}
    for kind, (target, height_class, outline_family, reason) in DESIGNS.items():
        with Image.open(RAW / (kind + '.png')) as source:
            if source.size != (1536, 1024) or source.mode != 'RGBA':
                raise ValueError(f'{kind}: expected 1536x1024 RGBA')
            alpha = np.asarray(source)[:, :, 3].copy()
        cells = []
        for i, pose in enumerate(POSES):
            x, y = i % 3 * 512, i // 3 * 512
            solid = alpha[y:y + 512, x:x + 512] > 128
            ys, xs = np.nonzero(solid)
            if len(xs) < 30:
                raise ValueError(f'{kind}/{pose}: empty frame')
            top, bottom = int(ys.min()), int(ys.max())
            height = bottom - top + 1
            depth = max(8, round(height * .14))
            sole = np.nonzero(solid[max(top, bottom - depth + 1):bottom + 1].any(axis=0))[0]
            anchor = [x + round(float((sole.min() + sole.max()) / 2), 2), y + bottom]
            if kind in SOLES:
                ax, ay = SOLES[kind][i]
                anchor = [x + ax, y + ay]
            cells.append((x, y, height, anchor))
        scale = target / cells[0][2]
        for i, (x, y, height, anchor) in enumerate(cells):
            spec = {'source': kind + '.png', 'crop': [x, y, x + 512, y + 512],
                    'alpha_threshold': 128, 'height': round(height * scale, 6),
                    'anchor': anchor, 'for': f'drawEnemy {kind} {POSES[i]}',
                    'selected_variant': SELECTED_VARIANTS.get(kind, '01'), 'reason': reason,
                    'height_class': height_class, 'outline_family': outline_family}
            if kind == 'spitter':
                spec['pivots'] = {'mouth': [x + MOUTH[i][0], y + MOUTH[i][1]]}
            picks[f'enemies/{kind}-{POSES[i]}'] = spec
    # Build all selections successfully before changing recipe ownership.
    write(RAW / 'picks.json', picks)
    for task in ['00-tooling', '01-enemies']:
        recipe = RAW.parent / task / 'picks.json'
        legacy = json.loads(recipe.read_text())
        remaining = {key: spec for key, spec in legacy.items() if key not in picks}
        if remaining != legacy:
            write(recipe, remaining)
    print(f'Selected {len(picks)} redesigned enemy frames; migrated legacy ownership.')


if __name__ == '__main__':
    run()
