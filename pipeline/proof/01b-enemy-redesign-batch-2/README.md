# Enemy redesign completion · v0.67

This batch delivers 24 frames for Schildträger, Brigadeghul, Schrottkoloss
and Uhrwerkläufer. Together with the thirty frames merged in PR #23, all eight
weak families have new silhouettes. Johannes additionally requested the GDR
identity update: Brigadeghul and Uhrwerkläufer now wear Pioneer blue/yellow
with explicit red hammer-and-sickle badges. Uhrwerkläufer keeps its existing
clockwork body and poses. Brocken, Wurzler and other distinct families retain
their art. The active GDR board is `docs/style/alexanderplatz-pioneer.png`.

Choices: U-Bahn canvas shield 03 (vaulted carapace), Alexanderplatz brigade
01 (low square collar), U-Bahn Schrottkoloss 01 (chimney triangle). The four
style canvases and source selections remain in the shared task raw folder.
`picks.json` records reasons, consistent per-family scale and source anchors. The GDR livery supersedes the earlier cream/red Brigade study.

Internal review caught low hands/claws contaminating the generic bottom
strip. Schildträger and Schrottkoloss now use explicit authored sole centres
for every pose; the coordinates are in `SOLES` in the picker and the recipe.
No source painting or collision radius was changed to correct those anchors.
Brigadeghul retains its compact foot-based anchor. The separate shield panel
still follows the real blocking direction and open-guard state.

The first batch's thirty image bytes and manifest entries remain identical.
Two visual height metadata values follow the new bodies; combat rules,
animation algorithms, shield arc and projectile physics stay unchanged.
All runtime keys and offline shell paths are reused. VERSION/CACHE is 0.67.

`comparison.png` presents large, world-size and silhouette columns against
the merged v0.66 baseline (`ec80d2d`, merged as `5edf3a5b`). Its JSON measures
candidate contact bands and explicitly does not infer an automated hitbox
verdict. Six-pose/both-facing galleries and real contact/shield screenshots
provide the animated visual check. All sixteen idles are classified without
duplicate height/outline pairs. The earlier batch's proof remains unchanged.

Reproduce:

```sh
python3 tools/pick_enemy_redesign.py
python3 tools/pick_enemies.py
python3 tools/sprites.py
python3 tools/sprites.py --check
python3 -m unittest discover -s tools -p 'test_*.py'
node tools/test_enemies.mjs
node tools/test_sprites.mjs
node tools/test_hero.mjs
python3 tools/silhouette_sheet.py
python3 tools/compare_enemy_redesign.py --types shield,brigadeghoul,uhr,schrottkoloss --baseline /tmp/ruinenstadt-baseline66 --output pipeline/proof/01b-enemy-redesign-batch-2/comparison.png
# Serve this checkout on 8767 and an unchanged v0.66 export on 8768:
ENEMY_PROOF_OUT=pipeline/proof/01b-enemy-redesign-batch-2 ENEMY_BASELINE_PORT=8768 ENEMY_PERF_DISTRICTS=0,2,3 node tools/proof_enemies.cjs
```

`results.json` records default/2x district/tunnel screenshots, actual mouth/
shield/crow/elite/boss behavior, deliberate required-image HTTP404 fallback,
and a fresh fully offline reload/run decoding all 97 enemy images.
`performance.json` records isolated seeded full-render A/B against v0.66.
Headless desktop timing does not establish Tab S9 thermal/battery behavior.
The 24 frames decode to 1,932,616 bytes; all 54 redesigned/repainted frames total
2,960,152 bytes, below the 40 MB task budget.

Final v0.67 GDR run: Köpenick 52.9 / 52.7 ms, Alexanderplatz 46.4 / 43.6 ms, Mitte 53.5 / 50.9 ms (before / after).
