#!/usr/bin/env python3
"""Select the user-requested Pioneer banners and mural; run then sprites.py.

These are independent wall decorations. The generic building method remains
a separate A/B proof. Crops and alpha threshold remove atlas gaps/haze; source
images and the actual hammer-and-sickle designs remain unmodified.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/11-alexanderplatz-pioneer'


def run():
    with Image.open(RAW / 'roof-overlays-weathered-study.png') as source:
        assert source.size == (1536, 1024), source.size
        alpha = np.asarray(source.convert('RGBA'))[:, :, 3]
    recipe = RAW / 'picks.json'
    picks = json.loads(recipe.read_text()) if recipe.exists() else {}
    for name, crop, height in [('gdr-banner-blue', (136, 520, 392, 1018), 100),
                               ('gdr-banner-red', (630, 520, 914, 1005), 100),
                               ('gdr-mural-pioneer', (1048, 520, 1520, 1016), 80)]:
        x, y, x2, y2 = crop
        ys, xs = np.nonzero(alpha[y:y2, x:x2] > 180)
        if not len(xs):
            raise ValueError(f'{name}: empty source')
        picks['buildings/' + name] = {
            'source': 'roof-overlays-weathered-study.png', 'crop': list(crop),
            'alpha_threshold': 180, 'height': height,
            'anchor': [x + (int(xs.min()) + int(xs.max())) / 2, y + int(ys.max())],
            'for': 'drawGdrDecorations ' + name,
            'reason': 'Weathered Pioneer art with clear crossed hammer-and-sickle identity',
        }
    (RAW / 'picks.json').write_text(json.dumps(picks, indent=2, sort_keys=True) + '\n')
    print('Selected three independent weathered GDR identity assets.')


if __name__ == '__main__':
    run()
