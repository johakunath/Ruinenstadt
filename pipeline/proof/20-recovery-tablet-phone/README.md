# v0.92 recovery, zoom and phone inventory

Focused browser checks: `layout-results.json` and `loot-results.json` pass with
zero page errors. Seven phone/tablet/desktop viewports cover inventory layout,
comparison/equipping and horizontal overflow. Tablet zoom increases 10%; desktop
zoom is unchanged. Phone landscape uses three balanced columns; portrait stacks
survivor, backpack, comparison.

Actual game checks cover 30% Döner / 40% orb healing, clamping, retaining orbs at
full health, food and orbs from broken crates, stationary settled loot, rare+
exit warnings, search/resume, guide retargeting and deferred exit rewards.
`daylight-glow.png` shows the stronger rarity glow on a cleared daylight fixture.
Inventory screenshots correspond to the viewport in each filename.

The first smallest-phone run found comparison overflow; retained in
`initial-small-phone-overflow.json`. CSS was corrected before the passing run.
This is browser emulation, not a new physical-device performance acceptance.

Commands: `node --test tools/test_loot.mjs`,
`node --test tools/test_incoming_damage.mjs`, `node tools/proof_loot.cjs`,
`node tools/proof_phone_recovery.cjs`. Existing tablet performance acceptance
stands; Claude's deeper review remains a backlog item.
