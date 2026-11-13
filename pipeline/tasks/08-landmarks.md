# 08 Landmarks (Sehenswürdigkeiten)

Status: open (after 02 step 0 is decided)

2026-11-13 queue: district direction boards first, then next-session global
pickups/equipment gaps and Köpenick/global building coverage (task 17).
Coordinate its landmark audit with this package; the completed facade kit in
task 02 does not close this task. Maximum one measurement run by Codex;
optimization and detailed testing belong to Claude under the revised workflow.

Method B (full iso sprite per landmark): landmarks are one of a kind, so one finished painting each is right. Footprint and collision stay as coded, the sprite replaces the drawing function. Light from the top left, no baked shadow.

Order (cheap and upright first):

| # | Landmark | District | Notes |
|---|---|---|---|
| 1 | Fernsehturm | Alexanderplatz | Upright sprite (`fernsehturm()` in `js/alex.js`). Proportions fixed in v0.65 (shorter, thicker shaft), keep them: sphere with lit window ring and brass gear rim, red-white antenna, ivy |
| 2 | Weltzeituhr | Alexanderplatz | Upright |
| 3 | Rathaus Köpenick | Köpenick | Footprint in `js/geo.js` |
| 4 | Rotes Rathaus, Marienkirche, Berliner Dom, Altes Museum, Palast der Republik, Bahnhof Alexanderplatz | Alexanderplatz | Drawing functions in `js/alex.js` |
| 5 | Mitte landmarks (Reichstag, Brandenburger Tor, Potsdamer Platz towers) | Mitte | `js/mitte.js`, cyberpunk board |
| 6 | Xhain landmarks (Oberbaumbrücke, Hochbahn viaduct) | Xhain | `js/geo.js` |

For each one the checks are: footprint line-up (no gap, no overlap), lights still on windows (`lpos`), `?debug=perf` before and after, canvas fallback kept.
