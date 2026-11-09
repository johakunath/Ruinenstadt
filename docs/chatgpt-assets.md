# ChatGPT asset batches

Work order for generating menu art (item icons, portraits) with ChatGPT image generation. One batch = one image = one step. Johannes hands the finished sheets to Claude, who cuts and integrates them. In-world sprites (player, enemies, buildings, vehicles) are not part of this; they follow `docs/asset-pipeline.md` with Codex.

## How to work

Johannes starts a ChatGPT chat with the short handover below, then only says "next batch".

> Read `docs/chatgpt-assets.md` in the GitHub repo johakunath/Ruinenstadt (branch main) and follow "How to work". Start with the first open batch in the Queue.

Rules for ChatGPT:

1. Read this file. The **Queue** below holds every open batch with its complete prompt, in order.
2. On "next batch": take the first queue entry whose status is open and not yet done in this chat. Use its prompt exactly as written. Each prompt names the reference images to attach; if you cannot open them from the repository, ask Johannes to attach them.
3. Generate **exactly one batch per image**. Do not combine batches. If you can make several images at once, make 2 or 3 variants of the same batch, never different batches.
4. After each image, say the batch ID and the file name to save it as (`assets/raw/<batch ID>.png`, variants `<batch ID>a.png`, `b`, `c`). Then stop and wait.
5. If a cell fails (wrong object, merged cells, unreadable), regenerate the whole batch rather than patching.
6. Everything that must match (one character, its parts, its outfits) goes on one sheet. Between sheets, attach the earlier sheet as reference.

Claude cuts the sheets with `tools/cut_sheets.py`, integrates them and marks the batch done in the Queue.

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

New batches from v0.52 on also add: *"Bright, saturated signature colour per object (enamel red, BVG yellow, cobalt blue, bottle green, violet, cyan, magenta, gold) on a clean light base. Rust and dirt only as a light overlay. Objects must look clearly different from each other, not all orange and brown."* (Style bible: Item colour.)

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

### Player parts: test history (H01, H02)

Rule for anything that must stay consistent (one character, its parts, its outfits): **put it on one sheet.** Inside one image the colours, line weight and proportions match. Between two images they drift, even when generated in the same go. For a follow-up sheet, attach the previous sheet as reference and say "same character, same scale as the attached sheet". Canvas stays 1536 × 1024 (ChatGPT's largest landscape size); more content means more sheets, not a bigger canvas.

The game draws the player from the side, facing right (left is mirrored), about 50 px tall, and animates arms, legs and the held weapon in code. So only one view is needed, no turnaround. Weapons need no new art: the item icons are painted on one diagonal and get rotated in the hand.

Sheet format as the portrait batches (3 × 2 cells of 512 × 512, same teal, ID strip, body parts not touching the cell edge). Style block plus: *"One sheet, one character: the survivor from the Köpenick board (dark brown hair, red scarf, long brown leather coat, harness with pouches, dark trousers, heavy boots), no weapon. Strict side view facing right, flat even light. Every cell uses exactly the same scale as the full figure in H01: do not enlarge the parts to fill their cells. The parts are the full figure cut apart, so they fit back together."*

| Batch | Cells |
|---|---|
| H01 | H01 full figure standing, arms hanging, about 420 px tall · H02 head and hair only, cut at the neck · H03 torso only: coat, scarf and harness, no head, no arms, no legs, coat ends at mid thigh · H04 one arm, straight and hanging, sleeve with bare hand · H05 one leg, straight, trousers and boot · H06 empty |

Success test: Claude cuts it (`tools/cut_sheets.py H01` → `assets/hero/`), lays the parts over H01 and checks scale and joints. If they fit, next sheets: torso variants per armour piece and hats per head item, each sheet with H01 attached as reference.

**H01 result (three variants, `assets/raw/H01a..c.png`, cut to `assets/hero/`):**

| Check | Result |
|---|---|
| Same design across parts | Yes. Variant b even repeats the bandage and glove on the separate arm |
| Same scale | No. Parts drawn 1.0 to 1.7 times too big, different per part. Fixable: Claude rescales each part once |
| Fits back together | Yes after rescaling, almost invisible joints |
| Reads at game size (60 px) | No. Realistic proportions (8 heads tall, slim) turn into a thin stick, see `docs/style/h01-gamesize.png` |
| Style bible | Coat came out olive cloth, the bible says brown leather |
| Torso | Has the upper sleeve and a black neck hole baked in (hole is removed by the script, sleeve is not) |

**H02 (retry, same sheet format and IDs H01 to H05, file `assets/raw/H02.png`):** style block plus:

> One sheet, one character: the survivor from the Köpenick board, game-sprite proportions: stocky and readable, about 5 heads tall, big head and hands, broad shoulders, thick limbs, bold dark outline, strong warm rim light on the back edge. Dark brown hair, red scarf, long brown **leather** coat to the knees, harness with pouches, dark trousers, heavy boots, no weapon. Strict side view facing right, flat even light. H01 full figure standing, arms hanging, about 400 px tall. H02 head and hair only, cut at the neck. H03 torso only: coat, scarf and harness, **no head, no arms, no sleeves**, the shoulder ends flat where the arm attaches. H04 one arm: shoulder to fingers, straight and hanging, sleeve with bare hand. H05 one leg: hip to boot, straight. H06 leave empty. Draw every part at exactly the same scale as H01, do not enlarge parts to fill their cells.

**H02 result (`assets/raw/H02a..c.png`):** ChatGPT ignored "5 heads tall" again (all three about 7 heads) and kept the olive cloth coat. Parts are consistent and closer to scale (1.0 to 1.2 times). Fix on our side: the parts are assembled in code, so the code exaggerates them (head ×1.45, torso and limbs ×1.25 to 1.3 wider, legs ×0.8 shorter). That reads better at 60 px, see `docs/style/h02-gamesize.png` (left: plain figure, right: exaggerated). Decision: variant A with its **plain, slim proportions** (Johannes prefers the look). Later sheets keep these proportions; any small readability tweak happens in assembly, not in the prompt.


## Queue

Open batches in order, each with its complete prompt. ChatGPT takes the first open one on "next batch". Claude sets the status to done once the sheet is cut. Reference images live in the repo: `docs/style/koepenick.png`, `docs/style/potsdamer-platz.png`, `assets/raw/H02a.png`.

| Order | Batch | Content | Status |
|---|---|---|---|
| 1 | B11 | Mitte icons: weapons, armour, head, implant | done (v0.52) |
| 2 | B12 | Mitte implant icons, Döner | done (v0.52) |
| 3 | P06 | Mitte portraits: Kabelghul, Boxenkopf, Bassprediger | done (v0.52) |
| 4 | H03 | Player outfits 1: Lederjacke, Arbeitsmantel, Schutzweste | done (v0.52) |
| 5 | H04 | Player outfits 2: Feuerwehrjacke, BVG-Uniform, Mantel des letzten Späti | done (v0.52) |
| 6 | H05 | Player outfits 3: Tempelhof armour, Rattenmutter coat, Zitadellenritter armour | done (v0.52) |
| 7 | H06 | Player outfits 4: Kettenhemd, Regenponcho, Kabelmantel | done (v0.52) |
| 8 | H07 | Player headwear | done (v0.52) |

**B11** · attach: koepenick.png, potsdamer-platz.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels. Mitte variant, see the attached Potsdamer Platz board: same painted style and base palette, plus cyan #43d1cf and magenta #bd2b77 neon accents. Improvised club and techno gear, cables, glowing parts, rain-worn.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 4 columns x 2 rows, 8 cells of 384 x 512. Each cell shows one inventory icon: a single object in 3/4 view from slightly above, all at the same scale and lighting, centred in the upper part of the cell, about 75% of it.
I59 Leuchtröhre: neon tube taped to a handle, used as a club, glowing cyan.
I60 Boxenhammer: hammer with a small speaker box as its head.
I61 Neonflinte: improvised rifle with a glowing neon tube as barrel.
I62 Mikroständer: microphone stand used as a spear.
I63 Regenponcho: transparent rain poncho with neon reflections.
I64 Kabelmantel: long coat wrapped in cables.
I65 Neonbrille: goggles with glowing cyan lenses.
I66 Neonauge: cybernetic eye implant, glowing.
```
**B12** · attach: koepenick.png, potsdamer-platz.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels. Mitte variant, see the attached Potsdamer Platz board: same painted style and base palette, plus cyan #43d1cf and magenta #bd2b77 neon accents. Improvised club and techno gear, cables, glowing parts, rain-worn.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 4 columns x 2 rows, 8 cells of 384 x 512. Each cell shows one inventory icon: a single object in 3/4 view from slightly above, all at the same scale and lighting, centred in the upper part of the cell, about 75% of it.
I67 Zielchip: targeting chip with fine glowing circuits.
I68 Reflexkoppler: spine nerve implant module with a small lightning spark.
I69 Bassherz: heart-shaped implant with a speaker membrane, magenta glow.
I70 Nanopumpe: glass cylinder pump with glowing liquid.
D01 Döner: döner kebab wrapped in paper (no neon, plain street food).
Cells 6 to 8: leave empty, plain background, no label.
```
**P06** · attach: koepenick.png, potsdamer-platz.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels. Mitte variant, see the attached Potsdamer Platz board: same painted style and base palette, plus cyan #43d1cf and magenta #bd2b77 neon accents. Improvised club and techno gear, cables, glowing parts, rain-worn.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 3 columns x 2 rows, 6 cells of 512 x 512. Each cell shows one bust portrait (head and shoulders, 3/4 view), same framing and eye height in every cell. Zombies are gaunt with grey-green skin, like the ghouls on the Köpenick board.
E13 Kabelghul: gaunt zombie wrapped in glowing cyan cables, cables growing into the skin.
E14 Boxenkopf: zombie with a cracked speaker box instead of a head, visible bass waves.
X09 Der Bassprediger: boss, undead techno preacher with big headphones, a DJ mixer strapped to his chest, magenta neon, preacher's collar.
Cells 4 to 6: leave empty, plain background, no label.
```
**H03** · attach: koepenick.png, H02a.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 3 columns x 2 rows, 6 cells of 512 x 512. Same survivor as the attached sheet H02a (same face, hair, red scarf, proportions and scale; keep the slim proportions of H02a). Strict side view facing right, flat even light, no weapon. Draw every part at exactly the same scale as the full figure on H02a; do not enlarge parts to fill their cells.
Top row: three torsos. Bottom row: the matching arm under each torso.
K01 torso only in Lederjacke (brown leather jacket, zip, short to the hip): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K03 torso only in Arbeitsmantel (long brown work coat to the knee): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K05 torso only in Schutzweste (padded olive vest over a shirt): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K02 one arm in the Lederjacke sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K04 one arm in the Arbeitsmantel sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K06 one arm in the Schutzweste sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
```
**H04** · attach: koepenick.png, H02a.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 3 columns x 2 rows, 6 cells of 512 x 512. Same survivor as the attached sheet H02a (same face, hair, red scarf, proportions and scale; keep the slim proportions of H02a). Strict side view facing right, flat even light, no weapon. Draw every part at exactly the same scale as the full figure on H02a; do not enlarge parts to fill their cells.
Top row: three torsos. Bottom row: the matching arm under each torso.
K07 torso only in Feuerwehrjacke (dark fire brigade jacket with yellow reflective stripes): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K09 torso only in BVG-Uniform (dark blue transit uniform jacket with yellow details): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K11 torso only in Mantel des letzten Späti (coat covered in Späti stickers and bottle caps, faint golden glow): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K08 one arm in the Feuerwehrjacke sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K10 one arm in the BVG-Uniform sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K12 one arm in the Mantel des letzten Späti sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
```
**H05** · attach: koepenick.png, H02a.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 3 columns x 2 rows, 6 cells of 512 x 512. Same survivor as the attached sheet H02a (same face, hair, red scarf, proportions and scale; keep the slim proportions of H02a). Strict side view facing right, flat even light, no weapon. Draw every part at exactly the same scale as the full figure on H02a; do not enlarge parts to fill their cells.
Top row: three torsos. Bottom row: the matching arm under each torso.
K13 torso only in Panzer vom Tempelhofer Feld (riveted armour plates from an airfield, faint golden glow): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K15 torso only in Mantel der Rattenmutter (coat of grey rat fur with a green scarf, faint golden glow): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K17 torso only in Rüstung des Zitadellenritters (steel knight plate armour with a castle emblem, faint golden glow): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K14 one arm in the Panzer vom Tempelhofer Feld sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K16 one arm in the Mantel der Rattenmutter sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K18 one arm in the Rüstung des Zitadellenritters sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
```
**H06** · attach: koepenick.png, potsdamer-platz.png, H02a.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels.
Mitte variant, see the attached Potsdamer Platz board: same painted style and base palette, plus cyan #43d1cf and magenta #bd2b77 neon accents. Improvised club and techno gear, cables, glowing parts, rain-worn.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 3 columns x 2 rows, 6 cells of 512 x 512. Same survivor as the attached sheet H02a (same face, hair, red scarf, proportions and scale; keep the slim proportions of H02a). Strict side view facing right, flat even light, no weapon. Draw every part at exactly the same scale as the full figure on H02a; do not enlarge parts to fill their cells.
Top row: three torsos. Bottom row: the matching arm under each torso.
K19 torso only in Kettenhemd der Zitadelle (rusty chainmail shirt): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K21 torso only in Regenponcho (transparent rain poncho with neon reflections): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K23 torso only in Kabelmantel (long coat wrapped in glowing cables): no head, no arms, no sleeves, the shoulder ends flat where the arm attaches, same shoulder width and neck height as the H02a torso, length as described.
K20 one arm in the Kettenhemd der Zitadelle sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K22 one arm in the Regenponcho sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
K24 one arm in the Kabelmantel sleeve: shoulder to fingers, straight and hanging, same size as the H02a arm.
```
**H07** · attach: koepenick.png, potsdamer-platz.png, H02a.png

```
Painted comic illustration in the style of the attached Köpenick reference board: dark ink outlines, painterly brush texture, stylized not realistic, gritty post-apocalyptic Berlin with a western-steampunk and noir touch. Warm light from the top left, cool teal shadow. Palette: cream #f0b27a, ochre #db8c2b, olive #7b6a32, teal grey #516a62, rust #8b4a35, oxblood #591e1e. Every object must still read as a clear silhouette when shrunk to 48 pixels.

Canvas 1536 x 1024, landscape. Flat, even dark teal #1e3238 background behind everything: no scene, no gradient, no texture, no frames, no drop shadows. Thin even gaps between cells. Below each object a dark strip with the cell ID in large plain white capitals, only the ID. Order left to right, top row first. Nothing touches the cell edge.

Grid 3 columns x 2 rows, 6 cells of 512 x 512. Same survivor as the attached sheet H02a (same face, hair, red scarf, proportions and scale; keep the slim proportions of H02a). Strict side view facing right, flat even light, no weapon. Draw every part at exactly the same scale as the full figure on H02a; do not enlarge parts to fill their cells.
Each cell: the H02a head (cut at the neck, same size as on H02a) wearing one item. Hair may be squashed or hidden where the item covers it.
K25 Bauhelm: yellow hard hat.
K26 Schiebermütze: brown flat cap.
K27 Wollmütze: olive wool beanie.
K28 Gasmaske: gas mask with round lenses, straps over the hair.
K29 Neonbrille: goggles with glowing cyan lenses (Mitte neon accent).
K30: leave empty, plain background, no label.
```

## Totals

Done: 15 batches, 105 images (B01 to B10, P01 to P05) plus the player tests H01, H02. Open: see Queue.

## Progress

Claude ticks a batch here once its sheet is in `assets/raw/`.

| Batch | Status |
|---|---|
| B01 to B10 | done, cut into `assets/icons/` (v0.51) |
| H01, H02 (player test) | done. Pick: H02 variant A, plain proportions (Johannes prefers it over the exaggerated build) |
| B11 (variant b), B12, P06 (variant c), H03 to H07 | done (v0.52). Other variants stay in `assets/raw/` |
| Everything else | see Queue |
| P01 to P05 | done, cut into `assets/portraits/` (v0.51) |

Cutting: `python3 tools/cut_sheets.py [B01 ...]`. It finds the label strip per cell, keys out the teal (also enclosed holes such as ring centres) and writes WebP. New batches: add their IDs to `IDS` in the script, and the mapping to `ICOI` / `PORTI` in `js/items.js`.
