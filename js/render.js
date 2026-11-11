/* ================= render ================= */
function drawBarrel(b,t){if(paintedFire(b,t))return;const x=b.x,y=b.y;if(b.camp){ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(x,y+2,20,9,0,0,7);ctx.fill();for(let k=0;k<9;k++){const q=k*.7;ctx.fillStyle=k%2?'#5a5650':'#6a6660';ctx.beginPath();ctx.ellipse(x+Math.cos(q)*16,y+Math.sin(q)*7,4,3,0,0,7);ctx.fill();}
    ctx.fillStyle='#3a2414';ctx.fillRect(x-11,y-3,22,4);ctx.save();ctx.translate(x,y);ctx.rotate(.6);ctx.fillRect(-11,-2,22,4);ctx.restore();
    for(let k=0;k<5;k++){const h=15+Math.sin(t*.018+b.ph+k*1.7)*5+Math.sin(t*.031+k)*3,fx=x-8+k*4;ctx.fillStyle=k%2?'#EF9F27':'#FAC775';ctx.beginPath();ctx.moveTo(fx-3.5,y-1);ctx.lineTo(fx+3.5,y-1);ctx.lineTo(fx+Math.sin(t*.02+k)*2,y-1-h);ctx.fill();}return;}
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(x+3,y+4,11,5,0,0,7);ctx.fill();
  ctx.fillStyle='#4a2414';ctx.fillRect(x-8,y-14,16,16);ctx.fillStyle='#6b3a24';ctx.fillRect(x-8,y-14,5,16);ctx.fillStyle='#2a140b';ctx.fillRect(x-8,y-9,16,2);ctx.fillRect(x-8,y-3,16,2);
  ctx.fillStyle='#1a0d07';ctx.beginPath();ctx.ellipse(x,y-14,8,3.5,0,0,7);ctx.fill();
  for(let k=0;k<4;k++){const h=9+Math.sin(t*.018+b.ph+k*1.7)*4+Math.sin(t*.031+k)*2,fx=x-6+k*4;ctx.fillStyle=k%2?'#EF9F27':'#FAC775';ctx.beginPath();ctx.moveTo(fx-3,y-14);ctx.lineTo(fx+3,y-14);ctx.lineTo(fx+Math.sin(t*.02+k)*2,y-14-h);ctx.fill();}}
let last=performance.now();const TN=[],LCOL=()=>D.cyber?'#6a8cff':'#ffb060';
// ?debug=perf: frame time overlay for the real device. frame = time between frames (the truth, includes GPU), the phases are script time only. Smoothed value and worst of the last 2 s
const PERF=/[?&]debug=perf\b/.test(location.search),PM={},PX_={};let pfN=0;function pmk(k,t0){const n=performance.now(),d=n-t0;PM[k]=PM[k]==null?d:PM[k]*.94+d*.06;if(!(PX_[k]>d))PX_[k]=d;return n;}
function drawPerf(){if(++pfN%120===0)for(const k in PX_)PX_[k]=0;ctx.setTransform(DPR,0,0,DPR,0,0);const f=k=>PM[k]==null?'-':PM[k].toFixed(1)+' ('+PX_[k].toFixed(0)+')',L=['frame '+f('frame')+' ms · '+(1000/(PM.frame||16.7)).toFixed(0)+' fps','update '+f('update')+' · ground '+f('ground')+' · world '+f('world'),'light '+f('light')+' · fx '+f('fx')+' · ui '+f('ui'),'enemies '+enemies.length+' · fx '+fx.length+' · parts '+parts.length+' · boxes '+blds.length,cv.width+'x'+cv.height+' · DPR '+DPR+' · Z '+Z.toFixed(2)+(S.eco?' · eco':'')];
  ctx.font='12px monospace';ctx.textAlign='left';ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(6,SH-L.length*15-12,330,L.length*15+8);ctx.fillStyle=(PM.frame||0)>20?'#ff8a3d':'#8fd16a';L.forEach((l,i)=>ctx.fillText(l,12,SH-L.length*15+6+i*15));}
function render(t){koepBeginFrame();vehicleBeginFrame();let pt=PERF?performance.now():0;
  ctx.setTransform(DPR*Z,0,0,DPR*Z,0,0);ctx.globalCompositeOperation='source-over';
  const tx=P.x+(state==='play'?P.mvx*80:0),ty=P.y+(state==='play'?P.mvy*80:0);if(cam.x==null||Math.hypot(cam.x-tx,cam.y-ty)>600){cam.x=tx;cam.y=ty;}else{cam.x+=(tx-cam.x)*.12;cam.y+=(ty-cam.y)*.12;}
  OX=VW/2-ix(cam.x,cam.y)+R(-shake,shake)+KX;OY=VH/2-iy(cam.x,cam.y)+24+R(-shake,shake)+KY;
  {const c=[[0,0],[VW,0],[0,VH],[VW,VH]].map(q=>s2w(q[0]-OX,q[1]-OY));VB.x0=Math.min(...c.map(q=>q[0]));VB.x1=Math.max(...c.map(q=>q[0]));VB.y0=Math.min(...c.map(q=>q[1]));VB.y1=Math.max(...c.map(q=>q[1]));}
  ctx.fillStyle='#17110d';ctx.fillRect(0,0,VW,VH);
  ctx.save();ctx.translate(OX,OY);
  /* ---- ground layer: flat decals in world coords ---- */
  ctx.save();isoGround();
  {const x0=clamp(Math.floor(VB.x0),0,WS),y0=clamp(Math.floor(VB.y0),0,WH),x1=clamp(Math.ceil(VB.x1),0,WS),y1=clamp(Math.ceil(VB.y1),0,WH),k=G.k||1;if(x1>x0&&y1>y0)ctx.drawImage(G,x0*k,y0*k,(x1-x0)*k,(y1-y0)*k,x0,y0,x1-x0,y1-y0);}// G.k: ground canvas scale (the long tunnel keeps its ground at half resolution)
  drawWaters(t);
  for(const tl of teles){const p=1-tl.t/tl.max;ctx.fillStyle=tl.root?`rgba(90,120,40,${.14+.28*p})`:`rgba(194,58,46,${.12+.25*p})`;ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r,0,7);ctx.fill();ctx.strokeStyle=tl.root?'rgba(151,196,89,.85)':'rgba(255,140,90,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r,0,7);ctx.stroke();ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r*p,0,7);ctx.stroke();}
  if(P.root>0){ctx.strokeStyle='#5a4a2a';ctx.lineWidth=3;ctx.lineCap='round';for(let k=0;k<7;k++){const a=k/7*6.283+.3,r0=P.r+16,r1=P.r+2;ctx.beginPath();ctx.moveTo(P.x+Math.cos(a)*r0,P.y+Math.sin(a)*r0);ctx.quadraticCurveTo(P.x+Math.cos(a+.6)*(r0-4),P.y+Math.sin(a+.6)*(r0-4),P.x+Math.cos(a+.2)*r1,P.y+Math.sin(a+.2)*r1);ctx.stroke();}ctx.lineCap='butt';}// rooted by a Wurzler
  for(const r of rings){if(r.r<=0)continue;ctx.strokeStyle=`rgba(${r.col},${.7*(1-r.r/r.max)})`;ctx.lineWidth=r.dmg?11:6;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,7);ctx.stroke();}
  for(const s of shocks){ctx.strokeStyle=s.acid?`rgba(151,196,89,${1-s.r/s.max})`:`rgba(239,159,39,${1-s.r/s.max})`;ctx.lineWidth=10;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.stroke();}
  for(const f of fields){ctx.globalAlpha=Math.min(1,f.t);ctx.drawImage(glow('#ff6a2a'),f.x-f.r*1.2,f.y-f.r*.75,f.r*2.4,f.r*1.5);ctx.globalAlpha=1;}
  for(const e of enemies)if(e.ch>0){ctx.strokeStyle=`rgba(255,80,60,${.3+.6*(1-e.ch/.6)})`;ctx.lineWidth=3;ctx.setLineDash([10,6]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+e.rdx*240,e.y+e.rdy*240);ctx.stroke();ctx.setLineDash([]);}
  if(D.tun)tunDraw(t);if(D.base)baseDraw(t);
  if(zone){ctx.fillStyle='rgba(125,211,255,.08)';ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r,0,7);ctx.fill();ctx.strokeStyle='rgba(125,211,255,.5)';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#7dd3ff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r-6,-1.57,-1.57+6.283*zone.p/zone.need);ctx.stroke();}
  for(const h of shrines)if(!h.used){const a=.25+.15*Math.sin(t*.004+h.x);ctx.strokeStyle=`rgba(125,211,255,${a})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x,h.y,30,0,7);ctx.stroke();}
  for(const c of corpses){ctx.globalAlpha=Math.min(1,c.t)*.85;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(-.78);ctx.scale(c.fl*c.r/10,c.r/10);ctx.fillStyle='rgba(40,12,6,.5)';ctx.beginPath();ctx.ellipse(0,2,15,5,0,0,7);ctx.fill();
    ctx.fillStyle=dark(c.col,.6);ctx.beginPath();ctx.ellipse(0,0,11,4.5,0,0,7);ctx.fill();ctx.fillStyle=dark(c.col,.45);ctx.beginPath();ctx.arc(11,-1,4,0,7);ctx.fill();ctx.restore();}ctx.globalAlpha=1;
  for(const h of hazards){ctx.globalAlpha=Math.min(1,h.t);ctx.drawImage(glow(h.col||'#ff6a2a'),h.x-h.r*1.2,h.y-h.r*1.2,h.r*2.4,h.r*2.4);}ctx.globalAlpha=1;
  if(run&&run.hid)for(const h of run.hid)if(!h.got&&Math.abs(h.x-P.x)<500&&Math.abs(h.y-P.y)<500){const p=.6+.4*Math.sin(t*.005+h.x);ctx.drawImage(glow('#f2a04b'),h.x-36*p,h.y-36*p,72*p,72*p);ctx.fillStyle='#4a3e33';ctx.beginPath();ctx.ellipse(h.x,h.y+2,11,6,0,0,7);ctx.fill();ctx.fillStyle='#f2c46b';ctx.beginPath();ctx.moveTo(h.x,h.y-14-3*p);ctx.lineTo(h.x+5,h.y-4);ctx.lineTo(h.x,h.y+1);ctx.lineTo(h.x-5,h.y-4);ctx.fill();}// v0.79 hidden blessing
  if(trove){const a=.5+.3*Math.sin(t*.008);ctx.strokeStyle=`rgba(242,209,75,${a})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(trove.x-14,trove.y-14);ctx.lineTo(trove.x+14,trove.y+14);ctx.moveTo(trove.x+14,trove.y-14);ctx.lineTo(trove.x-14,trove.y+14);ctx.stroke();ctx.strokeStyle='#f2d14b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(trove.x,trove.y,26,-1.57,-1.57+6.283*trove.t/50);ctx.stroke();}
  if(crate){ctx.strokeStyle='#f2d14b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(crate.x,crate.y,26,-1.57,-1.57+6.283*crate.t/28);ctx.stroke();}
  if(P.spin>0){ctx.strokeStyle='rgba(250,199,117,.75)';ctx.lineWidth=5;const a=t*.03,rr_=72*(1+.2*pk('reach'));for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(P.x,P.y,rr_,a+k*2.09,a+k*2.09+1.1);ctx.stroke();}}
  if(P.frenzy>0){const a=.35+.25*Math.sin(t*.02);ctx.strokeStyle=`rgba(194,58,46,${a})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(P.x,P.y,30+4*Math.sin(t*.03),0,7);ctx.stroke();}
  if(P.banner){const B=P.banner,a=Math.min(1,B.t)*(.5+.15*Math.sin(t*.006));ctx.fillStyle=`rgba(242,209,75,${.07*a})`;ctx.strokeStyle=`rgba(242,209,75,${a})`;ctx.lineWidth=3;ctx.setLineDash([12,8]);ctx.beginPath();ctx.arc(B.x,B.y,B.r,0,7);ctx.fill();ctx.stroke();ctx.setLineDash([]);}
  if(run)for(const k of run.strikes){const p=1-k.t/k.max;ctx.fillStyle=`rgba(255,138,61,${.1+.25*p})`;ctx.strokeStyle=`rgba(255,138,61,${.5+.4*p})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(k.x,k.y,k.r,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(k.x,k.y,k.r*(1-p),0,7);ctx.stroke();}
  // swings: fxSwings() in js/vfx.js, drawn additively after the darkness
  ctx.lineWidth=2;for(const b of bolts){ctx.strokeStyle=`rgba(125,211,255,${b.life/.16})`;ctx.beginPath();ctx.moveTo(b.x0,b.y0);for(let i=1;i<6;i++){const f=i/6;ctx.lineTo(b.x0+(b.x1-b.x0)*f+R(-6,6),b.y0+(b.y1-b.y0)*f+R(-6,6));}ctx.lineTo(b.x1,b.y1);ctx.stroke();}
  ctx.restore();if(PERF)pt=pmk('ground',pt);
  /* ---- upright layer ---- */
  for(const d of drops)upr(d.x,d.y,()=>drawDrop(d));
  if(run&&run.hid)for(const h of run.hid)if(!h.got&&Math.abs(h.x-P.x)<520&&Math.abs(h.y-P.y)<520)upr(h.x,h.y,()=>{ctx.fillStyle='rgba(242,160,75,.12)';ctx.fillRect(h.x-3,h.y-90,6,90);});
  if(trove)upr(trove.x,trove.y,()=>{ctx.fillStyle='rgba(242,209,75,.14)';ctx.fillRect(trove.x-4,trove.y-110,8,110);});
  if(crate)upr(crate.x,crate.y,()=>{ctx.fillStyle='rgba(242,209,75,.18)';ctx.fillRect(crate.x-5,crate.y-120,10,120);ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(crate.x-10,crate.y+6,24,6);
    ctx.fillStyle='#7a5530';ctx.fillRect(crate.x-12,crate.y-12,24,22);ctx.strokeStyle='#3a2414';ctx.lineWidth=2;ctx.strokeRect(crate.x-12,crate.y-12,24,22);ctx.beginPath();ctx.moveTo(crate.x-12,crate.y-12);ctx.lineTo(crate.x+12,crate.y+10);ctx.stroke();});
  if(zone)upr(zone.x,zone.y,()=>{ctx.strokeStyle='#24201c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(zone.x,zone.y);ctx.lineTo(zone.x,zone.y-46);ctx.moveTo(zone.x-9,zone.y);ctx.lineTo(zone.x,zone.y-30);ctx.lineTo(zone.x+9,zone.y);ctx.stroke();
    ctx.fillStyle=Math.sin(Date.now()*.01)>0?'#7dd3ff':'#2a4a5a';ctx.beginPath();ctx.arc(zone.x,zone.y-48,3,0,7);ctx.fill();});
  if(P&&P.banner){const B=P.banner;upr(B.x,B.y,()=>{const w=Math.sin(t*.008);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(B.x,B.y+2,10,4,0,0,7);ctx.fill();ctx.fillStyle='#5a4030';ctx.fillRect(B.x-1.5,B.y-74,3,76);ctx.fillStyle='#c9a227';ctx.beginPath();ctx.arc(B.x,B.y-76,3,0,7);ctx.fill();
    ctx.fillStyle='#1f1a17';ctx.beginPath();ctx.moveTo(B.x+1,B.y-70);ctx.quadraticCurveTo(B.x+14,B.y-72+w*3,B.x+30,B.y-68+w*4);ctx.lineTo(B.x+30,B.y-58+w*4);ctx.quadraticCurveTo(B.x+14,B.y-62+w*3,B.x+1,B.y-60);ctx.fill();ctx.fillStyle='#e8ddd0';ctx.fillRect(B.x+1,B.y-60,29,7);ctx.fillStyle='#b93432';ctx.beginPath();ctx.moveTo(B.x+1,B.y-53);ctx.quadraticCurveTo(B.x+14,B.y-55+w*3,B.x+30,B.y-51+w*4);ctx.lineTo(B.x+30,B.y-45+w*4);ctx.quadraticCurveTo(B.x+14,B.y-48+w*3,B.x+1,B.y-46);ctx.fill();});}
  drawSorted(t);
  for(const m of mols){const f=m.t/m.dur,x=m.x0+(m.x1-m.x0)*f,y=m.y0+(m.y1-m.y0)*f,X=ix(x,y),Y=iy(x,y)-12-Math.sin(f*Math.PI)*70;ctx.fillStyle='#5a7a4a';ctx.fillRect(X-2.5,Y-5,5,9);ctx.fillStyle='#ff8a3d';ctx.fillRect(X-1,Y-8,2,3);}
  for(const p of pproj){const X=ix(p.x,p.y),Y=iy(p.x,p.y)-14;if(p.spear){ctx.save();ctx.translate(X,Y);ctx.rotate(sAng(Math.atan2(p.vy,p.vx)));ctx.fillStyle='#6b4a30';ctx.fillRect(-26,-1.5,30,3);ctx.fillStyle='#c8ccd4';ctx.beginPath();ctx.moveTo(4,-4);ctx.lineTo(14,0);ctx.lineTo(4,4);ctx.fill();ctx.restore();continue;}if(p.fin)ctx.drawImage(glow('#f2d14b'),X-14,Y-14,28,28);ctx.fillStyle=p.fin?'#f2d14b':p.el?ELC[p.el]:'#ead9c0';ctx.beginPath();ctx.arc(X,Y,p.r,0,7);ctx.fill();}
  for(const p of eproj){const f=p.ml?Math.max(0,1-(p.ml-p.life)/.18):0,X=ix(p.x,p.y)+(p.mx||0)*f,Y=iy(p.x,p.y)-10+(p.my||0)*f;if(p.seed){ctx.save();ctx.translate(X,Y);ctx.rotate(Math.atan2(p.vy,p.vx));ctx.fillStyle='#2a2018';ctx.beginPath();ctx.ellipse(0,0,p.r*1.2,p.r*.7,0,0,7);ctx.fill();ctx.strokeStyle='#ead9c0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-p.r,0);ctx.lineTo(p.r,0);ctx.stroke();ctx.restore();continue;}if(p.gear){ctx.save();ctx.translate(X,Y);ctx.rotate(p.life*8);ctx.fillStyle='#c8902a';for(let k=0;k<6;k++){ctx.rotate(1.047);ctx.fillRect(-2,-p.r-3,4,5);}ctx.beginPath();ctx.arc(0,0,p.r,0,7);ctx.fill();ctx.fillStyle='#14100c';ctx.beginPath();ctx.arc(0,0,p.r*.35,0,7);ctx.fill();ctx.restore();continue;}ctx.drawImage(glow('#97c459'),X-p.r*3,Y-p.r*3,p.r*6,p.r*6);ctx.fillStyle='#b5e07a';ctx.beginPath();ctx.arc(X,Y,p.r,0,7);ctx.fill();}
  for(const p of parts){if(p.ox==null){p.ox=p.x;p.oy=p.y;}ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.col;ctx.fillRect(ix(p.ox,p.oy)+p.x-p.ox-p.size/2,iy(p.ox,p.oy)+p.y-p.oy-p.size/2,p.size,p.size);}ctx.globalAlpha=1;
  ctx.restore();if(PERF)pt=pmk('world',pt);
  /* ---- light ---- */
  lx.setTransform(LS,0,0,LS,0,0);lx.globalCompositeOperation='source-over';lx.clearRect(0,0,VW,VH);lx.fillStyle=`rgba(${D.nc||'6,4,3'},${P.dark?.95:D.day?clamp(.12+wE()*.022+(dm_('dunkel')?.3:0),.1,.6):clamp(D.dark-.12+wE()*.017+(dm_('dunkel')?.12:0),.45,.96)})`;lx.fillRect(0,0,VW,VH);lx.globalCompositeOperation='destination-out';// D.day (Alexanderplatz): daylight, late waves dim towards dusk
  // c: light colour. Tinted lights are collected in TN and painted into the light canvas after the holes are cut (v0.63), so fire, lamps and effects colour what they light
  TN.length=0;const lit=(x,y,r,z,c,own)=>{const X=scx(x,y),Y=scy(x,y)-(z||0);if(X<-r||X>VW+r||Y<-r||Y>VH+r)return;const oc=lOcc(x,y,X,Y,r,own);if(oc){lHole(X,Y,r,oc);return;}lx.drawImage(LSPR,X-r,Y-r*.7,r*2,r*1.4);if(c&&!S.eco)TN.push(X,Y,r,c);};
  lit(P.x,P.y,(P.dark?(P.torch?(D.tun?320:270):D.tun?280:P.lamp?200:95):250)+Math.sin(t*.008)*8+Math.sin(t*.021)*4,10);
  for(const b of barrels)if(!b.occ)lit(b.x,b.y,150+Math.sin(t*.012+b.ph)*12,10,'#ff7a2a');
  for(const b of blds)for(const l of b.lights){if(l.inner&&!b.inside||b.occ)continue;const q=lpos(b,l);if(l.inner){lit(q[0],q[1],150,0,'#ffb060',b);continue;}if(l.r||!S.eco)lit(q[0],q[1],(l.r||34)*(l.fl&&Math.sin(t*.031+l.x)*Math.sin(t*.017+l.y)>.55?.35:1),q[2],l.c||(l.r?LCOL():0),b);}
  for(const p of eproj)lit(p.x,p.y,46,10,'#97c459');for(const b of bolts)lit(b.x1,b.y1,60,0,'#7dd3ff');if(!S.eco)for(const h of hazards)lit(h.x,h.y,50,0,h.col||'#ff6a2a');for(const d of drops)if(d.item&&d.item.r>=2)lit(d.x,d.y,60);for(const f of fields)lit(f.x,f.y,f.r+50,0,'#ff6a2a');
  if(crate)lit(crate.x,crate.y,110);if(trove)lit(trove.x,trove.y,110);if(run&&run.hid)for(const h of run.hid)if(!h.got)lit(h.x,h.y,60);if(captive)lit(captive.x,captive.y,90);if(npc)lit(npc.x,npc.y,110,10);if(zone)lit(zone.x,zone.y,zone.r+50);if(D.tun&&TUN&&TUN.hold&&!TUN.lit)lit(GEN.x,GEN.y,GEN.r);for(const tl of teles)lit(tl.x,tl.y,tl.r*1.3);for(const s of shocks)lit(s.x,s.y,s.r+40);fxLight(lit);
  if(TN.length){lx.globalCompositeOperation='source-over';lx.globalAlpha=D.day&&!P.dark?.06:.14;for(let i=0;i<TN.length;i+=4){const r=TN[i+2]*.85;lx.drawImage(glow(TN[i+3]),TN[i]-r,TN[i+1]-r*.7,r*2,r*1.4);}lx.globalAlpha=1;}
  fxDay(t);ctx.drawImage(lc,0,0,VW,VH);if(PERF)pt=pmk('light',pt);if(flashT>0){ctx.fillStyle=`rgba(255,90,40,${flashT*.6})`;ctx.fillRect(0,0,VW,VH);}if(goldT>0){ctx.fillStyle=`rgba(255,200,90,${goldT*.45})`;ctx.fillRect(0,0,VW,VH);}if(state==='play'&&P.hp<ST.maxHp*.3){ctx.globalAlpha=.5+.3*Math.sin(t*.008);ctx.drawImage(VIG,0,0,VW,VH);ctx.globalAlpha=1;}
  ctx.globalCompositeOperation='lighter';
  fxDraw(t);ctx.globalCompositeOperation='lighter';if(PERF)pt=pmk('fx',pt);
  if(!S.eco)for(const n of neons){const x=scx(n.x,n.y)+(n.dx||0),y=scy(n.x,n.y)-(n.z||0);if(x<-n.s||x>VW+n.s||y<-n.s||y>VH+n.s)continue;ctx.globalAlpha=D.day?.25:.55;ctx.drawImage(glow(n.c),x-n.s,y-n.s*.7,n.s*2,n.s*1.4);}ctx.globalAlpha=1;
  if(P.torch)ctx.drawImage(FIRE,scx(P.x,P.y)-110,scy(P.x,P.y)-40-110,220,220);
  if(D.day)ctx.globalAlpha=.1;for(const b of barrels){if(b.occ)continue;const x=scx(b.x,b.y),y=scy(b.x,b.y)-10;if(x<-130||x>VW+130||y<-130||y>VH+130)continue;ctx.drawImage(FIRE,x-120,y-120,240,240);}ctx.globalAlpha=1;// daylight: fire glow much weaker
  ctx.globalCompositeOperation='source-over';
  drawWeather(t,S.eco?.033:.016);
  ctx.textAlign='center';ctx.font='600 13px "Barlow Condensed",sans-serif';for(const d of drops){if(!d.item||d.h||(d.item.r<1&&Math.hypot(d.x-P.x,d.y-P.y)>160))continue;const x=scx(d.x,d.y),y=scy(d.x,d.y)+22;if(x<-80||x>VW+80||y<-20||y>VH+20)continue;const w=ctx.measureText(d.item.name).width+10;ctx.fillStyle='rgba(13,9,7,.78)';ctx.fillRect(x-w/2,y-11,w,15);ctx.fillStyle=rc(d.item);ctx.fillText(d.item.name,x,y);}
  for(const n of nums){ctx.font=`600 ${Math.round((n.big?24:18)*(1+Math.max(0,n.life-.62)*(n.big?3:1.2)))}px "Barlow Condensed",sans-serif`;ctx.globalAlpha=Math.min(1,n.life*2)*(n.pu?.4:1);const x=scx(n.x,n.y)+(n.pu?34:0),y=scy(n.x,n.y)-(n.pu?26:0);ctx.fillStyle='#0d0907';ctx.fillText(n.t,x+1,y+1);ctx.fillStyle=n.col;ctx.fillText(n.t,x,y);}ctx.globalAlpha=1;
  const lastE=run&&run.toSpawn<=0&&enemies.length<=3?enemies:[];
  for(const[o,col]of[...lastE.map(e=>[e,'#c23a2e']),[crate,'#f2d14b'],[npc,'#8fd16a'],[zone,'#7dd3ff'],[captive,'#ead9c0'],[trove,'#f2d14b'],[D.tun&&TUN&&TUN.sec===TSEC.length-1&&!TUN.hold?GEN:null,'#f2d14b']]){if(!o)continue;const x=scx(o.x,o.y),y=scy(o.x,o.y);if(x<0||x>VW||y<0||y>VH){const a=Math.atan2(y-VH/2,x-VW/2),m=46,ex=clamp(VW/2+Math.cos(a)*VW,m,VW-m),ey=clamp(VH/2+Math.sin(a)*VH,m+90,VH-m-160);
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-11);ctx.lineTo(-8,11);ctx.fill();ctx.restore();}}
  if(spati&&(spati.inside||spati.calm<60)&&run){const x=scx(spati.x+spati.w/2,spati.y+spati.h/2),y=scy(spati.x+spati.w/2,spati.y+spati.h/2)-spati.H-20,c=spati.calm;ctx.font='700 16px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillStyle=c>0?'#f2d14b':'#c23a2e';ctx.fillText(c>0?`RUHE ${Math.ceil(c)} s`:'GITTER OFFEN',x,y);}
  if(aimOn()){const a=wAng(Math.atan2(aim.dy,aim.dx));ctx.save();ctx.translate(OX,OY);ctx.strokeStyle='rgba(242,209,75,.75)';ctx.fillStyle='rgba(242,209,75,.18)';ctx.lineWidth=3;ctx.setLineDash([10,8]);
    if(aim.k==='skill'){const L={spiess:420,nagel:300,brand:300,fecht:160,abriss:300,stab:200}[krOf().k]||0;if(L){ctx.save();isoGround();ctx.beginPath();ctx.moveTo(P.x,P.y);ctx.lineTo(P.x+Math.cos(a)*L,P.y+Math.sin(a)*L);ctx.stroke();ctx.restore();}}
    else{const q=aimTgt(a),px=ix(P.x,P.y),py=iy(P.x,P.y)-14,qx=ix(q.x,q.y),qy=iy(q.x,q.y);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo((px+qx)/2,Math.min(py,qy)-70,qx,qy);ctx.stroke();ctx.setLineDash([]);
      ctx.save();isoGround();const k=pk('blast')?1.5:1;ctx.beginPath();ctx.ellipse(q.x,q.y,65*k,40*k,0,0,7);ctx.fill();ctx.stroke();ctx.restore();}ctx.setLineDash([]);ctx.restore();}
  ctx.setTransform(DPR,0,0,DPR,0,0);if(joy.id!==null){ctx.strokeStyle='rgba(234,217,192,.3)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(joy.ox,joy.oy,JR,0,7);ctx.stroke();ctx.fillStyle='rgba(234,217,192,.35)';ctx.beginPath();ctx.arc(joy.ox+joy.x*JR,joy.oy+joy.y*JR,JR*.4,0,7);ctx.fill();}if(PERF)pmk('ui',pt);
}
function drawDrop(d){const bob=Math.sin(d.t*4)*2;
  if(d.food){ctx.drawImage(glow('#f2a04b'),d.x-14,d.y+bob-14,28,28);ctx.fillStyle='#e8d8b0';ctx.beginPath();ctx.moveTo(d.x-7,d.y+bob-4);ctx.lineTo(d.x+7,d.y+bob-4);ctx.lineTo(d.x,d.y+bob+8);ctx.fill();ctx.fillStyle='#8a4a22';ctx.fillRect(d.x-6,d.y+bob-7,12,4);ctx.fillStyle='#8fd16a';ctx.fillRect(d.x-4,d.y+bob-9,3,2);ctx.fillStyle='#c23a2e';ctx.fillRect(d.x+1,d.y+bob-9,3,2);return;}
  if(d.zut){const hh=d.h||0,c=ZUT[d.zut][1];ctx.drawImage(glow(c),d.x-13,d.y+bob-13-hh,26,26);ctx.fillStyle=c;ctx.beginPath();ctx.arc(d.x,d.y+bob-hh,4.5,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(d.x-2,d.y+bob-3-hh,2,2);return;}// v0.78 ingredient
  if(d.mat){const hh=d.h||0,c=MATS[d.mat][1];ctx.drawImage(glow(c),d.x-12,d.y+bob-12-hh,24,24);ctx.fillStyle=c;ctx.fillRect(d.x-4,d.y+bob-4-hh,8,7);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(d.x-4,d.y+bob+1-hh,8,2);return;}
  if(d.heal){ctx.drawImage(glow('#ff5040'),d.x-16,d.y+bob-16,32,32);ctx.fillStyle='#c23a2e';ctx.beginPath();ctx.arc(d.x,d.y+bob,6,0,7);ctx.fill();return;}
  const c=rc(d.item),gs=24+Math.sin(d.t*5)*4,hh=d.h||0;if(d.item.r>=2&&!hh){ctx.fillStyle=c+'30';ctx.fillRect(d.x-3,d.y-(d.item.r>=3?140:70),6,d.item.r>=3?140:70);}
  if(hh){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(d.x,d.y+4,6,2.5,0,0,7);ctx.fill();}
  ctx.drawImage(glow(c),d.x-gs,d.y+bob-gs-hh,gs*2,gs*2);ctx.save();ctx.translate(d.x,d.y+bob-hh);ctx.rotate(Math.PI/4+(hh?d.t*12:0));ctx.fillStyle=c;ctx.fillRect(-6,-6,12,12);ctx.restore();}
/* v0.82 light occlusion: a light whose source stands behind an opaque box is cut out of the darkness only outside that box's screen silhouette,
   so fire, lamps and windows behind a building no longer brighten its facade. Lights without an occluder keep the fast path. */
let SBX=[];const LT=document.createElement('canvas'),ltx=LT.getContext('2d');
function lOcc(x,y,X,Y,r,own){let o=null;const x0=X-r-OX,x1=X+r-OX,y0=Y-r*.7-OY,y1=Y+r*.7-OY;for(const b of SBX){if(b===own||b.oa<.6||b.isSpati||!b._s||b._s[1]<x0||b._s[0]>x1||b._s[3]<y0||b._s[2]>y1||front(b,x,y))continue;(o||(o=[])).push(b);}return o;}
function bSil(g,b){const G=b.rot?obbC(b):[[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]],T=boxTop(b),P_=[];for(const q of G){const X=scx(q[0],q[1]),Y=scy(q[0],q[1]);P_.push([X,Y],[X,Y-T]);}
  P_.sort((a,c)=>a[0]-c[0]||a[1]-c[1]);const cr=(o,a,c)=>(a[0]-o[0])*(c[1]-o[1])-(a[1]-o[1])*(c[0]-o[0]),lo=[],up=[];for(const p of P_){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}for(let i=P_.length-1;i>=0;i--){const p=P_[i];while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}
  const H=lo.slice(0,-1).concat(up.slice(0,-1));g.moveTo(H[0][0],H[0][1]);for(let i=1;i<H.length;i++)g.lineTo(H[i][0],H[i][1]);g.closePath();}
function lHole(X,Y,r,oc){if(LT.width!==lc.width||LT.height!==lc.height){LT.width=lc.width;LT.height=lc.height;}const px=Math.max(0,Math.floor((X-r)*LS)),py=Math.max(0,Math.floor((Y-r*.7)*LS)),pw=Math.min(lc.width-px,Math.ceil(r*2*LS)+2),ph=Math.min(lc.height-py,Math.ceil(r*1.4*LS)+2);if(pw<=0||ph<=0)return;
  ltx.setTransform(1,0,0,1,0,0);ltx.globalCompositeOperation='source-over';ltx.clearRect(px,py,pw,ph);ltx.setTransform(LS,0,0,LS,0,0);ltx.drawImage(LSPR,X-r,Y-r*.7,r*2,r*1.4);ltx.globalCompositeOperation='destination-out';ltx.fillStyle='#000';ltx.beginPath();for(const b of oc)bSil(ltx,b);ltx.fill();
  lx.setTransform(1,0,0,1,0,0);lx.drawImage(LT,px,py,pw,ph,px,py,pw,ph);lx.setTransform(LS,0,0,LS,0,0);}
/* depth order: boxes (buildings, vehicles) sorted by centre depth; each upright item is drawn just before the first box it stands behind and overlaps on screen, else after all boxes. Buildings in front of the player fade. */
function drawSorted(t){const BX=[],IT=[],vL=-OX-60,vR=VW-OX+60,vT=-OY-60,vB=VH-OY+80;
  for(const b of blds){if(isBox(b)){let x0=ix(b.x,b.y+b.h),x1=ix(b.x+b.w,b.y),y0=iy(b.x,b.y)-boxTop(b),y1=iy(b.x+b.w,b.y+b.h);
    if(b.rot){const C=obbC(b).map(p=>[ix(p[0],p[1]),iy(p[0],p[1])]);x0=Math.min(...C.map(p=>p[0]));x1=Math.max(...C.map(p=>p[0]));y0=Math.min(...C.map(p=>p[1]))-boxTop(b);y1=Math.max(...C.map(p=>p[1]));}if(x1<vL||x0>vR||y1<vT||y0>vB)continue;b._s=[x0,x1,y0,y1];b._k=b.x+b.w/2+b.y+b.h/2+(b.dk||0);BX.push(b);}
    else{const ax=b.x+b.w/2,X=ix(ax,b.y),Y=iy(ax,b.y),sc=b.sc||1;if(X+b.spr.width*sc<vL||X-b.spr.width*sc>vR||Y<vT||Y-b.top*sc>vB)continue;IT.push({x:ax,y:b.y,k:0,o:b});}}
  for(const b of barrels)IT.push({x:b.x,y:b.y,k:1,o:b});for(const b of brk)IT.push({x:b.x+b.w/2,y:b.y+b.h/2,k:4,o:b});
  for(const e of enemies)IT.push({x:e.x,y:e.y,k:2,o:e});if(npc)IT.push({x:npc.x,y:npc.y,k:5,o:npc});if(captive)IT.push({x:captive.x,y:captive.y,k:6,o:captive});IT.push({x:P.x,y:P.y,k:3});
  BX.sort((a,b)=>a._k-b._k);SBX=BX;const PX=ix(P.x,P.y),PY=iy(P.x,P.y);
  for(const it of IT){it.s=1e9;it.d=it.x+it.y;if(it.k!==3&&it.k!==0){const X=ix(it.x,it.y),Y=iy(it.x,it.y);if(X<vL||X>vR||Y<vT||Y-60>vB){it.s=-1;continue;}}const X=ix(it.x,it.y),Y=iy(it.x,it.y);
    for(let j=0;j<BX.length;j++){const b=BX[j];if(X<b._s[0]-12||X>b._s[1]+12||Y<b._s[2]||front(b,it.x,it.y))continue;it.s=j;break;}}
  // v0.77: fire barrels and lamp sprites hidden behind a box are marked, so their glow does not shine through the building (light pass below)
  for(const it of IT)if(it.k<2){const b=it.s>=0&&it.s<BX.length?BX[it.s]:null;it.o.occ=!!b&&!(b.oa<.6);}
  for(const b of BX){b._o=!front(b,P.x,P.y)&&PX>b._s[0]-10&&PX<b._s[1]+10&&PY>b._s[2]+10;if(b.grp)b.grp.o=0;}for(const b of BX)if(b.grp&&b._o)b.grp.o=1;// grp: parts of one landmark fade together
  for(const b of BX){const occ=b.grp?b.grp.o:b._o;b.oa=(b.oa==null?1:b.oa)+((occ?.32:1)-(b.oa==null?1:b.oa))*.2;}
  // trees and other tall sprites in front of the player fade too, so the player is never hidden under a canopy
  for(const it of IT)if(it.k===0){const o=it.o,sc=o.sc||1,X=ix(it.x,it.y),Y=iy(it.x,it.y),hw=o.spr.width*sc/2;const occ=it.d>P.x+P.y&&Math.abs(PX-X)<hw+6&&PY<Y+4&&PY>Y-o.top*sc-10;o.oa=(o.oa==null?1:o.oa)+((occ?.3:1)-(o.oa==null?1:o.oa))*.2;}
  const vis=IT.filter(it=>it.s>=0).sort((a,b)=>a.s-b.s||a.d-b.d);let j=0;
  const box=b=>{ctx.globalAlpha=Math.min(b.oa,b.isSpati?b.fade:1);withRot(b,()=>b.veh?drawVehBox(b):b.draw?b.draw(b):drawBox(b));ctx.globalAlpha=1;};
  for(const it of vis){while(j<BX.length&&j<it.s)box(BX[j++]);drawItem(it,t);}while(j<BX.length)box(BX[j++]);
  // enemies standing behind a box: draw again as a faint silhouette on top so tall buildings never hide them
  ctx.globalAlpha=.3;for(const it of vis)if(it.k===2&&it.s<BX.length)drawItem(it,t);ctx.globalAlpha=1;}
function drawItem(it,t){const o=it.o;if(it.k===0){ctx.globalAlpha=o.oa==null?1:o.oa;drawBB(o);ctx.globalAlpha=1;return;}
  if(it.k===3){const f=P.face,a=P.atkA;P.face=sAng(f);P.atkA=sAng(a);upr(P.x,P.y,()=>drawPlayer(t));P.face=f;P.atkA=a;return;}
  if(it.k===2){const fa=o.fa;o.fa=sAng(fa||0);upr(it.x,it.y,()=>drawEnemy(o,t));o.fa=fa;return;}// shield facing is a world angle, draw it in screen space
  upr(it.x,it.y,()=>{if(it.k===1)drawBarrel(o,t);else if(it.k===2)drawEnemy(o,t);else if(it.k===4)drawProp(o);else if(it.k===5)drawNpc(o,t);else drawCaptive(o,t);});}
const cache={};function setT(id,v){if(cache[id]!==v){cache[id]=v;$(id).textContent=v;}}function setW(id,v){v=Math.round(v*10)/10;if(cache[id]!==v){cache[id]=v;$(id).style.width=v+'%';}}
function hud(){if(!P||!ST)return;fsBtn();setW('hpf',100*Math.max(0,P.hp)/ST.maxHp);setT('hpt',Math.max(0,Math.ceil(P.hp))+' / '+ST.maxHp);setW('xpf',100*P.xp/(20+P.lvl*15));
  setT('lv',P.lvl);{const ml=run&&run.meal&&MEALS.find(m=>m.k===run.meal),bl=(ml?[ml.n+' '+ml.d]:[]).concat(Object.keys(SHR).filter(k=>SHR[k]>0).map(k=>`${SHRN[k][0]} ${Math.ceil(SHR[k])} s`)).join(' · ');setT('bufs',bl);}setT('rem',run?enemies.length+run.toSpawn:0);const sn=streak.n>=3?streak.n:0;if(cache.sn!==sn){const el=$('streak');el.hidden=!sn;if(sn){$('stn').textContent=sn;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}cache.sn=sn;}setT('sc',S.scrap);setT('wv',run?run.wave:0);setT('wmax',run&&run.tun?TSEC.length:run&&run.endless?'∞':WAVES);setT('dn',D.n+(run&&run.th?' · B'+run.th:''));setT('skill',ST.K.sk);
  for(const[id,k]of[['c1','verband'],['c2','molotow']]){const n=S.cons[k]||0;if(cache[id]!==n){cache[id]=n;$(id+'n').textContent=n;$(id).classList.toggle('empty',!n);}}
  const b=run&&run.boss;$('boss').hidden=!b;if(b){setT('bossn',b.name);setW('bossf',100*Math.max(0,b.hp)/b.max);}
  const cd=P.dashCd>0?Math.round(360*(1-P.dashCd/ST.dashCd)):360;if(cache.cd!==cd){cache.cd=cd;$('dash').style.setProperty('--cd',cd+'deg');}
  {const kn=krName(krOf());if(cache.kn!==kn){cache.kn=kn;const b=$('skill');b.textContent=kn;b.style.fontSize=kn.length>12?'11px':kn.length>9?'13px':'';}}// v0.82 power name on the button
  const sk=P.skCd>0?Math.round(360*(1-P.skCd/ST.skCd)):360;if(cache.sk!==sk){cache.sk=sk;$('skill').style.setProperty('--sk',sk+'deg');$('skill').classList.toggle('ready',sk>=360);}}
const mini=$('mini'),mx_=mini.getContext('2d');
function drawMini(){if(!MB)return;const k=WS>WH?192/3200:192/WS,dot=(x,y,r,c)=>{mx_.fillStyle=c;mx_.fillRect(x*k-r,y*k-r,r*2,r*2);};mx_.setTransform(1,0,0,1,0,0);mx_.fillStyle='#0d0907';mx_.fillRect(0,0,192,192);
  // rotated 45 degrees so screen-up on the minimap matches screen-up in the iso view
  mx_.save();mx_.translate(96,96);mx_.rotate(Math.PI/4);mx_.scale(IS,IS);mx_.translate(-96,-96);if(WS>WH)mx_.translate(96-P.x*k,96-P.y*k);mx_.drawImage(MB,0,0);// long tunnel: the minimap follows the player
  if(spati){mx_.strokeStyle='#f2d14b';mx_.lineWidth=3;mx_.strokeRect(spati.x*k,spati.y*k,spati.w*k,spati.h*k);}
  for(const m of marks)dot(m.x,m.y,4,'#EF9F27');for(const b of brk)if(b.type==='chest')dot(b.x+b.w/2,b.y+b.h/2,3.5,'#c9a227');for(const d of drops)if(d.item&&d.item.r>=2)dot(d.x,d.y,3,RAR[d.item.r].c);
  for(const e of enemies)dot(e.x,e.y,e.type==='boss'?7:e.elite?4:3,e.elite?EMC[e.elite]:e.type==='boss'?'#ff6a2a':'#c23a2e');
  if(crate)dot(crate.x,crate.y,5,'#f2d14b');if(npc)dot(npc.x,npc.y,5,'#8fd16a');if(zone){mx_.strokeStyle='#7dd3ff';mx_.lineWidth=2;mx_.beginPath();mx_.arc(zone.x*k,zone.y*k,zone.r*k,0,7);mx_.stroke();}
  const c=[[0,0],[VW,0],[VW,VH],[0,VH]].map(q=>s2w(q[0]-OX,q[1]-OY));mx_.strokeStyle='rgba(255,255,255,.4)';mx_.lineWidth=1.5;mx_.beginPath();c.forEach((q,i)=>i?mx_.lineTo(q[0]*k,q[1]*k):mx_.moveTo(q[0]*k,q[1]*k));mx_.closePath();mx_.stroke();dot(P.x,P.y,4.5,'#ffffff');mx_.restore();}
// ?debug=hit: hit areas over the scene (player radius, current melee sector, enemy radii), for checking sprites against hitboxes (pipeline/contract.md)
const DBG=/[?&]debug=hit\b/.test(location.search);
// v0.77 optional fps counter (Optionen › Bild und Ton): frames counted per 0.5 s, written to a small DOM label (no canvas text cost)
let fpsN=0,fpsT=0;function fpsTick(t){if(!S.fps){if(fpsT){fpsT=0;$('fps').hidden=true;}return;}fpsN++;if(!fpsT)fpsT=t;if(t-fpsT>=500){const el=$('fps');el.hidden=false;el.textContent=Math.round(fpsN*1000/(t-fpsT))+' fps';fpsN=0;fpsT=t;}}
function drawDebug(){if(!P)return;ctx.setTransform(DPR*Z,0,0,DPR*Z,0,0);ctx.lineWidth=1.5;const ring=(x,y,r,c)=>{ctx.strokeStyle=c;ctx.beginPath();for(let i=0;i<=24;i++){const a=i/24*7,X=scx(x+Math.cos(a)*r,y+Math.sin(a)*r),Y=scy(x+Math.cos(a)*r,y+Math.sin(a)*r);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();};
  ring(P.x,P.y,P.r,'#ff3366');for(const e of enemies)ring(e.x,e.y,e.r,'#ffd23f');
  const K=ST&&KIND[ST.kind];if(K&&K.reach&&P.swingT>0){ctx.strokeStyle='#00ff88';ctx.beginPath();ctx.moveTo(scx(P.x,P.y),scy(P.x,P.y));for(let i=0;i<=24;i++){const a=P.atkA-K.arc+2*K.arc*i/24,x=P.x+Math.cos(a)*ST.reach,y=P.y+Math.sin(a)*ST.reach;ctx.lineTo(scx(x,y),scy(x,y));}ctx.closePath();ctx.stroke();}}
function loop(t){requestAnimationFrame(loop);const minF=S.eco?1000/31:1000/61;if(t-last<minF-3)return;// v0.77: -3 ms slack. Without it 144 Hz screens dropped to an uneven ~48 fps and Firefox rAF jitter (16.2 ms) skipped whole frames
  fpsTick(t);const dt=Math.min(.05,(t-last)/1000);if(PERF)pmk('frame',last);last=t;
  if(state==='menu'){P.walk+=dt*6;P.mvx=.6;P.face=Math.sin(t*.0004)>0?0:Math.PI;}
  if(freeze>0&&state==='play'){freeze-=dt;render(t);hud();return;}{const u=PERF?performance.now():0;update(dt);if(PERF)pmk('update',u);}if(state==='paused'){padPoll();if(run&&run.tl)run.tl.pt+=dt;}render(t);if(DBG)drawDebug();if(PERF)drawPerf();hud();const mh=!run;if(cache.mh!==mh){cache.mh=mh;mini.hidden=mh;document.body.classList.toggle('inrun',!mh);}if(run&&(++mf%(S.eco?6:3)===0))drawMini();if(state==='menu')P.mvx=0;}
