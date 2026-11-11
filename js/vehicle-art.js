// Task 03: painted surfaces wrap actual P3 geometry once, including road rotation.
// Runtime uses one cached upright image: no ground-affine flattened verticals.
const VEHPALETTE={car:['green','red','blue'],trabi:['turquoise','cream','red'],van:['blue','cream'],bus:['yellow'],tram:['yellow']};
const VEHMAX=40000000;let VEHSTATE=null;

function vehicleVariant(V){const a=VEHPALETTE[V.k];if(!a)return null;let n=0;for(let j=0;j<V.c.length;j++)n=(n*31+V.c.charCodeAt(j))>>>0;return a[n%a.length];}
function vehicleArtStats(){const decodedBytes=Object.keys(SPRITES).filter(k=>k.startsWith('vehicles/')).reduce((n,k)=>n+SPRITES[k].w*SPRITES[k].h*4,0),s=VEHSTATE;return{decodedBytes,canvasBytes:s?s.bytes:0,totalBytes:decodedBytes+(s?s.bytes:0),cached:s?s.items.size:0,limit:VEHMAX,pending:s?s.pending.size:0,evictions:s?s.evictions:0,maxAllocatedBytes:s?s.peak:decodedBytes};}
// Actual road jitter reaches beyond +/-45 degrees: select the visible opposite face there.
function vehicleVisible(){const a=bAx();return{south:a[0]>=-1e-9,east:a[2]<=1e-9};}
// Four corners, clockwise. Triangulate the planar frustum to keep its vertical
// and inset cabin geometry exact; only executed when a cache is first baked.
function vehicleQuad(i,a,b,c,d,flip=false){const w=i.width-2,h=i.height-2;
  function tri(p,q,r,u,v,t){const ux=q[0]-p[0],uy=q[1]-p[1],vx=r[0]-p[0],vy=r[1]-p[1],sx=v[0]-u[0],sy=v[1]-u[1],tx=t[0]-u[0],ty=t[1]-u[1],det=sx*ty-sy*tx,A=(ux*ty-vx*sy)/det,B=(uy*ty-vy*sy)/det,C=(vx*sx-ux*tx)/det,D=(vy*sx-uy*tx)/det;ctx.save();ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.lineTo(...r);ctx.closePath();ctx.clip();ctx.transform(A,B,C,D,p[0]-A*u[0]-C*u[1],p[1]-B*u[0]-D*u[1]);ctx.drawImage(i,1,1,w,h,0,0,w,h);ctx.restore();}
  tri(a,b,d,[flip?w:0,0],[flip?0:w,0],[flip?w:0,h]);tri(b,c,d,[flip?0:w,0],[flip?0:w,h],[flip?w:0,h]);poly([a,b,c,d],0,INK);
}
function vehicleFaces(b,side,end,roof,z0,z1){const{x,y,w,h}=b;
  const f=vehicleVisible();
  if(f.south)vehicleQuad(b.veh.v?end:side,P3(x,y+h,z1),P3(x+w,y+h,z1),P3(x+w,y+h,z0),P3(x,y+h,z0),!b.veh.v);
  else vehicleQuad(b.veh.v?end:side,P3(x+w,y,z1),P3(x,y,z1),P3(x,y,z0),P3(x+w,y,z0),b.veh.v);
  if(f.east)vehicleQuad(b.veh.v?side:end,P3(x+w,y+h,z1),P3(x+w,y,z1),P3(x+w,y,z0),P3(x+w,y+h,z0));
  else vehicleQuad(b.veh.v?side:end,P3(x,y,z1),P3(x,y+h,z1),P3(x,y+h,z0),P3(x,y,z0),true);
  // Art's local long axis is horizontal. V.v exchanges the two roof axes.
  if(b.veh.v)vehicleQuad(roof,P3(x+w,y,z1),P3(x+w,y+h,z1),P3(x,y+h,z1),P3(x,y,z1),true);
  else vehicleQuad(roof,P3(x,y,z1),P3(x+w,y,z1),P3(x+w,y+h,z1),P3(x,y+h,z1),true);
}
function vehicleCabin(x,y,w,h,z0,z1,li,si,v,side,end,roof){const x1=x+w,y1=y+h,u0=x+li,u1=x1-li,v0=y+si,v1=y1-si;
  const f=vehicleVisible();
  if(f.south)vehicleQuad(v?end:side,P3(u0,v1,z1),P3(u1,v1,z1),P3(x1,y1,z0),P3(x,y1,z0),!v);
  else vehicleQuad(v?end:side,P3(u1,v0,z1),P3(u0,v0,z1),P3(x,y,z0),P3(x1,y,z0),v);
  if(f.east)vehicleQuad(v?side:end,P3(u1,v1,z1),P3(u1,v0,z1),P3(x1,y,z0),P3(x1,y1,z0));
  else vehicleQuad(v?side:end,P3(u0,v0,z1),P3(u0,v1,z1),P3(x,y1,z0),P3(x,y,z0),true);
  if(v)vehicleQuad(roof,P3(u1,v0,z1),P3(u1,v1,z1),P3(u0,v1,z1),P3(u0,v0,z1),true);
  else vehicleQuad(roof,P3(u0,v0,z1),P3(u1,v0,z1),P3(u1,v1,z1),P3(u0,v1,z1),true);
}
function paintVehicle(b,images){const{x,y,w,h}=b,V=b.veh,k=V.k,big=k==='bus'||k==='tram',zt=7+(big?36:k==='van'?24:k==='trabi'?11:12),L=V.v?h:w;
  faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.35)');ibox(x+3,y+3,w-6,h-6,0,8,'#141010');
  const view=vehicleVisible();for(const f of [.17,.83]){if(V.v)wheel(view.east?x+w:x,y+h*f,6);else wheel(x+w*f,view.south?y+h:y,6);}
  vehicleFaces(b,images[0],images[1],images[2],7,zt);
  if(big){if(k==='tram'){const p=P3(x+w/2,y+h/2,zt),q=P3(x+w/2,y+h/2,zt+16);ctx.strokeStyle='#2a2622';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.moveTo(q[0]-8,q[1]);ctx.lineTo(q[0]+8,q[1]);ctx.stroke();}return;}
  const o=L*(k==='van'?.06:k==='trabi'?.3:.28),cw=L*(k==='van'?.86:.46),inset=k==='van'?2:3,ch=k==='van'?12:k==='trabi'?10:11;
  if(V.v)vehicleCabin(x+inset,y+o,w-inset*2,cw,zt,zt+ch,inset,k==='van'?8:cw*.2,true,images[3],images[4],images[5]);
  else vehicleCabin(x+o,y+inset,cw,h-inset*2,zt,zt+ch,k==='van'?8:cw*.2,inset,false,images[3],images[4],images[5]);
}

// Warm source images outside rendering. Scheduled jobs own all projected allocations.
if(typeof spriteReady!=='undefined')spriteReady.then(()=>{for(const k in SPRITES)if(k.startsWith('vehicles/'))spr(k);});
function vehicleRelease(e){e.image.width=e.image.height=0;}
function vehicleReset(map){if(VEHSTATE){for(const e of VEHSTATE.items.values())vehicleRelease(e);for(const j of VEHSTATE.pending.values())j.resolve(false);}VEHSTATE={map,items:new Map(),pending:new Map(),queue:[],blocked:new Map(),bytes:0,frame:0,view:null,scheduled:false,evictions:0,peak:0};return VEHSTATE;}
function vehicleState(){return !VEHSTATE||VEHSTATE.map!==blds?vehicleReset(blds):VEHSTATE;}
function vehicleBeginFrame(){const s=vehicleState(),key=[cam.x,cam.y,Z,DPR,SW,SH].join(',');s.frame++;if(s.view!==key){s.view=key;s.blocked.clear();}}
function vehicleScale(){return typeof DPR==='undefined'||typeof Z==='undefined'?3:Math.min(3,Math.max(1,Math.ceil(DPR*Z*4)/4));}
function vehicleSignature(b){const v=b.veh;return[vehicleScale(),b.rot||0,b.w,b.h,v.k,v.v,v.c].join(',');}
function vehicleBounds(b){let r;const prior=ROT;try{withRot(b,()=>{const cx=ix(b.x+b.w/2,b.y+b.h/2),cy=iy(b.x+b.w/2,b.y+b.h/2),H=b.veh.k==='tram'?60:b.veh.k==='bus'?44:b.veh.k==='van'?43:b.veh.k==='trabi'?33:35,p=[[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]].map(q=>P3(...q,0)),x=Math.floor(Math.min(...p.map(q=>q[0]))-cx-13),y=Math.floor(Math.min(...p.map(q=>q[1]))-cy-H-4);r={x,y,w:Math.ceil(Math.max(...p.map(q=>q[0]))-cx+13-x),h:Math.ceil(Math.max(...p.map(q=>q[1]))-cy+13-y)};});}finally{ROT=prior;}return r;}
function vehicleImages(b){const v=b.veh,variant=vehicleVariant(v);if(!variant)return null;const names=v.k==='bus'||v.k==='tram'?['side','end','top']:['side','end','top','glass-side','glass-end','roof'],a=names.map(n=>spr('vehicles/'+v.k+'-'+variant+'-'+n));return a.some(i=>!i)?null:a;}
function vehicleSchedule(s){if(!s.scheduled&&s.queue.length){s.scheduled=true;setTimeout(()=>vehicleCacheStep(s),0);}}
function vehicleCacheStep(s){if(s!==VEHSTATE)return;s.scheduled=false;const j=s.queue.shift();if(!j)return;const{b,resolve}=j,images=vehicleImages(b),r=vehicleBounds(b),scale=vehicleScale(),cost=Math.ceil(r.w*scale)*Math.ceil(r.h*scale)*4;let allowed=!!images&&cost+vehicleArtStats().decodedBytes<=VEHMAX;
  while(allowed&&vehicleArtStats().totalBytes+cost>VEHMAX){const candidates=[...s.items.entries()].filter(([,e])=>e.seen<s.frame).sort((a,b)=>a[1].used-b[1].used),victim=candidates[0];if(!victim){allowed=false;break;}s.bytes-=victim[1].bytes;vehicleRelease(victim[1]);s.items.delete(victim[0]);s.evictions++;}
  if(allowed){const image=cnv(r.w*scale,r.h*scale),prior=ctx,rot=ROT,cx=ix(b.x+b.w/2,b.y+b.h/2),cy=iy(b.x+b.w/2,b.y+b.h/2);try{ctx=image.getContext('2d');ctx.setTransform(scale,0,0,scale,-(cx+r.x)*scale,-(cy+r.y)*scale);withRot(b,()=>paintVehicle(b,images));}finally{ctx=prior;ROT=rot;}s.items.set(b,{image,r,bytes:image.width*image.height*4,signature:vehicleSignature(b),seen:j.visible&&j.view===s.view?s.frame:-1,used:0});s.bytes+=image.width*image.height*4;s.peak=Math.max(s.peak,vehicleArtStats().totalBytes);}else if(images&&j.visible)s.blocked.set(b,vehicleSignature(b));s.pending.delete(b);resolve(allowed);vehicleSchedule(s);}
function vehiclePrepare(b,visible=false){if(!b.veh||!VEHPALETTE[b.veh.k])return Promise.resolve(false);const s=vehicleState(),signature=vehicleSignature(b),hit=s.items.get(b);if(hit?.signature===signature)return Promise.resolve(true);if(s.blocked.get(b)===signature)return Promise.resolve(false);if(hit){s.bytes-=hit.bytes;vehicleRelease(hit);s.items.delete(b);}const old=s.pending.get(b);if(old){if(visible){old.visible=true;old.view=s.view;}return old.promise;}let resolve;const promise=new Promise(r=>resolve=r),j={b,visible,view:s.view,resolve,promise};s.pending.set(b,j);s.queue.push(j);vehicleSchedule(s);return promise;}
function vehicleCacheReady(b){return VEHSTATE?.items.get(b)?.signature===vehicleSignature(b);}
function drawVehicleArt(b){if(!b.veh||!VEHPALETTE[b.veh.k])return false;const s=vehicleState(),e=s.items.get(b);if(!e||e.signature!==vehicleSignature(b)){vehiclePrepare(b,true);return false;}e.seen=s.frame;e.used=performance.now();ctx.drawImage(e.image,ix(b.x+b.w/2,b.y+b.h/2)+e.r.x,iy(b.x+b.w/2,b.y+b.h/2)+e.r.y,e.r.w,e.r.h);return true;}
