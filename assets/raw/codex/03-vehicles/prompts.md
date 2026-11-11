# Task03 generation record

Built-in imagegen, three calls total; no CLI/API/model selection. Reference
boards viewed before generation: `docs/style/koepenick.png`,
`docs/style/ubahn.png`. No code-drawn vehicle was used as a design reference.
The user delegated routine design and colour selection; the family canvas
was shown before continuing. Pick: the worn Berlin family canvas, because the
compact Trabi, box van and distinct bus/tram read clearly and match the boards.

## Style canvas prompt

Use case: stylized-concept. Make a single professional vehicle STYLE CANVAS for Ruinenstadt, a gritty isometric painted-comic post-apocalyptic Berlin game. Reference mood: warm cream/ochre against cool teal dusk, heavy dark ink, textured brush paint, chipped enamel, bent sheet metal, rusty seams, broken glass and ivy, visibly abandoned and unsettling, never pristine or toy-like. The source vehicles are the overgrown yellow BVG bus and rusty Trabant of the Köpenick board and weathered yellow U-Bahn of the underground board. On dark teal paper present FIVE distinct silhouette studies in an organized readable sheet: aged 1990s four-door sedan in bottle green; small cream/turquoise Trabant 601 with rounded cabin; boxy blue panel van; long single-decker BVG-yellow bus with black windows; long angular yellow Berlin tram with pantograph. Each is a 2:1 isometric painted illustration, grounded on flat tyres, no people. Show palette swatches and close-up material chips. Enough contrast to read at game size, dark outline, restrained overgrowth at lower seams. Do not copy generic canvas boxes. No written labels required, no watermark. This is a style source only; actual runtime will use painted face textures wrapped to existing geometry.

## Small vehicle atlas prompt

Use case: stylized-concept. Asset type: ONE production texture atlas for a 2:1-isometric painted-comic game, containing orthographic flat vehicle surface paintings. The input visual direction is ruined Berlin: dark strong ink outlines, painterly cream and cool teal shadows, chipped enamel, rust seams, dents, broken glass, ivy in a few corners. NO 3D perspective on this sheet: flat surface elevations only. On a genuinely TRANSPARENT background make an EXACT THREE ROW by THREE COLUMN grid, evenly spaced with generous clean gutters. ROW1: dark bottle green 1990s four-door sedan. ROW2: pale turquoise and cream Trabant 601. ROW3: faded cobalt blue tall boxy panel van. For EACH row COL1 is the long SIDE ELEVATION of the vehicle body, flat orthographic, front pointing LEFT, wheels omitted (body has straight lower edge, not wheel arch holes), includes low metal body strip and raised cabin with cracked windows; COL2 is FRONT ELEVATION orthographic, headlights grille below cracked windshield, wheels omitted; COL3 is TOP-DOWN ROOF PLAN orthographic, long axis horizontal front at LEFT, weathered hood on left, cabin roof in centre, boot on right. Each painting is separate and readable, no ground, no shadows, no text, no border, no labels, no watermark, no extra objects. Every vehicle is rectangular enough for an affine texture wrap: longside lower metal body perfectly horizontal; no environment and no perspective. Side front and roof correspond in paint colour and wear. Not photoreal, rich brushwork and black ink. Wide landscape sheet.

## Transit atlas prompt

Use case: stylized-concept. ONE production painted-comic texture atlas, EXACT TWO ROWS by THREE COLUMNS on genuinely transparent background, wide landscape sheet. Flat orthographic surface paintings only, ZERO perspective. Gritty ruined Berlin transit, bold dark ink, painterly warm yellow and cool teal, badly chipped enamel edges, rusty rivets, shattered dark windows, broken doors, small trailing ivy patches. Each complete separate painting fits its own cell with clean generous gutters. ROW1 classic long single-decker BVG Berlin city bus: COL1 perfectly flat LONG SIDE ELEVATION front to left (straight body bottom, no wheels and no wheel holes; broken black-framed windows occupy upper half, two doors, yellow lower panels, narrow red stripe); COL2 flat FRONT ELEVATION (cracked windshield upper half, headlights and dark grille below, straight lower edge, no wheels); COL3 perfectly TOP-DOWN ROOF PLAN long axis horizontal front left (yellow chipped roof seams and vents). ROW2 long Berlin tram distinct from bus: COL1 long SIDE ELEVATION front left (angular transit car, dark broken windows upper half, yellow panels lower half, door bays, no wheels, no pantograph in this elevation); COL2 FRONT ELEVATION (angular windshield, round headlights below, yellow lower panel, no wheels); COL3 TOP-DOWN ROOF PLAN long axis horizontal front left (worn cream/yellow roof with electrical housings, no protruding pantograph). Orthographic, no ground, no shadow, no text or numbers, no labels or watermark, no environment. All painted parts rectangular, filled to the corners, not isolated 3D objects. Make side bodies and roof plans LONG at least four times as wide as tall, front bodies almost square.

## Derivation

`tools/build_vehicles.py` records exact source crops and authored 3 px/unit
surface sizes. Colours only: sedan green/red/blue, Trabi turquoise/cream/red,
van blue/cream; transit yellow. Rust, cream, glass and ink are preserved by
the enamel mask. Runtime picks deterministically from the existing colour
field, consuming no RNG. Triangle projection preserves full cabin frusta;
the cached view is composed at the actual map rotation, never a ground-plane
transform of an upright painting. No additional angle generations needed.
