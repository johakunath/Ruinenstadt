# GDR proportions and wear · v0.68

User feedback: the GDR enemies read too small, especially the clockwork robot
and the human in the broad armoured suit. The user explicitly authorized
matching functionality and hitboxes. Their approved blue/yellow and Soviet
hammer-and-sickle identity stays; surfaces now show chips, rust, dents,
cracks, torn cloth and broken covers rather than pristine enamel.

| Family | Before height/radius | After height/radius |
|---|---:|---:|
| Uhrwerkläufer | 44 / 13 | 64 / 22 |
| Brigadeghul | 20 / 10 | 44 / 20 |

Uhr uses the larger humanoid style-board design, base speed 34 instead of
42 and a four-frame-per-second walk cadence. Brigadeghul is about player
height, with broader armour; other districts' ghouls retain radius 10.
Health, damage, ghoul speed and constructor random draws remain unchanged.
Elite radii keep the existing factor/rounding (25 Uhr, 23 Brigade).

Actual wall resolution, crowd separation, incoming hits and contact attacks
use e.r. Spawn probes enclose those radii, including event spawns. The clock
shield's panel/origin/drop follow the larger body and elites, while block
angle/damage rules stay unchanged. Uhr feet use a .25 radius ground offset;
Brigade uses .4. Shadows, overlays and fallbacks share the new geometry.
Missing-image Uhr still uses the older canvas design at the larger collider;
its fallback returns its own height for overlay placement. Brigade fallback
has independently adjusted width and height.

New source sheets and explicit sole coordinates are under
`assets/raw/codex/12-gdr-enemy-proportions/`. Ownership of these twelve keys
moves out of task 01b; rerunning either legacy selector respects the new
owner. All runtime paths are reused. VERSION/CACHE advance together to 0.68.
The style bible and active Pioneer board carry the stronger wear direction
into the preserved task 11 building drafts.

`comparison.png` uses each checkout's actual reference radius and ground
offset, so enlarged drawings cannot conceal an unchanged collider. It shows
large, world-size and silhouette old/new columns. `gdr-player-scale-{1,2}x`
shows both enemies beside the real player. Standard galleries cover every
pose/facing; forty world captures cover districts/tunnel at default/2x.
`gdr-clock-shield.png` covers directions/open guard. `gdr-combat-3s.png`
executes real movement/steering/collision. Its clearance check uses true
circle-to-rectangle distances and 1e-6 tolerance: the broad inWall probe is a
conservative expanded rectangle and can flag harmless circle/corner contact.

The first timing run exceeded the 5% budget in Alexanderplatz. The two larger
families now cache their projected shadow alpha at source resolution for
each frame/light direction/facing; other shadows retain their existing path.
Runtime shadow draws only scale/translate. No size reduction or per-frame
canvas allocation was used. All 48 potential cache entries total 2,892,200
bytes (2.76 MiB). A one-off inline 144-case old/new shadow comparison found max
alpha-mass drift 1.351% and max centroid shift 0.126 world units, from expected
resampling at silhouette edges. The inline script was not persisted; geometry/corner padding and cache reuse are
covered by semantic tests. The final performance report enforces <=5%.

Reproduce with Pillow/numpy, Node/Playwright and Chromium available:

```sh
python3 tools/pick_gdr_enemy_scale.py
python3 tools/pick_enemy_redesign.py
python3 tools/pick_enemies.py
python3 tools/sprites.py
python3 tools/sprites.py --check
python3 -m unittest discover -s tools -p 'test_*.py'
node tools/test_enemies.mjs
node tools/test_gdr_geometry.mjs
node tools/test_gdr_shadows.mjs
node tools/test_sprites.mjs
node tools/test_hero.mjs
python3 tools/compare_enemy_redesign.py --types uhr,brigadeghoul --baseline /tmp/ruinenstadt-baseline67 --output pipeline/proof/12-gdr-enemy-proportions/comparison.png
ENEMY_PROOF_OUT=pipeline/proof/12-gdr-enemy-proportions ENEMY_PERF_DISTRICTS=0,2,3 ENEMY_ALLOW_GEOMETRY_CHANGE=1 python3 tools/run_enemy_proof.py --baseline /tmp/ruinenstadt-baseline67
```

Export unchanged v0.67 (`7b7d70b`) to the baseline directory first. The runner
owns temporary local servers and closes them with the check. The deliberate
geometry flag keeps actual old/new radii in the timing report while requiring
identical maps, types, x/y positions, camera, viewport and DPR. Offline proof
uses a fresh cache and decodes all 97 enemy images. Both new required-image
failures are exercised in fresh contexts, in addition to the generic fallback.
Headless desktop results do not establish Tab S9 thermal/battery behavior.

Final results (`results.json`, completed 2026-11-10T12:37:18Z):

| District | v0.67 ms | v0.68 ms | Change |
|---|---:|---:|---:|
| Köpenick | 51.4 | 51.3 | -0.2% |
| Alexanderplatz | 43.7 | 42.9 | -1.8% |
| Mitte | 51.0 | 50.7 | -0.6% |

All checks pass: 6 Python and 22 JavaScript tests (`checks.txt`), 227 manifest
entries, twelve new images reproduced byte-for-byte (`build-checks.json`),
1,162,352 decoded image bytes. Browser proof passes galleries, world captures,
contact/collision/shields, required-image fallback and fresh fully offline
v0.68 play with all 97 enemy images and no unexpected page/image errors.
