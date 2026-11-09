# Handover log

Newest at the bottom. One entry per handover: date, who, what changed, what is open, what the other side has to know.

## 2026-11-09 · Claude

- Set up `pipeline/` (workflow, contract, tasks 00 to 06). The old `docs/asset-pipeline.md` is removed, its earlier content is in `history.md`.
- Painted player rig is in the game (v0.52): parts in `assets/hero/rig/`, layout in `js/hero.js`, built by `tools/build_hero.py`, drawn by `drawHero` in `js/art.js` with the code figure as fallback. Pivots and swing angles are the old ones, so attack arcs did not move. Weapon icons are rotated into the hand; their length is set from the hit reach (`HWL`).
- `index.html?debug=hit` draws player radius, enemy radii and the melee sector. Use it for every character sprite.
- Style: new art gets brighter, saturated signature colours (style bible, "Item colour"). The rust-brown starter look stays only for what exists.
- Open for Codex: task 00 first (tooling plus ghoul end to end).

## 2026-11-09 · Claude (second pass)

- Rig v1 fixes: torsos centred on the body (not the scarf), shoulder pivot moves with them; weapons with the tip pointing down on the sheet flipped (`WFIX` in `tools/build_hero.py`: Klinge der Zitadelle, Speer der Siegessäule, Neonflinte, Mikroständer, Zorn der Ringbahn), slingshot and sling with fixed grips; hammer at rest is dragged head down in front.
- Johannes wants v2 with a mannequin base body, fists and every outfit as a layer: task 07. Do it after 00, before or alongside 01.
- Docs: `CLAUDE.md` is the only index, `AGENTS.md` only points to it. This folder holds topic files: `workflow.md`, `contract.md`, `tasks/`, this log.
- Roles changed (Johannes): Codex does tasks end to end, including rig and code integration. Claude plans, reviews and debugs. See `workflow.md`, Roles.

## 2026-11-09 · Codex · task 00, awaiting variant choice

- Claimed task 00 on `codex/00-tooling-ghoul` (status-only commit `ad927ca`).
- Generated three E01/Köpenick-based ghoul alternatives in `assets/raw/codex/00-tooling/ghoul-variants.png`; comparison at `assets/raw/codex/00-tooling/comparison.png`, including the required 64 px row. A = cobalt blue, B = bottle green, C = oxblood red. Johannes has been asked to pick; none is selected yet.
- Prepared `tools/sprites.py`: discovers approved task `picks.json` files, removes border-connected backgrounds or preserves alpha, trims, scales to 3 px/unit, transforms source-coordinate anchors/pivots, writes WebP quality 88 and merges the manifest deterministically. `--check` validates files, dimensions, transparency, size, anchors, pivots and metadata. Selection format is in its module docstring.
- Prepared `js/sprites.js`: one manifest fetch at boot when loaded, lazy cached `spr(key)` images, null while missing/loading/failed. Empty manifest for now. Loader is deliberately not wired into `index.html` or `sw.js` until the chosen ghoul is integrated.
- Checks passed: six Python regression tests (including byte-identical reruns and broken-asset detection), two JS loader tests (including manifest/image failures), manifest check and JS syntax check. Headless Chromium via Playwright: loaded the game, injected the loader, called `startRun(0,false)`, waited 3 s; no page errors or failed local requests.
- Open: Johannes's variant choice (workflow step 4: “He picks”), selected animation frames/parts, ghoul renderer hook and hitbox proof, default/2x screenshots, performance/offline checks, version/cache/backlog update and PR. Task remains in progress; no completed-release claim. No contract or gameplay changes.

## 2026-11-09 · Codex · task 00 complete, v0.60

- Johannes picked ghoul B (bottle green) and explicitly delegated pure colour decisions. Updated workflow roles, selection step and definition of done: Codex chooses colour-only variants within the style bible and records the choice without asking. Design/silhouette choices still go to Johannes.
- Generated the selected design's six-frame sheet and recorded source crops/foot anchors in `assets/raw/codex/00-tooling/picks.json`. Normalised WebPs are at 3 px/local unit, quality 88, each below 8 KB; one common source scale keeps the bite/recoil shorter instead of stretching them. Re-running produces byte-identical WebPs and manifest.
- Wired `js/sprites.js` before `js/art.js`; `drawEnemy` selects idle, two walk poses, wind-up/recovery, contact and recoil from existing movement/contact/hit timers. Keeps mirroring, sorting, silhouettes, elite rings, health bars, stun markers and cached white hit flash. Missing/loading sprites fall through to the original canvas drawing. Mitte retains cable overlays; Alexanderplatz deliberately retains the distinct canvas Brigadeghul until task 01 supplies its Blaumann/cap design.
- Corrected painted feet/shadow anchor from legacy `e.y + e.r*.75` to `e.y + e.r*.4` so the soles stand inside the projected debug ring; documented in `contract.md`. Collision radii, contact distance and gameplay timing are unchanged.
- Bumped VERSION/CACHE to 0.60, added loader/manifest/all six frames to SHELL, updated BACKLOG and marked task 00 done.
- Validation: six Python and three JS tests passed; manifest, JS syntax and shell-file existence checks passed. Playwright started a run and waited 3 s, with no page errors or failed local requests. Actual file-rename fallback passed. Separate fully offline reload loaded all six frames and started a run without errors. Default/2x screenshots cover all seven districts plus an S3 tunnel; bite/recoil hitbox proofs are in `pipeline/proof/00-tooling/`.
- Performance, 40-ghoul seeded scenes and three paired samples: median of render medians Köpenick 33.9 → 31.6 ms, Mitte 53.2 → 51.2 ms (headless desktop, not a tablet performance claim). Repro scripts: `tools/proof_ghoul.cjs`, `tools/check_ghoul_offline.cjs`; results and method in the proof README.
- Next pipeline task per Claude's priority note: 07 player rig v2, then 01 enemies. Tab S9 playtest remains with Johannes. No other task started.
