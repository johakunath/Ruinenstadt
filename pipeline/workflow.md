# Asset pipeline workflow

How the painted in-world art is made, plugged in and handed over. Index for everything is `CLAUDE.md`; this file is one of its topics. Related: `contract.md` (renderer contract and hitbox rules), `tasks/` (work packages, take the first `open` one), `log.md` (handover log, append only), `history.md` (old prompts, context only). Before visual work also read `docs/style-bible.md` and the boards in `docs/style/`.

## Roles

| Who | Does | Does not |
|---|---|---|
| Johannes | Chooses critical design directions, can object to shown routine designs, approves task scope, playtests on the Tab S9 when scheduled | Edit code |
| Codex | Does the tasks end to end: generates sprites and parts, cuts and normalises them, writes the manifest, hooks the renderer, updates the player rig (`tools/build_hero.py`, `js/hero.js`, `drawHero`) and menu art when a task says so, tests in the browser, opens the PR | Change task scope or the contract on its own: write the question into `log.md` instead |
| Claude | Plans and writes the tasks, keeps `contract.md` right, reviews and debugs Codex PRs, fixes what is architecturally tricky | Redo Codex work without a note in `log.md` |

Tasks are written so they can be followed step by step: concrete files, functions, numbers and acceptance checks. If a step is unclear or does not work as written, stop at that step and write it into `log.md`.

## Current queue (Johannes, 2026-11-10)

This user-authorized order supersedes older queue/order notes below and in task
headers: (1) Köpenick building kit (`02-buildings-koepenick.md`; GDR method A is
already selected), (2) ten legendary/set icons (`12-legendaries-and-sets.md`,
with worn parts matching each set's art goal), (3) props and fire
(`05-props.md`), (4) player animation step 1 (`09-player-animation.md`), and
(5) vehicles (`03-vehicles.md`), whose art must fit the actual supported
rotations. GDR enemy proportions and wear (`12-gdr-enemy-proportions.md`) are
accepted by Johannes. Tablet heat/performance checks are deferred much later.
Task-number prefixes are legacy identifiers and are duplicated across files
(including task 08 landmarks and the two task 12 packages). Do not rename them
as part of queue work; reference each by its full descriptive filename.

Continuation (Johannes, 2026-11-11): after PRs #29/#30 review fixes and merged
branch cleanup, continue either props/fire or player animation step 1. Codex
chose animation and resumes its existing draft; preserve the equipment and
props/fire worktrees. Vehicles require the technical gate in
`docs/vehicle-rendering.md` before production. This replaces the immediate
next-step order above; tablet acceptance stays deferred.

Both agents may change any code when a task needs it. Keep the change small and say it in `log.md`.

## Source per asset family (decision Johannes, 2026-11-11)

Painted (Codex, this pipeline) only where it pays off most: things that move and carry the player's identity. Everything else is made as code-native SVG or canvas art by Claude and stays final, not a placeholder.

| Family | Source | Note |
|---|---|---|
| Hero rig: body, clothing layers, held weapons | Painted (Codex) | `tools/build_hero.py`, `js/hero.js` |
| Enemies and bosses (animated) | Painted (Codex) | Boss queue continues (`06-bosses.md`) |
| Item and menu icons (weapons, armour, jewellery, implants, ingredients, power icons) | SVG, rasterized to 128 px WebP | Approved after the v0.85 batch I71 to I87; existing ChatGPT icons stay |
| Environment: props, ground, nature, camp stations and dressing, decals | SVG / canvas code | `js/camp-art.js`, `js/glyphs.js` pattern |
| Buildings of new districts (Wedding, Tempelhof, Charlottenburg) | SVG / canvas textures on the iso faces | The painted Köpenick and GDR kits stay; repaint only if a district looks clearly worse |
| Landmarks (Fernsehturm, Schloss, Hangar) | Decide per landmark | Painted if it is a one-off hero image, SVG if it is modular |

Why: at draw time both end up as cached bitmaps, so the GPU cost per frame is the same for the same pixel area (`drawImage` of a canvas or a decoded WebP). The real costs are pixels drawn per frame, draw calls and live path drawing. SVG wins on iteration speed (Claude can make and change it in the same session, Codex is the bottleneck), download size, crispness at any DPR and recolouring per district or era. Painted wins on organic, textured, animated figures.

Rules for SVG/code art: rasterize once into a cached canvas (`svgCnv` in `js/base.js`, or an offscreen canvas) at the size it is drawn, never parse or path-draw a complex SVG per frame; keep the noise/grime filters (feTurbulence) to the rasterize step; measure build-time rasterization on the Tab S9 when a district adds more than about 30 SVG sprites; match the style bible (palette, ink outline, top-left light, wear). The v0.62 rule in step 3 below ("do not restyle the canvas/SVG drawings") applies to painted tasks only.

## Workflow per task

**Design autonomy (Johannes, 2026-11-10):** A/B/C decisions are only for the
most critical design and asset choices. For roughly 80% of routine assets,
Codex chooses within the approved direction, creates and shows the result,
and continues unless Johannes objects. Critical alternatives must differ
strongly in silhouette, structure or visual identity; near-identical options
are not a useful decision. This supersedes older per-asset variant/approval
requirements in this workflow, the style bible and task files. It changes
design selection, not merge authorization or technical acceptance checks.

1. Read the task file in `tasks/`, then `contract.md`.
2. Set the task status to `in progress (Codex, date)` and commit that alone, so the other agent sees it.
3. **Design source (v0.62 rule).** Do not trace or restyle the canvas/SVG drawings in `js/`. They are placeholders and limit the design (they came from Claude's code art, not from the style). Take the look from `docs/style-bible.md` and the boards in `docs/style/` (Köpenick board as default), first generate one **style canvas** per task (a single sheet with the district's palette, material language, line weight, lighting and 3 to 5 silhouette thumbnails for the asset family), put it into `assets/raw/codex/<task>/` and show it to Johannes. Then create completely new designs from that canvas. The old drawing is only a gameplay reference: footprint `r`, anchor, telegraph origin and hitbox (see `contract.md`). Silhouette must differ clearly between types.
3b. Create one strong design for routine assets. Generate 2 to 3 substantially different alternatives only for critical decisions. Save raw output under `assets/raw/codex/<task>/`, never directly into game folders.
4. Show the result with a game-size row at 64 px. For critical choices, show clearly different alternatives and wait for Johannes's selection. For routine assets and colour-only choices, choose within the style bible, record the choice and reason, and continue unless Johannes objects. Selected-design animation/layer derivatives need no new selection.
5. Normalise the picks (`tools/` script, see task 00), write `assets/manifest.json` entries, hook the renderer with canvas fallback.
6. Test (below). Screenshot every asset in game at default zoom and at 2x.
7. Bump `VERSION` (`js/core.js`) and `CACHE` (`sw.js`) together, add a row to `BACKLOG.md`, add new files to the `SHELL` list in `sw.js`.
8. Open a PR, set the task status to `done (vX.Y)`, append to `log.md` what changed, what is open, what the other agent must know.

## Conventions

| Topic | Rule |
|---|---|
| Code | Plain HTML/CSS/JS, no build step, no dependencies, classic scripts sharing globals, order in `index.html` matters. Dense one-liners, match the style. Game text German |
| Tools | Python 3 plus Pillow and numpy are required for image scripts; verify/install them in the active environment before running (they are not guaranteed available). Scripts in `tools/`, runnable with no arguments, idempotent |
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
| Perf | Paired on/off gate per `.claude/skills/asset-perf-gate/SKILL.md`: Köpenick plus a null-control district, median paired ratio with 95% CI, on a GPU machine |
| Offline | New files listed in `SHELL` in `sw.js` |

Browser proof portability: the existing proof harness defaults to
`/usr/bin/chromium`, which is Linux-specific. On Windows, configure its
Chromium executable or use an available browser automation setup before
claiming browser validation. Playwright is not guaranteed installed; check the
active environment first. Record any unavailable check in the handover log.

Windows image-tool setup: `python -m venv .venv`, then
`.venv/Scripts/python.exe -m pip install -r tools/requirements-assets.txt`.
Use `.venv/Scripts/python.exe tools/sprites.py --check` for the manifest check.
The virtual environment is local and ignored by Git.

## Definition of done

- Critical design choices are approved; routine design choices are shown and recorded under step 4.
- Manifest entries complete, fallback works (rename the file, game still runs).
- Hitbox screenshots attached to the PR, no visible mismatch.
- No page errors, smoke test passes, version and backlog updated.
- `log.md` entry written.

## Autonomous runs (overnight, v0.65)

Johannes starts Codex and goes to sleep. Rules for such a run:

| Topic | Rule |
|---|---|
| Order | Historical overnight sequence; for current work follow the dated `Current queue` above. That sequence's 03 “quick win” assumption is withdrawn: vehicles are now fifth, and rotation fit is an explicit requirement. Task 02 step 0 is complete for GDR with method A selected; Köpenick production remains open. |
| Sync first | `git fetch origin main` and merge before every task. Other agents ship versions in parallel (v0.62 to v0.64 landed during task 01). Read `js/core.js` on main and take the next free number for `VERSION` and `CACHE` |
| Decisions | Codex decides design picks and colour picks itself using the style canvas and the silhouette/readability checks, records pick and reason in `picks.json` and `log.md`, and never waits for an answer. Anything that needs a game design decision (balance, new mechanic) goes into `log.md` as a question and is skipped |
| Merging | Not authorized by default. Open **draft PRs**, one per task, with the comparison sheet (old vs new) and proof images. Merge only if Johannes wrote "merge" for this run, then follow "Continuous asset sessions" |
| Style source | Style boards and style canvas (step 3 above). Do not trace the code drawings. The already merged painted enemies (`assets/enemies/`) are the quality bar for finish, but not a shape reference for new things |
| Performance budget | The Tab S9 gets warm. Per task: before and after numbers from `?debug=perf` on Köpenick and Alexanderplatz, no regression above 5 %. Large painted assets are drawn from cached canvases or one shared sheet, never rebuilt per frame. Keep decoded texture memory of a task under 40 MB (width x height x 4) and report it. Rules, gate method and the Windows GPU run: `.claude/skills/asset-perf-gate/SKILL.md` (`tools/perf_koep.cjs`). Only a GPU run counts; software-raster numbers are smoke tests. If a task fails the budget, stop and log it instead of shipping |
| Stop conditions | Three failed attempts on the same asset, a test that cannot be made green without changing gameplay, or any need to change the contract. Write it to `log.md` and continue with the next task |
| Report | At the end append to `log.md`: what is done, which PRs are open, what Johannes has to decide (list of questions, max 5), perf table |

## Continuous asset sessions

When Johannes explicitly authorizes a session that includes merging, Codex may
repeat the following loop without asking for merge approval again. Design
selection in step 4 still applies; previously selected designs and their
animation/layer derivatives do not need a new selection.

1. Take the next open task in the documented priority order; claim it in a
   status-only commit and push the claim. Keep one task per branch and PR.
2. Complete the task, all required tests and visual inspection, version/cache,
   backlog and handover log before opening a ready-for-review PR. Attach proof
   images and reproducible validation commands.
3. Opening the ready PR triggers the configured Codex review. Verify that it
   started; use `@codex review` if a review must be requested explicitly.
4. While it runs, record the branch, PR, head commit, validation, decisions and
   remaining work in the handover log. Context compaction is optional and must
   preserve that record; do not claim to clear chat if the client cannot do it.
   Independent generation for another task may use a separate worktree/branch.
5. Read review comments, review threads and required checks. Fix applicable
   findings, repeat affected validation, push, and obtain a completed review
   for the resulting code changes. A queued review or absence of comments is
   not a completed review.
6. Once review is complete, findings are resolved and required checks pass,
   merge the reviewed head SHA without bypassing repository protections. Sync
   main before the next task and record the merged PR in the log.

Use higher reasoning effort for rig/renderer changes, hitboxes, visual
inspection and final review. Routine scripted generation, file normalization
and metadata can use medium effort. A cheaper worker may prepare narrowly
specified metadata or scripts when delegation is authorized, but its output
needs parent review and actual execution. Image-generation latency does not
automatically improve when the coding model is smaller. No model choice
replaces visual or browser validation.

## Current continuation (Johannes, 2026-11-11)

PR #32 merged after review correction. The next batch combines shared props,
fire and vehicles in one PR, following Johannes's one-PR instruction. Online
save from merged PR #33 (v0.76) is retained; this asset candidate is v0.77.
Vehicle refinement, shrine aura and 60 s duration are explicitly requested.
Building-light occlusion belongs at the top of Claude's backlog, not this
implementation. Equipment/nature work remains open. Drafts are preserved; draft PR #36 is open; review remains pending.

## Small cosmetic follow-ups (Johannes, 2026-11-11)

Use a quick visual check for small asset appearance adjustments. Reuse existing
regression/performance evidence when gameplay, collision, cache dimensions and
the warm rendering path are unchanged. Do not repeat the full browser/GPU
matrix after every cosmetic tweak. Run broader checks when the actual change
could affect behavior, geometry correctness, memory or rendering cost.
