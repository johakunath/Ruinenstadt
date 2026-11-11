# Inventory layout proof (v0.74)

Reproduce: serve repository on 8765, set `NODE_PATH` as in
`tools/browser-setup.md`, then `INV_PROOF_PHASE=after node
tools/proof_inventory_layout.cjs` (PowerShell: set `$env:INV_PROOF_PHASE`).

Before/after screenshots and measured CSS-pixel bounds are committed.
Before fixtures cover 1920×1080 desktop, 1280×800 / 1024×768 tablets and
390×844 phone. Final after fixtures also cover 1180×820 tablet landscape and
844×390 phone landscape, with touch enabled for tablet/phone contexts.
These are browser viewport checks, not physical tablet acceptance.

| At 1280×800 | Before | After |
|---|---:|---:|
| Character panel width | 250 px | 466 px |
| Doll canvas width | 110 px | 298 px |
| Equipment icon outer box | 64 px | 76 px |
| Backpack cell | 57 px | 80 px |
| Comparison column width | 600 px | 405 px |

At 1024×768 backpack cells previously collapsed to 16 px; they now stay
85 px square in three columns, with additional rows scrolling downward.
The comparison uses a compact vertical selected/equipped stack so the numeric
rows and action buttons retain readable widths. No horizontal page overflow.
The same browser fixture selects the last backpack cell and last of 40 stash
items after scrolling; both produce the comparison card successfully.
Phone portrait/landscape retain their existing layout, with corrected canvas
aspect ratio to avoid distorting the larger portrait doll.
