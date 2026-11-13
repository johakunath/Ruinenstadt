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
