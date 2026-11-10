# Replacement B source: exact guide placement, pending weathering

The previous B input (`exec-5edf7226-7e2d-4011-a4dd-c665c1c16b73.png`) is a **rejected source**: wrong presentation perspective and mirrored emblems. Its old screenshots are not evidence of an inherent method B problem. Do not use those comparison sheets to request the building-method decision.

Replacement inspected read-only: `/workspace/generated_images/exec-127e4af1-097e-4d17-9cea-cee0a3a71c46.png`. Guide: `/workspace/Ruinenstadt/assets/raw/codex/11-alexanderplatz-pioneer/footprint-guide.svg` / `.png`. No browser or repository mutation for this update.

## Placement without mirroring, stretching or inferred anchors

| Item | Value |
| --- | --- |
| Original canvas | 1536×1024 RGBA; 3 source pixels per projected world unit |
| Fixture | `w=240, h=90, FH=H=160, R0=0, vs=1, rot=0` |
| Exact guide ground anchor | `[968.198, 910.018]`, southeast corner `(x+w,y+h)` |
| Alpha threshold | Existing normalizer sets alpha `<=128` to zero; preserve retained alpha values |
| Tight bounds after threshold | `[458,82,1159,983]`, right/bottom exclusive |
| Tight crop dimensions | 701×901 |
| Anchor after tight crop | `[510.198,828.018]` |
| Tight image draw dimensions | `701/3 × 901/3` = 233.666667×300.333333 world/screen units |
| Normalizer's 1 px padding | Output 703×903 and anchor `[511.198,829.018]`, if no resizing occurs |

Do not choose the opaque bounds' bottom-centre as an anchor, normalize the entire image to height 160, fit its rectangle to `(w+h)*IS`, or mirror the image. `H=160` describes upright wall height, not total projected picture height including roof depth and rooftop objects.

Direct full-canvas proof draw, for an already loaded threshold-clean image:

```js
const q=P3(b.x+b.w,b.y+b.h,0);
ctx.drawImage(image,q[0]-968.198/3,q[1]-910.018/3,1536/3,1024/3);
```

Equivalent tight crop draw:

```js
const q=P3(b.x+b.w,b.y+b.h,0);
ctx.drawImage(cropped,q[0]-510.198/3,q[1]-828.018/3,701/3,901/3);
```

With the current normalizer, use original-canvas `anchor:[968.198,910.018]`, `alpha_threshold:128`, `height:901/3`, `footprint:[240,90]`. The normalizer trims to the measured bounds, retains the original 701×901 content size, then adds its standard 1 px border. Draw by the emitted manifest dimensions and anchor at `units:3`. Never pass the already cropped anchor to the original-canvas normalization spec; that would subtract the crop twice.

This is the zero-rotation view. A correctly authored fixed-view B can fit this footprint exactly; other arbitrary rotations need additional authored views or a geometry reconstruction. Do not imply a single finished painting contains newly visible faces. Do not repurpose the rejected B source's fake bounds fit for this replacement.

## Remaining source check: roof improved, painted base still drifts

The replacement roof closely matches the guide's projection, but read-only visual inspection shows its painted ground edge extends below the guide. Approximate painted base landmarks are `[460,756]`, `[961,979]`, `[1157,870]`. The guide requires `[459.081,655.459]`, `[968.198,910.018]`, `[1159.117,814.558]` respectively. The front painted foundation thus appears roughly 69 pixels / 23 world units below the exact anchor. Do not silently move the anchor to hide this drift, or claim full footprint parity before checking the overlay.

During the parent's next generation, preserve **both** roof and foundation guide contours. Check the three ground corners and all vertical edge heights, rather than only the roof silhouette. This source-fit issue is independent of method B's capabilities. No attempt to fix it, normalize an asset or rerun the browser has been made in this update.

## Latest weathering direction, applies to both methods

The user requested more rust, cracks and broken parts across enemies, buildings and assets while keeping saturated blue/yellow legible. The parent owns further asset generation. Replace A's south/east facade and roof textures as well as B's finished painting before making the next method comparison; do not compare a fresh weathered B against an old clean A and attribute art-direction differences to rendering technique. Preserve clear hammer-and-sickle emblems, geometry/anchors and lighting through the weathering pass. Rust and dirt can interrupt edges and surfaces without turning the signature pair into brown-grey.
