# Player animation step 1 (v0.73 draft)

Resumed the preserved local draft on top of `ade3477` (PR 29/30 review fixes).
No new paint: twelve lossless knee derivatives from existing leg/trouser
layers, four source pixels of overlap, shared knee pivots for all 14 outfits.
The 26 weapon grip/tip pivots and arm lengths remain unchanged.

- `walk-comparison.gif`: baseline v0.72 left, step 1 right; three outfits and blade, hammer, spear.
- `all-outfits-1x.png` / `all-outfits-2x.png`: all outfits and three boot types.
- `hit-*.png`: actual renderer/debug hit areas at default and 2x zoom, three weapons.
- `inventory.png`: shared inventory doll.
- `validation.json`: 3 s play, joint probe, HTTP404/full fallback, inventory, offline reload; no page errors or unexpected failed requests. Grip drift <0.837 local units. Textures plus cached layers: 6,507,432 bytes.
- `perf/`: timestamped paired GPU gate results, retained regardless of verdict. The earlier local draft's seven-pair timing is not acceptance evidence.

Serve the repository on 8765; configure Playwright/Chrome per
`tools/browser-setup.md`. Run `node tools/proof_player_animation.cjs`,
`node tools/perf_player_animation.cjs`, `node --test tools/test_hero.mjs
tools/test_player_animation.mjs`, `.venv/Scripts/python.exe tools/build_hero.py
--check` and `.venv/Scripts/python.exe tools/check_weapon_pivots.py`.
`--animation-only` is byte-idempotent for generated layers and metadata.

The gate uses fresh context, 21 alternating on/off pairs per district,
100 warmup + 300 timed full renders, 40 enemies, 1280×800 DPR2, paired median
and seeded bootstrap 95% CI. Both districts test actual old/new player draws;
an additional old/old Alexanderplatz null control must stay within ±5%.
Software raster never passes; any timed canvas allocation is an error.
Rerun an inconclusive result with `ANIM_PERF_PAIRS=41` and retain both reports.

Only step 1 is delivered. Extra views and secondary spring motion remain
separate steps. Human movement acceptance and tablet heat/performance are open.

## GPU result (2026-11-11)

RTX 4070, hardware raster, 21 pairs, 1280×800 DPR2. Baseline `ade3477`.

| Scene | Median change | 95% CI | Verdict |
|---|---|---|---|
| Köpenick | 2.02% | 0.08% to 4.09% | pass |
| Alexanderplatz | -0.16% | -1.23% to 0.47% | pass |
| Alexanderplatz null control | 0.00% | -1.71% to 1.44% | pass |

Overall: pass. Zero timed canvas allocations and no page errors.
Raw file: `perf/perf-2026-11-11T06-36-05-887Z.json`. A preliminary run was interrupted before a
verdict to preserve the current camp cache-reset hook while integrating the
older draft; it is not performance evidence.
