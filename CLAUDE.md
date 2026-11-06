# Ruinenstadt

- Read `BACKLOG.md` for intent, roadmap and version history. Versions are `v0.N`.
- Plain HTML/CSS/JS, no build step, no dependencies. Scripts are classic (not modules) and share globals; order in `index.html` matters.
- Game text is German. Code style is dense one-liners; match it.
- Release: bump `VERSION` (`js/core.js`) and `CACHE` (`sw.js`) together, update `BACKLOG.md`.
- New visual forms (charts, layouts, scenes): SVG mockup first, let the user choose, then implement.
- Smoke test: serve with `python3 -m http.server`, load in Playwright, start a run, check for page errors.
