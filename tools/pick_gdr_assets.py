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
    with Image.open(RAW / 'roof-overlays.png') as source:
        assert source.size == (1536, 1024), source.size
        alpha = np.asarray(source.convert('RGBA'))[:, :, 3]
    picks = {}
    for name, column, height in [('gdr-banner-blue', 0, 100),
                                 ('gdr-banner-red', 1, 100),
                                 ('gdr-mural-pioneer', 2, 80)]:
        x, y = column * 512, 512
        ys, xs = np.nonzero(alpha[y:y + 512, x:x + 512] > 128)
        if not len(xs):
            raise ValueError(f'{name}: empty source')
        picks['buildings/' + name] = {
            'source': 'roof-overlays.png', 'crop': [x, y, x + 512, y + 512],
            'alpha_threshold': 128, 'height': height,
            'anchor': [x + (int(xs.min()) + int(xs.max())) / 2, y + int(ys.max())],
            'for': 'drawGdrDecorations ' + name,
            'reason': 'User-requested Pioneer blue/yellow with explicit hammer-and-sickle identity',
        }
    (RAW / 'picks.json').write_text(json.dumps(picks, indent=2, sort_keys=True) + '\n')
    print(f'Selected {len(picks)} independent GDR identity assets.')


if __name__ == '__main__':
    run()
