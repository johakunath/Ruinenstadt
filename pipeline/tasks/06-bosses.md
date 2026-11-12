# 06 District bosses

Status: complete candidate (Codex, 2026-11-12; v0.87, performance acceptance and review/merge pending)

One per district, designs from the Kodex portraits: X01 Hauptmann von Köpenick, X02 Spreehexe, X09 Bassprediger, X04 Fliegerkönig, X05 Brandmeister, X06 Rattenmutter, X07 Zitadellenritter, X08 Plattenkönig; Volkseigener Koloss (Alexanderplatz) from its code drawing in `js/alex.js`. Boss radius 34, big 42 (`mkEnemy`). Boss attacks (rings, shocks, projectiles in `js/combat.js` and `js/update.js`) must start at the visible body.

## Progress 2026-11-11

Three transparent style canvases establish the production direction for all nine bosses under `assets/raw/codex/06-bosses/`. The eight Kodex identities are extended into full-body designs; the new Volkseigene Koloss is a clock-ring machine and remains clearly distinct from the concrete-humanoid Plattenkönig. Exact prompts and the recorded pick are stored beside the canvases.

Nine five-pose source sheets now produce 54 anchored runtime frames (idle, two-frame walk, two-frame attack, hit) through `tools/build_bosses.py`. The deterministic cutter removes neighbouring-pose fragments and the alpha-normalisation path is byte-stable. All big district bosses select painted art; their existing canvas rendering remains the missing/disabled fallback. Combat positions, radii, attacks, RNG and collision are unchanged.

Browser proof passes at 1×/2×, including all frames, HTTP404 fallback and a fresh offline reload decoding all 54 assets. Runtime memory is 17,699,360 decoded bytes, below the 40 MB task budget. On the current v0.84 sources, the RTX 4070 painted comparisons pass: Köpenick -1.51% (95% CI -5.62% to +1.24%) and Alexanderplatz -3.30% (-9.29% to +0.08%). The 21-pair off/off control was inconclusive (+0.95%, -2.62% to +6.53%); the required 41-pair control-only rerun remained narrowly inconclusive (-0.84%, -5.40% to +2.24%). A full 41-pair run before current main advanced passed both districts and its control; it is retained as history, not substituted for current-source evidence. No optimisation attempt was indicated; Johannes must accept the current control noise before merge.

Current v0.87 reconciliation passes 70 JS tests, 6 Python tests, 371 sprite checks and refreshed browser/fallback/offline proof. Evidence: `pipeline/proof/06-bosses/`. Remaining gates: Johannes performance acceptance, PR review and merge.
