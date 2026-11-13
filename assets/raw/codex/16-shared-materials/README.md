# Generated sources — 2026-11-13

Created with the built-in image-generation tool. Original generated files are retained separately in the session workspace; these are repository copies of the selected production sources. No existing canvas/SVG drawing was traced.

Routine flat orthographic material kit in the approved Köpenick painted language, not full map/building paintings. Ground is a 3x3 atlas: asphalt, cobble, pavement, dirt, grass, sand, plaza, ballast, concrete. Building materials are a 3x2 atlas: plaster, brick, wood, terracotta, slate, glass. No windows/doors in wall textures; code retains gameplay-aligned windows and lights. Cut boxes are in cuts.json. Tile seams and district variants can be refined by Claude later if visible.

Normalize with `python3 tools/build_shared_materials.py`; runtime assets and manifest are generated deterministically from these sources. Normalization only crops, trims, scales, adds alpha padding and encodes WebP.
