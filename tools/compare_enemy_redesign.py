#!/usr/bin/env python3
"""Compare normalized enemy idle designs against an exported baseline.

Run without arguments after rebuilding sprites. A 48-unit reference character
is 64 px tall before the enemy renderer's existing 1.15 scale; the large columns
are 2.5 times that display. Black columns preserve the same world scale instead
of making every silhouette equally tall. Yellow ellipses use the actual circle
projection from js/iso.js. This is a static proof, not the animation renderer.

The JSON records a narrow candidate-sole band immediately above the authored
anchor. It deliberately does not infer feet from a broad bottom-body strip or
declare a hitbox pass. Raised feet, toes and finger identities need inspection.
"""
import argparse
import hashlib
import json
import math
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
KINDS = ('ghoul', 'spitter', 'bomb', 'howl', 'raser')
RADIUS = {'ghoul': 10, 'brute': 17, 'spitter': 11, 'rat': 6, 'crow': 8,
          'shield': 13, 'bomb': 11, 'howl': 11, 'raser': 11,
          'schrottkoloss': 34, 'kabel': 9, 'bass': 15, 'uhr': 13,
          'wurz': 12, 'kern': 11, 'brigadeghoul': 10}
REFERENCE_SCALE = 64 / 48
RENDER_SCALE = 1.15
COLOUR = '#e8e4db'
CELL = '#ddd9d0'
INK = '#211f1b'
RING = '#967205'


def rounded(value):
    return round(float(value), 4)


def intervals(xs):
    """Contiguous x intervals in a sampled band; no semantic foot inference."""
    if not len(xs):
        return []
    groups = np.split(xs, np.nonzero(np.diff(xs) > 1)[0] + 1)
    return [[int(group[0]), int(group[-1])] for group in groups]


def load(root, manifest, kind):
    key = f'enemies/{kind}-idle'
    entry = manifest[key]
    path = root / 'assets' / (key + '.webp')
    with Image.open(path) as image:
        im = image.convert('RGBA')
    if list(im.size) != [entry['w'], entry['h']]:
        raise ValueError(f'{path}: manifest dimensions differ from image')
    units = entry['units']
    if units <= 0:
        raise ValueError(f'{path}: positive units required')
    ax, ay = entry['anchor']
    alpha = np.asarray(im)[:, :, 3]
    # At most three source rows above the authored ground anchor. A thick
    # percentage-of-body strip would also sample dangling hands and calves.
    first = max(0, math.ceil(ay - 3))
    last = min(im.height - 1, math.floor(ay))
    sampled = alpha[first:last + 1] > 128
    local_y, x = np.nonzero(sampled)
    y = local_y + first
    source = (root / 'js/anim.js').read_text()
    body = re.search(r'\b' + re.escape(kind) + r'\s*:\s*\{([^}]+)\}', source)
    if not body:
        raise ValueError(f'{root}: missing authored reference for {kind}')
    r = float(re.search(r'\br\s*:\s*([0-9.]+)', body[1])[1])
    ground_match = re.search(r'\bground\s*:\s*([0-9.]+)', body[1])
    ground = float(ground_match[1]) if ground_match else .4
    # ix(r*cos(a),r*sin(a)) = r*(cos(a)-sin(a))/sqrt(2).
    # Its extrema are +/-r; iy has extrema +/-r/2.
    metrics = {
        'path': f'assets/{key}.webp',
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'dimensions_px': list(im.size),
        'anchor_px': entry['anchor'],
        'units': units,
        'candidate_band_rows_px': [first, last],
        'candidate_band_pixels': int(len(x)),
        'candidate_x_intervals_px': intervals(np.unique(x)),
        'projected_ring_half_width': r,
        'projected_ring_half_height': r / 2,
        'ground_offset': ground,
        'render_scale_before_motion': RENDER_SCALE,
        'feet_anchor_y_from_ground': rounded(r * ground),
        'automatic_hitbox_verdict': None,
    }
    if len(x):
        left = (float(x.min()) - ax) / units * RENDER_SCALE
        right = (float(x.max()) - ax) / units * RENDER_SCALE
        top = r * ground + (float(y.min()) - ay) / units * RENDER_SCALE
        bottom = r * ground + (float(y.max()) - ay) / units * RENDER_SCALE
        metrics.update({
            'candidate_contact_envelope_from_ground': {
                'left': rounded(left), 'right': rounded(right),
                'top': rounded(top), 'bottom': rounded(bottom),
            },
            'candidate_width_over_projected_ring_width': rounded((right - left) / (2 * r)),
        })
    return im, entry, metrics


def font(size):
    try:
        return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', size)
    except OSError:
        return ImageFont.load_default()


def card(sheet, image, entry, kind, left, top, width, height, scale, black=False, bottom_margin=37, reference=None):
    draw = ImageDraw.Draw(sheet)
    draw.rectangle((left + 3, top + 3, left + width - 4, top + height - 4), fill=CELL)
    cx, cy = left + width / 2, top + height - bottom_margin
    radius = reference['projected_ring_half_width']
    ground = reference['ground_offset']
    draw.ellipse((cx - radius * scale, cy - radius * scale / 2,
                  cx + radius * scale, cy + radius * scale / 2), outline=RING, width=1)
    draw.line((cx - 3, cy, cx + 3, cy), fill=RING)
    draw.line((cx, cy - 3, cx, cy + 3), fill=RING)
    pixel_scale = scale * RENDER_SCALE / entry['units']
    size = [max(1, round(dimension * pixel_scale)) for dimension in image.size]
    sprite = image.resize(size, Image.Resampling.LANCZOS)
    if black:
        silhouette = Image.new('RGBA', sprite.size, INK)
        silhouette.putalpha(sprite.getchannel('A'))
        sprite = silhouette
    ax, ay = entry['anchor']
    x = round(cx - ax * pixel_scale)
    y = round(cy + radius * ground * scale - ay * pixel_scale)
    if x < left or x + size[0] > left + width or y < top or y + size[1] > top + height:
        raise ValueError(f'{kind}: comparison card would clip ({size})')
    sheet.paste(sprite, (x, y), sprite)
    return {'scale_px_per_world_unit': rounded(scale), 'paint_scale_px_per_source_pixel': rounded(pixel_scale)}


def layout(families):
    """Keep the original five-type layout; enlarge only when a card needs it."""
    large_width, small_width, row_height, bottom_margin = 225, 145, 250, 37
    highest = 0
    for kind, pair in families.items():
        for image, entry, reference in pair.values():
            ax, ay = entry['anchor']
            for multiplier in (1, 2.5):
                scale = REFERENCE_SCALE * multiplier
                pixel_scale = scale * RENDER_SCALE / entry['units']
                # Round-up margin also accounts for final placement rounding.
                needed_width = math.ceil(2 * max(ax, image.width - ax) * pixel_scale) + 8
                if multiplier == 2.5:
                    large_width = max(large_width, needed_width)
                else:
                    small_width = max(small_width, needed_width)
                feet = reference['feet_anchor_y_from_ground'] * scale
                highest = max(highest, ay * pixel_scale - feet)
                lowest = feet + (image.height - ay) * pixel_scale
                bottom_margin = max(bottom_margin, math.ceil(lowest) + 4)
    row_height = max(row_height, math.ceil(highest) + bottom_margin + 4)
    label_width = max(100, math.ceil(max(font(14).getlength(kind) for kind in families)) + 24)
    return large_width, small_width, label_width, row_height, bottom_margin


def run(args):
    baseline = args.baseline.resolve()
    current = args.root.resolve()
    old_manifest = json.loads((baseline / 'assets/manifest.json').read_text())
    new_manifest = json.loads((current / 'assets/manifest.json').read_text())
    kinds = tuple(kind.strip() for kind in args.types.split(',')) if args.types else KINDS
    if not kinds or any(kind not in RADIUS for kind in kinds) or len(set(kinds)) != len(kinds):
        raise ValueError('--types must contain distinct enemy family names: ' + ','.join(RADIUS))
    families = {kind: {'old': load(baseline, old_manifest, kind),
                       'new': load(current, new_manifest, kind)} for kind in kinds}
    large_width, small_width, label_width, row_height, bottom_margin = layout(families)
    columns = [('old / large', large_width, 2.5, False, 'old'),
               ('new / large', large_width, 2.5, False, 'new'),
               ('old / game size', small_width, 1, False, 'old'),
               ('new / game size', small_width, 1, False, 'new'),
               ('old / silhouette', small_width, 1, True, 'old'),
               ('new / silhouette', small_width, 1, True, 'new')]
    header = 100
    sheet = Image.new('RGB', (label_width + sum(c[1] for c in columns), header + row_height * len(kinds)), COLOUR)
    draw = ImageDraw.Draw(sheet)
    draw.text((12, 10), '01b enemy redesign - old versus new', fill=INK, font=font(19))
    draw.text((12, 37), 'World scale: 48 units = 64 px; enemy paint x1.15. Large columns x2.5. Idle only; inspect animated browser proof too.', fill=INK, font=font(12))
    draw.text((12, 57), 'Yellow: actual projected collision circle. Candidate-sole measurements are descriptive and do not declare a hitbox pass.', fill=INK, font=font(12))
    x = label_width
    for label, width, _, _, _ in columns:
        draw.text((x + 8, 79), label, fill=INK, font=font(13))
        x += width
    report = {
        'reference_character_units': 48, 'reference_height_px': 64,
        'enemy_render_scale_before_motion': RENDER_SCALE,
        'large_display_multiplier': 2.5,
        'projection': 'ix=(x-y)/sqrt(2), iy=(x+y)/(2*sqrt(2)); a world circle projects to ellipse half-width r, half-height r/2',
        'measurement_limitations': 'Only the >128 alpha candidate contact band in the three source rows immediately above each authored anchor is measured. Raised feet can fall outside this band; identities of feet/toes/fingers are not inferred. Vertical anchor offset and motion complicate ellipse containment. No automatic hitbox pass is claimed.',
        'families': {},
    }
    for i, kind in enumerate(kinds):
        old, new = families[kind]['old'], families[kind]['new']
        top = header + i * row_height
        draw.text((12, top + 18), kind, fill=INK, font=font(14))
        draw.text((12, top + 40), f"r: {old[2]['projected_ring_half_width']:g} → {new[2]['projected_ring_half_width']:g}", fill=INK, font=font(12))
        x = label_width
        for _, width, multiplier, black, which in columns:
            image, entry, reference = old if which == 'old' else new
            card(sheet, image, entry, kind, x, top, width, row_height, REFERENCE_SCALE * multiplier, black, bottom_margin, reference)
            x += width
        report['families'][kind] = {'old': old[2], 'new': new[2]}
    output = args.output or current / 'pipeline/proof/01b-enemy-redesign/comparison.png'
    output.parent.mkdir(parents=True, exist_ok=True)
    previous = json.loads(output.with_suffix('.json').read_text()) if output.with_suffix('.json').exists() else None
    sheet.save(output, 'PNG')
    output.with_suffix('.json').write_text(json.dumps(report, indent=2, sort_keys=True) + '\n')
    print(f'{output}: {len(kinds)} old/new families, static world scale and silhouettes')
    for kind in kinds:
        new = report['families'][kind]['new']
        changed = previous is not None and previous.get('families', {}).get(kind, {}).get('new', {}).get('sha256') != new['sha256']
        print(f'{kind}: current {new["dimensions_px"]}, sha256 {new["sha256"][:12]}' + (' CHANGED since prior comparison' if changed else ''))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--baseline', type=Path, default=Path('/tmp/ruinenstadt-baseline'))
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--types', help='comma-separated family names; default: ' + ','.join(KINDS))
    args = parser.parse_args()
    try:
        run(args)
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
