# 15 Pickups: painted icons

Status: integrated (v0.88, Codex, 2026-11-13); final performance acceptance and review with Claude deferred. Overrides the SVG default for this family.

2026-11-13 continuation: district boards are merged; this session implements pickups and explicitly requested rarity-specific loot bags. The newer request chooses bags for equipment drops; existing menu equipment icons remain usable. Earlier handover:
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

## Delivered v0.88

Sixteen generated 128px sprites: Döner, bandage, bottle, scrap, four crafting
materials, three food ingredients, common/magic/rare/legendary/set loot bags.
`js/pickup-art.js` draws the actual food/material/ingredient/heal/item drop
families with dynamic code glow and the old missing-image fallback. Display
sizes are 30px for materials/heals/ingredients, 34px for bags, 36px for Döner.
Schrott is awarded directly by existing gameplay, so its sprite is supplied
without inventing a new physical scrap-drop mechanic.

Source, selection and game-size sheet: `assets/raw/codex/15-pickups/`.
Deterministic atlas cutter: `tools/build_shared_materials.py`.
One combined proof and measurement: `pipeline/proof/15-pickups-shared/`.
