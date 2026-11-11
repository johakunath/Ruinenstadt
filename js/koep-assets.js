// Köpenick face kit. Shared material patterns, exact legacy window lattice and alpha cuts.
// koep metadata is recorded while makeB draws its unchanged fallback; rendering never uses RNG.
const KOEP_KEYS=['a-window','a-wall','b-window','b-wall','c-window','c-wall','platte-window','platte-wall','roof','shopfront','ivy','damage','roof-ruin'].map(k=>'buildings/koep-'+k);
let KOEPKIT=null;
const KOEP_CACHE_LIMIT=40000000;
let KOEPCACHE={map:null,items:new Map(),bytes:0,ready:false,promise:null,pending:new Map(),queue:[],scheduled:false,evictions:0,clock:0,frame:0,view:null,blocked:new Map(),maxAllocatedBytes:0};
function koepAssetStats(){const decodedBytes=KOEP_KEYS.reduce((n,k)=>n+(SPRITES[k]?SPRITES[k].w*SPRITES[k].h*4:0),0),sharedCanvasBytes=KOEPKIT?KOEPKIT.materials.reduce((n,m)=>n+m.c.width*m.c.height*4,0):0;return{decodedBytes,sharedCanvasBytes,canvasBytes:sharedCanvasBytes+KOEPCACHE.bytes,perBuildingCanvasBytes:KOEPCACHE.bytes,totalBytes:decodedBytes+sharedCanvasBytes+KOEPCACHE.bytes,cacheLimitBytes:KOEP_CACHE_LIMIT,cachedBuildings:KOEPCACHE.items.size,cacheReady:KOEPCACHE.ready,evictions:KOEPCACHE.evictions,maxAllocatedBytes:KOEPCACHE.maxAllocatedBytes};}
function koepKit(){if(KOEPKIT)return KOEPKIT;const images=KOEP_KEYS.map(spr),meta=KOEP_KEYS.map(k=>SPRITES[k]);if(images.some(i=>!i)||meta.some(m=>!m||m.w<=2||m.h<=2||!(m.units>0)))return null;
  for(const n of [0,2,4,6]){const p=meta[n].pivots,a=p&&p.apertureTL,z=p&&p.apertureBR;if(!a||!z||a[0]<1||a[1]<1||z[0]>meta[n].w-1||z[1]>meta[n].h-1||z[0]<=a[0]||z[1]<=a[1])return null;}
  const materials=[1,3,5,7,8,12].map(n=>{const m=meta[n],c=cnv(m.w-2,m.h-2);c.getContext('2d').drawImage(images[n],1,1,c.width,c.height,0,0,c.width,c.height);const p=ctx.createPattern(c,'repeat');p.setTransform(new DOMMatrix().scale(1/m.units));return{p,c};});
  return KOEPKIT={images,meta,materials};}
// Intersect triangle complements separately: overlapping destination-out cuts must stay holes.
function koepClip(b,x,y,w,h,offset){ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();for(const t of b.koep.cuts){if(Math.max(t[0][0],t[1][0],t[2][0])<=x||Math.min(t[0][0],t[1][0],t[2][0])>=x+w||Math.max(t[0][1],t[1][1],t[2][1])-offset<=y||Math.min(t[0][1],t[1][1],t[2][1])-offset>=y+h)continue;ctx.beginPath();ctx.rect(x,y,w,h);ctx.moveTo(t[0][0],t[0][1]-offset);ctx.lineTo(t[1][0],t[1][1]-offset);ctx.lineTo(t[2][0],t[2][1]-offset);ctx.closePath();ctx.clip('evenodd');}}
function koepImage(kit,n,x,y,w,h){const m=kit.meta[n];ctx.drawImage(kit.images[n],1,1,m.w-2,m.h-2,x,y,w,h);}
function koepWindow(kit,n,v){const m=kit.meta[n],a=m.pivots.apertureTL,z=m.pivots.apertureBR,sx=v.w/(z[0]-a[0]),sy=v.h/(z[1]-a[1]),left=Math.max(1,a[0]+(v.w/2-18)/sx),right=Math.min(m.w-1,a[0]+(v.w/2+18)/sx);
  // Source-crop the bay to its half-pitch instead of creating a clip stack per window.
  ctx.drawImage(kit.images[n],left,1,right-left,m.h-2,v.x+(left-a[0])*sx,v.y-(a[1]-1)*sy,(right-left)*sx,(m.h-2)*sy);}
function koepLegacy(b,r){ctx.drawImage(b.spr,r.x,b.h+r.y,r.w,r.h,r.x,r.y,r.w,r.h);}
function koepFacade(b,kit,n){const k=b.koep,FH=b.FH||b.H;ctx.fillStyle=kit.materials[n].p;ctx.fillRect(0,0,b.w,FH);
  for(const v of k.windows)koepWindow(kit,n*2,v);
  // Vines and exposed brick are face-local and clipped, never silhouette or light-position changes.
  const ivyW=Math.min(22,b.w*.14),ivyH=Math.min(100,FH*.86);koepImage(kit,10,0,0,ivyW,ivyH);
  if(k.kind==='c')koepImage(kit,11,Math.max(0,b.w-38),Math.max(0,FH-55),Math.min(38,b.w),Math.min(55,FH));
  // Preserve the actual candle/broken/boarded pixels selected by the legacy q draw.
  for(const v of k.windows)if(v.lit||v.state!=='plain')koepLegacy(b,v);
  if(k.door)koepLegacy(b,k.door);
}
function koepShopFacade(b,kit,east){const FH=b.FH||b.H;ctx.fillStyle=kit.materials[0].p;ctx.fillRect(0,0,east?b.h:b.w,FH);
  if(east){const e=b.ef;if(!e)return;ctx.drawImage(e,0,21,b.h,7,0,21,b.h,7);ctx.drawImage(e,b.h*.3,32,b.h*.4,FH-38,b.h*.3,32,b.h*.4,FH-38);return;}
  koepImage(kit,9,0,0,b.w,FH);
  // The painting has a blank sign fascia. Retain only the German neon lettering
  // and precise candle-bearing shutter/door lane over the complete painted shopfront.
  koepLegacy(b,{x:b.w/2-59,y:2,w:118,h:18});
  koepLegacy(b,{x:b.dx-2,y:28,w:b.dw+4,h:FH-28});
}
function koepEligible(b){return D===DIST[0]&&b.koep&&!b.gable&&bR0(b)===0&&!b.veh&&!b.bb&&b.w>0&&b.h>0;}
// Bake at the device scale the cache is drawn at (DPR*Z, quarter steps, max 3) so drawImage stays ~1:1, never minifies.
function koepScale(){return typeof DPR==='undefined'||typeof Z==='undefined'?3:Math.min(3,Math.max(1,Math.ceil(DPR*Z*4)/4));}
function koepSignature(b){return[koepScale(),b.x,b.y,b.w,b.h,b.H,b.FH||0,b.vs||1,b.rot||0,bR0(b),b.koep.kind].join(',');}
function koepCacheMatches(b,e){return e&&e.signature===koepSignature(b)&&e.metadata===b.koep&&e.original===b.spr&&e.originalEast===b.ef;}
function koepBounds(b){const points=[],H=bHs(b);withRot(b,()=>{for(const z of [0,H])for(const[u,v]of [[0,0],[b.w,0],[b.w,b.h],[0,b.h]])points.push(P3(b.x+u,b.y+v,z));for(const[u,v]of [[0,0],[b.w,0],[b.w,b.h],[0,b.h]])points.push(P3(b.x+5+u,b.y+5+v,0));});const x=Math.floor(Math.min(...points.map(p=>p[0]))-1),y=Math.floor(Math.min(...points.map(p=>p[1]))-1),x1=Math.ceil(Math.max(...points.map(p=>p[0]))+1),y1=Math.ceil(Math.max(...points.map(p=>p[1]))+1);return{x,y,w:x1-x,h:y1-y};}
function koepBake(b,kit,bounds){const scale=koepScale(),c=cnv(bounds.w*scale,bounds.h*scale),g=c.getContext('2d'),previous=ctx,rotation=ROT;ctx=g;try{g.scale(scale,scale);g.translate(-bounds.x,-bounds.y);withRot(b,()=>drawKoepBuildingLive(b));}finally{ctx=previous;ROT=rotation;}return{image:c,bounds,scale,bytes:c.width*c.height*4,signature:koepSignature(b),metadata:b.koep,original:b.spr,originalEast:b.ef,lastUsed:0,lastSeen:-1};}
// Bake the exact texture-kit projection at koepScale() px/screen unit in scheduled jobs, never in draw.
// The cache is derived from method A at the actual box rotation, not a separate fixed-view asset.
// A strict 40 MB total cap includes decoded assets, shared materials and every cached facade.
// A stationary over-budget view keeps a stable painted subset. Overflow stays on fallback.
function koepBeginFrame(){const s=KOEPCACHE,key=[P.x,P.y,Z,DPR,SW,SH].join(',');s.frame++;if(s.view!==key){s.view=key;s.blocked.clear();}}
function koepDistance(b){return typeof P==='undefined'?0:Math.hypot(b.x+b.w/2-P.x,b.y+b.h/2-P.y);}
function koepRelease(entry){entry.image.width=0;entry.image.height=0;}
function koepResetCache(map){for(const e of KOEPCACHE.items.values())koepRelease(e);for(const pending of KOEPCACHE.pending.values())pending.resolve(false);KOEPCACHE={map,items:new Map(),bytes:0,ready:false,promise:null,pending:new Map(),queue:[],scheduled:false,evictions:0,clock:0,frame:0,view:null,blocked:new Map(),maxAllocatedBytes:koepAssetStats().decodedBytes+koepAssetStats().sharedCanvasBytes};}
function koepCacheStep(state){if(KOEPCACHE!==state)return;state.scheduled=false;const job=state.queue.shift();if(!job)return;const{b,force,resolve}=job,bounds=koepBounds(b),sc=koepScale(),cost=Math.ceil(bounds.w*sc)*Math.ceil(bounds.h*sc)*4,kit=koepKit();let allowed=!!kit&&cost+koepAssetStats().decodedBytes+koepAssetStats().sharedCanvasBytes<=KOEP_CACHE_LIMIT;
  while(allowed&&koepAssetStats().totalBytes+cost>KOEP_CACHE_LIMIT){const victim=[...state.items.keys()].filter(b=>state.items.get(b).lastSeen<state.frame).sort((a,z)=>(state.items.get(a).lastUsed-state.items.get(z).lastUsed)||koepDistance(z)-koepDistance(a))[0];if(!victim||(!force&&(state.items.get(victim).lastUsed>0||koepDistance(victim)<=koepDistance(b)))){allowed=false;break;}const e=state.items.get(victim);state.bytes-=e.bytes;koepRelease(e);state.items.delete(victim);state.evictions++;}
  if(allowed){const e=koepBake(b,kit,bounds);if(force)e.lastSeen=state.frame;state.items.set(b,e);state.bytes+=e.bytes;state.maxAllocatedBytes=Math.max(state.maxAllocatedBytes,koepAssetStats().totalBytes);}else if(force)state.blocked.set(b,koepSignature(b));state.pending.delete(b);resolve(allowed);koepSchedule(state);}
function koepSchedule(state){if(!state.scheduled&&state.queue.length){state.scheduled=true;setTimeout(()=>koepCacheStep(state),0);}}
function koepQueueCache(b,force){const state=KOEPCACHE;if(state.blocked.get(b)===koepSignature(b))return Promise.resolve(false);if(koepCacheMatches(b,state.items.get(b)))return Promise.resolve(true);if(state.items.has(b)){const e=state.items.get(b);state.bytes-=e.bytes;koepRelease(e);state.items.delete(b);}const previous=state.pending.get(b);if(previous){if(force)previous.force=true;return previous.promise;}let resolve;const promise=new Promise(r=>resolve=r),job={b,force,resolve,promise};state.pending.set(b,job);state.queue.push(job);koepSchedule(state);return promise;}
function koepPrepareMap(map=typeof blds==='undefined'?null:blds){const kit=koepKit();if(!kit||!map||D!==DIST[0])return Promise.resolve(false);if(KOEPCACHE.map===map)return KOEPCACHE.promise;koepResetCache(map);const state=KOEPCACHE,queue=map.filter(koepEligible).sort((a,b)=>koepDistance(a)-koepDistance(b));state.promise=Promise.all(queue.map(b=>koepQueueCache(b,false))).then(()=>{if(KOEPCACHE!==state)return false;state.ready=true;return true;});return state.promise;}
function koepPrepare(b){if(!koepEligible(b)||!koepKit())return Promise.resolve(false);const map=typeof blds==='undefined'?KOEPCACHE.map||[]:blds;if(KOEPCACHE.map!==map)koepPrepareMap(map);return koepQueueCache(b,true);}
function koepCacheReady(b){return!!koepCacheMatches(b,KOEPCACHE.items.get(b));}
function drawKoepBuilding(b){if(KOEPCACHE.map!==null&&(D!==DIST[0]||(typeof blds!=='undefined'&&KOEPCACHE.map!==blds)))koepResetCache(null);if(!koepEligible(b)||!koepKit())return false;koepPrepareMap();const cached=KOEPCACHE.items.get(b);if(!koepCacheMatches(b,cached)){koepPrepare(b);return false;}cached.lastSeen=KOEPCACHE.frame;cached.lastUsed=++KOEPCACHE.clock;const r=cached.bounds;ctx.drawImage(cached.image,r.x,r.y,r.w,r.h);return true;}
function drawKoepBuildingLive(b){if(!koepEligible(b))return false;const kit=koepKit();if(!kit)return false;
  const{x,y,w,h}=b,FH=b.FH||b.H,vs=b.vs||1,H=FH*vs,k=b.koep,shop=k.kind==='shop',n=k.kind==='platte'?3:k.kind==='c'?2:k.kind==='b'?1:0,[ux,uy,vx,vy]=bAx();
  faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.25)');
  const south=P3(x,y+h,H);ctx.save();ctx.transform(ux,uy,0,vs,south[0],south[1]);koepClip(b,0,0,w,FH,h);if(shop)koepShopFacade(b,kit,false);else koepFacade(b,kit,n);ctx.restore();
  const east=P3(x+w,y+h,H),sw=shop?h:Math.min(w,h*1.5),off=shop?0:w-sw;ctx.save();ctx.transform(-vx*h/sw,-vy*h/sw,0,vs,east[0],east[1]);ctx.translate(-off,0);koepClip(b,off,0,sw,FH,h);if(shop)koepShopFacade(b,kit,true);else koepFacade(b,kit,n);ctx.fillStyle='rgba(8,20,22,.38)';ctx.fillRect(off,0,sw,FH);ctx.restore();
  faceS(x,y,w,h,0,H*.35,'rgba(8,5,4,.18)');
  const roof=P3(x,y,H);ctx.save();ctx.transform(ux,uy,vx,vy,roof[0],roof[1]);koepClip(b,0,0,w,h,0);ctx.fillStyle=kit.materials[k.kind==='c'?5:k.kind==='platte'?3:4].p;ctx.fillRect(0,0,w,h);if(shop)ctx.drawImage(b.spr,0,0,w,h,0,0,w,h);ctx.restore();
  // Alpha cuts are intentional; outlines must not bridge their missing corners.
  if(!k.cuts.length){faceS(x,y,w,h,0,H,0,INK);faceE(x,y,w,h,0,H,0,INK);faceT(x,y,w,h,H,0,INK);}return true;}
