# Xhain environment v0.95 — basic asset handoff

One bounded browser workflow, Chromium 1280×800, DPR 2, seed 231113.
Command: `node tools/proof_xhain_completion.cjs` with the repository served
on port 8767. Commit base: `ff6eb49` (merged Köpenick PR #49).

- Twelve new WebPs decode. Scene captures at default and 2× zoom cover the
  bridge, Berghain, Ostbahnhof, gallery, elevated rail and working station.
  Actual placement is retained: foreground blocks obscure much of Ostbahnhof.
- Identical walls, structural footprints/rotation, hidden blessings, wave
  events, lights, neons and constructor next-RNG with art on/off.
- Deliberately missing images use the original drawing with zero new caches.
- Base and tunnel constructors release all departed projected canvases and
  reduce their accounted bytes to zero. Pending jobs are cancelled.
- Live run smoke reaches `play`, HP 100; zero page errors throughout.
- All 632 offline SHELL paths exist; new script and 12 images are included.
  This checks shell completeness, not an additional offline browser reload.

## Single measurement pass

GPU: `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)
(0x0000C0DE)), SwiftShader driver)`. **Software raster, no hardware acceptance
or GPU gate pass claimed.** Five alternating on/off pairs per district, fresh
browser context per pair, 25 warm renders then 80 samples per state. Timing
is synchronous full `render()` cost, not real-device presented frame pacing.
No performance rerun/tuning after measurements.

| Scene | Median off | Median on | Median paired change |
|---|---:|---:|---:|
| Xhain, Oberbaumbrücke | 15.24 ms | 14.87 ms | −1.76% |
| Alexanderplatz null control | 14.83 ms | 14.61 ms | −1.50% |

Xhain timed renders allocate zero `cnv` canvases. Control reports five in
total; no claim that unrelated existing drawing is allocation-free. Raw pair
means, share over 50 ms (`sp`) and longest render (`mx`) are in `results.json`:
Xhain sp 3.75–10%, mx 435.5 ms; control sp 6.25%, mx 245.8 ms. Software spikes
and build-time warmup are not tablet results. Map/build timing includes art
preparation and is retained per scene; optimize/accept with Claude later.

## Memory and remaining work

Decoded task images: **3,195,072 bytes**; cropped source canvases:
**3,145,728 bytes**. Normal proof scale projected caches:
**33,651,500 bytes**, task total **39,992,300 bytes**. At 2×:
**33,535,980 bytes** projected, **39,876,780 bytes** total. Both are below
40,000,000. Source/pattern contexts are shared; this is not total-game memory.

The cap retains original drawings on overflow: **133/152** eligible parts
cached normally, **77/152** at 2×. Named landmarks, murals and station walls
are prioritized. Remaining railway parts need Claude's cache residency/
coverage optimization. All sources and hooks are supplied; complete painted
coverage at every zoom is not claimed. Nature and rolling-stock redesign
remain separate. No broader regression or hardware pass was performed.

## Retained fixture failures

`initial-render-rng.json` and `initial-async-rng.json` compare RNG too late.
Call-stack auditing identified existing asynchronous audio sample generation
(`audio.js` → `fxRender`) consuming global RNG during scheduled waits.
The final fixture compares immediately after construction and records later
wait traces separately; no audio/gameplay changes were made.

`initial-station-fixture.json` retains the partial visual run where an
undefined station draw selector accidentally matched an ordinary building.
Repeated audio stacks are losslessly summarized as stack → count. Target
selection is corrected. These failures occurred before timing samples.
Cache bounding padding was tightened before the measured pass; initial
coverage counts are historical. Final `results.json` is the sole measurement
run and passes; no earlier timings were discarded.
