# Task 00 ghoul review

Johannes selected **B (bottle green)** on 2026-11-09. He also delegated future
colour-only choices to Codex; see `pipeline/workflow.md` step 4.

- `ghoul-variants.png`: original transparent image generation, 2026-11-09.
  References: `docs/style/koepenick.png` and `assets/portraits/E01.webp`.
  Three right-facing full-body ghouls with the same design and different torn
  Berlin jackets: A cobalt blue, B bottle green, C oxblood red.
- `comparison.png`: review sheet, one row of alternatives and a row at 64 px
  height. Each alternative is cropped from its third of the original image,
  trimmed to alpha > 40, resized with Lanczos, and composited on dark teal.

- `ghoul-b-frames.png`: generated animation sheet based on B, 3 columns × 2
  rows: idle, walk A, walk B, wind-up/recovery, bite contact, hit recoil.
- `picks.json`: selected frame crops and measured foot anchors in source
  coordinates. Every pose shares the idle frame's source scale (463 px =
  36.5 local drawing units); the crouched bite is shorter, not stretched.

Tooling:

```sh
python3 tools/sprites.py        # normalise all approved */picks.json selections
python3 tools/sprites.py --check
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools -p 'test_*.py'
node tools/test_sprites.mjs
```

The `tools/sprites.py` module docstring documents the selection format, crop,
anchor and pivot coordinates. Transparent sources preserve alpha; opaque
sources can specify a border colour and tolerance. Game outputs use 3 px per
world unit, WebP quality 88 and 1 px transparent padding.

`assets/manifest.json` contains the six normalised frames. `js/sprites.js`
is loaded before `js/art.js`; the loader, manifest and frames are in the
offline shell. Proof screenshots and validation results live in
`pipeline/proof/00-tooling/`.
