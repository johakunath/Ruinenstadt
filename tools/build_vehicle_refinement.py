"""Normalize only the user-requested replacement vehicle faces; preserve original art."""
import json
from pathlib import Path
from PIL import Image
import numpy as np
R=Path(__file__).resolve().parents[1];RAW=R/'assets/raw/codex/03-vehicles/refinement'
FACES=['side','end','top','glass-side','glass-end','roof']
# Source pieces have unequal widths: use inspected gutters, never split equal cells.
BOXES={
 'trabi':[(0,0,620,443),(620,0,1180,443),(1180,0,1774,443),(0,443,620,887),(620,443,1180,887),(1180,443,1774,887)],
 'barkas':[(0,0,690,443),(690,0,1147,443),(1147,0,1774,443),(0,443,690,887),(690,443,1147,887),(1147,443,1774,887)],
 'burnt':[(0,0,640,443),(640,0,1162,443),(1162,0,1774,443),(0,443,640,887),(640,443,1167,887),(1167,443,1774,887)]}

def write(p,o):p.write_text(json.dumps(o,indent=2,sort_keys=True,ensure_ascii=False)+'\n',encoding='utf8')
def main():
 m=json.loads((R/'assets/manifest.json').read_text(encoding='utf8'));recipe={}
 specs=[('trabi','trabi-cream',[(79,15),(44,15),(79,44),(41,12),(38,12),(33,34)]),('barkas','van-blue',[(106,36),(44,36),(106,44),(91,12),(44,12),(75,32)]),('burnt','car-burnt',[(96,12),(44,12),(96,44),(48,7),(38,7),(36,32)])]
 for src,prefix,sizes in specs:
  im=Image.open(RAW/(src+'-atlas.png')).convert('RGBA');parts=[]
  for n in range(6):
   box=BOXES[src][n]
   crop=im.crop(box);a=crop.getchannel('A');bbox=a.point(lambda v:255 if v>12 else 0).getbbox()
   if not bbox:raise ValueError('empty face '+src+str(n))
   parts.append(crop.crop(bbox))
  if src=='trabi':
   # Bonnet is already on the top plane; fit the lamp/grille belt without squashing round lamps.
   parts[1]=im.crop((640,167,1134,350))
  if src=='barkas':
   # One full-height windowed minibus body; front combines windscreen above grille/headlamps.
   front=Image.new('RGBA',(264,216));front.alpha_composite(parts[4].resize((264,104),Image.Resampling.LANCZOS),(0,0));front.alpha_composite(parts[1].resize((264,112),Image.Resampling.LANCZOS),(0,104));parts[1]=front
  for face,part,(w,h) in zip(FACES,parts,sizes):
   crop=part.resize((round(w*3),round(h*3)),Image.Resampling.LANCZOS)
   out=Image.new('RGBA',(crop.width+2,crop.height+2));out.alpha_composite(crop,(1,1));key='vehicles/'+prefix+'-'+face
   out.save(R/'assets'/(key+'.webp'),'WEBP',quality=90,method=6,exact=True)
   m[key]={'w':out.width,'h':out.height,'units':3,'anchor':[out.width/2,out.height/2],'for':'rounded '+prefix+' '+face}
   recipe[key]={'source':src+'-atlas.png','crop':BOXES[src][FACES.index(face)],'units':[w,h]}
 # Retire unused turquoise/red Trabi and obsolete red sedan keys; retain raw source studies.
 for key in list(m):
  if key.startswith(('vehicles/trabi-turquoise-','vehicles/trabi-red-','vehicles/car-red-')):
   (R/'assets'/(key+'.webp')).unlink(missing_ok=True);del m[key]
 for key in [k for k in m if k.startswith('vehicles/van-blue-')]:
  src=Image.open(R/'assets'/(key+'.webp')).convert('RGBA');a=np.array(src);rgb=a[:,:,:3].astype(float);mask=(rgb[:,:,2]-rgb[:,:,0]>5)&(rgb[:,:,1]-rgb[:,:,0]>3)&(a[:,:,3]>0);lum=rgb.mean(axis=2);target=np.array([225,200,153.]);col=target[None,None,:]*lum[:,:,None]/target.mean();a[:,:,:3][mask]=np.clip(col[mask],0,255).astype('uint8');dest=key.replace('van-blue-','van-cream-');Image.fromarray(a).save(R/'assets'/(dest+'.webp'),'WEBP',quality=90,method=6,exact=True);m[dest]={**m[key],'for':m[key]['for'].replace('van-blue','van-cream')}
 write(R/'assets/manifest.json',m);write(RAW/'picks.json',recipe)
 print('Normalized 18 replacement faces; total vehicle textures:',sum(k.startswith('vehicles/') for k in m))
if __name__=='__main__':main()
