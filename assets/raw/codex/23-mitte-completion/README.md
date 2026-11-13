# Potsdamer Platz / Mitte environment

Eighteen original painted-comic sources, based on `docs/style/potsdamer-platz.png` and the style bible. The style canvas sets rainy twilight, recognizable Berlin architecture and localized cyan/magenta against warm civic stone.

- material-atlas.png: 4 × 4 authored square cells, cut to 256px plus transparent 1px border.
- landmark-sheet.png: Siegessäule and Quadriga; separate alpha bounds preserve whole sculpture silhouettes. The manual divider is x=700 because the Quadriga extends left of the sheet midpoint.
- cuts.json contains all exact crop coordinates, alpha bounds and dimensions.
- prompts.json preserves the exact generation prompts.
- game-size.png shows all selected assets at 64px.

Reproduce with `python3 tools/build_mitte_completion.py`. The existing map/geometry is authoritative; no sculpture changes collision or blocks gate/station passages.
