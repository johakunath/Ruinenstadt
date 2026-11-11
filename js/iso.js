/* ================= iso: 2:1 isometric view =================
   Game logic, collision and map generation stay in flat world coords (x,y). Only drawing projects:
   screen = ((x-y)*IS, (x+y)*IS/2 - z). World rects become diamonds, roads run diagonal. Visible faces: south (y+h) and east (x+w).
   Layers in render(): ground (ctx under isoGround(), flat decals) and upright (ctx translated by OX,OY, sprites at ix/iy). */
const IS=Math.SQRT1_2;let OX=0,OY=0;const VB={x0:0,y0:0,x1:0,y1:0};
const ix=(x,y)=>(x-y)*IS,iy=(x,y)=>(x+y)*IS/2,scx=(x,y)=>ix(x,y)+OX,scy=(x,y)=>iy(x,y)+OY;
const s2w=(sx,sy)=>[(sx+2*sy)/(2*IS),(2*sy-sx)/(2*IS)];// screen vector -> world vector
const wAng=a=>{const q=s2w(Math.cos(a),Math.sin(a));return Math.atan2(q[1],q[0]);},sAng=a=>{const c=Math.cos(a),s=Math.sin(a);return Math.atan2((c+s)/2,c-s);};
const VIEWR=()=>Math.hypot(VW,VH*2)/2;// farthest visible world distance from the screen centre
function isoGround(){ctx.transform(IS,IS/2,-IS,IS/2,0,0);}
function upr(x,y,f){ctx.save();ctx.translate(ix(x,y)-x,iy(x,y)-y);f();ctx.restore();}// draw f (world coords around x,y) upright at the projected point
/* ---- boxes ---- */
// ROT: rotation around a box centre while drawing a rotated box (b.rot, radians, |rot|<45° so the south and east faces stay the visible ones)
let ROT=null;const rw=(x,y)=>ROT?[ROT.cx+(x-ROT.cx)*ROT.c-(y-ROT.cy)*ROT.s,ROT.cy+(x-ROT.cx)*ROT.s+(y-ROT.cy)*ROT.c]:[x,y];
const P3=(x,y,z)=>{if(ROT)[x,y]=rw(x,y);return[ix(x,y),iy(x,y)-z];},INK='rgba(12,8,6,.75)';
function withRot(b,f){if(!b.rot)return f();ROT={cx:b.x+b.w/2,cy:b.y+b.h/2,c:Math.cos(b.rot),s:Math.sin(b.rot)};try{f();}finally{ROT=null;}}
// screen basis of the box's local x and y axes (unit world vectors projected)
const bAx=()=>{const c=ROT?ROT.c:1,s=ROT?ROT.s:0;return[(c-s)*IS,(c+s)*IS/2,(-s-c)*IS,(c-s)*IS/2];};
function poly(p,f,s){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=1;ctx.stroke();}}
const faceS=(x,y,w,h,z0,z1,f,s)=>poly([P3(x,y+h,z0),P3(x+w,y+h,z0),P3(x+w,y+h,z1),P3(x,y+h,z1)],f,s),faceE=(x,y,w,h,z0,z1,f,s)=>poly([P3(x+w,y+h,z0),P3(x+w,y,z0),P3(x+w,y,z1),P3(x+w,y+h,z1)],f,s),
  faceT=(x,y,w,h,z,f,s)=>poly([P3(x,y,z),P3(x+w,y,z),P3(x+w,y+h,z),P3(x,y+h,z)],f,s);
function ibox(x,y,w,h,z0,z1,c,s,top){faceS(x,y,w,h,z0,z1,c,s);faceE(x,y,w,h,z0,z1,dark(c,.62),s);faceT(x,y,w,h,z1,top||dark(c,1.15),s);}
const isBox=b=>!!(b.veh||(b.h>0&&b.H>0&&!b.bb)),bR0=b=>b.R0!=null?b.R0:b.top-b.H,bHs=b=>(b.FH||b.H)*(b.vs||1),boxTop=b=>b.veh?70:bHs(b)+bR0(b)*(b.vs||1)+(b.gable||0);
// building from its old 3/4 sprite: rows [0,R0) extra (towers), [R0,R0+h) roof, then FH rows facade. Roof goes on the top face, facade on south and (shaded) east face.
function drawBox(b){const x=b.x,y=b.y,w=b.w,h=b.h,s=b.spr,vs=b.vs||1,FH=b.FH||b.H,Hs=FH*vs,R0=bR0(b);
  if(typeof drawKoepBuilding==='function'&&D===DIST[0]&&drawKoepBuilding(b))return;
  if(drawGdrBuilding(b))return;
  faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.25)');
  const[ux,uy,vx,vy]=bAx(),o=(a,c,z)=>P3(a,c,z);
  {const q=o(x,y+h,Hs);ctx.save();ctx.transform(ux,uy,0,vs,q[0],q[1]);ctx.drawImage(s,0,R0+h,w,FH,0,0,w,FH);ctx.restore();}
  {const q=o(x+w,y+h,Hs);ctx.save();ctx.transform(-vx,-vy,0,vs,q[0],q[1]);if(b.ef)ctx.drawImage(b.ef,0,0,b.ef.width,b.ef.height,0,0,h,FH);else{const sw=Math.min(w,h*1.5);ctx.drawImage(s,w-sw,R0+h,sw,FH,0,0,h,FH);}ctx.restore();}faceE(x,y,w,h,0,Hs,'rgba(8,5,4,.42)');
  faceS(x,y,w,h,0,Hs*.35,'rgba(8,5,4,.18)');
  if(b.gable){gableRoof(b,Hs);return;}
  {const q=o(x,y,Hs);ctx.save();ctx.transform(ux,uy,vx,vy,q[0],q[1]);ctx.drawImage(s,0,R0,w,h,0,0,w,h);ctx.restore();}
  if(R0>0){const q=o(x,y+h*.5,Hs+R0*vs);ctx.save();ctx.transform(ux,uy,0,vs,q[0],q[1]);ctx.drawImage(s,0,0,w,R0,0,0,w,R0);ctx.restore();}
  faceS(x,y,w,h,0,Hs,0,INK);faceE(x,y,w,h,0,Hs,0,INK);faceT(x,y,w,h,Hs,0,INK);drawGdrDecorations(b);}
// gable roof, ridge along world x at y+h/2: back slope, front slope with tile rows, east gable triangle. Overhang 4 units
function gableRoof(b,Hs){const{x,y,w,h}=b,G_=b.gable,o=4,rc=b.rc||'#6a3a2a',ym=y+h/2,Z=Hs+G_;faceS(x,y,w,h,0,Hs,0,INK);faceE(x,y,w,h,0,Hs,0,INK);
  const tri=[P3(x+w,y,Hs),P3(x+w,y+h,Hs),P3(x+w,ym,Z)];poly(tri,b.wc||'#b8a888');poly(tri,'rgba(8,5,4,.42)',INK);
  poly([P3(x-o,y-o,Hs-2),P3(x+w+o,y-o,Hs-2),P3(x+w+o,ym,Z),P3(x-o,ym,Z)],dark(rc,.8),INK);
  poly([P3(x-o,ym,Z),P3(x+w+o,ym,Z),P3(x+w+o,y+h+o,Hs-2),P3(x-o,y+h+o,Hs-2)],rc,INK);
  ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1;for(let f=.2;f<1;f+=.2){const a=P3(x-o,ym+(h/2+o)*f,Z-(G_+2)*f),c=P3(x+w+o,ym+(h/2+o)*f,Z-(G_+2)*f);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(c[0],c[1]);ctx.stroke();}
  const r0=P3(x-o,ym,Z),r1=P3(x+w+o,ym,Z);ctx.strokeStyle='rgba(255,230,200,.18)';ctx.beginPath();ctx.moveTo(r0[0],r0[1]);ctx.lineTo(r1[0],r1[1]);ctx.stroke();
  if(b.w>140&&!b.chim)b.chim=R(.15,.85);if(b.chim){const cx=x+w*b.chim;ibox(cx,ym-14,10,10,Z-G_*.5,Z+10,'#5a3a2e',INK);}}
// upright sprite (tree, lamp, Litfaßsäule, crane): base row at b.top, anchored at the footprint centre
function drawBB(b){const s=b.spr,sc=b.sc||1,ax=b.x+b.w/2,X=ix(ax,b.y),Y=iy(ax,b.y);ctx.drawImage(s,X-s.width*sc/2,Y-b.top*sc,s.width*sc,s.height*sc);}
// light position (x,y on the ground, z height in screen px) for lights stored in the old 3/4 sprite coordinates
function lpos(b,l){if(l.z!=null)return[l.x,l.y,l.z];if(l.inner)return[l.x,l.y,0];if(isBox(b)){const z=Math.max(0,b.y+b.h-l.y)*(b.vs||1);let p=[clamp(l.x,b.x,b.x+b.w),b.y+b.h];if(b.rot){ROT={cx:b.x+b.w/2,cy:b.y+b.h/2,c:Math.cos(b.rot),s:Math.sin(b.rot)};p=rw(p[0],p[1]);ROT=null;}return[p[0],p[1],z];}return[l.x,b.y,Math.max(0,b.y-l.y)*(b.sc||1)];}
/* ---- vehicles: iso boxes. b={x,y,w,h,veh:{k,c,v}} ---- */
function addVeh(x,y,w,h,v,k){const c=k==='bus'?'#d8a818':k==='tram'?'#d6b436':k==='trabi'?pick(['#8ab0a8','#c8b890','#a87a6a','#7a8aa8','#d6cfc0']):k==='van'?pick(['#c8c0b0','#5a7a8a','#8a4a32']):pick(['#6b3a24','#4a4038','#5c4a2e','#55524c','#5a2e22','#3a4a5a']);
  const g=gx;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-3,y-3,w+6,h+6);for(let i=0;i<4;i++){g.fillStyle='rgba(20,10,5,.35)';g.beginPath();g.ellipse(x+R(0,w),y+R(0,h),R(6,14),R(4,9),R(0,3),0,7);g.fill();}
  blds.push({x,y,w,h,H:1,top:0,lights:[],veh:{k,c,v,rust:Array.from({length:6},()=>[R(.1,.9),R(.1,.9),R(.05,.14)]),br:Math.random()<.4}});}
// cabin: frustum from (x,y,w,h) at z0 to an inset top at z1; li/si: inset along x and y
function frust(x,y,w,h,z0,z1,li,si,side,top){const B=(a,b)=>P3(a,b,z0),T=(a,b)=>P3(a,b,z1),x1=x+w,y1=y+h,u0=x+li,u1=x1-li,v0=y+si,v1=y1-si;
  poly([B(x,y1),B(x1,y1),T(u1,v1),T(u0,v1)],side,INK);poly([B(x1,y1),B(x1,y),T(u1,v0),T(u1,v1)],dark(side,.7),INK);poly([T(u0,v0),T(u1,v0),T(u1,v1),T(u0,v1)],top,INK);}
function wheel(x,y,z){const p=P3(x,y,z);ctx.fillStyle='#0b0908';ctx.beginPath();ctx.ellipse(p[0],p[1],5.5,5,0,0,7);ctx.fill();ctx.fillStyle='#3a3632';ctx.beginPath();ctx.ellipse(p[0],p[1],2.2,2,0,0,7);ctx.fill();}
function drawVehBox(b){if(typeof drawVehicleArt==='function'&&drawVehicleArt(b))return;const{x,y,w,h}=b,V=b.veh,k=V.k,c=V.c,big=k==='bus'||k==='tram',hb=big?36:k==='van'?24:k==='trabi'?11:12,z0=big?7:7,zt=z0+hb,L=V.v?h:w;
  faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.35)');ibox(x+3,y+3,w-6,h-6,0,z0+1,'#141010');
  for(const f of [.17,.83]){if(V.v)wheel(x+w,y+h*f,6);else wheel(x+w*f,y+h,6);}
  ibox(x,y,w,h,z0,zt,c,INK);
  for(const r of V.rust.slice(0,big?6:3)){ctx.fillStyle=big?'rgba(110,55,25,.16)':'rgba(110,55,25,.32)';ctx.beginPath();const p=P3(x+w*r[0],y+h*r[1],zt),rr_=Math.min(w,h)*r[2]*.8+2;ctx.ellipse(p[0],p[1],rr_,rr_*.5,0,0,7);ctx.fill();}
  if(big){const gl='#1a2024',a=zt-16,b2=zt-5;faceS(x,y,w,h,a,b2,gl);faceE(x,y,w,h,a,b2,dark(gl,.8));
    for(let i=12;i<L-8;i+=24){if(V.v)faceE(x,y+i,w,3,a,b2,dark(c,.62));else faceS(x+i,y,3,h,a,b2,c);}
    faceS(x,y,w,h,z0+3,z0+6,k==='bus'?'#a02a20':'#3a3a36');faceE(x,y,w,h,z0+3,z0+6,k==='bus'?'#701c16':'#2a2a26');
    if(k==='tram'){const p=P3(x+w/2,y+h/2,zt),q=P3(x+w/2,y+h/2,zt+16);ctx.strokeStyle='#2a2622';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.moveTo(q[0]-8,q[1]);ctx.lineTo(q[0]+8,q[1]);ctx.stroke();}
    faceT(x+4,y+4,w-8,h-8,zt,'rgba(0,0,0,.12)');return;}
  const gl=V.br?'#0e0c0a':'#232b30',ch=k==='trabi'?10:11;
  if(k==='van'){const o=L*.06,cw=L*.86;if(V.v)frust(x+2,y+o,w-4,cw,zt,zt+12,2,8,gl,dark(c,1.1));else frust(x+o,y+2,cw,h-4,zt,zt+12,8,2,gl,dark(c,1.1));return;}
  const o=L*(k==='trabi'?.3:.28),cw=L*.46;if(V.v)frust(x+3,y+o,w-6,cw,zt,zt+ch,3,cw*.2,gl,dark(c,1.1));else frust(x+o,y+3,cw,h-6,zt,zt+ch,cw*.2,3,gl,dark(c,1.1));}
