# 01 Enemies

Status: done (v0.64)

Same pattern as the ghoul. Look: style bible and boards, the Kodex portraits in `assets/portraits/` (E01 to E14) are the agreed designs, match them.

| Key (`e.type`) | Name | r | Portrait | Notes |
|---|---|---|---|---|
| ghoul | Ghul | 10 | E01 | done in 00 |
| brute | Brocken | 17 | E02 | orange work vest |
| spitter | Speier | 11 | E03 | spit starts at the mouth |
| rat | Ratte | 6 | E04 | low, long body inside the ring |
| crow | Krähe | 8 | E05 | flies: shadow on the ground at the ring, body above |
| shield | Schildträger | 13 | E06 | the shield faces `e.fa` (world angle); blocking arc in `js/combat.js` must match the drawn shield |
| bomb | Zünder | 11 | E07 | glowing fuse |
| howl | Heuler | 11 | E08 | |
| raser | Raser | 11 | E09 | charge telegraph line starts at the body |
| boss (wave 10) | Schrottkoloss | 34 / 42 | E10 | |
| kabel | Kabelghul (Mitte) | 9 | E13 | cyan cables |
| bass | Boxenkopf (Mitte) | 15 | E14 | bass ring starts at the speaker |
| uhr, wurz, kern | Uhrwerkläufer, Wurzler, Kernspeier (Alexanderplatz) | 13, 12, 11 | none yet | new design from the Alexanderplatz board and a style canvas (workflow step 3), not from the drawn versions in `js/alex.js`; those only give size and telegraph |

Elite variants (`e.elite`) keep their coloured ring, no extra art.
