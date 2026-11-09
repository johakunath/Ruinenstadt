# Asset pipeline (Codex and Claude)

Start here. This folder is the shared working language for the painted in-world art of Ruinenstadt: what to make, how it plugs into the game, how to test it, and how to hand over. Codex produces and integrates in-world sprites; Claude does menu art (icons, portraits) and the player rig; Johannes decides.

| File | What |
|---|---|
| `README.md` | Roles, workflow, conventions, definition of done (this file) |
| `contract.md` | Renderer contract: units, camera, anchors, manifest format, hitbox rules, how a sprite replaces code drawing |
| `tasks/` | One file per work package, in order. Take the first one whose status is `open` |
| `log.md` | Handover log between Codex, Claude and Johannes. Append, never rewrite |
| `history.md` | Earlier prompts and decisions, for context only |

Also read before any visual work: `CLAUDE.md` (project rules), `docs/style-bible.md` (look, palettes, districts), the boards in `docs/style/` (Köpenick is the default look).

## Roles

| Who | Does | Does not |
|---|---|---|
| Johannes | Picks variants, approves each task, playtests on the Tab S9 | Edit code |
| Codex | Generates in-world sprites (buildings, vehicles, nature, enemies, bosses, props), cuts and normalises them, writes the manifest entries and the renderer hooks, tests in the browser | Menu art, the player rig (`js/hero.js`, `tools/build_hero.py`) |
| Claude | Menu art via ChatGPT sheets (`docs/chatgpt-assets.md`, `tools/cut_sheets.py`), the painted player rig, reviews Codex PRs on request | Re-do Codex sprites without a note in `log.md` |

Both agents may change any code when a task needs it. Keep the change small and say it in `log.md`.

## Workflow per task

1. Read the task file in `tasks/`, then `contract.md`.
2. Set the task status to `in progress (Codex, date)` and commit that alone, so the other agent sees it.
3. Generate 2 to 3 variants per asset. Put raw output in `assets/raw/codex/<task>/`, never into game folders.
4. Show Johannes a comparison sheet (PNG, one row per asset, variants side by side, plus a game-size row at 64 px). He picks.
5. Normalise the picks (`tools/` script, see task 00), write `assets/manifest.json` entries, hook the renderer with canvas fallback.
6. Test (below). Screenshot every asset in game at default zoom and at 2x.
7. Bump `VERSION` (`js/core.js`) and `CACHE` (`sw.js`) together, add a row to `BACKLOG.md`, add new files to the `SHELL` list in `sw.js`.
8. Open a PR, set the task status to `done (vX.Y)`, append to `log.md` what changed, what is open, what the other agent must know.

## Conventions

| Topic | Rule |
|---|---|
| Code | Plain HTML/CSS/JS, no build step, no dependencies, classic scripts sharing globals, order in `index.html` matters. Dense one-liners, match the style. Game text German |
| Tools | Python 3 with Pillow and numpy only (both available). Scripts in `tools/`, runnable with no arguments, idempotent |
| Files | `assets/<group>/<name>.webp` (groups: `buildings`, `vehicles`, `nature`, `enemies`, `bosses`, `props`). Lowercase ASCII names, the code key of the object (e.g. `enemies/ghoul-body.webp`) |
| Format | WebP with alpha, quality 86 to 90. No baked shadow, no text, no background |
| Size | Draw at 3 px per game unit for world objects (crisp at 2x zoom on a high-DPI tablet). Keep single files under 400 KB |
| Fallback | Every sprite hook keeps the current canvas drawing as fallback while the image loads or is missing. Pattern: `himg()` and `drawHero()` in `js/art.js` |
| Colour | Style bible, rule "Item colour": new things get a clear signature colour and more saturation, not only rust, brown and ochre |
| Commits | One task per PR. Raw generations may be committed under `assets/raw/codex/` |

## Testing (required before a PR)

| Check | How |
|---|---|
| Serve | `python3 -m http.server 8765` in the repo root |
| Smoke | Playwright: load `index.html`, start a run (`startRun(0,false)` in the page), wait 3 s, no `pageerror`, no failed image requests |
| Look | Screenshots at default zoom and at 2x, per district the asset appears in (`startRun(i,false)`, `DIST[i]`) |
| Hitboxes | Load `index.html?debug=hit`: pink ring = player radius `P.r`, yellow rings = enemy radii `e.r`, green sector = current melee hit area. The visible feet and body must sit on the ring, attack art must reach about the sector edge. See `contract.md` |
| Perf | Köpenick (3600) and Mitte (4000): frame time not worse than before (Chrome performance panel or `performance.now()` around `render`) |
| Offline | New files listed in `SHELL` in `sw.js` |

## Definition of done

- Johannes picked the variants.
- Manifest entries complete, fallback works (rename the file, game still runs).
- Hitbox screenshots attached to the PR, no visible mismatch.
- No page errors, smoke test passes, version and backlog updated.
- `log.md` entry written.
