# Task 00 proof · v0.60

Selected design: ghoul B, bottle green (Johannes, 2026-11-09).

Screenshots use Chromium, a 960 × 640 CSS viewport and device pixel ratio 2.
`*-default.png` uses the game's default zoom of 1.185; `*-2x.png` uses twice
that zoom. A seeded map and manually placed group make the art easy to inspect.
The screenshots show Köpenick, Xhain, Mitte, Tempelhof, Spandau, Marzahn and
the S3 tunnel. Alexanderplatz is included as a regression check: its existing
canvas Brigadeghul remains in place pending task 01.

- `hit-bite.png`: `?debug=hit`, contact at world distance 23 (the existing
  threshold is `e.r + P.r + 2 = 24`). Soles stand in the yellow ring; the
  lunging head/hands reach the player at the pink ring. The green area is the
  player's existing melee sector, not an enemy attack telegraph.
- `hit-recoil.png`: painted recoil pose and cached white damage flash.
- `results.json`: no page errors or failed local requests; three paired
  render-time samples for Köpenick and Mitte.
- `fallback-offline.json`: actual idle file renamed temporarily; game kept
  running with the canvas fallback. File restored in `finally`. Separate
  service-worker context reloaded fully offline and decoded all six frames.

Performance compares the original `drawEnemy` from base commit `3f947c8` with
the painted renderer in the same seeded scene with 40 ghouls. Each sample
warms up ten renders and times 50 full `render()` calls. Median of sample
medians: Köpenick 33.9 → 31.6 ms, Mitte 53.2 → 51.2 ms. This is a headless
desktop comparison; Tab S9 playtesting remains Johannes's step.

Reproduce with Playwright and Chromium installed:

```sh
python3 -m http.server 8765
# in another terminal:
node tools/proof_ghoul.cjs
node tools/check_ghoul_offline.cjs
```

Set `CHROMIUM_PATH` if Chromium is not at `/usr/bin/chromium`. These scripts
are development checks; the game still has no build step or dependencies.
