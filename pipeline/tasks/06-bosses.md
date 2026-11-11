# 06 District bosses

Status: complete candidate (Codex, 2026-11-11; v0.82, review/merge pending)

One per district, designs from the Kodex portraits: X01 Hauptmann von Köpenick, X02 Spreehexe, X09 Bassprediger, X04 Fliegerkönig, X05 Brandmeister, X06 Rattenmutter, X07 Zitadellenritter, X08 Plattenkönig; Volkseigener Koloss (Alexanderplatz) from its code drawing in `js/alex.js`. Boss radius 34, big 42 (`mkEnemy`). Boss attacks (rings, shocks, projectiles in `js/combat.js` and `js/update.js`) must start at the visible body.

## Progress 2026-11-11

Three transparent style canvases establish the production direction for all nine bosses under `assets/raw/codex/06-bosses/`. The eight Kodex identities are extended into full-body designs; the new Volkseigene Koloss is a clock-ring machine and remains clearly distinct from the concrete-humanoid Plattenkönig. Exact prompts and the recorded pick are stored beside the canvases.

Nine five-pose source sheets now produce 54 anchored runtime frames (idle, two-frame walk, two-frame attack, hit) through `tools/build_bosses.py`. The deterministic cutter removes neighbouring-pose fragments and the alpha-normalisation path is byte-stable. All big district bosses select painted art; their existing canvas rendering remains the missing/disabled fallback. Combat positions, radii, attacks, RNG and collision are unchanged.

Browser proof passes at 1×/2×, including all frames, HTTP404 fallback and a fresh offline reload decoding all 54 assets. Runtime memory is 17,699,360 decoded bytes, below the 40 MB task budget. The 41-pair RTX 4070 gate passes: Köpenick -2.91% (95% CI -5.53% to -0.48%), Alexanderplatz -2.04% (-3.63% to +1.60%), null +0.15% (-1.77% to +2.28%). The earlier 21-pair Alexanderplatz result was inconclusive and is retained; no optimisation attempt was required.

Evidence: `pipeline/proof/06-bosses/`. Remaining gate: PR review and merge.
