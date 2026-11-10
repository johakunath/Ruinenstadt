# Enemy redesign, batch 1 · v0.66

Thirty replacement frames: Ghul, Speier, Zünder, Heuler and Raser, six poses
each. Task 01b continues with Schildträger, Brigadeghul and Schrottkoloss;
this batch does not mark the whole task done.

The four family style canvases are in `assets/raw/codex/01b-enemy-redesign/`.
The first batch selects concept 01 in each Köpenick row: crooked long arms,
balloon throat, spherical boiler, arched trumpet neck and horizontal skeletal
runner. `picks.json` records each selection and reason. These shape choices
use the autonomous-run authorization in `pipeline/workflow.md`.

`silhouettes-before.png` and `silhouettes-current.png` show all sixteen idle
masks at 64 px, with independently authored height/outline classifications.
The baseline has seven conflicting pairs; the first batch resolves those
pairs. This classification is a visual design gate, not a pixel classifier.
`silhouettes-thumbnails.png` extracts all 25 black concept thumbnails from
the Köpenick canvas, so the alternatives remain reviewable.

`comparison.png` compares the old and new paintings, outlines and game scale.
`gallery-*-{1,2}x.png` shows six poses and both facings. Forty district/tunnel
screenshots cover default and 2x zoom with the actual hitbox overlay.
`behavior-contacts.png` places the player at `r + P.r`; the shield, crow,
projectile-origin and district-boss checks reuse the real renderer/physics.

Initial source stances were too wide, particularly Ghul. The accepted sources
cluster the feet under the torso; rejected wide-stance sheets remain in raw
history. One shared source scale per family preserves pose motion. Source
alpha <=128 is discarded to remove generation haze. Mouth coordinates are
authored explicitly and follow the existing animation transform. Combat
radii, attacks, shield arc and projectile physics are unchanged. Only the
five authored height values in `ENEMY_ART` change, keeping bars/stun art at
the new head heights; no renderer algorithm changes.

Recipe ownership moves from the original recipes to task 01b. The legacy
selector skips keys already owned by the redesign, so rerunning it cannot
overwrite the new designs or create duplicate selections. The normalizer
retains all existing manifest keys and runtime paths. No new shell paths
are needed; VERSION/CACHE advance together to 0.66.

Reproduce (Pillow, numpy, Node, Playwright, Chromium):

```sh
python3 tools/pick_enemy_redesign.py
python3 tools/pick_enemies.py
python3 tools/sprites.py
python3 tools/sprites.py --check
python3 -m unittest discover -s tools -p 'test_*.py'
node tools/test_enemies.mjs
node tools/test_sprites.mjs
node tools/test_hero.mjs
python3 tools/silhouette_sheet.py --picks pipeline/proof/01b-enemy-redesign/silhouette-classes-current.json
python3 tools/compare_enemy_redesign.py
# Serve unchanged v0.65 on 8765 and this checkout on 8767:
ENEMY_PROOF_OUT=pipeline/proof/01b-enemy-redesign ENEMY_PERF_DISTRICTS=0,2,3 node tools/proof_enemies.cjs
```

`results.json` records page errors, normal image failures, required-image
HTTP404 fallback, and a fully offline reload decoding all 97 enemy assets.
`performance.json` compares seeded forty-enemy full renders with v0.65 on
Köpenick, Alexanderplatz and Mitte, alternating sample order. Measurements
are headless desktop results; Tab S9 thermal/battery validation remains open.
The task's decoded-image budget is calculated as sum(width * height * 4),
and is recorded in the handover log together with the final timing table.

Final timings (before / after ms): Köpenick 54.1 / 53.4, Alexanderplatz 43.8 / 43.6, Mitte 52.6 / 49.1. Thirty new frames decode to 1,027,536 bytes.
