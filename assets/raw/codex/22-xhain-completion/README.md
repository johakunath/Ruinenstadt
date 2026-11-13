# Xhain environment production sources

`style-canvas.png` is the newly generated district material canvas, referenced
from the Potsdamer Platz and U-Bahn boards. `material-atlas.png` is a new image
generation using that canvas. Both generated originals remain in
`/workspace/generated_images/` in the working environment.

The approved existing identities remain: Oberbaumbrücke brick/copper,
Berghain concrete, Ostbahnhof glass/stone, green iron U1 and brick Stadtbahn,
bright original gallery murals, ivory/green station ceramics and teal water.
No new buildings, gameplay or district direction is introduced.

`prompts.json` retains the exact prompts and reference paths. Run
`python3 tools/build_xhain_completion.py` from the repository root to cut the
12 normalized WebPs. `cuts.json` records exact crops, dimensions and runtime
keys. Each texture has a 1px alpha border removed during decode; face-local
positions supersede upright sprite anchors. `game-size.png` shows each at 64px.

Sources are flat materials projected onto the actual rotated architecture.
Original openings, towers, roofs and light positions still come from the
existing drawing functions. Nature and vehicle/rolling-stock redesign are
separate work.
