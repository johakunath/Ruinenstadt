# 02 Buildings, Köpenick first

Status: done (v0.71, merged PRs #29/#30). Desktop GPU gate passed on
2026-11-11; the earlier seven-pair timing is superseded. Tablet acceptance
is deferred. Review follow-up v0.72 stabilizes over-budget cache views and
makes both proof entry points enforce unsuccessful performance verdicts.
Johannes selected A common Altbau + B occasional variants + selective C
ruins. Step 0 was completed with the GDR proof in v0.69.

Update 2026-11-10 (Claude): the 7-pair timing could not resolve 5% (baseline
spread 25%, 3 of 7 pairs negative). Caches now bake at device scale instead
of a fixed 3 px (the 960×640 proof viewport drew them minified, 2.2× the
source pixels of legacy). New gate `tools/perf_koep.cjs`: own context, 21
pairs, paired median + 95% CI. Open: one GPU run on the Windows PC per
`.claude/skills/asset-perf-gate/SKILL.md`.

Update 2026-11-11 (Claude): gate run on the Windows PC (RTX 4070, hardware GPU,
1280×800 DPR 2, 21 pairs): Köpenick -6.51% [-8.22, -2.26], pass; Alexanderplatz
null control -0.74%. Perf blocker closed. Tab S9 heat/battery check still
deferred.
See `pipeline/proof/02-buildings-koepenick/README.md`.

Current queue (2026-11-10): draft passed the performance gate (2026-11-11);
continue with the independent equipment-icon task. Design selection is complete.
The selected GDR method did not by itself complete Köpenick production.

Köpenick is the default look (board `docs/style/koepenick.png`). Building boxes are drawn by `drawBox` (`js/iso.js`) from footprint `x,y,w,h` and height; size factors `BSC`/`BHS` in `js/world.js`; landmarks per district in `K.lm` (`js/geo.js` for Köpenick and Xhain).

## Step 0: decide the method with a proof (do this first, one building)

Johannes' question: "Do we need four sides plus roof per building type?" No. The camera is fixed 2:1 isometric, so only **three faces are ever visible: south facade, east facade, roof** (see `drawBox`: south and east faces are textured from the sprite, the roof goes on the top face). Two methods:

| | A: texture kit (recommended default) | B: full iso render per building |
|---|---|---|
| What Codex paints | Flat, straight-on textures: facade strips (ground floor with shopfront, upper floor, corner pier, gable), roof tops, damage overlays (broken windows, ivy, collapsed corner), all tileable or with defined stretch zones. The engine already maps them onto the faces | One finished iso picture per building |
| Variety | High (combine kit pieces, many footprints) | One look per painting, repeats show quickly |
| Fit to footprint | Automatic, any `w x h` | Must be made for one footprint, else gaps at the collision box |
| Cost | Medium, reused everywhere | High per building |
| Look | Slight "box with wallpaper" feel, fixed by painted shading, edge breaks, rooftop props, overlays | Most painterly |

Proof: Codex makes **one** Köpenick Altbau with method A (south and east facade textures, roof, 2 damage overlays), hooks it into `drawBox` with the current drawing as fallback, screenshots it in game next to the old and a method B mock of the same building, and measures `?debug=perf`. Johannes decides in the morning. Until then continue with 03, 04, 05 (they do not depend on this).

Rule for both methods: the painted texture must carry the light from the top left, no baked shadow on the ground, windows keep lit-window positions so the lights in `lpos` still sit on windows.

## Assets (after the decision)

| Asset | Notes |
|---|---|
| Altbau corner and middle (2 to 3 variants) | 5 floors, broken windows, ivy, shop fronts at street level |
| Plattenbau block | grey panels, balconies |
| Späti | barricaded, sandbags, half-open roll shutter, BVG yellow accents |
| Ruin | half-collapsed Altbau |
| Rathaus Köpenick | landmark, see task 08 |

The sprite replaces the box faces, the footprint stays the collision box. Check that walls line up with the footprint (walking along a wall in game must not show a gap or overlap).


## Step 0 delivery in the GDR-priority session (2026-11-10)

Johannes prioritized task 11's Alexanderplatz Zuckerbaecker for this proof.
The completion follow-up to PR #27 supplies current/A/B default+2x and 0/+0.6/-0.6 rotation evidence,
actual wall contact, fresh image fallback, offline and full-render timing.
See `pipeline/proof/11-alexanderplatz-pioneer/README.md`. B is an exact fixed
precomposition of the same approved paintings, not a successful independent
full-building generation. The raw full-building studies were rejected for
footprint fit and do not bias the technical method comparison.

Johannes selected A after reviewing the in-game comparison: ‘Apply A to the
GDR blocks’. Its faces follow arbitrary supported footprints/rotations with
three shared patterns. The completion PR applies A to existing GDR Zuckerbaecker blocks;
Köpenick and other districts retain their art until their own task delivery.
