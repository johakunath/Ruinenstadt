# 13 Weapon powers, weapon classes and blessing art

Status: open (code delivered in v0.82 with SVG placeholders in `js/glyphs.js`)

Johannes, 2026-11-11: the gameplay is done. This package replaces the code placeholders with
painted art. Routine production under the approved style (`docs/style-bible.md`); no A/B/C
rounds per icon. Check every icon at 44 px (menu) and 20 px (card corner).

## A. Power icons (12), replace `KRG` in `js/glyphs.js`

Data: `KR` in `js/data.js`. Each power has three names (default, Potsdamer Platz neon
bases, Alexanderplatz bases); one icon per power is enough, but the neon variant may
get a cyan/magenta tint later.

| Key | Weapon | Name | Look |
|---|---|---|---|
| saege | Klinge | Kreissäge | spin attack, blade trail as a saw circle |
| fecht | Klinge | Fechtsprung | lunge through enemies, speed lines |
| saebel | Klinge | Säbeltanz (ultimate) | two sabres, red frenzy, gold accent |
| fall | Hammer | Fallhammer | sledge on the ground, shock ring |
| gully | Hammer | Gullydeckel | iron manhole cover as a shield, Berlin pattern |
| abriss | Hammer | Abrissbirne (ultimate) | wrecking ball, debris, gold accent |
| nagel | Werfer | Nagelsturm | fan of nails and bolts |
| brand | Werfer | Brandsatz | incendiary charge bursting on the ground |
| sperr | Werfer | Sperrfeuer (ultimate) | WWI-style barrage, shells on target rings |
| spiess | Speer | Spießrute | thrown spear piercing a line |
| stab | Speer | Stabhochsprung | pole-vault arc with landing impact |
| stand | Speer | Standarte (ultimate) | Prussian regimental standard planted in the ground |

## B. In-world power visuals (code placeholders in `js/art.js`, `js/render.js`)

| Visual | Now | Wanted |
|---|---|---|
| Gullydeckel shield | `drawGuard()` ellipse with grid | painted cover held in the front hand, side view, about 28 px tall at rig scale |
| Standarte | canvas pole with a black-white-red flag | painted prop, flag in 2 to 3 wave frames |
| Sperrfeuer | orange ground rings + bursts | falling shell streak and a small crater decal |
| Abrissbirne / Stabhochsprung leap | player lifted by `P.hz` | squash on take-off and landing, dust ring |
| Säbeltanz | red ring around the player | red after-images on the swings |

## C. Weapon icon fixes

| Problem | Icons | Fix |
|---|---|---|
| Ranged class reads as a kid's toy | I09 Jagdzwille, I10 Nagelwerfer, I11 Steinschleuder | steel hunting slingshot with wrist brace and steel balls, nail launcher with rubber bands and a nail magazine, keep the leather sling but heavier and bloodier |
| Blades look like daggers (the class only cuts and spins) | I51 Klinge der Zitadelle, I32 Zorn der Ringbahn | longer sword or sabre silhouette. I32 is a ranged (Werfer) legendary but is painted as a dagger on a chain: repaint as a chain launcher |
| No painted icon yet | sichel, werkh, aufzieh (now Aufziehwerfer), zeiger | GDR clockwork look from the Alexanderplatz board; the Aufziehwerfer must look dangerous |
| Neon variants | Neonflinte I61 is the target level | Potsdamer Platz weapons can be fully high-tech |

Weapons on the hero were drawn about 12% smaller in v0.82 (`HWL` in `js/art.js`); keep the
new size when painting rig weapons.

## D. Optional

Family glyphs (`FAMG`) and weapon class badges (`WCG`) are small UI marks; keep them code-drawn
unless they clash with painted icons.
