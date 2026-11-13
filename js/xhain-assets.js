// Painted Xhain surfaces. Original constructors, geometry and light positions remain authoritative.
const XH_NAMES='arcade tower copper concrete station glass iron rail-brick mural ceramic water paving'.split(' '),XH_TEX=Object.create(null),XH_PAT=new WeakMap(),XH_LIMIT=40000000;
let XHAIN_ART=true,XH_BAKING=false,XH_MAT='',XH_CACHE=new Map(),XH_BYTES=0,XH_JOB=0,XH_PROMISE=Promise.resolve();
const xhainArtOn=()=>XHAIN_ART&&D===DIST[1]&&!(typeof TUN!=='undefined'&&TUN);
function xhPattern(g,n,units=3){if(!xhainArtOn()||!XH_TEX[n])return null;let a=XH_PAT.get(g);if(!a)XH_PAT.set(g,a={});const k=n+':'+units;if(!a[k]){const p=g.createPattern(XH_TEX[n],'repeat');if(!p)return null;p.setTransform(new DOMMatrix().scale(1/units));a[k]=p;}return a[k];}
function xhRect(g,n,x,y,w,h,alpha=1){const p=xhPattern(g,n);if(!p)return false;g.save();g.globalAlpha*=alpha;g.fillStyle=p;g.fillRect(x,y,w,h);g.restore();return true;}
function xhFace(a,b,d,w,h,n,fit=false,shade=0){const im=XH_TEX[n];if(!XH_BAKING||!im||w<=0||h<=0)return;ctx.save();ctx.transform((b[0]-a[0])/w,(b[1]-a[1])/w,(d[0]-a[0])/h,(d[1]-a[1])/h,a[0],a[1]);if(fit)ctx.drawImage(im,0,0,w,h);else{ctx.fillStyle=xhPattern(ctx,n);ctx.fillRect(0,0,w,h);}if(shade){ctx.fillStyle='rgba(8,18,22,'+shade+')';ctx.fillRect(0,0,w,h);}ctx.restore();}
// Only active during scheduled baking; the unchanged live fallback uses ibox alone.
function xhBox(x,y,w,h,z0,z1,c,s,top){ibox(x,y,w,h,z0,z1,c,s,top);if(!XH_BAKING)return;const n=XH_MAT==='arcade'&&w<=56&&z1>60?'tower':XH_MAT,H=z1-z0;
  xhFace(P3(x,y+h,z1),P3(x+w,y+h,z1),P3(x,y+h,z0),w,H,n,false,.04);xhFace(P3(x+w,y+h,z1),P3(x+w,y,z1),P3(x+w,y+h,z0),h,H,n,false,.32);
  xhFace(P3(x,y,z1),P3(x+w,y,z1),P3(x,y+h,z1),w,h,n==='iron'?'iron':n==='arcade'||n==='tower'?'tower':'paving',false,.12);faceS(x,y,w,h,z0,z1,0,s);faceE(x,y,w,h,z0,z1,0,s);faceT(x,y,w,h,z1,0,s);}
function xhCached(b){if(XH_BAKING||!xhainArtOn())return false;const a=XH_CACHE.get(b);if(!a||a.scale!==koepScale())return false;ctx.drawImage(a.image,a.x,a.y,a.w,a.h);return true;}
function xhStationWall(b){if(xhCached(b))return;drawLow(b);if(XH_BAKING){XH_MAT='ceramic';xhBox(b.x,b.y,b.w,b.h,0,b.H,b.c,INK);}}
function xhResetCache(){XH_JOB++;for(const a of XH_CACHE.values())a.image.width=a.image.height=0;XH_CACHE.clear();XH_BYTES=0;}
function xhMaterial(b){if(b.draw===drawArcade)return'arcade';if(b.draw===drawBerghain)return'concrete';if(b.draw===drawOstbf)return'station';if(b.draw===drawESG)return'mural';if(b.draw===xhStationWall)return'ceramic';if(b.draw===drawPillar)return b.c==='#3f6a4a'?'iron':'rail-brick';if(b.draw===drawDeck)return b.cs[0]==='#3f6a4a'?'iron':'rail-brick';return null;}
function xhBake(b,n){const pad=b.draw===drawArcade?20:b.draw===drawPillar?6:10,points=[];withRot(b,()=>{for(const z of [0,b.top||b.H])for(const[u,v]of [[-pad,-pad],[b.w+pad,-pad],[b.w+pad,b.h+pad],[-pad,b.h+pad]])points.push(P3(b.x+u,b.y+v,z));});
  const x=Math.floor(Math.min(...points.map(p=>p[0]))-2),y=Math.floor(Math.min(...points.map(p=>p[1]))-4),w=Math.ceil(Math.max(...points.map(p=>p[0]))-x+2),h=Math.ceil(Math.max(...points.map(p=>p[1]))-y+4),scale=koepScale(),cw=Math.ceil(w*scale),ch=Math.ceil(h*scale),bytes=cw*ch*4;
  if(XH_BYTES+bytes+xhainAssetStats().sourceBytes>XH_LIMIT)return;
  const image=cnv(cw,ch),old=ctx;ctx=image.getContext('2d');XH_BAKING=true;XH_MAT=n;try{ctx.scale(scale,scale);ctx.translate(-x,-y);withRot(b,()=>b.draw(b));}finally{ctx=old;XH_BAKING=false;XH_MAT='';}
  XH_BYTES+=bytes;XH_CACHE.set(b,{image,x,y,w:cw/scale,h:ch/scale,scale});}
function xhPrepareMap(){xhResetCache();if(!xhainArtOn())return XH_PROMISE=Promise.resolve();const job=XH_JOB,queue=blds.map(b=>[b,xhMaterial(b)]).filter(a=>a[1]);queue.sort((a,b)=>(a[0].draw===drawPillar||a[0].draw===drawDeck)-(b[0].draw===drawPillar||b[0].draw===drawDeck));
  return XH_PROMISE=new Promise(resolve=>{let i=0;const step=()=>{if(job!==XH_JOB)return resolve();for(let k=0;k<4&&i<queue.length;k++,i++){const[b,n]=queue[i];if(XH_TEX[n])xhBake(b,n);}if(i<queue.length)setTimeout(step,0);else resolve();};setTimeout(step,0);});}
addEventListener('resize',()=>setTimeout(xhPrepareMap,0));
function xhainAssetStats(){const decodedBytes=XH_NAMES.reduce((n,k)=>{const m=SPRITES['buildings/xhain-'+k];return n+(m?m.w*m.h*4:0);},0),canvasBytes=Object.values(XH_TEX).reduce((n,c)=>n+c.width*c.height*4,0);return{ready:Object.keys(XH_TEX).length,decodedBytes,canvasBytes,sourceBytes:decodedBytes+canvasBytes,projectedCacheBytes:XH_BYTES,totalBytes:decodedBytes+canvasBytes+XH_BYTES,cached:XH_CACHE.size,limit:XH_LIMIT};}
const xhainAssetReady=spriteReady.then(()=>Promise.all(XH_NAMES.map(async n=>{try{const key='buildings/xhain-'+n;if(!SPRITES[key])return;spr(key);const i=SPRIMG[key];await i.decode();const c=cnv(i.width-2,i.height-2);c.getContext('2d').drawImage(i,1,1,c.width,c.height,0,0,c.width,c.height);XH_TEX[n]=c;}catch(e){/* Complete original drawing remains available. */}})));
