# 11 Alexanderplatz Pioneer identity and buildings

Status: done (v0.69, Codex, 2026-11-10; completion follow-up to draft merge #27)

Johannes asked to regenerate the critical logo-bearing GDR enemies, then
continue with buildings and assets for that biome. This priority supersedes
the general overnight queue for this continuous session.

## Identity

Source: `docs/style/alexanderplatz-pioneer.png` and the new GDR/Pioneer
section of `docs/style-bible.md`. Strong yellow/blue, red banners with actual
yellow crossed hammer-and-sickle insignia, recognizable Berlin architecture,
painted comic surfaces, ivy, gardens and sunflowers. Preserve gameplay.

Enemy kickoff is delivered by task 01b/v0.67: Brigadeghul and Uhrwerkläufer.

## Building proof first

Apply task 02's method comparison to one Alexanderplatz Zuckerbäcker block:
current rendering, A painted facade/roof kit mapped onto the existing faces,
and B a full isometric painting mock of the same footprint. Make the choice
concrete with default/2x screenshots, ground footprint alignment, rotation,
fallback and timing evidence. Keep source resolution at 3 px per world unit
and cache assembled textures; never rebuild the building every frame.

Johannes reviewed the current/A/B comparison and selected A for the existing
GDR Zuckerbaecker blocks on 2026-11-10. Apply that choice to this biome;
other districts' asset production remains in their own tasks.

## Independent GDR assets

While the method is reviewed, continue assets that do not depend on that
choice: painted Pioneer banners and entrance crests, murals, upright
Fernsehturm/Weltzeituhr from task 08, and GDR street props. Their emblem and
colour language follows the updated board. One task per PR, with at most
30 image deliveries in a batch; keep unfinished scope explicit.

Handoff and preserved source limitations: `pipeline/proof/11-alexanderplatz-pioneer/README.md`.


## Completed delivery boundary

The completion PR finishes the eight selected paintings, independent decorations on
existing Zucker blocks, and the one-building current/A/B method proof. The
broader landmark/street-prop examples above stay in their own tasks; task 08
is not completed by this PR. Johannes selected A after seeing the comparison,
so the existing GDR Zuckerbaecker blocks use it in this PR. The B proof uses
an explicit fixed-view precomposition of the same
approved kit, with exact geometry; it is not an independently authored full
painting. Rejected source studies remain unselected.

Decision: Johannes chose “Apply A to the GDR blocks (Recommended)” after the final in-game comparison was available.
