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
