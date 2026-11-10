# Paused building studies · 2026-11-10

Johannes asked to finish task 12 and wrap this session. These are preserved
working drafts on `codex/11-alexanderplatz-pioneer`, not a released feature.
No further work is authorized by the wrap request; resume when requested.

## What is saved

- Original facade/roof-kit studies, three normalized decoration WebPs and
  unreferenced `js/gdr-assets.js` / `tools/pick_gdr_assets.py`. These older
  decoration picks use the clean atlas; replace/rebuild them from the
  weathered source before integration. No index/renderer hook has shipped.
- New `*-weathered-study.png` facade, roof/overlay kit and full-building
  painting in `assets/raw/codex/11-alexanderplatz-pioneer/`. These retain
  rust/cracks/chips and the approved strong blue/yellow and hammer/sickle.
  They are unnormalized source studies, not current manifest selections.
- Exact fixture footprint SVG/PNG: width 240, depth 90, upright height 160,
  3 source px per projected world unit. Ground guide vertices:
  left [459.081,655.459], front [968.198,910.018], right [1159.117,814.558].
- `draft-harness/` preserves the scratch prototype, finite capture scripts
  and historical inspection notes. It still contains absolute scratch and
  generated-image paths. Update inputs/paths to the saved repository sources
  before reuse; the harness is neither a production renderer nor a current
  proof. Old captures are intentionally excluded because they use rejected
  B perspective and cleaner A/B art.

## Resume from here

This branch is synchronized with merged task 12 PR #26 (v0.68).
Before future work, synchronize again and read task 12's final geometry,
style board and contract. Keep the completed enemy update unchanged.

The building method remains undecided. A maps painted flat facade/roof kits
onto engine P3/bAx faces and supports arbitrary building rotation. B is a
fixed-view full painting; additional views or layered construction would be
needed for newly exposed faces at other rotations.

B source fit remains unresolved after three attempts. The latest painting
has improved 2:1 roof geometry but its foundation still drifts below the
required footprint. Do not shift/stretch anchors to hide this, present the
rejected mismatch as an inherent limitation of method B, or ship that source.
Stop and discuss the source/contract approach before more retries.

When resumed, prepare one valid current/A/B Zuckerbaecker comparison using
weathered art consistently. Show actual footprint/default+2x/rotation,
fallback, memory and performance evidence before Johannes chooses a generic
building method. Do not expand or integrate that method across the biome
before the decision. Independent decorations need normalizer/reproducibility,
runtime hooks, offline/version updates and validation before their own PR.
