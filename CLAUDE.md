# Ruinenstadt

- `AGENTS.md` only points here. Read `BACKLOG.md` for intent, roadmap and version history. Versions are `v0.N`.
- Plain HTML/CSS/JS, no build step, no dependencies. Scripts are classic (not modules) and share globals; order in `index.html` matters.
- View is 2:1 isometric. Logic, collision and map generation use flat world coords; only drawing projects (`js/iso.js`, `render()` in `js/render.js`).
- Maps: grid districts in `js/world.js` + `js/biomes.js` (2400). Geographic districts (`D.geo`: Köpenick 3600, Xhain 4000 in `js/geo.js`, Mitte 4000 in `js/mitte.js`, Alexanderplatz 4000 in `js/alex.js`; landmarks per district in `K.lm`, optional `K.post` after lots); roads are segments (`ROADS`, `roadPt`) for both. Building size: `BSC`/`BHS` in `js/world.js`. U-Bahn tunnel levels and the S+U network menu map: `js/ubahn.js` (`buildTunnel` instead of `buildWorld`, `run.tun`, `S.ln` cleared lines).
- Art: style source of truth is `docs/style-bible.md` + boards in `docs/style/` (Köpenick = default look). Check it before any visual, enemy or district work. Asset handover for Codex: `docs/asset-pipeline.md`.
- ChatGPT menu art (icons, portraits): batch list `docs/chatgpt-assets.md`, raw sheets land in `assets/raw/`.
- Game text is German. Code style is dense one-liners; match it.
- Release: bump `VERSION` (`js/core.js`) and `CACHE` (`sw.js`) together, update `BACKLOG.md`.
- New visual forms (charts, layouts, scenes): SVG mockup first, let the user choose, then implement.
- Smoke test: serve with `python3 -m http.server`, load in Playwright, start a run, check for page errors.
