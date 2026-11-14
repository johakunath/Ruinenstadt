# Generated sources — 2026-11-13

Created with the built-in image-generation tool. Original generated files are retained separately in the session workspace; these are repository copies of the selected production sources. No existing canvas/SVG drawing was traced.

Routine design selected for its distinct material silhouettes at 32px: foil Döner, cloth/glass healing, separate material/ingredient shapes and five equipment bag identities. Warm top-left light, ink contours, textured painted fills and cool shadows follow the Köpenick board. Glow is added by code, never baked into sprites. Grid order is in tools/build_shared_materials.py.

Normalize with `python3 tools/build_shared_materials.py`; runtime assets and manifest are generated deterministically from these sources. Normalization only crops, trims, scales, adds alpha padding and encodes WebP.

## v0.89 clarification

Johannes requested no foil around the Döner and no paper around the meat.
Built-in referenced-image editing produced `unwrapped-source.png` as a two-cell
transparent sheet (Döner left, bare steak right). The builder cuts only those
two replacements; the other fourteen production icons keep their selected
original cells. Runtime display size and placement are unchanged.
