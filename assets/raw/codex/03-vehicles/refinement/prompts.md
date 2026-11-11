# Vehicle refinement · 2026-11-11

Built-in imagegen, three independent transparent atlas generations. No CLI or API fallback. The user rejected the angular/two-tone Trabi and box van, requested a cream Trabi with round lamps, a period windowed van, and a partly burned wreck. Selected the three new paintings; the original raw studies remain preserved. The blue Barkas also supplies a deterministic cream enamel variant. Runtime uses P3 materials and rounded shells inside the unchanged collision footprint, never a fixed-view vehicle billboard.

## Reference research

- [August Horch Museum: Trabi exhibition](https://www.horch-museum.de/trabant-museum.php)
- [Trabant Museum Prague](https://www.trabantmuzeum.cz/en)
- [Barkas B1000 windowed bus reference](https://www.ostfahrzeuge-lehmann.de/fahrzeuge-%C3%BCbersicht/verkauft-barkas-b1000-kb-fensterbus/)
- [Barkas original operating manual, 1981](https://barkas.online/wp-content/uploads/2020/11/Betriebsanleitung-1981.pdf)

Cream is the user's selected paint, not a claim that every historical Trabi was single-colour. The Barkas B1000 KB gives the van a recognisable GDR design with passenger windows. Visual style follows `docs/style/koepenick.png`, not the old procedural car drawings.

## Common prompt (prefixed to each subject)

Use-case: stylized-concept. Production texture atlas for a 2:1 isometric painted-comic Berlin post-apocalyptic game. Irregular dark ink, tactile hand-painted chipped enamel, warm cream/amber highlights versus cool teal shade, grounded realistic classic vehicle design rather than toys or angular Minecraft boxes. Transparent background with six fully separate texture pieces in a strict 3-column by 2-row equal-cell layout, generous empty gutters, no labels/text/letters/logos/license plates, no ground, shadows, flames, lighting halos, isometric render or assembled vehicle. Each piece must be a perfectly flat orthographic rectangular face texture, not a perspective object. First row: LEFT long lower body side (front of vehicle at RIGHT), MIDDLE full front-end face with two big round headlights and simple grille, RIGHT overhead body/deck plan with long axis horizontal (front at RIGHT). Second row: LEFT cabin side-window band (front at RIGHT), MIDDLE front windscreen/cabin face, RIGHT overhead roof with long axis horizontal. Keep face edges clean; sculpted rounded corners will be provided by runtime geometry. Make each face fill most of its own cell and separate it clearly. No wheels in textures, wheel cut-outs may be dark but wheels rendered in code. Source alpha must be truly transparent outside each texture.

## Trabi subject

Subject: iconic Trabant 601 saloon. SINGLE uniform warm ivory/cream body colour on every painted panel including roof: never two-tone, blue side, contrasting green roof or racing stripes. Rounded modest bonnet, gentle curved shoulders, soft roof corners, recognizable large circular front headlights, slim simple black grille. Restrained real wear: tiny chipped cream edges, rusty sill seams, a few cracked glass panes, aged chrome. Preserve a clearly readable cream car, not a rust-brown wreck. The six pieces are for this same single cream car. Rounded side-window corners and slender pillars, cabin proportion of an actual Trabant, no gigantic boxy windscreen.

Saved as `trabi-atlas.png`; original built-in output `exec-37e2e252-f2b7-43e2-8c07-cdc0f2950a24.png`.

## Barkas subject

Subject: authentic East German Barkas B1000 KB windowed minibus, NOT a modern delivery box van. Muted pale blue single-colour enamel body, softly rounded cab-forward nose, large circular headlights and characteristic compact horizontal grille; recognisable broad slightly curved windscreen and rows of passenger SIDE WINDOWS, rounded window corners, thin worn metal pillars. The long lower body side piece includes the row of large passenger windows above a blue lower sill; the separate cabin window band carries the front door glass. The body overhead plan has a pale blue gentle rounded roof outline. Modest rust, dents, chipped window seals, a couple of broken panes, sparse weeds trapped in sills. The vehicle must feel rounded and real, not pointy or faceted. Six texture faces all for the same light-blue Barkas.

Saved as `barkas-atlas.png`; original output `exec-225cc1dd-44c9-41d8-bcba-040dd4471930.png`.

## Burned sedan subject

Subject: a partly burned-out abandoned compact 1980s/1990s sedan, recognizable wreck variant distinct from intact coloured cars. Remaining faded dark red enamel on lower doors, hood and trunk; strong black soot concentrated around roof and cabin; peeled blistered paint, exposed oxidised metal, shattered EMPTY window openings, scorched interior seat frames. Roof partly burnt away: dark opened central area with bent charred metal edges, not an intact clean roof recoloured black. Large panel sections remain recognisable as a car, readable silhouette, worn bright rust at heat damage edges, no active fire or smoke. Front headlights cracked/missing, one surviving dull circular lamp. Six distinct flat face textures for the same burned red sedan. Avoid uniform black mud; maintain a clear contrast between charred cabin and surviving red bodywork.

Saved as `burnt-atlas.png`; original output `exec-6879536d-e293-4f92-81cd-5961dfdb7120.png`.

## Normalization

`tools/build_vehicles.py` builds the retained sedan/transit faces, then calls `tools/build_vehicle_refinement.py` for these replacements. `picks.json` records inspected unequal source gutters; the Trabi end uses the lamp/grille belt (640,167,1134,350), avoiding vertically compressed headlights. The Barkas end combines windscreen and grille. All outputs retain alpha, a 1 px border and 3 px/unit; original raw sources are immutable. Only runtime task03 keys are replaced. Old turquoise/red Trabi and red-sedan runtime files are retired. Full builder must remain byte-idempotent.
