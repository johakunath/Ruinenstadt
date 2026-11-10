# Köpenick building kit proof

**Draft, performance acceptance unresolved.** The final combined browser run
passed all 60 visual/contact fixtures but failed the 5% timing limit on
Köpenick (+9.68%). An isolated run of the same runtime passed (+0.90% Köpenick,
-3.67% Alexanderplatz); this does not override the combined failure. Three
optimization approaches have been tried. Preserve the work for review, do
not ship it or claim the task complete. Independent asset work can continue.

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

Performance evidence compares the same seeded full scenes with the painted
hook enabled and disabled. It measures desktop render script time; it does
not establish Tab S9 temperature, battery use or device frame rate. Johannes
deferred that hardware check.
