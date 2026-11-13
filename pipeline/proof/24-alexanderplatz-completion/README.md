# Alexanderplatz environment — v0.96

One source/style canvas, one 4×3 material atlas and three alpha-separated upright landmarks. Reproduce with `python3 tools/build_alex_completion.py`. Sources/cuts and 64px row are in `assets/raw/codex/22-alexanderplatz-completion/`.

## Validation

`node tools/proof_alex_completion.cjs` ran one combined visual/smoke/software comparison. All 15 images load, unchanged walls/building footprints, hidden blessings, events, light emitters and next gameplay RNG on/off; zero page errors. Missing all fifteen images retains complete fallback. Base and tunnel transitions clear cache bytes and dimensions. Timed render samples allocate no canvases. `python3 tools/sprites.py --check`: 468 sprites. Offline shell: 648 existing paths. VERSION/CACHE both 0.96.

| Software sample | Off ms | On ms | Paired median |
|---|---:|---:|---:|
| Alexanderplatz | 14.205 | 15.870 | +10.913% |
| Köpenick control | 13.319 | 13.541 | +0.676% |

Five alternating pairs per district; raw `sp` (% >50 ms), `mx` and allocation counts are retained in `results.json`. Renderer: ANGLE Vulkan SwiftShader Device (Subzero), software raster. **Not a hardware acceptance or ≤5% pass claim.** No performance rerun or tuning loop; Claude owns deeper optimization/hardware acceptance. Existing tablet acceptance remains historical, not evidence for these new caches.

Decoded WebPs: 5,198,248 bytes; cropped shared canvases: 5,129,216 bytes. Final normal-zoom projected caches: 29,634,524 bytes; total 39,961,988. At 2×: 29,663,028 cache / 39,990,492 total. Original global/GDR sources are outside this task total. Hard cap 40,000,000. Of 169 eligible parts, 55 fit normally and 16 at 2×; remaining parts use the original renderer. Named buildings precede repeating rail parts; no claim that all parts are painted simultaneously.

## Visual corrections and follow-ups

After the measured pass, moved plaza paint before fountains/scenery so water and rims remain visible; extended Rathaus flag/Zucker tower cache bounds; replaced lazy market-goods RNG with a coordinate-based color selection. Final checks/screenshots use `AX_VISUAL_ONLY=1` and skip measurements. Initial visual refresh camera snapped to the displaced player; corrected fixture camera/player distance and froze camera time for the final screenshots. Geometry and transition checks still pass. Initial audio preload randomness is separately identified in retained stack counts; later map bakes consume no gameplay RNG.

Screenshots show each selected target at default zoom and 2× on the actual generated map. The tall Fernsehturm naturally extends beyond the normal gameplay viewport. Nature remains task 04. Water uses a new painted static surface with the existing brighter/thicker procedural ripple animation; no new animation sheet. Small code window details, dome seams and signs remain over the painted faces.

User authorizes merge after completed Codex review/checks, then Potsdamer Platz/Mitte.
