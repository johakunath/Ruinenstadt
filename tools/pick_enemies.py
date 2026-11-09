#!/usr/bin/env python3
"""Write explicit task01 picks from the selected portrait/canvas-derived sheets.

Same scale for all six poses of a design; shorter lunges/recoils are not
stretched back upright. Feet centres use the lowest solid sole strip, excluding
rat tails and crow wings. Source anchors/pivots are committed in picks.json.
Run without arguments, then tools/sprites.py. Crop/anchor decisions are checked
visually on the in-game proof sheets; they do not change collision radii.
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'assets/raw/codex/01-enemies'
HEIGHT={'brute':52,'spitter':40,'howl':44,'raser':36,'shield':44,'bomb':40,'kabel':35,'bass':56,'uhr':44,'wurz':55,'kern':42,'brigadeghoul':36.5,'schrottkoloss':83}
POSES=['idle','walk-a','walk-b','attack-a','attack-b','hit']
# Explicit authored mouths, cell-local coordinates, following the selected poses.
MOUTH={'spitter':[[335,101],[333,101],[330,103],[284,75],[443,123],[203,73]],
       'kern':[[318,128],[365,180],[365,100],[365,150],[405,150],[345,155]]}
# Crow anchors at torso rather than changing with wing tips; runtime sets flight height.
CROW=[[270,275],[270,275],[270,275],[270,255],[260,245],[270,275]]

def cell(im,i):
    x=(i%3)*512;y=(i//3)*512
    return im.crop((x,y,x+512,y+512)),x,y


def run():
    picks={}
    for key in [*HEIGHT,'rat','crow']:
        im=Image.open(RAW/(key+'.png')).convert('RGBA');cells=[]
        assert im.size==(1536,1024),(key,im.size)
        for i in range(6):
            pic,x,y=cell(im,i);a=np.asarray(pic)[:,:,3];ys,xs=np.nonzero(a>128)
            if len(xs)<30:raise ValueError(f'{key} frame{i}: empty')
            box=(int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1))
            cells.append((pic,x,y,a,box))
        idle=cells[0][4]
        scale=(13.5/(idle[2]-idle[0]) if key=='rat' else 16/(idle[2]-idle[0]) if key=='crow' else HEIGHT[key]/(idle[3]-idle[1]))
        for i,(pic,x,y,a,box) in enumerate(cells):
            # Frame dimensions use the same alpha threshold as the normalizer.
            ys,xs=np.nonzero(a>16);height=int(ys.max()-ys.min()+1)
            if key=='crow':anchor=CROW[i]
            else:
                b=box[3]-1;depth=max(8,round((box[3]-box[1])*.14));strip=a[max(0,b-depth):b+1,:]>128;sole=np.nonzero(strip.any(0))[0]
                anchor=[round(float((sole.min()+sole.max())/2),2),b]
            spec={'source':key+'.png','crop':[x,y,x+512,y+512],'alpha_threshold':16,
                  'height':round(height*scale,6),'anchor':[x+anchor[0],y+anchor[1]],'for':'drawEnemy '+key+' '+POSES[i]}
            if key in MOUTH:spec['pivots']={'mouth':[x+MOUTH[key][i][0],y+MOUTH[key][i][1]]}
            picks['enemies/'+key+'-'+POSES[i]]=spec
    im=Image.open(RAW/'shield-panel.png').convert('RGBA')
    a=np.asarray(im)[:,:,3];ys,xs=np.nonzero(a>128);bottom=int(ys.max());left=int(xs.min());right=int(xs.max())
    picks['enemies/shield-panel']={'source':'shield-panel.png','height':30,'alpha_threshold':16,
                                  'anchor':[(left+right)/2,(int(ys.min())+bottom)/2], 'for':'drawEnemy shield directional panel'}
    (RAW/'picks.json').write_text(json.dumps(picks,indent=2,sort_keys=True)+'\n')
    print('Selected',len(picks),'enemy parts/frames.')

if __name__=='__main__':run()
