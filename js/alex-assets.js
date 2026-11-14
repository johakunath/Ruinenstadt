// Painted Alexanderplatz surfaces. Original constructors, geometry and light positions remain authoritative.
const AX_NAMES='rathaus limestone bronze curtain relief greenhouse station copper plaza rail-brick water awning fernsehturm weltzeit neptun'.split(' '),AX_TEX=Object.create(null),AX_PAT=new WeakMap(),AX_LIMIT=40000000;
let ALEX_ART=true,AX_BAKING=false,AX_MAT='',AX_CACHE=new Map(),AX_BYTES=0,AX_JOB=0,AX_PROMISE=Promise.resolve();
const alexArtOn=()=>ALEX_ART&&D===DIST[2]&&!(typeof TUN!=='undefined'&&TUN);
function axPattern(g,n,units=3){if(!alexArtOn()||!AX_TEX[n])return null;let a=AX_PAT.get(g);if(!a)AX_PAT.set(g,a={});const k=n+':'+units;if(!a[k]){const p=g.createPattern(AX_TEX[n],'repeat');if(!p)return null;p.setTransform(new DOMMatrix().scale(1/units));a[k]=p;}return a[k];}
function axRect(g,n,x,y,w,h,alpha=1){const p=axPattern(g,n);if(!p)return false;g.save();g.globalAlpha*=alpha;g.fillStyle=p;g.fillRect(x,y,w,h);g.restore();return true;}
function axFace(a,b,d,w,h,n,fit=false,shade=0){const im=AX_TEX[n];if(!AX_BAKING||!im||w<=0||h<=0)return;ctx.save();ctx.transform((b[0]-a[0])/w,(b[1]-a[1])/w,(d[0]-a[0])/h,(d[1]-a[1])/h,a[0],a[1]);if(fit)ctx.drawImage(im,0,0,w,h);else{ctx.fillStyle=axPattern(ctx,n);ctx.fillRect(0,0,w,h);}if(shade){ctx.fillStyle='rgba(8,18,22,'+shade+')';ctx.fillRect(0,0,w,h);}ctx.restore();}
// Only active during scheduled baking; the unchanged live fallback uses ibox alone.
function axBox(x,y,w,h,z0,z1,c,s,top){ibox(x,y,w,h,z0,z1,c,s,top);if(!AX_BAKING)return;const n=AX_MAT,H=z1-z0;
  axFace(P3(x,y+h,z1),P3(x+w,y+h,z1),P3(x,y+h,z0),w,H,n,false,.04);axFace(P3(x+w,y+h,z1),P3(x+w,y,z1),P3(x+w,y+h,z0),h,H,n,false,.32);
  axFace(P3(x,y,z1),P3(x+w,y,z1),P3(x,y+h,z1),w,h,n==='rathaus'||n==='limestone'?'copper':n==='awning'?'awning':'rail-brick',false,.12);faceS(x,y,w,h,z0,z1,0,s);faceE(x,y,w,h,z0,z1,0,s);faceT(x,y,w,h,z1,0,s);}
function axCached(b){if(AX_BAKING||!alexArtOn())return false;const a=AX_CACHE.get(b);if(!a||a.scale!==koepScale())return false;ctx.drawImage(a.image,a.x,a.y,a.w,a.h);return true;}
function axStationWall(b){if(axCached(b))return;drawLow(b);if(AX_BAKING){AX_MAT='station';axBox(b.x,b.y,b.w,b.h,0,b.H,b.c,INK);}}
function axResetCache(){AX_JOB++;for(const a of AX_CACHE.values())a.image.width=a.image.height=0;AX_CACHE.clear();AX_BYTES=0;}
function axMaterial(b){return new Map([[drawRathaus,'rathaus'],[drawMarien,'rathaus'],[drawBDom,'limestone'],[drawAltes,'limestone'],[drawPalast,'bronze'],[drawHdL,'curtain'],[drawHotel,'curtain'],[drawKino,'relief'],[drawVolks,'limestone'],[drawMMus,'rathaus'],[drawZTower,'limestone'],[drawGlas,'greenhouse'],[drawStall,'awning'],[drawOstbf,'station'],[drawPillar,'rail-brick'],[drawDeck,'rail-brick'],[axStationWall,'station']]).get(b.draw)||null;}
function axBake(b,n){const pad=b.draw===drawVolks||b.draw===drawHdL?36:b.draw===drawPillar?6:16,points=[];withRot(b,()=>{for(const z of [0,(b.top||b.H)+(b.draw===drawZTower?50:b.draw===drawRathaus?30:0)])for(const[u,v]of [[-pad,-pad],[b.w+pad,-pad],[b.w+pad,b.h+pad],[-pad,b.h+pad]])points.push(P3(b.x+u,b.y+v,z));});
  const x=Math.floor(Math.min(...points.map(p=>p[0]))-2),y=Math.floor(Math.min(...points.map(p=>p[1]))-4),w=Math.ceil(Math.max(...points.map(p=>p[0]))-x+2),h=Math.ceil(Math.max(...points.map(p=>p[1]))-y+4),scale=koepScale(),cw=Math.ceil(w*scale),ch=Math.ceil(h*scale),bytes=cw*ch*4;
  if(AX_BYTES+bytes+alexAssetStats().sourceBytes>AX_LIMIT)return;
  const image=cnv(cw,ch),old=ctx;ctx=image.getContext('2d');AX_BAKING=true;AX_MAT=n;try{ctx.scale(scale,scale);ctx.translate(-x,-y);withRot(b,()=>b.draw(b));}finally{ctx=old;AX_BAKING=false;AX_MAT='';}
  AX_BYTES+=bytes;AX_CACHE.set(b,{image,x,y,w:cw/scale,h:ch/scale,scale});}
function axPrepareMap(){axResetCache();if(!alexArtOn())return AX_PROMISE=Promise.resolve();const job=AX_JOB,queue=blds.map(b=>[b,axMaterial(b)]).filter(a=>a[1]);queue.sort((a,b)=>(a[0].draw===drawPillar||a[0].draw===drawDeck)-(b[0].draw===drawPillar||b[0].draw===drawDeck));
  return AX_PROMISE=new Promise(resolve=>{let i=0;const step=()=>{if(job!==AX_JOB)return resolve();for(let k=0;k<4&&i<queue.length;k++,i++){const[b,n]=queue[i];if(AX_TEX[n])axBake(b,n);}if(i<queue.length)setTimeout(step,0);else resolve();};setTimeout(step,0);});}
addEventListener('resize',()=>setTimeout(axPrepareMap,0));
function alexAssetStats(){const decodedBytes=AX_NAMES.reduce((n,k)=>{const m=SPRITES['buildings/alex-'+k];return n+(m?m.w*m.h*4:0);},0),canvasBytes=Object.values(AX_TEX).reduce((n,c)=>n+c.width*c.height*4,0);return{ready:Object.keys(AX_TEX).length,decodedBytes,canvasBytes,sourceBytes:decodedBytes+canvasBytes,projectedCacheBytes:AX_BYTES,totalBytes:decodedBytes+canvasBytes+AX_BYTES,cached:AX_CACHE.size,limit:AX_LIMIT};}
const alexAssetReady=spriteReady.then(()=>Promise.all(AX_NAMES.map(async n=>{try{const key='buildings/alex-'+n;if(!SPRITES[key])return;spr(key);const i=SPRIMG[key];await i.decode();const c=cnv(i.width-2,i.height-2);c.getContext('2d').drawImage(i,1,1,c.width,c.height,0,0,c.width,c.height);AX_TEX[n]=c;}catch(e){/* Complete original drawing remains available. */}})));

function axBillboard(b){if(!alexArtOn()||!b.axSprite)return false;const im=AX_TEX[b.axSprite];if(!im)return false;const sc=b.sc||1,h=b.top*sc,w=h*im.width/im.height,X=ix(b.x+b.w/2,b.y),Y=iy(b.x+b.w/2,b.y);ctx.drawImage(im,X-w/2,Y-h,w,h);return true;}
function axGround(){if(!alexArtOn())return;const g=gx;g.save();g.beginPath();ALEX.plaza.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.clip();axRect(g,'plaza',2300,1000,650,950);g.restore();}
