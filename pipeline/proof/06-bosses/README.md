# Task 06 boss proof

Nine district bosses use 54 painted WebP frames built from the transparent five-pose sheets in `assets/raw/codex/06-bosses/poses/`. Built-in image generation used the approved style canvases, Kodex identities and district boards; the persisted prompt set is `poses/prompts.md`. `tools/build_bosses.py` is the only production cutter and records every source-cell pick in `poses/picks.json`.

## Browser and memory

- `results.json`: all 54 frames load and paint at 1×/2×; no page errors.
- `gallery-1x.png`, `gallery-2x.png`: pose and anchor sheets reviewed after deterministic detached-fragment cleanup.
- `fallback.png`: an intentional Hauptmann idle HTTP404 uses the existing canvas boss.
- Fresh service-worker context reloads offline and decodes all 54 frames.
- Encoded WebPs: 1,948,952 bytes. Decoded task textures: 17,699,360 bytes; no derived canvas cache.
- Existing boss radii, hit positions, attack logic, collision and gameplay RNG are unchanged.

## GPU performance

RTX 4070, hardware ANGLE/D3D11, 1280×800 at DPR 2. One real district boss plus 40 seeded enemies; same-code canvas fallback is off, painted boss is on. Every pair uses fresh on/off contexts, 100 warmups and 300 timed full `render()` calls. Median paired ratio with seeded bootstrap 95% CI; budget upper bound is +5%. No timed canvas allocations or page errors.

| Scene | Pairs | Paired median | 95% CI | Verdict |
|---|---:|---:|---:|---|
| Köpenick | 41 | -2.91% | -5.53% to -0.48% | pass |
| Alexanderplatz | 41 | -2.04% | -3.63% to +1.60% | pass |
| Alexanderplatz off/off control | 41 | +0.15% | -1.77% to +2.28% | pass |

The retained 21-pair run passed Köpenick and the null control but was inconclusive for Alexanderplatz (+2.15%, CI -2.09% to +6.18%). The required 41-pair rerun resolved it as pass; no optimisation attempt was needed. Raw reports are under `perf/`.
