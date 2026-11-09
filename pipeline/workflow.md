# Asset pipeline workflow

How the painted in-world art is made, plugged in and handed over. Index for everything is `CLAUDE.md`; this file is one of its topics. Related: `contract.md` (renderer contract and hitbox rules), `tasks/` (work packages, take the first `open` one), `log.md` (handover log, append only), `history.md` (old prompts, context only). Before visual work also read `docs/style-bible.md` and the boards in `docs/style/`.

## Roles

| Who | Does | Does not |
|---|---|---|
| Johannes | Picks variants, approves each task, playtests on the Tab S9 | Edit code |
| Codex | Does the tasks end to end: generates sprites and parts, cuts and normalises them, writes the manifest, hooks the renderer, updates the player rig (`tools/build_hero.py`, `js/hero.js`, `drawHero`) and menu art when a task says so, tests in the browser, opens the PR | Change task scope or the contract on its own: write the question into `log.md` instead |
| Claude | Plans and writes the tasks, keeps `contract.md` right, reviews and debugs Codex PRs, fixes what is architecturally tricky | Redo Codex work without a note in `log.md` |

Tasks are written so they can be followed step by step: concrete files, functions, numbers and acceptance checks. If a step is unclear or does not work as written, stop at that step and write it into `log.md`.

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
