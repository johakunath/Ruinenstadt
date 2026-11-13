# v0.89 — fair damage, touch drag and varied ground

Focused checks on 2026-11-13; no new performance-tuning loop.

- Production damage tests: no full-health one-shot across 20/461/1000 HP, resistance -50% to +75%, scaled damage up to 1.7 billion; strongest hit caps at 45% max HP. Three hits can kill. Existing invulnerability rejects a second hit in the same immunity window.
- Contact test: at 461 HP/24% resistance, 200 raw damage becomes 46 ordinary contact, 61 heavy-body contact, or 152 attack damage. Charges/dives classify as attacks. Guard/stance still mitigate.
- Native Chromium CDP touchscreen input at 1280×800, DPR2: four consecutive bag-to-head-slot drags, each with 2px/1px jitter before the hold. All swaps complete; a separate purely vertical bag-cell swap also passes without yielding to native scrolling. Ghosts, highlights and drag state clear each time. Quick swipe creates no drag.
- Desktop: two consecutive real mouse drags; hovering a bag-grid gap highlights an actual cell. No whole grid/doll gets `.dgover`; equipment outlines only the icon.
- All nine ground materials use all four painted variants, with irregular offsets, shuffled placements and blended edges. 42 shared material sources decode; zero page errors.
- Current source images plus material canvases and pickup images: **32,456,800 bytes** (<40,000,000). Compositing occurs before map construction; existing per-frame ground draw path is unchanged.
- `tools/test_incoming_damage.mjs`, `tools/proof_v089.cjs`, sprite validator (429 entries), JS syntax and offline-shell existence checks pass. All 605 shell entries exist.

One harness screenshot helper initially referenced an absent `closeInv`; interaction and art checks had already passed. Corrected the helper and completed the focused workflow. Original report is retained in `harness-missing-helper.json`; no game bug or performance result was hidden.

User acceptance is separate evidence: Johannes reports v0.88 performance on the tablet is good, nothing to complain about. Backlog #20 moved to Done. Historical software/GPU reports remain intact. No v0.89 hardware performance measurement is claimed.

Remaining graphics issue: black/shadowy rectangular box around cars/buildings at medium proximity, disappearing closer. Tracked in backlog #41 for later investigation.
