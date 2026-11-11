# Shared assets and vehicle refinement · v0.77 candidate

Current candidate includes shared props/fire, continuously rotated painted
vehicles and the requested shrine refinement. Merged online-save PR #33 is
preserved. Baseline for the final gate: `f7152d9e85ef6cbabc71d67eedd0d37c081deffd`
(v0.76); original PR #32-only props proof is historical.

## Visual and semantic proof

- `redesigned-vehicles.png`: actual runtime cream Trabi, windowed Barkas and
  partly burned red sedan, both axes, enlarged 3×. Raw generation and complete
  prompt set are in `assets/raw/codex/03-vehicles/refinement/` (built-in imagegen).
- `all-variants-*`: all eight colour/damage variants on both axes, 1×/2×.
- `checker-*` and `painted-*`: all five vehicle kinds, both axes, eleven actual
  angles (0, ±22.5, around/exactly ±45 and ±48.44 degrees), at 1× and 2×.
  P3 world coordinates independently checked; wheel sides switch beyond 45°.
- `district-*`: seven districts, default/2×; `visual.json` has exact equal
  seeded baseline wall arrays (945/923/887/1047/165/642/223) and tangent walks.
- Full HTTP404 fallback draws legacy geometry, zero projected cache bytes;
  installed service-worker offline v0.77 decodes all 42 vehicle faces and starts
  play. No page errors or unexpected image failures. Online sync is disabled
  by its existing local-host guard; this proof sends no telemetry.
- `shrine.json`: actual update grants 60 seconds, then 59 after one second;
  used flag and removed light/aura persist. `shrine-unused.png` and
  `shrine-consumed.png` show the state change. No buff-selection changes.
- 73 JS tests plus prop assertions and 6 Python tests pass on the integrated
  candidate. 313 manifest entries.
  The full vehicle builder is byte-idempotent. Final memory: vehicle source
  3,732,900 bytes plus bounded projected caches (total ≤40 MB); props source
  1,013,788 + one 65,536-byte shared glow = 1,079,324 bytes. Files <40 KB for
  vehicle faces. Warm vehicles require one drawImage, zero allocation.

## Reproduce

Use the repo Python with Pillow/numpy and Playwright setup from
`tools/browser-setup.md`. Root archive served on 8765 at
`.tools-browser/assets-baseline-v076/`; current checkout served on 8766. The
larger HTTP listen backlog avoids local image-request refusals.

```
python -X utf8 tools/build_vehicles.py
python -X utf8 tools/sprites.py --check
node --test tools/test_vehicles.mjs
node tools/test_props.cjs
node tools/proof_vehicle_refinement.cjs
node tools/proof_vehicles.cjs
node tools/perf_assets.cjs
```

## Final combined GPU gate

Passed on hardware RTX 4070, zero timed canvas allocations and no page errors.

| Scene | Paired median | 95% CI | Result |
|---|---:|---|---|
| Köpenick | -15.42% | -17.16% to -13.89% | pass |
| Alexanderplatz | -9.28% | -9.76% to -6.92% | pass |
| Null control | -2.51% | -4.04% to -1.17% | pass |

Final report: `perf/perf-2026-11-11T12-46-36-859Z.json`. All recorded runtime/image hashes match the final candidate.
The earlier `perf-2026-11-11T08-42-27-468Z.json` also passed but predates final
draw-allocation cleanup and the stronger cream van palette; it is retained as history.

The gate measures full render against v0.76, both Köpenick and
Alexanderplatz, with all-prop/10-fire fixtures, all five vehicle families on
both axes and 40 enemies. Each of 21 alternating pairs gets two fresh browser
contexts; 100 warmup + 300 timed frames, 1280×800 DPR2. A separate pair of
baseline contexts supplies the Alexanderplatz null control. Paired median
with seeded bootstrap 95% CI; upper bound must be ≤+5%, null CI inside ±5%.
Rerun 41 pairs if inconclusive; retain every report. No visual/test workloads
overlap timing. Physical Tab S9 heat/battery and human feel remain deferred.

## Deferred

Building-light occlusion is deliberately unchanged, explicitly assigned to
Claude at the top of BACKLOG. Equipment/nature remain separate open tasks.
Publication/review pending.
