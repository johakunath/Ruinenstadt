// Weathered Pioneer paintings on existing Zuckerbaecker faces. Geometry remains in P3.
// Three shared repeating face textures; no per-building or per-frame canvas allocations.
const GDRKIT_KEYS=['buildings/gdr-facade-south','buildings/gdr-facade-east','buildings/gdr-roof','buildings/gdr-ivy','buildings/gdr-plaster'];
let GDRKIT=null;
function gdrAssetStats(){return{decodedBytes:[...GDRKIT_KEYS,...GDRDECOR_KEYS].reduce((n,k)=>n+(SPRITES[k]?SPRITES[k].w*SPRITES[k].h*4:0),0),canvasBytes:GDRKIT?GDRKIT.faces.reduce((n,f)=>n+f.c.width*f.c.height*4,0):0};}
function gdrKit(){if(GDRKIT)return GDRKIT;const images=GDRKIT_KEYS.map(spr);if(images.some(i=>!i))return null;
  const faces=images.slice(0,3).map((i,n)=>{const m=SPRITES[GDRKIT_KEYS[n]],c=cnv(m.w-2,m.h-2);c.getContext('2d').drawImage(i,1,1,m.w-2,m.h-2,0,0,m.w-2,m.h-2);const p=ctx.createPattern(c,'repeat');p.setTransform(new DOMMatrix().scale(1/m.units));return{p,c};});
  return GDRKIT={faces,images};}
function drawGdrBuilding(b){if(!D.gdr||!b.gdrKit||b.gable||bR0(b)!==0||b.lights.length||b.w<48||b.h<45||bHs(b)<60)return false;const kit=gdrKit();if(!kit)return false;
  const{x,y,w,h}=b,H=bHs(b),[ux,uy,vx,vy]=bAx(),paint=(east)=>{const q=east?P3(x+w,y+h,H):P3(x,y+h,H);ctx.save();ctx.transform(east?-vx:ux,east?-vy:uy,0,H/160,q[0],q[1]);ctx.fillStyle=kit.faces[east?1:0].p;ctx.fillRect(0,0,east?h:w,160);ctx.restore();};
  if(!b.gdrNoShadow)faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.25)');paint(false);paint(true);
  const q=P3(x,y,H);ctx.save();ctx.transform(ux,uy,vx,vy,q[0],q[1]);ctx.fillStyle=kit.faces[2].p;ctx.fillRect(0,0,w,h);ctx.restore();
  // Overlays stay inside authored faces, including at supported box rotations.
  const overlay=(n,offset,z,ow,oh)=>{const p=P3(x+offset,y+h,z);ctx.save();ctx.transform(ux,uy,0,1,p[0],p[1]);ctx.drawImage(kit.images[n],0,0,SPRITES[GDRKIT_KEYS[n]].w,SPRITES[GDRKIT_KEYS[n]].h,0,0,ow,oh);ctx.restore();};
  overlay(3,Math.min(w-32,w*.44),H-2,30,Math.min(118,H-4));overlay(4,Math.max(0,w-48),H-8,48,Math.min(48,H-10));
  faceS(x,y,w,h,0,H,0,INK);faceE(x,y,w,h,0,H,0,INK);faceT(x,y,w,h,H,0,INK);drawGdrDecorations(b);return true;}
// Decorate painted and legacy blocks. A failed image leaves their underlying building art intact.
const GDRDECOR_KEYS=['buildings/gdr-banner-blue','buildings/gdr-banner-red','buildings/gdr-mural-pioneer'];
function drawGdrDecorations(b){if(!D.gdr||!b.gdrDecor||b.gable||bR0(b)!==0||b.lights.length||b.w<120||b.h<45||bHs(b)<60)return false;
  const keys=GDRDECOR_KEYS,imgs=keys.map(spr);if(imgs.some(i=>!i))return false;
  const H=bHs(b),[ux,uy,vx,vy]=bAx();
  const bh=Math.min(100,H*.62);
  const face=(image,key,offset,z,h,east=false)=>{const m=SPRITES[key],w=h*m.w/m.h,q=east?P3(b.x+b.w,b.y+b.h-offset,z):P3(b.x+offset,b.y+b.h,z);ctx.save();ctx.transform(east?-vx:ux,east?-vy:uy,0,1,q[0],q[1]);ctx.drawImage(image,0,0,w,h);ctx.restore();};
  const bw=bh*SPRITES[keys[0]].w/SPRITES[keys[0]].h,bx=12;
  face(imgs[0],keys[0],bx,H-12,bh);
  const ew=bh*SPRITES[keys[1]].w/SPRITES[keys[1]].h;if(b.h>ew+16)face(imgs[1],keys[1],(b.h-ew)/2,H-12,bh,true);
  const mw=Math.min(64,b.w*.2),mh=mw*SPRITES[keys[2]].h/SPRITES[keys[2]].w,mx=b.w-mw-12;
  // A ground-floor painted wall panel, separate from the hanging banner. Zucker has no light emitters.
  if(mx>bx+bw+8&&mh<H-8)face(imgs[2],keys[2],mx,mh+4,mh);
  return true;}
