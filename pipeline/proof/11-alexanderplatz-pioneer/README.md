# Alexanderplatz Pioneer buildings · v0.69

Johannes selected A for the GDR blocks after seeing the comparison.
This PR completes the saved task 11 studies as a real renderer, shared
weathered decorations and a reproducible current/A/B building comparison.
The blue/yellow palette and crossed hammer-and-sickle emblems retain the
approved GDR identity. Broken panes, boards, cracked plaster, rust, torn cloth
and ivy carry the post-apocalyptic wear direction into the buildings.

## Deliverables

The previously approved weathered Pioneer board is preserved as
`assets/raw/codex/11-alexanderplatz-pioneer/style-canvas.png`; this batch
derives from that selected direction rather than creating new silhouettes.

Eight normalized WebPs: south/east facades, roof, ivy, damaged plaster,
blue banner, red banner and Pioneer mural. Sources and explicit selections
are in `assets/raw/codex/11-alexanderplatz-pioneer/picks.json`. The selectors
preserve each other's owned keys and the normalizer keeps 3 px/world unit,
alpha, 1 px padding and quality 88. Legacy enemy/hero assets remain unchanged.

`js/gdr-assets.js` maps the painted kit onto the same P3 faces as drawBox,
with the same collision footprint, height, box sorting, fading and rotations.
Three cropped repeating textures are cached once and shared by every size;
no per-building textures or per-frame canvases are allocated. The cool east
painting already contains shading, so the legacy extra .42 darkening is not
applied again. A missing required image leaves the complete legacy drawing.
Standalone decorations appear on painted and legacy blocks; if one is
missing the underlying complete building art remains visible. Decorations
need at least a 120-unit front face so they stay within its bounds.

All existing GDR Zuckerbaecker blocks are tagged for the painted kit and
shared decorations. Other districts retain their art. Gables, rooftop extensions,
boxes narrower than 48 or shallower than 45 units, heights below 60, and
boxes with light emitters opt out before image requests,
so existing window/light placements cannot drift. Zucker has no dynamic
window emitters. This release adds no new building footprints or mechanics.

## Honest method comparison

`final/current-a-b-contact-sheet.png` contains current/A/B at default and 2x,
with rotations 0, +0.6 and -0.6. Cyan outlines use the actual collision
footprint; player scale and contact points use the real player radius.

A is the production painted-face renderer. B is **the same approved painted
kit precomposed at 3 px/unit into one exact-footprint image**, without a ground
shadow. It is an explicit fixed-view storage/drawing prototype, not a new
independent full-building illustration. At zero rotation both approaches
fit exactly. At other rotations the comparison deliberately leaves B fixed
and shows the rotated footprint. Production would need additional authored
views or a canvas fallback before using fixed paintings on rotated buildings.
This proof compares geometry/runtime/storage behavior; it makes no claim
about the artistic advantage of independently authored full-building art.

The original full-building generations remain raw rejected studies. Their
foundation did not match the required footprint; moving/stretching anchors
would hide the defect. That authoring failure says nothing about whether a
properly authored full-building painting could fit. No fourth blind repaint
was attempted. Superseded scratch scripts with generated-image paths and
mirrored B bounds were removed; the canonical tools below use repository
sources and the actual production renderer.

## Reproduction and evidence

Requires Python with Pillow/numpy, Node with Playwright, and Chromium.

```sh
python3 tools/pick_gdr_assets.py
python3 tools/pick_gdr_building_kit.py
python3 tools/sprites.py
python3 tools/sprites.py --check
node tools/test_gdr_buildings.mjs
python3 tools/run_gdr_proof.py --phase all
```

The proof runner owns temporary HTTP servers and an exact git archive of
v0.68 (`60ec422ca0760fdffb9f914659b579cbb650520d`) as its comparison baseline.
No scratch/generated-image path, manual server or mutable checkout is needed.
`final/results.json` records source hashes and detailed outcomes; canonical
full-render performance must pass <=5% regression in each tested district.
Separate visual/perf phases avoid overlapping browser workloads. Version and
service-worker cache advance together to 0.69; all eight files and the new
runtime script are precached for fresh offline play.

The broader landmark/street-prop tasks stay separate: this release covers
existing Zucker blocks and the eight selected paintings in PR #27, without
silently declaring task 08 or all biome art complete.


## Final validation

All checks pass: 6 Python + 33 JavaScript tests (`final/checks.txt`), all 235
manifest entries, and eight byte-identical image rebuilds with both selectors
idempotent (`final/build-checks.json`). Single WebPs stay below 400 KB.

The final browser run uses seed 20261110 after audio initialization, so audio's
noise-buffer random draws cannot change the map seed. One tagged Zucker block
is generated in that scene; it is eligible and painted/decorated at both
zooms. The constructor tags every existing GDR Zucker block for the kit;
semantic tests cover additional sizes, including 48/52-wide rotated faces.

Evidence includes 18 current/A/B captures, two dedicated decoration views,
two actual runtime views, true collide(P) penetration resolution and eight
wall-tangent steps on both faces, fresh required facade/banner HTTP404
fallbacks, and fully offline v0.69 play with all eight GDR images cached and
decoded. No unexpected page/image errors. The real-world capture selects an
interior building: an earlier seed's edge lot extends past the existing map
boundary, where collide correctly clamps the player. No placement or gameplay
change was made to hide that existing map-edge limitation.

Runtime textures use 2,807,288 decoded image bytes plus 1,674,000 shared canvas
bytes = 4,481,288 bytes (4.27 MiB). The dev-only baked B adds 2,367,036 bytes;
combined proof memory is 6,848,324 bytes (6.53 MiB). B is not precached or loaded
by the game.

Seven alternating paired full-render samples against exact v0.68:

| District | Before ms | After ms | Change |
|---|---:|---:|---:|
| Köpenick | 54.7 | 55.3 | +1.10% |
| Alexanderplatz | 40.9 | 41.4 | +1.22% |
| Mitte | 49.7 | 49.1 | -1.21% |

All worlds, walls, camera, player radius and forty enemy positions/radii match
exactly. All three comparisons pass the enforced 5% budget. These headless
desktop results do not establish tablet thermal/battery behavior.

The separate frozen-fixture diagnostic (`final/fixture-performance.json`)
measures current 23.1 ms, A 24.1 ms, fixed B 22.4 ms over seven alternating
triples. This shows B's single-image drawing advantage for that fixed fixture;
it does not substitute for the complete-world budget or extra authored views.
The approved A rollout follows the walls at all supported rotations.
