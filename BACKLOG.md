# Ruinenstadt Backlog

Top-down loot ARPG in post-collapse Berlin. Hobby project to learn game development.
Current build: single-file HTML artifact (v16). Game text in German.

## Intent (working version, refine as we go)

- **Fantasy:** a survivor reclaiming Berlin district by district, getting visibly stronger through loot.
- **Pillars:** satisfying combat feel, loot worth reading, a reason to go one more run.
- **Difficulty:** fun first, not punishing. Hard mode is opt-in.
- **Session shape:** playable in 5–15 minute phone sessions, one-handed-ish controls.
- **Inspirations:** Diablo 2 (loot, rarity), Hades (perks, dash, run structure), Subnautica (survival, exploration), Minecraft (crafting, base).
- **Out of scope for now:** multiplayer, open world, story dialogue trees, 3D.

## Shipped: v4 "Look and feel"

| Item | Notes |
|---|---|
| New character art style | Style chosen via mockup, applied to player, ghoul, brute, spitter, both bosses |
| Visible gear on player | Armor changes silhouette and color (jacket, vest, helmet, coat), weapon model per item base |
| Better item icons | Distinct icon per item base (pipe vs machete vs crowbar), rarity frame |
| Walk and attack animation | Leg swing, body bob, wind-up and follow-through on swings |
| Environment variety | Trees, shrubs, weeds through asphalt, benches, lamp posts, trash bins, graffiti |
| Destructible props | Crates and bins break on hit, drop Schrott, sometimes loot |
| Enterable Späti | One small shop per district. Roof fades when you walk in, loot crates inside |
| Difficulty setting | Leicht / Normal / Schwer. Enemy HP and damage multipliers, better loot on Schwer |
| Salvage buttons | Salvage by rarity, plus "salvage everything that is not an upgrade" |
| Bigger backpack | 12 → 18 slots until the stash exists |
| Cloud save | Artifact `db` capability, save tied to the Claude account, works across devices. localStorage fallback when signed out |

## Shipped: v5 "Build depth"

| Item | Notes |
|---|---|
| Item affixes with trade-offs | Items roll 1–3 affixes, some negative (+30% damage, −10% speed). No more "always equip the higher number" |
| Elements and resistances | Fire, acid, shock. Weapons and perks carry elements, enemies have weaknesses and resistances |
| Element-aware perks | Hades-style synergies (fire spreads on kill, shock chains, acid lowers armor) |
| Stash | 40+ slots, accessed from the camp, separate from the backpack |
| Camp hub screen | Home base between runs: stash, workshop, later NPCs |
| Item compare with trade-offs | Detail card shows gains in green and losses in red per stat |

## Next: candidates for v17

| Item | Notes |
|---|---|
| Move to repo + PWA | GitHub Pages, manifest and service worker, home-screen install, offline. Supabase for cloud save outside claude.ai |
| Split the file | One HTML file is ~130 KB. Split into modules (world, combat, items, ui) once in a repo |
| Walkable camp hub | Upgrade the drawn camp scene into a walkable hub |
| Balance pass | Tune threat scaling and elite frequency with real play data |

## Later

| Theme | Items |
|---|---|
| Light and darkness | Dark zones (U-Bahn tunnels, basements) that need a torch. Torch takes the off-hand, so only one-handed weapons |
| Survival | Hunger, food drops, cooking at the camp fire |
| Crafting | Recipes from Schrott and materials: bandages, torches, weapon mods |
| Safe zones | Camp where no enemies spawn, unlockable per district |
| NPCs and quests | Simple quest givers in the camp (kill X, find Y, reach landmark). Quest log |
| Map | District map with landmarks, crates, quest markers. Minimap in HUD |
| More enemy variety | Elites with modifiers (fast, burning trail, splits on death), new type per district |
| More districts | Neukölln, Prenzlauer Berg, Spandau. One landmark each |
| Juice | Hit-stop on crits, corpses that linger, screen flash on boss phases |

## Parking lot (unsorted ideas)

- Weapon mastery: using a weapon type levels it up
- Daily challenge run with fixed seed
- Achievements
- Day and night cycle per run

## Tech decisions

| Topic | Decision or open question |
|---|---|
| Platform now | Single HTML file as Claude artifact, built from phone via voice |
| When to move | After v4. The file is around 900 lines, further art quality needs real sprites and a proper repo |
| Move to | GitHub repo + Claude Code on desktop. Later Godot (free, 2D and 3D, GDScript) |
| Art later | Free asset packs: Kenney.nl (CC0), itch.io. Sound: jsfxr for effects |
| Save outside claude.ai | Artifact `db` only works inside claude.ai. On GitHub Pages: Supabase (auth + database, free tier) is the simplest. Alternative: Cloudflare Pages + Worker + D1/KV behind Cloudflare Access. Check current free tiers before choosing |
| Save fallback | Export and import a save code (copy and paste text) needs no backend at all |

## Done

| Version | Contents |
|---|---|
| v1 | Movement, auto-aim melee, waves, rarity loot with auto-equip, levels |
| v2 | Districts with 10 waves and 2 bosses, supply crate event, grid inventory, workshop upgrades, 3 weapon types, talismans, dash, spitters, pause, synth sound, buildings, lighting, save |
| v3 | Performance pass and battery mode, perk choice after each wave (16 perks), weapon skills, landmarks per district |
| v4 | Three-quarter-view characters with visible armor and weapon models, walk and swing animation, new item icons, trees, lamps, graffiti, benches, destructible crates and BSR bins, enterable Späti per district, difficulty setting, salvage by rarity and "all without ▲", 18-slot backpack, cloud save via artifact db |
| v5 | Affixes incl. trade-off pacts, armor implicits, elements (fire burn, acid weakens, shock chains) with enemy weaknesses and immunities, 8 element and defense perks, Kampfkraft score with full stat compare, 40-slot stash in camp |
| v6 | Elite enemies with 4 modifiers (Flink, Brennend with fire trail, Spaltend, Gepanzert), boss rage phase at 50% HP, hit-stop on crits and big kills, lingering corpses, weapon mastery per weapon type (+4% damage per level, faster skill at 5), Aufträge from Ilse von der Kiezwache (11 quest types, rewards, reroll) |
| v7 | Minimap, mid-run events (ambush, wandering trader with shop, radio-signal capture zone), low-HP vignette, new quest types |
| v8 | Consumables (bandage, Molotov) on quick buttons and craftable in the Werkstatt, Döner food buff, Raser charger enemy with telegraph, 5th district Neukölln with Hermannplatz |
| v9 | Threat levels as endless endgame (clear a district to unlock the next level, +25% enemy HP and +3 item levels per step), generative ambient music with toggle, lifetime records, in-run controls hidden in camp |
| v10 | Dark zones at U-Bahn entrances with cellar chests; automatic torch only with one-handed weapons (hammer leaves you in the dark) |
| v11 | Unique powers on all 6 legendaries (fire burst on crit, acid wave, chaining projectiles, double supplies, block chance, cheat death) |
| v12 | Two 3-piece sets (Kiezwache, Spreegeist) with 2/3-piece bonuses, item lock, Umschmieden (reroll stats for Schrott) |
| v13 | Unique wave-10 boss per district: Hauptmann von Köpenick (summons squads), Spreehexe (acid pools), Turmwächter (shock charge), Fliegerkönig (air strikes), Brandmeister (fire trail); guaranteed legendary drop |
| v14 | Camp building: 6 structures with permanent bonuses, drawn camp scene in the menu |
| v15 | 11 achievements with Schrott rewards, shown in the quests tab |
| v16 | One-time onboarding tips at first run, loot, sets, perks, elites, bosses, weaknesses, consumables and off-screen targets |
