/* ================= vfx: asset-free effects, daylight, shadows (v0.62) =================
   fx[] holds short-lived glow primitives in world coords (x,y on the ground, z = screen px above it). They are drawn additively AFTER the
   darkness overlay (fxDraw in render()), so they glow through the night, and each can punch its own light (f.l, fxLight).
   k 0 flash (glow sprite), 1 ground ring, 2 spark (streak with gravity; D.cyber: square pixel without gravity).
   Colours come from FXC(): warm embers by default, cyan/magenta in D.cyber, sun-bleached in D.day. Spawn through the fx* helpers, never push raw.
   How to add an effect: pipeline/tasks/08-vfx-rollout.md */
let fx=[],SWN=0;
const FXP={warm:{sw:'#FAC775',fin:'#ffe68c',hv:'#EF9F27',hit:'#ffd9a0',crit:'#fff3c4',kill:'#ff8a3d',alt:null},cyber:{sw:'#43d1ff',fin:'#e8fbff',hv:'#b48cff',hit:'#8fe6ff',crit:'#ffffff',kill:'#ff4fa3',alt:'#ff4fa3'}},FXC=()=>D.cyber?FXP.cyber:FXP.warm,FXN=n=>S.eco?Math.ceil(n/2):n;
function fxAdd(f){f.max=f.life;fx.push(f);if(fx.length>260)fx.splice(0,fx.length-260);return f;}
// flash: glow from s0 to s1 px radius. l: light radius punched into the darkness
function fxFlash(x,y,z,col,s0,s1,life,l){return fxAdd({k:0,x,y,z,col,s0,s1,life,l});}
function fxRing(x,y,col,r1,life,w){return fxAdd({k:1,x,y,z:0,col,r1,life,w:w||4});}
// sparks: n streaks from (x,y,z); a: world direction, spr: spread in radians (6.3 = all round), sp: speed
function fxSparks(x,y,z,col,n,sp,a,spr){n=FXN(n);for(let i=0;i<n;i++){const q=(a||0)+R(-.5,.5)*(spr==null?6.3:spr),s=R(.35,1)*sp;fxAdd({k:2,x,y,z,col,vx:Math.cos(q)*s,vy:Math.sin(q)*s,vz:R(20,150),life:R(.18,.42),s:R(1.2,2.4)});}}
// example effects: weapon impact, kill burst, cast/explosion pulse
function fxHit(e,crit,col){const c=FXC(),a=Math.atan2(e.y-P.y,e.x-P.x),k=crit?1.5:1;fxFlash(e.x,e.y,e.r+8,col||(crit?c.crit:c.hit),e.r*.8*k,e.r*2.6*k,crit?.16:.11,crit?90:50);fxSparks(e.x,e.y,e.r+8,col||c.hit,crit?10:5,crit?320:230,a,1.5);if(crit)fxRing(e.x,e.y,col||c.crit,e.r*3.2,.2,3);}
function fxKill(e){const c=FXC();fxFlash(e.x,e.y,e.r,c.kill,e.r,e.r*3.4,.2,80);fxRing(e.x,e.y,c.kill,e.r*3.6,.28,3);fxSparks(e.x,e.y,e.r,c.kill,e.type==='boss'?26:8,260);}
function fxPulse(x,y,col,r){fxFlash(x,y,10,col,r*.3,r*1.1,.22,r*1.4);fxRing(x,y,col,r,.3,5);fxSparks(x,y,8,col,10,r*2.4);}
function fxUpdate(dt){for(const f of fx){f.life-=dt;if(f.k===2){f.x+=f.vx*dt;f.y+=f.vy*dt;if(D.cyber){f.vx*=.9;f.vy*=.9;}else{f.z+=f.vz*dt;f.vz-=520*dt;if(f.z<0){f.z=0;f.vz*=-.35;f.vx*=.5;f.vy*=.5;}}}}fx=fx.filter(f=>f.life>0);}
function fxLight(lit){for(const f of fx)if(f.l)lit(f.x,f.y,f.l*f.life/f.max,f.z);if(swings.length)lit(P.x,P.y,90,12);}
/* swings: crescent that sweeps the hit arc and fades from behind (sword, hammer), thrust wedge (spear). Drawn on the ground plane at weapon height.
   D.cyber adds a magenta fringe. The hit arc itself is unchanged (attack() in js/combat.js), the crescent stays inside it. */
function fxSwings(){if(!swings.length)return;const c=FXC();ctx.save();ctx.translate(OX,OY-12);isoGround();
  for(const s of swings){if(s.d==null){s.d=(SWN++&1)?-1:1;s.life+=.09;s.max+=.09;if(s.kind==='hammer')fxRing(P.x+Math.cos(s.a)*s.reach*.7,P.y+Math.sin(s.a)*s.reach*.7,c.hv,s.reach*.6,.25,5);}
    const a=s.life/s.max,p=1-a,fade=Math.min(1,a*2.4),col=s.fin?c.fin:s.kind==='hammer'?c.hv:c.sw;
    if(s.kind==='spear'){const cs=Math.cos(s.a),sn=Math.sin(s.a),h=20+(s.reach-20)*Math.min(1,p/.35),tl=20+(s.reach-20)*clamp((p-.2)/.8,0,1),w=s.fin?9:6;
      for(const[cc,o,al]of c.alt?[[c.alt,3,.5],[col,0,1]]:[[col,0,1]]){ctx.globalAlpha=fade*al*.8;ctx.fillStyle=cc;ctx.beginPath();ctx.moveTo(P.x+cs*tl-sn*(w+o),P.y+sn*tl+cs*(w+o));ctx.lineTo(P.x+cs*(h+o*2),P.y+sn*(h+o*2));ctx.lineTo(P.x+cs*tl+sn*(w+o),P.y+sn*tl-cs*(w+o));ctx.fill();}
      ctx.globalAlpha=fade;ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(P.x+cs*tl,P.y+sn*tl);ctx.lineTo(P.x+cs*h,P.y+sn*h);ctx.stroke();ctx.drawImage(glow(col),P.x+cs*h-16,P.y+sn*h-16,32,32);continue;}
    const hd=Math.min(1,p/.4),h=1-(1-hd)*(1-hd),tl=clamp((p-.22)/.78,0,1),A=u=>s.a+s.arc*s.d*(2*u-1),Rr=s.reach-6,W=(s.kind==='hammer'?26:17)+(s.fin?7:0),N=6;if(h<=tl)continue;
    for(const[cc,o,al]of c.alt?[[c.alt,4,.45],[col,0,1]]:[[col,0,1]])for(let i=0;i<N;i++){const u0=tl+(h-tl)*i/N,u1=tl+(h-tl)*(i+1)/N,w=W*(.2+.8*(i+1)/N);ctx.globalAlpha=fade*al*.75*Math.pow((i+1)/N,1.6);ctx.fillStyle=cc;ctx.beginPath();ctx.arc(P.x,P.y,Rr+o,A(u0),A(u1),s.d<0);ctx.arc(P.x,P.y,Rr+o-w,A(u1),A(u0),s.d>0);ctx.fill();}
    ctx.globalAlpha=fade*.9;ctx.strokeStyle='#fff';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(P.x,P.y,Rr,A(tl+(h-tl)*.35),A(h),s.d<0);ctx.stroke();
    if(hd<1){const q=A(h);ctx.drawImage(glow(col),P.x+Math.cos(q)*Rr-18,P.y+Math.sin(q)*Rr-18,36,36);}}
  ctx.globalAlpha=1;ctx.restore();}
// additive pass, screen space, ctx is already 'lighter'. Order: ground rings, swings, projectile trails, bolts, sparks, flashes
function fxDraw(t){const c=FXC(),cy=D.cyber;
  for(const s of shocks){const X=scx(s.x,s.y),Y=scy(s.x,s.y);if(X<-s.r||X>VW+s.r||s.r<=0)continue;ctx.globalAlpha=.55*(1-s.r/s.max);ctx.strokeStyle=s.acid?'#97c459':c.hv;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(X,Y,s.r,s.r/2,0,0,7);ctx.stroke();}
  for(const r of rings){if(r.r<=0)continue;ctx.globalAlpha=.5*(1-r.r/r.max);ctx.strokeStyle=`rgb(${r.col})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(scx(r.x,r.y),scy(r.x,r.y),r.r,r.r/2,0,0,7);ctx.stroke();}
  for(const f of fx)if(f.k===1){const a=f.life/f.max,r=f.r1*(1-a*a);ctx.globalAlpha=a;ctx.strokeStyle=f.col;ctx.lineWidth=f.w*a+.5;ctx.beginPath();ctx.ellipse(scx(f.x,f.y),scy(f.x,f.y),r,r/2,0,0,7);ctx.stroke();if(cy){ctx.globalAlpha=a*.5;ctx.strokeStyle=c.alt;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(scx(f.x,f.y),scy(f.x,f.y),r*.8,r*.4,0,0,7);ctx.stroke();}}
  ctx.globalAlpha=1;fxSwings();
  // projectile trails: stateless, glows stepped back along the velocity
  for(const p of pproj){const X=scx(p.x,p.y),Y=scy(p.x,p.y)-14,g=glow(p.fin?'#f2d14b':p.el?ELC[p.el]:p.spear?c.fin:c.sw),dx=ix(p.vx,p.vy)*.012,dy=iy(p.vx,p.vy)*.012,r=(p.r||4)*2.6;if(X<-60||X>VW+60||Y<-60||Y>VH+60)continue;for(let k=0;k<(S.eco?3:5);k++){const q=r*(1-k*.15);ctx.globalAlpha=.7-k*.13;ctx.drawImage(g,X-dx*k-q,Y-dy*k-q,q*2,q*2);}}
  for(const p of eproj){if(p.seed||p.gear)continue;const X=scx(p.x,p.y),Y=scy(p.x,p.y)-10,g=glow('#97c459'),dx=ix(p.vx,p.vy)*.016,dy=iy(p.vx,p.vy)*.016,r=p.r*2.4;if(X<-60||X>VW+60||Y<-60||Y>VH+60)continue;for(let k=1;k<4;k++){const q=r*(1-k*.2);ctx.globalAlpha=.5-k*.11;ctx.drawImage(g,X-dx*k-q,Y-dy*k-q,q*2,q*2);}}
  // bolts: wide coloured stroke + white core over the base line, glow at the target
  for(const b of bolts){const a=Math.min(1,b.life/.16),x0=scx(b.x0,b.y0),y0=scy(b.x0,b.y0),x1=scx(b.x1,b.y1),y1=scy(b.x1,b.y1),col=cy?'#43d1ff':'#7dd3ff';ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<6;i++){const f=i/6;ctx.lineTo(x0+(x1-x0)*f+R(-7,7),y0+(y1-y0)*f+R(-7,7));}ctx.lineTo(x1,y1);ctx.globalAlpha=a*.5;ctx.strokeStyle=col;ctx.lineWidth=6;ctx.stroke();ctx.globalAlpha=a;ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();ctx.drawImage(glow(col),x1-22,y1-22,44,44);}
  for(const f of fx)if(f.k===2){const a=f.life/f.max,X=scx(f.x,f.y),Y=scy(f.x,f.y)-f.z;ctx.globalAlpha=a;if(cy){ctx.fillStyle=(f.s>1.8?c.alt:f.col);const q=f.s*1.6;ctx.fillRect(Math.round(X-q/2),Math.round(Y-q/2),q,q);continue;}ctx.strokeStyle=f.col;ctx.lineWidth=f.s;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X-ix(f.vx,f.vy)*.035,Y-iy(f.vx,f.vy)*.035+f.vz*.035);ctx.stroke();}
  for(const f of fx)if(f.k===0){const a=f.life/f.max,s=f.s1+(f.s0-f.s1)*a*a,X=scx(f.x,f.y),Y=scy(f.x,f.y)-f.z;ctx.globalAlpha=a;ctx.drawImage(glow(f.col),X-s,Y-s,s*2,s*2);if(cy)ctx.drawImage(glow(f.col),X-s*2.2,Y-s*.18,s*4.4,s*.36);}// cyber: horizontal lens streak
  ctx.globalAlpha=1;}
/* ---- shadows: sun/moon from screen top-left, so they fall along world +x (screen: right and slightly down). Long and soft by day, short at night ---- */
const SHA=.4636,SHL=()=>D.day&&!P.dark?.85:.3;
// blob shadow for anything without a silhouette: r foot radius, h body height in px
function fxShadow(x,y,r,h){const L=SHL()*(h||r*3.2),c=Math.cos(SHA),s=Math.sin(SHA);ctx.fillStyle=D.day?'rgba(20,16,40,.3)':'rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(x+c*L/2,y+s*L/2,L/2+r*1.05,r*.38,SHA,0,7);ctx.fill();}
// silhouette shadow of a painted sprite: the frame, tinted black once (cached), laid flat along the light. i: image, m: manifest entry, sc: draw scale, fl: mirror
const SIL={};function fxSil(key,i,m,x,y,sc,fl){let c=SIL[key];if(!c){c=SIL[key]=cnv(m.w,m.h);const g=c.getContext('2d');g.drawImage(i,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#000';g.fillRect(0,0,m.w,m.h);}
  const L=SHL()+.12;ctx.save();ctx.globalAlpha*=D.day?.3:.38;ctx.translate(x,y);ctx.transform(1,0,-L*Math.cos(SHA),-L*Math.sin(SHA),0,0);ctx.scale(fl*sc,sc);ctx.drawImage(c,-m.anchor[0]/m.units,-m.anchor[1]/m.units,m.w/m.units,m.h/m.units);ctx.restore();}
/* ---- daylight (D.day): drawn into the half-resolution light canvas after the lamps are punched, so it costs no extra full-screen pass.
   warm sun wash top-left to cool shade bottom-right, drifting cloud shadows (world-anchored), slow sun shafts along the light direction ---- */
let DAYG=null,CLD=null,SHAFT=null;
function fxDay(t){if(!D.day||P.dark)return;if(!DAYG){DAYG=cnv(64,64);let g=DAYG.getContext('2d'),gr=g.createLinearGradient(0,0,64,48);gr.addColorStop(0,'rgba(255,206,130,.26)');gr.addColorStop(.45,'rgba(255,206,130,0)');gr.addColorStop(.6,'rgba(26,30,72,0)');gr.addColorStop(1,'rgba(26,30,72,.2)');g.fillStyle=gr;g.fillRect(0,0,64,64);
    CLD=radial([[0,'rgba(22,26,60,.27)'],[.55,'rgba(22,26,60,.17)'],[1,'rgba(22,26,60,0)']]);SHAFT=cnv(4,64);g=SHAFT.getContext('2d');gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'rgba(255,220,150,0)');gr.addColorStop(.5,'rgba(255,220,150,.26)');gr.addColorStop(1,'rgba(255,220,150,0)');g.fillStyle=gr;g.fillRect(0,0,4,64);}
  lx.globalCompositeOperation='source-over';lx.drawImage(DAYG,0,0,VW,VH);
  const W=1500;for(let i=0;i<5;i++){const bx=i*613+t*.018,by=i*937+t*.007,wx=cam.x+((bx-cam.x)%W+W*1.5)%W-W/2,wy=cam.y+((by-cam.y)%W+W*1.5)%W-W/2,X=scx(wx,wy),Y=scy(wx,wy),rw_=300+i%3*90;if(X<-rw_||X>VW+rw_||Y<-rw_*.5||Y>VH+rw_*.5)continue;lx.drawImage(CLD,X-rw_,Y-rw_*.5,rw_*2,rw_);}
  if(S.eco)return;lx.save();lx.rotate(SHA);const D_=Math.hypot(VW,VH),o=(scx(0,0)*-.447+scy(0,0)*.894)*.35;for(let k=0;k<4;k++){const h=70+k%2*60,y=((k*211+t*.006+o)%D_+D_)%D_-VW*.45;lx.globalAlpha=.55+.45*Math.sin(t*.0006+k*1.9);lx.drawImage(SHAFT,0,y,D_*1.2,h);}lx.restore();lx.globalAlpha=1;}
