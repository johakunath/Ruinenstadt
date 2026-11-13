# Potsdamer Platz / Mitte environment — v0.97

Eighteen generated paintings and explicit material/sculpture hooks; exact prompts/cuts and 64px preview in `assets/raw/codex/23-mitte-completion/`. Reproduce WebPs with `python3 tools/build_mitte_completion.py`.

## Bounded validation

`node tools/proof_mitte_completion.cjs`: Chromium 1280×800, DPR 2, seed 231113; eighteen images load, identical walls/structural footprints/rotations, hidden blessings, events, lights/neons and immediate next RNG on/off. Missing all images uses the complete original drawing with no new projected caches. Base/tunnel transitions cancel jobs and clear cache dimensions/bytes. The cached stage still calls its live pulse twice. Live smoke reaches play with HP 100; zero page errors. 486 manifest entries and all 667 offline SHELL paths exist. VERSION/CACHE both 0.98 (art measurements captured on candidate 0.97 before the concurrent cloud-save release).

Default/2× screenshots are actual map scenes; foreground buildings can obscure landmarks. Additional `*-isolated.png` images explicitly remove unrelated buildings for inspecting architecture. No collision is changed by these proof fixtures.

## Single software measurement pass

| Scene | Median off | Median on | Paired median change |
|---|---:|---:|---:|
| Mitte / Potsdamer stage | 15.818 ms | 17.614 ms | +9.677% |
| Alexanderplatz control | 13.184 ms | 13.222 ms | +1.153% |

Five alternating pairs per district in fresh contexts, 25 warm renders and 80 samples per state. Full synchronous render cost; **software raster, not hardware acceptance or a ≤5% pass**. Renderer: ANGLE Vulkan SwiftShader Device (Subzero). `results.json` retains every pair, `sp` (% >50ms), `mx` and allocation count. Mitte sp 5–6.25%, mx 340ms; control sp 5%, mx 283.8ms. All timed samples allocate zero canvases. No performance rerun/tuning; Claude owns deeper optimization and hardware/frame-pacing acceptance.

## Sources, bounds and overflow

Decoded WebPs: 5,183,776 bytes; material/sculpture canvases before stone derivative: 5,107,072. A narrow cropped derivative of the existing sandstone painting supplies plain column stone and is counted by `mitteAssetStats`. The hard 40,000,000-byte cap includes it and all projected canvases. Before final column normalization: 31/170 eligible parts cached at normal zoom, 15/170 at 2×. Final exact totals are in `final-column.json`; previous reports remain historical. The Potsdamer core gets priority. Overflow, including many station/rail pieces, retains original rendering. This is basic source/hook delivery, not every-part/every-zoom painted coverage.

The gate and station preserve passages, collision, fade groups and lights. The Quadriga's full painted height and canopy pole height are included in cache bounds. Stage speakers/equalizer pulse live above static art; civic window/roof seams and existing signs remain code detail. Water is a new painted static surface with stronger existing moving ripples, not an animation sheet. Trees/nature/neon sign sprite redesign remain separate.

## Retained fixture history

`initial-stage-fixture.json` failed before measurements because the stage animation check inherited 2× zoom after visual captures, where cache overflow is expected. The corrected fixture resets zoom/prepares caches. Before the single measured pass, core cache priority and complete canopy bounds were corrected, and canopy fabric was mapped onto the existing apex/rim triangles. No earlier timing samples were collected or discarded.

After measurements, the visual-only `proof_mitte_final.cjs` adds plain-stone column normalization, painted Reichstag glazing and isolated architecture inspection. A further narrow column crop avoids the adjacent facade aperture; `proof_mitte_column.cjs` refreshes only that target and current memory, without timings. These source/appearance refinements do not add gameplay or per-frame cache work. Detailed acceptance remains with Claude.

## Concurrent main merge

Main PR #51 shipped cloud/camp settings as v0.97 during asset production. Synced it intact and advanced this release to v0.98. Focused fresh-context smoke passes play/HP100, zero page errors and 18 ready images; external network requests were blocked and no cloud save/account was mutated. Existing `tools/test_sync.mjs` passes 8/8. Offline SHELL has 667 valid paths and the v0.98 cache key. No repeated art performance pass.
