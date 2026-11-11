# Boss pose-sheet prompt set

Generator: built-in image generation. Mode: transparent-background referenced-image generation. Date: 2026-11-11.

Every sheet used the matching approved style canvas, Kodex portrait and district/style-board references. Common instruction: preserve the exact selected identity, costume, materials, silhouette and palette; show five separated, complete full-body figures in one horizontal row; order them idle, walk, attack wind-up, attack release/strike, hit reaction; transparent background; no floor, shadow, labels, border, scenery or cropped body parts; painterly weathered Ruinenstadt game art readable at small isometric scale.

| Output | Character-specific pose direction |
|---|---|
| `hauptmann-poses.png` | Hauptmann von Köpenick: planted command idle; purposeful walk; sabre/order wind-up; decisive sabre strike; clear backward hit recoil. |
| `hexe-poses.png` | Spreehexe: hovering idle; gliding walk; acid gathered at the hand; acid release from the hand; clear hit recoil. |
| `bass-poses.png` | Bassprediger: staff/speaker idle; heavy walk; mixer/staff charge; bass-wave release; clear hit recoil. |
| `flieger-poses.png` | Fliegerkönig: propeller-weapon idle; walk; bombardment signal wind-up; command release; clear hit recoil. |
| `brand-poses.png` | Brandmeister: axe idle; walk; overhead axe wind-up; heavy axe strike; clear hit recoil. |
| `ratten-poses.png` | Rattenmutter: hunched idle; lumbering walk; brood-summon wind-up; compact green command release; clear hit recoil. |
| `ritter-poses.png` | Zitadellenritter: shield guard idle; armoured walk; charge wind-up behind the shield; shield/mace lunge; guard-break hit recoil. |
| `platte-poses.png` | Plattenkönig: monumental idle; ponderous walk; both fists raised; crushing slam; clear hit recoil. |
| `volk-poses.png` | Volkseigener Koloss: mechanical idle; articulated walk; hammer wind-up; clock-ring spin/needle extension; destabilised hit recoil. |

Corrections: the Hauptmann strike was regenerated so it no longer overlaps its neighbour; the Brandmeister hit pose was regenerated for an unambiguous recoil. A Ritter background-removal edit was rejected because it introduced semi-transparent white; the original transparent pose sheet is the source. Runtime cells are cut and cleaned only by `tools/build_bosses.py`.
