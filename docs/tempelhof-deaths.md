# Tempelhof full-health deaths — investigation 2026-11-13

Read-only inspection of the latest cloud save in the native Google Sheet
[Ruinenstadt Sync (live)](https://docs.google.com/spreadsheets/d/14rG_toEJ88HeYDmMmW2jFbHVgQVO21PnAgNx1dJlxsQ/edit).
No cloud save or player progress was modified. No private sync code is recorded here.

The latest two Tempelhof deaths are v0.87 on Normal, waves 2 and 3, after
27 and 60 seconds. Neither run has a boss or equipment change. Total incoming
damage is 1,039 / 1,154; telemetry does not store individual hits or sources.

Replaying the game's actual stat and damage functions with the saved equipment:

| Wave / level | Max HP | Resistance | Ordinary brute melee | Brute slam |
|---|---:|---:|---:|---:|
| 2 | 461 | 24% | 383 | 613 |
| 3 | 468 | 24% | 391 | 625 |
| 5 | 482 | 24% | 406 | 649 |

Damage values are after resistance. `mkEnemy` in `js/combat.js` scales damage
by district item level and `(1 + .6 * D.i)`; `js/update.js` multiplies a brute's
telegraphed slam by 1.6. `bigHit` is a minimum damage floor, not a cap.
The saved gloves and ring together subtract 272 HP.

This reproduces the ability to die from full health to an ordinary enemy,
but does not prove which attack killed either recorded run. There is no
identified NaN/health-state corruption or same-frame duplicate-hit defect;
`hurt` grants 0.4 seconds of invulnerability.

Claude follow-up: review compounded district scaling and the intended Normal
one-shot policy; record recent hits and the killing source in telemetry so
future reports can be diagnosed directly. No speculative balance change was
made during this asset task.

## v0.89 fix (2026-11-13)

Johannes explicitly rules out enemy full-health one-shots and requests lighter
contact, with stronger actual/special attacks. `hurt` now caps post-mitigation
attack damage at 45% maximum HP in every difficulty and district. This is
not protection from death when already injured: the third strongest hit can
kill, and ordinary invulnerability still prevents same-frame hit stacking.

Ordinary body contact uses 30% raw damage and caps at 10% maximum HP; large-body (radius ≥17, including brutes,
bosses and Uhr) contact uses 40% and caps at 18%. Charges and dives are
classified as attacks, so they keep their force. Slams, projectiles, rings
and other existing damage paths share the 45% ceiling. Guard, resistance
and stance still reduce damage before the ceiling. Focused regression tests
exercise the real production functions, including low HP, resistance extremes,
large incoming values, lethal repeated hits and invulnerability.
