# v0.93 healing feedback

`node tools/proof_healing.cjs`: day/night pickup checks pass with zero page
errors. Food heals 25% and orbs 30%; screenshots show the opaque green
`+X Leben` number and a brief green character aura with rising plus signs.
Only actual restored HP is reported. Full health produces no healing effect;
orbs remain available. Overlapping pickups refresh one aura, which expires.

`node --test tools/test_loot.mjs` and the existing incoming-damage regression
pass. Combat drop logic is restored exactly to the pre-v0.92 implementation;
both food and orbs already existed in crates. The reusable phone/recovery
browser harness now uses the restored amounts/drop logic and writes its new
evidence here, preserving the historical v0.92 results.

No new assets, gameplay damage changes or performance acceptance claim.
