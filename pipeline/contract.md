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
| Enemy | `drawEnemy(e,t)` in `js/art.js` (district enemies in `js/alex.js` etc.), animated in code | Upright, facing right (the game mirrors), as parts with pivots or as a small set of frames (idle, walk 2 to 4, attack 2 to 3, hit) | Painted ghoul: feet centre at `(e.x, e.y + e.r*.4)` screen-space, so soles stay inside the projected collision ring. Legacy canvas enemies use `e.r*.75`; see `drawEnemy` |
| Boss | Same as enemy, `type:'boss'`, `e.big` | Same | Same |
| Player | `drawPlayer` / `drawHero` in `js/art.js`, rig from `js/hero.js` | Shared opaque mannequin, clothing overlays, separate arm segments, rear palm / weapon / front fingers; Codex task 07 | Feet at `(P.x, P.y+9)` |

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

## Player rig v2 (v0.61)

`tools/build_hero.py` builds the selected task 07 sheets into `assets/hero/rig/`
and generates `HR`/`HW`. All fourteen outfits share shoulder `[-.87,-37.33]`,
hip `-16`, and two 10-unit arm segments. Clothing never moves the joints.
`HR.parts` placements are in local game units (articulated parts are relative
to their joint); `drawPlayer` retains its existing 1.2 character scale. The
player rig retains v1's 6 pixels per local unit, while world sprites use 3.
The manifest checker validates the two explicit resolutions.

Every weapon is copied to a rig WebP with authored `pivots.grip` and
`pivots.tip` in image pixels. `HW` is derived from those coordinates; runtime
rotation puts the grip at the fist and the tip along the requested weapon
angle. Weapon scaling still uses the existing per-kind `HWL` reach. There is
no inferred axis or per-icon flip list. A missing required component returns
`false` before drawing any painted part, so `drawPlayer` uses its canvas figure.

## Enemy animation driver and VFX (v0.62)

Enemy frames need no renderer hook any more. `js/anim.js` picks them up from the manifest:

- Keys `enemies/<e.type>-<pose>`. `<type>-idle` is required and defines the head height (bars, stun ring). Optional poses: `walk-a` to `walk-d`, `attack-a` (wind-up), `attack-b` (strike), `hit`. Missing poses fall back (`POSEFB`), so one idle frame is a valid first delivery.
- Per-type tuning in `EANI` (`fps`, `walk` frame count, `life` strength of squash and stretch, `radius` authored reference hit radius). Nothing else is per type.
- Feet centre stays at `(e.x, e.y + e.r*.4)` for painted enemies, sprite scale is `e.r/(EANI[type].radius || 10)` on top of `units`. The default reference radius is 10; task 01 supplies explicit reference radii for its authored families so all frames retain 3 source pixels per world unit.
- `enemyLife` adds motion in code for painted and canvas enemies alike: breathing, walk bob, wind-up squash (telegraph `e.tw`, charge `e.ch`, melee about to land), strike stretch and lunge (`e.atk`), hit squash (`e.flash`), spawn pop. Frames must not bake in a lunge beyond the hit reach; code adds 5 px.
- Shadows are drawn by code (`fxSil` from the frame, `fxShadow` blob). Deliver frames without a painted ground shadow.
- Task 01 maps the ordinary boss to `schrottkoloss` and Alexanderplatz ghouls to `brigadeghoul`. District bosses (`e.big`) keep their own drawing until task 06. Selected families prefetch their six frames; missing poses still use `POSEFB`.

Effects: spawn only through the `fx*` helpers in `js/vfx.js` (`fxFlash`, `fxRing`, `fxSparks`, `fxHit`, `fxKill`, `fxPulse`), colours from `FXC()` or an element colour (`ELC`). They are visual only: never change hit areas, timings or damage for an effect. A ring or pulse radius equals the real hit radius.

Task 01 uses `life: .45` for painted families to complement the authored poses without adding a second large lunge. Explicit mouth pivots follow this same life transform; projectile launch offsets ease to the existing ground-plane path over 0.18 s, leaving collision positions and travel unchanged.
