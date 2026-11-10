# One GDR Zuckerbäcker: method A / B proof draft

**SUPERSEDED after user feedback.** Existing sheets use a rejected B perspective source and insufficiently weathered A/B art. Preserve them as historical debug evidence only; do not show them as a current method-choice comparison or use their B mismatch to criticize method B. The replacement B guide fit, exact anchors and remaining source check are documented in `B-guide-update.md`. No new browser run has been authorized for this update.

Prepared in isolation for root review. **The parent-authorized finite browser capture is complete: 18 screenshots, six old/A/B comparison sheets, zero page errors and zero failed requests. No performance run was performed. No repository files, normalizer, game assets, branches or task status were changed.** The user has not chosen a building method. Do not ship the generic renderer or expand the building family before the comparison and decision.

The user changed task 02 step 0's subject from Köpenick Altbau to one GDR Zuckerbäcker and prioritized GDR assets after the enemy regeneration. Its visual identity follows `docs/style-bible.md`'s 2026-11-10 update and `docs/style/alexanderplatz-pioneer.png`: saturated cobalt/yellow, actual crossed hammer and curved sickle on red and blue banners, Berlin arcade/pilaster architecture, ivy and weathering. Raw inputs have been visually inspected.

## Files

| File | Purpose |
| --- | --- |
| `proof.js` | Injected classic script; creates one test building and exposes `__gdrProof.init()` / `.frame(mode, rotation, zoomFactor)`. A custom `b.draw` uses existing `withRot`, `bAx` and `P3`; `drawBox` remains untouched and is the fallback. |
| `prepare_assets.py` | Copies the three original images into scratch `assets/` and writes source hashes. No image editing or repository writes. |
| `capture.mjs` | Playwright injection and screenshot harness. Requires an already running repository server and available Playwright; does not install or serve anything. |
| `build_comparisons.py` | Builds six old/A/B contact sheets from the 18 screenshots and preserves their full resolution. |

## Exact proof geometry and crops

One fixture: `w=240`, `h=90`, `H=160`, `FH=160`, `R0=0`, `vs=1`, `lights=[]`. Legacy `zuckerB` already uses an empty lights list; no invented light positions are needed. Collision is one `obWall(fixture)` including the same rotation. The cyan footprint overlay draws the actual engine ground polygon. The scene is an isolated laboratory fixture on Alexanderplatz's generated ground using the real `render` / `drawSorted` path, not a walkable finished district. Existing ground scenery and baked map shadows can remain in the crop; inspect before showing the proof.

| Input | Source pixels `[x,y,w,h]` | Placement / anchor |
| --- | --- | --- |
| South facade | `[0,0,768,1024]` in `facades.png` | Two full 120×160 world modules. Cache 720×480 px. Each module preserves source aspect ratio 0.75. |
| East facade | `[768,0,576,1024]` in `facades.png` | First 90 world units of the 120-wide east module, **crop rather than squeeze**. Cache 270×480 px. |
| Roof | `[0,0,512,512]` in `kit.png` | 90×90 world tiles across a 240×90 roof. Cache 720×270 px clips the final tile; cool teal underfill removes semi-transparent seams. |
| Ivy | `[512,0,512,512]` in `kit.png` | South local `[106,7,30,118]`, local top-left anchor `[106,7]`. |
| Damaged plaster | `[1024,0,512,512]` in `kit.png` | South local `[192,8,48,48]`, top-right anchor `[240,8]`. |
| Blue banner | `[145,524,234,487]` in `kit.png` | East local `[52,20,18,65]`, top-centre anchor `[61,20]`. Source contains the blue/yellow/red hammer-and-sickle badge. |
| Red banner reserve | `[651,523,233,491]` in `kit.png` | Not needed: facade already carries red banners. Keep as kit material after method selection. |
| Pioneer mural reserve | `[1024,512,512,512]` in `kit.png` | Not composited in this finite proof; facade already has an entrance mural. |

Facades are rectangular RGB. Kit is 1536×1024 RGBA with alpha 0…254, not an opaque gradient background; do not remove backgrounds based on RGB. Full B is 1774×887 RGBA. Assets carry no added ground shadow; `bShadow` / the old box ground shadow remain engine-generated. These static assets have no animation pivots. Face-local anchors above define compositing placement; world footprint anchors come from `P3`.

**A's important implementation detail:** `ctx.drawImage(cache.south,0,0,w,FH)` draws the entire high-resolution canvas to world dimensions after applying `bAx`'s face transform. Do not put the 3 px/world texture into the old 1 px/world `b.spr` layout: `drawBox` reads source rectangles in legacy pixel units and would crop only one third of it. South/east/roof caches are created once; draw calls create no canvases or image data. The eastern facade already carries a cool shadow, so A omits the old extra `.42` east darkening. Validate the existing top-left lighting split at all three rotations before production.

## B is an honest mock, with a material limitation

The full B painting has a long facade rising toward screen right and its narrow side on the left. It is **not authored at the exact engine 2:1 angle**. The mock mirrors it to put the short side on the right, sizes its overall bounds approximately, and aligns source ground corner `[274,859]` (mirrored x) to the world southeast ground corner. It cannot match all four footprint corners and vertical walls exactly. Its cyan overlay makes that mismatch visible.

B remains a fixed painting at rotations ±0.6. It is explicitly labelled “Geometrie angenähert, Ansicht fest”. Never present its fixed image as if it follows the rotated footprint. An actual B production candidate would need an exact-camera painting for `240×90×160` and extra authored orientations if the district keeps arbitrary building rotations. A flat image cannot provide those new surfaces through canvas rotation.

The six comparisons are useful for choosing texture-kit versus finished-painting workflow, but **this approximate B is not proof of production geometry parity**. If B's fit materially biases the choice, regenerate one exact 2:1 B asset before asking for a final method choice.

Mirroring also reverses the painted emblems in this B mock; this is another reason it must not become a shipped asset. Production B must be painted at the correct orientation with correctly oriented logos.

## Completed proof

The browser was closed after capture. `proof/results.json` records all modes and exact zooms. The six sheets are:

- `proof/comparison-zoom1-rotzero.png`
- `proof/comparison-zoom1-rotplus060.png`
- `proof/comparison-zoom1-rotminus060.png`
- `proof/comparison-zoom2-rotzero.png`
- `proof/comparison-zoom2-rotplus060.png`
- `proof/comparison-zoom2-rotminus060.png`

Visual review of the 0/+0.6/−0.6 views confirms A's surfaces follow the cyan ground polygon and the facade modules remain legible. The full-painting B mock remains fixed while that polygon rotates, exposing its mismatch. At 2×/+0.6 A's approximate roof top is y=164 and its lowest footprint point y=1196 in a 1280-pixel canvas, leaving the complete building visible below the header. Prototype A has a plain flat roof without dimensional rooftop props; B's painted chimney silhouette illustrates that method's finish advantage without implying geometry correctness.

## Later execution, after the parent permits browser work

1. Review the script against the then-current game renderer and selected branch. No dependencies on enemy batching are introduced here.
2. Run `python3 /workspace/scratch/gdr-building-proof/prepare_assets.py`.
3. Serve the repository on an approved local port, then run the capture script in an environment where `playwright` resolves. Set `GDR_PROOF_URL` if the port is not 8765. Browser context blocks service workers and uses disposable browser storage.
4. Inspect all 18 full world screenshots. The viewport is 1440×1280 at DPR 1. “Default” uses the game's actual `resize()` zoom (1.8 for this viewport); “2×” is twice that zoom. Camera, ground, object dimensions and light pass stay identical across old/A/B in each comparison. Player stands outside the front wall for scale.
5. Run `python3 /workspace/scratch/gdr-building-proof/build_comparisons.py`; show six side-by-side comparisons with default/2× and 0/±0.6 rotation before requesting the user's method choice. Check silhouette, ground fit, saturation, emblem readability, lighting and texture seams.
6. Run actual `?debug=perf` before/after on Köpenick and Alexanderplatz only after the parent permits it. The frozen one-building capture is not performance evidence. No ready PR or perf claim can be based on these drafts alone.

## Budget and checks

Three face canvases total 669,600 pixels = 2,678,400 bytes (2.55 MiB). Peak decoded input images plus face caches and the 800×700 scratch ground restore cache total about 22.7 MiB, plus a 0.23 MiB legacy fixture canvas. After initialization, the south/east raw source images can be garbage collected; the retained B image + three face caches + ground cache + legacy canvas are about 10.9 MiB beyond the game's existing scene textures. The original ground canvas is reused. No per-frame canvases are added. Production assets should normalize to WebP quality 86–90 and remain under 400 KB each; no file-size or decoded-memory pass is claimed for a shipped task here.

Checked: `node --check proof.js`, `node --check capture.mjs`, Python AST parsing, and the finite Playwright world capture. Browser context used the local repository server on port 8767, installed `/usr/bin/chromium`, disposable storage, and blocked service workers. No fabricated screenshots or measured frame times.
