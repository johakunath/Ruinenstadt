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
| Köpenick, current v0.84 | 21 | -1.51% | -5.62% to +1.24% | pass |
| Alexanderplatz, current v0.84 | 21 | -3.30% | -9.29% to +0.08% | pass |
| Alexanderplatz off/off, current v0.84 | 21 | +0.95% | -2.62% to +6.53% | inconclusive |
| Alexanderplatz off/off, current v0.84 rerun | 41 | -0.84% | -5.40% to +2.24% | inconclusive |

The retained pre-merge 21-pair run passed Köpenick and its null control but was inconclusive for Alexanderplatz. Its required 41-pair rerun passed both painted comparisons and the control. Main then advanced from v0.81 to v0.83, so v0.84 was retested: both painted comparisons pass, while the current-source control stayed narrowly inconclusive even at 41 pairs. No art optimisation is indicated by an off/off comparison. Per the gate, all reports are retained under `perf/` and Johannes must decide whether to accept the current control noise before merge.
