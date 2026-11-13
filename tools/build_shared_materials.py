"""Cut the selected generated pickup/material atlases; preserve unrelated sprites."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PICKUPS = 'doener bandage bottle scrap stoff metall chemie kabel fleisch gemuese gewuerz bag-common bag-magic bag-rare bag-legendary bag-set'.split()
GROUND = 'asphalt cobble pavement dirt grass sand plaza ballast concrete'.split()
BUILDING = 'plaster brick wood terracotta slate glass'.split()


def build():
    manifest_path = ROOT / 'assets/manifest.json'
    manifest = json.loads(manifest_path.read_text())
    recipes = []
    for folder, source, names, cols, rows, prefix, size in [
        ('15-pickups', 'pickups-source.png', PICKUPS, 4, 4, 'props/pickup-', 128),
        ('16-shared-materials', 'ground-source.png', GROUND, 3, 3, 'props/ground-', 512),
        ('16-shared-materials', 'building-source.png', BUILDING, 3, 2, 'buildings/shared-', 512),
    ]:
        raw = ROOT / 'assets/raw/codex' / folder
        im = Image.open(raw / source).convert('RGBA')
        for n, name in enumerate(names):
            col, row = n % cols, n // cols
            box = [round(col * im.width / cols), round(row * im.height / rows),
                   round((col + 1) * im.width / cols), round((row + 1) * im.height / rows)]
            crop = im.crop(box)
            if size == 128:
                bounds = crop.getchannel('A').point(lambda a: 255 if a > 12 else 0).getbbox()
                if not bounds:
                    raise ValueError('Empty pickup cell: ' + name)
                crop = crop.crop(bounds)
                crop.thumbnail((120, 120), Image.Resampling.LANCZOS)
                out = Image.new('RGBA', (128, 128))
                out.alpha_composite(crop, ((128 - crop.width) // 2, (128 - crop.height) // 2))
            else:
                # Normalization only: preserve authored pixels, removing the cell boundary.
                crop = crop.crop((2, 2, crop.width - 2, crop.height - 2))
                out = crop.resize((512, 512), Image.Resampling.LANCZOS)
                # Renderer discards this border; preserve normalized-sprite alpha convention.
                alpha = Image.new('L', (512, 512), 0)
                alpha.paste(255, (1, 1, 511, 511))
                out.putalpha(alpha)
            key = prefix + name
            path = ROOT / 'assets' / (key + '.webp')
            path.parent.mkdir(parents=True, exist_ok=True)
            out.save(path, 'WEBP', quality=88, method=6)
            manifest[key] = {'w': size, 'h': size, 'anchor': [size // 2, size - 1],
                             'units': 3, 'for': 'paintedDrop' if size == 128 else 'global painted material ' + name}
            recipes.append({'key': key, 'source': folder + '/' + source, 'crop': box})
    manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False) + '\n')
    raw = ROOT / 'assets/raw/codex/16-shared-materials'
    (raw / 'cuts.json').write_text(json.dumps(recipes, indent=2) + '\n')
    proof = Image.new('RGB', (768, 440), '#20363e')
    draw = ImageDraw.Draw(proof)
    for n, name in enumerate(PICKUPS):
        im = Image.open(ROOT / ('assets/props/pickup-' + name + '.webp')).convert('RGBA')
        im.thumbnail((64, 64))
        x, y = 12 + n % 8 * 96, 12 + n // 8 * 210
        proof.paste(im, (x, y), im)
        draw.text((x, y + 72), name, fill='white')
        im.thumbnail((32, 32))
        proof.paste(im, (x + 16, y + 108), im)
    proof.save(ROOT / 'assets/raw/codex/15-pickups/game-size.png')
    print(json.dumps({'assets': len(recipes), 'encodedBytes': sum((ROOT / 'assets' / (r['key'] + '.webp')).stat().st_size for r in recipes),
                      'decodedBytes': sum(manifest[r['key']]['w'] * manifest[r['key']]['h'] * 4 for r in recipes)}))


if __name__ == '__main__':
    build()
