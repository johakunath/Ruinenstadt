# Vehicle rendering decision

Status: P3 direction implemented and rotation-fit proof passed (v0.77 local); combined hardware-GPU gate passed; publication/review pending.
Source: `js/iso.js` (`drawVehBox`, `frust`, `wheel`), `js/world.js` (`vrot`),
`js/geo.js` (`rotN`); checked 2026-11-11.

Use painted face textures on the current P3 geometry. Keep wheel positions, footprints, collision, depth ordering and complete
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
Once this proof passes, produce the style canvas and requested vehicle
variants. Require complete missing-image fallback, offline shell entries,
under 40 MB decoded task memory, no per-frame cache creation and the paired
hardware-GPU performance gate.

## Accepted implementation and user revision

The user requested rounded, recognisable small vehicles after viewing the first
angular draft. Small-vehicle side walls now follow a 24-point rounded rectangle;
cabins have a rounded inset top. Back-face selection uses outward world normals
under the actual road rotation. Flat UVs sample the appropriate long/short
material along each curved segment; the roof is clipped to the same outline.
Trabi height is 34 units, with a cream roof/body and preserved circular lamp
proportions; Barkas uses one full-height windowed shell, not a panel van plus
an extra window box. The burned sedan lowers the charred cabin. BVG transit
keeps rectangular face geometry and its procedural wheels/pantograph.

Caches bake at min(3,DPR×Z), quarter steps, outside draw. Source images and all
derived vehicle caches share 40 MB. Visible entries are pinned per frame;
stationary overflow stays on complete fallback until the view changes. Camera,
resize, geometry and map transitions invalidate/release as appropriate. Warm
vehicles use one upright draw; the cached projection already contains the true
P3 geometry, so no second ground-plane affine transform is applied.

Proof covers all five kinds, both axes, eleven angles, default/2x sheets,
seven seeded district wall comparisons, tangent walks, missing faces, offline
play and lifecycle/overflow tests. See `pipeline/proof/03-vehicles/README.md`.
