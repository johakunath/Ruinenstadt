# 05 Props and fire

Status: locally complete (v0.77, Codex, 2026-11-11). Current browser/offline, collision parity, idempotent generation and paired RTX 4070 gates pass. Combined vehicle/shrine batch final GPU gate passes; publication/review pending; original draft preserved.

Supply crates and cellar chests (the menu icons R06 and R07 in `assets/icons/` are the agreed look, redraw them at the iso angle), BSR bins, barrels with fire (`drawBarrel` in `js/render.js`), campfire, lamps, benches, Litfaßsäule (shrine, `shrines`), fences, sandbags. Breakable props (`drawProp`, `js/art.js`): the hit area is the footprint box, the art must fill it. These are the "items lying around" in the world.

## Fire and anything that flickers (Johannes' question)

Paint the body static, paint the flame separately, animate in code:

| Part | Method |
|---|---|
| Barrel, campfire stones and wood | Static painted sprite, no flame in it |
| Flame | One painted flame sprite sheet, 6 to 8 frames, transparent, drawn with additive blending (`lighter`) at 8 to 10 fps, each instance with a random start frame and a speed jitter of about 15 %, so no two fires pulse together. Frames chosen so the loop is seamless |
| Glow and flicker of light | Stays in code (`lit(...)` radius and alpha noise, already used for barrels). The painted flame only has to look good, the light does the "flickering" |
| Embers and sparks | Existing particles in code |
| Other flickering things (neon, lit windows, shrine light) | Same rule: painted base plus code-driven glow layer |

Performance: one shared flame sheet in one image, `drawImage` with source rects, no per-frame canvas creation (tablet gets warm, see log).

Test: 10 fires on screen at the same time with `?debug=perf`, no visible sync.

User refinement: unused Litfaßsäulen have a faint cyan aura; consumed columns lose it. Existing buffs now last 60 s (explicit gameplay change requested by Johannes). New shared glow adds 65,536 decoded canvas bytes, total task memory 1,079,324. Lighting occlusion is deferred to Claude in BACKLOG.
