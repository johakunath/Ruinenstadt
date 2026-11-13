# 15 Pickups: painted icons

Status: open (Johannes, 2026-11-12). Overrides the "Item and menu icons = SVG" row in `pipeline/workflow.md` for this family only.

2026-11-13: deferred to **next session**, after district direction boards.
Include every crafting material and ingredient pickup; equipment drops reuse
each existing painted equipment icon at a small readable size with code rarity
glow instead of floating rarity-coloured squares. Paint only missing/SVG-only
icon gaps. Compare actual game-scale sizes; a modest increase is allowed,
64 px is not a mandatory displayed size. Maximum one measurement run, report
40 MB / 5% budgets and milliseconds; Claude optimizes and tests in depth.

Problem: Döner, heal drops, scrap and other ground pickups are still small SVGs and look flat next to the painted world.

Goal: painted icons with visible material (wrapper, metal, glass, cloth), warm rim light, and a soft glow that is added in code (not baked in), so the glow can pulse per rarity.

| Pickup | Material cue | Glow |
|---|---|---|
| Döner | foil, meat, sauce | warm orange |
| Heal drop (Verband, Pulle) | cloth, glass | green-white |
| Schrott | rusty metal | faint ember |
| Materials (Stoff, Metall, Chemie, Kabel) | one clear material each | by material |
| Item drop (bag on ground) | per rarity | rarity colour |

Rules: one object, transparent background, source size chosen for the displayed
size and zoom. Preserve code glow. Measure many simultaneous pickups once;
defer optimization to Claude. Sheet list goes into `docs/chatgpt-assets.md`.
