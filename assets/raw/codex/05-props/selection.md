# Task05 routine design selections

Built-in imagegen, three calls. Source images are preserved here. Johannes's
current direction delegates routine asset choices; no new critical design
choice was introduced. Codex chose the coherent canvas family and continued.

- `style-canvas.png`: warm/cool painted-comic Berlin survival prop language,
  chipped enamel orange, bottle green, worn cream/red medical crate, brass
  chest, dark outlines, worn wood, steel and burlap. Board references were
  Köpenick and U-Bahn; existing R06/R07 icons govern crate/chest identity.
- `bodies.png`: chosen 3×3 transparent production atlas. Rows: crate, chest,
  bin / static barrel, static campfire, lamp / bench, Litfaßsäule, sandbags.
- `fire-fence.png`: eight separate flame poses in first two 4-column rows;
  straight-on chain-link fence face in third row. Alpha is present despite
  brown RGB in zero-alpha pixels. No background keying was applied.
- `picks.json`: actual crop and normalization recipe for the ten bodies.
  `flames.png` is the eight-cell derived source strip (96×120 cells), kept
  untrimmed as an atlas to preserve frame rectangles. Runtime strip is
  `assets/props/flames.webp`, 768×120, 3 source px/unit.

The crate/chest retain the agreed medical panel and rounded brass straps.
The orange bin gets a reflective strip rather than the medical red cross.
Street furniture stays bottle green; poster tears and rust preserve the
used Berlin setting. Sandbags are mirrored for a world-x long axis. Fences
use one front face projected along the existing x/y bases, including box
rotation. No alternative critical design required an A/B/C selection.

Prompt set (production specifications, built-in tool):

1. A landscape art direction canvas for Berlin street survival props:
   painted comic noir, irregular ink outline, tactile chipped enamel,
   battered wood and brass, upper-left amber highlights and cool teal
   shadows; palette swatches plus medical crate, rounded cellar chest,
   orange wheeled bin, steel barrel, stone/log campfire, green lamp and
   poster column, bench, fence and sandbags. 2:1 isometric thumbnails on
   dark teal paper, no people, screenshot or labels.
2. A transparent 3×3 production sprite atlas from that canvas with equal
   cells and gutters. Exact row order as above. Separate static fire bodies:
   no flame, smoke, light halo or ground shadow. Same elevated 2:1 camera,
   both vertical faces visible; vivid signature colours, stressed seams,
   no labels or text, crisp clean alpha.
3. A transparent 4×3 effect/face atlas: first two rows eight equally spaced
   organic painted amber/yellow flame frames with shared ground origins,
   similar extents and a seamless pose loop, no logs/barrels/smoke/sparks;
   bottom row one long straight-on battered chain-link panel, 4:1 face,
   no perspective, ground, weeds, labels or grid. Project the panel in code.

All normalization uses Pillow/numpy and `tools.sprites.normalise` only for
this task's keys. Existing 235 normalized entries were not re-encoded.
