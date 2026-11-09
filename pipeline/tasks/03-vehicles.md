# 03 Vehicles

Status: open (quick win, start here after 01b)

Johannes: the cars look bad now, this is a visible upgrade for little work.

`drawVehBox` in `js/iso.js`, `b.veh.k` in car, trabi, van, bus, tram, `V.v` says the long axis runs along world y.

| Item | Rule |
|---|---|
| Views | Two renders per vehicle and variant: long axis along world x, long axis along world y. Visible faces are roof, one long side and one short end (south/east in the game), so the other two sides are never drawn |
| Variants | car 3, trabi 3 (colours), van 2, bus 1, tram 1 (BVG yellow). Wrecked, rusty, overgrown, flat tyres, broken glass. Colour variants can be done with a palette swap script in `tools/` instead of new paintings |
| Size | Car 4.2 m, Trabi 3.5 m, bus 12 m (`contract.md`). Vehicles must be clearly bigger than the player (48 units tall), a playtest complaint |
| Footprint | The collision box stays, art fits inside, anchor at footprint centre on the ground |
| Later | Plane wreck for Tempelhof |

Test: walk around each vehicle in game with `?debug=hit`, no gap between art and blocking box.
