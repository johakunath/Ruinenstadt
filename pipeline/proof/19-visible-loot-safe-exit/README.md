# v0.91 loot visibility, collection and safe exits

Focused checks on 2026-11-13:

- Collection tests exercise production `updateDrops`: pickup at 35 units without a blessing, no unblessed pull at 65, Elster pull at 120/250 for levels 1/2 and 42-unit movement over .1s (420/s), full bag keeps valuable drops.
- Exit guard counts only actual uncollected legendary/set drops; ignores yellow rares and already-taken items. Search resumes with nearest-valued-drop guide, confirmation exits once, stale confirmation cannot end a new run.
- Actual district exit pauses with no win reward or run log yet; searching from inside the exit ring does not instantly re-open the warning; collecting the nearest set changes the guide to the remaining legendary. Explicit leave finalizes one win. Rare-only exit proceeds without a popup.
- Actual tunnel guard defers line unlock until search/collection/return to the generator, or explicit confirmation. No automatic exit loop after choosing search.
- Five rendered rarity/set names use normal 12px text; zero page errors. Rarity-glow, guide and warning screenshots are retained. One initial harness assertion expected the literal `400` weight; Canvas correctly normalizes default weight to `12px …`. That initial report is retained; the corrected assertion checks the actual normal-weight form.
- Runtime audit of four districts verifies all 42 shared material sources decode and records remaining custom architecture paths. See docs/texture-coverage.md for qualifications.

Validation commands: `node --test tools/test_loot.mjs`, `node --test tools/test_incoming_damage.mjs`, `node tools/proof_loot.cjs` after serving this checkout on 8771. JS syntax and offline-shell file checks pass. No new asset generation, optimization loop or hardware performance claim.
