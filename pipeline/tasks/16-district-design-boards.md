# 16 District design directions

Status: in progress (Codex, 2026-11-13).

Johannes explicitly moved concept boards ahead of production on 2026-11-13.
Generate three substantially different painted boards each for Tempelhof,
Charlottenburg and Wedding. Use `docs/story.md` for eras and backstories and
`docs/style-bible.md` plus the finished boards for the shared visual language.
Each direction needs a scene, architecture, enemies, survivor clothing,
equipment and palette. Directions are proposals for selection and mixing,
not approved production identities. Save raw generations and exact prompts.

No district implementation, save migration, runtime sprites or performance
optimization in this package. At most one validation run; record runtime
memory/timing as not applicable when the boards are not loaded by the game.

Next session: painted global pickups and SVG-only equipment icons (reuse
existing painted item art for equipment drops; preserve rarity glow), then
complete Köpenick/global building coverage and use it as the fallback for
districts without their own painted kit. Audit actual missing coverage first.
Basic integration only; Claude owns optimization and detailed testing.
