#!/usr/bin/env python3
"""Build player rig v2 from selected component sheets, without anatomy inference.

Run without arguments; --check checks the committed files without rebuilding.
Source rectangles and shared placements are explicit in the recipe below. All
clothes dress one opaque mannequin and share its shoulder, elbow, wrist and hip.
Weapon grip/tip coordinates are authored in the task's weapons.json. Generated
parts use 6 px/local unit (the existing player rig resolution); world sprites
continue to use 3. No arm-hole detection, PCA or per-outfit shoulder shifts.
"""
import argparse
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'assets/raw/codex/07-player-rig-v2'
OUT = ROOT / 'assets/hero/rig'
RS = 6
WEAP = 'I01 I02 I03 I04 I05 I06 I07 I08 I09 I10 I11 I12 I13 I14 I15 I16 I32 I48 I51 I52 I53 I56 I59 I60 I61 I62'.split()

# Every rectangle is in source-sheet pixels. The placement [x,y,w,h] is in
# shared rig coordinates, or relative to the named joint for articulated parts.
BASE = {
 'body': ('mannequin.png', [748,350,976,785], [-7,-41.5,14.5,27]),
 'upper': ('mannequin.png', [1060,185,1175,435], [-2.6,-1.2,5.2,12.5]),
 'lower': ('mannequin.png', [1070,475,1145,677], [-2.2,-1.2,4.4,12]),
 'leg': ('mannequin.png', [1250,100,1415,725], [-2.6,-1,7.2,17]),
 'head': ('mannequin.png', [740,90,990,310], [-4.6,-48,10.6,9.7]),
 'palm': ('mannequin.png', [1075,800,1180,955], [-2.9,-2.5,3.3,5]),
 'fingers': ('mannequin.png', [1195,800,1278,955], [-.3,-2.2,2.5,4.4]),
 'trousers': ('boots-trousers.png', [170,520,370,990], [-2.8,-1.1,5.8,16]),
 'trousers-blaumann': ('boots-trousers.png', [1190,520,1370,990], [-2.8,-1.1,5.8,16]),
}
# garment source, column, hem, width; shared y/centre and identical limb lengths
CLOTHES = {
 'leder': ('outfits-a.png',0,25,22), 'mantel': ('outfits-a.png',1,34,23), 'weste': ('outfits-a.png',2,25,22),
 'feuer': ('outfits-b.png',0,34,23), 'bvg': ('outfits-b.png',1,34,23), 'spaeti': ('outfits-b.png',2,34,23),
 'panzer': ('outfits-c.png',0,33,23), 'rattenmantel': ('outfits-c.png',1,35,25), 'ritter': ('outfits-c.png',2,33,23),
 'khemd': ('outfits-d.png',0,34,23), 'poncho': ('outfits-d.png',1,35,26), 'kmantel': ('outfits-d.png',2,35,25),
 'none': ('outfits-e.png',0,34,23), 'blaumann': ('outfits-e.png',1,30,21),
}
HATS = {
 'helm': ([40,50,490,420], [-5.8,-50.4,13.3,7]),
 'schieber': ([535,50,1000,420], [-6,-49.2,13.6,5.4]),
 'muetze': ([1040,50,1500,420], [-5.3,-50.3,11.4,7.3]),
 'maske': ([40,530,490,950], [-5.5,-47.5,13,10.4]),
 'nbrille': ([535,530,1000,950], [-5.7,-45.8,12.4,4]),
 'stroh': ([1015,520,1515,950], [-7,-50.2,16,8]),
}
GLOVES = ['handsch','bandage','schweiss','gartenh']
BOOTS = {
 'turnsch': ([150,160,390,410], [-3,-3.6,8,3.8]),
 'stiefel': ([650,160,890,410], [-3,-5.6,8,5.8]),
 'gummi': ([1160,60,1390,420], [-3,-9.6,8,9.8]),
}


def write_json(path, obj):
    path.write_text(json.dumps(obj, indent=2, sort_keys=True, ensure_ascii=False) + '\n', encoding='utf8')


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((ROOT/'assets/manifest.json').read_text(encoding='utf8'))
    for k in list(manifest):
        if k.startswith('hero/rig/'): del manifest[k]
    R = {'v':2,'parts':{},'outfits':{},'hats':{},'gloves':{},'boots':{},
         'sh':[-.87,-37.33], 'hip':-16, 'upper':10, 'lower':10, 'hand':20}

    def save(name, im, rect, dark=False, pivots=None):
        im = im.resize((max(1,round(rect[2]*RS)), max(1,round(rect[3]*RS))), Image.Resampling.LANCZOS)
        # Generations encode fully opaque colour as alpha 253/254; remove only
        # near-invisible guide noise and restore opaque interiors, preserving edges.
        a = np.array(im); a[:,:,3][a[:,:,3]<8]=0; a[:,:,3][a[:,:,3]>245]=255; im=Image.fromarray(a)
        im.save(OUT/(name+'.webp'),'WEBP',quality=88,method=6,exact=True)
        R['parts'][name]=rect
        m={'w':im.width,'h':im.height,'anchor':[im.width/2,im.height/2],
           'units':RS,'for':'drawHero '+name}
        if pivots: m['pivots']=pivots
        manifest['hero/rig/'+name]=m
        if dark:
            d=ImageEnhance.Brightness(im.convert('RGB')).enhance(.58).convert('RGBA'); d.putalpha(im.getchannel('A'))
            save(name+'-d',d,rect)

    def cut(source, crop):
        im=Image.open(RAW/source).convert('RGBA').crop(crop)
        box=im.getchannel('A').point(lambda a:255 if a>40 else 0).getbbox()
        if not box: raise ValueError(f'empty source: {source} {crop}')
        return im.crop(box)

    for name,(src,crop,rect) in BASE.items(): save(name,cut(src,crop),rect,dark=name in ['upper','lower','leg','trousers','trousers-blaumann'])
    for key,(src,col,height,width) in CLOTHES.items():
        x=col*512
        # The Blaumann shares a column with a separately drawn trouser guide.
        uc=[x+35,615,x+240,1010] if src=='outfits-e.png' and col else [x+30,610,x+255,1010]
        lc=[x+175,660,x+285,970] if src=='outfits-e.png' and col else [x+265,610,x+475,1010]
        for suffix,crop,rect in [('t',[x+30,5,x+485,605],[-width*.48,-43,width,height]),
                                 ('u',uc,[-2.9,-1.4,5.8,12.8]),('l',lc,[-2.5,-1.4,5,12.4])]:
            name=suffix+'-'+key; save(name,cut(src,crop),rect,dark=suffix in ['u','l'])
        R['outfits'][key]={'t':'t-'+key,'u':'u-'+key,'l':'l-'+key,
                             'leg':'trousers-blaumann' if key=='blaumann' else 'trousers'}
    for k,(crop,rect) in HATS.items():
        name='hat-'+k; save(name,cut('hats.png',crop),rect); R['hats'][k]=name
    for i,k in enumerate(GLOVES):
        for piece,y0,y1,rect in [('palm',10,540,[-3.1,-2.5,3.7,5.3]),('fingers',550,1015,[-.3,-2.2,2.8,4.5])]:
            name='g-'+k+'-'+piece; save(name,cut('gloves.png',[i*384+5,y0,(i+1)*384-5,y1]),rect); R['gloves'].setdefault(k,{})[piece]=name
    for k,(crop,rect) in BOOTS.items():
        name='boot-'+k; save(name,cut('boots-trousers.png',crop),rect,dark=True); R['boots'][k]=name
    W={}
    for key,spec in json.loads((RAW/'weapons.json').read_text(encoding='utf8')).items():
        im=Image.open(ROOT/spec['source']).convert('RGBA'); g=spec['pivots']['grip']; t=spec['pivots']['tip']; dx,dy=t[0]-g[0],t[1]-g[1]
        name='weapon-'+key.lower(); save(name,im,[0,0,im.width/RS,im.height/RS],pivots=spec['pivots'])
        W[key]=[round(math.atan2(dy,dx),6),*g,round(math.hypot(dx,dy),6)]
    write_json(ROOT/'assets/manifest.json',manifest)
    (ROOT/'js/hero.js').write_text('// Generated by tools/build_hero.py. Shared mannequin, explicit layer placements and weapon pivots.\nconst HR='+json.dumps(R,separators=(',',':'))+';\nconst HW='+json.dumps(W,separators=(',',':'))+';\n', encoding='utf8')
    print(f'Built {len(R["outfits"])} outfits, {len(R["parts"])} parts, {len(W)} weapons.')


def check():
    import sprites
    errors=sprites.check(json.loads((ROOT/'assets/manifest.json').read_text(encoding='utf8')))
    if errors: raise ValueError('\n'.join(errors))
    print('Rig and sprite manifest checked.')


def build_animation():
    """Derive only knee layers from the committed rig, preserving all old bytes."""
    path=ROOT/'js/hero.js'
    text=path.read_text(encoding='utf8')
    R=json.loads(text.split('const HR=')[1].split(';\n')[0])
    manifest=json.loads((ROOT/'assets/manifest.json').read_text(encoding='utf8'))
    R.update(v=3,thigh=8,shin=8,knee=8,overlap=4)
    for name in ['leg','trousers','trousers-blaumann']:
        for dark in ['', '-d']:
            key=name+dark; rect=R['parts'][key]
            im=Image.open(OUT/(key+'.webp')).convert('RGBA')
            line=round((R['knee']-rect[1])*RS)
            for segment,top,bottom,joint in [('thigh',0,line+2,0),('shin',line-2,im.height,R['knee'])]:
                part=im.crop((0,top,im.width,bottom)); dest=name+'-'+segment+dark
                part.save(OUT/(dest+'.webp'),'WEBP',lossless=True,method=6,exact=True)
                R['parts'][dest]=[rect[0],rect[1]+top/RS-joint,rect[2],part.height/RS]
                manifest['hero/rig/'+dest]={'w':part.width,'h':part.height,'anchor':[-rect[0]*RS,(joint-rect[1])*RS-top],
                    'units':RS,'for':'drawHero '+segment,'pivots':{'knee':[-rect[0]*RS,(R['knee']-rect[1])*RS-top]}}
    for outfit in R['outfits'].values():
        outfit.update(thigh=outfit['leg']+'-thigh',shin=outfit['leg']+'-shin',knee=R['knee'])
    write_json(ROOT/'assets/manifest.json',manifest)
    path.write_text(text.split('const HR=')[0]+'const HR='+json.dumps(R,separators=(',',':'))+';\nconst HW='+text.split('const HW=')[1], encoding='utf8')
    print('Derived 12 knee layers, preserving all pre-existing rig image bytes.')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__); parser.add_argument('--check',action='store_true'); parser.add_argument('--animation-only',action='store_true'); args=parser.parse_args()
    if not args.check:
        if not args.animation_only: build()
        build_animation()
    check()
