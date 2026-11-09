# Task 01 proof · v0.64

Fifteen selected enemy variants add 90 frames plus one directional shield
panel. Together with the existing ghoul this is 16 families, 96 frames and a
panel. E02–E10/E13/E14 portraits remain the approved designs; Uhrwerkläufer,
Wurzler, Kernspeier and Brigadeghul follow the existing Alexanderplatz code and
board. Raw source sheets and explicit source-coordinate crops, anchors and
mouth pivots are in `assets/raw/codex/01-enemies/`.

`tools/pick_enemies.py` keeps one source scale across each family's six poses;
lunges and recoil are not stretched to idle height. A solid-sole strip centres
feet; crows anchor at the torso and receive their flight height in code.
`alpha_threshold: 16` removes faint generation noise while preserving the old
normalizer default. Rerunning the recipe and normalizer is byte-identical for
all 98 enemy image/manifest files. Every image has alpha and is under 400 KB.

The release integrates the v0.63 lighting, VFX, pack steering and generic
animation driver. Frames live in the generic driver, with explicit family
reference radii to retain 3 source pixels per authored world unit, plus the
existing pose fallback. Painted pose motion uses `life: .45` to complement
baked poses without a second large lunge. The separate shield follows the
existing screen-converted `e.fa`; its block arc and open-guard damage are
unchanged. Ordinary Schrottkoloss is painted; district bosses remain canvas
until task 06.

`gallery-*-{1,2}x.png`: all sixteen families, six poses, both facings, with
projected yellow collision rings. Post-spawn snapshots avoid the spawn-pop
zero scale. Cells leave room for the upstream cast shadows and all limbs.
Forty `*-debug-hit.png` files cover seven districts and the S3 tunnel at default
zoom and 2x, in batches of four enemies on clear ground.

`behavior-contacts.png` shows the player and enemy at the existing `r + P.r`
contact distance. `behavior-shield.png` covers four directions and open guard.
`behavior-crow.png` isolates the flying body above its ground ring. The action
shot includes a charger telegraph, a glob leaving the visible mouth, a diving
crow, an elite label/health bar, and the game HUD.

The browser checks actual `hit()` damage either side of the 1.2-radian block
arc. Mouth checks compare a transformed source pivot to the browser canvas
matrix used by the real `drawEnemy`, including `enemyLife`; the first projectile
pixel matches that point for both facings. Collision x/y, velocity, radius,
damage and lifetime stay unchanged. Visual core and trail launch offsets ease
to the existing ground-plane path over 0.18 s.

A required idle frame deliberately returns HTTP 404 in a fresh context; the
canvas body remains visible. Offline proof uses `localhost` (boot skips worker
registration on `127.0.0.1`), reloads with networking disabled, starts a run,
waits 3 seconds and decodes all 97 enemy assets. All 378 shell paths exist.
`results.json` records these checks, image loads and page errors.

`performance.json` compares the unchanged production v0.63 checkout against
v0.64: identical seeded Köpenick/Mitte maps, camera, viewport, DPR and forty
mixed enemies. Seven pairs alternate order, with fifteen warmups and fifty
timed full renders per sample; other proof browsers are closed first. These
are headless desktop measurements. Median results: Köpenick: 55.3 → 53.2 ms (-3.8%); Mitte: 56.0 → 53.4 ms (-4.6%). Tab S9 hardware playtesting remains open.

Reproduce with Python/Pillow/numpy, Node, Playwright and Chromium installed:

```sh
python3 tools/pick_enemies.py
python3 tools/sprites.py
python3 tools/sprites.py --check
python3 -m unittest discover -s tools -p 'test_*.py'
node tools/test_enemies.mjs
node tools/test_sprites.mjs
node tools/test_hero.mjs
python3 -m http.server 8767 --bind 127.0.0.1
# Another terminal, baseline v0.63 served on 8765:
node tools/proof_enemies.cjs
```

`ENEMY_PROOF_PHASE=visual` or `perf` isolates a phase. The game still has no
build step or runtime dependencies.
