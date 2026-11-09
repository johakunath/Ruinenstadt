#!/usr/bin/env python3
"""Validate explicit weapon icon pivots and render a labelled diagnostic sheet."""
import json
import math
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
META = ROOT / 'assets/raw/codex/07-player-rig-v2/weapons.json'
OUT = META.parent / 'weapons-pivots.png'
WEAPONS = ROOT / 'tools/build_hero.py'
ITEMS = ROOT / 'js/items.js'


def required_ids():
    build = WEAPONS.read_text()
    match = re.search(r"^WEAP\s*=\s*'([^']+)'\.split\(\)", build, re.M)
    if not match:
        raise ValueError('Could not read WEAP from tools/build_hero.py')
    ids = set(match.group(1).split())
    items = ITEMS.read_text()
    ico_body = re.search(r'const ICOI=\{(.*?)\};', items, re.S)
    data_js = (ROOT / 'js/data.js').read_text()
    base_body = re.search(r'const BASES=\{(.*?)\};', data_js, re.S)
    if not ico_body or not base_body:
        raise ValueError('Could not read ICOI or BASES from js/items.js')
    icon_by_base = dict(re.findall(r"([A-Za-z0-9_]+):'(I\d+)'", ico_body.group(1)))
    base_by_name = dict(re.findall(r"'([^']+)':'([^']+)'", base_body.group(1)))

    # Collect every named weapon from the ordinary, legendary, neon, and Alex
    # weapon pools, then include any of those names that have a painted ICOI.
    weapon_names = set()
    for name in ('NW', 'LEGW', 'NWM', 'NWG'):
        body = re.search(rf'const {name}=(\{{.*?\}})', data_js, re.S)
        if not body:
            raise ValueError(f'Could not read {name} weapon pool from js/data.js')
        weapon_names.update(re.findall(r"'([^']+)'", body.group(1)))
    sets_body = re.search(r'const SETS=\{(.*?)\};', data_js, re.S)
    if not sets_body:
        raise ValueError('Could not read weapon names from SETS in js/data.js')
    weapon_names.update(re.findall(r"w:\['([^']+)'", sets_body.group(1)))

    gameplay_icons = set()
    for name in weapon_names:
        base = base_by_name.get(name)
        if base is None:
            matching = [key for key in base_by_name if name.startswith(key)]
            if matching:
                base = base_by_name[max(matching, key=len)]
        if base and base in icon_by_base:
            gameplay_icons.add(icon_by_base[base])
    if missing := sorted(gameplay_icons - ids):
        raise ValueError('Gameplay weapon icons absent from WEAP: ' + ', '.join(missing))
    return ids


def validate_and_render():
    data = json.loads(META.read_text())
    required = required_ids()
    actual = set(data)
    if missing := sorted(required - actual):
        raise ValueError('Missing metadata for: ' + ', '.join(missing))
    if extra := sorted(actual - required):
        raise ValueError('Unexpected metadata entries: ' + ', '.join(extra))

    for icon_id, item in data.items():
        source = ROOT / item['source']
        if not source.is_file():
            raise ValueError(f'{icon_id}: source does not exist: {item["source"]}')
        with Image.open(source) as im:
            size = list(im.size)
        if size != item['size']:
            raise ValueError(f'{icon_id}: declared size {item["size"]}, actual size {size}')
        pivots = item.get('pivots', {})
        if set(pivots) != {'grip', 'tip'}:
            raise ValueError(f'{icon_id}: pivots must contain exactly grip and tip')
        for name, point in pivots.items():
            if (not isinstance(point, list) or len(point) != 2 or
                    any(not isinstance(v, (int, float)) for v in point)):
                raise ValueError(f'{icon_id}: {name} must be a numeric [x, y]')
            x, y = point
            if not (0 <= x < size[0] and 0 <= y < size[1]):
                raise ValueError(f'{icon_id}: {name} {point} is outside {size}')
            if name == 'grip':
                with Image.open(source) as im:
                    alpha = im.convert('RGBA').getpixel((int(x), int(y)))[3]
                if alpha <= 80:
                    raise ValueError(f'{icon_id}: grip {point} has alpha {alpha}, expected >80')
        gx, gy = pivots['grip']
        tx, ty = pivots['tip']
        if (gx - tx) ** 2 + (gy - ty) ** 2 < 64:
            raise ValueError(f'{icon_id}: grip and tip are implausibly close')

    cols, cw, ch = 5, 236, 194
    rows = (len(data) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cw, rows * ch + 36), '#28231f')
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    draw.text((10, 9), 'Weapon pivot check  |  green = grip   red = tip   arrow = grip → tip',
              fill='#f4eadb', font=font)
    for index, (icon_id, item) in enumerate(data.items()):
        col, row = index % cols, index // cols
        ox, oy = col * cw, 36 + row * ch
        draw.rounded_rectangle((ox + 4, oy + 4, ox + cw - 4, oy + ch - 4),
                               radius=5, fill='#37312b', outline='#655a4d')
        im = Image.open(ROOT / item['source']).convert('RGBA')
        scale = 1.15
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.NEAREST)
        x0, y0 = ox + (cw - im.width) // 2, oy + 24
        back = Image.new('RGBA', im.size, (49, 44, 39, 255))
        back.alpha_composite(im)
        sheet.paste(back.convert('RGB'), (x0, y0))
        g = (x0 + item['pivots']['grip'][0] * scale, y0 + item['pivots']['grip'][1] * scale)
        t = (x0 + item['pivots']['tip'][0] * scale, y0 + item['pivots']['tip'][1] * scale)
        draw.line((g, t), fill='#ffd166', width=2)
        angle = math.atan2(t[1] - g[1], t[0] - g[0])
        for offset in (-0.55, 0.55):
            end = (t[0] - 9 * math.cos(angle + offset), t[1] - 9 * math.sin(angle + offset))
            draw.line((t, end), fill='#ffd166', width=2)
        draw.ellipse((g[0] - 5, g[1] - 5, g[0] + 5, g[1] + 5), fill='#45df87', outline='#10251a')
        draw.ellipse((t[0] - 4, t[1] - 4, t[0] + 4, t[1] + 4), fill='#ff5252', outline='#301010')
        py = oy + 174
        draw.text((ox + 9, oy + 9), icon_id, fill='white', font=font)
        draw.text((ox + 9, py), item['source'], fill='#d6cfc0', font=font)
        draw.text((ox + 9, py + 12), f"g={item['pivots']['grip']}  t={item['pivots']['tip']}",
                  fill='#d6cfc0', font=font)
    sheet.save(OUT)
    print(f'Validated {len(data)} weapon icons from WEAP and gameplay pools: {", ".join(sorted(data))}')
    print(f'Comparison sheet: {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    validate_and_render()
