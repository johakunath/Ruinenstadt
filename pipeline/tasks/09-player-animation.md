# 09 Player animation v3: knees, elbows, more directions

Status: open (fourth in current queue; step 1 only)

Johannes' feedback on the v0.61 rig: movement is too stiff, legs move a little and like a stick figure, **knees and elbows do not bend**, and the player only has two views (left and right, the game mirrors). Wanted: the figure feels a bit more alive. Torso and clothing are fine, arms and forearms need to be made to fit.

## Honest assessment of the technique (Claude, read `drawHero` in `js/art.js`)

| Today | Consequence |
|---|---|
| Each leg is one rigid image rotated at the hip by `sw*.4` rad (small), no knee | Stick-figure legs. Fix: split each leg into thigh and shin and rotate them separately |
| Arm is upper and lower arm, but the elbow bend is a constant (`.08` idle, `.16` swing), the far arm never bends | Elbows look frozen. Fix: drive the bend from the walk phase and the swing phase |
| No body motion besides a small bob | Fix: torso counter-rotation, hip sway, forward lean when running, head lag, squash on landing a dash, weapon inertia |
| Only one side view, mirrored | Walking up or down the screen looks like walking sideways. Needs new painted layers (below) |

Verdict: a layered cut-out rig (the technique we use) **can** reach "lively" for a top-down/iso game. It cannot turn the body in 3D, so extra views need extra painted parts. It does not need a different technique. If step 1 below does not satisfy Johannes, the fallback is painted frame animation for the default outfit only (like the enemies, 6 to 8 poses per direction) with outfit layers as overlays, which costs far more art per outfit.

## Steps (gate after each, show Johannes a sheet or GIF)

1. **Cheap and no new paint (do first).**
   - Cut every existing leg layer at the knee line programmatically (`tools/build_hero.py`: thigh and shin, overlap of 3 to 4 px, seam hidden by the trouser/boot layers), update `js/hero.js`, add a knee pivot per outfit.
   - Walk cycle with real phases: hip swing about ±.55 rad, knee flexion on the lifted leg (0 to 1.0 rad, straight when planted), foot stays flat on the ground, ankle compensates. Arms swing opposite to the legs with elbow flexion that grows with speed. Stride length follows speed (`ST.spd`, wet ground factor).
   - Body: pelvis bob in two beats per cycle, torso counter-rotation, 4 to 6 degrees of lean forward when running or dashing, head lags the torso a little.
   - Attack and dash poses use the same joints (wind-up lean, follow-through, dash stretch), per weapon kind. Keep `HR.sh`, `HR.upper`, `HR.lower`, grip and tip pivots so hit sectors and `?debug=hit` stay valid.
   - Done when the new walk beats the old one in a side-by-side GIF for 3 outfits and 3 weapons, hit checks still pass, `?debug=perf` shows no regression.
2. **Secondary motion (code).** Scarf, coat tails, hair and strap physics as simple spring chains over the existing layers (the red scarf is the signature). Idle breathing. Needs a small amount of new layered paint for the scarf tail and coat hem if the baked ones cannot be cut.
3. **More views (new paint).** Four iso directions instead of two: front-right, front-left (walking down the screen) and back-right, back-left (walking up). Plan:
   - Mannequin and the default outfit first: front 3/4 and back 3/4 parts (torso, head, arms, legs), same sheet, same scale and joint positions as the side view so the code rig stays one rig with a view key.
   - Then outfit overlays per view. Many outfits share the torso shape, so start with the 3 most used, others fall back to the side view blended with a quick turn until painted.
   - Weapon and hand layering per view (weapon behind the body when facing away).
   - Style canvas for the turnaround first (workflow step 3), pick by the Codex rules for overnight runs.
4. **Menu and doll.** `drawDoll` (inventory) uses the same rig, check it with the new poses (idle pose with a slightly bent knee).

## Acceptance
- Knees and elbows visibly bend while walking, sprinting and swinging, in all outfits.
- Walking along the four iso directions looks right, no sliding feet at normal speed.
- Hit areas, weapon tip and grip unchanged (`tools/check_weapon_pivots.py`, `?debug=hit`).
- `?debug=perf` on Köpenick with 40 enemies: no regression above 5 %. Rig layers stay cached per outfit, no per-frame canvas creation.
