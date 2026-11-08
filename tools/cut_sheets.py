#!/usr/bin/env python3
"""Cut ChatGPT sheets from assets/raw/ into game-ready WebP files.

Icons (B01..B10): 4x2 cells, teal background keyed out, trimmed, padded square, 128 px -> assets/icons/<ID>.webp
Player parts (H01): 3x2 cells, keyed like icons but NOT trimmed or scaled (parts share the sheet scale) -> assets/hero/<ID>.webp
Portraits (P01..P05): 3x2 cells, background kept, square crop above the label strip, 192 px -> assets/portraits/<ID>.webp
IDs come from docs/chatgpt-assets.md. Run: python3 tools/cut_sheets.py [B01 P02 ...]
"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'assets', 'raw')
IDS = {
 'B01': 'I01 I02 I03 I04 I05 I06 I07 I08', 'B02': 'I09 I10 I11 I12 I13 I14 I15 I16',
 'B03': 'I17 I18 I19 I20 I21 I22 I23 I24', 'B04': 'I25 I26 I27 I28 I29 I30 I31 I32',
 'B05': 'I33 I34 I35 I36 I37 I38 I39 I40', 'B06': 'I41 I42 I43 I44 I45 I46 I47 I48',
 'B07': 'I49 I50 I51 I52 I53 I54 I55 I56', 'B08': 'I57 I58 C01 C02 C03 C04 C05 C06',
 'B09': 'C07 M01 M02 M03 M04 M05 M06 M07', 'B10': 'R01 R02 R03 R04 R05 R06 R07 -',
 'P01': 'S01 S02 S03 S04 S05 S06', 'P02': 'E01 E02 E03 E04 E05 E06', 'P03': 'E07 E08 E09 E10 E11 E12',
 'P04': 'X01 X02 X03 X04 X05 X06', 'P05': 'X07 X08 - - - -',
 'B11': 'I59 I60 I61 I62 I63 I64 I65 I66', 'B12': 'I67 I68 I69 I70 D01 - - -', 'P06': 'E13 E14 X09 - - -',
 'H01': 'H01 H02 H03 H04 H05 -', 'H02': 'H01 H02 H03 H04 H05 -',
 'H03': 'K01 K03 K05 K02 K04 K06', 'H04': 'K07 K09 K11 K08 K10 K12', 'H05': 'K13 K15 K17 K14 K16 K18', 'H06': 'K19 K21 K23 K20 K22 K24',
 'H07': 'K25 K26 K27 K28 K29 -'}
ICON, PORT = 128, 192

def label_top(im, x0, x1, y0, y1, narrow=False):
    """First row (scanning down from the middle of the cell) that is mostly near-black: the ID strip.
    narrow: the strip is only a small box under the centre (H sheets), so check the centre band in the lowest quarter."""
    g = im.convert('L'); c = (x0 + x1) // 2
    for y in range((y0 + 3 * y1) // 4 if narrow else (y0 + y1) // 2, y1):
        row = [g.getpixel((x, y)) for x in (range(c - 40, c + 40, 4) if narrow else range(x0 + 20, x1 - 20, 6))]
        if sum(v < 40 for v in row) > .8 * len(row): return y
    return y1

def bg_colour(im):
    w, h = im.size; pts = [im.getpixel((x, y)) for x in range(0, w, 8) for y in (2, h - 3)] + [im.getpixel((x, y)) for y in range(0, h, 8) for x in (2, w - 3)]
    return tuple(sorted(p[i] for p in pts)[len(pts) // 2] for i in range(3))

def key_out(cell):
    """Alpha mask: background = pixels close to the teal, connected to the cell border. Soft 1 px edge."""
    bg = bg_colour(cell); w, h = cell.size
    d = ImageChops.difference(cell, Image.new('RGB', cell.size, bg)).convert('L')  # rough colour distance
    near = d.point(lambda v: 255 if v < 22 else 0)
    pad = Image.new('L', (w + 2, h + 2), 255); pad.paste(near, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 128)
    # enclosed holes (ring centres, slingshot forks, chain links): big flat teal patches inside the object
    hole = pad.copy(); hole.paste(d.point(lambda v: 255 if v < 8 else 0), (1, 1), pad.crop((1, 1, w + 1, h + 1)).point(lambda v: 255 if v == 255 else 0))
    for y in range(1, h + 1, 3):
        for x in range(1, w + 1, 3):
            if hole.getpixel((x, y)) != 255: continue
            ImageDraw.floodfill(hole, (x, y), 200); n = hole.histogram()[200]
            ImageDraw.floodfill(hole, (x, y), 100 if n > 400 else 50)
    pad = Image.composite(Image.new('L', pad.size, 128), pad, hole.point(lambda v: 255 if v == 100 else 0))
    bgm = pad.crop((1, 1, w + 1, h + 1)).point(lambda v: 255 if v == 128 else 0)
    alpha = ImageChops.invert(bgm)
    # soften: pixels at the rim get alpha from their distance to the background colour
    rim = ImageChops.subtract(alpha, alpha.filter(ImageFilter.MinFilter(3)))
    soft = d.point(lambda v: max(0, min(255, (v - 10) * 8)))
    alpha = Image.composite(soft, alpha, rim)
    return alpha.filter(ImageFilter.GaussianBlur(.6)), bg

def icon(cell, size=ICON):
    a, _ = key_out(cell); box = a.point(lambda v: 255 if v > 40 else 0).getbbox()
    rgba = cell.convert('RGBA'); rgba.putalpha(a); rgba = rgba.crop(box)
    s = int(max(rgba.size) * 1.06); sq = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    sq.paste(rgba, ((s - rgba.width) // 2, (s - rgba.height) // 2)); return sq.resize((size, size), Image.LANCZOS)

def part(cell):
    """Keyed but unscaled. Big near-black blobs (the neck hole ChatGPT leaves in a headless torso) become transparent."""
    a, _ = key_out(cell); g = cell.convert('L'); w, h = cell.size
    blk = g.point(lambda v: 255 if v < 22 else 0); pad = Image.new('L', (w + 2, h + 2), 0); pad.paste(blk, (1, 1))
    for y in range(1, h + 1, 3):
        for x in range(1, w + 1, 3):
            if pad.getpixel((x, y)) != 255: continue
            ImageDraw.floodfill(pad, (x, y), 200); n = pad.histogram()[200]; ImageDraw.floodfill(pad, (x, y), 100 if n > 600 else 50)
    a = ImageChops.subtract(a, pad.crop((1, 1, w + 1, h + 1)).point(lambda v: 255 if v == 100 else 0))
    rgba = cell.convert('RGBA'); rgba.putalpha(a); return rgba

def portrait(cell):
    w, h = cell.size; s = min(w, h); x = (w - s) // 2
    return cell.crop((x, h - s, x + s, h)).resize((PORT, PORT), Image.LANCZOS)

def run(b):
    im = Image.open(os.path.join(RAW, b + '.png')).convert('RGB'); W, H = im.size
    cols = 4 if b[0] == 'B' else 3; cw, ch = W // cols, H // 2
    out = os.path.join(ROOT, 'assets', {'B': 'icons', 'P': 'portraits', 'H': 'hero'}[b[0]]); os.makedirs(out, exist_ok=True)
    for i, idn in enumerate(IDS[b[:3]].split()):  # H01a, H01b ...: variants of H01, ids get the suffix
        if idn == '-': continue
        x0, y0 = (i % cols) * cw, (i // cols) * ch
        lt = label_top(im, x0, x0 + cw, y0, y0 + ch, b[0] == 'H')
        m = 6; cell = im.crop((x0 + m, y0 + m, x0 + cw - m, lt - 4))
        img = icon(cell) if b[0] == 'B' else part(cell) if b[0] == 'H' else portrait(cell)
        img.save(os.path.join(out, (b + '-' + idn if b[0] == 'H' else idn) + '.webp'), 'WEBP', quality=86, method=6)  # H: sheet-variant-part, e.g. H02a-H03
        print(b, idn, 'label at', lt - y0)

if __name__ == '__main__':
    for b in (sys.argv[1:] or sorted(IDS)): run(b)
