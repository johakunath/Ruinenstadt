// Task 03: painted surfaces wrap actual P3 geometry once, including road rotation.
// Runtime uses one cached upright image: no ground-affine flattened verticals.
const VEHPALETTE={car:['green','burnt','blue'],trabi:['cream'],van:['blue','cream'],bus:['yellow'],tram:['yellow']};
const VEHMAX=40000000;let VEHSTATE=null;

function vehicleVariant(V){const a=VEHPALETTE[V.k];if(!a)return null;let n=0;for(let j=0;j<V.c.length;j++)n=(n*31+V.c.charCodeAt(j))>>>0;return a[n%a.length];}
function vehicleArtStats(){const decodedBytes=Object.keys(SPRITES).filter(k=>k.startsWith('vehicles/')).reduce((n,k)=>n+SPRITES[k].w*SPRITES[k].h*4,0),s=VEHSTATE;return{decodedBytes,canvasBytes:s?s.bytes:0,totalBytes:decodedBytes+(s?s.bytes:0),cached:s?s.items.size:0,limit:VEHMAX,pending:s?s.pending.size:0,evictions:s?s.evictions:0,maxAllocatedBytes:s?s.peak:decodedBytes};}
// Actual road jitter reaches beyond +/-45 degrees: select the visible opposite face there.
function vehicleVisible(){const a=bAx();return{south:a[0]>=-1e-9,east:a[2]<=1e-9};}
// Four corners, clockwise. Triangulate the planar frustum to keep its vertical
// and inset cabin geometry exact; only executed when a cache is first baked.
function vehicleQuad(i,a,b,c,d,flip=false,range=null){const w=i.width-2,h=i.height-2;
  function tri(p,q,r,u,v,t){const ux=q[0]-p[0],uy=q[1]-p[1],vx=r[0]-p[0],vy=r[1]-p[1],sx=v[0]-u[0],sy=v[1]-u[1],tx=t[0]-u[0],ty=t[1]-u[1],det=sx*ty-sy*tx,A=(ux*ty-vx*sy)/det,B=(uy*ty-vy*sy)/det,C=(vx*sx-ux*tx)/det,D=(vy*sx-uy*tx)/det;ctx.save();ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.lineTo(...r);ctx.closePath();ctx.clip();ctx.transform(A,B,C,D,p[0]-A*u[0]-C*u[1],p[1]-B*u[0]-D*u[1]);ctx.drawImage(i,1,1,w,h,0,0,w,h);ctx.restore();}
  const u0=(range?range[0]:flip?1:0)*w,u1=(range?range[1]:flip?0:1)*w;if(Math.abs(u1-u0)<1e-9)return;tri(a,b,d,[u0,0],[u1,0],[u0,h]);tri(b,c,d,[u1,0],[u1,h],[u0,h]);if(!range)poly([a,b,c,d],0,INK);
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
// Rounded visual shells stay inside the unchanged gameplay rectangle.
function vehicleRoundPoints(L,W,r){const p=[];r=Math.min(r,L/2,W/2);for(const[cx,cy,a]of[[L-r,r,-Math.PI/2],[L-r,W-r,0],[r,W-r,Math.PI/2],[r,r,Math.PI]])for(let i=0;i<=5;i++){const t=a+i*Math.PI/10;p.push([cx+Math.cos(t)*r,cy+Math.sin(t)*r]);}return p;}
function vehiclePoint(b,l,d,z){return P3(b.x+(b.veh.v?d:l),b.y+(b.veh.v?l:d),z);}
function vehicleRoundShell(b,o,d,L,W,z0,z1,r,li,si,images){const bottom=vehicleRoundPoints(L,W,r),top=vehicleRoundPoints(L-2*li,W-2*si,Math.max(1,r*.75)).map(p=>[p[0]+li,p[1]+si]),c=Math.cos(b.rot||0),s=Math.sin(b.rot||0),orientation=b.veh.v?-1:1;
  for(let i=0;i<bottom.length;i++){const j=(i+1)%bottom.length,a=bottom[i],n=bottom[j],dx=b.veh.v?n[1]-a[1]:n[0]-a[0],dy=b.veh.v?n[0]-a[0]:n[1]-a[1],nx=dy*orientation,ny=-dx*orientation;if(nx*(c+s)+ny*(c-s)<=1e-8)continue;const side=Math.abs(n[0]-a[0])>=Math.abs(n[1]-a[1]),u0=(side?a[0]/L:a[1]/W),u1=(side?n[0]/L:n[1]/W);vehicleQuad(images[side?0:1],vehiclePoint(b,o+top[i][0],d+top[i][1],z1),vehiclePoint(b,o+top[j][0],d+top[j][1],z1),vehiclePoint(b,o+n[0],d+n[1],z0),vehiclePoint(b,o+a[0],d+a[1],z0),false,[u0,u1]);}
  const roof=top.map(p=>vehiclePoint(b,o+p[0],d+p[1],z1));ctx.save();ctx.beginPath();roof.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.clip();vehicleQuad(images[2],vehiclePoint(b,o+li,d+si,z1),vehiclePoint(b,o+L-li,d+si,z1),vehiclePoint(b,o+L-li,d+W-si,z1),vehiclePoint(b,o+li,d+W-si,z1),false,[0,1]);ctx.restore();poly(roof,0,INK);}
function paintVehicle(b,images){const{x,y,w,h}=b,V=b.veh,k=V.k,big=k==='bus'||k==='tram',zt=7+(big?36:k==='van'?24:k==='trabi'?15:12),L=V.v?h:w;
  faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.35)');ibox(x+3,y+3,w-6,h-6,0,8,'#141010');
  const view=vehicleVisible();for(const f of [.17,.83]){if(V.v)wheel(view.east?x+w:x,y+h*f,6);else wheel(x+w*f,view.south?y+h:y,6);}
  if(!big){const W=V.v?w:h;if(k==='van'){vehicleRoundShell(b,0,0,L,W,7,43,9,1.5,1.5,images);return;}vehicleRoundShell(b,0,0,L,W,7,zt,k==='trabi'?10:6,0,0,images);const burnt=vehicleVariant(V)==='burnt',o=L*(k==='trabi'?.22:.25),cw=L*.52;vehicleRoundShell(b,o,3,cw,W-6,zt,zt+(burnt?7:k==='trabi'?12:11),5,k==='trabi'?4:6,2,[images[3],images[4],images[5]]);return;}
  vehicleFaces(b,images[0],images[1],images[2],7,zt);
  if(big){if(k==='tram'){const p=P3(x+w/2,y+h/2,zt),q=P3(x+w/2,y+h/2,zt+16);ctx.strokeStyle='#2a2622';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.moveTo(q[0]-8,q[1]);ctx.lineTo(q[0]+8,q[1]);ctx.stroke();}return;}

}

// Warm source images outside rendering. Scheduled jobs own all projected allocations.
if(typeof spriteReady!=='undefined')spriteReady.then(()=>{for(const k in SPRITES)if(k.startsWith('vehicles/'))spr(k);});
function vehicleRelease(e){e.image.width=e.image.height=0;}
function vehicleReset(map){if(VEHSTATE){for(const e of VEHSTATE.items.values())vehicleRelease(e);for(const j of VEHSTATE.pending.values())j.resolve(false);}VEHSTATE={map,items:new Map(),pending:new Map(),queue:[],blocked:new Map(),bytes:0,frame:0,view:null,scheduled:false,evictions:0,peak:0};return VEHSTATE;}
function vehicleState(){return !VEHSTATE||VEHSTATE.map!==blds?vehicleReset(blds):VEHSTATE;}
function vehicleBeginFrame(){const s=vehicleState(),key=[cam.x,cam.y,Z,DPR,SW,SH].join(',');s.frame++;if(s.view!==key){s.view=key;s.blocked.clear();}}
function vehicleScale(){return typeof DPR==='undefined'||typeof Z==='undefined'?3:Math.min(3,Math.max(1,Math.ceil(DPR*Z*4)/4));}
function vehicleSignature(b){const v=b.veh;return[vehicleScale(),b.rot||0,b.w,b.h,v.k,v.v,v.c].join(',');}
function vehicleBounds(b){let r;const prior=ROT;try{withRot(b,()=>{const cx=ix(b.x+b.w/2,b.y+b.h/2),cy=iy(b.x+b.w/2,b.y+b.h/2),H=b.veh.k==='tram'?60:b.veh.k==='bus'?44:b.veh.k==='van'?43:b.veh.k==='trabi'?37:35,p=[[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]].map(q=>P3(...q,0)),x=Math.floor(Math.min(...p.map(q=>q[0]))-cx-13),y=Math.floor(Math.min(...p.map(q=>q[1]))-cy-H-4);r={x,y,w:Math.ceil(Math.max(...p.map(q=>q[0]))-cx+13-x),h:Math.ceil(Math.max(...p.map(q=>q[1]))-cy+13-y)};});}finally{ROT=prior;}return r;}
function vehicleImages(b){const v=b.veh,variant=vehicleVariant(v);if(!variant)return null;const names=v.k==='bus'||v.k==='tram'?['side','end','top']:['side','end','top','glass-side','glass-end','roof'],a=names.map(n=>spr('vehicles/'+v.k+'-'+variant+'-'+n));return a.some(i=>!i)?null:a;}
function vehicleSchedule(s){if(!s.scheduled&&s.queue.length){s.scheduled=true;setTimeout(()=>vehicleCacheStep(s),0);}}
function vehicleCacheStep(s){if(s!==VEHSTATE)return;s.scheduled=false;const j=s.queue.shift();if(!j)return;const{b,resolve}=j,images=vehicleImages(b),r=vehicleBounds(b),scale=vehicleScale(),cost=Math.ceil(r.w*scale)*Math.ceil(r.h*scale)*4;let allowed=!!images&&cost+vehicleArtStats().decodedBytes<=VEHMAX;
  while(allowed&&vehicleArtStats().totalBytes+cost>VEHMAX){const candidates=[...s.items.entries()].filter(([,e])=>e.seen<s.frame).sort((a,b)=>a[1].used-b[1].used),victim=candidates[0];if(!victim){allowed=false;break;}s.bytes-=victim[1].bytes;vehicleRelease(victim[1]);s.items.delete(victim[0]);s.evictions++;}
  if(allowed){const image=cnv(r.w*scale,r.h*scale),prior=ctx,rot=ROT,cx=ix(b.x+b.w/2,b.y+b.h/2),cy=iy(b.x+b.w/2,b.y+b.h/2);try{ctx=image.getContext('2d');ctx.setTransform(scale,0,0,scale,-(cx+r.x)*scale,-(cy+r.y)*scale);withRot(b,()=>paintVehicle(b,images));}finally{ctx=prior;ROT=rot;}s.items.set(b,{image,r,bytes:image.width*image.height*4,signature:vehicleSignature(b),seen:j.visible&&j.view===s.view?s.frame:-1,used:0});s.bytes+=image.width*image.height*4;s.peak=Math.max(s.peak,vehicleArtStats().totalBytes);}else if(images&&j.visible)s.blocked.set(b,vehicleSignature(b));s.pending.delete(b);resolve(allowed);vehicleSchedule(s);}
function vehiclePrepare(b,visible=false){if(!b.veh||!VEHPALETTE[b.veh.k])return Promise.resolve(false);const s=vehicleState(),signature=vehicleSignature(b),hit=s.items.get(b);if(hit?.signature===signature)return Promise.resolve(true);if(s.blocked.get(b)===signature)return Promise.resolve(false);if(hit){s.bytes-=hit.bytes;vehicleRelease(hit);s.items.delete(b);}const old=s.pending.get(b);if(old){if(visible){old.visible=true;old.view=s.view;}return old.promise;}let resolve;const promise=new Promise(r=>resolve=r),j={b,visible,view:s.view,resolve,promise};s.pending.set(b,j);s.queue.push(j);vehicleSchedule(s);return promise;}
function vehicleCacheReady(b){return VEHSTATE?.items.get(b)?.signature===vehicleSignature(b);}
function drawVehicleArt(b){if(!b.veh||!VEHPALETTE[b.veh.k])return false;const s=vehicleState(),e=s.items.get(b);if(!e||e.signature!==vehicleSignature(b)){vehiclePrepare(b,true);return false;}e.seen=s.frame;e.used=performance.now();ctx.drawImage(e.image,ix(b.x+b.w/2,b.y+b.h/2)+e.r.x,iy(b.x+b.w/2,b.y+b.h/2)+e.r.y,e.r.w,e.r.h);return true;}
