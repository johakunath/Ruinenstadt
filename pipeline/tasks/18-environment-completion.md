# 18 Environment coverage and water

Status: Köpenick surface/special-building batch implemented (v0.94, 2026-11-13), merged in PR #49; Xhain sources/basic hookup merged in PR #50 (v0.95), Claude optimization pending; other districts open. User requests complete Köpenick first, review and merge before proceeding map by map. Special buildings use more realistic architectural detail with restrained post-apocalyptic wear and district emblems.

1. Complete missing shared and custom district building textures/hooks; cover
   custom plazas and landmark surfaces. Audit: `docs/texture-coverage.md`.
2. Produce dedicated art for stations, bridges and one-off buildings, keeping
   existing footprints/collision and the selected district boards.
3. Add painted water surface textures and stronger visible animation: ripples,
   current/reflections and bank interaction as appropriate. Water should read
   as moving at ordinary tablet/phone zoom, without becoming distracting.

Reuse the four-variant terrain foundation and existing Köpenick/GDR art.
Check custom renderers and ground overlays individually; kit availability
alone is not coverage. Texture kit task 10, building task 17 and landmark
task 08 remain linked work, not completed by this priority note.

Generate from the style bible/selected boards, prepare sources/manifest and
basic hookups. Record one relevant visual/performance pass, then hand deeper
optimization and detailed tests to Claude. Water collision/gameplay and
map/save identities stay unchanged. No production or animation implementation
is included in this backlog-only task creation.

## Xhain batch

Audit the existing Oberbaumbrücke arcade/towers, Berghain, Ostbahnhof, East Side Gallery, elevated rail, station entrances, bridge decks and Spree/Landwehrkanal. Preserve all constructors, footprints, collision, placement and RNG. Reuse ordinary building/terrain kits. Painted sources with cached projected hooks; one bounded visual/smoke/performance run, then Claude handoff. Nature remains task 04.

Xhain proof: `pipeline/proof/23-xhain-completion/`. All twelve sources load; geometry/RNG, fallback and cache release pass. The 40 MB cap retains fallback on overflow (133/152 parts cached at normal proof scale; 77/152 at 2×). This is basic integration, not full painted coverage at every zoom or hardware acceptance. Review/merge this map batch before proceeding to Alexanderplatz.

Alexanderplatz: merged in PR #52, v0.96 (Codex, 2026-11-13). Cache overflow and hardware optimization explicitly remain Claude follow-ups. User explicitly requests Alexanderplatz review/merge, then Potsdamer Platz/Mitte immediately. This overrides the older district order.

Potsdamer Platz/Mitte: done (v0.98, Codex, 2026-11-13), PR #53; completed Codex review without findings, merge authorized. Follows Alexanderplatz PR #52 (f9ad807). Eighteen sources/basic hooks, 40 MB overflow fallback; detailed cache optimization/hardware acceptance remain Claude follow-ups.
