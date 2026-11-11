# Playtest history

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
