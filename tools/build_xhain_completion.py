"""Cut authored Xhain material atlas; preserve geometry in the renderer."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/22-xhain-completion'
NAMES = 'arcade tower copper concrete station glass iron rail-brick mural ceramic water paving'.split()

def build():
    atlas = Image.open(RAW / 'material-atlas.png').convert('RGBA')
    mp = ROOT / 'assets/manifest.json'
    manifest = json.loads(mp.read_text())
    recipes = []
    gallery = Image.new('RGB', (768, 240), '#20363e')
    pen = ImageDraw.Draw(gallery)
    for i, name in enumerate(NAMES):
        box = (i % 4 * atlas.width // 4 + 3, i // 4 * atlas.height // 3 + 3,
               (i % 4 + 1) * atlas.width // 4 - 3, (i // 4 + 1) * atlas.height // 3 - 3)
        im = atlas.crop(box).resize((256, 256), Image.Resampling.LANCZOS)
        out = Image.new('RGBA', (258, 258))
        out.paste(im, (1, 1))
        key = 'buildings/xhain-' + name
        out.save(ROOT / ('assets/' + key + '.webp'), 'WEBP', quality=90, method=6)
        manifest[key] = dict(w=258, h=258, anchor=[1, 257], units=3,
                             **{'for': 'Xhain custom projected architecture/surfaces: ' + name})
        recipes.append(dict(key=key, source='material-atlas.png', crop=box, output=[258, 258]))
        gallery.paste(im.resize((64, 64)), (i % 6 * 128 + 8, i // 6 * 120 + 8))
        pen.text((i % 6 * 128 + 8, i // 6 * 120 + 78), name, fill='white')
    mp.write_text(json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False) + '\n')
    (RAW / 'cuts.json').write_text(json.dumps(recipes, indent=2) + '\n')
    gallery.save(RAW / 'game-size.png')
    print(json.dumps(dict(assets=len(NAMES), decodedBytes=len(NAMES)*258*258*4)))

if __name__ == '__main__':
    build()
