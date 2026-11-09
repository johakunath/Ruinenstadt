# 08 VFX and animation rollout

Status: open (foundation done in v0.62)

Mechanical rollout of the v0.62 foundation. Model: Sonnet is enough. Do not redesign, do not add new primitive kinds, do not touch `fxDraw`, `fxSwings`, `fxDay`, `enemyLife` beyond the tuning tables named below. Ask instead of guessing when a spec here does not fit the code.

Read first: `CLAUDE.md`, the header comments of `js/vfx.js` and `js/anim.js`, the last section of `pipeline/contract.md`. Do not read `BACKLOG.md` or `assets/raw/`. Lines are very long: grep, then read ranges.

## API (all in `js/vfx.js`, world coords, `z` = px above ground)

| Call | Use |
|---|---|
| `fxFlash(x,y,z,col,s0,s1,life,l)` | glow growing from `s0` to `s1` px radius, `l` = light radius (0 for none) |
| `fxRing(x,y,col,r1,life,w)` | ground ring out to world radius `r1` |
| `fxSparks(x,y,z,col,n,sp,a,spr)` | `n` sparks, speed `sp`, world direction `a`, spread `spr` rad (omit both for all round) |
| `fxHit(e,crit,col)` / `fxKill(e)` / `fxPulse(x,y,col,r)` | composites, already wired in `hit()`, `kill()` and the Molotow landing |
| `FXC()` | district palette: `sw fin hv hit crit kill alt`. Use it for anything without an element. Element colours: `ELC.fire`, `ELC.acid`, `ELC.shock` |

Rules: effects are visual only (no change to damage, timing, hit areas). A ring or pulse radius equals the real hit radius in the same line of code. One call per event, never per frame, except trails behind a moving thing: at most one `fxSparks(...,1,...)` per frame guarded by `Math.random()<dt*N`. Keep the existing `burst()`, `rings`, `shocks` calls; add to them.

## Batch A: spells, skills, consumables (`js/combat.js`, `js/update.js`)

Find the sites with `grep -n "shocks.push\|rings.push\|fields.push\|sfx('boom')\|sfx('zap')" js/combat.js js/update.js`.

| Site | Add |
|---|---|
| Every player `shocks.push({x,y,...,max:M})` (skills in `skill()`, Ritter dash end, kill explosions) | `fxPulse(x,y,acid?ELC.acid:FXC().hv,M)` |
| `rings.push` with `col:'125,211,255'` (shock, shrine) | `fxFlash(x,y,12,ELC.shock,20,max*.5,.2,max)` |
| `chain()` | `fxFlash(t.x,t.y,14,ELC.shock,6,22,.12,40)` per target |
| Barrel explosion (`update.js`, `rings.push({x:b.x,...col:'255,138,61'})`) | `fxPulse(b.x,b.y,ELC.fire,b.r)` |
| Burn and acid ticks (`e.burn>0`, `e.acid>0` in `update.js`) | replace nothing, add `fxSparks(e.x,e.y,e.r,ELC.fire or ELC.acid,1,60)` inside the existing `Math.random()<dt*N` guard |
| `dash()` | `fxRing(P.x,P.y,FXC().sw,40,.2,3)` at start |
| `useCons` Verband | `fxFlash(P.x,P.y,20,'#8fd16a',10,46,.35,0)` and `fxRing(P.x,P.y,'#8fd16a',44,.35,3)` |
| `gainXp` level up | `fxPulse(P.x,P.y,'#f2d14b',90)` |
| Player hurt (`hurt()`), only when damage landed | `fxFlash(P.x,P.y,18,'#ff5040',10,40,.15,0)` |
| Enemy attacks: spitter shot (`fireGlob`), Zünder explosion, Heuler howl ring, Boxenkopf bass ring, Raser charge start, boss slam | muzzle or origin flash in the attack colour already used on that line, radius = the real radius |

## Batch B: weapons

`fxSwings()` reads `s.kind` (`sword`, `hammer`, `spear`, anything else = sword look). List the kinds: `grep -o "kind:'[a-z]*'" js/data.js | sort -u`.

1. For each kind without its own look, add one branch or parameter row in `fxSwings` only if the weapon class differs in reach or weight (e.g. dagger: `W` 11, sweep `p/.3`; axe: like hammer without the ring). Sling and ranged kinds get no crescent, their projectile already trails.
2. Element weapons: when the equipped weapon has an element (find the field with `grep -n "\.el\b" js/combat.js | head`), pass that `ELC` colour: set `s.col` at the `swings.push` in `attack()` and use `s.col||col` in `fxSwings`.
3. `P.spin>0` (render.js ground layer, three arc strokes): add the same arcs additively in `fxDraw` with `FXC().sw`, keep the base strokes.

## Batch C: enemies

1. `EANI` rows (`js/anim.js`): `rat:{fps:10,life:1.3}`, `brute:{fps:4,life:.6}`, `crow:{fps:8,life:.7}`, `shield:{life:.7}`, `bass:{life:.6}`, `uhr:{life:.7}`. Others keep the default.
2. Canvas enemies already get `enemyLife`. Check each of the 13 types in `drawEnemy` (`js/art.js`) and `js/alex.js` for doubled motion: where a type already bobs or leans in its own drawing and the sum looks wrong, lower its `life`, do not edit the drawing.
3. When task 01 delivers frames: no code. Manifest keys `enemies/<type>-<pose>` are enough. Verify with `?debug=hit`.

## Batch D: per-district tuning

| District | Check | Knob |
|---|---|---|
| Alexanderplatz (day) | shade not muddy at wave 1 and wave 20, clouds visible but text readable | `fxDay` gradient alphas, `CLD` alpha, `SHL()` day length |
| Mitte | effects read against neon and rain | `FXP.cyber` |
| Köpenick, Xhain, Tempelhof | warm palette does not vanish next to barrel fire | `FXP.warm` |
| U-Bahn tunnel, base camp | no errors, effects visible in near-black | none expected |
| Trees and lamps (`drawBB`), props (`drawProp`), NPC, captive | optional: `fxShadow` instead of their fixed ellipse where one is drawn in code. Skip baked ground shadows |

## Batch E: sound placement and light colour (v0.63)

1. `sfx(name,pos,vol)` takes a world position for stereo placement. Only `hit`, `crit` and `kill` pass one. For every other effect call with an obvious source (`grep -n "sfx('boom')\|sfx('pop')\|sfx('spit')\|sfx('wood')\|sfx('crash')\|sfx('zap')\|sfx('ignite')" js/*.js`), pass the object or `{x,y}` already used on that line. Calls about the player (`swing`, `dash`, `hurt`, `heal`) and all menu sounds stay centred. Never pass a position to `pick` (its argument is the rarity).
2. Lights take a colour: `lit(x,y,r,z,col)` in `render()`, building lights use `l.c` or `LCOL()`. Give landmark lights in `js/geo.js`, `js/mitte.js`, `js/alex.js` a fitting `c` where the lamp has an obvious colour (neon signs: their neon colour). Do not change `r`.
3. Do not edit the recipes in `FX` (`js/audio.js`). Johannes judges sound by ear.

## Acceptance

- `node --test tools/test_sprites.mjs` passes. `for f in js/*.js; do node --check $f; done` is silent.
- Smoke test per `CLAUDE.md` in Köpenick, Alexanderplatz, Mitte, one tunnel: no page errors over 600 simulated frames with combat.
- `node tools/perf_vfx.cjs` (server on 8765): median per district within 10 % of the `main` checkout measured the same way, three runs each, compare the best of three.
- One screenshot per batch at default zoom showing the new effects, attached to the PR. Look at each one yourself before attaching: effect at the right place, right direction (sparks fly away from the player, shadows fall to screen right), nothing drawn at the map origin.
- `fx.length` stays at or below 260 in a wave 20 fight.
- Bump `VERSION` and `CACHE`, add a `BACKLOG.md` row, append to `pipeline/log.md`.
