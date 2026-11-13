"""Cut authored Alexanderplatz material atlas; preserve geometry in the renderer."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/22-alexanderplatz-completion'
NAMES = 'rathaus limestone bronze curtain relief greenhouse station copper plaza rail-brick water awning'.split()

def build():
    atlas = Image.open(RAW / 'material-atlas.png').convert('RGBA')
    sheet = Image.open(RAW / 'landmark-sheet.png').convert('RGBA')
    mp = ROOT / 'assets/manifest.json'
    manifest = json.loads(mp.read_text())
    recipes = []
    gallery = Image.new('RGB', (768, 350), '#20363e')
    pen = ImageDraw.Draw(gallery)
    for i, name in enumerate(NAMES):
        box = (i % 4 * atlas.width // 4 + 3, i // 4 * atlas.height // 3 + 3,
               (i % 4 + 1) * atlas.width // 4 - 3, (i // 4 + 1) * atlas.height // 3 - 3)
        im = atlas.crop(box).resize((256, 256), Image.Resampling.LANCZOS)
        out = Image.new('RGBA', (258, 258))
        out.paste(im, (1, 1))
        key = 'buildings/alex-' + name
        out.save(ROOT / ('assets/' + key + '.webp'), 'WEBP', quality=90, method=6)
        manifest[key] = dict(w=258, h=258, anchor=[1, 257], units=3,
                             **{'for': 'Alexanderplatz custom projected architecture/surfaces: ' + name})
        recipes.append(dict(key=key, source='material-atlas.png', crop=box, output=[258, 258]))
        gallery.paste(im.resize((64, 64)), (i % 6 * 128 + 8, i // 6 * 120 + 8))
        pen.text((i % 6 * 128 + 8, i // 6 * 120 + 78), name, fill='white')
    for i, name in enumerate(['fernsehturm', 'weltzeit', 'neptun']):
        box = (i * sheet.width // 3, 0, (i+1) * sheet.width // 3, sheet.height)
        im = sheet.crop(box)
        bbox = im.getbbox()
        im = im.crop(bbox)
        im.thumbnail([(384, 2048), (384, 512), (288, 384)][i], Image.Resampling.LANCZOS)
        out = Image.new('RGBA', (im.width+2, im.height+2))
        out.paste(im, (1, 1))
        key = 'buildings/alex-' + name
        out.save(ROOT / ('assets/' + key + '.webp'), 'WEBP', quality=90, method=6)
        manifest[key] = dict(w=out.width, h=out.height, anchor=[out.width//2, out.height-1], units=3, **{'for':'Alexanderplatz upright '+name})
        recipes.append(dict(key=key, source='landmark-sheet.png', crop=box, alphaBounds=bbox, output=list(out.size)))
        preview=out.copy(); preview.thumbnail((64,64))
        gallery.paste(preview,(i*128+8,248),preview)
        pen.text((i*128+8,320),name,fill='white')
    mp.write_text(json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False) + '\n')
    (RAW / 'cuts.json').write_text(json.dumps(recipes, indent=2) + '\n')
    gallery.save(RAW / 'game-size.png')
    print(json.dumps(dict(assets=len(recipes), decodedBytes=sum(manifest[r['key']]['w']*manifest[r['key']]['h']*4 for r in recipes))))

if __name__ == '__main__':
    build()
