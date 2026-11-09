# 02 Buildings, Köpenick first

Status: open

Köpenick is the default look (board `docs/style/koepenick.png`). Building boxes are drawn by `drawBox` (`js/iso.js`) from footprint `x,y,w,h` and height; size factors `BSC`/`BHS` in `js/world.js`; landmarks per district in `K.lm` (`js/geo.js` for Köpenick and Xhain).

| Asset | Notes |
|---|---|
| Altbau corner and middle (2 to 3 variants) | 5 floors, broken windows, ivy, shop fronts at street level |
| Plattenbau block | grey panels, balconies |
| Späti | barricaded, sandbags, half-open roll shutter, BVG yellow accents |
| Ruin | half-collapsed Altbau |
| Rathaus Köpenick | landmark, check its footprint in `js/geo.js` |

The sprite replaces the box faces, the footprint stays the collision box. Check that walls line up with the footprint (walking along a wall in game must not show a gap or overlap). Lights stored per building (`lpos` in `js/iso.js`) must still sit on windows or lamps.
