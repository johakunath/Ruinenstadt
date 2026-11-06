/* ================= render ================= */
function drawBarrel(b,t){const x=b.x,y=b.y;ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(x+3,y+4,11,5,0,0,7);ctx.fill();
  ctx.fillStyle='#4a2414';ctx.fillRect(x-8,y-14,16,16);ctx.fillStyle='#6b3a24';ctx.fillRect(x-8,y-14,5,16);ctx.fillStyle='#2a140b';ctx.fillRect(x-8,y-9,16,2);ctx.fillRect(x-8,y-3,16,2);
  ctx.fillStyle='#1a0d07';ctx.beginPath();ctx.ellipse(x,y-14,8,3.5,0,0,7);ctx.fill();
  for(let k=0;k<4;k++){const h=9+Math.sin(t*.018+b.ph+k*1.7)*4+Math.sin(t*.031+k)*2,fx=x-6+k*4;ctx.fillStyle=k%2?'#EF9F27':'#FAC775';ctx.beginPath();ctx.moveTo(fx-3,y-14);ctx.lineTo(fx+3,y-14);ctx.lineTo(fx+Math.sin(t*.02+k)*2,y-14-h);ctx.fill();}}
let last=performance.now();
function render(t){
  ctx.setTransform(DPR*Z,0,0,DPR*Z,0,0);ctx.globalCompositeOperation='source-over';
  const tx=P.x+(state==='play'?P.mvx*70:0),ty=P.y-20+(state==='play'?P.mvy*50:0);if(cam.x==null||Math.hypot(cam.x-tx,cam.y-ty)>600){cam.x=tx;cam.y=ty;}else{cam.x+=(tx-cam.x)*.12;cam.y+=(ty-cam.y)*.12;}
  const sx=R(-shake,shake),sy=R(-shake,shake),camX=clamp(cam.x-VW/2+sx,0,Math.max(0,WS-VW)),camY=clamp(cam.y-VH/2+sy,0,Math.max(0,WS-VH)),vw=Math.min(VW,WS),vh=Math.min(VH,WS);
  ctx.fillStyle='#17110d';ctx.fillRect(0,0,VW,VH);ctx.drawImage(G,camX,camY,vw,vh,0,0,vw,vh);
  ctx.save();ctx.translate(-camX,-camY);
  drawWaters(t,camX,camY);
  for(const tl of teles){const p=1-tl.t/tl.max;ctx.fillStyle=`rgba(194,58,46,${.12+.25*p})`;ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r,0,7);ctx.fill();ctx.strokeStyle='rgba(255,140,90,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r,0,7);ctx.stroke();ctx.beginPath();ctx.arc(tl.x,tl.y,tl.r*p,0,7);ctx.stroke();}
  for(const r of rings){ctx.strokeStyle=`rgba(${r.col},${.7*(1-r.r/r.max)})`;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(r.x,r.y,r.r,r.r*.6,0,0,7);ctx.stroke();}
  for(const s of shocks){ctx.strokeStyle=s.acid?`rgba(151,196,89,${1-s.r/s.max})`:`rgba(239,159,39,${1-s.r/s.max})`;ctx.lineWidth=10;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.stroke();}
  for(const f of fields){ctx.globalAlpha=Math.min(1,f.t);ctx.drawImage(glow('#ff6a2a'),f.x-f.r*1.3,f.y-f.r*.8,f.r*2.6,f.r*1.6);ctx.globalAlpha=1;}
  for(const e of enemies)if(e.ch>0){ctx.strokeStyle=`rgba(255,80,60,${.3+.6*(1-e.ch/.6)})`;ctx.lineWidth=3;ctx.setLineDash([10,6]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+e.rdx*240,e.y+e.rdy*240);ctx.stroke();ctx.setLineDash([]);}
  if(zone){ctx.fillStyle='rgba(125,211,255,.08)';ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r,0,7);ctx.fill();ctx.strokeStyle='rgba(125,211,255,.5)';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#7dd3ff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r-6,-1.57,-1.57+6.283*zone.p/zone.need);ctx.stroke();
    ctx.strokeStyle='#24201c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(zone.x,zone.y);ctx.lineTo(zone.x,zone.y-46);ctx.moveTo(zone.x-9,zone.y);ctx.lineTo(zone.x,zone.y-30);ctx.lineTo(zone.x+9,zone.y);ctx.stroke();
    ctx.fillStyle=Math.sin(Date.now()*.01)>0?'#7dd3ff':'#2a4a5a';ctx.beginPath();ctx.arc(zone.x,zone.y-48,3,0,7);ctx.fill();}
  for(const h of shrines)if(!h.used){const a=.25+.15*Math.sin(t*.004+h.x);ctx.strokeStyle=`rgba(125,211,255,${a})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(h.x,h.y+2,30,11,0,0,7);ctx.stroke();}
  for(const c of corpses){ctx.globalAlpha=Math.min(1,c.t)*.85;ctx.save();ctx.translate(c.x,c.y);ctx.scale(c.fl*c.r/10,c.r/10);ctx.fillStyle='rgba(40,12,6,.5)';ctx.beginPath();ctx.ellipse(0,2,15,5,0,0,7);ctx.fill();
    ctx.fillStyle=dark(c.col,.6);ctx.beginPath();ctx.ellipse(0,0,11,4.5,0,0,7);ctx.fill();ctx.fillStyle=dark(c.col,.45);ctx.beginPath();ctx.arc(11,-1,4,0,7);ctx.fill();ctx.restore();}ctx.globalAlpha=1;
  for(const h of hazards){ctx.globalAlpha=Math.min(1,h.t);ctx.drawImage(glow(h.col||'#ff6a2a'),h.x-h.r*1.4,h.y-h.r*.9,h.r*2.8,h.r*1.8);}ctx.globalAlpha=1;
  for(const d of drops){const bob=Math.sin(d.t*4)*2;
    if(d.food){ctx.drawImage(glow('#f2a04b'),d.x-14,d.y+bob-14,28,28);ctx.fillStyle='#e8d8b0';ctx.beginPath();ctx.moveTo(d.x-7,d.y+bob-4);ctx.lineTo(d.x+7,d.y+bob-4);ctx.lineTo(d.x,d.y+bob+8);ctx.fill();ctx.fillStyle='#8a4a22';ctx.fillRect(d.x-6,d.y+bob-7,12,4);ctx.fillStyle='#8fd16a';ctx.fillRect(d.x-4,d.y+bob-9,3,2);ctx.fillStyle='#c23a2e';ctx.fillRect(d.x+1,d.y+bob-9,3,2);continue;}
    if(d.heal){ctx.drawImage(glow('#ff5040'),d.x-16,d.y+bob-16,32,32);ctx.fillStyle='#c23a2e';ctx.beginPath();ctx.arc(d.x,d.y+bob,6,0,7);ctx.fill();continue;}
    const c=rc(d.item),gs=24+Math.sin(d.t*5)*4,hh=d.h||0;if(d.item.r>=2&&!hh){ctx.fillStyle=c+'30';ctx.fillRect(d.x-3,d.y-(d.item.r>=3?140:70),6,d.item.r>=3?140:70);}
    if(hh){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(d.x,d.y+4,6,2.5,0,0,7);ctx.fill();}
    ctx.drawImage(glow(c),d.x-gs,d.y+bob-gs-hh,gs*2,gs*2);ctx.save();ctx.translate(d.x,d.y+bob-hh);ctx.rotate(Math.PI/4+(hh?d.t*12:0));ctx.fillStyle=c;ctx.fillRect(-6,-6,12,12);ctx.restore();}
  if(crate){ctx.fillStyle='rgba(242,209,75,.18)';ctx.fillRect(crate.x-5,crate.y-120,10,120);ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(crate.x-10,crate.y+6,24,6);
    ctx.fillStyle='#7a5530';ctx.fillRect(crate.x-12,crate.y-12,24,22);ctx.strokeStyle='#3a2414';ctx.lineWidth=2;ctx.strokeRect(crate.x-12,crate.y-12,24,22);ctx.beginPath();ctx.moveTo(crate.x-12,crate.y-12);ctx.lineTo(crate.x+12,crate.y+10);ctx.stroke();
    ctx.strokeStyle='#f2d14b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(crate.x,crate.y,24,-1.57,-1.57+6.283*crate.t/28);ctx.stroke();}
  const L=[];
  for(const b of blds){const bx=b.x+(b.ox||0);if(bx+b.spr.width>camX-10&&bx<camX+VW+10&&b.y+b.h>camY-10&&b.y-b.top<camY+VH+10)L.push({y:b.y+b.h,k:0,o:b});}
  for(const b of barrels)if(b.x>camX-40&&b.x<camX+VW+40&&b.y>camY-40&&b.y<camY+VH+60)L.push({y:b.y,k:1,o:b});
  for(const b of brk)if(b.x>camX-40&&b.x<camX+VW+40&&b.y>camY-40&&b.y<camY+VH+60)L.push({y:b.y+b.h,k:4,o:b});
  for(const e of enemies)if(e.x>camX-80&&e.x<camX+VW+80&&e.y>camY-40&&e.y<camY+VH+140)L.push({y:e.y+e.r*.75,k:2,o:e});if(npc)L.push({y:npc.y+9,k:5,o:npc});L.push({y:P.y+9,k:3});L.sort((a,b)=>a.y-b.y);
  for(const it of L){if(it.k===0){const o=it.o;if(o.isSpati&&o.fade<.99){ctx.globalAlpha=o.fade;ctx.drawImage(o.spr,o.x,o.y-o.top);ctx.globalAlpha=1;}else ctx.drawImage(o.spr,o.x+(o.ox||0),o.y-o.top);}
    else if(it.k===1)drawBarrel(it.o,t);else if(it.k===2)drawEnemy(it.o,t);else if(it.k===4)drawProp(it.o);else if(it.k===5)drawNpc(it.o,t);else drawPlayer(t);}
  if(P.spin>0){ctx.strokeStyle='rgba(250,199,117,.75)';ctx.lineWidth=5;const a=t*.03,rr_=72*(1+.2*pk('reach'));for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(P.x,P.y-10,rr_,a+k*2.09,a+k*2.09+1.1);ctx.stroke();}}
  for(const m of mols){const f=m.t/m.dur,x=m.x0+(m.x1-m.x0)*f,y=m.y0+(m.y1-m.y0)*f-Math.sin(f*Math.PI)*60;ctx.fillStyle='#5a7a4a';ctx.fillRect(x-2.5,y-5,5,9);ctx.fillStyle='#ff8a3d';ctx.fillRect(x-1,y-8,2,3);}
  for(const p of pproj){if(p.fin)ctx.drawImage(glow('#f2d14b'),p.x-14,p.y-28,28,28);ctx.fillStyle=p.fin?'#f2d14b':p.el?ELC[p.el]:'#ead9c0';ctx.beginPath();ctx.arc(p.x,p.y-14,p.r,0,7);ctx.fill();}
  ctx.lineWidth=2;for(const b of bolts){ctx.strokeStyle=`rgba(125,211,255,${b.life/.16})`;ctx.beginPath();ctx.moveTo(b.x0,b.y0);for(let i=1;i<6;i++){const f=i/6;ctx.lineTo(b.x0+(b.x1-b.x0)*f+R(-6,6),b.y0+(b.y1-b.y0)*f+R(-6,6));}ctx.lineTo(b.x1,b.y1);ctx.stroke();}
  for(const p of eproj){ctx.drawImage(glow('#97c459'),p.x-p.r*3,p.y-p.r*3,p.r*6,p.r*6);ctx.fillStyle='#b5e07a';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();}
  for(const s of swings){const a=s.life/s.max;ctx.strokeStyle=s.fin?`rgba(255,230,140,${a})`:s.kind==='hammer'?`rgba(239,159,39,${a*.8})`:`rgba(250,199,117,${a})`;ctx.lineWidth=(s.kind==='hammer'?9:5)+(s.fin?5:0);ctx.beginPath();ctx.arc(P.x,P.y-10,s.reach-10,s.a-s.arc,s.a+s.arc);ctx.stroke();}
  for(const p of parts){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.col;ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);}ctx.globalAlpha=1;
  ctx.restore();
  lx.setTransform(LS,0,0,LS,0,0);lx.globalCompositeOperation='source-over';lx.clearRect(0,0,VW,VH);lx.fillStyle=`rgba(6,4,3,${P.dark?.95:clamp(D.dark-.12+(run?run.wave:0)*.017,.45,.93)})`;lx.fillRect(0,0,VW,VH);lx.globalCompositeOperation='destination-out';
  const lit=(x,y,r)=>{x-=camX;y-=camY;if(x<-r||x>VW+r||y<-r||y>VH+r)return;lx.drawImage(LSPR,x-r,y-r,r*2,r*2);};
  lit(P.x,P.y-10,(P.dark?(P.torch?270:95):250)+Math.sin(t*.008)*8+Math.sin(t*.021)*4);
  for(const b of barrels)lit(b.x,b.y-10,150+Math.sin(t*.012+b.ph)*12);
  for(const b of blds)for(const l of b.lights){if(l.inner){if(b.inside)lit(l.x,l.y,150);continue;}if(l.r||!S.eco)lit(l.x,l.y,l.r||34);}
  for(const p of eproj)lit(p.x,p.y,46);for(const b of bolts)lit(b.x1,b.y1,60);if(!S.eco)for(const h of hazards)lit(h.x,h.y,50);for(const d of drops)if(d.item&&d.item.r>=2)lit(d.x,d.y,60);for(const f of fields)lit(f.x,f.y,f.r+50);
  if(crate)lit(crate.x,crate.y,110);if(npc)lit(npc.x,npc.y-10,110);if(zone)lit(zone.x,zone.y,zone.r+50);for(const tl of teles)lit(tl.x,tl.y,tl.r*1.3);for(const s of shocks)lit(s.x,s.y,s.r+40);
  ctx.drawImage(lc,0,0,VW,VH);if(flashT>0){ctx.fillStyle=`rgba(255,90,40,${flashT*.6})`;ctx.fillRect(0,0,VW,VH);}if(goldT>0){ctx.fillStyle=`rgba(255,200,90,${goldT*.45})`;ctx.fillRect(0,0,VW,VH);}if(state==='play'&&P.hp<ST.maxHp*.3){ctx.globalAlpha=.5+.3*Math.sin(t*.008);ctx.drawImage(VIG,0,0,VW,VH);ctx.globalAlpha=1;}
  ctx.globalCompositeOperation='lighter';
  if(P.torch)ctx.drawImage(FIRE,P.x-camX-110,P.y-40-camY-110,220,220);
  for(const b of barrels){const x=b.x-camX,y=b.y-10-camY;if(x<-130||x>VW+130||y<-130||y>VH+130)continue;ctx.drawImage(FIRE,x-120,y-120,240,240);}
  ctx.globalCompositeOperation='source-over';
  drawWeather(t,S.eco?.033:.016);
  ctx.textAlign='center';ctx.font='600 13px "Barlow Condensed",sans-serif';for(const d of drops){if(!d.item||d.h||(d.item.r<1&&Math.hypot(d.x-P.x,d.y-P.y)>160))continue;const x=d.x-camX,y=d.y-camY+22;if(x<-80||x>VW+80||y<-20||y>VH+20)continue;const w=ctx.measureText(d.item.name).width+10;ctx.fillStyle='rgba(13,9,7,.78)';ctx.fillRect(x-w/2,y-11,w,15);ctx.fillStyle=rc(d.item);ctx.fillText(d.item.name,x,y);}
  for(const n of nums){ctx.font=`600 ${Math.round((n.big?24:18)*(1+Math.max(0,n.life-.62)*(n.big?3:1.2)))}px "Barlow Condensed",sans-serif`;ctx.globalAlpha=Math.min(1,n.life*2);const x=n.x-camX,y=n.y-camY;ctx.fillStyle='#0d0907';ctx.fillText(n.t,x+1,y+1);ctx.fillStyle=n.col;ctx.fillText(n.t,x,y);}ctx.globalAlpha=1;
  for(const[o,col]of[[crate,'#f2d14b'],[npc,'#8fd16a'],[zone,'#7dd3ff']]){if(!o)continue;const x=o.x-camX,y=o.y-camY;if(x<0||x>VW||y<0||y>VH){const a=Math.atan2(y-VH/2,x-VW/2),m=46,ex=clamp(VW/2+Math.cos(a)*VW,m,VW-m),ey=clamp(VH/2+Math.sin(a)*VH,m+90,VH-m-160);
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-11);ctx.lineTo(-8,11);ctx.fill();ctx.restore();}}
  ctx.setTransform(DPR,0,0,DPR,0,0);if(joy.id!==null){ctx.strokeStyle='rgba(234,217,192,.3)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(joy.ox,joy.oy,JR,0,7);ctx.stroke();ctx.fillStyle='rgba(234,217,192,.35)';ctx.beginPath();ctx.arc(joy.ox+joy.x*JR,joy.oy+joy.y*JR,JR*.4,0,7);ctx.fill();}
}
const cache={};function setT(id,v){if(cache[id]!==v){cache[id]=v;$(id).textContent=v;}}function setW(id,v){v=Math.round(v*10)/10;if(cache[id]!==v){cache[id]=v;$(id).style.width=v+'%';}}
function hud(){if(!P||!ST)return;setW('hpf',100*Math.max(0,P.hp)/ST.maxHp);setT('hpt',Math.max(0,Math.ceil(P.hp))+' / '+ST.maxHp);setW('xpf',100*P.xp/(20+P.lvl*15));
  setT('lv',P.lvl);{const bl=Object.keys(SHR).filter(k=>SHR[k]>0).map(k=>`${SHRN[k][0]} ${Math.ceil(SHR[k])} s`).join(' · ');setT('bufs',bl);}setT('rem',run?enemies.length+run.toSpawn:0);const sn=streak.n>=3?streak.n:0;if(cache.sn!==sn){const el=$('streak');el.hidden=!sn;if(sn){$('stn').textContent=sn;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}cache.sn=sn;}setT('sc',S.scrap);setT('wv',run?run.wave:0);setT('dn',D.n+(run&&run.th?' · B'+run.th:''));setT('skill',ST.K.sk);
  for(const[id,k]of[['c1','verband'],['c2','molotow']]){const n=S.cons[k]||0;if(cache[id]!==n){cache[id]=n;$(id+'n').textContent=n;$(id).classList.toggle('empty',!n);}}
  const b=run&&run.boss;$('boss').hidden=!b;if(b){setT('bossn',b.name);setW('bossf',100*Math.max(0,b.hp)/b.max);}
  const cd=P.dashCd>0?Math.round(360*(1-P.dashCd/ST.dashCd)):360;if(cache.cd!==cd){cache.cd=cd;$('dash').style.setProperty('--cd',cd+'deg');}
  const sk=P.skCd>0?Math.round(360*(1-P.skCd/ST.skCd)):360;if(cache.sk!==sk){cache.sk=sk;$('skill').style.setProperty('--sk',sk+'deg');$('skill').classList.toggle('ready',sk>=360);}}
const mini=$('mini'),mx_=mini.getContext('2d');
function drawMini(){if(!MB)return;const k=192/WS,dot=(x,y,r,c)=>{mx_.fillStyle=c;mx_.fillRect(x*k-r,y*k-r,r*2,r*2);};mx_.drawImage(MB,0,0);
  if(spati){mx_.strokeStyle='#f2d14b';mx_.lineWidth=2;mx_.strokeRect(spati.x*k,spati.y*k,spati.w*k,spati.h*k);}
  for(const m of marks)dot(m.x,m.y,3,'#EF9F27');for(const b of brk)if(b.type==='chest')dot(b.x+b.w/2,b.y+b.h/2,2.5,'#c9a227');for(const d of drops)if(d.item&&d.item.r>=2)dot(d.x,d.y,2,RAR[d.item.r].c);
  for(const e of enemies)dot(e.x,e.y,e.type==='boss'?5:e.elite?3:2,e.elite?EMC[e.elite]:e.type==='boss'?'#ff6a2a':'#c23a2e');
  if(crate)dot(crate.x,crate.y,4,'#f2d14b');if(npc)dot(npc.x,npc.y,4,'#8fd16a');if(zone){mx_.strokeStyle='#7dd3ff';mx_.lineWidth=2;mx_.beginPath();mx_.arc(zone.x*k,zone.y*k,zone.r*k,0,7);mx_.stroke();}
  mx_.strokeStyle='rgba(255,255,255,.35)';mx_.lineWidth=1;mx_.strokeRect(clamp(P.x-VW/2,0,WS)*k,clamp(P.y-VH/2,0,WS)*k,VW*k,VH*k);dot(P.x,P.y,3.5,'#ffffff');}
function loop(t){requestAnimationFrame(loop);const minF=S.eco?1000/31:1000/61;if(t-last<minF)return;const dt=Math.min(.05,(t-last)/1000);last=t;
  if(state==='menu'){P.walk+=dt*6;P.mvx=.6;P.face=Math.sin(t*.0004)>0?0:Math.PI;}
  if(freeze>0&&state==='play'){freeze-=dt;render(t);hud();return;}update(dt);render(t);hud();const mh=!run;if(cache.mh!==mh){cache.mh=mh;mini.hidden=mh;document.body.classList.toggle('inrun',!mh);}if(run&&(++mf%(S.eco?6:3)===0))drawMini();if(state==='menu')P.mvx=0;}
