# 01b Enemy redesign (second pass of task 01)

Status: in progress (Codex, 2026-11-09; 30-image batches, user-authorized review and merge)

## Why

Quality check by Claude on v0.64 (look at `assets/raw/codex/01-enemies/*.png` and `pipeline/proof/01-enemies/`):

| Finding | Verdict |
|---|---|
| Painting quality, line weight, palette, six poses per enemy, mouth pivots, hit flash, fallback, tests | Very good. Keep the whole pipeline, tooling and manifest naming as is |
| Wurzler (sunflower and roots), Uhrwerkläufer (clockwork), Brocken (work vest, mass) | Good. Distinct silhouette and clear idea. Keep, only touch if the silhouette test below fails |
| Zünder, Heuler (and probably Ghul, Speier, Schildträger, Raser, Brigadeghul): same ragged human with boots, similar height and pose language, only a prop or colour differs | Weak as a set. At game size (about 64 px tall) several types read as "another zombie". This is the effect of designing from the old code drawings and portraits |
| World vs enemies | The enemies are painted, the world (buildings, props) is still flat vector. Tasks 02 to 05 close that gap, do not repaint enemies to match the world |

## Goal

Every enemy type is recognisable by **silhouette alone** at 64 px, and the designs come from the style boards, not from the code drawings (`workflow.md` step 3).

## Steps

1. **Style canvas.** One sheet per family into `assets/raw/codex/01b-enemy-redesign/`: Köpenick jungle/zombie, U-Bahn, Potsdamer Platz cyber, Alexanderplatz clockwork. Palette from the boards in `docs/style/`, material language, line weight, light from top left, plus 5 silhouette thumbnails per enemy type (different body plan, height, posture, a signature shape such as a big tool, backpack, extra limbs, hunched or tall).
2. **Silhouette test (objective gate).** Script `tools/silhouette_sheet.py` (write it): all idle frames of all types as flat black on light grey at 64 px, one sheet, plus the same for the new thumbnails. Rule: no two types may share the same height class and the same outline family. List the failing pairs in `log.md`. Redo only failing types and any type the checklist marks weak (start with Zünder, Heuler, Speier, Schildträger, Raser, Ghul, Brigadeghul, Schrottkoloss).
3. **Pick.** Codex picks per type from the canvas thumbnails by the gate, writes the pick and the reason into `picks.json` and `log.md`. Overnight runs do not wait for Johannes (colour and shape picks included). Johannes reviews the comparison sheet old vs new the next morning.
4. **Paint** six poses per redone type exactly like task 01 (same keys, same pose names, same anchors and mouth pivots, same manifest entries, so `js/anim.js` and `js/art.js` need no change). Keep gameplay data: radius `r`, shield arc, telegraph origin.
5. **Test** with the existing suite from task 01 (`tools/test_enemies.mjs`, proof screenshots, offline reload) plus the silhouette sheet in `pipeline/proof/01b-enemy-redesign/`. Run `?debug=perf` A/B like task 01 (no regression allowed).
6. PR as draft. Old art stays in git history, no `v1` folders in `assets/`.

## Out of scope

Bosses (task 06), new enemy types, balance changes.
