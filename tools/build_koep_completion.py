"""Normalize generated Köpenick architecture/surfaces; no procedural painting."""
import json
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/21-koepenick-completion'

def build():
    mp = ROOT / 'assets/manifest.json'
    manifest = json.loads(mp.read_text())
    recipes = []
    gallery = Image.new('RGB', (768, 350), '#20363e')
    g = ImageDraw.Draw(gallery)
    for source, names in [('architecture-atlas.png', ['facade', 'roof', 'tower', 'station', 'bridge-wall', 'water']), ('surfaces-atlas.png', ['plaza', 'pavement', 'asphalt', 'path', 'platform', 'bridge-deck'])]:
        atlas = Image.open(RAW / source).convert('RGBA')
        for n, name in enumerate(names):
            box = (n % 3 * atlas.width // 3, n // 3 * atlas.height // 2, (n % 3 + 1) * atlas.width // 3, (n // 3 + 1) * atlas.height // 2)
            im = atlas.crop(box)
            if name == 'tower':
                a = np.array(im)
                rgb = a[:, :, :3].astype('int16')
                bg = (rgb[:, :, 0] > rgb[:, :, 1] + 25) & (rgb[:, :, 2] > rgb[:, :, 1] + 25)
                mask = Image.fromarray(np.where(bg, 0, 255).astype('uint8')).copy()
                # Select only the connected tower; discard isolated atlas-edge pixels.
                ImageDraw.floodfill(mask, (im.width//2, im.height*3//5), 128)
                a[np.array(mask) != 128] = 0
                im = Image.fromarray(a)
                im = im.crop(im.getbbox())
                im.thumbnail((144, 576), Image.Resampling.LANCZOS)
            else:
                im = im.crop((2, 2, im.width - 2, im.height - 2)).resize((256, 256), Image.Resampling.LANCZOS)
            out = Image.new('RGBA', (im.width + 2, im.height + 2))
            out.paste(im, (1, 1))
            key = 'buildings/koep-special-' + name
            dest = ROOT / ('assets/' + key + '.webp')
            out.save(dest, 'WEBP', quality=90, method=6)
            manifest[key] = dict(w=out.width, h=out.height, anchor=[1, out.height-1], units=3, **{'for': 'Köpenick special architecture and surfaces: ' + name})
            recipes.append(dict(key=key, source=source, crop=box))
            idx = len(recipes)-1
            preview = out.copy()
            preview.thumbnail((64, 64))
            x, y = idx % 6 * 128 + 10, idx // 6 * 170 + 10
            gallery.paste(preview, (x, y), preview)
            g.text((x, y+70), name, fill='white')
    mp.write_text(json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False)+'\n')
    (RAW / 'cuts.json').write_text(json.dumps(recipes, indent=2)+'\n')
    gallery.save(RAW / 'game-size.png')
    print(json.dumps({'assets': len(recipes), 'decodedBytes': sum(manifest[r['key']]['w']*manifest[r['key']]['h']*4 for r in recipes)}))

if __name__ == '__main__':
    build()
