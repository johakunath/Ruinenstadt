# Ruinenstadt Backlog

Top-down loot ARPG in post-collapse Berlin. Hobby project to learn game development. Game text German. Versions `v0.N`.

## Intent

- **Fantasy:** a survivor reclaiming Berlin district by district, visibly stronger through loot.
- **Pillars:** satisfying combat feel, loot worth reading, a reason for one more run.
- **Difficulty:** fun first, not punishing. Hard mode opt-in.
- **Session:** 5 to 15 minutes. Devices: Galaxy Tab S9 first, Xiaomi 17 phone second. Later Xbox controller, Steam Deck, 2K monitor.
- **Inspirations:** Diablo 2/3 (loot, acts), Hades (dash, boons, weapon = playstyle, hand-drawn look), V Rising (boss-gated unlocks, base), Valheim (weak to strong), Enshrouded (authored points of interest).
- **Out of scope:** multiplayer, 3D, hunger as a timer, story dialogue trees.

## Playtest 1 (v0.34, Tab S9 portrait, 15 min Köpenick)

Fun, "almost something to show friends". Lighting and floors good. Item looks on the character good.
Problems: environment scale (cars smaller than player), pure top-down props vs side-view characters, grid-like streets, only 3 equipment slots, Normal too easy, text not wrapping on tablet (fixed v0.35).

## Next

Focus: gameplay and content. Art runs in parallel through Codex (`docs/asset-pipeline.md`).

| # | Item | Notes |
|---|---|---|
| 1 | Isometric view (mockup C chosen) | Next session. Rework renderer, collision and map generator for 2:1 isometric. Environment bigger than ×2, longer levels are fine, rebalance afterwards. Check every drawn object by screenshot: a car must read as a car |
| 2 | Equipment: 8 slots | Weapon, head, body, hands, feet, talisman, ring, implant (one ring: two ring slots are too fiddly). Implant unlocks at Potsdamer Platz. New bases, paper doll, compare, save migration, rebalance |
| 3 | Geographic districts | Köpenick first, mockup `mockups/v035-scale-slots-map.html` approved with fixes: no road in the water (the grey line along the Spree is wrong, roads go on land), cleaner Altstadt peninsula. Müggelsee huge in the east, Spree from Friedrichshagen, Dahme from the south, forest south-east, camp at Lindenstraße. Then the other districts |
| 4 | Potsdamer Platz cyberpunk district | Mockup D approved: neon, rain, implant clinic, cable enemies |
| 5 | Balance: Normal harder | "Pretty easy, upgrades come quickly". Run telemetry first |
| 6 | Elite tactics | Telegraphs and punish windows on elites and some types. Fodder stays fast |
| 7 | Weapon = class | Each weapon type 2 to 3 skills, pick 1 before a run. Touch stays at 4 buttons |
| 8 | Zones and U-Bahn waypoints | District = 2 to 3 zones of 5 to 10 min, U-Bahn as save point and town portal |
| 9 | Controller support | Gamepad API for Xbox and Steam Deck (browser), stick aiming, assists per input device |
| 10 | AI-maintainability review | Code and docs readable for Claude and Codex with few tokens |
| 11 | Walkable camp hub | Mockup first. Lives at Lindenstraße in Köpenick |
| 12 | Sound files | jsfxr samples instead of synth |
| 13 | Run telemetry | Local run log (deaths, cause, time per wave), exported with the save code |
| A | Asset pipeline (Codex) | Hand-painted isometric art. Steps, order and prompts in `docs/asset-pipeline.md`. Step 1: 3 to 5 style references, Johannes picks |
| - | GitHub Pages | When playtesting outside the dev setup |

## Ideas by theme

| Theme | Ideas |
|---|---|
| Pacing | Some enemies with tactics instead of more HP: telegraphed attacks, punish windows, flanking, retreat. Short calm phases between fights. Safe rooms (Späti) |
| Enemy roles | Types that need a different answer, not more DPS (shield, charger, buffer exist). Element enemies that make resist gear matter for a whole district |
| Build depth | Weapon = class (Hades model): each weapon type with 2 to 3 skills to choose from. Blessings that stack into overpowered builds. Optional skill tree later. Unlockable starting characters as an alternative |
| Gear | More equipment slots (now 3: weapon, armor, talisman). Sockets for gems or implants that slot in and out freely (Cyberpunk 2077 cyberware) |
| Food and buffs | Eat from the inventory while paused, stackable meal buffs. Shrines with short invincibility or power spikes |
| World structure | Longer districts. Fight your way to the next zone (Diablo acts), U-Bahn stations as waypoints and town portal. Authored set pieces: U-Bahn dungeon, rooftop, bunker |
| Quests | Pick up and hand in at NPCs. Quest chains with a light story per district |
| Base | Barricades and turrets (camp raid event, or placed mid-run). Boss kills unlock camp stations or skills (V Rising) |
| Day and night | Real cycle with gameplay differences (night: stronger enemies, better loot, need light) |
| Setting | Cyberpunk-Fallout mix: a neon district, implants as abilities. Keep one coherent style |
| Feel | Hit flash, knockback, per-weapon screen shake, perfect-dodge slow motion, persistent decals |
| Platforms | Gamepad API (Xbox, Steam Deck in browser), faster pace and aim with the stick on controller, high-detail graphics mode for big screens |
| Research | Benchmark more games only when ideas run out |

## Design decisions (v0.34 interview)

| Question | Decision |
|---|---|
| Pace | Fast fodder, smart elites: telegraphs and punish windows on elites and some types, calm phases between waves, safe rooms |
| Builds | Weapon = class (Hades model), blessings stack into strong builds |
| Structure | Districts of 2 to 3 zones with U-Bahn waypoints, sessions stay short |
| Still open | Cyberpunk-Fallout elements yes or no (decide with the art mockups). Touch vs controller: one game with assists per input, or a separate desktop version |

## Tech

| Topic | Decision |
|---|---|
| Platform | Static PWA, no build step, GitHub repo, developed with Claude Code |
| Release | Bump `VERSION` (`js/core.js`) and `CACHE` (`sw.js`), add a row to Done |
| Save | localStorage plus save code. Supabase only when cross-device saves matter |
| Balance | Bot: `node tools/balance.mjs 30 1` with the local server running. Last result (v0.29): Leicht about 8 runs for all 8 districts, Normal 10 to 15, Schwer about 20 |
| Art and sound | Painted look needs an image model (for example ChatGPT image generation via Codex, or Midjourney, Leonardo, Scenario) with a fixed style sheet and prompt templates, transparent PNGs. Canvas draws sprites fine, no engine needed. Sound: jsfxr |
| Later engine | Godot if the browser limits us (for example a high-end desktop version) |

## Done

| Version | Contents |
|---|---|
| v0.1 | Movement, auto-aim melee, waves, rarity loot with auto-equip, levels |
| v0.2 | Districts with 10 waves and 2 bosses, supply crate event, grid inventory, workshop upgrades, 3 weapon types, talismans, dash, spitters, pause, synth sound, buildings, lighting, save |
| v0.3 | Performance pass and battery mode, perk choice after each wave (16 perks), weapon skills, landmarks per district |
| v0.4 | Three-quarter-view characters with visible armor and weapon models, walk and swing animation, new item icons, trees, lamps, graffiti, benches, destructible crates and BSR bins, enterable Späti per district, difficulty setting, salvage by rarity and "all without ▲", 18-slot backpack, cloud save via artifact db |
| v0.5 | Affixes incl. trade-off pacts, armor implicits, elements (fire burn, acid weakens, shock chains) with enemy weaknesses and immunities, 8 element and defense perks, Kampfkraft score with full stat compare, 40-slot stash in camp |
| v0.6 | Elite enemies with 4 modifiers (Flink, Brennend with fire trail, Spaltend, Gepanzert), boss rage phase at 50% HP, hit-stop on crits and big kills, lingering corpses, weapon mastery per weapon type (+4% damage per level, faster skill at 5), Aufträge from Ilse von der Kiezwache (11 quest types, rewards, reroll) |
| v0.7 | Minimap, mid-run events (ambush, wandering trader with shop, radio-signal capture zone), low-HP vignette, new quest types |
| v0.8 | Consumables (bandage, Molotov) on quick buttons and craftable in the Werkstatt, Döner food buff, Raser charger enemy with telegraph, 5th district Neukölln with Hermannplatz |
| v0.9 | Threat levels as endless endgame (clear a district to unlock the next level, +25% enemy HP and +3 item levels per step), generative ambient music with toggle, lifetime records, in-run controls hidden in camp |
| v0.10 | Dark zones at U-Bahn entrances with cellar chests; automatic torch only with one-handed weapons (hammer leaves you in the dark) |
| v0.11 | Unique powers on all 6 legendaries (fire burst on crit, acid wave, chaining projectiles, double supplies, block chance, cheat death) |
| v0.12 | Two 3-piece sets (Kiezwache, Spreegeist) with 2/3-piece bonuses, item lock, Umschmieden (reroll stats for Schrott) |
| v0.13 | Unique wave-10 boss per district: Hauptmann von Köpenick (summons squads), Spreehexe (acid pools), Turmwächter (shock charge), Fliegerkönig (air strikes), Brandmeister (fire trail); guaranteed legendary drop |
| v0.14 | Camp building: 6 structures with permanent bonuses, drawn camp scene in the menu |
| v0.15 | 11 achievements with Schrott rewards, shown in the quests tab |
| v0.16 | One-time onboarding tips at first run, loot, sets, perks, elites, bosses, weaknesses, consumables and off-screen targets |
| v0.17 | Moved to GitHub repo, split into CSS and JS modules, PWA (manifest, service worker, offline, install), save code export and import, version shown in menu |
| v0.18 | Tablet pass (Galaxy Tab S9): world zoom for big screens, sharper rendering, larger HUD, controls and joystick, fullscreen and screen wake lock. Camp menu in two columns with a Berlin district map and district card. Inventory with paper doll, full stat sheet, side-by-side detail and compare, Kodex tab for enemies, bosses and elites |
| v0.19 | World 2400×2400 (was 1600). Random road layouts per run, 12 lot types (Altbau, Hinterhof, Plattenbau, Markt, Park with ponds, Wald, Kleingärten, Trümmerfeld, Baustelle with crane, Parkplatz, See, Rollfeld with plane wreck). Biome weights, grass and trees per district. Weather per district (fireflies, rain, ash, dust, embers), animated water, Spree across the whole map. Spatial grid for wall collisions |
| v0.20 | Five new enemy types: Ratte (packs), Zünder (fuse and blast, hurts enemies too), Schildträger (frontal shield, flank or stun with hammer), Krähe (flies over walls, dives), Heuler (buffs nearby enemies). Enemy mix per district. Three new districts with landmarks and bosses: Prenzlauer Berg (Wasserturm, Rattenmutter), Spandau (Zitadelle, Zitadellenritter with shield and charge), Marzahn (Hochhaus, Plattenkönig with falling slabs and Zünder). Weather: leaves, fog, snow. New jobs, achievement, Kodex entries |
| v0.21 | Game feel: loot arcs out with bounce and lands with name labels on the ground in rarity colour, legendary drops with gold flash, fanfare and taller beam. Smooth camera with look-ahead. Kill streak counter with Schrott bonus from 10 kills. Dusk to night across the 10 waves. Heartbeat at low life, footstep dust, popping crit numbers, enemies-left counter in the HUD |
| v0.22 | Combo finishers: every 3rd blade swing is a wide heavy finisher, every 3rd hammer blow adds a stunning quake, every 4th sling shot pierces 3 enemies. Litfaßsäulen: 3 advertising columns per map grant a 45 s blessing (Adrenalin, Eisenhaut, Goldrausch, Rückenwind, Funkenflug), shown in the HUD. Map tab in the pause screen with landmarks, Späti, dark zones, columns, enemies and area names. New job |
| v0.23 | Crafting: four materials (Stoff, Metall, Chemie, Kabel) drop from enemies by type, elites, bosses and crates. Seven weapon mods (Aufsätze) built in the Werkstatt from materials and Schrott: Nagelband, Griffband, Gegengewicht, Autobatterie, Benzintank, Säurephiole, Stacheldraht. Weapons have one mod slot, rare and set weapons two. Element mods give an element or +20% elemental damage |
| v0.24 | Loot expansion: six new legendaries with powers (Klinge der Zitadelle, Plattenbrecher, Krähenschleuder, Mantel der Rattenmutter, Rüstung des Zitadellenritters, Auge des Fernsehturms), third set Zitadelle (Morgenstern, Kettenhemd, Wappen), new icons, weapon models and armor looks. Kodex collection of legendary finds and set pieces |
| v0.25 | Events: Gefangene befreien (guards with an elite, rescued survivor moves into the camp), Schatzversteck (timed treasure hunt with arrow), Rattenflut (rat horde). 3 events per run (4 with Funkmast). Six survivors with permanent bonuses (Dr. Ahmet, Mira, Jonas, Oma Gerda, Lin, Kalle), shown at the campfire and in the Werkstatt |
| v0.26 | Cityscape: vehicle variety (Trabis, vans, BVG buses, trams on the tracks), roof details (chimneys, satellite dishes, solar panels), coloured neon glows (street lamps, Späti sign, U-Bahn signs), flickering lamps |
| v0.27 | Blessings: 8 new (Kombo-Meister, Plünderer, Schildbrecher, Sprengmeister, Atempause, Gnadenstoß, Sammler, Rausch), rare and epic cards that grant two levels, one reroll per wave for Schrott, three-column card layout on tablets |
| v0.28 | Endless mode for liberated districts (bosses every 5 waves, events every 3 waves, Schrott bonus per wave beyond 10, record per district). Music: own chord progression and melody scale per district, drums during boss fights |
| v0.29 | Balance pass with a bot simulator (tools/): enemy life now scales with item level like player damage, +20% enemy life and damage per district, +6% enemies per wave per district, Schärfen +7% per level (was 10%), Holzlatte 5 damage, softer mid-boss (520 life, 20 damage, slower glob ring, -25% in Köpenick), boss contact damage -40%, crows hover after diving, stuck enemies relocate, arrows to the last 3 enemies of a wave |
| v0.30 | Fourth weapon type Speer (Rohrspeer, Fahnenstange, Harpune): long narrow thrust hits everything in a line, finisher lunges forward, skill Wurf throws a piercing spear, two-handed (no torch). Legendary Speer der Siegessäule shoots a golden blade with each thrust. Spear mastery |
| v0.31 | Lagerfeuer cooking: one meal per expedition (Erbsensuppe, Currywurst, Filterkaffee, Soljanka, Spreewaldgurken) for a run-long bonus. Stirnlampen-Werkstatt camp building lights dark zones for two-handed weapons. 7 new achievements (all survivors, streak 50, endless wave 20, all legendaries, 3 mods, spear mastery, threat 5) |
| v0.32 | Tageskampf (daily challenge, unlocks after the first liberation): seeded map and spawns per day, district and two of seven modifiers chosen by date (Blutmond, Elitenacht, Glaskanone, Stromausfall, Goldrausch, Horde, Eiserne Haut), score from kills, waves and victory, best score per day |
| v0.33 | Balance: enemy damage grows +16% per district instead of +20%, so late districts no longer double the hits you take relative to your life |
| v0.34 | Auto-attack (on by default on touch, toggle in options and pause), drag the skill or Molotov button to aim with a preview, tap still auto-targets. Short haptic pulses on taking damage (Vibration: aus, leicht, stark). AGENTS.md points to CLAUDE.md |
| v0.35 | Späti as barricaded safe room (S2): bigger, sandbags, shutter, oven, workbench, radio. Inside: shutter keeps enemies out, no damage, slow healing, 60 s calm per wave, then the shutter gives way. Fix: text did not wrap on tablets (`.tab` CSS class collided with `body.tab`) |
| v0.36 | Späti shelves and fridges show bottles, cans, chip bags and boxes. Asset pipeline handover for Codex in `docs/asset-pipeline.md` |
