# 14 Camp stations at S+U Warschauer Straße

Status: open (code delivered in v0.83 with SVG placeholders in `js/camp-art.js`)

The camp is a walkable underground station (`buildBase` in `js/base.js`). Seven stations
(`CST` in `js/data.js`) with three visible levels each, their NPCs and room dressing. Routine
production under the approved style (`docs/style-bible.md`, U-Bahn board `docs/style/ubahn.png`).

## Isometric rules (Johannes, 2026-11-11: the flat front-view stairs and counter did not fit)

Every prop that has depth must be painted in the game's 2:1 isometric view, not as a flat front view.

| Rule | Detail |
|---|---|
| Projection | `ix=(x-y)*k`, `iy=(x+y)*k/2`: world +x edges go screen right-down with slope 0.5, +y edges go left-down with slope 0.5, height goes straight up |
| Visible faces | Top (rhombus, horizontal diagonal twice the vertical), +y face (lower left, lit), +x face (lower right, about 60% brightness). Never paint the back faces |
| Anchor | Bottom centre of the image is the footprint's front corner or centre on the floor; soft 2:1 contact shadow |
| Light | Upper left, matches the existing buildings and props |
| Upright exceptions | Thin poles, hanging signs and people may face the viewer, but their mounts follow the iso edges |
| Built into walls | Stairs, doors and counters that belong to a wall are geometry, not billboards. The exit stairs are code-drawn (`drawStairs` in `js/base.js`) and can stay that way; paint only textures for them if needed |
| Check | Overlay a faint 2:1 iso grid on the proof sheet; edges must follow it. Check at 1x and 0.5x |

## A. Stations (21 sprites), replace `CAMPSVG.st` (`js/camp-art.js`)

Size about 200 × 170 px per sprite at 1x (the hero is about 60 px tall). Level 1 makeshift, level 2 improved, level 3 complete with light or neon.

| Key | Station | NPC | Room |
|---|---|---|---|
| zeug | Zeughaus (weapons) | Mira, Tüftlerin | maintenance room |
| hack | Hackerspace (scrap, armour) | Kalle | maintenance room |
| imbiss | Imbiss (kitchen) | Oma Gerda | old station bakery |
| laz | Lazarett (field hospital) | Dr. Ahmet | old station toilets |
| kom | Kommandantur (quests, radio) | Ilse | west end of the platform |
| markt | Schwarzmarkt (trade, stash) | Kurier Jonas | east end of the platform, near the kiosk |
| exer | Exerzierplatz (training) | Späherin Lin | mezzanine |

## B. NPC figures (7), replace `CAMPSVG.npc`

Same rig scale as the hero, standing idle; later an idle loop of 2 to 4 frames.

## C. Room dressing, replace `CAMPSVG.deco`

Toilet cubicles, kiosk booth, ticket machines, benches, poster board, all in iso. Floors stay code-drawn unless a painted tile set is clearly better (see backlog #40: measure load cost first).
