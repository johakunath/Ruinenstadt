# Vehicle rendering decision

Status: technical direction selected; production waits for rotation-fit proof.
Source: `js/iso.js` (`drawVehBox`, `frust`, `wheel`), `js/world.js` (`vrot`),
`js/geo.js` (`rotN`); checked 2026-11-11.

Use painted face textures on the current P3 geometry. Keep the body/cabin
proportions, wheel positions, footprints, collision, depth ordering and complete
procedural fallback. Roof, long side and short end need separate material
coordinates for both `V.v` axis assignments; cabin frustums need their own
sloping-face mapping. This is an integration task, not a quick sprite swap.

| Approach | Rotation fit | Cost / decision |
|---|---|---|
| One upright finished painting | Its roof/side silhouette cannot follow continuous road rotation | Reject for runtime vehicles |
| Many authored direction frames | Needs coverage, interpolation/selection and matched footprints at every angle | Possible, unnecessary for this renderer |
| Painted materials on P3 faces | Follows existing continuous rotation and actual collision geometry | Selected; prove mapping before production paint |

## Required technical proof

`rotN` normalizes road angles to (-45°, +45°]. Vehicle placement adds
`R(-.06,.06)` radians, so real rotations can reach approximately ±48.44°.
Do not validate only 0/±45°. At the edge-on boundary and just beyond it,
check face orientation/winding and readable UVs explicitly.

Use a temporary labelled checker material in dev proof, not production art.
Test car, Trabi, van, bus and tram; both long-axis assignments; 0°, ±22.5°,
±44.9°, ±45°, ±45.1° and ±48.44°. Verify corners against projected P3
coordinates, UV direction, cabin slope seams, wheel occlusion and anchors.
Walk around real seeded vehicles with the debug collision overlay at default
and 2x zoom. Fit the visible body to the existing footprint; do not change
gameplay dimensions to make a painting fit.

If body and cabin materials cannot be mapped without a silhouette/face-order
regression, stop before painting and revisit the technical decision.
Once this proof passes, produce the style canvas and ten requested colour
variants. Require complete missing-image fallback, offline shell entries,
under 40 MB decoded task memory, no per-frame cache creation and the paired
hardware-GPU performance gate.
