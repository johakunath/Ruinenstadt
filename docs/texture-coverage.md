# Texture coverage status — 2026-11-13

The shared painted foundation is integrated, not a completed replacement of all environment art. The v0.91 browser audit confirms all 42 shared material sources decode in each sampled district (nine surfaces × four versions plus six building materials).

## Delivered

- Terrain: asphalt, cobble, paving, dirt, grass, sand, plaza stone, ballast and tunnel concrete, four variants each; shared paths in world/biomes/geo/tunnel generation use these.
- Buildings: Köpenick facade kit and GDR kit; plaster/brick/wood, slate/terracotta and glass materials for ordinary house/shed/tower/office generation.

## Still open

- Custom landmark and district building renderers often bypass `makeB`/`modernB`, so shared materials do not automatically texture them.
- Named plazas, station forecourts, platforms and other custom ground painters can cover shared ground with their own procedural fill; notably custom areas in `js/geo.js`, `js/mitte.js` and `js/alex.js`.
- One-off Rathaus/station/bridge/landmark sprites, trees and other nature are separate art packages, not covered by the ordinary wall/roof foundation.

## Runtime sample

Seed 231113. Counts below are **structural objects/parts with h >20 and H >40**, excluding vehicles/fences, not complete buildings and not an overall completion percentage. Low houses and billboard sprites are outside this sample. A foundation tag identifies a painted source/hook, not whether every visible face is finished.

| District | Sampled structural parts | Painted foundation tag | Remaining custom drawing paths |
|---|---:|---:|---|
| Köpenick | 53 | 51 | custom sprite |
| Alexanderplatz | 208 | 65 | drawDeck, drawPillar, drawOstbf, drawStall, drawRathaus, drawMarien, drawBDom, drawAltes, drawPalast, drawHdL, drawHotel, drawKino, drawVolks, drawMMus, drawZTower, drawGlas, custom sprite |
| Mitte | 214 | 90 | drawShop, drawICE, drawHbfRoof, drawBuegel, drawPillar, drawDeck, drawReichstag, drawKanzler, drawPLH, custom sprite, drawAttic, drawTent, drawRound, drawKoll, drawStage, drawClinic, drawPhil, drawNNG, drawAnh, drawDom, drawKonz |
| Tempelhof | 3 | 1 | custom sprite |

Next asset work: audit the visible custom ground overlays and named architecture per district, then add missing art/hooks without replacing the existing shared kits. Task `pipeline/tasks/17-global-building-coverage.md` and landmark task `08-landmarks.md` remain open. Ground variation is delivered; custom-surface coverage remains. No new terrain or building art was created during the loot-visibility change.

Evidence: `pipeline/proof/19-visible-loot-safe-exit/results.json`. Tablet performance remains accepted; this is a coverage audit, not a performance gate.

## Köpenick completion — v0.94

The actual Köpenick map contains one named building (Rathaus), one working station stairwell and three named river crossings. Their active paths are now covered: Gothic Rathaus facade/roof/clock tower with fish-and-key emblems; tiled station parapets and forecourt; painted bridge deck and stone/iron parapets; Rathausplatz, paving/asphalt, park paths, and painted Spree/Dahme/Müggelsee water. Existing water movement is made more visible. Shared four-variant nature/soil surfaces and existing ordinary-building art remain.

No Schloss building, railway station hall or dinosaur park building exists in this map definition; map labels and reserved land are not missing runtime buildings. No new landmark or gameplay is invented. Trees/nature remain task 04. Other districts' custom architecture and surfaces remain open; Xhain is next in map order. Sources, 64px comparison and proof: `assets/raw/codex/21-koepenick-completion/`, `pipeline/proof/22-koepenick-completion/`.

## Xhain custom environment — v0.95 handoff

Twelve new painted materials now reach Oberbaumbrücke's existing arcade,
towers and copper spires; Berghain's concrete walls; Ostbahnhof's stone
facades and curved glass roof; East Side Gallery murals; green U1 and brick
Stadtbahn spans/pillars; all existing station parapets/forecourts; road bridge
decks; and Spree/Landwehrkanal water. Original window apertures, doors, train
drawings, signs, shadows and footprint geometry remain. Ordinary buildings
and terrain reuse the existing foundation. Ripple contrast/width now matches
the stronger Köpenick treatment. No new construction or nature is invented.

**Cache coverage is bounded, not complete at every zoom:** with seed 231113
at 1280×800/DPR 2, normal proof scale caches 133 of 152 eligible structural
parts; at 2× it caches 77. Named architecture and station parapets are
prioritized; remaining railway parts retain the original drawing under the
40 MB task cap. Claude should handle cache residency/coverage and hardware
acceptance. Source art and basic hooks are delivered; a claim of fully
painted Xhain everywhere would be premature. Existing map placement can
occlude Ostbahnhof behind ordinary blocks, visible in the unmodified scene
proof; this asset batch does not move buildings.

Proof: `pipeline/proof/23-xhain-completion/`; production sources/cuts and
64px comparison: `assets/raw/codex/22-xhain-completion/`. Next map after review
and merge is Alexanderplatz; its custom paths above remain open.
