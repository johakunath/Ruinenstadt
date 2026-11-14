# Ruinenstadt 3D: plan

Decided 2026-11-14 (Johannes, with Claude; Codex/ChatGPT proposal reviewed). Time box: 3 weeks, then decide on a migration.

## Why

The ceiling of the Canvas 2D renderer is the main limit on the look: lights, shadows and depth are faked by hand, and painted 2D characters with procedural joints don't fit well with the simple code-drawn buildings. A real 3D renderer does lighting, shadows, bloom and skeletal animation on the GPU. Rebuilding in 3D is accepted; recycling the 2D code is not a goal.

## Decisions

| # | Decision | Reason |
|---|---|---|
| 3D1 | New repo `johakunath/Ruinenstadt-3D`. The 2D game stays playable and untouched | Old repo keeps its no-build rule; no risk to the current game |
| 3D2 | Three.js (WebGL 2 renderer), browser first, shareable link | Friends play without installing; JS know-how; cloud workflow |
| 3D3 | TypeScript + Vite, CI on every PR, deploy to GitHub Pages via Actions | See *Build setup* below |
| 3D4 | Two render profiles from the start: **Qualität** (PC, full effects) and **Leistung** (tablet/phone) | PC is the fidelity target, tablet must stay playable |
| 3D5 | Gate 1 tests look, feel and performance together, measured on the PC and the Tab S9 | A pretty scene that stutters on the tablet or feels bad is no answer |
| 3D6 | Gameplay on the ground plane with real hitboxes (see *Collision*). Full 3D physics only where a feature needs it | Precision comes from shapes and hit frames, not from a third axis |
| 3D7 | Assets: CC0 packs and Mixamo for gate 1; the hero becomes a proper custom character from gate 2 on (realistic proportions, swappable clothes and weapons, style bible). Mixamo files in the public repo are accepted (non-commercial, Johannes takes the risk) | Fast first test, quality where it matters most |
| 3D8 | Asset production: Claude in the cloud for code-built geometry, shaders and integration; Codex or Claude on the PC with Blender (GPU, desktop) for characters, rigging, clothing and bakes | Mobile-only development is nice to have, not required; PC via Remote Control is fine |
| 3D9 | Style bible stays the source of truth. The 3D look is chosen from 2 to 3 rendered variants in gate 1 | Critical visual decision (CLAUDE.md rule) |
| 3D10 | No Godot benchmark planned. Trigger for one: gate 1 or 2 fails on tablet performance with animated characters, or the animation tooling blocks progress | Avoid a second project |
| 3D11 | `#35 Combat flow` in the 2D game first, one focused session. Its tuned numbers (`docs/combat-feel.md`) feed the 3D combat | Numbers transfer, 2D code does not |

## Build setup: why TypeScript + Vite

| | No build (plain ES modules) | TypeScript + Vite (chosen) |
|---|---|---|
| Setup | None, open `index.html` | `npm install`, dev server, build step |
| Deploy | Push, Pages serves the files | GitHub Action builds and deploys (one-time setup) |
| Code quality | Errors show up only when that code runs | Type checker catches wrong names, wrong arguments and missing fields before the game runs. Matters with two agents (Claude, Codex) editing the same code |
| Three.js | Vendored file or CDN import map | Pinned npm version, imports work as documented, tree shaking |
| Assets | Served as-is | Hashed file names (no stale cache), easy to add GLB compression (meshopt, KTX2 textures) for smaller downloads |
| Phone editing | Easiest | Still fine in cloud sessions; local preview needs the dev server |
| Fit for your goals | Good for a small prototype | Better for a 3-week build with many assets, two agents and a quality target |

**CI** (GitHub Actions on every PR): type check, unit tests for the simulation (Vitest), production build, Playwright smoke test (scene loads, a run starts, no page errors, standard screenshot attached). Real performance is measured only on real devices; cloud browsers have no GPU worth measuring. The old 2D repo can get the same smoke test as a small CI later; that is optional.

## Collision and hitboxes

Hades and Diablo play on a plane too. A hit feels unfair when the shapes or the timing are wrong, not because the world lacks a third axis.

| Layer | Approach |
|---|---|
| Bodies | Circles or capsules on the ground plane, per enemy size |
| Weapon hits | Shape swept during the attack's active frames (arc, capsule or box per weapon), timed by events in the animation clip, each target hit once per swing |
| Projectiles | Ground-plane shapes plus a height value, so they can pass over low cover |
| World | Static footprints of buildings and props, generated from the same data as the meshes |
| Debug | `?debug=hit` draws all shapes in 3D (same as the 2D game) |
| Physics engine | Rapier only for later polish: ragdolls, debris, physics props. Not in gate 1 |

Navigation: grid flow field toward the player (cheap for 40 enemies) plus local separation steering.

## Architecture (smallest sensible)

| Folder | Content |
|---|---|
| `src/sim` | Game state and rules at a fixed 60 Hz step, no Three.js imports, unit tested |
| `src/render` | Three.js scene, render profiles, effects, interpolation between sim steps |
| `src/input` | Keyboard, mouse, gamepad, touch → actions with an input buffer; polled every frame, also during hitstop |
| `src/data` | Items, loot, balance, enemy stats ported from the 2D game as typed data |
| `assets/` | GLB, textures, `LICENSES.md` with source, author, license per file |
| `AGENTS.md` | Points to `CLAUDE.md`, one instruction source for both agents |

No React, no ECS framework, no engine abstraction.

## Render budget (start values, tuned in gate 1)

| | Qualität (PC) | Leistung (Tab S9, phone) |
|---|---|---|
| Resolution | Native up to DPR 2 | DPR cap 1 to 1.25, optional dynamic resolution |
| Shadows | Moonlight (one directional) 2048 map, selected objects | 1024 map, hero and big props only |
| Point lights | Up to 8 without shadows, 1 to 2 with | Up to 4 without shadows |
| Post | Tone mapping, bloom, GTAO, color grading, optional outline | Tone mapping, light bloom, color grading |
| Characters | Full animation rate | Distant enemies animate at reduced rate |
| Target | 60 fps, p95 ≤ 17 ms with 40 enemies | 60 fps with 20 enemies, never under 45 |

Lightmaps only if gate 1 shows the budget is not enough; they need a Blender bake on the PC.

## Style: closing the gap

Raw CC0 packs look clean and generic. They will **not** match the style bible as they are. Plan from the start:
- Buildings, Späti, cobblestones and street props built in code (geometry plus painted-look textures), as in the 2D game's D4 decision.
- Gritty, painted textures (rust, plaster, brick, BVG yellow) instead of flat colors.
- Color grading per district (Köpenick: warm lanterns against teal-green shadows), fog, embers.
- Gate 1 shows 2 to 3 look variants as in-engine screenshots (e.g. painterly PBR, toon ramp with outline, mixed) for Johannes to choose.

## Hero pipeline (gate 2)

Goal: realistic proportions, red scarf, long brown leather coat, harness, pouches, heavy boots; swappable clothing and weapons; decent animation.

| Step | Tool | Note |
|---|---|---|
| Base body and rig | MakeHuman/MPFB in Blender (CC0 output) or an AI 3D generator (Meshy, Tripo, Rodin; paid, mixed topology) | Choose from 2 test heroes in gate 2 |
| Clothing | Modular meshes skinned to the same skeleton (coat, scarf, harness, boots, district pieces) | Swap = show or hide meshes |
| Weapons | Separate GLB attached to a hand bone | Same as the item system |
| Animation | Mixamo clips retargeted to the hero rig, blended in Three.js | Idle, run, attack combo, dodge, hit, death |
| Production | Codex or Claude on the PC with Blender, scripted where possible | Not verified yet: whether Blender runs headless in the cloud environment |

## Gates

| Gate | Week | Deliverable | Pass criteria |
|---|---|---|---|
| 1 Look, feel, perf | 1 | Köpenick courtyard: code-built Altbau and Späti, cobblestones, lanterns, fire barrel, fog, bloom, embers. CC0/Mixamo hero: run, 3-hit combo, dodge, with controller, keyboard/mouse, touch. 20 to 40 CC0 zombies chase and die with hitstop, flash, sound. Qualität and Leistung profiles. Shareable Pages link | Johannes: clearly better looking than 2D, feel at least on the level of the 2D game, budgets above met on PC and Tab S9. Look variant chosen |
| 2 Hero and combat | 2 | Custom hero with 2 outfits and 2 weapons, combat numbers from `docs/combat-feel.md`, hitboxes, one custom Köpenick ghoul | Hero fits the style bible; Hades-like feel on controller |
| 3 Vertical slice | 3 | Small Köpenick expedition: several encounters, 3 enemy types, 1 boss, loot drops with ported item data, return to camp stub | Fun for 10 minutes; friends test it |
| Decision | end of 3 | Migrate content to 3D or stay 2D | Slice clearly better than the 2D game |

## Not now

Godot, Rapier, lightmaps, multiple districts, inventory UI port, save migration, story, camp in 3D.

## Model

| Work | Model |
|---|---|
| Gate 1 kickoff (setup, scene, look variants) | Fable 5.2 if usage allows, else Opus 5.5 high. Unverified whether Fable is better here; the first session makes many broad decisions at once |
| Iterations, assets integration, tuning | Opus 5.5 high |

## One-shot experiment

`docs/3d-oneshot-prompt.md` is a self-contained prompt for gate 1. Run it once in the empty new repo to see what a well-specified one-shot delivers, then continue from its result or restart with what was learned.
