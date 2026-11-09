# Task 07 proof · v0.61

The H02a survivor and H03–H07 costume identities are retained as layer
art, rather than new design alternatives. `assets/raw/codex/07-player-rig-v2/`
holds the component sheets, explicit source weapon pivots, and colour comparison.
Codex chose charcoal mannequin A and cobalt Blaumann A under the delegated
colour-only rule. The other new equipment follows the existing code/item look.

`outfits-{large,game}.png` shows all fourteen looks in idle, mid-step and
mid-swing. `weapons-{large,game}.png` covers all twenty-six weapons, and
`wearables-{large,game}.png` covers six hats, four gloves and three boots,
in the same three poses. Large cells have enough room to retain weapon tips.
`inventory-smoke.png` is the actual inventory UI: Blaumann, Strohhut,
Gartenhandschuhe, Gummistiefel and Rohrspeer. Its `drawDoll` called the painted
renderer successfully; the test records caught errors as well as page errors.

`*-{1,2}x-debug-hit.png` uses each district and the S3 tunnel, the default
zoom and twice that zoom, a 960 × 640 viewport and DPR 2. The candidate search
requires clear ground and rejects tall-building occlusion. The player is at
the middle of a blade swing facing the centre of the green attack sector.
The pink ring is the existing player collision radius. As specified by the
contract, the weapon is held above the ground-plane sector; its horizontal
extent is the relevant comparison. No collision radius or attack range changed.

`results.json` contains schema/coverage assertions, image-load failures,
inventory results and browser errors. `missing-file-fallback.png` deliberately
intercepts a required outfit image with HTTP 404 in a fresh browser context,
checks that `drawHero` returns false, and verifies visible canvas figure pixels.
`offline-reload.json` comes from a separate service-worker context on
`localhost` (the game's boot code skips worker registration on `127.0.0.1`).
It reloads with the network disabled, starts a run, waits 3 seconds and checks
all 130 rig parts, play state and errors.

`performance.json` compares the unchanged v0.60 worktree at commit `a94f7f1`
with v0.61, using the same seeded map, camera and stationary player in Köpenick
and Mitte. Seven pairs alternate measurement order; each warms fifteen
renders and times fifty complete render calls. The browser runs alone during
this measurement. Static base/clothing combinations are cached at rig
resolution, while shoulders, elbows, walking and weapon rotation remain live.
Median of sample medians: Köpenick 50.8 → 50.3 ms; Mitte 45.1 → 45.3 ms.
The 0.2 ms Mitte difference is within the observed paired timing spread; there
is no material frame-time regression in this desktop run. These are headless
desktop measurements; Tab S9 playtesting remains Johannes's hardware check.

Reproduce with Playwright, Chromium, Python, Pillow and numpy installed:

```sh
python3 tools/build_hero.py
python3 tools/build_hero.py --check
python3 tools/check_weapon_pivots.py
python3 -m unittest discover -s tools -p 'test_*.py'
node --test tools/test_hero.mjs tools/test_sprites.mjs
python3 -m http.server 8765
# in another terminal
node tools/proof_hero.cjs
# Serve an unchanged v0.60 worktree on 8766, then run alone:
node tools/perf_hero.cjs
```

The game has no build step or runtime dependencies. Rerunning the builder
produces byte-identical WebPs, manifest and generated JS. All 285 service-worker
shell paths exist, including all v2 components and weapon copies.
