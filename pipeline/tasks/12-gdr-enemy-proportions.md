# 12 GDR enemy proportions and post-apocalyptic wear

Status: in progress (Codex, 2026-11-10)

Johannes says Uhrwerkläufer and Brigadeghul read too small. Use the larger
clockwork design from the active style board for Uhrwerkläufer, make it a
large lumbering enemy, and give Brigadeghul believable armoured-worker size.
Johannes explicitly authorizes matching functionality and hitbox changes.

Preserve the approved blue/yellow and hammer-and-sickle identity. Increase
post-apocalyptic wear throughout the active GDR art: chipped enamel, rust,
dents, cracks, torn cloth and broken parts, with readable signature colours.
This direction also applies to the pending building and asset work in task 11.

Keep other districts' ghouls unchanged. Update authored sprite scale and
reference radii together with actual constructor/collision radii, contact,
steering/wall clearance, shield geometry, overlays and canvas fallbacks.
Retain shield rules and existing damage/HP unless a demonstrated behavior
requires otherwise. Test actual collision/contact and elite scaling, not only
manifest dimensions. Browser default/2x, offline, fallback and performance
checks still apply. Add before/after proof with the player for scale.

Task 11 source/proof work is preserved on `codex/11-alexanderplatz-pioneer`
(local WIP `ff85e62`); resume its weathered building proof after this correction.
