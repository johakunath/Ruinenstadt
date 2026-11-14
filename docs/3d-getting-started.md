# Ruinenstadt Berlin: getting started

Setup for the 3D pivot (`docs/plan-3d.md`). New repo: `johakunath/Ruinenstadt-Berlin`. Steps marked **Gate 2** can wait until after the first version.

## 1. GitHub (browser, 10 min)

| # | Step | Where |
|---|---|---|
| 1 | Create the repo `Ruinenstadt-Berlin`, **public** (free GitHub Pages needs public), with a README so it isn't empty | github.com → New repository |
| 2 | Pages source: **GitHub Actions** (the build workflow from the first session deploys there) | Repo → Settings → Pages → Build and deployment → Source |
| 3 | Give Claude access: Claude GitHub App must include the new repo (if it is set to "selected repositories") | https://claude.ai/connect-github → install/configure the Claude GitHub App |
| 4 | Give Codex access and turn on automatic PR review for the new repo, same as for `Ruinenstadt` | chatgpt.com → Codex → Settings (GitHub / Code review) |

## 2. Claude cloud environment (2 min)

Use your existing environment **"default full"**: unrestricted network, so npm and free asset downloads (Kenney, Poly Haven) work without extra setup. No setup script yet; the first session can propose one (`npm ci`) once the project exists.

## 3. First version with Fable (1 session, a few hours)

| # | Step |
|---|---|
| 1 | Start a new Claude Code session on claude.ai/code |
| 2 | Repositories: select **both** `Ruinenstadt-Berlin` (work) and `Ruinenstadt` (read-only reference for style bible and data) |
| 3 | Environment: **default full** |
| 4 | Model: **Fable 5.2**, effort as high as your usage allows. Check your usage first; this session is long |
| 5 | Paste the prompt in section 6 |
| 6 | Let it work. It stops with a PR, screenshots of 2 to 3 look variants and open questions |
| 7 | You pick the look variant and merge. Then open the Pages link on PC and Tab S9 (`?debug=perf`, `?profile=Leistung`) |

If the session reports a blocked download (itch.io and Mixamo need a login): download the pack yourself on the PC and upload the files into the repo (GitHub → Add file → Upload files, max 25 MB per file), or attach them to the session.

## 4. Accounts and software for later (Gate 2: custom hero)

| What | Why | Cost |
|---|---|---|
| Adobe account for **Mixamo** (mixamo.com) | Animation clips and auto-rig for the hero | Free |
| **Blender** (current LTS, blender.org) on the PC | Hero body, clothing, rigging, GLB export | Free |
| **Git** and **Node.js LTS** on the PC | Local preview and running Blender scripts against the repo | Free |
| **Claude desktop app** with Remote Control on the PC | Claude sessions that run Blender on your PC, steerable from phone | Included |
| Codex on the PC (optional) | Second agent for asset work with Blender | Your ChatGPT plan |
| AI 3D generator, e.g. Meshy, Tripo, Rodin (optional) | Alternative hero base if MakeHuman/MPFB looks too plain | Paid tiers, test free first |

Nothing to buy before gate 1.

## 5. Devices

| Device | Use |
|---|---|
| PC, Chrome and Firefox | Qualität profile, main look check |
| Galaxy Tab S9, Chrome | Leistung profile, perf gate (`?debug=perf`) |
| Xbox controller | Feel check from gate 1 on, Hades target in #35 |

## 6. Fable kickoff prompt

Paste as is.

---

You are building the first version of **Ruinenstadt Berlin**, a 3D loot ARPG in a post-collapse Berlin, in the repo `Ruinenstadt-Berlin`. This version is the foundation for everything after, so architecture and code quality matter as much as the first look. Work autonomously until gate 1 is done, then open a PR and report. Game text is German, short.

**Read first** in the reference repo `Ruinenstadt` (the existing 2D game, read only, never change it): `docs/plan-3d.md` (decisions, architecture, budgets, gates; follow it), `docs/style-bible.md`, `docs/style/koepenick.png`, `BACKLOG.md` › `#35 Combat flow`. Copy `docs/plan-3d.md`, `docs/style-bible.md` and `docs/style/` into this repo so later sessions only need this repo.

**Stack:** Three.js (WebGL 2), TypeScript (strict), Vite, pinned versions. No React, no ECS, no physics engine. GitHub Actions: on every PR type check, Vitest, build, Playwright smoke test (scene loads, play starts, no page errors, screenshot as artifact); on main deploy to GitHub Pages.

**Architecture:** `src/sim` (fixed 60 Hz step, no Three.js imports, unit tested), `src/render` (interpolates between sim steps), `src/input` (keyboard/mouse, gamepad standard mapping, touch; actions with a 150 to 200 ms input buffer, polled every frame including hitstop), `src/data`, `assets/` with `LICENSES.md` (source, author, license per file). Write `CLAUDE.md` (project rules, short) and `AGENTS.md` pointing to it.

**Scene: a Köpenick courtyard at night.**
- Damaged Altbau facades around the yard with a Späti storefront (lit windows, sign), built in code: geometry plus painted-look textures (plaster, brick, rust, chipped paint). Cracked cobblestones, rubble, ivy, a damaged BVG-yellow vehicle, lanterns, a fire barrel.
- Light: Köpenick look from the style bible, warm lantern and fire light against teal-green shadows. One directional moonlight with shadows, point lights without shadows, emissive windows, bloom, fog, embers.
- Fixed high three-quarter camera, smooth follow with slight look-ahead.

**Characters:**
- Hero: a CC0 humanoid GLB with idle, run, 3-hit melee combo, dodge, hit and death clips, blended. Tint toward the style bible hero (dark hair, red scarf, long brown coat) where the asset allows. A custom hero follows in gate 2.
- Enemies: CC0 zombies that chase via a grid flow field plus separation, attack with a readable wind-up, stagger, get knocked back and die.
- Sources (check the license per pack): Quaternius, KayKit, Kenney (CC0), Poly Haven (CC0 textures). Mixamo is allowed in this public repo. If a download needs a login, list exactly what Johannes should download.

**Combat:** 2D collision on the ground plane with real hitboxes: body circles or capsules, weapon arc swept during the active frames from animation timing, one hit per target per swing. Hitstop per hit weight, white hit flash, knockback, directional screen shake, impact sound on the hit frame (WebAudio, generated or CC0), sparks, weapon trail, gamepad rumble. Dodge with i-frames that cancels attack recovery; attack after dodge = dash strike. `?debug=hit` shows all shapes. Use the start values from `#35`.

**Two render profiles**, in a small options menu and by `?profile=`: **Qualität** (PC: native resolution up to DPR 2, 2048 shadow map, GTAO, bloom, color grading) and **Leistung** (tablet: DPR cap 1 to 1.25, 1024 shadows, no GTAO, max 4 point lights, distant enemies animate at a reduced rate). `?debug=perf` shows fps, p95 frame time, draw calls, triangles. `?stress=40` spawns 40 enemies.

**Look variants:** render the same view in 2 to 3 clearly distinct styles (e.g. painterly PBR, toon ramp with outline, mixed), switchable by `?look=`, one screenshot each. Johannes picks one; that is a critical visual decision.

**Do not:** build beyond this courtyard, port the old JavaScript, add inventory, loot, saves or menus beyond options.

**Done when:** CI is green, the Pages link plays on PC and tablet, and you report: screenshots per look variant, what works and what does not, perf numbers from the headless run (marked as not representative), suggested setup script for the cloud environment, and open questions for Johannes.
