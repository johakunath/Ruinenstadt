# 03 Vehicles

Status: open (fifth in the current queue; see `workflow.md`)

Johannes: the cars look bad now, this is a visible upgrade for little work.

`drawVehBox` in `js/iso.js`, `b.veh.k` in car, trabi, van, bus, tram; `V.v` says the long axis runs along world y. Use painted face textures mapped onto the existing P3 box/frustum geometry: roof, visible long side and visible short end. Retain current wheel/frustum shapes and the complete canvas fallback.

| Item | Rule |
|---|---|
| Views | Supply roof, long-side and short-end textures for both `V.v` assignments. The renderer maps visible faces through P3/bAx under the actual road `rotN` (including supported angles up to ±45°); inspect every supported orientation in runtime and confirm texture mapping, anchors and footprint coverage. No independent full-360° painted renders are required |
| Variants | car 3, trabi 3 (colours), van 2, bus 1, tram 1 (BVG yellow). Wrecked, rusty, overgrown, flat tyres, broken glass. Colour variants can be done with a palette swap script in `tools/` instead of new paintings |
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
