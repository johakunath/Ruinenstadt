# Playtest history

## 2026-11-13 · v0.91 recovery, visibility and phone feedback

Tablet view feels small; desktop zoom is fine. Requested stronger daylight item
glow, larger phone character/backpack with roughly equal landscape thirds,
more healing and food/orbs in boxes. Prefer searching for stationary loot to
end-wave attraction; exit warning must include yellow rares as well as
legendary/set items. Implemented in v0.92; device feedback still welcome.
Expedition-level progression needs a decision rather than passive growth;
recorded near the top of the backlog only. Missing custom buildings, plazas,
landmarks, stations, bridges and moving water lead the next asset queue.

## 2026-11-13 · v0.88 tablet, inventory and asset feedback

- Johannes: tablet performance is good, nothing to complain about. Move performance topic #20 to Done; this accepts the current device behavior rather than changing historical measurement results.
- Painted pickups look good. Remove foil from the Döner and paper from the meat so their silhouettes read better.
- Ground is too even/repetitive: three or four material versions, irregular distribution and patchiness for the broad surfaces.
- Touch inventory drag worked once, then stopped; desktop mouse drag works. Highlight only the actual destination slot, not a whole group.
- Black/shadowy rectangular box around cars/buildings while approaching; disappears closer. Backlog #42; no rendering fix requested in this pass.
- Enemy full-health one-shots are unfair/frustrating. Contact from small mobs should be lighter; large bodies and especially actual/special attacks should hurt more, but require at least two or three hits from full health.

Implemented follow-up v0.89: post-mitigation hit cap and contact categories, repeated touch drag/finger tolerance, destination-only highlight, unwrapped food and four variants of each shared ground material. Final boss appearance/behavior review with Claude remains separate from accepted tablet performance.


Recorded device observations. Current actions live in [BACKLOG.md](../BACKLOG.md).

## Playtest 1 (v0.34, Tab S9 portrait, 15 min Köpenick)

Fun, "almost something to show friends". Lighting and floors good. Item looks on the character good.
Problems: environment scale (cars smaller than player), pure top-down props vs side-view characters, grid-like streets, only 3 equipment slots, Normal too easy, text not wrapping on tablet (fixed v0.35).

## Playtest 2 (v0.51, Tab S9, about 17 min, Köpenick won on Normal)

Fun, no lags, no technical issues, tablet only slightly warm. Map size fine (everything explored, places visited several times), so bigger maps are OK from now on. Icons, buildings and trees good.
Problems: fences and other low blockers flat without height, U-Bahn entrance too small, too much loot (3 legendaries, fully geared after one district), far too easy (enemies and the district boss one-shot, life never in danger), messages vanish before they can be read, weapons do not feel different (no ranged weapon found), lots of Schrott for upgrades.
Telemetry vs bot (Köpenick Normal): Johannes 17.5 min, level 18, 1025 damage taken, power 42→1773, no death. Bot v0.52: 10.9 min, level 19, 1766 damage taken, power 42→601. Working assumption: Johannes is slower but better than the bot, so the bot winning is a lower bound and difficulty can sit above what the bot handles comfortably.

## Playtest 4 (v0.61, Tab S9, 30+ min, Xhain reached)

Feedback batch. Fixed in v0.65 (see Done): vertical walk speed, settings cogwheel, pickup text, full bag, drop rate, Kodex silhouettes, unlock gates, final boss delay, Alexanderplatz market flicker, TV tower proportions, distance sound, set bonuses, dark zones off. The rest sits in Next (#16 to #22).

## Device telemetry before cloud save (2026-11-11, v0.76 exports)

PC, phone and tablet exported before syncing. 8 unique runs (v0.40 to v0.68), all from one save branch; the phone's own save had only 2 aborted runs. Ids `df2s…` (PC), `bw45…` (phone), `65ac…` (tablet) are the same person; all devices now share the PC save.
Performance: v0.63 tunnel on phone 21 fps with 98.7% slow frames, v0.63 Alexanderplatz on tablet 20 fps with 99.4%; overworld on phone 43 to 46 fps with about 2%. v0.68 Köpenick on tablet 58 fps with 1%, but only 7 s, so the fix is not confirmed. Check the first v0.76 tunnel and Alexanderplatz runs in the sheet.

## Playtest 6 (v0.83/v0.84, PC browser with pad, 2048×1152, Mitte won incl. meta boss)

Online save: 21 runs, 4 wins, Kampfkraft 4005 → 7854 per run, Drill-relevant upgrades maxed (Schärfen 10, Panzerung 10, Ausdauer 5, Spürnase 5), all 7 stations at level 2 to 3, 15,835 Schrott and 518 Stoff unused, stash empty, blade mastery 16,342 EP (level 10, +50% damage).
Runs: Alexanderplatz win 958 s, lowest life 77%, 63 fps, 2.1% slow; Alexanderplatz tunnel win 220 s, 36 fps, 40.3% slow (outlier); Mitte win 1027 s, lowest life 9%, boss fights 9 s and 123 s, 54 fps, 4.7% slow.
Feedback: Lager tab unnecessary, stash should sit under the bag in camp with drag and drop, bag too small (25 wanted), Schrott has no sink, Umschmieden only at the smith, lock as an icon, smaller buttons, explain Kampfkraft and ▲, camera erratic with the pad at high speed, mastery against the progression rule, keep blessings into the tunnel, network page layout, Säbeltanz strong but invisible, expected 3 powers at once, 3 quests too few and too dull, story and district vision missing. Station art approved. Fixes and open decisions: v0.85 in `BACKLOG.md`.
