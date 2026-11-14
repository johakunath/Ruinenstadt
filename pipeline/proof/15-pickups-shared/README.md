# Painted pickups and shared materials — v0.88

One combined browser workflow on 2026-11-13; renderer: **SwiftShader software rasterization**. This is diagnostic evidence, not a hardware GPU pass or Tab S9 acceptance.

- 16 pickup sprites decoded; 15 shared ground/building materials decoded.
- Köpenick at 1×/2×, Alexanderplatz, Tempelhof and tunnel screenshots; pickup rows at 64px and 32px.
- Missing asphalt image retained procedural fallback; offline reload decoded all 31 new images.
- Seeded on/off wall/footprint signatures match; zero page errors and zero timed canvas allocations.
- 1280×800 CSS px, DPR2; 40 enemies + 80 pickups; 7 alternating on/off pairs, 30 warm + 100 timed renders. No hardware-gate CI/pass is claimed.

| Scene | Off (ms/frame) | On (ms/frame) | Median paired change | On >50ms | Longest on frame | Build off/on (ms) |
|---|---:|---:|---:|---:|---:|---:|
| Köpenick | 24.46 | 29.02 | +17.43% | 12.1% | 248.7 ms | 410.3 / 513.6 |
| Alexanderplatz | 28.15 | 29.26 | +6.44% | 14.0% | 219.6 ms | 513.2 / 655.0 |
| Tempelhof | 23.18 | 24.93 | +5.75% | 11.1% | 253.9 ms | 97.1 / 219.6 |

New source images: 16,777,216 decoded bytes. Shared cropped material canvases: 15,606,000 bytes. Combined new art: **32,383,216 bytes**, below 40,000,000 bytes. This excludes pre-existing art and existing map/building canvases; their dimensions are unchanged.

The observed software changes exceed the nominal +5% budget, but software rasterization cannot decide the hardware gate. No optimization or repeated measurement was performed. Claude owns performance optimization, detailed integration/visual testing, and final acceptance.

An initial harness setup timed out because its RAF-based polling was disabled with the game loop; no measurements ran in that attempt. Retained as `setup-timeout.json`; fixed polling and then performed the single measurement above.

After measurement, normalization added the standard 1px transparent border to opaque material WebPs. The material loader already crops that same border; source dimensions, cache dimensions and warm draw path remain unchanged. Sprite validation then passes all 402 entries. The measurement hashes identify the pre-border-normalization bytes; no redundant measurement was run for this format correction.

Runtime source: `js/pickup-art.js`, `js/global-assets.js`; builder: `tools/build_shared_materials.py`; rerun command for Claude: `SHARED_PROOF_URL=http://127.0.0.1:8767 node tools/proof_shared_materials.cjs` after serving the checkout.

Cloud upload age is independently covered by `tools/test_sync.mjs` and browser mock upload: age advances and resets on successful acknowledgement only. No real cloud save was written by validation.

Remaining coverage: nature/trees and one-off landmarks (Rathaus, station entries, bridges) still have dedicated code art; shared wall/roof materials do not claim to complete those packages. Ground has one shared texture per surface, not the older optional three-variant/decal expansion.
