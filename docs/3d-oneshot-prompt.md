# One-shot prompt: Ruinenstadt 3D, gate 1

Paste this into a fresh session on the empty repo `johakunath/Ruinenstadt-3D` (Fable 5.2 or Opus 5.5 at the highest effort available). It is self-contained. Plan and decisions: `docs/plan-3d.md` in `johakunath/Ruinenstadt`.

---

You are building the first playable 3D prototype of **Ruinenstadt**, a loot ARPG in a post-collapse Berlin, in this empty repository. Work autonomously until the deliverable below is done, then stop and report. Game text is German.

**Read first** (repo `johakunath/Ruinenstadt`, the existing 2D game; read only, do not change it): `docs/style-bible.md`, `docs/style/koepenick.png`, `docs/plan-3d.md`, `BACKLOG.md` › `#35 Combat flow`, and `docs/combat-feel.md` if it exists.

**Stack:** Three.js (WebGL 2), TypeScript, Vite, pinned versions. No React, no ECS, no physics engine. Deploy to GitHub Pages via GitHub Actions. CI on every PR: type check, Vitest unit tests for the simulation, build, Playwright smoke test (scene loads, play starts, no page errors, screenshot).

**Architecture:** `src/sim` (fixed 60 Hz step, no Three.js imports), `src/render` (interpolates between sim steps), `src/input` (keyboard/mouse, gamepad standard mapping, touch; actions with a 150 to 200 ms input buffer, polled every frame including hitstop), `src/data`, `assets/` with `LICENSES.md` (source, author, license per file). `CLAUDE.md` with project rules, `AGENTS.md` pointing to it.

**Scene: a Köpenick courtyard at night.**
- Damaged Altbau facades around the yard with a Späti storefront (lit windows, sign), built in code: geometry plus painted-look textures (plaster, brick, rust, chipped paint). Cracked cobblestones, rubble, ivy, a damaged BVG-yellow vehicle, lanterns, a fire barrel.
- Light: Köpenick look from the style bible, warm lantern and fire light against teal-green shadows. One directional moonlight with shadows, point lights without shadows, emissive windows, bloom, fog, embers.
- Fixed high three-quarter camera, smooth follow with slight look-ahead.

**Characters:**
- Hero: a CC0 or Mixamo humanoid with idle, run, 3-hit melee combo, dodge, hit and death clips, blended. Tint it toward the style bible hero (dark hair, red scarf, long brown coat) where the asset allows.
- Enemies: CC0 zombies that chase via a grid flow field plus separation, attack with a readable wind-up, stagger, get knocked back and die.
- Sources to check (verify license per pack before use): Quaternius, KayKit, Kenney (CC0), Poly Haven (CC0 textures), Mixamo (animations; accepted in this public repo).

**Combat:** ground-plane hitboxes (body circles, weapon arc swept during the active frames from animation timing, one hit per target per swing). Hitstop per hit weight, white hit flash, knockback, directional screen shake, impact sound on the hit frame (WebAudio, generated or CC0), sparks, weapon trail, gamepad rumble. Dodge with i-frames that cancels attack recovery; attack after dodge = dash strike. `?debug=hit` shows all shapes.

**Two render profiles**, switchable in a small options menu and by `?profile=`: **Qualität** (PC: native resolution up to DPR 2, 2048 shadow map, GTAO, bloom, color grading) and **Leistung** (tablet: DPR cap 1 to 1.25, 1024 shadows, no GTAO, max 4 point lights, distant enemies animate at a reduced rate). `?debug=perf` shows fps, frame time p95, draw calls, triangles. A stress test spawns 40 enemies.

**Look variants:** render the same view in 2 to 3 distinct styles (e.g. painterly PBR, toon ramp with outline, mixed), switchable by `?look=`, and save one screenshot each.

**Do not:** build more than this courtyard, port the old JavaScript, add inventory, loot, saves or menus beyond options, or add a physics engine.

**Done when:** the Pages link plays on PC and tablet, CI is green, the smoke test passes, and you report: screenshots per look variant, what works, what does not, perf numbers from the headless run (marked as not representative), and the open questions for Johannes.
