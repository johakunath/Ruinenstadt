# Köpenick surfaces and special architecture

Generated with the built-in image tool on 2026-11-13. Originals remain in `/workspace/generated_images/`; these are repository copies. The user requests more realistic special buildings with restrained post-apocalyptic wear, district themes and emblems. The new style canvas interprets the existing Köpenick board as red-brick Gothic river-town architecture, oxidized copper, ivy and blue municipal fish-and-key heraldry. No other district identity is changed.

Production generations: architecture-atlas.png (3×2: Gothic civic facade, tiled roof, clock tower on chroma background, station ceramics, bridge stone, river water) and surfaces-atlas.png (3×2: plaza cobble, paving, cracked asphalt, park path, station platform edge, bridge deck). These are newly generated sources, not traced code drawings. The style-canvas.png is a reference, never a runtime map texture.

`python3 tools/build_koep_completion.py` crops the equal cells, normalizes materials to 256px, selects the connected tower from its chroma background, adds one-pixel alpha borders, encodes WebP and writes manifest/cuts/game-size preview. No image painting occurs in the builder. The first cut accidentally retained isolated atlas-edge pixels, making the tower square and thin in game; the retained original measurement predates its corrected connected-component crop. The final visual report uses the corrected tower. Runtime projected bounds and draw count did not change.

Town hall modules map onto the original footprint; the tower is an independent front plane instead of being flattened across a roof. Existing lit windows retain their emitters; the clock emitter is aligned to its painted clock. Original canvas drawings remain available. Bridge parapets are visual objects added after all gameplay placement, with no added collision or RNG. Old ground-level rails remain the unavailable-art fallback. Trees and animated nature are a separate package.

The existing four-variant terrain composites stay authoritative for roads and lots. New road wear is a faint 18% overlay built once; dedicated new paving is confined to the station forecourt and Rathausplatz.
