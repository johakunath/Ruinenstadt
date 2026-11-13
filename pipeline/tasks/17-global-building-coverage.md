# 17 Köpenick and global building coverage

Status: shared wall/roof foundation integrated (v0.88, 2026-11-13); named landmark/billboard coverage remains open. Tablet performance accepted by Johannes; dedicated custom art/hook coverage remains open.

Complete painted coverage for Köpenick and the shared/global building family,
and use that foundation in districts without district-specific painted assets.
Do not regenerate existing usable art. No monster work in this batch.

The previous building task 02 is done for the reusable facade/roof texture kit
(13 Köpenick files, merged PRs #29/#30). It did not close task
`08-landmarks.md`, which remains open. This explains why kit completion must
not be treated as complete building/landmark coverage; the exact missing list
still needs an audit of the current map and renderer.

1. Inventory every Köpenick/global building and landmark: map key, renderer,
   existing painted source, active hook, procedural/SVG fallback and gap.
   Check Späti, Döner, Altbau, Plattenbau, ruins, roofs, Rathaus and other named
   landmarks; distinguish missing art from art that is not hooked up.
2. Generate only missing art from the approved Köpenick board. Keep the
   established texture-kit method for ordinary buildings and obey the renderer
   contract for unique landmarks. Make basic hookups and shared fallback only;
   do not change footprints/collision, district identity or save mappings.
3. Maximum one measurement run: record source/cache decoded memory against
   40 MB, frame milliseconds and regression against 5%, plus unavailable
   measurements and visual results. Include slow frames over 50 ms (`sp`) and
   longest frame (`mx`) when available; do not invent a separate threshold for
   those telemetry fields. Hand optimization/deep testing to Claude.
4. PR, completed Codex review, handle applicable findings/checks, then deploy
   under Johannes's production-batch instruction. Preserve prior validated art.

## Coverage audit and first delivery (2026-11-13)

| Family | Before | v0.88 |
|---|---|---|
| Köpenick Altbau/ruin/Platte | Existing 13-file painted kit | Preserved; fallback surface also benefits from shared materials |
| Köpenick Späti | Existing painted shopfront and props | Preserved |
| Detached/row houses | Procedural plaster and pitched roofs | Painted plaster/brick, terracotta slopes; exact windows/doors retained |
| Garden sheds | Procedural wood and roof | Painted wood and slate |
| Other districts' ordinary buildings | Procedural wall/roof surfaces | Same shared painted foundation; district-specific GDR kit keeps precedence |
| Modern towers/offices | Procedural plaster/glass and roof | Painted plaster/glass/slate beneath existing windows |
| Rathaus, station entrances, bridges and other one-off landmarks | Dedicated code art | Open in task 08; not replaced by generic materials |
| Trees/nature | Procedural billboards | Separate nature task remains open |

Six orthographic material sources are in
`assets/raw/codex/16-shared-materials/`; normalization and manifest updates
use `tools/build_shared_materials.py`. New art changes no footprints,
collision, map/district/save mappings, gameplay RNG or light anchors.

## Current runtime audit (v0.91)

See [texture coverage](../../docs/texture-coverage.md): all 42 shared sources load, but custom district building renderers and named plaza/ground painters still bypass or cover the shared foundation. The report lists concrete remaining drawing paths for Köpenick, Alexanderplatz, Mitte and Tempelhof. Foundation delivery is not complete environment-art coverage.
