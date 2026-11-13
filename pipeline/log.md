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


## 2026-11-10 · Codex · user feedback on GDR proportions and wear

- PR #24 merged as `7b7d70b45b8d6ed806616ffe677fffcd9263aec5` after completed clean Codex review of `12415b7f2762bf12815f489e159c1f516a0f6f89`, no remaining threads/checks.
- Johannes likes the colour setting but asks for a larger Uhrwerkläufer and a believable taller/wider Brigadeghul. He explicitly authorizes matching functionality and hitbox changes. Add more rust, chips, cracks and broken/torn parts while preserving clear blue/yellow. Apply this to pending building/asset work too.
- Task 11 source/decor drafts are safely preserved in local WIP `ff85e62` on `codex/11-alexanderplatz-pioneer`; no unreviewed runtime integration or method choice has shipped. Task 12 corrects enemy proportions first on `codex/12-gdr-enemy-proportions`.


## 2026-11-10 · Codex · task 12 complete, v0.68, session wrap

- Twelve repainted frames enlarge Uhrwerkläufer to the humanoid clockwork
  design (height 64/radius 22, speed 34, walk 4 fps) and Brigadeghul to
  believable worker armour (height 44/radius 20). Other districts' ghouls
  retain radius 10. HP/damage/ghoul speed and constructor RNG draws are
  unchanged. Explicit sole anchors and recipe ownership preserve rebuilds.
- Real colliders, elite-safe spawn/event probes, wall/crowd/contact behavior,
  clock shield and overlays/fallbacks follow the larger bodies. New semantic
  tests exercise actual collision/contact, shield/elite and fallback paths.
  Keep missing-image Uhr's older canvas design as the temporary fallback.
- Rust, chipped enamel, cracks, torn cloth and exposed/broken covers preserve
  the bright blue/yellow and hammer-and-sickle direction. Active style board
  and durable style bible extend the wear requirement to future buildings.
- Initial Alexanderplatz timing exceeded the 5% budget. Cache only these two
  families' projected shadows by frame/light/facing (max 2.76 MiB); retain
  size and rendering quality. Semantic cache/padding tests and one-off
  144-case pixel comparison cover the change. Final isolated seven-pair full
  render comparison vs v0.67: Köpenick 51.4→51.3 ms (-0.2%), Alexanderplatz
  43.7→42.9 (-1.8%), Mitte 51.0→50.7 (-0.6%). All pass the enforced budget.
- Validation: 6 Python + 22 JS tests, all 227 manifest entries; twelve images
  reproduce byte-for-byte and decode to 1,162,352 bytes. Final Chromium proof
  includes 32 galleries, 40 world views, real-player scale at default/2x,
  shield/open-guard views, actual 3-second GDR combat/circle-wall clearance,
  required-image failures and fresh offline v0.68 with 97/97 enemy images.
  No unexpected page/image errors. Evidence and reproduction commands:
  `pipeline/proof/12-gdr-enemy-proportions/`. Tablet thermal playtest remains.
- Johannes asked to finish the current task and wrap the session. No new
  tasks started. Preserve task 11 building studies on their separate branch,
  including the newer weathered sources, with a paused handoff. Generic
  texture-kit vs full-building method is still undecided; full-building
  footprint fit is unresolved and its rejected studies must not ship.


## 2026-11-10 · Codex · task 11 paused for session wrap

- Preserve original facade/roof/decor drafts plus the new weathered facade,
  roof/overlay kit and B building source on the separate task 11 branch.
  Sources are saved as `*-weathered-study.png` without overwriting selected
  clean atlas recipes. No runtime integration or method selection ships.
- Preserve scratch harness source and inspection notes in task 11 proof,
  with explicit superseded/path/footprint limitations. B foundation fit is
  still unresolved after three attempts. Do not retry silently or ship it.
  Next-session handoff: `pipeline/proof/11-alexanderplatz-pioneer/README.md`.
- Task 12 is the final active task; Johannes explicitly requested session
  wrap. Task 11 remains paused for a future session.

- Final task 12 PR #26 merged as `60ec422ca0760fdffb9f914659b579cbb650520d`
  after Codex completed a clean review of exact head
  `26220ace5cd788ecd51d04ea25279c2fda1fc873`. No review threads or status/check
  runs remained. This paused branch is synchronized with that release.


## 2026-11-10 · Codex · task 11 complete, v0.69, PR #27

- Johannes resumed the paused branch and explicitly requested completion,
  review and merge of PR #27. Reused the approved weathered Pioneer board
  and saved facade/roof studies. Eight normalized paintings: south/east
  facades, roof, ivy, damaged plaster, blue/red hammer-and-sickle banners and
  mural. Tightened overlay alpha selection to remove source haze without
  repainting the approved designs; explicit crops/reasons remain in recipes.
- Completed one exact-footprint current/A/B proof at default/2x and rotations
  0/+0.6/-0.6. B is honestly labelled the same approved kit precomposed at
  3 px/unit, not an independent full-building illustration. No fourth blind
  generation or anchor distortion was used. Rejected paintings remain raw
  unselected studies. Removed superseded scratch-path/mirrored-B scripts.
- After seeing concrete proof, Johannes selected “Apply A to the GDR blocks”.
  All existing GDR Zucker constructors now tag the painted kit/decorations.
  Three shared repeating face textures fit existing P3/withRot geometry and
  variable footprints, including narrow blocks. Existing collision, heights,
  sorting, culling, fades and RNG remain unchanged. The east source carries
  its own shading. Unsupported roof/light geometry retains complete fallback.
  Decor renders on both painted blocks and legacy fallback; a missing decor
  image keeps the underlying building art rather than painting a partial set.
- Validation: 6 Python + 33 JS tests, 235-entry manifest/alpha/size checks,
  eight images reproduced byte-for-byte, selectors idempotent. Final browser:
  eighteen current/A/B captures, actual runtime/default+2x and standalone
  decoration views, real collide(P) resolution plus tangent walks on both
  wall faces at all rotations, two fresh required-image HTTP404 fallbacks,
  fresh offline v0.69 play with all 8/8 GDR files cached/decoded, no unexpected
  page/image errors. All 41 recorded runtime/tool source hashes match.
- Fixed proof determinism by initializing audio before the world seed (its
  noise buffers consume random draws). Final seed20261110 generates one
  tagged/eligible/painted/decorated Zucker, verified at both zooms; semantic
  tests cover additional dimensions. An earlier seed's pre-existing edge lot
  extends beyond WS4000; choose an interior building for real wall walks
  rather than bypassing map clamps. No game map/collision change was needed.
- Final seven-pair isolated full-render A/B vs exact merged v0.68:

  | District | Before ms | After ms | Change |
  |---|---:|---:|---:|
  | Köpenick | 54.7 | 55.3 | +1.10% |
  | Alexanderplatz | 40.9 | 41.4 | +1.22% |
  | Mitte | 49.7 | 49.1 | -1.21% |

  Seeded maps/walls/camera/player and 40 enemy positions/radii match exactly.
  All pass the enforced <=5% budget. Runtime textures total 4,481,288 bytes
  (4.27 MiB), including shared canvases; dev-only B brings proof to6.53MiB.
  Separate fixture diagnostic: current23.1ms, A24.1ms, fixedB22.4ms. Desktop
  timings do not establish tablet heat/battery behavior. Evidence/commands:
  `pipeline/proof/11-alexanderplatz-pioneer/README.md` and `final/`.
- High-reasoning internal review is clean. Its one proof-provenance finding
  was fixed before the final run: stale visual hashes now reject combining
  changed sources with performance evidence. Publish final code, request a
  fresh configured Codex review and merge only that completed reviewed head.
- Task 02 step0 is complete with A selected for GDR. Its Köpenick production
  assets and task08 landmarks/street-prop follow-ups remain separate work;
  this PR does not claim to finish all biome art.


## 2026-11-10 · Codex · completion PR after draft merge #27

- PR #27 was merged externally at `7515e0f` as `3a43d2192fbb99ad44377d4a909fdff467a30388`
  while the completed v0.69 implementation was still local. That merge only
  contains the earlier preserved studies and status claim. Corrected its
  title/description so they do not claim the finished runtime release.
- Synced completed work with the merged main on
  `codex/11-gdr-buildings-complete`. All 41 validated runtime/tool source
  hashes remain identical after the merge; no code or art changed. Main's
  runtime is still v0.68: relative to the exact timing baseline its sole JS
  addition is the unreferenced original gdr-assets draft, plus three unused
  manifest decoration entries. Index, service worker and all loaded runtime
  scripts match v0.68. Existing final validation therefore remains applicable.
- Open the completion follow-up for fresh Codex review and merge its final
  head. This delivers the approved A rollout, all eight weathered selections,
  fallback/offline integration and the completed evidence described above.
- 2026-11-10 (v0.70, Claude): added legendaries for head, hands, feet and ring and set pieces for the same slots (sets now 5 pieces, bonuses at 2/3/5). Art still SVG fallback. New work package `tasks/12-legendaries-and-sets.md` (10 icons, optional hero parts).

## 2026-11-10 · Codex · queue and status update

- Johannes accepted the GDR enemy proportions/wear work in
  `12-gdr-enemy-proportions.md`. This records acceptance of that prior work; it
  does not claim new implementation or authorize a merge.
- Current authorized queue: Köpenick building kit; ten legendary/set icons,
  with any worn parts matching the set art goal; props/fire; player animation
  step 1; vehicles with assets fitted to actual runtime rotations.
- Köpenick style canvas is saved in
  `assets/raw/codex/02-buildings-koepenick/style-canvas-abc.png`, with the exact
  prompt and design-status notes beside it. Recommended mix: A common Altbau,
  B occasional variant, C selected ruins. Johannes's design choice is pending;
  the production task remains open. The sheet is not a runtime texture atlas.
- Tablet heat/performance checks are deferred much later. Existing desktop
  measurements remain desktop evidence only.
- Reconciled the stale vehicle “quick win/start here after 01b” claim: vehicles
  are fifth in the current queue. Updated backlog, workflow and task statuses;
  no runtime work or merge authorization is implied. The duplicate `12` task
  prefixes remain unchanged; references use descriptive filenames.
- Created an ignored local `.venv` with Pillow 11.3.0 and numpy 2.0.2;
  `tools/requirements-assets.txt` records the dependencies. Manifest check:
  235 sprites pass; 6 Python and 33 JavaScript asset tests pass. No runtime
  files changed. Browser proof was not rerun: Playwright is absent from the
  default Node path and the harness needs a Windows Chromium path.
- Used GPT-6 Luna subagents for documentation and narrowly scoped read-only
  equipment/vehicle preparation. Painting used built-in image generation,
  whose exposed tool has no model/quality selector. Reusable texture kits
  and scripted normalization reduce duplicate painting. No API/CLI generation.
- Vehicle implementation direction: map painted face textures onto existing
  P3 geometry at runtime road rotations (up to ±45°), retaining procedural
  wheels/frustums and the full fallback; independent 360° painted renders are
  not required. Updated `contract.md` and `03-vehicles.md` accordingly.
- Clarified legacy duplicate task numbering (including `08-landmarks.md` and
  both descriptive task 12 files) without renaming. Corrected the icon task's
  code version to v0.70 and separated required icons from optional worn parts.
  Style-bible Alexanderplatz status now scopes delivered enemies/building kit
  while keeping landmarks open.

## 2026-11-10 · Codex · Köpenick kit draft and design autonomy

- Johannes chose A common Altbau, B occasional variants and selective C
  ruins. Thirteen normalized materials cover those variants, slab blocks and
  the Späti. Sources, exact prompts, crops and aperture pivots are preserved.
  The dedicated picker rebuilds only its own keys, byte-identically; existing
  235 manifest entries and old art remain unchanged.
- Runtime uses the original footprints, light/window positions, ruin-cutout
  union, sorting and collision records. Projected caches derive from the
  texture kit at actual rotations, 3 px/screen unit, one draw per building.
  Cache memory is capped at 40,000,000 bytes; drawn entries take priority over
  unused prefetches. District/camp/tunnel transitions release queued caches.
- Validation: 248-entry manifest, 49 JavaScript and 6 Python tests pass;
  60 browser paint/legacy/contact views cover five kinds, three rotations,
  default/2x zoom. Six source-resolution cached/live comparisons have zero
  pixel differences. Required-image HTTP404 keeps complete fallback. A fresh
  v0.71 offline reload plays with 13/13 new images decoded/cached and no
  post-boundary image failures. All 47 recorded source hashes match.
- **Not accepted for release:** isolated timing passed (+0.90% Köpenick,
  -3.67% Alexanderplatz), but the final combined run failed at +9.68%
  Köpenick (2.191 to 2.403 ms/frame; limit 5%). Its visible/cache-revisit
  working sets were fully painted, with peak 39,514,028 bytes. Do not choose
  the favourable timing or claim the budget passes. Three optimization
  approaches were tried; preserve a draft and continue independent work.
  Evidence/commands: `pipeline/proof/02-buildings-koepenick/README.md`.
  Version/cache 0.71 are draft-only; main remains 0.70, no merge authorized.
- New standing design rule from Johannes: A/B/C only for critical design
  choices, with strongly different alternatives. For about 80% of routine
  assets, choose, create and show the design; continue unless he objects.
  Updated CLAUDE/workflow/style bible; technical checks and merge rules stay.
- Next equipment choices: Kiezwache B, Spreegeist B, Zitadelle A. The sheets
  are saved locally under the equipment task raw folder; production is next.
  Props/fire, player animation step 1 and rotation-fitted vehicles remain queued.
- GPT-6 Luna helpers reached their usage limit during validation. Root took
  over the final run. No cheaper image-model selector is exposed by the
  built-in painting tool; source reuse and scripted processing remain the
  cost-saving route.

## 2026-11-10 · Claude · task 02 performance gate review

- Codex's +9.68% Köpenick failure is not decidable with its method: seven
  unpaired batches, baseline spread 2.14 to 2.68 ms (25%), paired deltas
  -21.8% to +12.6%, three of seven faster with the kit. The isolated +0.90%
  pass is equally inconclusive.
- Found and fixed one real cost: caches baked at fixed 3 px/screen unit were
  drawn minified at the 960×640 proof viewport (DPR×Z = 2.37), reading 6.5 M
  source pixels per frame vs 3.0 M legacy. Now `koepScale()` = min(3, DPR×Z):
  5.3 M, 27 instead of 18 cached buildings in 40 MB, no evictions. On the
  Tab S9 (about 1280×800, DPR 2) the scale stays 3, so the device cost is
  unchanged by this fix.
- New gate `tools/perf_koep.cjs` (used by `proof_koep_buildings.cjs`): own
  context, 21 pairs, paired median + bootstrap 95% CI, pass/fail/inconclusive,
  Alexanderplatz as null control, GPU renderer recorded, software raster
  never counts. Rules and the Windows procedure: `.claude/skills/asset-perf-gate/SKILL.md`.
- Validation in the cloud container (no GPU): 50 JS tests pass; cache/live
  comparison 6/6 zero-difference at scale 2.5; quick visual proof and
  perf-only harness run without page errors (verdict software-raster).
- Open for Johannes: run the gate once on the Windows PC (about 10 min).

## 2026-11-11 · Claude · task 02 performance gate run (Windows GPU)

| District | Off ms | On ms | Paired median | 95% CI | Verdict |
|---|---|---|---|---|---|
| Köpenick | 2.170 | 2.052 | -6.51% | -8.22% … -2.26% | pass |
| Alexanderplatz (null control) | 2.955 | 2.939 | -0.74% | -4.73% … 1.30% | pass |

- GPU: ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11), hardware raster. 1280×800 @ DPR 2, 21 pairs, commit 0dc5f4b, Windows 11, power mode "Höchstleistung", headless Chrome via Playwright 1.65.0. Raw data: `perf/perf-2026-11-10T23-39-22-523Z.json`.
- Verdict: **pass**. First and only run, nothing discarded; no levers needed. Draft PR #30 can go to review; not merged.


## 2026-11-11 · Codex · PRs 29/30 review follow-up

- Fixed visible cache churn: pin current-frame entries, keep a stable subset, suppress rejected requests until view/geometry changes. Overflow uses complete fallback.
- Both proof entry points propagate unsuccessful gate exit codes. Alexanderplatz separately requires the whole CI within ±5%; noisy controls are inconclusive.
- PR #30's committed GPU pass superseded the original release-gate finding. Reconciled stale draft wording and retained historical evidence.
- 58 semantic checks pass. Real 2560×1440 / DPR2 reproduction at (1600,1400) converges at 18 caches, 39,841,412 bytes, no continuing evictions or page errors. Two visual/contact fixtures and two world views pass.
- Fresh RTX 4070 gate: 21 pairs, 1280×800 DPR2. Koepenick -2.85% CI [-5.25,2.25]; Alexanderplatz +2.27% CI [-1.32,4.77]. Both pass. Raw data: `perf/perf-2026-11-11T06-26-54-510Z.json`. Desktop evidence only.
- Deleted only merged local branches `codex/asset-queue-koepenick` and `claude/busy-turing-wcm3s0`; remotes were already gone. Preserved all unfinished asset worktrees.
- Moved playtest paragraphs verbatim to `docs/playtests.md` at Johannes's request; linked the index/backlog and updated current pipeline priorities.


## 2026-11-11 · Codex · player animation step 1 continuation

- Review fixes published as draft PR #31 (`ade3477`), with Johannes's explicit publication approval. No merge authorization. Animation is a separate branch stacked on that fix.
- Resumed the preserved dirty player-animation draft without modifying its original worktree. Integrated onto current code, retaining the camp cache-reset hook. Twelve lossless knee derivatives, 14 outfits, independent ankle/boot layers, opposite elbow swing, speed/wet-dependent cadence, torso lean/counter-rotation and head lag. Existing rig art bytes and weapon pivots remain unchanged.
- v0.73 draft. The knee builder is byte-idempotent; explicit UTF-8 I/O repairs existing malformed manifest descriptions without changing geometry. No new painting or directions.
- 62 JS and 6 Python checks pass; 26 weapon pivots checked. Browser proof: three outfits × three weapons, all 14 outfits × three boots at 1x/2x, hit overlays, inventory, 3 s play, required-image HTTP404 fallback and fresh offline reload. No unexpected failed requests/page errors. Maximum grip drift 0.837 local units; textures + layer caches 6,507,432 bytes.
- Fresh RTX 4070 paired gate: Koepenick +2.02% CI [0.08,4.09]; Alexanderplatz -0.16% CI [-1.23,0.47]; old/old null control 0.00% CI [-1.71,1.44]. 21 pairs, 1280×800 DPR2, 100 warmup/300 timed renders, zero timed canvas allocations; overall pass. Raw data: `pipeline/proof/09-player-animation/perf/perf-2026-11-11T06-36-05-887Z.json`. An initial attempt was interrupted before any verdict while reconciling the camp hook.
- Shown comparison GIF; human movement acceptance remains open. Secondary motion and extra views remain separate steps; tablet heat/performance remains deferred.
- Recorded vehicle technical direction and alternatives in `docs/vehicle-rendering.md`: retain P3 body/cabin geometry and procedural wheels, map painted face materials. Actual `rotN` plus ±.06 rad jitter reaches ±48.44°, so production waits for the expanded edge-on/rotation-fit proof. Existing equipment, props/fire and vehicle worktrees remain preserved.

- Publication checkpoint: draft PR #31 is `codex/pr29-30-review-fixes` -> main; draft PR #32 is `codex/player-animation-complete` -> the #31 branch. Animation head `a8e9140`; both are unmerged. Merge #31 first, then retarget #32 to main. Human animation acceptance remains open.


## 2026-11-11 · Codex · consolidated PR and movement/inventory follow-up

- Johannes requested one PR. Retargeted #32 to main; closed #31 as superseded. All review-fix, animation, backlog, playtest-history and vehicle-decision changes stay in #32. No merge authorization.
- v0.74: low analogue input blends short, slower steps into a long-stride full-input run; normal full-speed cadence 10 instead of 13 rad/s, hip swing up to .8 rad. Stronger arm swing, about 7° forward torso lean and ±7° weapon sway; attack/dash suppress added sway. Existing movement speed, combat timings, hit geometry and RNG remain unchanged. Keyboard uses the full run.
- Wide inventory now gives the character/equipment a larger column and a 480×640 portrait doll, with weapon-aware framing. Comparison stacks in a smaller column. Backpack cells remain square, grow to ~80 px at 1280×800 and form additional rows scrolling downward. Sticky header keeps controls visible. Phone canvas aspect ratio follows its portrait backing pixels.
- Browser fixtures cover 1920×1080 desktop; 1280×800, 1024×768 and 1180×820 tablets; phone portrait/landscape. At 1280×800 the doll grows 110 -> 298 px, equipment boxes 64 -> 76, cells 57 -> 80, comparison 600 -> 405. The 1024-wide cell collapse (16 px) is fixed (85 px). Last backpack/stash item selection and horizontal-overflow checks pass. Physical tablet acceptance remains open.
- 63 JS / 6 Python tests pass. Source-hashed animation/offline/fallback proof passes; stress-probe grip drift 1.245 local units remains below the existing 2-unit tolerance. New walk/run GIF covers three outfits and three weapons.
- Paired RTX 4070 gate: Koepenick +0.19% CI [-0.91,1.21], Alexanderplatz +0.28% CI [-1.94,1.84], null control +0.08% CI [-1.38,0.51]; pass, zero timed canvas allocations. Report: `pipeline/proof/09-player-animation/perf/perf-2026-11-11T07-00-30-840Z.json`. Only menu sticky-header CSS was corrected after timing; renderer JS remains identical. Final responsive/browser checks include that correction.

- Final handoff: #32 is the single combined draft PR against main; #31 remains closed. All six responsive viewport fixtures also pass last-stash selection and header visibility after scrolling. No merge performed.


## 2026-11-11 · Codex · comparison acceptance and resolved-travel running

- Johannes asked whether comparison also works. The existing layout screenshots already had active selected/equipped cards. Added a stronger six-viewport fixture with a three-affix rare weapon, expanded post-equip stats and the actual equip action. All numeric values remain unclipped; predicted power 151 equals equipped power 151; old weapon returns to the 18-item backpack. Screenshots/JSON: `pipeline/proof/14-inventory-layout/comparison*`.
- v0.75: running forward hip reaches -1.05 rad with a straight knee at extension; recovery gets the knee bend, rear push .72 rad. Torso lean increases to .23 rad (~13°). Hand and weapon bob ±1.8 local units through the elbow chain; fixed shoulder and bone lengths, no detached grip. Carry bob/sway disabled for attacks and dash.
- `heroAdvance` now advances phase from actual projected displacement after collision resolution in expedition and camp. Faster running advances it proportionally; blocked movement stops it; dash distance is excluded. Visual `animSpeed` does not change gameplay positions/speed. Synthetic pose tools explicitly clear it.
- Initial larger leg motion exceeded attack grip tolerance (2.781 units). Retained failed probe JSON under `diagnostics/first-extension-grip.json`; reduced attack-only stride to .4 and final stress probe passes at 1.258 units. Full running extension remains. 66 JS checks pass, including phase at 30/60/120 Hz, doubled speed, blocked movement and fixed arm lengths. Browser/offline/fallback proof passes with zero page errors/unexpected failed images.
- Local proof preloads intermittently refused connections; diagnostics identified local HTTP server backlog pressure. Enlarging the listen backlog to 128 resolved the fixtures; documented in browser setup. No game fallback or loading behavior was weakened.
- Paired GPU acceptance pending at this checkpoint. Work remains on the single consolidated draft PR #32; no merge authorized.

- Final v0.75 RTX 4070 gate passes: Koepenick -2.82% CI [-9.87,2.95], Alexanderplatz +0.08% CI [-1.69,3.89], null control +0.69% CI [0.13,2.15]. 21 pairs, 1280×800 DPR2, zero timed canvas allocations/page errors; `perf-2026-11-11T07-24-36-658Z.json`. All timed source hashes match the final candidate.


## 2026-11-11 · Codex · PR 32 breakpoint review correction

- Johannes authorized fixing findings, merging, then continuing shared props/fire and vehicles. PR #32 had one P2: fixed minimum grid tracks overflowed at 900–983 CSS px.
- Retained the three-panel layout and proportional widths, but let each track shrink to zero instead of reserving 360+240+320 px. Backpack cells still use their 72 px minimum. Larger viewport proportions remain identical.
- Expanded layout/active rare-comparison proof to 900, 920, 960, 983 and 984 px, alongside the existing desktop/tablet/phone matrix. Check scrolling, no horizontal overflow, visible values/actions and real item equip. Runtime JS and the previous GPU acceptance are unaffected (CSS-only fix).


## 2026-11-11 · Codex · PR 32 merged; shared props/fire complete locally

- PR #32 final review on `ce5f72a` completed with no findings; original thread resolved. Merged expected head as `8853689` and synced main. No checks were bypassed.
- Resumed preserved task05 draft onto merged v0.75 on `codex/global-props-fire`, retaining current rig/building fixes. Eleven shared paintings, deterministic eight-frame fire, complete fallback and unchanged world/tunnel walls. No new painting was necessary; routine design remains the preserved source family. Original worktree is untouched.
- Current smoke/gallery/all-district/tunnel, missing-image, phase diversity and offline v0.76 proof passes. Runtime build is byte-idempotent; 271-entry manifest; task memory 1,013,788 bytes with zero derived caches. Existing 66 JS checks, task assertions and 6 Python tests pass. Spati constructor test compares stable RNG/geometry/light ownership while its sandbags become dynamic props.
- Paired RTX 4070 gate: Koepenick -0.29% CI [-3.05,2.29]; Alexanderplatz -0.41% CI [-2.13,0.56]; null +0.09% CI [-2.61,0.46]. 21 pairs, 1280×800 DPR2, 100+300 renders, zero timed canvas allocations. Raw report under `pipeline/proof/05-props/perf/`.
- Automatic approval review rejected publishing the new props/fire branch because authorization for that new publication was not explicit enough. Continuing locally; request publication approval only when the asset changes are concrete and reviewable. No workaround attempted.
- Isolated local vehicle continuation starts from merged PR #32 on `codex/vehicle-complete` in `.worktrees/vehicle-complete`; original dirty vehicle draft is preserved. Repairs required: scheduled, bounded device-scale caches; stable visible overflow; correct face/wheel visibility through the actual ±48.44° extremes; current geometry/visual/offline/GPU proof.


## 2026-11-11 · Codex · shared assets, rounded vehicles and shrine refinement

- Continued from merged PR #32, preserving original dirty equipment/props/vehicle drafts. Shared props/fire and vehicles are consolidated in one v0.77 candidate. Merged online save PR #33 is preserved; subsequent PR #34 changes only playtest/telemetry docs and will be retained too. The verified merged PR #32 branch was deleted locally/remotely with an exact-head lease.
- Vehicle geometry checker preceded production paint. Corrected face/wheel visibility past ±45° through the actual ±48.44° road jitter; scheduled device-scale caches own every projected allocation, map/resize/geometry retirement and stable over-budget fallback. Decoded source and all caches share 40 MB; warm vehicles use one drawImage. Removed temporary arrays/object lookups from new draw hooks.
- Johannes rejected the angular/two-tone Trabi and box van. Built-in imagegen produced new cream-only Trabi, windowed Barkas B1000 KB and independently painted partly burned sedan atlases. Rounded shells/cabins stay within unchanged collision rectangles; Trabi has a 34-unit body/cabin silhouette and properly proportioned round headlamps. The blue Barkas also supplies a clearly distinct cream enamel variant. Original raw paintings remain preserved; prompts/crop record in task03 refinement folder.
- Forty-two active vehicle face files, 3,732,900 decoded bytes, 439,214 encoded bytes, largest 39,786. Full builder byte-idempotent; obsolete turquoise/red Trabi and old red sedan runtime files retired. Shared props source 1,013,788 bytes plus one prewarmed 65,536-byte cyan glow. No new gameplay RNG/placement/collision changes.
- Explicit shrine change: faint unused Litfaßsäule aura, removed when consumed; existing buffs last 60 s instead of 45. Real update proof grants 60, counts to 59 after one second and prevents recollection. Light occlusion is deliberately untouched and placed at the very top of BACKLOG for Claude.
- Final browser proof passes: 20 checker/painted sheets, 14 district views, all eight variants at 1×/2×, exact seven-district wall parity and tangent walks, HTTP404 fallback and offline v0.77 decoding all 42 faces. Maximum vehicle proof allocation 24,664,164 bytes (world max 11,127,516). No page errors/unexpected failed images. 73 JS tests + prop assertions + 6 Python tests pass; 313 manifest entries validate.
- Harness corrections: seed only after initAudio (its first initialization consumes RNG); one intermediate offline decode failed because an image rebuild overlapped the proof. Froze all runtime files and reran current-source proof; no loader behavior or acceptance threshold was weakened.
- Final combined GPU gate passes on hardware RTX 4070, 21 alternating pairs with two fresh contexts each, 100 warm + 300 timed full renders, 1280×800 DPR2, all-prop/10-fire and ten all-kind/axis vehicle fixtures plus 40 enemies. Zero timed canvas allocations/page errors; all source/image hashes match. Final report: `pipeline/proof/03-vehicles/perf/perf-2026-11-11T12-46-36-859Z.json`.

| Scene | Paired median | 95% CI | Result |
|---|---:|---|---|
| Köpenick | -15.42% | -17.16% to -13.89% | pass |
| Alexanderplatz | -9.28% | -9.76% to -6.92% | pass |
| Null control | -2.51% | -4.04% to -1.17% | pass |

- Earlier full candidate also passed; retain its report as history, superseded by the final allocation-cleaned/cream-variant run. Physical Tab S9 heat/battery and human feel remain open. New branch publication/review remains pending after the previously recorded automatic export rejection; no bypass was attempted.


## 2026-11-11 · Codex · soft body shoulders and publication authorization

- Johannes requested removal of the heavy black corner/rim on the top of the car body, then explicitly authorized publishing the combined branch and opening its PR. Removed the extra polygon stroke, trimmed the authored dark border through face UV sampling, and softened the rounded top contour. Footprints, wheels, source image bytes, cache dimensions and warm draw path remain unchanged.
- Refreshed visual/default/2×, rotation, collision, missing-image, shrine and offline proof passes; 73 JS tests and prop assertions pass. Prior six Python tests remain applicable (no builder changes).
- Johannes then clarified that full checks are unnecessary after each small cosmetic asset edit. Stopped the redundant GPU run; its completed Köpenick sample passed (-16.61%, CI -22.01 to -15.38), but no complete new gate verdict is claimed. Reuse the recorded complete integration gate (-15.42/-9.28% with a passing control); refreshed visual proof identifies the final appearance code. Documented proportionate checks in CLAUDE/workflow.
- New publication authorization resolves the earlier export approval blocker. Publish one draft PR; no new asset merge requested.

- Publication complete: one draft PR [#36](https://github.com/johakunath/Ruinenstadt/pull/36), `codex/shared-assets-vehicles` → main. Includes the softened body rim and all shared asset/shrine/backlog changes. No merge performed. The cosmetic-check preference is recorded in CLAUDE/workflow.


## 2026-11-11 · Codex · PR 36 merge readiness

- Merged current main (PR #35 through v0.80) into the asset branch. Resolved release/backlog conflicts as v0.81, preserving the latest gameplay, controller/inventory, DPR/sharpness and Claude lighting-occlusion changes as well as all assets and 60 s shrines. Updated stale lighting backlog status instead of reintroducing the already implemented work as a new task.
- PR #36 initially had no review submissions/comments. Mark ready, request current-head review, address actionable findings, then merge under Johannes's explicit authorization. Checks are scoped to the actual merge/review changes.

- Review completed on `2743e054f48d629fe40275b0789441e2ff11898e` with no findings or unresolved threads. All 73 JS checks plus prop assertions pass; brief integrated v0.81 play smoke has zero page errors. Final follow-up changes only backlog/task status. Merge authorized by Johannes; retain historical art/GPU proof without redundant reruns.

## 2026-11-11 · Codex · task 06 boss style canvases started

- Claimed the next open asset-generation package on local branch `codex/bosses`, independently from the nature runtime/performance handoff.
- Built-in referenced-image generation produced three transparent style canvases covering all nine district bosses. The eight existing Kodex portraits remain the identity source; the Volkseigene Koloss follows its code concept as a clock-ring Plattenbau machine with asymmetric tool arms.
- Selected all nine full-body designs as the production direction because their silhouettes and signature colours are clearly distinct. Raw PNGs, exact prompts and the decision record are in `assets/raw/codex/06-bosses/`. No runtime, gameplay, version or cache changes yet.
- Next: animation-source sheets, beginning with idle, attack and hit poses. No push, PR or merge performed.

## 2026-11-11 · Codex · task 06 district bosses complete candidate

- Built-in referenced-image generation produced nine transparent five-pose sheets from the approved style canvases and Kodex/district references. Final prompt set and correction record are stored with the source sheets.
- Deterministic `tools/build_bosses.py` cuts and normalises 54 anchored WebPs. Fixed an alpha intermediate overflow found by visual proof, then removed detached neighbouring-pose fragments by connected silhouette. Final output is 1,948,952 encoded / 17,699,360 decoded bytes; no derived cache.
- Integrated all nine big-boss variants without changing combat positions, attacks, collision, radii or RNG. Existing canvas bosses remain the missing/disabled fallback. Reconciled onto current v0.83 main as v0.84; cache and version move together.
- Browser proof passes all 54 frames at 1×/2×, intentional HTTP404 fallback and fresh offline decode. Sprite validation and boss/enemy semantic tests pass.
- Hardware RTX 4070 gate: retained 21-pair run was inconclusive only for Alexanderplatz. Required 41-pair rerun passes Köpenick -2.91% CI [-5.53,-0.48], Alexanderplatz -2.04% [-3.63,+1.60], null +0.15% [-1.77,+2.28]. Zero timed canvas allocations/page errors; no optimisation attempt needed.
- Candidate is ready for PR review and explicitly authorized merge. Equipment and nature remain separate branches.

## 2026-11-12 · Codex · task 06 reconciled onto v0.83 main

- Merged current main after it advanced through v0.83 camp stations; preserved v0.82 blessings and v0.83 camp work, and moved bosses to v0.84. All 69 JS tests, 6 Python tests, 367 sprite checks and refreshed browser/fallback/offline proof pass.
- Current-source RTX 4070 painted comparisons pass: Köpenick -1.51% CI [-5.62,+1.24], Alexanderplatz -3.30% [-9.29,+0.08]. The 21-pair off/off control was inconclusive at +0.95% [-2.62,+6.53]; the required 41-pair control-only rerun remained narrowly inconclusive at -0.84% [-5.40,+2.24]. Zero timed canvas allocations/page errors.
- Retain every report; do not select the earlier favourable control. No asset optimisation is indicated by off/off noise. Open/review the PR, but require Johannes performance acceptance before merge.

## 2026-11-12 · Codex · task 06 reconciled onto v0.86 main

- Main advanced through v0.84 save fixes, v0.85 playtest/icons/ground cache and v0.86 powers/story while PR #40 opened. Preserved all upstream work and moved the boss candidate to v0.87.
- Prior performance reports remain retained and accurately labelled; their source hashes predate this reconciliation. Current v0.87 head passes 71 JS tests, 6 Python tests, 371 sprite checks and refreshed browser/fallback/offline proof for all 54 boss frames. Performance acceptance remains with Johannes because the latest off/off control was inconclusive.
- PR #40 review P2: restored the Zitadellenritter's existing `e.fa`-directional, `e.guard`-aware shield overlay over painted art so frontal damage reduction and guard-break state remain visible while circling. Added a regression assertion.
- PR #40 current-head review P2: the Volkseigener Koloss now holds its authored attack-release frame for the full `e.spin` gear volley instead of walking idly through the sustained damaging attack. Added a regression assertion.

## 2026-11-13 · Codex · nine district design proposals

- Johannes moved design boards ahead of runtime production: three each for
  Tempelhof 1948, Charlottenburg 1920 and Wedding's eternal “bald”. Generated
  all nine with the image tool using the Köpenick board as visual reference
  and `docs/story.md` as narrative source. Each includes scene, survivor
  front/back, enemies, friendly NPCs, equipment, props and palette. No workers
  were needed for the small metadata/documentation work.
- Tempelhof: foggy airlift / wind-and-parachute pilgrims / hangar night shift.
  Charlottenburg: last revue / street jazz and Ringverein / mirror palace.
  Wedding: Leopoldplatz market / Panke AEG-Osram industry / wedding-hall refuge.
  The Kiez's Turkish, Lebanese and Arab neighbours remain allies; enemies are
  construction, developer promises and Zeitlose. New names are proposals only.
- Originals, exact prompts and generation-to-file mapping are preserved under
  `assets/raw/codex/16-district-design-boards/`. All nine were visually inspected.
  `docs/district-design-directions.md` compares them and supports mixing parts.
  **Johannes's choices remain pending.** No direction or new mechanic is
  approved by archiving these boards. Existing finished references are intact.
- Updated backlog, CLAUDE index, workflow, style/story links, batch index and
  task 15; added tasks 16/17. Next session: all global pickups/materials and
  SVG-only equipment gaps, reuse existing painted equipment icons for drops,
  preserve code rarity glow; then audit/complete Köpenick/global buildings as
  shared fallback. Completed task 02 was a facade/roof kit, not the still-open
  landmark package. Audit missing art versus missing hooks before painting.
- Maximum one Codex measurement run per production batch is now explicit,
  including 40 MB decoded memory, 5% frame regression, actual milliseconds,
  slow frames over 50 ms and longest frame when available. Claude owns deeper
  integration, optimization and detailed testing. No broad tests/tuning here.
- **One validation pass: pass.** Nine unique 1536×1024 PNGs fully decode, copied
  originals match, prompts/references and comparison links exist, no runtime
  files changed, diff whitespace check passes. Report: raw folder's
  `validation.json`. Encoded boards: 34,529,360 bytes. Conservative RGBA for
  viewing all nine: 56,623,104 bytes (documentation, not a game allocation).
  Added game texture/cache memory: **0 bytes**. Frame ms, regression, slow-frame
  share and longest frame: **not measured / not applicable** to this batch.
  No hardware-performance pass is claimed. No manifest/SHELL/version bump.
- PR [#42](https://github.com/johakunath/Ruinenstadt/pull/42) opened as draft
  during generation. Publish complete boards/docs, then request one Codex
  review. Runtime production and its deployment belong to the next session;
  no district art is being hooked into the game before design selection.
