# Ruinenstadt

Top-down loot ARPG in post-collapse Berlin. Runs in the browser, installable as a PWA, works offline.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` via `file://` works for playing, but the service worker only runs on `https` or `localhost`.

## Structure

| Path | Contents |
|---|---|
| `index.html` | Markup, loads CSS and scripts in order |
| `css/style.css` | All styles |
| `js/*.js` | Classic scripts sharing globals, load order set in `index.html` and `sw.js` |
| `sw.js` | Service worker, offline cache |
| `manifest.webmanifest`, `icons/` | PWA install |
| `BACKLOG.md` | Roadmap and version history |
| `tools/` | Balance simulator: `node tools/balance.mjs [runs] [difficulty]` with the local server running. A bot plays a fresh campaign and prints a line per run |

## Release

1. Bump `VERSION` in `js/core.js` and `CACHE` in `sw.js`.
2. New JS file? Add it to `index.html` and `SHELL` in `sw.js`.
3. Add a row to Done in `BACKLOG.md`.

## Deploy

GitHub Pages: Settings → Pages → Deploy from branch → `main`, folder `/ (root)`.
