# Task 00 ghoul review

No variant has been selected yet. Do not create `picks.json` until Johannes
chooses A, B or C, as required by `pipeline/workflow.md` steps 3–5.

- `ghoul-variants.png`: original transparent image generation, 2026-11-09.
  References: `docs/style/koepenick.png` and `assets/portraits/E01.webp`.
  Three right-facing full-body ghouls with the same design and different torn
  Berlin jackets: A cobalt blue, B bottle green, C oxblood red.
- `comparison.png`: review sheet, one row of alternatives and a row at 64 px
  height. Each alternative is cropped from its third of the original image,
  trimmed to alpha > 40, resized with Lanczos, and composited on dark teal.

After the pick, generate the selected design's animation parts or frames
(idle, walk, attack, hit) before normalising and hooking `drawEnemy`.
The current image is a design comparison, not an animation sheet.

Tooling prepared in this change:

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

`assets/manifest.json` is deliberately empty pending selection. The prepared
`js/sprites.js` loader has been smoke-tested by injecting it into the page;
it is not yet referenced by `index.html` or the offline shell. Hooking those,
the version/cache bump and the release backlog entry belong to the completed
ghoul integration.
