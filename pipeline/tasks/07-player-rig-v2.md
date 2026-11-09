# 07 Player rig v2: mannequin, fists, clothing as layers

Status: open (Codex does it end to end; Claude built v1 and reviews)

v1 (v0.52) puts ChatGPT parts together: `tools/build_hero.py` → `assets/hero/rig/` and `js/hero.js`, drawn by `drawHero` in `js/art.js`. It works, but every outfit was painted with its own body inside, so shoulders, scale and the hands differ per outfit and need hand-placed fixes (`HOLE`, `WFIX`, body centring in `build_hero.py`). Johannes' feedback on v1:

| Problem in v1 | Wanted in v2 |
|---|---|
| The default outfit is a body with clothes baked in; other outfits replace it and do not line up exactly | A neutral **mannequin** (opaque base body, plain dark undersuit, no clothes, same proportions as `assets/raw/H02a.png`, slim). Every outfit, the current default included, is a layer drawn over it at the same spot |
| Hands are flat and open, the weapon floats over the fingers | The front hand is a **fist** with a hole or gap the handle passes through: draw it as two layers (fingers in front of the handle, palm behind) |
| Some weapons are held at the blade or point down (fixed by hand per icon in `WFIX`) | Each weapon gets an explicit grip point and tip direction in the manifest (`pivots.grip`, `pivots.tip`), checked on a sheet |
| Torso and arm images include the arm hole and bits of sleeve | Torso layer without arm, arm layer per outfit (sleeve over the mannequin arm), cut at the same shoulder line for every outfit |

## Layers (back to front, facing right, game mirrors for left)

far leg, far arm (darker), mannequin torso, outfit torso, near leg plus outfit trousers/boots, head, hat, near arm (upper, lower), palm, weapon, fingers.

Upper and lower arm as two parts with an elbow pivot gives better swings; keep the shoulder pivot where it is in v1 (`HR[o].sh`) so `attack()` angles and hit areas stay valid.

## Production

1. Mannequin sheet: full figure plus each part, all on one sheet, same scale (lesson from ChatGPT: one sheet stays consistent, parts drift between sheets; generators also enlarge small parts unless told not to).
2. Outfit sheets: per outfit torso, sleeve, trousers if different, drawn over a faint mannequin guide so they share the outline. Brighter signature colours for anything new (style bible, Item colour).
3. Gloves and boots as small layers per item (`S.eq.g`, `S.eq.f`, today only a tint dot or nothing).
4. Replace `drawHero` input: keep its signature, the fallback to the code figure and `?debug=hit` checks.

## Acceptance

- All 13 outfits plus the Alexanderplatz armour (`blaumann`), all hats incl. `stroh`, all weapons: sheet with idle, mid-step and mid-swing, large (inventory, `drawDoll` in `js/panels.js`) and at game size.
- Weapon tip points where the hit sector is (`?debug=hit`), handle in the fist, nothing in front of the face at rest.
- No gaps between torso, legs and arms in any outfit; no outfit shifted against the legs.
