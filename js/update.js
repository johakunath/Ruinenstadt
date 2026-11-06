/* ================= update ================= */
function update(dt){
  if(bannerT>0){bannerT-=dt;if(bannerT<=0)$('banner').style.opacity=0;}
  for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.9;p.vy*=.9;p.life-=dt;}parts=parts.filter(p=>p.life>0);
  for(const n of nums){n.y-=32*dt;n.life-=dt;}nums=nums.filter(n=>n.life>0);
  for(const s of swings)s.life-=dt;swings=swings.filter(s=>s.life>0);
  for(const b of bolts)b.life-=dt;bolts=bolts.filter(b=>b.life>0);
  for(const b of brk)b.flash-=dt;
  shake=Math.max(0,shake-dt*30);flashT=Math.max(0,flashT-dt);goldT=Math.max(0,goldT-dt);for(const c of corpses)c.t-=dt;corpses=corpses.filter(c=>c.t>0);
  for(const b of barrels)if(Math.random()<dt*2)parts.push({x:b.x+R(-4,4),y:b.y-18,vx:R(-8,8),vy:R(-50,-25),life:R(.5,1),max:1,col:'#EF9F27',size:R(1.5,2.5)});
  if(spati){const inS=P.x>spati.x&&P.x<spati.x+spati.w&&P.y>spati.y&&P.y<spati.y+spati.h;spati.fade+=((inS?.12:1)-spati.fade)*Math.min(1,dt*8);spati.inside=inS;
    if(inS&&!spati.seen&&state==='play'){spati.seen=true;toast(`<span style="color:var(--ember);font-family:var(--f-display);font-size:22px">${spati.name}</span>`);sfx('bell');}}
  if(state!=='play')return;
  S.rec.time+=dt;tipT-=dt;
  if(streak.n){streak.t-=dt;if(streak.t<=0){if(streak.n>=10){const b=Math.round(streak.n*.6*(1+.1*D.i)*DF().sc);S.scrap+=b;run.sg+=b;toast(`Serie ${streak.n} · <span style="color:var(--ember)">+${b} Schrott</span>`);}streak.n=0;}}
  if(P.hp<ST.maxHp*.3){beatT-=dt;if(beatT<=0){beatT=Math.max(.5,.5+P.hp/ST.maxHp*1.6);sfx('beat');}}
  if(Math.hypot(P.mvx,P.mvy)>.3&&P.dashT<=0){stepT-=dt;if(stepT<=0){stepT=.22;parts.push({x:P.x+R(-4,4),y:P.y+8,vx:R(-12,12),vy:R(-8,-2),life:.4,max:.4,col:'rgba(120,100,80,.35)',size:R(3,5)});}}if(tipQ.length&&tipT<=0){toast('<span style="color:#7dd3ff">Tipp</span> · '+tipQ.shift());tipT=3.2;}
  {const dz=darks.find(z=>P.x>z.x&&P.x<z.x+z.w&&P.y>z.y&&P.y<z.y+z.h);P.dark=!!dz;P.torch=P.dark&&ST.kind!=='hammer';
   if(dz&&!dz.seen){dz.seen=true;toast(P.torch?'<span style="color:#f2d14b">Dunkelzone</span> · Fackel entzündet':'<span style="color:#f2d14b">Dunkelzone</span> · Der Hammer braucht beide Hände, keine Fackel');sfx('ignite');}}
  let mx=joy.x,my=joy.y;if(keys.KeyA||keys.ArrowLeft)mx-=1;if(keys.KeyD||keys.ArrowRight)mx+=1;if(keys.KeyW||keys.ArrowUp)my-=1;if(keys.KeyS||keys.ArrowDown)my+=1;
  const ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;}P.mvx=mx;P.mvy=my;
  if(dashReq){dashReq=false;dash();}if(skillReq){skillReq=false;skill();}
  if(P.ratT>0)P.ratT-=dt;
  if(P.dashT>0){P.dashT-=dt;if(P.dashT<=0&&hasL('ritter')){shocks.push({x:P.x,y:P.y,r:10,max:110,hit:[],small:1});sfx('boom');shake=Math.max(shake,5);}P.x+=P.ddx*640*dt;P.y+=P.ddy*640*dt;parts.push({x:P.x,y:P.y-12,vx:0,vy:0,life:.22,max:.22,col:'rgba(234,217,192,.35)',size:14});
    if(pk('ram'))for(const e of enemies)if(!P.ramHit.includes(e)&&Math.hypot(e.x-P.x,e.y-P.y)<e.r+P.r+8){P.ramHit.push(e);hit(e,ST.dmg*1.2*pk('ram'),false,{knock:360});}}
  else{P.x+=mx*ST.spd*dt;P.y+=my*ST.spd*dt;}
  if(ml>.15){P.walk+=dt*13*Math.min(1,ml);if(P.swingT<=0)P.face=Math.atan2(my,mx);}
  collide(P);P.comboT-=dt;P.cd-=dt;P.inv-=dt;P.dashCd-=dt;P.swingT-=dt;P.skCd-=dt;
  if(ST.regen)P.hp=Math.min(ST.maxHp,P.hp+ST.regen*dt);
  if(P.spin>0){P.spin-=dt;P.spinTick-=dt;if(P.spinTick<=0){P.spinTick=.15;const sr=80*(1+.2*pk('reach'));for(const e of enemies)if(Math.hypot(e.x-P.x,e.y-P.y)<sr+e.r){const c=Math.random()<ST.crit;hit(e,ST.dmg*.6*(c?2:1),c,{knock:160});}propsInRadius(P.x,P.y,sr,ST.dmg*.6);sfx('swing');}}
  if(P.hot>0){P.hot-=dt;P.hp=Math.min(ST.maxHp,P.hp+ST.maxHp*.4/3*dt);}if(P.fed>0)P.fed-=dt;
  for(const m of mols){m.t+=dt;if(m.t>=m.dur){fields.push({x:m.x1,y:m.y1,r:65*(pk('blast')?1.5:1),t:4});sfx('ignite');sfx('crash');burst(m.x1,m.y1,'#ff6a2a',24,200);propsInRadius(m.x1,m.y1,60,ST.dmg*2);m.done=1;}}mols=mols.filter(m=>!m.done);
  for(const f of fields){f.t-=dt;if(Math.random()<dt*22)parts.push({x:f.x+R(-f.r,f.r)*.8,y:f.y+R(-f.r,f.r)*.4,vx:R(-8,8),vy:R(-70,-30),life:.5,max:.5,col:pick(['#ff6a2a','#FAC775','#EF9F27']),size:R(2,4)});
    for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-f.x,(e.y-f.y)*1.6)<f.r){const W=ER(e,'fire');if(W>0){e.bdps=Math.max(e.burn>0?e.bdps||0:0,ST.dmg*.9*W);e.burn=Math.max(e.burn||0,.7);}}}
  fields=fields.filter(f=>f.t>0);
  if(atkHeld)attack();
  for(const m of marks)if(!m.seen&&Math.hypot(m.x-P.x,m.y-P.y)<(m.soft?180:260)){m.seen=1;if(!m.soft&&run.seen[m.n])continue;run.seen[m.n]=1;toast(m.soft?`<span style="color:var(--dim)">${m.n}</span>`:`<span style="color:var(--ember);font-family:var(--f-display);font-size:22px">${m.n}</span>`);}
  if(run.toSpawn>0){run.spawnT-=dt;if(run.spawnT<=0){spawnOne();run.toSpawn--;run.spawnT=Math.max(.3,1-run.wave*.05);}}
  else if(!enemies.length&&!run.cleared){run.cleared=true;run.perkDone=false;progWave(run.wave);if(run.wave>=10&&!run.endless){win();return;}if(run.endless&&run.wave>10){const b=Math.round(10*(run.wave-10)*(1+.1*D.i)*DF().sc);S.scrap+=b;run.sg+=b;S.eb[run.d]=Math.max(S.eb[run.d]||0,run.wave);}toast('Welle '+run.wave+' geschafft');S.best[run.d]=Math.max(S.best[run.d],run.wave);save();run.breakT=2;}
  if(run.cleared){run.breakT-=dt;if(run.breakT<=0){if(!run.perkDone){offerPerks();if(state!=='play')return;}else{run.cleared=false;startWave();}}}
  for(const k in SHR)if(SHR[k]>0){SHR[k]-=dt;if(SHR[k]<=0){SHR[k]=0;refresh();toast(`<span style="color:var(--dim)">${SHRN[k][0]} ist verflogen</span>`);}}
  for(const h of shrines)if(!h.used&&Math.hypot(h.x-P.x,h.y+10-P.y)<46){h.used=1;h.o.spr=h.off;h.o.lights=[];const k=pick(Object.keys(SHRN));SHR[k]=45;refresh();toast(`Litfaßsäule · <span style="color:#7dd3ff">${SHRN[k][0]}</span>: ${SHRN[k][1]} (45 s)`);sfx('legend');burst(h.x,h.y-30,'#7dd3ff',24,200);rings.push({x:h.x,y:h.y,r:10,max:120,col:'125,211,255'});prog('shrine');}
  if(run.crateIn>0){run.crateIn-=dt;if(run.crateIn<=0)spawnCrate();}
  if(run.evIn>0){run.evIn-=dt;if(run.evIn<=0)startEvent(run.evType);}
  if(captive){captive.t+=dt;if(!captive.free&&!enemies.some(e=>e.guard2&&e.hp>0)){captive.free=true;toast('Die Wachen sind besiegt · geh zur Gefangenen');}
    if(captive.free&&Math.hypot(captive.x-P.x,captive.y-P.y)<36){const sv=captive.s;S.surv[sv.k]=1;save();banner(sv.n.split(',')[0]+' ist frei');toast(`<span style="color:var(--good)">${sv.n}</span> zieht in dein Lager · ${sv.d}`);sfx('win');burst(captive.x,captive.y,'#8fd16a',30,220);
      for(let i=0;i<2;i++)drops.push({x:captive.x,y:captive.y,item:makeItem(ilvl()+1,1),t:0});drops.push({x:captive.x,y:captive.y,mat:pick(Object.keys(MATS)),t:0});prog('rescue');captive=null;}}
  if(trove){trove.t-=dt;if(Math.hypot(trove.x-P.x,trove.y-P.y)<34){burst(trove.x,trove.y,'#f2d14b',30,220);sfx('win');toast('Versteck gefunden');for(let i=0;i<2;i++)drops.push({x:trove.x,y:trove.y,item:lootItem(ilvl()+2,1,.08),t:0});for(let i=0;i<3;i++)drops.push({x:trove.x,y:trove.y,mat:pick(Object.keys(MATS)),t:0});const s=Math.round(25*(1+D.lvl*.08)*DF().sc);S.scrap+=s;run.sg+=s;trove=null;}
    else if(trove.t<=0){toast('Das Versteck ist verloren');trove=null;}}
  if(npc){npc.t-=dt;const nd=Math.hypot(npc.x-P.x,npc.y-P.y);if(nd<34&&!npc.near){npc.near=true;openTrade();return;}if(nd>60)npc.near=false;if(npc.t<=0){npc=null;toast('Der Händler ist weitergezogen');}}
  if(zone){zone.t-=dt;if(Math.hypot(zone.x-P.x,zone.y-P.y)<zone.r){zone.p+=dt;zone.sp-=dt;if(zone.sp<=0){zone.sp=2.2;for(let i=0;i<2;i++){const q=freeSpot(220,320,14);enemies.push(mkEnemy(Math.random()<.75?'ghoul':'spitter',q.x,q.y));}}}
    if(zone.p>=zone.need){for(let i=0;i<2;i++)drops.push({x:zone.x+R(-20,20),y:zone.y+R(-20,20),item:makeItem(ilvl()+1,1),t:0});const sz=Math.round(30*(1+D.lvl*.1)*DF().sc);S.scrap+=sz;run.sg+=sz;toast(`Signal gehalten · +${sz} Schrott`);sfx('win');burst(zone.x,zone.y,'#7dd3ff',30,220);prog('zone');zone=null;}
    else if(zone.t<=0){toast('Das Signal ist verloren');zone=null;}}
  if(crate){crate.t-=dt;if(Math.hypot(crate.x-P.x,crate.y-P.y)<30){const it=makeItem(ilvl()+1,2),s=Math.round(15*(1+D.lvl*.1)*(1+.5*pk('scrap'))*DF().sc);S.scrap+=s;run.sg+=s;burst(crate.x,crate.y,'#f2d14b',30,220);
      toast(`Nachschub geborgen · +${s} Schrott`);addToBag(it);crate=null;}else if(crate.t<=0){crate=null;toast('Der Nachschub ist verloren');}}
  for(const e of enemies){
    e.t+=dt;e.flash-=dt;e.hcd-=dt;const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;let vx=dx/d,vy=dy/d,sp=e.spd;
    if(e.stun>0){e.stun-=dt;sp=0;}if(e.hold>0){e.hold-=dt;sp=0;}
    if(e.burn>0){e.burn-=dt;const bd=e.bdps*dt;e.hp-=bd;e.bacc=(e.bacc||0)+bd;if(Math.random()<dt*14)parts.push({x:e.x+R(-6,6),y:e.y-R(4,24),vx:R(-10,10),vy:R(-60,-30),life:.4,max:.4,col:pick(['#ff6a2a','#FAC775']),size:R(2,3.5)});
      if(e.bacc>=4||(e.burn<=0&&e.bacc>=1)){nums.push({x:e.x+R(-8,8),y:e.y-e.r-18,t:''+Math.round(e.bacc),col:ELC.fire,life:.6});e.bacc=0;}
      if(e.hp<=0&&!e.dead){kill(e);continue;}}
    if(e.elite==='brennend'){e.trail=(e.trail||0)-dt;if(e.trail<=0&&(e.mv||0)>8){e.trail=.45;hazards.push({x:e.x,y:e.y+e.r*.6,r:20,t:3.5,dmg:Math.max(1,Math.round(e.dmg*.45))});}}
    if(e.acid>0){e.acid-=dt;if(pk('corrode'))sp*=.7;if(Math.random()<dt*6)parts.push({x:e.x+R(-6,6),y:e.y-R(2,18),vx:0,vy:R(20,40),life:.5,max:.5,col:'#97C459',size:2});}
    if(e.type==='raser'){e.cc=(e.cc==null?R(1,2):e.cc)-dt;if(e.ch>0){e.ch-=dt;sp=0;if(e.ch<=0)e.ru=.45;}else if(e.ru>0){e.ru-=dt;vx=e.rdx;vy=e.rdy;sp=e.stun>0?0:520;}else if(e.cc<=0&&d<260&&e.stun<=0){e.ch=.6;e.cc=2.4;e.rdx=dx/d;e.rdy=dy/d;}}
    if(e.type==='spitter'){if(d<200){vx=-vx;vy=-vy;}else if(d<290){const tx=-vy*e.side,ty=vx*e.side;vx=tx;vy=ty;sp*=.6;}
      e.fire-=dt;if(e.fire<=0&&d<440&&e.stun<=0){e.fire=R(2.3,3.1);fireGlob(e,Math.atan2(dy,dx),210);sfx('spit');}}
    if(e.buff>0){e.buff-=dt;sp*=1.35;}if(e.slow>0){e.slow-=dt;sp*=.6;}
    if(e.type==='rat'){const a=Math.atan2(vy,vx)+Math.sin(e.t*7+e.side)*.6;vx=Math.cos(a);vy=Math.sin(a);}
    if(e.type==='shield'||(e.type==='boss'&&e.v===6)){if(e.guard>0)e.guard-=dt;let da=Math.atan2(dy,dx)-e.fa;da=Math.atan2(Math.sin(da),Math.cos(da));const tr=(e.type==='boss'?1.1:1.6)*dt;e.fa+=clamp(da,-tr,tr);if(e.guard>0)sp*=.4;}
    if(e.type==='bomb'){if(e.fuse>0){e.fuse-=dt;sp=0;if(e.fuse<=0){e.selfx=1;e.hp=0;kill(e);continue;}}else if(d<58&&e.stun<=0){e.fuse=.85;sfx('zap');}}
    if(e.type==='howl'){if(d<180){vx=-vx;vy=-vy;}else if(d<260){const tx=-vy*e.side,ty=vx*e.side;vx=tx;vy=ty;sp*=.6;}
      e.fire-=dt;if(e.fire<=0&&d<460&&e.stun<=0){e.fire=R(4.5,6);rings.push({x:e.x,y:e.y-14,r:10,max:220,col:'214,90,140'});for(const o of enemies)if(o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<220)o.buff=4;sfx('horn');}}
    if(e.fly){if(e.dive>0){e.dive-=dt;vx=e.rdx;vy=e.rdy;sp=e.stun>0?0:380;if(e.dive<=0)e.rest=1.3;}else if(e.rest>0){e.rest-=dt;sp=e.stun>0?0:40;}else{e.dcd-=dt;e.orb+=dt*1.5*e.side;const tx=P.x+Math.cos(e.orb)*150,ty=P.y+Math.sin(e.orb)*110,ddx=tx-e.x,ddy=ty-e.y,dl=Math.hypot(ddx,ddy)||1;vx=ddx/dl;vy=ddy/dl;sp=e.stun>0?0:e.spd*Math.min(1,dl/40+.3);
      if(e.dcd<=0&&d<280&&e.stun<=0){e.dive=.6;e.dcd=R(2.5,3.8);e.rdx=dx/d;e.rdy=dy/d;sfx('swing');}}}
    if(e.det>0){e.det-=dt;const a=Math.atan2(vy,vx)+e.detA;vx=Math.cos(a);vy=Math.sin(a);}
    const f=Math.pow(.002,dt);const ox=e.x,oy=e.y;e.x+=vx*sp*dt+e.kx*dt;e.y+=vy*sp*dt+e.ky*dt;e.kx*=f;e.ky*=f;if(e.fly){e.x=clamp(e.x,10,WS-10);e.y=clamp(e.y,10,WS-10);}else collide(e);e.mv=Math.hypot(e.x-ox,e.y-oy)/Math.max(dt,.001);
    if(!e.fly&&e.type!=='boss'){e.sto=(e.sto||0)+dt;if(e.sto>6){const pd=Math.hypot(e.x-P.x,e.y-P.y);if(pd>=(e.lpd||1e9)-40&&pd>260){const q=freeSpot(Math.max(300,Math.hypot(VW,VH)/2),Math.max(340,Math.hypot(VW,VH)/2+120),e.r+6);e.x=q.x;e.y=q.y;}e.sto=0;e.lpd=Math.hypot(e.x-P.x,e.y-P.y);}}
    e.chk+=dt;if(e.chk>.5){if(sp>0&&!e.fly&&e.det<=0&&Math.hypot(e.x-e.lx,e.y-e.ly)<sp*.12){e.det=.8;e.detA=pick([-1.4,1.4]);}e.chk=0;e.lx=e.x;e.ly=e.y;}
    if(e.type==='boss'){if(!e.rage&&e.hp<e.max*.5){e.rage=1;e.spd*=1.3;banner(e.name+' tobt');flashT=.35;shake=10;sfx('horn');}const rg=e.rage?1.35:1;e.slam-=dt*rg;e.ring-=dt*rg;
      if(e.slam<=0&&d<320){e.slam=e.big?3.3:4.2;teles.push({x:P.x,y:P.y,r:e.big?96:80,t:.95,max:.95,dmg:Math.round(e.dmg*1.3)});}
      if(e.ring<=0){e.ring=e.big?5:7.5;const n=e.big?16:12;for(let i=0;i<n;i++)fireGlob(e,i/n*6.283+e.t,165);sfx('spit');}
      if(e.big){e.sum-=dt*rg;const v=e.v;
        if(v===0){if(e.sum<=0){e.sum=7;for(let i=0;i<4;i++)enemies.push(mkEnemy('ghoul',e.x+R(-60,60),e.y+R(-60,60)));toast('„Antreten!“');sfx('horn');}}
        else if(v===1){if(e.sum<=0){e.sum=2.2;hazards.push({x:P.x+R(-30,30),y:P.y+9+R(-20,20),r:26,t:5,dmg:Math.max(1,Math.round(e.dmg*.4)),col:'#97C459'});}e.ring-=dt*rg*.6;}
        else if(v===2){if(e.ch>0){e.ch-=dt;if(e.ch<=0)e.ru=.55;}else if(e.ru>0){e.ru-=dt;e.x+=e.rdx*560*dt;e.y+=e.rdy*560*dt;collide(e);if(Math.random()<dt*20)bolts.push({x0:e.x,y0:e.y-40,x1:e.x+R(-30,30),y1:e.y-10,life:.12});}else if(e.sum<=0&&d<400){e.sum=3.8;e.ch=.7;e.hold=1.25;e.rdx=dx/d;e.rdy=dy/d;sfx('zap');}}
        else if(v===3){if(e.sum<=0){e.sum=4.5;teles.push({x:P.x,y:P.y,r:55,t:1.1,max:1.1,dmg:Math.round(e.dmg*.9)});for(let i=0;i<5;i++){const q=1.1+i*.12;teles.push({x:P.x+R(-150,150),y:P.y+R(-130,130),r:55,t:q,max:q,dmg:Math.round(e.dmg*.9)});}sfx('horn');}}
        else if(v===5){if(e.sum<=0){e.sum=e.rage?2.6:3.8;for(let i=0;i<5;i++)enemies.push(mkEnemy('rat',e.x+R(-50,50),e.y+R(-50,50)));sfx('spit');}e.trail=(e.trail||0)-dt;if(e.trail<=0&&(e.mv||0)>8){e.trail=.5;hazards.push({x:e.x,y:e.y+e.r*.6,r:24,t:4,dmg:Math.max(1,Math.round(e.dmg*.3)),col:'#97C459'});}}
        else if(v===6){if(e.ch>0){e.ch-=dt;if(e.ch<=0)e.ru=.6;}else if(e.ru>0){e.ru-=dt;e.x+=e.rdx*600*dt;e.y+=e.rdy*600*dt;collide(e);if(Math.random()<dt*25)parts.push({x:e.x,y:e.y,vx:R(-30,30),vy:R(-30,30),life:.4,max:.4,col:'#d6cfc0',size:4});}
          else if(e.sum<=0&&d<420){e.sum=e.rage?3:4.2;e.ch=.75;e.hold=1.35;e.rdx=dx/d;e.rdy=dy/d;teles.push({x:e.x+e.rdx*160,y:e.y+e.rdy*160,r:70,t:.9,max:.9,dmg:Math.round(e.dmg*1.1)});sfx('horn');}}
        else if(v===7){if(e.sum<=0){e.sum=e.rage?3.4:4.6;e.k7=(e.k7||0)+1;for(let i=0;i<5;i++){const q=1+i*.15,o=i?{x:P.x+R(-170,170),y:P.y+R(-140,140)}:{x:P.x,y:P.y};teles.push({x:o.x,y:o.y,r:52,t:q,max:q,dmg:Math.round(e.dmg*.95),slab:1});}sfx('horn');
          if(e.k7%2===0)for(let i=0;i<2;i++)enemies.push(mkEnemy('bomb',e.x+R(-60,60),e.y+R(-60,60)));}}
        else{if(e.sum<=0){e.sum=9;for(let i=0;i<3;i++)enemies.push(mkEnemy('ghoul',e.x+R(-50,50),e.y+R(-50,50)));}e.trail=(e.trail||0)-dt;if(e.trail<=0&&(e.mv||0)>8){e.trail=.4;hazards.push({x:e.x,y:e.y+e.r*.6,r:26,t:4,dmg:Math.max(1,Math.round(e.dmg*.35))});}}}}
    if(d<e.r+P.r+2&&e.hcd<=0&&e.stun<=0&&e.hp>0&&e.type!=='bomb'&&(!e.fly||e.dive>0)){e.hcd=.9;e.atk=.25;const landed=hurt(e.type==='boss'?e.dmg*.6:e.dmg,e.type==='boss'||e.type==='brute'?9:5);if(state!=='play')return;if(landed&&pk('thorns'))hit(e,ST.dmg*.6*pk('thorns'),false,{knock:300});}
    if(e.atk>0)e.atk-=dt;
  }
  for(let i=0;i<enemies.length;i++)for(let j=i+1;j<enemies.length;j++){const a=enemies[i],b=enemies[j];if(a.fly||b.fly)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;
    if(d<m&&d>0){const p=(m-d)/2,wa=a.type==='boss'?.1:1,wb=b.type==='boss'?.1:1;a.x-=dx/d*p*wa;a.y-=dy/d*p*wa;b.x+=dx/d*p*wb;b.y+=dy/d*p*wb;}}
  for(const s of shocks){s.r+=460*dt;for(const e of enemies)if(e.hp>0&&!s.hit.includes(e)&&Math.abs(Math.hypot(e.x-s.x,e.y-s.y)-s.r)<26+e.r){s.hit.push(e);if(s.acid){const W=ER(e,'acid');hit(e,ST.dmg*1.2,false,{knock:200},true,ELC.acid);if(W>0)e.acid=3;}else if(s.small){hit(e,ST.dmg*.7,false,{knock:260});e.stun=Math.max(e.stun,e.type==='boss'?.1:.5);}else{hit(e,ST.dmg*2.5,false,KIND.hammer);e.stun=Math.max(e.stun,e.type==='boss'?.3:1.3);}}}
  shocks=shocks.filter(s=>s.r<s.max);
  for(const r of rings)r.r+=300*dt;rings=rings.filter(r=>r.r<r.max);
  if(run.blasts.length){const bs=run.blasts;run.blasts=[];for(const b of bs){burst(b.x,b.y-10,'#ff8a3d',26,260);burst(b.x,b.y,'#3d3027',14,160);shake=Math.max(shake,9);sfx('boom');stamp(b.x,b.y,'rgba(8,5,3,.45)',b.r*.5);rings.push({x:b.x,y:b.y,r:10,max:b.r,col:'255,138,61'});
    if(!pk('blast')&&P.inv<=0&&Math.hypot(P.x-b.x,P.y-b.y)<b.r+P.r){hurt(b.dmg,10);if(state!=='play')return;}for(const o of enemies)if(o.hp>0&&Math.hypot(o.x-b.x,o.y-b.y)<b.r+o.r)hit(o,b.dmg*1.5,false,{knock:320},true,'#ff8a3d');}}
  if(run.booms.length){const bs=run.booms;run.booms=[];for(const b of bs){burst(b.x,b.y,'#ff8a3d',12,200);sfx('pop');for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<72+e.r)hit(e,ST.dmg*.35*pk('boom'),false,{knock:220});propsInRadius(b.x,b.y,72,ST.dmg*.35);}}
  for(const p of eproj){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(wallAt(p.x,p.y+12)){p.life=0;burst(p.x,p.y,'#97C459',5,70);}
    else if(Math.hypot(p.x-P.x,p.y-(P.y-14))<p.r+P.r){if(P.inv<=0){p.life=0;burst(p.x,p.y,'#97C459',6,90);hurt(p.dmg,4);if(state!=='play')return;}}}
  eproj=eproj.filter(p=>p.life>0);
  for(const p of pproj){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;const w=wallAt(p.x,p.y);if(w){p.life=0;if(w.brk)hitProp(w,p.dmg);else burst(p.x,p.y,'#a8957d',4,60);continue;}
    for(const e of enemies){if(e.hp<=0||p.hits.includes(e)||Math.hypot(e.x-p.x,e.y-p.y)>=e.r+p.r+4)continue;p.hits.push(e);hit(e,p.dmg,p.crit,KIND.sling);if(hasL('kraehe'))e.slow=2;if(hasL('ring')&&!p.jumped){let nb=null,nd=220;for(const o of enemies){if(o===e||o.hp<=0)continue;const q=Math.hypot(o.x-e.x,o.y-e.y);if(q<nd){nd=q;nb=o;}}if(nb){const a=Math.atan2(nb.y-e.y,nb.x-e.x);pproj.push({x:e.x,y:e.y,vx:Math.cos(a)*ST.pspd,vy:Math.sin(a)*ST.pspd,r:4,dmg:p.dmg*.8,crit:false,life:.6,pierce:0,hits:[e],el:'shock',jumped:1});}}if(p.pierce>0)p.pierce--;else{p.life=0;break;}}}
  pproj=pproj.filter(p=>p.life>0);
  for(const t of teles){t.t-=dt;if(t.t<=0){if(Math.hypot(P.x-t.x,P.y-t.y)<t.r+P.r)hurt(t.dmg,12);shake=Math.max(shake,10);sfx('boom');burst(t.x,t.y,'#d8642e',22,240);stamp(t.x,t.y,'rgba(8,5,3,.4)',t.r*.6);if(state!=='play')return;}}
  teles=teles.filter(t=>t.t>0);
  for(const h of hazards){h.t-=dt;if(Math.random()<dt*4)parts.push({x:h.x+R(-12,12),y:h.y+R(-6,6),vx:0,vy:R(-40,-20),life:.4,max:.4,col:h.col||pick(['#ff6a2a','#FAC775']),size:R(1.5,3)});
    if(P.inv<=0&&Math.hypot(P.x-h.x,(P.y+9-h.y)*1.6)<h.r+6){hurt(h.dmg,2);if(state!=='play')return;}}
  hazards=hazards.filter(h=>h.t>0);if(hazards.length>60)hazards.splice(0,hazards.length-60);
  enemies=enemies.filter(e=>e.hp>0);
  const mr=90*pk('magnet'),pr=26*(1+.5*pk('magnet'));
  for(const d of drops){d.t+=dt;if(d.vh===undefined){d.vh=R(150,210);d.h=0;const a=R(0,6.28),s=R(30,80);d.vx=Math.cos(a)*s;d.vy=Math.sin(a)*s;if(d.item&&d.item.r>=3){goldT=.6;sfx('legend');banner('Legendär!');}}
    if(d.vh!==null){d.h+=d.vh*dt;d.vh-=620*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(inWall(d.x,d.y,4)){d.x-=d.vx*dt;d.y-=d.vy*dt;d.vx=d.vy=0;}if(d.h<=0){d.h=0;d.vh=null;if(d.item&&d.item.r>=1)sfx('coin');}continue;}
    const dx=P.x-d.x,dy=P.y-d.y,dd=Math.hypot(dx,dy);
    if(dd>1&&(run.cleared||dd<mr)){const sp=run.cleared?520:280;d.x+=dx/dd*Math.min(dd,sp*dt);d.y+=dy/dd*Math.min(dd,sp*dt);}
    if(dd<pr){d.taken=true;if(d.mat){S.mat[d.mat]=(S.mat[d.mat]||0)+1;nums.push({x:P.x,y:P.y-46,t:'+1 '+MATS[d.mat][0],col:MATS[d.mat][1],life:.9});sfx('coin');}else if(d.food){P.hp=Math.min(ST.maxHp,P.hp+ST.maxHp*.25);P.fed=30;toast('Döner · <span style="color:var(--good)">satt: +10% Schaden für 30 Sekunden</span>');sfx('heal');}else if(d.heal){const h=Math.round(ST.maxHp*.3);P.hp=Math.min(ST.maxHp,P.hp+h);nums.push({x:P.x,y:P.y-40,t:'+'+h,col:'#8fd16a',life:.9});sfx('heal');}else addToBag(d.item);}}
  drops=drops.filter(d=>!d.taken);
}
