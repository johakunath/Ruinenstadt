# Story: Der Stillstand (decided by Johannes, 2026-11-11)

Source of truth for the story backdrop, district eras and the tone of NPCs and art. Story stays light: artefacts, tapes, plaques, one line per NPC, no dialogue trees (see `BACKLOG.md` › Intent). The two discarded directions (B Das Myzel, C Die Kiezfürsten) are at the end for reference.

## Premise

The GDR never fell. Its last big project, the **Zeitnormal**, ran every clock in Berlin from the Weltzeituhr, with the Fernsehturm as its antenna. One night it broke. Every district slipped into a different time and froze there. Time is not gone; it runs in each district in its own era, and the edges between districts are where eras grind against each other (ruins, overgrowth, things that should not exist together).

- **Zombies everywhere: die Zeitlosen.** People who stood between two seconds when the clock broke. Their own time ran out while the world around them stopped, so they rot and keep walking. That is why ghouls, brutes and spitters appear in every district, whatever its era. Era-specific enemies come on top (dinosaurs, clockwork, Kabelghule).
- **The player:** a Schaffner of the last U-Bahn that still runs on **Normalzeit**. Freeing a line pulls a district back into the present, which is why the U-Bahn network is the progression.
- **Bosses:** each holds one **Zahnrad** (gear wheel) of the Weltzeituhr. A boss kill returns it; the camp gets its gears back one by one.
- **Blessings:** **Zeitsplitter**. The Litfaßsäulen catch them; the hidden blessings are splinters that fell into corners.
- **Camp (S+U Warschauer Straße):** a station on Normalzeit. Survivors who wash up there come from different eras, which explains the mixed NPC cast.
- **Finale:** back up the Fernsehturm with all gears. The ending choice: restart the clock (everything returns, the old order too) or leave the city in its times.

## Districts and eras

| Order | District | Era (intro banner, network map and district card: „District · Year“, `ERA` in `js/data.js`) | Hook | Boss (now) |
|---|---|---|---|---|
| 1 | Köpenick | Urzeit (banner and map) | Where the clock broke first, it spun backwards the furthest: jungle and dinosaurs grew back between the Altstadt ruins, the Zeitlose of Köpenick wander among them, and the Hauptmann of 1906 was dragged along on the way down, now commanding both. Köpenick shows the Stillstand at its rawest, which is why it is the start | Hauptmann von Köpenick |
| 2 | Xhain | 1981, West Berlin squats | Squats, punks, Spree, Wrangelkiez; the Spreehexe as a punk witch of the squats | Spreehexe |
| 3 | Alexanderplatz | 1989, frozen in autumn | The GDR that kept going and grew wild, clockwork, pioneers, daylight | Volkseigener Koloss |
| 4 | Mitte / Potsdamer Platz | 2089, neon future | Rain, implants, Kabelghule, the club cult | Bassprediger |
| 5 | **Wedding** | **The eternal "soon"** (banner/board: **kommt bald**, corrected 2026-11-13) | See below | banquet boss concept below |
| 6 | **Tempelhof** | **1948, airlift** | Airfield, hangars, airport building, Rosinenbomber ghosts circling, cargo cult around the planes, kites on the Feld | Fliegerkönig |
| 7 | **Charlottenburg** | **1920, Golden Twenties** (decided 2026-11-12) | Ku'damm cabarets and cinemas, Art Deco, jazz, Ringverein gangsters; the Schloss as the boss arena | new |
| Finale | Fernsehturm | All eras at once | The clock room in the sphere | new |

Spandau and Marzahn are dropped (Johannes, 2026-11-11). Their content stays in the game as loot and enemies: the Zitadelle set can drop everywhere, the Zitadellenritter and Plattenkönig can return as elites or as a boss of a new district. The two grid placeholders stay until Wedding and Charlottenburg exist (district index, saves and telemetry depend on the order; migrate in one step).

### Wedding: the eternal "soon"

The running joke: "Wedding kommt" has been said for decades. In the Stillstand Wedding is stuck in a near future that never arrives: scaffolding everywhere, cranes that never finish, billboards for lofts that never open. The streets belong to the people who always lived there: Turkish, Lebanese and Arab families, Teestuben, shisha bars, barbers, bakeries, gold shops, wedding halls (Hochzeitssäle in Wedding), the Leopoldplatz market, the Panke, the old AEG and Osram halls.

- Tone: affectionate and funny, the Kiez is on the player's side. The locals are allies, traders and quest givers (a family that runs the Teestube, a barber who knows every rumour), never the enemy.
- Initial 2026-11-11 enemy proposal: **Der Ewige Bauherr**, a crane-and-scaffold golem, construction drones, scaffold ghouls and billboard creatures. The 2026-11-13 selected banquet refinement below supersedes this visual emphasis; unfinished developer promises remain the background joke.
- Set pieces: a wedding hall with a party that never ends, a market with stalls as cover, an AEG hall arena.

### Selected district art refinements (2026-11-13)

Wedding C is selected. Strengthen the
lavish gold/emerald banquet and storybook sultan fantasy: flying carpets,
wish lamps, baklava, Döner, shisha and black tea. Exact joke: **“Der Wedding
kommt bald”**; era label **“kommt bald”**, not isolated “bald”. The feast is
playful and extravagant rather than zombie horror. Living neighbours remain
hosts/allies; enchanted tea spirits, pastry golems and animated carpets provide
the absurd conflict. The final board develops **Sultan Nimmersatt / Der Ewige
Gastgeber** as a fictional enchanted banquet sovereign. This is an art concept
superseding the crane-golem emphasis for this direction; no boss replacement,
enemy mechanics or district migration is implemented by a concept board.

Tempelhof refinement (2026-11-13): B's windpilgrim identity is selected. Keep
1948 airlift planes, Feld, terminal and hangars, but emphasize frightening wind
cult ritual, elaborate parachute vestments, spectral planes and dark magic;
less technology and fewer zombie-coded designs. The Fliegerkönig becomes a
wind-priest art concept rather than an engine-armour machine.

Charlottenburg refinement (2026-11-13): combine A's revue and costume spectacle
with C's mirror/Schloss fantasy. Silver, diamonds, glass creatures and elaborate
stage gowns dominate; much less gold. The Diamantene Diva is the legendary
boss art concept. 1920 and the Schloss's localized baroque bleed remain.

All three refined boards omit BVG branding, transit livery and transit-costume
motifs. These visual selections do not rewrite the shared Zeitnormal premise.

### Charlottenburg: which period

| Option | Look | Fits |
|---|---|---|
| **1920s, Golden Twenties (recommended)** | Ku'damm with cabarets, cinemas, neon signs of the time, Art Deco, jazz, gangsters, flappers; the Schloss lit up for a never-ending revue | Ku'damm is at its most iconic in this decade; strong contrast to the prehistoric east and the GDR; the boss can be a revue queen or a Ringverein boss in the Schloss |
| Prussian baroque, around 1700 | Schloss Charlottenburg as built for Sophie Charlotte, baroque garden, powdered wigs, court automatons | Strongest for the Schloss, weaker for the Ku'damm (did not exist), and automatons overlap with the Alexanderplatz clockwork |

Decided (Johannes, 2026-11-12): 1920s for the district, with the Schloss as the place where it bleeds into baroque (garden labyrinth, mirror halls) for the boss.

## NPCs and art follow the eras

Art direction (2026-11-13): [district boards](district-design-directions.md)
record the selected Tempelhof B, Wedding C and Charlottenburg A+C directions,
their three final refinements and the historical nine alternatives. New named
enemies, bosses and equipment are art concepts, with no stats or mechanics
implemented by these documents.

- Camp NPCs come from different eras (Oma Gerda from 1989, Lin from the neon future, Jonas the Schwarzmarkt dealer from the 1920s, Ilse from the Kiezwache of the present ...). Write their one-liners from that (station quests and NPC lines, #36/#39).
- Every district palette, enemy family and prop set follows its era; the shared post-apocalyptic wear from `docs/style-bible.md` stays on top of it.
- Story artefacts per district (#14): a tape, a plaque or a timetable page from that era that explains one piece of the Stillstand.

## Discarded directions (2026-11-11)

- **B. Das Myzel:** a fungus network from the Spree rebuilds districts from memories; the player has no memory; finale under the Tempelhofer Feld.
- **C. Die Kiezfürsten:** after one night of total blackout every district is a small state of a Berlin-cliché prince; the player is the last BVG courier; finale at BER.
