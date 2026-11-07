/* ================= render ================= */
function drawBarrel(b,t){const x=b.x,y=b.y;ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(x+3,y+4,11,5,0,0,7);ctx.fill();
  ctx.fillStyle='#4a2414';ctx.fillRect(x-8,y-14,16,16);ctx.fillStyle='#6b3a24';ctx.fillRect(x-8,y-14,5,16);ctx.fillStyle='#2a140b';ctx.fillRect(x-8,y-9,16,2);ctx.fillRect(x-8,y-3,16,2);
  ctx.fillStyle='#1a0d07';ctx.beginPath();ctx.ellipse(x,y-14,8,3.5,0,0,7);ctx.fill();
  for(let k=0;k<4;k++){const h=9+Math.sin(t*.018+b.ph+k*1.7)*4+Math.sin(t*.031+k)*2,fx=x-6+k*4;ctx.fillStyle=k%2?'#EF9F27':'#FAC775';ctx.beginPath();ctx.moveTo(fx-3,y-14);ctx.lineTo(fx+3,y-14);ctx.lineTo(fx+Math.sin(t*.02+k)*2,y-14-h);ctx.fill();}}
let last=performance.now();
function render(t){
  ctx.setTransform(DPR*Z,0,0,DPR*Z,0,0);ctx.globalCompositeOperation='source-over';
  const tx=P.x+(state==='play'?P.mvx*80:0),ty=P.y+(state==='play'?P.mvy*80:0);if(cam.x==null||Math.hypot(cam.x-tx,cam.y-ty)>600){cam.x=tx;cam.y=ty;}else{cam.x+=(tx-cam.x)*.12;cam.y+=(ty-cam.y)*.12;}
  OX=VW/2-ix(cam.x,cam.y)+R(-shake,shake);OY=VH/2-iy(cam.x,cam.y)+24+R(-shake,shake);
  {const c=[[0,0],[VW,0],[0,VH],[VW,VH]].map(q=>s2w(q[0]-OX,q[1]-OY));VB.x0=Math.min(...c.map(q=>q[0]));VB.x1=Math.max(...c.map(q=>q[0]));VB.y0=Math.min(...c.map(q=>q[1]));VB.y1=Math.max(...c.map(q=>q[1]));}
  ctx.fillStyle='#17110d';ctx.fillRect(0,0,VW,VH);
  ctx.save();ctx.translate(OX,OY);
  /* ---- ground layer: flat decals in world coords ---- */
  ctx.save();isoGround();
  {const x0=clamp(Math.floor(VB.x0),0,WS),y0=clamp(Math.floor(VB.y0),0,WS),x1=clamp(Math.ceil(VB.x1),0,WS),y1=clamp(Math.ceil(VB.y1),0,WS);if(x1>x0&&y1>y0)ctx.drawImage(G,x0,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0);}
  drawWaters(t);
  for(const tl of teles){const p=1-tl.t/tl.max;ctx.fillStyle=`rgba(194,58,46,${.12+.25*p})`;ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r,0,7);ctx.fill();ctx.strokeStyle='rgba(255,140,90,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r,0,7);ctx.stroke();ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r*p,0,7);ctx.stroke();}
  for(const r of rings){ctx.strokeStyle=`rgba(${r.col},${.7*(1-r.r/r.max)})`;ctx.lineWidth=6;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,7);ctx.stroke();}
  for(const s of shocks){ctx.strokeStyle=s.acid?`rgba(151,196,89,${1-s.r/s.max})`:`rgba(239,159,39,${1-s.r/s.max})`;ctx.lineWidth=10;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.stroke();}
  for(const f of fields){ctx.globalAlpha=Math.min(1,f.t);ctx.drawImage(glow('#ff6a2a'),f.x-f.r*1.2,f.y-f.r*.75,f.r*2.4,f.r*1.5);ctx.globalAlpha=1;}
  for(const e of enemies)if(e.ch>0){ctx.strokeStyle=`rgba(255,80,60,${.3+.6*(1-e.ch/.6)})`;ctx.lineWidth=3;ctx.setLineDash([10,6]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+e.rdx*240,e.y+e.rdy*240);ctx.stroke();ctx.setLineDash([]);}
  if(zone){ctx.fillStyle='rgba(125,211,255,.08)';ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r,0,7);ctx.fill();ctx.strokeStyle='rgba(125,211,255,.5)';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#7dd3ff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r-6,-1.57,-1.57+6.283*zone.p/zone.need);ctx.stroke();}
  for(const h of shrines)if(!h.used){const a=.25+.15*Math.sin(t*.004+h.x);ctx.strokeStyle=`rgba(125,211,255,${a})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x,h.y,30,0,7);ctx.stroke();}
  for(const c of corpses){ctx.globalAlpha=Math.min(1,c.t)*.85;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(-.78);ctx.scale(c.fl*c.r/10,c.r/10);ctx.fillStyle='rgba(40,12,6,.5)';ctx.beginPath();ctx.ellipse(0,2,15,5,0,0,7);ctx.fill();
    ctx.fillStyle=dark(c.col,.6);ctx.beginPath();ctx.ellipse(0,0,11,4.5,0,0,7);ctx.fill();ctx.fillStyle=dark(c.col,.45);ctx.beginPath();ctx.arc(11,-1,4,0,7);ctx.fill();ctx.restore();}ctx.globalAlpha=1;
  for(const h of hazards){ctx.globalAlpha=Math.min(1,h.t);ctx.drawImage(glow(h.col||'#ff6a2a'),h.x-h.r*1.2,h.y-h.r*1.2,h.r*2.4,h.r*2.4);}ctx.globalAlpha=1;
  if(trove){const a=.5+.3*Math.sin(t*.008);ctx.strokeStyle=`rgba(242,209,75,${a})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(trove.x-14,trove.y-14);ctx.lineTo(trove.x+14,trove.y+14);ctx.moveTo(trove.x+14,trove.y-14);ctx.lineTo(trove.x-14,trove.y+14);ctx.stroke();ctx.strokeStyle='#f2d14b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(trove.x,trove.y,26,-1.57,-1.57+6.283*trove.t/50);ctx.stroke();}
  if(crate){ctx.strokeStyle='#f2d14b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(crate.x,crate.y,26,-1.57,-1.57+6.283*crate.t/28);ctx.stroke();}
  if(P.spin>0){ctx.strokeStyle='rgba(250,199,117,.75)';ctx.lineWidth=5;const a=t*.03,rr_=72*(1+.2*pk('reach'));for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(P.x,P.y,rr_,a+k*2.09,a+k*2.09+1.1);ctx.stroke();}}
  for(const s of swings){const a=s.life/s.max;if(s.kind==='spear'){const c=Math.cos(s.a),sn=Math.sin(s.a),p=1-a,r0=20+p*20;ctx.strokeStyle=s.fin?`rgba(255,230,140,${a})`:`rgba(250,199,117,${a})`;ctx.lineWidth=s.fin?7:4;ctx.beginPath();ctx.moveTo(P.x+c*r0,P.y+sn*r0);ctx.lineTo(P.x+c*s.reach,P.y+sn*s.reach);ctx.stroke();continue;}ctx.strokeStyle=s.fin?`rgba(255,230,140,${a})`:s.kind==='hammer'?`rgba(239,159,39,${a*.8})`:`rgba(250,199,117,${a})`;ctx.lineWidth=(s.kind==='hammer'?9:5)+(s.fin?5:0);ctx.beginPath();ctx.arc(P.x,P.y,s.reach-10,s.a-s.arc,s.a+s.arc);ctx.stroke();}
  ctx.lineWidth=2;for(const b of bolts){ctx.strokeStyle=`rgba(125,211,255,${b.life/.16})`;ctx.beginPath();ctx.moveTo(b.x0,b.y0);for(let i=1;i<6;i++){const f=i/6;ctx.lineTo(b.x0+(b.x1-b.x0)*f+R(-6,6),b.y0+(b.y1-b.y0)*f+R(-6,6));}ctx.lineTo(b.x1,b.y1);ctx.stroke();}
  ctx.restore();
  /* ---- upright layer ---- */
  for(const d of drops)upr(d.x,d.y,()=>drawDrop(d));
  if(trove)upr(trove.x,trove.y,()=>{ctx.fillStyle='rgba(242,209,75,.14)';ctx.fillRect(trove.x-4,trove.y-110,8,110);});
  if(crate)upr(crate.x,crate.y,()=>{ctx.fillStyle='rgba(242,209,75,.18)';ctx.fillRect(crate.x-5,crate.y-120,10,120);ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(crate.x-10,crate.y+6,24,6);
    ctx.fillStyle='#7a5530';ctx.fillRect(crate.x-12,crate.y-12,24,22);ctx.strokeStyle='#3a2414';ctx.lineWidth=2;ctx.strokeRect(crate.x-12,crate.y-12,24,22);ctx.beginPath();ctx.moveTo(crate.x-12,crate.y-12);ctx.lineTo(crate.x+12,crate.y+10);ctx.stroke();});
  if(zone)upr(zone.x,zone.y,()=>{ctx.strokeStyle='#24201c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(zone.x,zone.y);ctx.lineTo(zone.x,zone.y-46);ctx.moveTo(zone.x-9,zone.y);ctx.lineTo(zone.x,zone.y-30);ctx.lineTo(zone.x+9,zone.y);ctx.stroke();
    ctx.fillStyle=Math.sin(Date.now()*.01)>0?'#7dd3ff':'#2a4a5a';ctx.beginPath();ctx.arc(zone.x,zone.y-48,3,0,7);ctx.fill();});
  drawSorted(t);
  for(const m of mols){const f=m.t/m.dur,x=m.x0+(m.x1-m.x0)*f,y=m.y0+(m.y1-m.y0)*f,X=ix(x,y),Y=iy(x,y)-12-Math.sin(f*Math.PI)*70;ctx.fillStyle='#5a7a4a';ctx.fillRect(X-2.5,Y-5,5,9);ctx.fillStyle='#ff8a3d';ctx.fillRect(X-1,Y-8,2,3);}
  for(const p of pproj){const X=ix(p.x,p.y),Y=iy(p.x,p.y)-14;if(p.spear){ctx.save();ctx.translate(X,Y);ctx.rotate(sAng(Math.atan2(p.vy,p.vx)));ctx.fillStyle='#6b4a30';ctx.fillRect(-26,-1.5,30,3);ctx.fillStyle='#c8ccd4';ctx.beginPath();ctx.moveTo(4,-4);ctx.lineTo(14,0);ctx.lineTo(4,4);ctx.fill();ctx.restore();continue;}if(p.fin)ctx.drawImage(glow('#f2d14b'),X-14,Y-14,28,28);ctx.fillStyle=p.fin?'#f2d14b':p.el?ELC[p.el]:'#ead9c0';ctx.beginPath();ctx.arc(X,Y,p.r,0,7);ctx.fill();}
  for(const p of eproj){const X=ix(p.x,p.y),Y=iy(p.x,p.y)-10;ctx.drawImage(glow('#97c459'),X-p.r*3,Y-p.r*3,p.r*6,p.r*6);ctx.fillStyle='#b5e07a';ctx.beginPath();ctx.arc(X,Y,p.r,0,7);ctx.fill();}
  for(const p of parts){if(p.ox==null){p.ox=p.x;p.oy=p.y;}ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.col;ctx.fillRect(ix(p.ox,p.oy)+p.x-p.ox-p.size/2,iy(p.ox,p.oy)+p.y-p.oy-p.size/2,p.size,p.size);}ctx.globalAlpha=1;
  ctx.restore();
  /* ---- light ---- */
  lx.setTransform(LS,0,0,LS,0,0);lx.globalCompositeOperation='source-over';lx.clearRect(0,0,VW,VH);lx.fillStyle=`rgba(6,4,3,${P.dark?.95:clamp(D.dark-.12+(run?run.wave:0)*.017+(dm_('dunkel')?.12:0),.45,.96)})`;lx.fillRect(0,0,VW,VH);lx.globalCompositeOperation='destination-out';
  const lit=(x,y,r,z)=>{const X=scx(x,y),Y=scy(x,y)-(z||0);if(X<-r||X>VW+r||Y<-r||Y>VH+r)return;lx.drawImage(LSPR,X-r,Y-r*.7,r*2,r*1.4);};
  lit(P.x,P.y,(P.dark?(P.torch?270:P.lamp?200:95):250)+Math.sin(t*.008)*8+Math.sin(t*.021)*4,10);
  for(const b of barrels)lit(b.x,b.y,150+Math.sin(t*.012+b.ph)*12,10);
  for(const b of blds)for(const l of b.lights){if(l.inner&&!b.inside)continue;const q=lpos(b,l);if(l.inner){lit(q[0],q[1],150);continue;}if(l.r||!S.eco)lit(q[0],q[1],(l.r||34)*(l.fl&&Math.sin(t*.031+l.x)*Math.sin(t*.017+l.y)>.55?.35:1),q[2]);}
  for(const p of eproj)lit(p.x,p.y,46,10);for(const b of bolts)lit(b.x1,b.y1,60);if(!S.eco)for(const h of hazards)lit(h.x,h.y,50);for(const d of drops)if(d.item&&d.item.r>=2)lit(d.x,d.y,60);for(const f of fields)lit(f.x,f.y,f.r+50);
  if(crate)lit(crate.x,crate.y,110);if(trove)lit(trove.x,trove.y,110);if(captive)lit(captive.x,captive.y,90);if(npc)lit(npc.x,npc.y,110,10);if(zone)lit(zone.x,zone.y,zone.r+50);for(const tl of teles)lit(tl.x,tl.y,tl.r*1.3);for(const s of shocks)lit(s.x,s.y,s.r+40);
  ctx.drawImage(lc,0,0,VW,VH);if(flashT>0){ctx.fillStyle=`rgba(255,90,40,${flashT*.6})`;ctx.fillRect(0,0,VW,VH);}if(goldT>0){ctx.fillStyle=`rgba(255,200,90,${goldT*.45})`;ctx.fillRect(0,0,VW,VH);}if(state==='play'&&P.hp<ST.maxHp*.3){ctx.globalAlpha=.5+.3*Math.sin(t*.008);ctx.drawImage(VIG,0,0,VW,VH);ctx.globalAlpha=1;}
  ctx.globalCompositeOperation='lighter';
  if(!S.eco)for(const n of neons){const x=scx(n.x,n.y)+(n.dx||0),y=scy(n.x,n.y)-(n.z||0);if(x<-n.s||x>VW+n.s||y<-n.s||y>VH+n.s)continue;ctx.globalAlpha=.55;ctx.drawImage(glow(n.c),x-n.s,y-n.s*.7,n.s*2,n.s*1.4);}ctx.globalAlpha=1;
  if(P.torch)ctx.drawImage(FIRE,scx(P.x,P.y)-110,scy(P.x,P.y)-40-110,220,220);
  for(const b of barrels){const x=scx(b.x,b.y),y=scy(b.x,b.y)-10;if(x<-130||x>VW+130||y<-130||y>VH+130)continue;ctx.drawImage(FIRE,x-120,y-120,240,240);}
  ctx.globalCompositeOperation='source-over';
  drawWeather(t,S.eco?.033:.016);
  ctx.textAlign='center';ctx.font='600 13px "Barlow Condensed",sans-serif';for(const d of drops){if(!d.item||d.h||(d.item.r<1&&Math.hypot(d.x-P.x,d.y-P.y)>160))continue;const x=scx(d.x,d.y),y=scy(d.x,d.y)+22;if(x<-80||x>VW+80||y<-20||y>VH+20)continue;const w=ctx.measureText(d.item.name).width+10;ctx.fillStyle='rgba(13,9,7,.78)';ctx.fillRect(x-w/2,y-11,w,15);ctx.fillStyle=rc(d.item);ctx.fillText(d.item.name,x,y);}
  for(const n of nums){ctx.font=`600 ${Math.round((n.big?24:18)*(1+Math.max(0,n.life-.62)*(n.big?3:1.2)))}px "Barlow Condensed",sans-serif`;ctx.globalAlpha=Math.min(1,n.life*2);const x=scx(n.x,n.y),y=scy(n.x,n.y);ctx.fillStyle='#0d0907';ctx.fillText(n.t,x+1,y+1);ctx.fillStyle=n.col;ctx.fillText(n.t,x,y);}ctx.globalAlpha=1;
  const lastE=run&&run.toSpawn<=0&&enemies.length<=3?enemies:[];
  for(const[o,col]of[...lastE.map(e=>[e,'#c23a2e']),[crate,'#f2d14b'],[npc,'#8fd16a'],[zone,'#7dd3ff'],[captive,'#ead9c0'],[trove,'#f2d14b']]){if(!o)continue;const x=scx(o.x,o.y),y=scy(o.x,o.y);if(x<0||x>VW||y<0||y>VH){const a=Math.atan2(y-VH/2,x-VW/2),m=46,ex=clamp(VW/2+Math.cos(a)*VW,m,VW-m),ey=clamp(VH/2+Math.sin(a)*VH,m+90,VH-m-160);
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-11);ctx.lineTo(-8,11);ctx.fill();ctx.restore();}}
  if(spati&&(spati.inside||spati.calm<60)&&run){const x=scx(spati.x+spati.w/2,spati.y+spati.h/2),y=scy(spati.x+spati.w/2,spati.y+spati.h/2)-spati.H-20,c=spati.calm;ctx.font='700 16px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillStyle=c>0?'#f2d14b':'#c23a2e';ctx.fillText(c>0?`RUHE ${Math.ceil(c)} s`:'GITTER OFFEN',x,y);}
  if(aimOn()){const a=wAng(Math.atan2(aim.dy,aim.dx));ctx.save();ctx.translate(OX,OY);ctx.strokeStyle='rgba(242,209,75,.75)';ctx.fillStyle='rgba(242,209,75,.18)';ctx.lineWidth=3;ctx.setLineDash([10,8]);
    if(aim.k==='skill'){const L=ST.kind==='spear'?420:ST.kind==='sling'?300:0;if(L){ctx.save();isoGround();ctx.beginPath();ctx.moveTo(P.x,P.y);ctx.lineTo(P.x+Math.cos(a)*L,P.y+Math.sin(a)*L);ctx.stroke();ctx.restore();}}
    else{const q=aimTgt(a),px=ix(P.x,P.y),py=iy(P.x,P.y)-14,qx=ix(q.x,q.y),qy=iy(q.x,q.y);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo((px+qx)/2,Math.min(py,qy)-70,qx,qy);ctx.stroke();ctx.setLineDash([]);
      ctx.save();isoGround();const k=pk('blast')?1.5:1;ctx.beginPath();ctx.ellipse(q.x,q.y,65*k,40*k,0,0,7);ctx.fill();ctx.stroke();ctx.restore();}ctx.setLineDash([]);ctx.restore();}
  ctx.setTransform(DPR,0,0,DPR,0,0);if(joy.id!==null){ctx.strokeStyle='rgba(234,217,192,.3)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(joy.ox,joy.oy,JR,0,7);ctx.stroke();ctx.fillStyle='rgba(234,217,192,.35)';ctx.beginPath();ctx.arc(joy.ox+joy.x*JR,joy.oy+joy.y*JR,JR*.4,0,7);ctx.fill();}
}
function drawDrop(d){const bob=Math.sin(d.t*4)*2;
  if(d.food){ctx.drawImage(glow('#f2a04b'),d.x-14,d.y+bob-14,28,28);ctx.fillStyle='#e8d8b0';ctx.beginPath();ctx.moveTo(d.x-7,d.y+bob-4);ctx.lineTo(d.x+7,d.y+bob-4);ctx.lineTo(d.x,d.y+bob+8);ctx.fill();ctx.fillStyle='#8a4a22';ctx.fillRect(d.x-6,d.y+bob-7,12,4);ctx.fillStyle='#8fd16a';ctx.fillRect(d.x-4,d.y+bob-9,3,2);ctx.fillStyle='#c23a2e';ctx.fillRect(d.x+1,d.y+bob-9,3,2);return;}
  if(d.mat){const hh=d.h||0,c=MATS[d.mat][1];ctx.drawImage(glow(c),d.x-12,d.y+bob-12-hh,24,24);ctx.fillStyle=c;ctx.fillRect(d.x-4,d.y+bob-4-hh,8,7);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(d.x-4,d.y+bob+1-hh,8,2);return;}
  if(d.heal){ctx.drawImage(glow('#ff5040'),d.x-16,d.y+bob-16,32,32);ctx.fillStyle='#c23a2e';ctx.beginPath();ctx.arc(d.x,d.y+bob,6,0,7);ctx.fill();return;}
  const c=rc(d.item),gs=24+Math.sin(d.t*5)*4,hh=d.h||0;if(d.item.r>=2&&!hh){ctx.fillStyle=c+'30';ctx.fillRect(d.x-3,d.y-(d.item.r>=3?140:70),6,d.item.r>=3?140:70);}
  if(hh){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(d.x,d.y+4,6,2.5,0,0,7);ctx.fill();}
  ctx.drawImage(glow(c),d.x-gs,d.y+bob-gs-hh,gs*2,gs*2);ctx.save();ctx.translate(d.x,d.y+bob-hh);ctx.rotate(Math.PI/4+(hh?d.t*12:0));ctx.fillStyle=c;ctx.fillRect(-6,-6,12,12);ctx.restore();}
/* depth order: boxes (buildings, vehicles) sorted by centre depth; each upright item is drawn just before the first box it stands behind and overlaps on screen, else after all boxes. Buildings in front of the player fade. */
function drawSorted(t){const BX=[],IT=[],vL=-OX-60,vR=VW-OX+60,vT=-OY-60,vB=VH-OY+80;
  for(const b of blds){if(isBox(b)){const x0=ix(b.x,b.y+b.h),x1=ix(b.x+b.w,b.y),y0=iy(b.x,b.y)-boxTop(b),y1=iy(b.x+b.w,b.y+b.h);if(x1<vL||x0>vR||y1<vT||y0>vB)continue;b._s=[x0,x1,y0];b._k=b.x+b.w/2+b.y+b.h/2;BX.push(b);}
    else{const ax=b.x+b.w/2,X=ix(ax,b.y),Y=iy(ax,b.y),sc=b.sc||1;if(X+b.spr.width*sc<vL||X-b.spr.width*sc>vR||Y<vT||Y-b.top*sc>vB)continue;IT.push({x:ax,y:b.y,k:0,o:b});}}
  for(const b of barrels)IT.push({x:b.x,y:b.y,k:1,o:b});for(const b of brk)IT.push({x:b.x+b.w/2,y:b.y+b.h/2,k:4,o:b});
  for(const e of enemies)IT.push({x:e.x,y:e.y,k:2,o:e});if(npc)IT.push({x:npc.x,y:npc.y,k:5,o:npc});if(captive)IT.push({x:captive.x,y:captive.y,k:6,o:captive});IT.push({x:P.x,y:P.y,k:3});
  BX.sort((a,b)=>a._k-b._k);const PX=ix(P.x,P.y),PY=iy(P.x,P.y);
  for(const it of IT){it.s=1e9;it.d=it.x+it.y;if(it.k!==3&&it.k!==0){const X=ix(it.x,it.y),Y=iy(it.x,it.y);if(X<vL||X>vR||Y<vT||Y-60>vB){it.s=-1;continue;}}const X=ix(it.x,it.y),Y=iy(it.x,it.y);
    for(let j=0;j<BX.length;j++){const b=BX[j];if(it.x>=b.x+b.w||it.y>=b.y+b.h||X<b._s[0]-12||X>b._s[1]+12||Y<b._s[2])continue;it.s=j;break;}}
  for(const b of BX){const occ=!(P.x>=b.x+b.w||P.y>=b.y+b.h)&&PX>b._s[0]-10&&PX<b._s[1]+10&&PY>b._s[2]+10;b.oa=(b.oa==null?1:b.oa)+((occ?.32:1)-(b.oa==null?1:b.oa))*.2;}
  const vis=IT.filter(it=>it.s>=0).sort((a,b)=>a.s-b.s||a.d-b.d);let j=0;
  const box=b=>{ctx.globalAlpha=Math.min(b.oa,b.isSpati?b.fade:1);if(b.veh)drawVehBox(b);else drawBox(b);ctx.globalAlpha=1;};
  for(const it of vis){while(j<BX.length&&j<it.s)box(BX[j++]);drawItem(it,t);}while(j<BX.length)box(BX[j++]);}
function drawItem(it,t){const o=it.o;if(it.k===0)return drawBB(o);
  if(it.k===3){const f=P.face,a=P.atkA;P.face=sAng(f);P.atkA=sAng(a);upr(P.x,P.y,()=>drawPlayer(t));P.face=f;P.atkA=a;return;}
  upr(it.x,it.y,()=>{if(it.k===1)drawBarrel(o,t);else if(it.k===2)drawEnemy(o,t);else if(it.k===4)drawProp(o);else if(it.k===5)drawNpc(o,t);else drawCaptive(o,t);});}
const cache={};function setT(id,v){if(cache[id]!==v){cache[id]=v;$(id).textContent=v;}}function setW(id,v){v=Math.round(v*10)/10;if(cache[id]!==v){cache[id]=v;$(id).style.width=v+'%';}}
function hud(){if(!P||!ST)return;setW('hpf',100*Math.max(0,P.hp)/ST.maxHp);setT('hpt',Math.max(0,Math.ceil(P.hp))+' / '+ST.maxHp);setW('xpf',100*P.xp/(20+P.lvl*15));
  setT('lv',P.lvl);{const bl=Object.keys(SHR).filter(k=>SHR[k]>0).map(k=>`${SHRN[k][0]} ${Math.ceil(SHR[k])} s`).join(' · ');setT('bufs',bl);}setT('rem',run?enemies.length+run.toSpawn:0);const sn=streak.n>=3?streak.n:0;if(cache.sn!==sn){const el=$('streak');el.hidden=!sn;if(sn){$('stn').textContent=sn;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}cache.sn=sn;}setT('sc',S.scrap);setT('wv',run?run.wave:0);setT('wmax',run&&run.endless?'∞':'10');setT('dn',D.n+(run&&run.th?' · B'+run.th:''));setT('skill',ST.K.sk);
  for(const[id,k]of[['c1','verband'],['c2','molotow']]){const n=S.cons[k]||0;if(cache[id]!==n){cache[id]=n;$(id+'n').textContent=n;$(id).classList.toggle('empty',!n);}}
  const b=run&&run.boss;$('boss').hidden=!b;if(b){setT('bossn',b.name);setW('bossf',100*Math.max(0,b.hp)/b.max);}
  const cd=P.dashCd>0?Math.round(360*(1-P.dashCd/ST.dashCd)):360;if(cache.cd!==cd){cache.cd=cd;$('dash').style.setProperty('--cd',cd+'deg');}
  const sk=P.skCd>0?Math.round(360*(1-P.skCd/ST.skCd)):360;if(cache.sk!==sk){cache.sk=sk;$('skill').style.setProperty('--sk',sk+'deg');$('skill').classList.toggle('ready',sk>=360);}}
const mini=$('mini'),mx_=mini.getContext('2d');
function drawMini(){if(!MB)return;const k=192/WS,dot=(x,y,r,c)=>{mx_.fillStyle=c;mx_.fillRect(x*k-r,y*k-r,r*2,r*2);};mx_.setTransform(1,0,0,1,0,0);mx_.fillStyle='#0d0907';mx_.fillRect(0,0,192,192);
  // rotated 45 degrees so screen-up on the minimap matches screen-up in the iso view
  mx_.save();mx_.translate(96,96);mx_.rotate(Math.PI/4);mx_.scale(IS,IS);mx_.translate(-96,-96);mx_.drawImage(MB,0,0);
  if(spati){mx_.strokeStyle='#f2d14b';mx_.lineWidth=3;mx_.strokeRect(spati.x*k,spati.y*k,spati.w*k,spati.h*k);}
  for(const m of marks)dot(m.x,m.y,4,'#EF9F27');for(const b of brk)if(b.type==='chest')dot(b.x+b.w/2,b.y+b.h/2,3.5,'#c9a227');for(const d of drops)if(d.item&&d.item.r>=2)dot(d.x,d.y,3,RAR[d.item.r].c);
  for(const e of enemies)dot(e.x,e.y,e.type==='boss'?7:e.elite?4:3,e.elite?EMC[e.elite]:e.type==='boss'?'#ff6a2a':'#c23a2e');
  if(crate)dot(crate.x,crate.y,5,'#f2d14b');if(npc)dot(npc.x,npc.y,5,'#8fd16a');if(zone){mx_.strokeStyle='#7dd3ff';mx_.lineWidth=2;mx_.beginPath();mx_.arc(zone.x*k,zone.y*k,zone.r*k,0,7);mx_.stroke();}
  const c=[[0,0],[VW,0],[VW,VH],[0,VH]].map(q=>s2w(q[0]-OX,q[1]-OY));mx_.strokeStyle='rgba(255,255,255,.4)';mx_.lineWidth=1.5;mx_.beginPath();c.forEach((q,i)=>i?mx_.lineTo(q[0]*k,q[1]*k):mx_.moveTo(q[0]*k,q[1]*k));mx_.closePath();mx_.stroke();dot(P.x,P.y,4.5,'#ffffff');mx_.restore();}
function loop(t){requestAnimationFrame(loop);const minF=S.eco?1000/31:1000/61;if(t-last<minF)return;const dt=Math.min(.05,(t-last)/1000);last=t;
  if(state==='menu'){P.walk+=dt*6;P.mvx=.6;P.face=Math.sin(t*.0004)>0?0:Math.PI;}
  if(freeze>0&&state==='play'){freeze-=dt;render(t);hud();return;}update(dt);render(t);hud();const mh=!run;if(cache.mh!==mh){cache.mh=mh;mini.hidden=mh;document.body.classList.toggle('inrun',!mh);}if(run&&(++mf%(S.eco?6:3)===0))drawMini();if(state==='menu')P.mvx=0;}
