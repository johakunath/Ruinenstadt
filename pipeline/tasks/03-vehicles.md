# 03 Vehicles

Status: locally complete (v0.77, Codex, 2026-11-11). Rotation, collision, cache lifecycle, fallback and offline proof pass. Final combined hardware-GPU gate passes; draft PR #36 open; review pending.

Johannes: the cars look bad now, this is a visible upgrade for little work.

`drawVehBox` in `js/iso.js`, `b.veh.k` in car, trabi, van, bus, tram; `V.v` says the long axis runs along world y. Use painted face textures mapped onto the existing P3 box/frustum geometry: roof, visible long side and visible short end. Retain wheel positions, gameplay footprint and complete canvas fallback. User-authorized rounded shells replace the angular small-vehicle bodies.

| Item | Rule |
|---|---|
| Views | Supply roof, long-side and short-end textures for both `V.v` assignments. The renderer maps visible faces through P3/bAx under the actual road `rotN` (including supported angles up to ±45°); inspect every supported orientation in runtime and confirm texture mapping, anchors and footprint coverage. No independent full-360° painted renders are required |
| Variants | car 3 (green, blue, partly burned red), trabi 1 (cream only), van 2 (windowed Barkas, blue/cream), bus 1, tram 1 (BVG yellow). Wrecked, rusty, overgrown, flat tyres, broken glass. Colour variants can be done with a palette swap script in `tools/` instead of new paintings |
| Size | Car 4.2 m, Trabi 3.5 m, bus 12 m (`contract.md`). Vehicles must be clearly bigger than the player (48 units tall), a playtest complaint |
| Footprint | The collision box stays, art fits inside, anchor at footprint centre on the ground |
| Later | Plane wreck for Tempelhof |

Test: walk around each vehicle in game with `?debug=hit`, no gap between art and blocking box.

## Queue update (2026-11-10)

The earlier “quick win”/“start here after 01b” priority is stale and withdrawn.
Vehicles follow the Köpenick building kit, ten set/legendary icons, props/fire,
and player animation step 1. Rotation-specific art fit is a required design
constraint for this task.

Implementation direction (2026-11-10): face textures mapped onto the existing
P3 geometry best fit the renderer's supported rotations. Preserve the current
procedural wheels/frustums and full fallback while adding painted faces.


## Technical gate (2026-11-11)

The direction is recorded in `docs/vehicle-rendering.md`. Before production
paint, prove body and sloping cabin mappings for all five types and both axis
assignments, including edge-on faces and actual ±48.44° placement extremes
(`rotN` plus ±.06 rad jitter). The old ±45° description omits that jitter.
Vehicles remain after the immediate animation/props work, not a quick win.

## User refinement (2026-11-11)

Johannes rejected the angular/two-tone Trabi and panel van. Use soft body and
roof corners, one cream enamel colour and prominent round lamps for the Trabi;
a windowed Barkas B1000 KB for the van; independently painted burned red sedan
with scorched cabin, missing glass and roof opening for one wreck variant.
The geometry follows P3 continuously through actual ±48.44° angles. Curved
visual shells stay within unchanged rectangular collision walls; no RNG,
vehicle placement, scale footprint or wheel-position changes. Task03 has 42
active face files, 3,732,900 decoded image bytes, and a combined decoded+cache
limit of 40,000,000 bytes. Runtime warm draw is one drawImage; scheduled jobs
own allocation, resize/geometry/map invalidation and stationary overflow.

All original raw studies and dirty draft worktrees remain preserved. Current
prompts and inspected crop recipe: `assets/raw/codex/03-vehicles/refinement/`.
Proof: `pipeline/proof/03-vehicles/`. Rebuild: repo Python `-X utf8
 tools/build_vehicles.py` (full builder is byte-idempotent).
