# 10 Ground

Status: first shared painted material kit integrated (v0.88, 2026-11-13). New user order promotes this after pickups. Additional district variants, transition/marking and decal paintings below remain open; optimization and final acceptance belong to Claude.

Do not repaint whole district maps. Ground is generated per district into one big canvas (`G`, `gx` in `js/world.js`, `biomes.js`, geo files), so the painted version has to be a **tile and decal kit**:

| Layer | Asset |
|---|---|
| Base | Tileable painted ground textures per district and surface (asphalt, cobblestone, pavement slabs, packed earth, grass, sand, plaza stone, tram track bed, U-Bahn concrete). 512 px tiles at 3 px per unit, 3 variants each so repeats do not show, edge-compatible pairs for transitions (road to pavement, grass to road) |
| Markings | Painted lane lines, crossings, kerbs, manhole covers, tram rails, as straight and corner pieces the road code can place along `ROADS` |
| Decals | Cracks, moss, puddles, leaf litter, oil stains, rubble, roots breaking through asphalt, painted per district palette (board in `docs/style/`) |
| Light | Painted with the light from top left, no baked shadows, no baked lights. Wet/rain variant for Mitte can be a code tint |

Method: a style canvas per district first (workflow step 3), then tiles. A mockup of one street crossing (old ground vs tiled painted ground) before the full set, per Johannes' mockup rule.

Hook: the ground canvas is built once per district, so the cost is at load, not per frame. Keep the generator as fallback. Budget: load time on the tablet under 1.5 s more per district, memory as in `workflow.md`.

Test: Köpenick, Xhain, Alexanderplatz, Mitte, one tunnel; screenshots at 1x and 2x, `?debug=perf` before and after (frame time must not change, only load time).

## Delivered first shared kit (v0.88)

Nine generated material tiles: asphalt, cobble, pavement, earth/rubble, grass,
sand, plaza stone, ballast and tunnel concrete. They paint the existing
district/lot/road/tunnel ground canvases once at construction, retaining
procedural details, road markings, rails, water and full fallback. This is
one shared variant per material; the older three-variant/decal expansion is
not claimed complete. Proof: `pipeline/proof/15-pickups-shared/`.
