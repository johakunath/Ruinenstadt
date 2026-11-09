# 00 Tooling and first sprite end to end

Status: open

Goal: the pipeline works once from raw image to game, with the ghoul as test object.

| Step | Output |
|---|---|
| Normaliser | `tools/sprites.py`: takes picked raw images from `assets/raw/codex/<task>/`, removes the background, trims, scales to 3 px per unit, writes `assets/<group>/<name>.webp`, fills or updates the entry in `assets/manifest.json`. Re-running gives the same files |
| Checker | Same script with `--check`: every manifest entry has a file, sizes match, alpha present, anchor inside the image, no file over 400 KB |
| Loader | Small JS (new file `js/sprites.js` before `js/art.js`, or inside `js/art.js`): reads the manifest once at boot, `spr(key)` returns the loaded image or null. Reuse the `himg()` idea from the player rig |
| Ghoul | Painted ghoul (style bible, Köpenick board; zombies gaunt, grey-green skin, torn Berlin clothes). Upright, facing right, parts or frames per `contract.md`. Hooked into `drawEnemy` for `type==='ghoul'`, canvas fallback kept |
| Proof | Screenshots: ghoul group in Köpenick at default zoom and 2x, plus `?debug=hit` showing feet and body on the ring and the bite reaching the player ring |

Acceptance: definition of done in `pipeline/workflow.md`.
