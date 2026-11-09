# Renderer contract

How a painted sprite has to look and where it plugs in. If something here is wrong, fix this file in the same PR.

## Camera and units

| Topic | Rule |
|---|---|
| Projection | 2:1 isometric. World coords are flat: x right-down, y left-down on screen. `js/iso.js`: `ix(x,y)=(x-y)*IS`, `iy(x,y)=(x+y)*IS/2`, screen = `ix/iy` plus camera offset `OX,OY`, times zoom `Z` (`scx`, `scy`) |
| World units | 1 unit is about 1 screen px at zoom 1 along the iso axes. Player 1.8 m is 48 units tall upright. Building lots and roads: `js/world.js` (grid districts), `js/geo.js`, `js/mitte.js`, `js/alex.js` (geographic districts) |
| Light | From the screen top-left. Shadows are drawn by the game on the ground along world +x. Sprites carry no shadow |
| Scale | Realistic proportions, characters about 1.3x for readability. Player 1.8 m, car 4.2 m, Trabi 3.5 m, BVG bus 12 m, Altbau 5 floors (about 18 m), street tree 10 m |

## Object types and anchors

| Object | Drawn today by | Sprite must provide | Anchor |
|---|---|---|---|
| Building, Späti, landmark | `drawBox` / `drawBB` in `js/iso.js`, landmark functions in the district files (`drawRathaus`, `drawReichstag`, ...) | Full iso render of the building at the game angle, footprint `w` x `h` in world units | Footprint south corner `(x, y+h)` on the ground |
| Vehicle | `drawVehBox` in `js/iso.js` (`b.veh.k`: car, trabi, van, bus, tram; `V.v` vertical) | Two renders: long axis along world x and along world y | Footprint centre on the ground |
| Tree, lamp, Litfaßsäule, crane | Upright sprite via `drawBB` (`b.spr`, `b.sc`) | Upright PNG | Bottom centre at the footprint centre |
| Enemy | `drawEnemy(e,t)` in `js/art.js` (district enemies in `js/alex.js` etc.), animated in code | Upright, facing right (the game mirrors), as parts with pivots or as a small set of frames (idle, walk 2 to 4, attack 2 to 3, hit) | Feet centre at `(e.x, e.y + e.r*.75)` screen-space, see `drawEnemy` |
| Boss | Same as enemy, `type:'boss'`, `e.big` | Same | Same |
| Player | `drawPlayer` / `drawHero` in `js/art.js`, rig from `js/hero.js` | Not Codex (Claude) | Feet at `(P.x, P.y+9)` |

Enemy sizes are their hit radius `r` (world units) in `mkEnemy`, `js/combat.js`: ghoul 10, raser 11, brute 17, spitter 11, rat 6, bomb 11, shield 13, crow 8, howl 11, kabel 9, bass 15, uhr 13, wurz 12, kern 11, boss 34 (big 42). Their code drawings: `drawEnemy` in `js/art.js`, Alexanderplatz ones in `js/alex.js`.

## Hitbox rules (Johannes, v0.52)

The art has to sit where the game logic is.

| Rule | Check with `?debug=hit` |
|---|---|
| The body's footprint matches the hit radius: the feet stand inside the ring, the body is about as wide on screen as the ring (2·r·0.707 px at zoom 1) | Yellow ring under each enemy, pink ring under the player |
| An attack animation reaches about as far as the attack hits: melee contact at `e.r + P.r`, ranged attacks start at the body | Enemy art at the moment of the hit touches the player ring |
| Telegraphs (charge lines, wind-ups) start at the visible body | Visual check |
| If the art cannot match, change the number in code (radius, reach) in the same PR and say so in `log.md` and the PR. Never leave a mismatch | |

Known limit: characters are upright, hits are decided on the ground plane, so a weapon at shoulder height reaches the sector edge horizontally but sits above it. That is accepted.

## Manifest

`assets/manifest.json`, one entry per sprite. Task 00 creates the file and the loader.

```json
{
  "enemies/ghoul-body": {"w": 64, "h": 96, "anchor": [32, 92], "units": 3, "pivots": {"armR": [40, 38]}, "for": "drawEnemy ghoul"},
  "buildings/altbau-a": {"w": 420, "h": 610, "anchor": [12, 598], "units": 3, "footprint": [120, 90], "for": "drawBox altbau"}
}
```

| Field | Meaning |
|---|---|
| `w`, `h` | Image size in px |
| `anchor` | Image px that sits on the anchor point of the object type above |
| `units` | Image px per world unit (3 by default) |
| `footprint` | World units `[w, h]` of the collision box the art was made for |
| `pivots` | Named rotation points in image px for code animation |
| `for` | Which draw function and object key uses it |

## Hooking a sprite

- Load lazily, keep the canvas drawing as fallback: see `himg()` and `drawHero()` in `js/art.js` (returns `false` until loaded, caller then draws the old way).
- Draw in the same transform the old code uses, so collisions, sorting (`drawSorted` in `js/render.js`) and lights stay correct.
- New script files go into `index.html` before the files that use them and into `SHELL` in `sw.js`.
