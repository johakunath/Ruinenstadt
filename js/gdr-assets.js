// Pioneer identity on existing Zuckerbaecker geometry; the whole-building A/B method is still a proof.
// Shared decoded images only: no per-frame canvases, random calls or collision changes.
function drawGdrDecorations(b){if(!D.gdr||!b.gdrDecor)return false;
  const keys=['buildings/gdr-banner-blue','buildings/gdr-banner-red','buildings/gdr-mural-pioneer'],imgs=keys.map(spr);if(imgs.some(i=>!i))return false;
  const H=bHs(b),[ux,uy,vx,vy]=bAx(),bh=Math.min(100,H*.62),mw=Math.min(72,b.w*.23),mh=mw*SPRITES[keys[2]].h/SPRITES[keys[2]].w;
  if(H<60||b.w<120||b.h<45)return false;
  const face=(image,key,offset,z,h,east=false)=>{const m=SPRITES[key],w=h*m.w/m.h,q=east?P3(b.x+b.w,b.y+b.h-offset,z):P3(b.x+offset,b.y+b.h,z);ctx.save();ctx.transform(east?-vx:ux,east?-vy:uy,0,1,q[0],q[1]);ctx.drawImage(image,0,0,w,h);ctx.restore();};
  const bw=bh*SPRITES[keys[0]].w/SPRITES[keys[0]].h,bx=Math.max(8,Math.min(b.w-bw-8,b.gdrDecor.x));
  face(imgs[0],keys[0],bx,H-14,bh);
  const ew=bh*SPRITES[keys[1]].w/SPRITES[keys[1]].h;if(b.h>ew+16)face(imgs[1],keys[1],(b.h-ew)/2,H-14,bh,true);
  // Mural stays on a separate blank pier where there is room beside the banner.
  const mx=bx>b.w/2?12:b.w-mw-12;if(Math.abs(mx-bx)>Math.max(mw,bw)+8)face(imgs[2],keys[2],mx,Math.min(H-18,mh+22),mh);
  return true;}
