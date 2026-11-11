# Renderer contract

Köpenick method-A integration (draft v0.71; performance gate open): `js/koep-assets.js` maps selected
window/material modules to the existing facade lattice and records aperture
bounds as `pivots.apertureTL`/`apertureBR`. It derives transparent projected
caches at device scale `koepScale()` = min(3, DPR×Z) px/screen unit, quarter steps,
for actual building rotations (scale is part of the signature, resize rebakes); no authored fixed-view
painting replaces the geometry. `koepPrepareMap()`/`koepPrepare(b)` schedule
cache work outside drawing. Signatures invalidate changed geometry/rotation;
current-frame visible caches are pinned; overflow remains on fallback until the view changes. Task images,
shared materials and caches together are capped at 40,000,000 bytes. The
original sprite supplies complete fallback while a required image/cache is
unavailable. Cache retirement clears dimensions and cancels pending map jobs.
The Späti keeps its German sign, central entrance, interior and collision gate;
ruins keep the original cutout union. See task 02 proof for validation.

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
| Vehicle | `drawVehBox` in `js/iso.js` (`b.veh.k`: car, trabi, van, bus, tram; `V.v` vertical) | Painted roof, long-side and short-end face textures mapped onto existing P3 geometry for both `V.v` assignments and actual supported `rotN` road angles (up to ±45°); retain procedural wheels/frustums and full fallback | Footprint centre on the ground |
| Tree, lamp, Litfaßsäule, crane | Upright sprite via `drawBB` (`b.spr`, `b.sc`) | Upright PNG | Bottom centre at the footprint centre |
| Enemy | `drawEnemy(e,t)` in `js/art.js` (district enemies in `js/alex.js` etc.), animated in code | Upright, facing right (the game mirrors), as parts with pivots or as a small set of frames (idle, walk 2 to 4, attack 2 to 3, hit) | Painted ghoul: feet centre at `(e.x, e.y + e.r*.4)` screen-space, so soles stay inside the projected collision ring. Legacy canvas enemies use `e.r*.75`; see `drawEnemy` |
| Boss | Same as enemy, `type:'boss'`, `e.big` | Same | Same |
| Player | `drawPlayer` / `drawHero` in `js/art.js`, rig from `js/hero.js` | Shared opaque mannequin, clothing overlays, separate arm segments, rear palm / weapon / front fingers; Codex task 07 | Feet at `(P.x, P.y+9)` |

Enemy sizes are their hit radius `r` (world units) in `mkEnemy`, `js/combat.js`: ghoul 10 (Brigadeghul in the GDR: 20), raser 11, brute 17, spitter 11, rat 6, bomb 11, shield 13, crow 8, howl 11, kabel 9, bass 15, uhr 22, wurz 12, kern 11, boss 34 (big 42). Their code drawings: `drawEnemy` in `js/art.js`, Alexanderplatz ones in `js/alex.js`.

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
- Feet centre stays at `(e.x, e.y + e.r*(ENEMY_ART[type].ground ?? .4))` for painted enemies (Uhr uses `.25`), sprite scale is `e.r/(EANI[type].radius || 10)` on top of `units`. The default reference radius is 10; task 01 supplies explicit reference radii for its authored families so all frames retain 3 source pixels per world unit.
- `enemyLife` adds motion in code for painted and canvas enemies alike: breathing, walk bob, wind-up squash (telegraph `e.tw`, charge `e.ch`, melee about to land), strike stretch and lunge (`e.atk`), hit squash (`e.flash`), spawn pop. Frames must not bake in a lunge beyond the hit reach; code adds 5 px.
- Shadows are drawn by code (`fxSil` from the frame, `fxShadow` blob). Deliver frames without a painted ground shadow.
- Task 01 maps the ordinary boss to `schrottkoloss` and Alexanderplatz ghouls to `brigadeghoul`. District bosses (`e.big`) keep their own drawing until task 06. Selected families prefetch their six frames; missing poses still use `POSEFB`.

Effects: spawn only through the `fx*` helpers in `js/vfx.js` (`fxFlash`, `fxRing`, `fxSparks`, `fxHit`, `fxKill`, `fxPulse`), colours from `FXC()` or an element colour (`ELC`). They are visual only: never change hit areas, timings or damage for an effect. A ring or pulse radius equals the real hit radius.

Task 01 uses `life: .45` for painted families to complement the authored poses without adding a second large lunge. Explicit mouth pivots follow this same life transform; projectile launch offsets ease to the existing ground-plane path over 0.18 s, leaving collision positions and travel unchanged.


## GDR proportions correction (user-authorized, v0.68)

Johannes explicitly requested larger GDR bodies and matching functionality/
hitboxes. Uhrwerkläufer is authored at 64 units with actual/reference radius
22 (previously 44/13), movement base speed 34 (previously 42), and four pose
frames per second. Brigadeghul is authored at 44 units with radius 20
(previously 20/10), only for ghouls in the GDR district. Other ghouls retain
radius 10. Elite radii retain the existing 1.15 factor and rounding.

Uhr feet use `e.r*.25` from the collision centre to fit the broader planted
stance inside the projected ring; other painted bodies keep `.4`. Its
canvas fallback shares `.25`, and Brigade fallback shares `.4` with the
painted body. `ENEMY_ART.ground` supplies the optional per-family offset;
shadows and any muzzle pivots follow it. The old general legacy fallback
`.75` still applies to unchanged families.

Clock shield size/origin/drop scale from its original radius-13 construction;
block angle and damage rules do not change. Spawn clearance encloses base and
possible elite radii, and GDR event spawns account for the larger ghoul. Wall
resolution, crowd separation, contact and incoming-hit tests use the actual
`e.r`. Health, damage and constructor RNG draws remain unchanged. Proof and
semantic tests are in `pipeline/proof/12-gdr-enemy-proportions/` and
`tools/test_gdr_geometry.mjs`.


## GDR painted building kit and wall decorations (v0.69)

`js/gdr-assets.js` supplies `drawGdrBuilding(b)` and `drawGdrDecorations(b)`
inside the existing `drawBox`/`withRot` path. Existing Zuckerbaecker blocks
carry deterministic `gdrDecor` and `gdrKit` tags. Johannes selected A
after reviewing the comparison, so the kit is active on existing GDR blocks. No tag changes map RNG, physical dimensions, collision,
box sorting, culling or fade behavior. The runtime does not use fixed-view B.

Painted facades repeat 120-world-unit modules horizontally and fit their
160-unit authored height to actual `bHs(b)`. Roof tiles repeat at 90 units.
Only the normalizer's 1 px transparent border is removed when creating the
three shared repeating face patterns. Those source-resolution canvases are
created once, shared across buildings/maps and never resized per building.
Overlays are clipped by supported face bounds through their placements.
The east painting contains its own cool shading; skip legacy .42 shading.

The normalizer retains default image anchors for selection metadata; these
rectangular textures use explicitly documented face-local top-left positions,
not upright billboard anchors. Face positions and axes come from P3/bAx.
Decorations hang from `Hs-12`; the mural is a separate ground-floor panel.
Zucker has no dynamic window light emitters. Gables, rooftop extensions,
light-bearing buildings and boxes below 48×45×60 opt out before kit load
(decorations require a 120-unit front face),
so this task cannot misplace an existing lamp or replace a roof silhouette.

A missing required kit image returns false before any painted part. The old
canvas box is retained. The independent decoration path behaves the same
way and keeps the existing underlying canvas art while images load/fail.
New code and eight WebPs are in the v0.69 service-worker shell.

The comparison's B is an explicit fixed-view precomposition of the same
approved kit at 3 px/unit, with its anchor calculated from exact projected
corners and no ground shadow. It is dev proof, never runtime art. Extra
orientations or a fallback would be needed before using fixed paintings on
rotated buildings. Raw independently generated B studies failed footprint
fit and remain unselected; their failure is not attributed to the method.


## Player animation v3, step 1 (v0.73 draft)

`tools/build_hero.py --animation-only` derives twelve lossless WebPs from the
committed v2 leg/trouser layers. Existing image bytes, shoulder, arm lengths,
weapon grip/tip metadata and `HWL` remain unchanged. Every outfit registers
its thigh and shin at the same knee (8 local units below the hip), with a
four-source-pixel overlap. Boot art remains an independent ankle layer.
The complete default builder also emits these derivatives after v2 sources.

`heroPose` is visual only. Wet ground and speed scale phase/stride, the lifted
knee flexes, one local foot remains planted, and ankle rotation cancels hip
and knee rotation. Body lean/counter-rotation and head lag use the same pose.
Attack IK targets the old hand path; joint lengths remain 10+10 and a small
unreachable-target error is bounded by the semantic tests. Dash uses the same
knee/ankle and arm chain. No physics, hit areas, timings, RNG or damage change.
`drawDoll` already calls `drawPlayer`, so inventory uses this rig too.

As before, this is a mirrored side rig. Additional directions and scarf/coat
spring chains remain task 09 steps 2–4 and are not claimed by this delivery.


## v0.74 movement and inventory follow-up

`heroGait` derives walk/run blending and cadence from the existing projected
movement magnitude, stats and wet factor. Update and camp use its cadence;
no movement speed, hit rules or RNG changes. Lower input gets shorter/slower
walking; full input gets longer running strides, extra arm swing, torso lean
and mild weapon sway. Sway is visual and disabled for attacks/dash.

The inventory doll uses a 480×640 portrait canvas with matching CSS aspect
ratio. Its zoom/offset accounts for hammer/spear extent. Wide inventory keeps
three panels, gives the survivor/equipment more width, stacks comparison
cards in a narrower column and uses auto-filled square cells with vertical
page scrolling. The phone layout keeps its existing ordering and controls.


## v0.75 resolved-travel gait

`heroAdvance(P,ST,oldX,oldY,dt,wasDash)` runs after collision resolution. Its
`animSpeed` and `walk` are visual state; gameplay positions and travel speed
remain unchanged. `heroGait` uses that measured projected speed, retaining a
requested-speed fallback only for synthetic/menu poses. Running phase is
linear in distance (10 rad per 182 projected units at full normal speed),
with shorter strides in the walk blend. Dash movement does not advance it.

Forward leg extension straightens before contact, and running torso lean is
.23 rad. `heroFrontJoint` adds ±1.8-unit carry height through arm IK rather
than translating the weapon away from the palm. Extra angular/vertical carry
motion is disabled in attacks/dash. Attack stride is reduced to .4 so larger
running geometry cannot shift the old attack grip beyond its existing bound.


## Shared props and fire (v0.76)

`js/props.js` supplies complete painted/fallback hooks for breakables, fire,
lamps, benches, poster columns, fences and sandbags. The eight-cell flame
strip is shared; per-instance phase/rate derive from existing `b.ph`, with
no render RNG or gameplay changes. Bodies remain static; code owns lights
and particles. Bench/sandbag ground art is promoted into depth-sorted props
without changing collision walls; fences retain their actual projected axes.
Task images decode to 1,013,788 bytes; no derived runtime caches. Script and
all eleven images are in the service-worker shell.

## Vehicles and shrine refinement (v0.77 local)

Vehicle painted materials wrap continuously rotated P3 shells, including the
actual road jitter up to ±48.44°. User-authorized rounded small-vehicle bodies
and inset cabins fit inside unchanged collision rectangles; procedural wheel
positions, world RNG, sorting and full legacy fallback remain. Trabi is cream
only, van is a windowed Barkas, and one sedan variant is partly burned. Task03
uses 42 images (3,732,900 decoded bytes); images plus scheduled device-scale
caches share 40 MB. See `docs/vehicle-rendering.md` and task03 proof.

Unused painted Litfaßsäulen draw a faint .20-alpha cyan aura behind the column;
consumption removes it via existing lights/used state. The shared 128×128 glow
is prewarmed outside draw (+65,536 derived bytes for task05; total 1,079,324).
Johannes explicitly increased the existing shrine buff duration from 45 to
60 seconds. No new buff effects or selection rules. Building-light occlusion
is explicitly deferred; this batch does not change the light-mask algorithm.
