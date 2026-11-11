# Shared props and fire continuation (v0.76)

Baseline: merged PR #32, `8853689187dac5661bcd1de0865e18715e5557fb`.
Resumes the preserved local painted draft; original worktree remains unchanged.

Eleven shared assets: crate, chest, bin, barrel, campfire, lamp, bench,
Litfass, sandbags, fence and one eight-frame flame strip. Static bodies use
source-over; flames use lighter at 9 fps with deterministic per-instance
phase and ±15% speed variation from the existing spawn phase. Existing
lighting, particles and all collision geometry remain unchanged. Missing
required components select complete legacy fallback before partial painting.
Decoded task memory: 1,013,788 bytes; no derived runtime canvases. Largest
file: 55,606 bytes. Rebuilding is byte-idempotent for all runtime images and
manifest; all unrelated asset bytes are preserved.

Reproduce: configure `NODE_PATH` per `tools/browser-setup.md`, serve the repo
on 8765 with the documented larger server backlog. Archive the baseline into
`.tools-browser/props-baseline-v075` via `git archive --format=zip 8853689`
and extract locally. Run `node tools/proof_props.cjs`, `node
tools/perf_props.cjs`, `node tools/test_props.cjs`, `.venv/Scripts/python.exe
-X utf8 -m tools.build_props` and `.venv/Scripts/python.exe tools/sprites.py
--check`.

Browser proof: all 7 districts and tunnel 0 retain exactly equal wall arrays;
3 s play smoke; default/2x captures; all ten prop families in gallery; fences
at both axes and ±.4 rad; 10 fires produce 10 distinct phase tracks; HTTP404
fallback; offline v0.76 decodes all 11 WebPs and the hook. No page errors or
unexpected image failures. 271 manifest entries validate. Existing 66 JS
checks, task-specific assertions and 6 Python tests pass. The Spati test now
checks pre/post RNG, walls, lights and canvases while allowing its sandbags
to move from baked ground into their dedicated dynamic prop drawing.

The fresh GPU gate compares the archived baseline with the current full
scene, including 40 enemies and a fixture proving all 11 assets are actually
drawn. 21 alternating pairs per district, 100 warmups + 300 timed renders,
1280×800 DPR2, paired median + seeded bootstrap 95% CI. Additional
baseline/baseline Alexanderplatz control. RTX 4070, hardware raster:

| Scene | Median | 95% CI | Verdict |
|---|---:|---|---|
| Koepenick | -0.29% | -3.05% to +2.29% | pass |
| Alexanderplatz | -0.41% | -2.13% to +0.56% | pass |
| Null control | +0.09% | -2.61% to +0.46% | pass |

Zero timed canvas allocations. Report: `perf/perf-2026-11-11T07-56-35-089Z.json`.
This supersedes the old draft's seven-pair timing; physical tablet heat and
battery acceptance remain deferred. Publication/review remains pending.
