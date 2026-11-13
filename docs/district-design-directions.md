# District direction proposals · 2026-11-13

**Selection pending.** Nine painted mockups for Johannes to choose and mix.
These extend the existing painted-comic visual language; they do not approve
new mechanics, enemy rosters, bosses or district implementations. Era and story
source: [Der Stillstand](story.md). Style source: [style bible](style-bible.md)
and the Köpenick reference board. Exact generation prompts and originals:
[`assets/raw/codex/16-district-design-boards/`](../assets/raw/codex/16-district-design-boards/).

Each board includes a scene, survivor front/back, enemies, friendly NPC,
equipment, props and palette. Warm/cool lighting, ink outlines, red scarf,
post-apocalyptic wear, overgrowth and BVG yellow tie them to the existing art.
Eye-level concept scenes define art direction; production retains the game's
2:1 isometric camera, anchors and collision contract. Individual details such
as generated signs, vehicle paint and scene geography are exploratory, not
historical or map-layout specifications.

## Tempelhof · 1948 airlift

All three keep the airport, hangars, Rosinenbomber ghosts, cargo cult and Feld
kites. The Fliegerkönig remains the story boss; these are appearance proposals.

| Pick | Direction | Architecture and atmosphere | Enemy / clothing / equipment language |
|---|---|---|---|
| A | Luftbrücke im Nebel | Monumental curved terminal, misty apron, humanitarian cargo, cold fog / amber lanterns | Aircrew and loadmaster Zeitlose, propeller-wing king; flight jacket, parachute webbing, propeller blade and radio pack |
| B | Die Windpilger | Open runway grassland, parachute shrines, kites and storm sunrise | Sailcloth frames, net crawler, wind-vane crown; parachute cape, ropes, windsock spear |
| C | Nachtschicht im Hangar | Dense steel-truss workshop, engine salvage and night-shift tungsten light | Riveter and radio ghoul, engine-armoured king; insulated apron, rivet hammer, valve-radio pack |

![Tempelhof A](../assets/raw/codex/16-district-design-boards/tempelhof-a.png)
![Tempelhof B](../assets/raw/codex/16-district-design-boards/tempelhof-b.png)
![Tempelhof C](../assets/raw/codex/16-district-design-boards/tempelhof-c.png)

## Charlottenburg · 1920

All three use Ku'damm cinema, cabaret, jazz and Art Deco. Baroque bleed belongs
to the Schloss boss destination; the whole district does not move to 1700.
Named bosses below are proposals, not a replacement of the story's open slot.

| Pick | Direction | Architecture and atmosphere | Enemy / clothing / equipment language |
|---|---|---|---|
| A | Die letzte Revue | Cabaret facades, fan awnings, incandescent marquees, velvet / peacock teal | Feather-fan dancer, masked usher, Revuekönigin; velvet lapels, spotlight gun, enamel cane sword |
| B | Asphalt und Messing | Rainy Ku'damm, jazz cellar, cinemas, petrol / brass | Umbrella ghoul, safe-door enforcer, Ringverein boss; pinstripes, flat cap, scrap scattergun, knuckle gloves |
| C | Das Spiegelschloss | Ruined palace garden, mirror labyrinth, Deco cinema reflected in baroque fragments | Mirror double, marble stag, Spiegeldirektor; evening waistcoat, mirror gauntlet, silver blade, opera cloak |

![Charlottenburg A](../assets/raw/codex/16-district-design-boards/charlottenburg-a.png)
![Charlottenburg B](../assets/raw/codex/16-district-design-boards/charlottenburg-b.png)
![Charlottenburg C](../assets/raw/codex/16-district-design-boards/charlottenburg-c.png)

## Wedding · the eternal “bald”

No invented numeric year. The Kiez and its Turkish, Lebanese and Arab families
are allies, traders and quest givers. The enemy is the developer's promise:
construction machinery, scaffold Zeitlose, billboard creatures and the Ewige
Bauherr. Clothing and community identity do not define enemy types.

| Pick | Direction | Architecture and atmosphere | Enemy / clothing / equipment language |
|---|---|---|---|
| A | Leopoldplatz bleibt | Survivor market, tea-house, bakery, Altbau beneath unfinished luxury promises | Plank-limbed scaffold ghoul, walking billboard, facade-chested crane golem; market apron, teal scale hammer, shutter shield |
| B | Pankelicht und Fabrikstaub | Panke canal, AEG/Osram redbrick, broken sawtooth roofs, copper / lamp orange | Construction drone, cable-tray ghoul, conversion-gantry golem; work oversmock, lamp-coil staff, cable gauntlets |
| C | Morgen wird gefeiert | Warm wedding-hall refuge against unfinished luxury tower, mint / berry / gold | Cement-sack ghoul, developer-brochure bird, tower golem; repaired formal waistcoat, chandelier lantern mace, tray shield |

![Wedding A](../assets/raw/codex/16-district-design-boards/wedding-a.png)
![Wedding B](../assets/raw/codex/16-district-design-boards/wedding-b.png)
![Wedding C](../assets/raw/codex/16-district-design-boards/wedding-c.png)

## Selection and handoff

Choose an environment, enemy/material language and clothing/equipment direction
independently for each district, e.g. “Tempelhof A architecture + B clothing +
C equipment.” No selection has been inferred from generation. Preserve the
existing finished boards; these proposals do not replace them.

Next session: pickup/equipment gaps, then complete Köpenick/global building
foundation. Audit assets and renderer coverage first, reuse existing painted
art, preserve code glow, size icons from gameplay readability. Basic hookup
and at most one measurement run by Codex; optimization and deep tests by
Claude. See [workflow](../pipeline/workflow.md) and
[pickup task](../pipeline/tasks/15-pickups.md).

These boards are outside the runtime manifest and service-worker shell. Added
game texture memory: **0 bytes**. Frame milliseconds / 5% regression: **not
measured, not applicable to this documentation-only batch**. This does not
establish that a future integrated asset batch meets its performance budget.
