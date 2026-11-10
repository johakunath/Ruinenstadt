#!/usr/bin/env python3
"""Select the approved weathered Zuckerbaecker facade/roof kit, then sprites.py."""
import json
from pathlib import Path

RAW = Path(__file__).resolve().parents[1] / 'assets/raw/codex/11-alexanderplatz-pioneer'


def run():
    recipe = RAW / 'picks.json'
    picks = json.loads(recipe.read_text()) if recipe.exists() else {}
    specs = {
        'facade-south': ('facades-weathered-study.png', [0, 0, 768, 1024], 160, 0),
        'facade-east': ('facades-weathered-study.png', [768, 0, 1536, 1024], 160, 0),
        'roof': ('roof-overlays-weathered-study.png', [0, 0, 512, 512], 90, 128),
        'ivy': ('roof-overlays-weathered-study.png', [512, 0, 1024, 512], 118, 245),
        'plaster': ('roof-overlays-weathered-study.png', [1024, 0, 1536, 512], 48, 245),
    }
    for name, (source, crop, height, threshold) in specs.items():
        picks['buildings/gdr-' + name] = {
            'source': source, 'crop': crop, 'height': height,
            'alpha_threshold': threshold, 'for': 'drawGdrBuilding ' + name,
            'reason': 'Approved Pioneer palette with cracked plaster, broken panes, rust and overgrowth; shared face kit preserves exact engine geometry',
        }
    recipe.write_text(json.dumps(picks, indent=2, sort_keys=True) + '\n')
    print('Selected five shared weathered building-kit images.')


if __name__ == '__main__':
    run()
