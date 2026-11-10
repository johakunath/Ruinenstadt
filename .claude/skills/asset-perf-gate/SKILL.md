---
name: asset-perf-gate
description: Performance rules and the measured gate for painted in-world assets (buildings, props, enemies) in Ruinenstadt. Use before integrating any painted asset or cache into the renderer, when a task needs before/after frame-time numbers, when a perf run fails or looks noisy, or when asked to run or document the GPU performance check on the Windows PC.
---

# Asset performance gate

Budget source: `pipeline/workflow.md` (Performance budget). This skill is the how-to. Renderer details: `pipeline/contract.md`.

## Rules for painted assets

| Rule | Why |
|---|---|
| Max +5% full `render()` time on Köpenick and Alexanderplatz, decided by `tools/perf_koep.cjs` (or the same method for other hooks) | Tab S9 heat budget |
| Max 40,000,000 bytes decoded per task (images w×h×4 plus every derived canvas) | Tablet memory |
| Never build or decode inside a draw. Bake caches in scheduled jobs (`setTimeout`), draw the fallback until ready | Frame spikes |
| Bake derived caches at the scale they are drawn at: `min(3, DPR×Z)`, quarter steps (`koepScale()` in `js/koep-assets.js`). Never bake bigger and let `drawImage` shrink it | Minified draws read 1.6× the texels per frame and cut the number of caches that fit in 40 MB |
| Rebake on resize (scale in the cache signature), keep the legacy drawing as fallback meanwhile | Correctness after rotation/resize |
| One `drawImage` per cached object per frame, no per-frame canvas, gradient, pattern or array creation | GPU canvas cost is per call and per upload |
| Keep projected caches tight. Transparent bounding-box area still costs fill rate | Fill rate on the tablet GPU |

## What counts as evidence

- Only a run where `gpu.software` is `false` counts. Cloud containers and CI have no GPU: the script reports `software-raster` (exit 3). Those numbers say nothing about the tablet; use them only as a smoke test.
- Gate = median of paired on/off ratios with a seeded bootstrap 95% CI, at least 15 pairs (default 21), each pair in its own browser context, never after the visual fixture run.
  - `pass`: CI upper bound ≤ +5%.
  - `fail`: CI lower bound > +5%.
  - `inconclusive`: CI contains +5%. Rerun with `KOEP_PERF_PAIRS=41`. If it is still inconclusive, log both runs and let Johannes decide. Never pick the favourable run.
- Alexanderplatz is the null control: the Köpenick hook draws nothing there, so its paired median should be about 0%. If its CI is wider than about ±5%, the machine is too noisy. Fix the machine (see below), not the threshold.
- Default viewport 1280×800 at DPR 2 is about the Tab S9 (bake scale 3). `KOEP_PERF_VIEWPORT=960x640` reproduces the older Codex runs (bake scale 2.5).

## Running the GPU check on the Windows PC (step 3)

1. Machine: plugged in, Windows power mode "Best performance", close games, video, other browsers and heavy IDE builds.
2. Open `chrome://gpu` in normal Chrome: "Canvas: Hardware accelerated" must be listed. Note the GPU name.
3. One-time browser setup: `tools/browser-setup.md`.
4. PowerShell window 1, repo root: `python -m http.server 8765`
5. PowerShell window 2, repo root:
   ```powershell
   $env:NODE_PATH = (Resolve-Path .tools-browser/node_modules).Path
   $env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
   node tools/perf_koep.cjs
   ```
   About 10 minutes. The output ends with the GPU renderer, a Markdown table, the verdict and the saved JSON path (`pipeline/proof/02-buildings-koepenick/perf/perf-<timestamp>.json`).
6. If the GPU line says SOFTWARE or SwiftShader, rerun headed: `$env:KOEP_PERF_HEADED = '1'`.
7. If inconclusive: `$env:KOEP_PERF_PAIRS = '41'` and run again. Keep both JSON files.

## Documenting the result

1. Commit every JSON from step 5 to 7 (failing runs too) under `pipeline/proof/<task>/perf/`.
2. Paste the printed table into the task's proof README and a dated `pipeline/log.md` entry, with: GPU renderer string, viewport/DPR, pairs, commit SHA (`git rev-parse --short HEAD`), verdict.
3. Update the task status in `pipeline/tasks/<task>.md` and the PR body. `pass` unblocks review; `fail` triggers the workflow stop rule.

## If the gate fails on a GPU

Next levers, cheapest first:
1. Trim the projected bounding box (crop transparent rows/columns after the bake, store the offset).
2. Cache per face instead of per projected box: one flat canvas each for south facade, east facade and roof at 3 px/unit, drawn with the same transforms as `drawBox`. No transparent area, no rebake on rotation, same draw count as legacy.
3. Lower the per-task cache cap so fewer large textures stay resident.

Measure after each lever and log it. Three failed levers trigger the stop rule.
