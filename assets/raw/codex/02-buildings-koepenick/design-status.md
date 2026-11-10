# Köpenick building design preparation

2026-11-10. Generated with the built-in image-generation tool using
`docs/style/koepenick.png` as the style reference. No image model/quality
selector is exposed by this tool. No API/CLI generation was used.

`style-canvas-abc.png` is an architectural style comparison, not a source
texture atlas or a runtime asset. It does not establish footprint fit,
lighting registration, collision alignment or actual 64 px readability.
Those checks belong to the selected production kit.

- A: cream stucco Altbau with worn oxblood shopfront and ivy.
- B: teal-grey plaster, ochre stone bands and stronger vertical bays.
- C: visibly collapsed upper corner with exposed floors and roof beams.

Recommended mix: A as the common Altbau, B as a less frequent variant, C
for selected ruins. Johannes approved this mix on 2026-11-10. Production
materials are selected by `tools/pick_koep_buildings.py`; `picks.json` records
the crops, aperture pivots and overlay alpha thresholds.

Next production constraints: preserve existing footprint/rotation/roof
geometry and window light positions; generate flat facade and roof modules,
damage/ivy overlays, then Späti and slab-block extensions. Reuse modules
instead of generating a complete painting for every building footprint.
Rathaus remains in the separate landmark task.
