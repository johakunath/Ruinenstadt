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
- Review PR: https://github.com/johakunath/Ruinenstadt/pull/17 (screenshots and validation evidence attached; not merged).

## 2026-11-09 · Codex · task 07 complete, v0.61

- Task 00 PR #17 is merged; this work starts from `a94f7f1`. Claimed task 07
  on `codex/07-player-rig-v2` with pushed status-only commit `25c164b`.
- Rebuilt the player around one opaque charcoal mannequin. H02a and the
  H03–H07 outfit designs remain the selected identities; regenerated layer
  derivatives rather than new character designs. Colour-only choices:
  mannequin A (charcoal), Blaumann A (cobalt). Comparison and raw sheets are
  in `assets/raw/codex/07-player-rig-v2/`. Corrected a baked sleeve in the
  default torso before integration.
- All fourteen outfit looks use the same shoulder/hip and two arm segments;
  clothes do not move the body. Added six independent hat overlays including
  Strohhut, four palm/finger glove layers, three boot layers and blue trousers.
  Weapons sit between palm and front fingers. All twenty-six use authored
  grip/tip pivots in the manifest; no PCA or WFIX guesses. The spear idle angle
  clears the face. Gameplay radii, reaches, sorting and drawHero signature stay
  as before. Static registered layer combinations are cached at rig resolution.
- Rewrote `tools/build_hero.py`, preserving the player's 6 px/local-unit
  resolution and documenting it in the contract; world sprites remain 3 px/unit.
  Manifest checker supports the explicit player entries. Removed superseded
  v1 arm files. Bumped VERSION/CACHE to 0.61; all 130 rig assets are in SHELL.
  Legacy ghoul offline proof now derives the cache name from VERSION.
- Validation: six Python and six JS tests pass; manifest alpha/size/pivots,
  shell paths and JS syntax pass. Builder rerun is byte-identical across 132
  generated files. Browser sheets cover all outfits, weapons and wearables in
  idle/step/swing at large and game size. Actual inventory drawDoll passes.
  Visible default/2x hitbox shots cover seven districts and the S3 tunnel,
  without tall-building occlusion. Deliberate image HTTP 404 uses visible
  canvas fallback. Separate fully offline reload starts a run, waits 3 s,
  loads 130/130 parts and has no page errors. Proof scripts/results/images and
  reproduction notes: `pipeline/proof/07-player-rig-v2/`.
- Performance against unchanged v0.60, seven alternating-order pairs with
  fifteen warmups and fifty timed full renders each: Köpenick median
  50.8 → 50.3 ms; Mitte 45.1 → 45.3 ms (0.2 ms within paired timing spread).
  No material desktop regression; Tab S9 remains Johannes's hardware check.
- Johannes authorized continuous PR → Codex review → fixes → direct merge
  sessions. Added that loop to `workflow.md`, retaining design selections,
  completed review and required checks as merge gates. No forced chat clearing
  is available; durable handoff notes preserve progress across compaction.
- Worker trial: a cheaper Luna worker prepared metadata and proof scaffolding,
  but parent review caught wrong spear directions and several test-harness
  mistakes. Keep high effort for rig/integration/visual review; medium effort
  is suitable for mechanical batches. Do not treat worker output as verified.
- Next task: 01 enemies. No new task is included in this PR.

## 2026-11-09 · Claude · motion and light foundation, v0.62

- New `js/vfx.js` (effects, daylight, shadows) and `js/anim.js` (generic enemy
  driver). `ghoulSprite`/`drawGhoulSprite` are gone: any `enemies/<type>-<pose>`
  manifest key is drawn without a hook, only `<type>-idle` is required. Details
  in the new last section of `contract.md`. Task 01 no longer needs renderer
  work per enemy, and frames must come without painted ground shadows.
- Wired examples only: melee swing crescents and spear thrust, hit and kill
  impacts, lightning, projectile trails, Molotow pulse. Everything else is task
  08 (`tasks/08-vfx-rollout.md`), written for a cheaper model with exact call
  sites and acceptance checks. Spot-check its screenshots.
- Looks were decided without a variant sheet (palette taken from the existing
  districts). All strengths are constants in `js/vfx.js`; Johannes has not
  playtested on the Tab S9 yet.
- Frame time: `tools/perf_vfx.cjs`, busy scene, 1280x800 at DPR 2, headless
  software raster. Median before/after in ms: Köpenick 122/113 and 125/122,
  Mitte 95/102 and 100/101, Alexanderplatz 113/95 and 84/89. Inside run-to-run
  noise. A hardware check on the tablet is still open.

## 2026-11-09 · Claude · sound, coloured light, game feel, pack movement, v0.63

- `js/audio.js` rebuilt (bus with compressor and generated reverb, new `FX`
  recipes, modal and filtered-noise layers, `mal` voice, `audioTick`). Checked
  by script only (no errors, levels, lengths). Nobody has listened to it yet:
  Johannes judges by ear, recipes are data in `FX`.
- `steer()` in `js/update.js` changes difficulty: enemies no longer stack and
  chasers surround the player. Not balance-tested. In a 30-enemy script test
  they covered 7 to 8 of 8 directions with no overlapping pairs.
- Bot balance pass by a Sonnet worker on v0.62 (before `steer`), few runs per
  district so anecdotal: Köpenick, Xhain, Alexanderplatz won almost always,
  Mitte 1 of 3, Tempelhof 0 of 2; tunnel wave 8 stuck twice with 1 to 2
  spitters left and nothing to spawn. No numbers changed.
- `?debug=perf` shows frame time and script time per phase on the device.
  Coloured light measured A/B in one page (Mitte, 26 tinted lights): 95.5 ms
  on, 96.8 ms off, so no measurable cost.


## 2026-11-09 · Codex · task 01, v0.64

- Task 07 PR #18 merged after Codex review completed without findings on
  `c59d764`; merge commit `1f8d791`. The continuous-session loop was exercised
  end to end. Task 01 claim `a1b416d` was pushed on `codex/01-enemies`.
- Added fifteen portrait/code-derived variants, six frames each, plus a separate
  shield panel. Existing ghoul retained: 97 enemy assets total. The raw source
  sheets, crops, anchors and mouth pivots are under `assets/raw/codex/01-enemies/`.
  No new design selection: portrait identities and the existing GDR code/board
  designs remain the references. Corrected crow alpha and a clipped Raser pose
  before normalizing. One scale per family keeps pose proportions consistent.
- Integrated the v0.63 foundation from PR #19 instead of replacing it: generic
  driver, breathing/wind-up/hit/spawn life, cast shadows, coloured light, VFX,
  audio and committed-charge steering remain. Driver metadata supplies each
  authored reference radius (3 source pixels per world unit) and selects
  Schrottkoloss/Brigadeghul variants. District bosses stay canvas for task 06.
  Painted `life: .45` complements the authored poses.
- Shield art follows the same `e.fa` transform and existing blocking arc; white
  hit flash is cached through its alpha mask. Crow body is above its ground
  ring; committed charges/dives face their projected travel direction. Mitte
  cable overlays remain. Required image failures fall back to the canvas body;
  optional missing poses retain the generic driver's pose fallback.
- Spitter/Kernspeier mouth pivots include the actual life/mirror transform.
  Projectiles and their VFX trails start at that visible point, then ease to
  the old ground-plane path over .18 s. Logical spawn x/y, velocity, damage,
  radius and lifetime are unchanged. Visual cast timers do not change attacks.
- Checks: six Python tests and eleven JS tests; manifest/alpha/size/pivots;
  byte-identical normalization across 98 files; all 378 shell files exist.
  Browser: 32 family pose sheets, 40 district/tunnel debug-hit screenshots,
  real shield damage at either side of the block arc, actual canvas-matrix
  mouth checks, crow flight, charge/elite/HUD, HTTP404 canvas fallback and
  fully offline reload/run with 97/97 enemy assets. No page/image errors.
  Full methods and results: `pipeline/proof/01-enemies/`.
- User requested wrap-up and production publication; no additional task was
  started. Release is 0.64 because upstream shipped 0.62/0.63 during the pause.
  GitHub Pages publishes main at `https://johakunath.github.io/Ruinenstadt/`.
  Tab S9 hardware playtesting remains Johannes's step.
- Final isolated performance against v0.63, forty mixed enemies: Köpenick: 55.3 → 53.2 ms (-3.8%); Mitte: 56.0 → 53.4 ms (-4.6%). No desktop regression.


## 2026-11-09 · Codex · task 01b batch 1, v0.66

- Continuous session explicitly authorized by Johannes: autonomous design
  selection, batches of 30 images, completed Codex review, fixes, then merge;
  independent work continues during review. Claim `49e1efe` pushed on
  `codex/01b-enemies-batch-1`. This is the first 30 frames, not task completion.
- Four board-first family canvases are saved under the task raw folder. Pick
  01 for Ghul (crooked long arms), Speier (balloon throat), Zünder (round
  boiler), Heuler (arched trumpet) and Raser (horizontal skeletal runner).
  Reasons and source-space anchors/mouths are in `picks.json`. The baseline
  silhouette gate finds seven similar height/outline pairs; all sixteen
  current idles are annotated with no remaining pairs. The required weak
  Schildträger, Brigadeghul and Schrottkoloss still need their second batch.
- Repaired source alpha and wide planted stances after internal review. Idle
  candidate sole envelopes are now about +/-5.4 units, within actual projected
  ring half-widths 10/11. Inspected six-pose/both-facing browser galleries,
  contact drawings and default/2x world proof. Rejected sources remain raw.
- Five visual height metadata values follow the new bodies; renderer
  algorithms, r, damage, attack ranges, shield arc and projectile physics stay
  unchanged. Existing keys and shell paths are reused; VERSION/CACHE 0.66.
  Recipe ownership migration and legacy selector skip avoid duplicate keys
  and accidental restoration of the old paint.
- Validation: six Python and eleven JS tests; 227-entry manifest validation;
  31 byte-identical outputs after a complete builder rerun; 378 shell paths
  exist. Final browser run passed: 32 galleries, 40 world captures, actual
  shield/mouth/crow/elite/boss checks, deliberate HTTP404 canvas fallback,
  fully offline v0.66 reload/run with 97/97 enemy images; no unexpected page
  or image errors. Reproduction and evidence: `pipeline/proof/01b-enemy-redesign/`.
- Final isolated seeded 40-enemy A/B vs v0.65 (headless desktop):

  | District | Before ms | After ms | Change |
  |---|---:|---:|---:|
  | Köpenick | 54.1 | 53.4 | -1.3% |
  | Alexanderplatz | 43.8 | 43.6 | -0.5% |
  | Mitte | 52.6 | 49.1 | -6.7% |

  Thirty-frame decoded bytes 1,027,536 (0.98 MiB), all enemy textures
  4,835,468 bytes (4.61 MiB), below the 40 MB task budget. Tab S9 hardware
  thermal/battery verification remains Johannes's check.
- Preparation for task 03 found a real constraint: most geographic vehicles
  have arbitrary `b.rot`, while the task/contract supplies two flat views.
  `withRot` rotates 3D P3 vertices, not the canvas. A 2D ground affine tilts
  painted verticals; ignoring rotation or using old art leaves geographic
  vehicles incomplete. Question for Johannes/Claude: authorize extra authored
  angles or a layered vehicle construction? Do not change the contract
  silently. Skip this dependent step and continue other tasks under the
  autonomous-run stop rule. No vehicle runtime changes made.

- Batch 1 ready PR #23 opened, reviewed candidate `ec80d2de5fb5bf5e3bd07fa9b296d53d51e12899`, all above validation complete. Codex review pending. Independent remaining 18-frame generation prepared for `codex/01b-enemies-batch-2`; batch 1 branch stays unchanged during review.


## 2026-11-10 · Codex · task 01b complete, v0.67, GDR direction update

- PR #23 merged as `5edf3a5b3892b371e57038e8f83080f559cb5896` after the
  configured Codex review completed with no findings for exact head
  `ec80d2de5fb5bf5e3bd07fa9b296d53d51e12899`. No review threads or checks
  remained. Batch 2 branch `codex/01b-enemies-batch-2` claimed in `245d4b3`
  and synced with merged main. First-batch 30 images and entries are unchanged.
- Final batch delivers 24 frames: Schildträger, Brigadeghul, Uhrwerkläufer,
  Schrottkoloss. All eight weak silhouettes are redesigned. User then
  explicitly requested hammer-and-sickle logos and yellow/blue Junge-Pionier
  identity for GDR, followed by buildings/assets of that biome. Regenerated
  Brigadeghul and Uhrwerkläufer accordingly; Uhr keeps its existing body and
  poses. New active board `docs/style/alexanderplatz-pioneer.png`; durable
  rules in the style bible. Task 11 records the user-prioritized continuation.
- Pick shield U-Bahn03 vaulted shell, brigade Alexanderplatz01 square collar
  plus new Pioneer livery, Schrott U-Bahn01 chimney triangle. Existing Uhr
  geometry gets the requested livery. Reasons/crops/scales are in picks.json.
- Internal review found the broad bottom strip included low hands/claws.
  Schildträger and Schrottkoloss now have explicit per-pose sole centres
  (`SOLES` in picker). Rebuilt/inspected proof confirms centred feet. Separate
  shield direction/open-guard behavior and all combat numbers are unchanged.
  Two visual height values follow the new bodies; first release proof stays
  intact. Generic silhouette output now targets the latest proof directory.
- Validation: 6 Python + 11 JS tests, 227-entry manifest/alpha/size check,
  54 images/entries reproduce byte-for-byte. Final Chromium run after GDR
  repaint passes: 32 six-pose/both-facing galleries, 40 default/2x world
  captures, actual shield/mouth/crow/contact/elite/boss checks, HTTP404 body
  fallback, fresh fully offline v0.67 reload/run with 97/97 enemy images and
  no page errors or unexpected image failures. All runtime paths reused.
  Evidence: `pipeline/proof/01b-enemy-redesign-batch-2/`.
- Final isolated seeded full-render A/B vs merged v0.66:

  | District | Before ms | After ms | Change |
  |---|---:|---:|---:|
  | Köpenick | 52.9 | 52.7 | -0.4% |
  | Alexanderplatz | 46.4 | 43.6 | -6.0% |
  | Mitte | 53.5 | 50.9 | -4.9% |

  Desktop results meet the budget; tablet heat/battery still needs hardware
  playtesting. Batch 24 frames decode to 1,932,616 bytes; all 54 repainted
  frames total 2,960,152 bytes (<40 MB).
- Continuation: prioritize the requested GDR buildings and assets. Prepare
  one Zuckerbäcker A/B building proof under task 11; task 02's generic method
  decision is still open. Continue independent GDR banners/crests/landmarks
  while it is reviewed. Earlier non-GDR prop studies remain local generated
  drafts and are not integrated into this enemy release.

- 2026-11-10 (v0.68, Claude): added legendaries for head, hands, feet and ring and set pieces for the same slots (sets now 5 pieces, bonuses at 2/3/5). Art still SVG fallback. New work package `tasks/12-legendaries-and-sets.md` (10 icons, optional hero parts).
