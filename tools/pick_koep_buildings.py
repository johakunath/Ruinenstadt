#!/usr/bin/env python3
"""Write the approved, deterministic Köpenick building material selections."""
import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
TASK = ROOT / 'assets/raw/codex/02-buildings-koepenick'
OUT = TASK / 'picks.json'
sys.path.insert(0, str(ROOT / 'tools'))
import sprites


def main():
    # Johannes approved A and B as the common Altbau language, with C reserved
    # for selected ruins. Preserve all three selected modules for runtime use.
    picks = {}
    for variant, size, window in (
        ('a', 1536, ([200, 280], [562, 790])),
        ('b', 1536, ([240, 278], [530, 740])),
        ('c', 1774, ([248, 241], [672, 711])),
        ('platte', 1774, ([245, 225], [660, 650])),
    ):
        half = size // 2
        tl, br = window
        picks[f'buildings/koep-{variant}-window'] = {
            'source': f'{variant}-materials.png',
            'crop': [0, 0, half, 1024 if size == 1536 else 887],
            'height': 48,
            'pivots': {'apertureTL': tl, 'apertureBR': br},
            'for': f'drawBox Köpenick {variant} window-bay material; approved A/B mix and selective C use',
        }
        picks[f'buildings/koep-{variant}-wall'] = {
            'source': f'{variant}-materials.png',
            'crop': [half, 0, size, 1024 if size == 1536 else 887],
            'height': 48,
            'for': f'drawBox Köpenick {variant} blank-wall material; approved A/B mix and selective C use',
        }

    picks['buildings/koep-roof'] = {
        'source': 'roof-materials.png', 'crop': [0, 0, 724, 724],
        'height': 90, 'for': 'drawBox Köpenick Altbau roof material',
    }
    picks['buildings/koep-roof-ruin'] = {
        'source': 'roof-materials.png', 'crop': [1448, 0, 2172, 724],
        'height': 90, 'for': 'drawBox Köpenick collapsed roof/rubble material',
    }
    picks['buildings/koep-ivy'] = {
        'source': 'overlays-materials.png', 'crop': [0, 0, 768, 1024],
        'height': 100, 'alpha_threshold': 245,
        'for': 'drawBox Köpenick ivy overlay; source haze removed at alpha 245',
    }
    picks['buildings/koep-damage'] = {
        'source': 'overlays-materials.png', 'crop': [768, 0, 1536, 1024],
        'height': 48, 'alpha_threshold': 245,
        'for': 'drawBox Köpenick plaster/brick damage overlay; source haze removed at alpha 245',
    }
    picks['buildings/koep-shopfront'] = {
        'source': 'shop-materials.png', 'height': 60,
        'for': 'drawBox Köpenick Späti shopfront texture',
    }

    OUT.write_text(json.dumps(picks, indent=2, sort_keys=True, ensure_ascii=False) + '\n', encoding='utf-8')

    # Normalize only these new selections through the shared production code.
    # Running the repository-wide builder here would re-encode unrelated art.
    manifest = sprites.read_object(sprites.MANIFEST)
    for key, spec in picks.items():
        image, entry = sprites.normalise(key, spec, OUT)
        destination = ROOT / 'assets' / (key + '.webp')
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, 'WEBP', quality=88, method=6, exact=True)
        manifest[key] = entry
    sprites.write_json(sprites.MANIFEST, manifest)
    print(f'Wrote {len(picks)} approved selections and normalized their sprites.')


if __name__ == '__main__':
    main()
