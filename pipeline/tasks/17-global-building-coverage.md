# 17 Köpenick and global building coverage

Status: open (next session after pickups/equipment gaps; Johannes, 2026-11-13).

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
