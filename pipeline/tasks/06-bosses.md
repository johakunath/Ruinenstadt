# 06 District bosses

Status: in progress (Codex, 2026-11-11; asset generation only, local branch from v0.81)

One per district, designs from the Kodex portraits: X01 Hauptmann von Köpenick, X02 Spreehexe, X09 Bassprediger, X04 Fliegerkönig, X05 Brandmeister, X06 Rattenmutter, X07 Zitadellenritter, X08 Plattenkönig; Volkseigener Koloss (Alexanderplatz) from its code drawing in `js/alex.js`. Boss radius 34, big 42 (`mkEnemy`). Boss attacks (rings, shocks, projectiles in `js/combat.js` and `js/update.js`) must start at the visible body.

## Progress 2026-11-11

Three transparent style canvases establish the production direction for all nine bosses under `assets/raw/codex/06-bosses/`. The eight Kodex identities are extended into full-body designs; the new Volkseigene Koloss is a clock-ring machine and remains clearly distinct from the concrete-humanoid Plattenkönig. Exact prompts and the recorded pick are stored beside the canvases.

Next asset step: generate animation-source sheets from these designs, beginning with idle, attack and hit poses. Runtime integration, attack-origin verification and performance work follow only after the source sheets are complete.
