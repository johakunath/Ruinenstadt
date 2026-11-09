#!/usr/bin/env python3
"""Build the painted player rig from the cut parts in assets/hero/ (see docs/chatgpt-assets.md, H02 to H07).

Rig space = pixels of the H02a full figure (441 px from head to sole), origin at the feet centre, x forward (facing right).
Every outfit torso is placed by its arm hole (the dark opening ChatGPT leaves where the arm attaches): the arm hole
centre goes onto the shoulder pivot, so the swinging arm always covers it. Short jackets pull the hip up, legs are
stretched down to the floor. Hat heads are fitted onto the base head by the face. Fine tuning per outfit: TUNE.
Output: assets/hero/rig/*.webp (RS px per game unit) and js/hero.js (HR table, read by drawPlayer in js/art.js).
Run: python3 tools/build_hero.py [--preview out.png]
"""
import os, sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERO = os.path.join(ROOT, 'assets', 'hero'); OUT = os.path.join(HERO, 'rig')
FIG = 441.0; UNITS = 48.0; RS = 6  # figure height in rig px, in game units, rig image px per unit
U = UNITS / FIG                     # game units per rig px
# base layout of H02a parts inside the full figure (x, y, w, h), found by fitting the parts onto H02a-H01
BASE = {'head': (40, 1, 82, 70), 'torso': (7, 51, 137, 267), 'arm': (50, 82, 48, 195), 'leg': (58, 295, 48, 143)}
OX, OY = 82, 441                    # feet centre in figure px
SH = (74, 98)                       # shoulder pivot
HIP = 300                           # default hip height (leg pivot)
ARMS = {  # item base -> (torso cell, arm cell)
 'leder': ('H03-K01', 'H03-K02'), 'mantel': ('H03-K03', 'H03-K04'), 'weste': ('H03-K05', 'H03-K06'),
 'feuer': ('H04-K07', 'H04-K08'), 'bvg': ('H04-K09', 'H04-K10'), 'spaeti': ('H04-K11', 'H04-K12'),
 'panzer': ('H05-K13', 'H05-K14'), 'rattenmantel': ('H05-K15', 'H05-K16'), 'ritter': ('H05-K17', 'H05-K18'),
 'khemd': ('H06-K19', 'H06-K20'), 'poncho': ('H06-K21', 'H06-K22'), 'kmantel': ('H06-K23', 'H06-K24')}
HATS = {'helm': 'H07-K25', 'schieber': 'H07-K26', 'muetze': 'H07-K27', 'maske': 'H07-K28', 'nbrille': 'H07-K29'}
# per outfit: ts torso scale, tx/ty torso shift, as arm scale, ax/ay arm shift (figure px)
TUNE = {}

def load(n):
    im = Image.open(os.path.join(HERO, n + '.webp')).convert('RGBA')
    return im.crop(im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox())

# arm hole centres read off a grid (torso image px after trimming); refine() snaps to the dark blob around them
HOLE = {'leder': (52, 85), 'mantel': (60, 70), 'weste': (67, 88), 'feuer': (45, 80), 'bvg': (47, 75), 'spaeti': (40, 78),
        'panzer': (34, 75), 'rattenmantel': (47, 68), 'ritter': (35, 70), 'khemd': (75, 72), 'poncho': (87, 60), 'kmantel': (52, 72)}

def refine(t, gx, gy, r=22):
    """Centre of the dark or see-through blob around a guessed arm hole centre; the guess if nothing fits."""
    a = np.asarray(t).astype(np.float32); al = a[..., 3]
    lum = np.asarray(Image.fromarray(a[..., :3].mean(2).astype(np.uint8)).filter(ImageFilter.BoxBlur(3))).astype(np.float32)
    m = (al < 60) | (lum < 52); img = Image.fromarray((m * 255).astype(np.uint8)).copy()  # copy: floodfill on a fromarray view is not seen by asarray
    best = None
    for y in range(int(gy - r), int(gy + r), 2):
        for x in range(int(gx - r), int(gx + r), 2):
            if not (0 <= x < t.width and 0 <= y < t.height) or img.getpixel((x, y)) != 255: continue
            ImageDraw.floodfill(img, (x, y), 100); b = np.argwhere(np.asarray(img) == 100); ImageDraw.floodfill(img, (x, y), 50)
            (y0, x0), (y1, x1) = b.min(0), b.max(0)
            if 300 < len(b) and x0 > 0 and x1 < t.width - 1 and y1 - y0 < 140 and x1 - x0 < 90 and (best is None or len(b) > best[0]):
                best = (len(b), (x0 + x1) / 2, (y0 + y1) / 2)
    return (best[1], best[2]) if best else (gx, gy)

def body_x(T):
    """Horizontal centre of the torso's lower 40% (the coat body; the scarf ends hang higher and further left)."""
    a = np.asarray(T)[int(T.height * .6):, :, 3] > 100; xs = np.nonzero(a.any(0))[0]; return (xs.min() + xs.max()) / 2

def sc(P, f, fy=None):
    return P.resize((max(1, round(P.width * f)), max(1, round(P.height * (fy or f)))), Image.LANCZOS)

def fit_head(hat, base):
    """Scale and offset that put the hat head's face onto the base head (masked SSD on the lower half of the base head)."""
    def arr(im): a = np.asarray(im).astype(np.float32) / 255; return a[..., :3].mean(2) * a[..., 3], a[..., 3]
    def corr(A, B):
        H, W = A.shape; h, w = B.shape; s = (H + h, W + w)
        return np.fft.irfft2(np.fft.rfft2(A, s) * np.conj(np.fft.rfft2(B, s)), s)[:H - h + 1, :W - w + 1]
    face = base.crop((base.width // 3, base.height // 3, base.width, base.height)); p, m = arr(face); m = (m > .5).astype(np.float32)
    best = None
    for f in np.arange(.85, 1.35, .02):
        H = sc(hat, base.width * f / hat.width); I, _ = arr(H)
        if I.shape[0] < p.shape[0] or I.shape[1] < p.shape[1]: continue
        S = ((m * p * p).sum() - 2 * corr(I, m * p) + corr(I * I, m)) / m.sum(); i = np.unravel_index(np.argmin(S), S.shape)
        if best is None or S[i] < best[0]: best = (S[i], H, i[1] - base.width // 3, i[0] - base.height // 3)
    return best[1], best[2], best[3]   # scaled hat image, its offset relative to the base head's top-left

WEAP = 'I01 I02 I03 I04 I05 I06 I07 I08 I09 I10 I11 I12 I13 I14 I15 I16 I32 I48 I51 I52 I53 I56 I59 I60 I61 I62'.split()

# per icon fixes, checked by eye on a sheet with the found grip and axis drawn in (see weapon()):
# 'flip' = the sharp end points down-left on the sheet, so the grip is the upper end; or a fixed [grip x, grip y, head x, head y] in icon px
WFIX = {'I51': 'flip', 'I56': 'flip', 'I61': 'flip', 'I62': 'flip', 'I32': 'flip', 'I10': [30, 118, 67, 15], 'I11': [65, 8, 47, 92]}

def weapon(idn):
    """Main axis of a weapon icon: angle (rad, image y down) from the grip towards the head, grip point and length in icon px.
    The sheets draw every weapon with the grip bottom left and the head top right, so the axis is turned to point up."""
    a = np.asarray(Image.open(os.path.join(ROOT, 'assets', 'icons', idn + '.webp')).convert('RGBA'))[..., 3].astype(np.float32)
    ys, xs = np.nonzero(a > 100); P = np.stack([xs, ys], 1).astype(np.float32); c = P.mean(0)
    w, v = np.linalg.eigh(np.cov((P - c).T)); u = v[:, 1]; t = (P - c) @ u
    fx = WFIX.get(idn)
    if isinstance(fx, list):
        g, h = np.array(fx[:2], np.float32), np.array(fx[2:], np.float32); v = h - g
        return [round(float(np.arctan2(v[1], v[0])), 3), float(g[0]), float(g[1]), round(float(np.hypot(*v)), 1)]
    if (u[1] > 0) != (fx == 'flip'): u, t = -u, -t              # point u up at the head, or down for 'flip'
    g = c + u * (t.min() + .08 * (t.max() - t.min()))              # grip a little inside the handle end
    return [round(float(np.arctan2(u[1], u[0])), 3), round(float(g[0]), 1), round(float(g[1]), 1), round(float(t.max() - t.min()), 1)]

def build():
    os.makedirs(OUT, exist_ok=True); R = {}
    def save(img, key, dark=False):
        img = sc(img, RS * U); img.save(os.path.join(OUT, key + '.webp'), 'WEBP', quality=88, method=6)
        if dark:  # far arm and leg: darker copy, canvas filter is not reliable on older iPads
            d = img.copy(); d.paste(ImageEnhance.Brightness(img.convert('RGB')).enhance(.58), (0, 0)); d.putalpha(img.getchannel('A'))
            d.save(os.path.join(OUT, key + '-d.webp'), 'WEBP', quality=88, method=6)
        return img
    def place(img, x, y):  # rig entry: image key with its top-left in game units relative to the feet
        return [round((x - OX) * U, 2), round((y - OY) * U, 2), round(img.width * U, 2), round(img.height * U, 2)]
    hx, hy, hw, hh = BASE['head']; head = sc(load('H02a-H02'), hw / load('H02a-H02').width)
    save(head, 'head'); R['head'] = place(head, hx, hy)
    for k, cell in HATS.items():
        H, dx, dy = fit_head(load(cell), head); save(H, 'hat-' + k); R['hat-' + k] = place(H, hx + dx, hy + dy)
    ax, ay, aw, ah = BASE['arm']; arm0 = sc(load('H02a-H04'), aw / load('H02a-H04').width)
    lx, ly, lw, lh = BASE['leg']; leg0 = sc(load('H02a-H05'), lw / load('H02a-H05').width)
    tx, ty, tw, th = BASE['torso']; tor0 = sc(load('H02a-H03'), tw / load('H02a-H03').width)
    BODYX = tx + body_x(tor0); out = {'none': (tor0, tx, ty, arm0, ax, ay, 0)}
    for k, (tc, ac) in ARMS.items():
        T, A, tu = load(tc), load(ac), TUNE.get(k, {}); hx_, hy_ = refine(T, *HOLE[k])
        f = ah / A.height * tu.get('ts', 1)                      # torso and arm share the sheet scale; the arm length fixes it
        T, A = sc(T, f), sc(A, f * tu.get('as', 1)); hx_, hy_ = hx_ * f, hy_ * f
        tX, tY = SH[0] - hx_ + tu.get('tx', 0), SH[1] - hy_ + tu.get('ty', 0)
        aX, aY = SH[0] - A.width / 2 + tu.get('ax', 0), SH[1] - A.width * .45 + tu.get('ay', 0)
        dx = BODYX - (tX + body_x(T)); tX += dx; aX += dx  # centre the body (not the scarf) over the legs; arm and pivot move along
        out[k] = (T, tX, tY, A, aX, aY, dx)
    for k, (T, tX, tY, A, aX, aY, dx) in out.items():
        save(T, 't-' + k); save(A, 'a-' + k, True)
        hip = min(HIP, tY + T.height - 26)                     # short jackets: hip moves up so the legs touch the torso
        R[k] = {'t': place(T, tX, tY), 'a': place(A, aX, aY), 'sh': [round((SH[0] + dx - OX) * U, 2), round((SH[1] - OY) * U, 2)],
                'hip': round((hip - OY) * U, 2)}
    leg = save(leg0, 'leg', True); R['leg'] = [round((lx + lw / 2 - OX) * U, 2), round(lw * U, 2), round(lh * U, 2)]
    R['hand'] = round((ah - 14) * U, 2)  # shoulder to hand distance along the arm
    W = {i: weapon(i) for i in WEAP}
    js = ('// generated by tools/build_hero.py from assets/hero (painted player rig), do not edit by hand\n'
          '// HR: rig parts in game units, feet at 0,0, facing right. HW: weapon icon axis [angle, grip x, grip y, length] in icon px\n'
          'const HR=' + json.dumps(R, separators=(',', ':')) + ';\nconst HW=' + json.dumps(W, separators=(',', ':')) + ';\n')
    open(os.path.join(ROOT, 'js', 'hero.js'), 'w').write(js)
    return R

if __name__ == '__main__':
    R = build(); print('outfits', [k for k in R if isinstance(R[k], dict)])
