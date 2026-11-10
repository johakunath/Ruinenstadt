# 11 Alexanderplatz Pioneer identity and buildings

Status: paused (Codex, 2026-11-10; user requested session wrap after task 12)

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

The existing method decision in task 02 remains open. Do not silently roll a
generic building method across the biome before the proof is reviewed. This
proof advances the user's GDR request rather than resuming unrelated props.

## Independent GDR assets

While the method is reviewed, continue assets that do not depend on that
choice: painted Pioneer banners and entrance crests, murals, upright
Fernsehturm/Weltzeituhr from task 08, and GDR street props. Their emblem and
colour language follows the updated board. One task per PR, with at most
30 image deliveries in a batch; keep unfinished scope explicit.

Handoff and preserved source limitations: `pipeline/proof/11-alexanderplatz-pioneer/README.md`.
