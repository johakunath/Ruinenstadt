# Asset pipeline: handover for Codex

Goal: replace code-drawn art with a hand-painted look. Codex generates images, Johannes decides, Claude or Codex integrates. Floors and ground textures stay code-drawn (they already look good).

## Fixed decisions

| Topic | Decision |
|---|---|
| Look | Hand-painted, like a human painted it. Hades is the closest reference: bold dark ink outlines, painterly fills, warm saturated light, strong rim light. Not pixel art, not 3D renders, not flat vector |
| Camera | Isometric (2:1, Diablo 1/2 angle). Every asset from the same angle, light from top-left |
| Setting | Post-collapse Berlin, overgrown, fires, improvised barricades. Dark, warm, a bit Fallout. One district (Potsdamer Platz) is cyberpunk: neon, rain, implants |
| Scale | Realistic proportions, characters exaggerated about ×1.3 for readability. Player 1.8 m, car 4.2 m long, Trabi 3.5 m, BVG bus 12 m, Altbau 5 floors (about 18 m), street tree 10 m |
| Format | PNG with transparent background, no text in images, no drop shadow baked in (the game draws shadows) |
| Game constraint | Static web app, no build step. Final sprites are committed PNGs plus `assets/manifest.json` (anchor point, size in world units). Missing sprite = game falls back to current canvas drawing |

## Steps (in order, each ends with a decision by Johannes)

| Step | Output | Done when |
|---|---|---|
| 1 Style references | 3 to 5 big key images from the prompts below | Johannes picks one or a mix |
| 2 Style bible | `docs/style-bible.md`: palette (hex), outline weight, light direction, scale chart image, 2 do and 2 don't examples | Approved |
| 3 Pipeline tooling | Folder layout `assets/<group>/<name>.png`, naming rules, `assets/manifest.json`, a small script in `tools/` that trims and checks PNGs (size, transparency, anchor) | One asset runs end to end and shows in game |
| 4 Production, big things first | See order below. Batches of about 10 assets, screenshot each batch in game | Each batch approved |
| 5 Integration | Renderer uses sprites by manifest, canvas fallback stays | No page errors, smoke test passes |

## Production order

1. Buildings: Altbau, Plattenbau, Späti (barricaded, sandbags, roll shutter), ruins, landmarks per district (Rathaus Köpenick, Fernsehturm, Wasserturm, Zitadelle, Hochhaus Marzahn)
2. Vehicles: car, Trabi, van, BVG bus, tram, plane wreck
3. Nature: street trees, park trees, bushes, reeds for the Spree and Müggelsee banks
4. Player: base body plus gear layers per slot (weapon, head, body, hands, feet), so equipment stays visible. Cut-out parts for code animation (torso, head, upper and lower arms, legs)
5. Enemies: ghoul, brute, spitter, rat, crow, shield bearer, Zünder (bomber), Heuler (howler), Raser (charger)
6. Bosses: one per district
7. Props: crates, BSR bins, barrels with fire, lamps, benches, Litfaßsäule, fences
8. Item icons, effects, UI frames

## Review checklist per batch

- Reads at game size: shrink to 64 px. Does a car still read as a car, a ghoul as a ghoul?
- Same angle and light as the reference
- Scale against the player using the scale chart
- Collision footprint matches the visible base (note it in the manifest)

## Step 1 prompts

Shared style block, append to every prompt:

> Hand-painted digital illustration in the style of a human concept artist, bold dark ink outlines, painterly brush texture, warm saturated light with strong orange rim light, deep shadows, isometric 2:1 camera angle from top-left, readable silhouettes, no text, no watermark.

1. **Street key art:** Post-apocalyptic Berlin-Köpenick old town at dusk, cobblestone street on a river peninsula, five-storey Altbau facades with broken windows and ivy, a barricaded corner shop (Späti) with sandbags and a half-open roll shutter, burning barrel, rusty Trabi and a wrecked yellow BVG bus, a lone survivor with a pipe weapon fighting three ghoul-like mutants. Wide 16:9.
2. **Character lineup:** Turnaround sheet of one survivor in four gear stages (rags, leather jacket, police vest with helmet, heavy coat with plate armour), isometric front and back views, neutral pose, plus weapon set: pipe, machete, sledgehammer, slingshot, spear made from a pipe.
3. **Enemy lineup:** Lineup of post-apocalyptic Berlin mutants at the same scale next to a human: gaunt ghoul, hulking brute, acid-spitting bloated creature, pack rat the size of a dog, crow, riot-shield bearer, bomber with a glowing fuse, screaming howler, charging berserker.
4. **Buildings and vehicles sheet:** Asset sheet on a neutral background: Berlin Altbau corner building, grey Plattenbau block, barricaded Späti, ruined building, Trabant car, VW van, yellow BVG bus, tram, all at the same isometric angle and consistent scale.
5. **Cyberpunk district:** Potsdamer Platz after the collapse, rain at night, magenta and cyan neon signs ("Klinik", "Implantate"), wet reflections, a survivor with a glowing cybernetic arm against cable-covered cyborg mutants, still hand-painted and gritty, not clean sci-fi. Wide 16:9.

## Renderer contract (since v0.37)

The game is 2:1 isometric. World coords are flat (x right-down, y left-down on screen); `js/iso.js` projects with `screen = ((x-y)·0.707, (x+y)·0.354 − z)`.

| Object | How it is drawn today | What a sprite must provide |
|---|---|---|
| Building, Späti, landmark | Box over the footprint `x,y,w,h`. Roof art on the top face, facade on the south face (+y), shaded facade on the east face (+x) | Full iso render of the building. Anchor = footprint's south corner `(x, y+h)` on the ground. Footprint size in world units in the manifest |
| Vehicle | Iso boxes (body, cabin, wheels), `veh` field on the object | Two renders: long axis along world x and along world y |
| Tree, lamp, Litfaßsäule, crane | Upright sprite, bottom centre at the footprint centre, scaled by `sc` | Upright PNG, anchor bottom centre |
| Characters | Upright, code-animated at the projected feet position | Cut-out parts as in production step 4 |

Shadows are painted on the ground canvas along world +x (light from screen top-left). Sprites carry no shadow.
