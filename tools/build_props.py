"""Build only task05 picks, preserving every unrelated normalized asset."""
import json
from pathlib import Path
from PIL import Image, ImageDraw
from tools.sprites import normalise, ROOT

RAW=ROOT/'assets/raw/codex/05-props'

def write_json(path,data):
    path.write_text(json.dumps(data,indent=2,sort_keys=True,ensure_ascii=False,allow_nan=False)+'\n',encoding='utf8')
def build():
    im=Image.open(RAW/'bodies.png').convert('RGBA')
    names=['crate','chest','bin','barrel','campfire','lamp','bench','litfass','sandbags']
    heights=[29,28,34,23,16,94,26,100,40]
    picks={}
    for n,(name,height) in enumerate(zip(names,heights)):
        col,row=n%3,n//3
        crop=[round(col*im.width/3),round(row*im.height/3),round((col+1)*im.width/3),round((row+1)*im.height/3)]
        picks['props/'+name]={'source':'bodies.png','crop':crop,'height':height,'alpha_threshold':8,'for':{'crate':'drawProp crate','chest':'drawProp chest','bin':'drawProp bin','barrel':'drawBarrel static body','campfire':'drawBarrel camp static body','lamp':'drawBB lamp','bench':'drawBB bench','litfass':'drawBB shrine','sandbags':'paintedSandbags'}[name]}
    # Fixed source cells keep authored flame poses; assembled into one shared horizontal sheet.
    fx=Image.open(RAW/'fire-fence.png').convert('RGBA')
    frames=[]
    for n in range(8):
        col,row=n%4,n//4
        frame=fx.crop((round(col*fx.width/4),round(row*fx.height/3),round((col+1)*fx.width/4),round((row+1)*fx.height/3)))
        box=frame.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
        frame=frame.crop(box);frame.thumbnail((92,116),Image.Resampling.LANCZOS)
        cell=Image.new('RGBA',(96,120));cell.alpha_composite(frame,((96-frame.width)//2,119-frame.height));frames.append(cell)
    sheet=Image.new('RGBA',(768,120))
    for n,frame in enumerate(frames):sheet.alpha_composite(frame,(n*96,0))
    sheet.save(RAW/'flames.png')
    # Normalise the already assembled sheet at its exact 3 px/unit dimensions.
    picks['props/fence']={'source':'fire-fence.png','crop':[0,round(fx.height*2/3),fx.width,fx.height],'height':20,'alpha_threshold':8,'for':'drawFence projected shared face'}
    write_json(RAW/'picks.json',picks)
    manifest=json.loads((ROOT/'assets/manifest.json').read_text(encoding='utf8'))
    for key,spec in picks.items():
        out,entry=normalise(key,spec,RAW/'picks.json');path=ROOT/'assets'/(key+'.webp');path.parent.mkdir(parents=True,exist_ok=True);out.save(path,'WEBP',quality=88,method=6);manifest[key]=entry
    sheet.save(ROOT/'assets/props/flames.webp','WEBP',quality=88,method=6)
    manifest['props/flames']={'w':768,'h':120,'units':3,'anchor':[48,119],'for':'paintedFire eight 96x120 source cells'}
    write_json(ROOT/'assets/manifest.json',manifest)
    proof=Image.new('RGB',(800,480),'#20363e');d=ImageDraw.Draw(proof)
    for n,name in enumerate(names):
        img=Image.open(ROOT/'assets/props'/f'{name}.webp').convert('RGBA');img.thumbnail((130,128));x=15+(n%5)*158;y=20+(n//5)*220;proof.paste(img,(x+(130-img.width)//2,y),img);d.text((x,y+130),name,fill='white');small=img.copy();small.thumbnail((64,64));proof.paste(small,(x,y+150),small)
    proof.save(RAW/'comparison.png')
    print(json.dumps({'count':11,'decodedBytes':sum(v['w']*v['h']*4 for k,v in manifest.items() if k.startswith('props/')),'maxFileBytes':max(p.stat().st_size for p in (ROOT/'assets/props').glob('*.webp'))}))
if __name__=='__main__':build()
