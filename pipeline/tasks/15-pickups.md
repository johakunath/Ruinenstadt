# 15 Pickups: painted icons

Status: open (Johannes, 2026-11-12). Overrides the "Item and menu icons = SVG" row in `pipeline/workflow.md` for this family only.

Problem: Döner, heal drops, scrap and other ground pickups are still small SVGs and look flat next to the painted world.

Goal: painted icons with visible material (wrapper, metal, glass, cloth), warm rim light, and a soft glow that is added in code (not baked in), so the glow can pulse per rarity.

| Pickup | Material cue | Glow |
|---|---|---|
| Döner | foil, meat, sauce | warm orange |
| Heal drop (Verband, Pulle) | cloth, glass | green-white |
| Schrott | rusty metal | faint ember |
| Materials (Stoff, Metall, Chemie, Kabel) | one clear material each | by material |
| Item drop (bag on ground) | per rarity | rarity colour |

Rules: one object, transparent background, about 64 px in game, 128 px source, check against the perf gate (`.claude/skills/asset-perf-gate/SKILL.md`) because many pickups can be on screen. Sheet list goes into `docs/chatgpt-assets.md`.
