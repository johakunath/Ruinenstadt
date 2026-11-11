# Köpenick building kit proof

**Merged v0.71; desktop performance accepted.** The original seven-pair
measurements below are historical and superseded by the 21-pair Windows GPU
pass recorded at the end of this file. Its null-control CI also meets the
corrected ±5% noise check. PRs #29/#30 are merged; tablet acceptance is deferred.

Johannes selected A as the common cream Altbau, B as an occasional teal/ochre
variant, and C for selected ruins on 2026-11-10. The thirteen selected
materials also cover slab blocks and the Späti exterior. Other districts,
gabled houses and landmarks retain their existing drawings.

## Reproduction

Image tools: follow `tools/requirements-assets.txt` and the Windows setup in
`pipeline/workflow.md`. Browser tools: `tools/browser-setup.md`.

```powershell
.venv/Scripts/python.exe tools/pick_koep_buildings.py
.venv/Scripts/python.exe tools/sprites.py --check
.venv/Scripts/python.exe -m unittest discover -s tools -p test_sprites.py
node --test tools/test_sprites.mjs tools/test_hero.mjs tools/test_enemies.mjs tools/test_gdr_buildings.mjs tools/test_gdr_geometry.mjs tools/test_gdr_shadows.mjs tools/test_koep_buildings.mjs
```

Serve the repo with `python -m http.server 8765`. In another PowerShell:

```powershell
$env:NODE_PATH = (Resolve-Path .tools-browser/node_modules).Path
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:KOEP_PROOF_PORT = '8765'
$env:KOEP_PROOF_OUT = 'pipeline/proof/02-buildings-koepenick/draft'
node tools/proof_koep_buildings.cjs
node tools/proof_koep_cache.cjs
```

The browser and HTTP server must be able to access the same localhost
network. This session used port 8766, with both processes outside the
restricted network sandbox. Set `KOEP_PROOF_PORT` to match the server.

## Evidence boundary

`draft/` contains the combined run (failed performance), visual/contact
captures and separate fallback/offline evidence. Results include source
hashes; verify those before reusing measurements after changes. Other local
subfolders are ignored development attempts, not accepted delivery evidence.

`draft/cache-pixels.json` compares the live texture-kit composition and the
actual projected cache at three pixels per screen unit for Altbau and ruins
at 0/+0.6/-0.6 rotations. A zero-difference result establishes source-resolution
equivalence for those fixtures, not universal equality at every viewport or
fractional display scale.

The runtime derives a projected cache from the selected flat materials at
each building's actual rotation. This is method A, not an independently
painted fixed-view building. The original canvas sprite remains intact for
loading/failure fallback. Queued cache construction, priority and eviction
keep task textures and derived canvases below 40,000,000 bytes. Window
apertures, candle pixels, entrance lanes and ruin cutouts retain the legacy
positions. Semantic tests freeze generation RNG, lights and fallback drawings.

**Performance gate (updated 2026-11-10).** `draft/` timing used seven unpaired
batches after the visual run and cannot resolve 5% (baseline 2.14 to 2.68 ms,
paired deltas -21.8% to +12.6%). It is superseded by `tools/perf_koep.cjs`:
fresh browser context, 21 alternating pairs at 1280×800 DPR 2 (Tab S9 class),
median paired on/off ratio with seeded bootstrap 95% CI, GPU renderer
recorded. Results go to `perf/`. Only a hardware-GPU run counts; procedure in
`.claude/skills/asset-perf-gate/SKILL.md`. Caches now bake at
`koepScale()` = min(3, DPR×Z), so `cache-pixels.json` compares at that scale.

Performance evidence compares the same seeded full scenes with the painted
hook enabled and disabled. It measures desktop render script time; it does
not establish Tab S9 temperature, battery use or device frame rate. Johannes
deferred that hardware check.

**Performance gate result (2026-11-11, Windows PC): pass.**

| District | Off ms | On ms | Paired median | 95% CI | Verdict |
|---|---|---|---|---|---|
| Köpenick | 2.170 | 2.052 | -6.51% | -8.22% … -2.26% | pass |
| Alexanderplatz (null control) | 2.955 | 2.939 | -0.74% | -4.73% … 1.30% | pass |

GPU: ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11), hardware raster. 1280×800 @ DPR 2, 21 pairs, commit 0dc5f4b, Windows 11, power mode "Höchstleistung", headless Chrome via Playwright 1.65.0. Raw data: `perf/perf-2026-11-10T23-39-22-523Z.json`.
The Köpenick CI upper bound (-2.26%) is below the +5% limit; the null control stays within ±5%. No rerun at 41 pairs was needed. This measures desktop render script time, not Tab S9 heat or battery.


Review follow-up v0.72 (2026-11-11): 58 semantic checks pass; the actual
2560×1440/DPR2 overflow reproduction stays at 18 caches and 39,841,412 bytes,
without continuing evictions. `tools/proof_koep_overflow.cjs` reproduces it.
Fresh RTX 4070 gate, 21 pairs at 1280×800/DPR2: Koepenick -2.85%
(CI -5.25 to +2.25), Alexanderplatz +2.27% (CI -1.32 to +4.77); pass.
Raw data: `perf/perf-2026-11-11T06-26-54-510Z.json`.
