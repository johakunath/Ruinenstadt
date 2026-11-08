# ChatGPT asset batches

Work order for generating menu art (item icons, portraits) with ChatGPT image generation. One batch = one image = one step. Johannes hands the finished sheets to Claude, who cuts and integrates them. In-world sprites (player, enemies, buildings, vehicles) are not part of this; they follow `docs/asset-pipeline.md` with Codex.

## How to work

1. Read this file and `docs/style-bible.md`.
2. Look at `docs/style/koepenick.png` (main style reference). If you cannot open images from the repository, ask Johannes to attach it.
3. Generate **exactly one batch per step**, the one Johannes names (or the next one after the last finished batch). Do not combine batches.
4. After each image, say the batch ID and the file name to save it as. Then stop and wait.
5. If a cell fails (wrong object, merged cells, unreadable), regenerate the whole batch rather than patching.

## Sheet format (all batches)

| Rule | Value |
|---|---|
| Canvas | 1536 × 1024, landscape |
| Grid | 4 columns × 2 rows = 8 equal cells of 384 × 512 (icon batches). Portrait batches: 3 columns × 2 rows = 6 cells of 512 × 512 |
| Cell | Object centred in the upper square part of the cell, filling about 75% of it, never touching the cell edge or a neighbour |
| Label | Below each object, a dark strip with the cell **ID** in large plain white capitals (for example `I01`). Only the ID, no item name, so the text stays clean |
| Background | Flat, even dark teal `#1e3238` behind every object. No scene, no gradient, no texture, no frames, no drop shadows |
| Separation | Thin even gaps between cells so they can be cut on a fixed grid |
| Order | Left to right, top row first, exactly in the order listed |
| File name | `assets/raw/<batch ID>.png`, for example `assets/raw/B01.png` |

## Style block

Paste in front of every batch:

> Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream `#f0b27a`, ochre `#db8c2b`, olive `#7b6a32`, teal grey `#516a62`, rust `#8b4a35`, oxblood `#591e1e`. Worn, used, improvised, but readable. Every object must still read as a clear silhouette when shrunk to 48 pixels.

Icon batches add: *"Each cell shows one inventory icon: a single object in 3/4 view from slightly above, all at the same scale and lighting."*

Portrait batches add: *"Each cell shows one bust portrait (head and shoulders, 3/4 view), same framing and eye height in every cell."*

## Batches

Descriptions in brackets are hints for the look. German names are the in-game names.

### Icons: weapons

| Batch | Cells |
|---|---|
| B01 | I01 Holzlatte (wooden plank with nails) · I02 Rostiges Rohr (rusty pipe with a red ribbon on the grip) · I03 Bewehrungsstahl (bent rebar with tape grip) · I04 Machete · I05 Brechstange (crowbar) · I06 Vorschlaghammer (sledgehammer) · I07 Pflasterhammer (cobblestone hammer) · I08 Rohrzange (big pipe wrench) |
| B02 | I09 Zwille (wooden slingshot) · I10 Nagelschleuder (slingshot with a nail pouch) · I11 Steinschleuder (leather sling with a stone) · I12 Rohrspeer (spear made from a pipe with a blade) · I13 Fahnenstange (flag pole with a torn rag as spear) · I14 Harpune (harpoon) · I15 Fernsehturm-Splitter (glass and steel shard from the TV tower as a blade) · I16 Mauerbrecher (heavy hammer with a Berlin Wall concrete chunk as head) |

### Icons: armour, head, hands, feet

| Batch | Cells |
|---|---|
| B03 | I17 Lederjacke (leather jacket) · I18 Arbeitsmantel (long brown work coat) · I19 Schutzweste (padded vest) · I20 Feuerwehrjacke (fire brigade jacket with reflective stripes) · I21 BVG-Uniform (dark blue transit uniform with yellow details) · I22 Bauhelm (yellow hard hat) · I23 Schiebermütze (flat cap) · I24 Wollmütze (wool beanie) |
| B04 | I25 Gasmaske (gas mask) · I26 Arbeitshandschuhe (work gloves) · I27 Boxbandagen (boxing hand wraps) · I28 Schweißerhandschuhe (welder gloves) · I29 Turnschuhe (sneakers) · I30 Arbeitsstiefel (work boots) · I31 Gummistiefel (rubber boots) · I32 Zorn der Ringbahn (weapon: S-Bahn rail spike on a chain) |

### Icons: rings and talismans

| Batch | Cells |
|---|---|
| B05 | I33 Siegelring (signet ring) · I34 Totenkopfring (skull ring) · I35 Schraubenmutter (hex nut worn as a ring) · I36 Drahtring (twisted wire ring) · I37 Ehering (gold wedding ring) · I38 Kupferring (copper ring) · I39 Spreekiesel (smooth river pebble on a cord) · I40 Mauerstück (painted Berlin Wall fragment) |
| B06 | I41 Rabenfeder (raven feather) · I42 Fahrradkette (bicycle chain as a bracelet) · I43 Kräuterbeutel (herb pouch) · I44 Currywurst-Abzeichen (enamel Currywurst pin) · I45 Herz der Spree (glowing teal stone heart) · I46 Wappen der Zitadelle (coat of arms shield of the Spandau citadel) · I47 Auge des Fernsehturms (glowing orb like the TV tower sphere) · I48 Morgenstern der Zitadelle (spiked morning star) |

### Icons: legendaries and sets

Legendaries get a faint golden glow around the object.

| Batch | Cells |
|---|---|
| B07 | I49 Mantel des letzten Späti (coat covered in Späti stickers and bottle caps) · I50 Panzer vom Tempelhofer Feld (armour plates from an airfield, rivets) · I51 Klinge der Zitadelle (old knight sword) · I52 Plattenbrecher (hammer with a Plattenbau concrete slab head) · I53 Krähenschleuder (slingshot decorated with crow feathers and skulls) · I54 Mantel der Rattenmutter (coat of grey rat fur, green scarf) · I55 Rüstung des Zitadellenritters (steel knight plate armour) · I56 Speer der Siegessäule (golden spear with the Victory Column angel) |
| B08 | I57 Kettenhemd der Zitadelle (chainmail shirt) · I58 Implantat (cybernetic arm implant with cables, Potsdamer Platz board, for the locked implant slot) · C01 Verband (bandage roll) · C02 Molotow (Molotov bottle with burning rag) · C03 Erbsensuppe (pea soup in a tin bowl) · C04 Currywurst (Currywurst with fries on a paper tray) · C05 Filterkaffee (enamel mug of filter coffee) · C06 Soljanka (bowl of red soup) |

### Icons: food, weapon mods, materials

| Batch | Cells |
|---|---|
| B09 | C07 Spreewaldgurken (jar of pickles) · M01 Nagelband (band of nails wrapped around a grip) · M02 Griffband (tape grip wrap) · M03 Gegengewicht (metal counterweight) · M04 Autobatterie (car battery with cables) · M05 Benzintank (small fuel canister) · M06 Säurephiole (glass vial of green acid) · M07 Stacheldraht (coil of barbed wire) |
| B10 | R01 Stoff (bundle of cloth scraps) · R02 Metall (pile of scrap metal) · R03 Chemie (chemical bottles) · R04 Kabel (coil of copper cable) · R05 Schrott (pile of mixed scrap, the currency) · R06 Supply crate (wooden crate with a red cross) · R07 Cellar chest (old iron-bound chest) · R08 leave empty (plain background) |

### Portraits: survivors (camp)

| Batch | Cells |
|---|---|
| P01 | S01 Dr. Ahmet (doctor, glasses, stethoscope, tired kind eyes) · S02 Mira, Schmiedin (smith, soot, leather apron, strong arms) · S03 Kurier Jonas (young bike courier, messenger bag, cap) · S04 Oma Gerda (older gardener, apron, headscarf, see the Alexanderplatz board) · S05 Späherin Lin (scout, hood, binoculars, red scarf) · S06 Kalle, Mechaniker (mechanic, overalls, wrench, moustache) |

### Portraits: enemies (Kodex)

Zombies are gaunt, grey-green skin, torn Berlin everyday clothes. Same look as the ghouls on the Köpenick and U-Bahn boards.

| Batch | Cells |
|---|---|
| P02 | E01 Ghul (gaunt fast zombie) · E02 Brocken (hulking zombie in an orange work vest) · E03 Speier (bloated zombie spitting green acid) · E04 Ratte (rat the size of a dog) · E05 Krähe (mutated crow) · E06 Schildträger (zombie with a riot shield) |
| P03 | E07 Zünder (zombie with a glowing fuse and explosives) · E08 Heuler (screaming zombie, throat swollen, sound waves) · E09 Raser (lean charging zombie, lowered head) · E10 Schrottkoloss (giant made of scrap metal and car parts) · E11 Zombie raptor (skeletal, exposed ribs, proposal from the style bible) · E12 Zombie T-rex (skeletal, torn hide, proposal) |

### Portraits: district bosses (Kodex)

| Batch | Cells |
|---|---|
| P04 | X01 Der Hauptmann von Köpenick (zombie Prussian captain, spiked helmet, long coat) · X02 Die Spreehexe (river witch, wet hair, acid) · X03 Der Turmwächter (guardian of the TV tower, electric) · X04 Der Fliegerkönig (zombie pilot king, aviator goggles, Tempelhof) · X05 Der Brandmeister (burning fire chief) · X06 Die Rattenmutter (huge rat queen, grey fur) |
| P05 | X07 Der Zitadellenritter (undead knight with shield) · X08 Der Plattenkönig (giant of Plattenbau concrete slabs) · then four empty cells (leave them as plain background) |

## Totals

| Group | Batches | Images |
|---|---|---|
| Icons | B01 to B10 | 79 |
| Survivor portraits | P01 | 6 |
| Enemy portraits | P02, P03 | 12 |
| Boss portraits | P04, P05 | 8 |
| **All** | **15 steps** | **105** |

Recommended order: B01 first (Claude checks how it cuts and reads at game size), then the rest in order.

## Progress

Claude ticks a batch here once its sheet is in `assets/raw/`.

| Batch | Status |
|---|---|
| B01 to B10 | open |
| P01 to P05 | open |
