// District-only painted architecture. Decode once; all original constructors/RNG still run.
const KS_NAMES='facade roof tower station bridge-wall water plaza pavement asphalt path platform bridge-deck'.split(' '),KS_KEYS=KS_NAMES.map(n=>'buildings/koep-special-'+n),KS_TEX=Object.create(null),KS_PAT=new WeakMap();
let KOEP_SPECIAL=true;
const koepSpecialOn=()=>KOEP_SPECIAL&&D===DIST[0]&&!(typeof TUN!=='undefined'&&TUN);
function ksPattern(g,n,units=3){if(!koepSpecialOn()||!KS_TEX[n])return null;let a=KS_PAT.get(g);if(!a)KS_PAT.set(g,a={});const k=n+':'+units;if(!a[k]){const p=g.createPattern(KS_TEX[n],'repeat');if(!p)return null;p.setTransform(new DOMMatrix().scale(1/units));a[k]=p;}return a[k];}
function ksRect(g,n,x,y,w,h,alpha=1){const p=ksPattern(g,n);if(!p)return false;g.save();g.globalAlpha*=alpha;g.fillStyle=p;g.fillRect(x,y,w,h);g.restore();return true;}
function ksFace(a,b,d,w,h,n){const p=ksPattern(ctx,n);if(!p)return;ctx.save();ctx.transform((b[0]-a[0])/w,(b[1]-a[1])/w,(d[0]-a[0])/h,(d[1]-a[1])/h,a[0],a[1]);ctx.fillStyle=p;ctx.fillRect(0,0,w,h);ctx.restore();}
// Face modules stay on the original 300x90 footprint. The tower is a separate
// upright facade plane, never stretched over the roof or duplicated on the end.
function ksRathausLive(b){const{x,y,w,h}=b,H=bHs(b),[ux,uy,vx,vy]=bAx(),f=KS_TEX.facade;
  faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.25)');
  ksFace(P3(x,y,H),P3(x+w,y,H),P3(x,y+h,H),w,h,'roof');
  const front=P3(x,y+h,H);ctx.save();ctx.transform(ux,uy,0,1,front[0],front[1]);
  for(let i=0;i<3;i++)ctx.drawImage(f,0,0,f.width,f.height,i*w/3,0,w/3,H);
  // Keep existing powered windows and their original light positions.
  ctx.fillStyle='#d18a42';for(const l of b.lights)if(!l.ksClock){const px=l.x-x,py=(l.y-y-(b.h-b.H))*1.5;ctx.fillRect(px-3,py-4,6,8);}ctx.restore();
  const side=P3(x+w,y+h,H);ctx.save();ctx.transform(-vx,-vy,0,1,side[0],side[1]);ctx.drawImage(f,0,0,f.width*.35,f.height,0,0,h,H);ctx.fillStyle='rgba(8,18,19,.35)';ctx.fillRect(0,0,h,H);ctx.restore();
  const t=P3(x+30,y+h,H+(b.top-b.H)*1.5);ctx.save();ctx.transform(ux,uy,0,1,t[0],t[1]);ctx.drawImage(KS_TEX.tower,0,0,64,b.top*1.5);ctx.restore();
}
function ksStationLive(b){const{x,y,w,h,H}=b;ibox(x,y,w,h,0,H,b.c,INK);ksFace(P3(x,y+h,H),P3(x+w,y+h,H),P3(x,y+h,0),w,H,'station');ksFace(P3(x+w,y+h,H),P3(x+w,y,H),P3(x+w,y+h,0),h,H,'station');}
let KS_CACHE=new Map();
function ksCached(b){const c=KS_CACHE.get(b);if(!koepSpecialOn()||!c||c.scale!==koepScale())return false;ctx.drawImage(c.image,c.x,c.y,c.w,c.h);return true;}
function drawKoepRathaus(b){if(!ksCached(b))drawBox(b);}
function ksStationWall(b){if(!ksCached(b))drawLow(b);}
function ksBridge(b){ksCached(b);}
function ksBridgeLive(b){const{s,t0,t1}=b;for(const sd of [-1,1]){const x=s.ax+s.ux*t0-s.uy*53*sd,y=s.ay+s.uy*t0+s.ux*53*sd,L=t1-t0;
  ksFace(P3(x,y,7),P3(x+s.ux*L,y+s.uy*L,7),P3(x,y,0),L,7,'bridge-wall');
  ctx.strokeStyle='#273a38';ctx.lineWidth=2;for(const z of [9,21]){const a=P3(x,y,z),q=P3(x+s.ux*L,y+s.uy*L,z);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...q);ctx.stroke();}
  for(let t=0;t<=L;t+=12){const px=x+s.ux*t,py=y+s.uy*t,a=P3(px,py,7),q=P3(px,py,t%36===0?24:21);ctx.lineWidth=t%36===0?3:1;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...q);ctx.stroke();}}}
function ksBake(b,live){const points=[];for(const z of [0,b.ksRathaus?b.top*1.5:26])for(const[u,v]of [[0,0],[b.w,0],[b.w,b.h],[0,b.h]])points.push(P3(b.x+u,b.y+v,z));const x=Math.floor(Math.min(...points.map(p=>p[0]))-8),y=Math.floor(Math.min(...points.map(p=>p[1]))-8),w=Math.ceil(Math.max(...points.map(p=>p[0]))-x+8),h=Math.ceil(Math.max(...points.map(p=>p[1]))-y+8),scale=koepScale(),image=cnv(w*scale,h*scale),old=ctx;ctx=image.getContext('2d');try{ctx.scale(scale,scale);ctx.translate(-x,-y);live(b);}finally{ctx=old;}KS_CACHE.set(b,{image,x,y,w,h,scale});}
function ksPrepareMap(){for(const c of KS_CACHE.values())c.image.width=c.image.height=0;KS_CACHE=new Map();if(!koepSpecialOn())return;
  if(['facade','roof','tower'].every(n=>KS_TEX[n]))for(const b of blds)if(b.ksRathaus)ksBake(b,ksRathausLive);
  if(KS_TEX.station)for(const b of blds)if(b.draw===ksStationWall)ksBake(b,ksStationLive);
  if(KS_TEX['bridge-wall'])for(const b of blds)if(b.ksBridge)ksBake(b,ksBridgeLive);
}
function ksBridgeObjects(){if(!koepSpecialOn())return;for(const s of ROADS){let t0=null;for(let t=0;t<=s.len+8;t+=8){const wet=t<=s.len&&isWater(s.ax+s.ux*t,s.ay+s.uy*t);if(wet&&t0==null)t0=t;if(!wet&&t0!=null){const t1=Math.min(s.len,t),ax=s.ax+s.ux*t0,ay=s.ay+s.uy*t0,bx=s.ax+s.ux*t1,by=s.ay+s.uy*t1;blds.push({x:Math.min(ax,bx)-58,y:Math.min(ay,by)-58,w:Math.abs(bx-ax)+116,h:Math.abs(by-ay)+116,H:24,top:24,fe:1,lights:[],ksBridge:true,s,t0,t1,draw:ksBridge});t0=null;}}}}
addEventListener('resize',()=>setTimeout(ksPrepareMap,0));
function koepSpecialStats(){return{ready:KS_NAMES.filter(n=>KS_TEX[n]).length,total:KS_NAMES.length,decodedBytes:KS_KEYS.reduce((n,k)=>n+(SPRITES[k]?SPRITES[k].w*SPRITES[k].h*4:0),0),canvasBytes:Object.values(KS_TEX).reduce((n,i)=>n+i.width*i.height*4,0),projectedCacheBytes:[...KS_CACHE.values()].reduce((n,c)=>n+c.image.width*c.image.height*4,0)};}
const koepSpecialReady=spriteReady.then(()=>Promise.all(KS_KEYS.map(async key=>{try{const m=SPRITES[key];if(!m)return;spr(key);const i=SPRIMG[key];await i.decode();const c=document.createElement('canvas');c.width=i.width-2;c.height=i.height-2;c.getContext('2d').drawImage(i,1,1,c.width,c.height,0,0,c.width,c.height);KS_TEX[key.slice('buildings/koep-special-'.length)]=c;}catch(e){/* Independent missing-image fallbacks. */}})));

function ksRathausplatz(){if(!koepSpecialOn())return;for(let y=1420;y<1780;y+=16)for(let x=1590;x<2110;x+=16)if(!isWater(x+8,y+8)&&roadD(x+8,y+8)>64)ksRect(gx,'plaza',x,y,16,16);}
