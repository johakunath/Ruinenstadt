# Style bible

Reference for all art, content and district work. Source: four finished reference boards from ChatGPT (Nov 2026) plus the art-direction handover. When text and image disagree, the image wins, except for a newer explicit user art-direction update such as the GDR/Pioneer direction below. New ideas that are not in the boards or the handover are marked **Proposal**.

## Reference boards

| Board | File | Subtitle on board | Role |
|---|---|---|---|
| Köpenick | `docs/style/koepenick.png` | Dinosaur Jungle · Steampunk Noir | **Default look.** Starting biome, character baseline, first assets |
| U-Bahn | `docs/style/ubahn.png` | Below the Ring · Ash Frontier | Shared underground layer, later fast travel |
| Potsdamer Platz | `docs/style/potsdamer-platz.png` | Cyberpunk · Bassline Underworld | Future district: dark cyberpunk and techno |
| Alexanderplatz | `docs/style/alexanderplatz.png` | GDR Clockwork Gardens | Future district: socialist retro-futurism |

Each board has the same layout: key scene on top, lineup below (player in front and back view, enemies, NPC, vehicle, props, weapon), title and palette on a dark teal panel.

The exploratory boards (A Prussian Clockwork, B Concrete Orchard, C Bassline Underworld, D Velvet Radio Noir, F, H Below the Ring) and the earlier first references are not in the repo. Only the four finals count.

## GDR / Pioneer direction (Johannes, 2026-11-10)

The active Alexanderplatz identity is now `docs/style/alexanderplatz-pioneer.png`.
Johannes explicitly requested stronger Soviet-style **hammer-and-sickle**
logos and saturated **yellow and blue** inspired by Junge Pioniere. This
supersedes the old cream/ochre emphasis and gear-only or abstract insignia
for newly generated GDR assets. The original board remains a scene/material
reference; the new board governs the identity update.

- Cobalt/Pioneer blue `#2463a5` and warm yellow `#f3ce43` are the signature
  pair. Red `#b93432` carries clear yellow hammer-and-sickle emblems; cream
  `#eadfc6`, brass and cool teal keep the existing painted-comic language.
- Brigadeghul and Uhrwerkläufer are the first regenerated logo-bearing
  enemies. Preserve their silhouettes, feet, poses and gameplay.
- Carry this direction into GDR building facades, entrance crests, flags,
  banners, murals, clockwork landmarks and street props. Keep Berlin
  architecture recognizable, with ivy, gardens, sunflowers and weathering.
- Use an actual crossed hammer and curved sickle when an emblem is called
  for; a cog, gear, flower, slash or generic rune is not a substitute.
- This is a visual direction for the fictional biome. It introduces no new
  mechanics. Prioritize its buildings/assets after the enemy regeneration,
  ahead of unrelated prop production in this continuous session.

## Post-apocalyptic wear (Johannes, 2026-11-10)

The approved colours stay bright and clear, but the world must look used and
broken. This newer direction applies to enemies, buildings and other assets;
the updated Pioneer board includes the wear pass.

- Chip enamel and painted metal at edges; expose rust at rivets, seams and
  lower surfaces. Add dents, scratches, bent/broken covers and visible gears
  or wires. Avoid pristine factory-fresh armour.
- Break or board some window panes, crack/spall plaster, expose brick at
  damaged corners, corrode roof seams and repair patches. Fray banners,
  tear hems and peel mural edges. Ivy and weeds should feel like reclamation.
- Keep blue/yellow as readable colour blocks and hammer-and-sickle emblems
  recognizable. Concentrate damage at plausible stress/water points instead
  of covering everything in a brown or grey filter.
- Uhrwerkläufer should read as a large lumbering clockwork machine, with a
  believable head/body. Brigadeghul should read as a human-sized armoured
  worker, not a tiny suit with an implausibly small head. Match actual
  collision, contact and shield geometry when their scale changes.

## Shared language

| Topic | Rule |
|---|---|
| Look | Painted comic. Dark ink outlines, painterly fills with visible texture, stylized, not realistic. Fun but serious |
| Tone | Gritty enough for zombies. Never bright and friendly, never so dark that the screen is unreadable. Earlier "clean BioShock" directions were rejected as too positive |
| Light | Warm light sources (lanterns, fires, neon) against cool teal or green shadow. Strong warm-cool split in every board |
| Berlin | Recognizable through everyday details: BVG yellow, Trabis, Spätis, Döner, Altbau, Plattenbau, Berlin bear, tiled U-Bahn stations, landmarks |
| Unifier | BVG yellow appears in every board (bus, U-Bahn train, tram). Keep it as the recurring motif across districts |
| Nature | Overgrowth everywhere (ivy, ferns, sunflowers). Reclaimed and unsettling, not cosy |
| Player | One survivor across all districts: dark brown hair, **red scarf**, long brown leather coat, harness with pouches, heavy boots. Districts add one piece (gas tank, cyber arm, clockwork gauntlet) |
| Readability | Characters, enemies, paths and pickups must read at gameplay scale on the Tab S9. Applies to every asset |
| Item colour (v0.52) | The first item sets (B01 to B10, H03 to H07) are starter gear and stay rust, brown and ochre. **Everything new is brighter and more saturated**: each item gets one strong signature colour (enamel red, BVG yellow, cobalt blue, bottle green, violet, cyan, magenta, gold) on a clean light base, so items and outfits tell apart at 48 px and on the 60 px player. Rarer items get more colour, legendaries a glow. Rust and dirt stay as a light overlay, not as the main colour |

## Palettes

Sampled from the board swatches. Approximate (painted texture), use as a starting point, not as exact values.

| Board | Swatches |
|---|---|
| Köpenick | `#f0b27a` cream · `#db8c2b` ochre · `#7b6a32` olive · `#516a62` teal grey · `#8b4a35` rust · `#591e1e` oxblood |
| U-Bahn | `#fac997` cream · `#ed9e25` BVG yellow · `#8f7c45` olive · `#647872` teal grey · `#a7533a` rust · `#7d322d` oxblood |
| Alexanderplatz Pioneer (active, 2026-11-10) | `#2463a5` cobalt blue · `#f3ce43` warm yellow · `#b93432` emblem red · `#eadfc6` cream · `#36585d` teal · `#b58a3d` brass |
| Alexanderplatz original board | `#d4a27e` sand · `#e7982b` ochre · `#736734` olive · `#8a856e` sage · `#af4237` banner red · `#763536` oxblood |
| Potsdamer Platz | `#284652` night teal · `#43d1cf` cyan · `#bd2b77` magenta · `#dfb697` cream · `#e19142` amber · `#9b3e39` rust · `#665b38` olive |

Köpenick, U-Bahn and Alexanderplatz share one six-colour family (cream, ochre, olive, teal, rust, oxblood) and shift only brightness and saturation. Potsdamer Platz adds cyan and magenta on top of the same base. Panel background is a dark teal (`#14282b` to `#20363e`). Alexanderplatz is the exception with a light paper panel.

## Districts

### Köpenick (default, build first)

| Topic | From the board |
|---|---|
| Scene | Dusk on a river quay (Spree/Dahme), ivy-covered Altbau, a Späti and a Döner shop lit from inside, burning barrel, overgrown wrecked BVG bus, rusty Trabi, Ferris wheel and dinosaur figures of an abandoned amusement park in the jungle behind |
| Mood | Velvet noir and western steampunk, green dinosaur jungle, abandoned amusement park (Tivoli feeling) |
| Enemies | Gaunt zombie, skeletal zombie raptor, skeletal zombie T-rex (exposed ribs, torn hide) |
| Props | Wrecked bus, Trabi, tube radio / battery box, lantern |
| Weapon | Pipe with red ribbon |

Real-world hook: Spreepark Plänterwald (next to Köpenick in Treptow-Köpenick) is an abandoned amusement park with a Ferris wheel and dinosaur figures. It fits the board almost one to one.

### U-Bahn (shared underground)

| Topic | From the board |
|---|---|
| Scene | Tiled station with green iron columns, station clock, yellow train with Berlin bear, sandbag barricade, survivor market stalls, daylight falling down the stairs, ghouls on the tracks, tunnel mouth |
| Mood | Metro 2033 in Berlin, less dark and more readable than the inspiration |
| Enemies | Gaunt ghoul, hulking ghoul in an orange work vest, mutated dog |
| NPCs | Gas-mask guard, medic |
| Props | Train car, workbench, sandbags, key ring, lantern |
| Weapon | Brass lamp gun / flamethrower with gas tank on the back |
| Progression | Fight through underground sections first, they become the fast-travel network between districts later |

### Potsdamer Platz / Mitte (in game since v0.47)

| Topic | From the board |
|---|---|
| Scene | Rainy night, magenta and cyan neon, open-air sound system stage, tent roof echoing the Sony Center, street implant clinic, Berlin bear sign, wet reflections |
| Mood | Dark cyberpunk (original artwork #2) plus Berlin techno and bassline culture. Government district meets club underground |
| Enemies | Cable-wired ghoul, hulking brute with pink cables, speaker-headed brute |
| NPC | Clinic doctor with tablet |
| Props | Amp, speaker box, battery pack, cyber arm |
| Weapon | Neon rifle |
| In game (v0.47, code placeholders) | Night tint `4,7,12`, violet-grey ground and concrete, Tiergarten teal-green, neon cyan `#43d1cf`, magenta `#ff4fa3`, amber `#e19142`. Kabelghul, Boxenkopf, Bassprediger, cable brute, Neonflinte, cyber arm for implants. Painted sprites still to come (Codex) |

### Alexanderplatz / GDR (in game since v0.49)

| Topic | From the board |
|---|---|
| Scene | Daylight, Plattenbau with socialist mural, Weltzeituhr turned clockwork, Fernsehturm, greenhouses, overgrown tram on a viaduct, red banners, sunflowers, market |
| Mood | The GDR survived as a working socialist society: concrete, gardens, clockwork order, "GDR fun". Some BioShock retro-futurism, but darker |
| Enemies | Clockwork walker robot, root / plant creature, big clockwork mech |
| NPC | Older gardener with apron |
| Props | Greenhouse, tram, Weltzeituhr, radio, wind-up key, secateurs |
| Named places | Alexanderplatz, Hackescher Markt, central Spree, Berliner Dom, Palast der Republik (inspiration, not a list of required maps) |
| In game (v0.49, code placeholders) | Daylight, sand and ochre ground, cream Zuckerbäcker blocks with red banners on the Karl-Marx-Allee, Palast der Republik with a greenhouse vault, Fernsehturm with a gear rim, Weltzeituhr as clockwork, sunflower field, greenhouses. Uhrwerkläufer, Wurzler, Kernspeier, Brigadeghul, boss Der Volkseigene Koloss, gardener NPC still open. Mockup `mockups/v049-alexanderplatz-geo.html`. Painted sprites still to come (Codex) |

## What it means for the game

### Fits what already exists

| Game today | Board match |
|---|---|
| Köpenick start, Altstadt, Spree and Dahme (v0.40) | Köpenick quay scene |
| Späti safe room, Döner food buff, Trabis, BVG buses, trams (v0.26, v0.35) | Köpenick and U-Bahn props |
| Dark zones at U-Bahn entrances, torch only with one-handed weapons (v0.10) | U-Bahn lantern and lamp gun |
| Roadmap #8 U-Bahn waypoints | U-Bahn combat-to-travel progression |
| Roadmap #4 Potsdamer Platz (mockup D: neon, rain, implant clinic, cable enemies) and the locked Implantat slot (v0.39) | Potsdamer board, almost exactly |
| Heuler buffs nearby enemies | Speaker-headed brute (bass as buff) |
| Brocken (brute), Ratte packs | Orange-vest hulk, mutated dog |
| Oma Gerda (survivor) | Alexanderplatz gardener |
| Mitte (v0.47): Reichstag, Tor, Tiergarten, Potsdamer Platz neon core, Bassprediger | Potsdamer Platz board: stage, clinic, Wall with bear, cable enemies, speaker head, rain, implants (cyber arm) |
| Xhain (v0.42 to v0.45): Berghain, Hochbahn U1, Warschauer Straße station | Techno details from the Potsdamer board, U-Bahn board for the station |

### Conflicts to resolve

| Conflict | Handling |
|---|---|
| Boards are eye-level illustrations with front/back character views. The game is 2:1 isometric | Boards define look, palette, materials and design. Camera, scale and anchors stay as in `pipeline/workflow.md` |
| Boards are very detailed and textured | Simplify for sprites: keep silhouette, ink outline and main colour blocks, drop small texture. Check every asset at 64 px |
| Pipeline doc used Hades as the closest reference | Hades stays the reference for outline and readability. The boards replace it for palette, mood and Berlin detail |
| "Mitte" appears for both Potsdamer Platz and Alexanderplatz | Decided v0.47: in-game Mitte is the government district from Reichstag to Potsdamer Platz with the Potsdamer Platz board (cyberpunk). Alexanderplatz becomes its own future district with the GDR clockwork board |
| Steampunk and clockwork in Köpenick vs. Alexanderplatz | Köpenick: western steampunk gear (brass, leather, tubes). Clockwork order and machines belong to Alexanderplatz |

### Proposals (not decided)

| Proposal | Why |
|---|---|
| Spreepark zone in Köpenick (Ferris wheel, dinosaur figures, jungle lot type) | Real place next door, matches the board |
| Zombie raptor: fast pack enemy with a telegraphed pounce | Uses existing Raser / Flink patterns, gives Köpenick its own enemy |
| Zombie T-rex as Köpenick mid-boss or elite, Hauptmann stays district boss | Big readable threat, keeps the Köpenick lore |
| Red scarf as the player's signature on every gear look | Board identity. **Done**: code-drawn player wears a red scarf unless the armour sets its own colour |
| U-Bahn station as an authored set piece with a market (safe room like the Späti) | Board scene, roadmap #8 |
| Lamp gun as a weapon that lights dark zones | Board weapon, ties into the torch rule |
| District palette per biome in code (ground, walls, light tint) taken from the swatches | Quick visual alignment before painted assets exist. Needs a mockup first |
| Alexanderplatz enemies: clockwork walkers as armoured or shield types, root creatures that root the player | Different answers instead of more HP (pacing pillar) |

## Design source for new characters and props (v0.62)

New enemies, NPCs and props are designed from the **style boards** (`docs/style/`) and this bible, not from the code-drawn placeholders in `js/` (the canvas/SVG drawings made by Claude limit the result: same bodies, same proportions). Each batch starts with a **style canvas** (palette, materials, line weight, lighting, 3 to 5 silhouette thumbnails per family) that Johannes approves, then Codex paints new designs from it. The old drawing only supplies gameplay data (footprint, anchor, telegraph origin). See `pipeline/workflow.md` step 3.

## Production order

1. Köpenick: player, representative environment (Altbau, Späti, Döner, bus, Trabi), zombie, then dinosaurs.
2. Validate in game on the Tab S9: mood and visibility.
3. U-Bahn on the same base, keep the combat-to-travel role.
4. Potsdamer Platz and Alexanderplatz later from their boards.

Asset rules, folder layout and renderer contract: `pipeline/workflow.md`.

## Still open

Outline weight in px at game scale, scale chart image, two do and two don't examples (step 2 of the asset pipeline). Do these with the first Köpenick sprite batch.
