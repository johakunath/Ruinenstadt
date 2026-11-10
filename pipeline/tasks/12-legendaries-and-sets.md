# 12 Legendaries and set pieces for head, hands, feet and ring

Status: open (requested by Johannes 2026-11-10, delivered in code as v0.68)

The code is done and runs with SVG fallbacks. This task only adds painted art.
Style: item icons as in `docs/chatgpt-assets.md` (brighter, more saturated,
128 px WebP, teal keyed out by `tools/cut_sheets.py`), player parts as in
`pipeline/tasks/07-player-rig-v2.md`.

## A. Menu icons (10), map in `ICOI` (`js/items.js`), file `assets/icons/<id>.webp`

| Base key | Name | Look |
|---|---|---|
| pickel | Pickelhaube des Hauptmanns (legendary head) | Prussian spiked helmet, brass spike, scuffed leather, gold trim |
| kiezbox | Fäuste des Kiezboxers (legendary hands) | red boxing gloves wrapped in tape, worn, gold laces |
| schaffner | Stiefel des Schaffners (legendary feet) | dark conductor boots with brass buckles and a small punch-card tag |
| weltuhr | Ring der Weltzeituhr (legendary ring) | ring with a tiny world clock dial, brass gear teeth |
| kiezhelm | Helm der Kiezwache (set Kiezwache, head) | blue-grey patrol helmet, set green accent |
| kiezhand | Handschuhe der Kiezwache (set, hands) | blue-grey padded gloves |
| spreestief | Stiefel des Spreegeists (set Spreegeist, feet) | wet green-teal wading boots |
| spreering | Ring des Spreegeists (set, ring) | ring with a smooth river pebble |
| topfhelm | Topfhelm der Zitadelle (set Zitadelle, head) | great helm, riveted steel |
| eisenstief | Eisenstiefel der Zitadelle (set, feet) | riveted iron boots |

Set pieces share the set green (`#8fd16a`) only as accent, not as body colour.
After delivery add the keys to `ICOI` and the batch to `docs/chatgpt-assets.md`.

## B. Painted player parts (optional, after A)

`drawHero` falls back to the default hat, gloves and boots for unknown bases
(`HR.hats`, `HR.gloves`, `HR.boots` from `tools/build_hero.py`). Add parts for:
hats `pickel`, `kiezhelm`, `topfhelm`; gloves `kiezbox`, `kiezhand`; boots
`schaffner`, `spreestief`, `eisenstief`. Same mannequin anchors as task 07,
check with `?debug=hit` and `tools/proof_hero.cjs`.

## Done when

All 10 icons render in inventory, Kodex and drop labels, the hero shows the
parts (B), `ICOI` and the hero manifest are updated, offline cache lists the
new files, and `VERSION`/`CACHE` are bumped together.
