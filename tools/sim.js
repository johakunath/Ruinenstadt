/* Balance simulator: injected into the running game page. A bot plays runs at accelerated time
   (game logic only, no rendering) and manages the camp between runs. Used by tools/balance.mjs. */
(()=>{
const SIM=window.SIM={miss:.3,log:[],stuck:{t:0,x:0,y:0,ax:0,ay:0,at:0}};
SIM.setup=function(){/* v0.57: the bot plays the U-Bahn tunnels too (SIM.run with opt.tun) */loop=function(){};toast=function(){};banner=function(){};sfx=function(){};S.mute=true;S.music=false;S.tips={};for(const k in S.tips)S.tips[k]=1;tip=function(){};updateHot=function(){};};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const GC=24;let GW=0,GHt=0,GB=null;function gridFree(){GW=Math.ceil(WS/GC);GHt=Math.ceil(WH/GC);GB=new Uint8Array(GW*GHt);for(let y=0;y<GHt;y++)for(let x=0;x<GW;x++)GB[y*GW+x]=inWall(x*GC+GC/2,y*GC+GC/2,11)?1:0;}// GHt: rows (worlds can be rectangular since v0.55)
function pathTo(tx,ty){if(!GB)return null;const W=GW,s=Math.floor(P.y/GC)*W+Math.floor(P.x/GC),g=Math.floor(clamp(ty,0,WH-1)/GC)*W+Math.floor(clamp(tx,0,WS-1)/GC);if(s===g)return null;
  const prev=new Int32Array(W*GHt).fill(-1),q=[s];prev[s]=s;let h=0,found=false;while(h<q.length){const c=q[h++];if(c===g){found=true;break;}const cx=c%W,cy=(c-cx)/W;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=GHt)continue;const n=ny*W+nx;if(prev[n]!==-1||(GB[n]&&n!==g))continue;prev[n]=c;q.push(n);}}
  if(!found)return null;let c=g,p=[];while(c!==s){p.push(c);c=prev[c];}p.reverse();const k=p[Math.min(2,p.length-1)];return{x:(k%W)*GC+GC/2,y:Math.floor(k/W)*GC+GC/2};}
SIM.gridFree=()=>gridFree();
SIM.goto=function(tx,ty){const d=Math.hypot(tx-P.x,ty-P.y);if(d<60||!SIM.blocked(tx,ty))return{x:(tx-P.x)/Math.max(1,d),y:(ty-P.y)/Math.max(1,d)};const w=pathTo(tx,ty);if(!w)return{x:(tx-P.x)/d,y:(ty-P.y)/d};const e=Math.max(1,Math.hypot(w.x-P.x,w.y-P.y));return{x:(w.x-P.x)/e,y:(w.y-P.y)/e};};
SIM.blocked=function(tx,ty){const n=Math.ceil(Math.hypot(tx-P.x,ty-P.y)/20);for(let i=1;i<n;i++){const x=P.x+(tx-P.x)*i/n,y=P.y+(ty-P.y)*i/n;if(inWall(x,y,10))return true;}return false;};
SIM.think=function(dt){
  const es=enemies.filter(e=>e.hp>0);let near=null,nd=1e9;for(const e of es){const d=dist(e,P);if(d<nd){nd=d;near=e;}}
  let mx=0,my=0,threat=false;const away=(o,w)=>{const d=Math.max(1,dist(o,P));mx+=(P.x-o.x)/d*w;my+=(P.y-o.y)/d*w;};
  for(const tl of teles){if(tl.bs==null){tl.bs=Math.random()<SIM.miss?0:1;tl.t0=tl.t;tl.rt=.25+Math.random()*.25;}if(!tl.bs||tl.t0-tl.t<tl.rt)continue;if(dist(tl,P)<tl.r+P.r+14){away(tl,3);threat=true;if(tl.t<.3&&P.dashCd<=0)dashReq=true;}}// v0.79 human-like: reaction time .25-.5 s, misses SIM.miss of telegraphs
  for(const h of hazards)if(Math.hypot(P.x-h.x,(P.y+9-h.y)*1.6)<h.r+24){away(h,1.5);threat=true;}
  for(const p of eproj){if(p.bs==null)p.bs=Math.random()<SIM.miss?0:1;if(!p.bs)continue;const d=Math.hypot(p.x-P.x,p.y-(P.y-14));if(d<90){const ap=(P.x-p.x)*p.vx+(P.y-14-p.y)*p.vy>0;if(ap){mx+=-p.vy/200;my+=p.vx/200;threat=true;if(d<45&&P.dashCd<=0)dashReq=true;}}}
  for(const e of es){if(e.type==='bomb'&&e.fuse>0&&dist(e,P)<110){away(e,3);threat=true;}if(e.ch>0&&dist(e,P)<300){const px=-e.rdy,py=e.rdx;mx+=px*2;my+=py*2;}}
  const ranged=ST.kind==='sling';
  // v0.99: below half life the bot walks to a nearby landed heal orb or Döner when the closest enemy is not on top of it (below 30% always)
  let heal=null;if(P.hp<ST.maxHp*.5){let hd=500;for(const d of drops)if((d.heal||d.food)&&!d.botSkip&&d.vh===null){const q=dist(d,P);if(q<hd){hd=q;heal=d;}}}
  if(heal&&(!near||nd>140||P.hp<ST.maxHp*.3)){const g=SIM.goto(heal.x,heal.y);mx+=g.x*1.5;my+=g.y*1.5;if(near&&nd<200)skillReq=true;}
  else if(near&&nd<700){const ux=(near.x-P.x)/nd,uy=(near.y-P.y)/nd,crowd=es.filter(e=>dist(e,P)<150).length;
    if(ranged){if(nd<170){mx-=ux;my-=uy;}else if(nd>300||SIM.blocked(near.x,near.y)){const g=SIM.goto(near.x,near.y);mx+=g.x;my+=g.y;}else{mx+=-uy*.8;my+=ux*.8;}}
    else if(P.hp<ST.maxHp*.3&&crowd>=3){mx-=ux;my-=uy;mx+=-uy;my+=ux;}
    else if(nd>near.r+P.r+8){const g=SIM.goto(near.x,near.y);mx+=g.x;my+=g.y;}
    if((!ranged&&(crowd>=3||(near.type==='boss'&&nd<130)))||(ranged&&nd<330))skillReq=true;if(crowd>=5||(near.type==='boss'&&nd<200)||(near.elite&&nd<160))ulReq=true;
    if(S.cons.molotow>0&&es.filter(e=>dist(e,near)<90).length>=5&&Math.random()<.02)useCons('molotow');}
  else{let tg=null;
    if(captive)tg=captive;else if(trove)tg=trove;else if(crate)tg=crate;else if(zone)tg=zone;
    else{let bd=1e9;for(const d of drops){if(d.botSkip)continue;const q=dist(d,P);if(q<bd&&q<900){bd=q;tg=d;}}if(tg&&tg===SIM.dropT){SIM.dropS+=dt;if(SIM.dropS>6){tg.botSkip=1;tg=null;}}else{SIM.dropT=tg;SIM.dropS=0;}/* unreachable drop (in a wall): give up after 6 s */for(const h of shrines)if(!h.used){const q=dist(h,P);if(q<500&&q<bd){bd=q;tg={x:h.x,y:h.y+10};}}for(const h of run.hid||[])if(!h.got){const q=dist(h,P);if(q<700&&q<bd){bd=q;tg=h;}}/* v0.79 the bot finds hidden blessings that are close */}
    if(!tg&&run&&run.exit)tg=run.exit;// v0.84: district liberated, walk back to the start station
    if(!tg&&run&&run.tun&&TUN){if(TUN.sec===TSEC.length-1&&!TUN.lit)tg={x:GEN.x,y:GEN.y+30};else{const x=Math.min(TX1-200,P.x+500),q=at(x,0);tg={x:q[0],y:q[1]};}}// tunnel: walk the route east, then hold the generator
    if(!tg)tg={x:SX,y:SY};const d=Math.max(1,dist(tg,P));if(d>8){const g=SIM.goto(tg.x,tg.y);mx+=g.x;my+=g.y;}}
  if(run&&run.tun&&TUN&&TUN.hold&&!TUN.lit){const d=Math.hypot(GEN.x-P.x,GEN.y-P.y);if(d>GEN.r*.55){mx+=(GEN.x-P.x)/d*2;my+=(GEN.y-P.y)/d*2;}}// keep charging
  if(P.hp<ST.maxHp*.38&&S.cons.verband>0&&!(P.hot>0))useCons('verband');
  // stuck: if we want to move but don't, sidestep for a moment
  const st=SIM.stuck;st.t+=dt;if(st.at>0){st.at-=dt;mx+=st.ax;my+=st.ay;}
  if(st.t>.8){if(Math.hypot(mx,my)>.4&&Math.hypot(P.x-st.x,P.y-st.y)<10){const a=Math.atan2(my,mx)+(Math.random()<.5?1.6:-1.6);st.ax=Math.cos(a)*1.5;st.ay=Math.sin(a)*1.5;st.at=.7;}st.t=0;st.x=P.x;st.y=P.y;}
  // joystick is in screen space (iso view): project the world direction
  const sx=(mx-my)*IS,sy=(mx+my)*IS/2,l=Math.hypot(mx,my),sl=Math.hypot(sx,sy);joy.x=l>.05?sx/sl:0;joy.y=l>.05?sy/sl:0;atkHeld=true;};
SIM.run=function(di,opt){opt=opt||{};S.eq.w.kr=opt.kr!=null?opt.kr:Math.floor(Math.random()*2);/* v0.86: random regular power per run unless given, the ultimate is always there */const tl0=(S.tlog||[]).slice(-1)[0];if(opt.tun)startTunnel(di);else startRun(di,opt.endless);gridFree();const dt=1/30;let exT=0,t=0,thinkT=0,hp0=0,dmgTaken=0,lastHp=P.hp,wv=0,wt=0,slow=[0,0,''],diag='';const p0=power(ST);
  while(state!=='over'&&t<(opt.maxT||1500)){
    if(state==='perk'){SIM.equip(true);const cs=[...document.querySelectorAll('#perkbox .pcard')];const c=Math.random()<.1?cs[Math.floor(Math.random()*cs.length)]:cs.map(b=>[b,SIM.perkScore(b.dataset.p,+b.dataset.lv||1)]).sort((a,b)=>b[1]-a[1])[0][0];c.click();SIM.loadout();continue;}// a new blessing can change which attachments and implant mode fit
    if(state==='trade'){if(npc)npc.offers.forEach((o,i)=>{if(o&&S.scrap>=o.price&&better(o.it)&&S.bag.length<BAG){S.scrap-=o.price;S.bag.push(o.it);npc.offers[i]=null;}});$('trade').hidden=true;state='play';continue;}
    if(state==='paused'){resume();continue;}
    if(state==='lootwarn'){finishLootExit(true);continue;}
    if(run.exit&&!run.tun){exT+=dt;if(exT>90){win(true);continue;}}// district liberated: if the bot cannot path back to the station in 90 s, count the liberation (it timed out as a death before)// v0.91 exit warning: the bot leaves remaining loot
    if(freeze>0){freeze-=dt;continue;}
    thinkT-=dt;if(thinkT<=0){thinkT=.1;if(S.bag.length>=BAG-2)SIM.tidy();SIM.think(.1);}
    update(dt);t+=dt;if(run.wave!==wv){if(t-wt>slow[1])slow=[wv,Math.round(t-wt),slow[2]];wv=run.wave;wt=t;diag='';}if(t-wt>90&&!diag){diag='w'+run.wave+' stuck with '+enemies.length+': '+[...new Set(enemies.map(e=>e.type+(e.fly?'(f)':'')))].join(',')+' toSpawn '+run.toSpawn;}if(P.hp<lastHp)dmgTaken+=lastHp-P.hp;lastHp=P.hp;}
  const won=run&&S.best[run.d]>=WAVES&&run.wave>=WAVES&&P.hp>0;
  const r={d:di,tun:!!opt.tun,won:!!(state==='over'&&P.hp>0),wave:run.wave,t:Math.round(t),lvl:P.lvl,pw0:p0,pw:power(ST),kills:run.kills,scrap:run.sg,dmg:Math.round(dmgTaken),boss:run.boss?run.boss.name:'',slow:slow[0]+':'+slow[1]+'s '+diag,tl:(S.tlog||[]).slice(-1)[0]!==tl0?S.tlog[S.tlog.length-1]:null};// tl: the same telemetry entry the game logs for Johannes (v0.54)
  SIM.lastLow=run&&run.tl?run.tl.hm:1;state='menu';run=null;enemies=[];refresh();return r;};
/* v0.99 blessing rules (Johannes): economy early in the campaign and early in a mission, later combat blessings that fit the build.
   Build families come from the weapon class, its element, gear affixes and families already held this run. */
const ECON={scrap:1,mat:1,loot:1,magnet:.5},PV={dmg:5,crit:4,rate:4.5,hp:4,res:4,leech:3,second:6,exec:3,combo:3,pauke:3.5,jagd:3.5,rush:3,boom:3.5,ram:3,husar:3,stun:3,breaker:3.5,thorns:3,stellung:2.5,retour:2.5,spd:2.5,dashcd:2,breath:2.5,reach:3,kimme:3,durch:3,skill:3,fire:3.5,acid:3.5,shock:3.5,elp:3,blast:1.5};
const WFAM={blade:['krit','serie'],hammer:['boll','krit'],spear:['dist','krit'],sling:['dist','serie']};
SIM.econNeed=()=>{const m=UPG.reduce((a,u)=>a+upMax(u),0);return 1-UPG.reduce((a,u)=>a+Math.min(S.upg[u.k],upMax(u)),0)/Math.max(1,m);};
SIM.profile=()=>{const f=new Set(WFAM[ST.kind]||[]),A=ST.A||{};if(ST.els.length)f.add('el');if(ST.els.includes('fire'))f.add('glut');if((A.crit||0)>=8)f.add('krit');if((A.as||0)>=10)f.add('serie');if((A.res||0)>=10||(A.hp||0)>=60)f.add('boll');if((A.spd||0)>=10)f.add('sprint');if((A.el||0)>=20)f.add('el');return f;};
SIM.perkScore=function(k,lv){const p=PERKS.find(x=>x.k===k);if(!p)return 0;const wv=run?run.wave:1,mission=wv<=6?1:wv<=12?.5:.15;
  if(ECON[k])return 1+6*ECON[k]*SIM.econNeed()*mission*lv;
  const prof=SIM.profile(),held=famHeld(),fs=pFam(p);let s=PV[k]||2.5;for(const f of fs){if(prof.has(f))s+=2;if(held.has(f))s+=3;}
  if(p.duo)s+=5;if(p.w)s+=4;return s*(lv>1?1.5:1);};
/* v0.99 gear decisions. Weapons by power: another class needs +15% (camp) or +20% (expedition); on an expedition whose blessings
   are tied to the current class (its weapon mod or 2+ blessings of its families) it needs +40%. Other slots by item level. */
SIM.pwWith=(slot,it)=>power(stats(Object.assign({},S.eq,{[slot]:it})));
SIM.tied=()=>{if(!run)return 0;const k=S.eq.w.kind,fam=WFAM[k]||[];let n=0;for(const x in run.perks)if(run.perks[x]>0){const p=PERKS.find(q=>q.k===x);if(!p)continue;if(p.w===k)n+=2;else if(!p.w&&(p.f||[]).some(f=>fam.includes(f)))n++;}return n;};
SIM.swapW=function(it){const old=S.eq.w;for(const k of old.mods||[])S.mods[k]=(S.mods[k]||0)+1;old.mods=[];S.eq.w=it;return old;};
SIM.equip=function(inRun){let ch=true,n=0;while(ch&&n++<20){ch=false;for(let i=0;i<S.bag.length;i++){const it=S.bag[i],e=S.eq[it.slot];let take=false;
    if(it.slot==='w'&&SIM.lock&&it.kind!==SIM.lock)take=false;else if(it.slot==='w'){const r=SIM.pwWith('w',it)/Math.max(1,SIM.pwWith('w',e)),need=it.kind===e.kind?1.03:inRun?(SIM.tied()>=2?1.4:1.2):1.15;take=r>need;}else take=better(it);
    if(take){let old;if(it.slot==='w')old=SIM.swapW(it);else{old=e;S.eq[it.slot]=it;}if(old)S.bag[i]=old;else S.bag.splice(i,1);refresh();ch=true;break;}}}
  SIM.loadout();};
// Attachments follow the build: element mods when the run holds blessings of that element, Nagelband for damage, Gegengewicht for crit builds, Stacheldraht when life ran low. Install/remove anytime, build only in camp.
const MEL={tank:'fire',phiole:'acid',batt:'shock'},PEL={fire:'fire',schwel:'fire',kachel:'fire',spread:'fire',acid:'acid',corrode:'acid',shock:'shock',chain:'shock'};
SIM.modScore=function(k){const w=S.eq.w,prof=SIM.profile();if(MEL[k]){const e=MEL[k];let s=.5;if(run)for(const x in run.perks)if(run.perks[x]>0&&PEL[x]===e)s+=3;if(w.el===e)s+=3;if(prof.has('el'))s+=1;return s;}
  return {nagel:4,gewicht:3+(prof.has('krit')?2:0),dorn:2+(prof.has('boll')||SIM.lastLow<.3?2:0)}[k]||0;};
SIM.loadout=function(){const w=S.eq.w,n=modSlots(w);if(n){const have=k=>(w.mods||[]).includes(k)||(S.mods[k]||0)>0,want=MODS.map(m=>m.k).filter(have).sort((a,b)=>SIM.modScore(b)-SIM.modScore(a)).slice(0,n);
    for(const k of (w.mods||[]).slice())if(!want.includes(k)){w.mods=w.mods.filter(x=>x!==k);S.mods[k]=(S.mods[k]||0)+1;}for(const k of want)if(!(w.mods||[]).includes(k)&&(w.mods||[]).length<n&&S.mods[k]>0){w.mods=(w.mods||[]).concat(k);S.mods[k]--;}}
  const im=S.eq.i;if(im){const low=run?P.hp<ST.maxHp*.35:SIM.lastLow<.25;if(low)im.im=2;else{let best=0,bp=-1;for(let k=0;k<IMODE.length;k++){im.im=k;const q=power(stats());if(q>bp){bp=q;best=k;}}im.im=best;}}
  refresh();};
SIM.lastLow=1;/* v0.68: since v0.65 a full bag leaves loot on the ground (the guaranteed boss legendary was never picked up, telemetry showed 0 legendaries): equip, then salvage the weakest items like a player would */
SIM.tidy=function(){SIM.equip(true);S.bag.sort((x,y)=>((y.set?3:y.r)-(x.set?3:x.r))||(y.ilvl-x.ilvl));while(S.bag.length>BAG-6){salvage(S.bag.pop(),{sc:0,m:{}});}};
SIM.camp=function(){SIM.equip();
  for(const it of S.bag.splice(0))salvage(it,{sc:0,m:{}});
  if(campOpen()&&!S.meal){const pref=SIM.econNeed()>.4?['gurke','curry','suppe','soljanka','kaffee']:['curry','suppe','soljanka','kaffee','gurke'];for(const k of pref){const m=MEALS.find(x=>x.k===k);if((!m.req||S.camp[m.req])&&Object.entries(m.c).every(([z,v])=>(S.mat[z]||0)>=v)){for(const[z,v]of Object.entries(m.c))S.mat[z]-=v;S.meal=k;break;}}}// v0.99: the bot cooks
  if(campOpen())for(const c of CONS)while((S.cons[c.k]||0)<3&&S.scrap>=c.p*3){S.scrap-=c.p;S.cons[c.k]=(S.cons[c.k]||0)+1;}
  let buy=true;while(buy){buy=false;const u=UPG.filter(u=>campOpen()&&S.upg[u.k]<upMax(u)).sort((a,b)=>upCost(a)-upCost(b))[0];if(u&&S.scrap>=upCost(u)){S.scrap-=upCost(u);S.upg[u.k]++;buy=true;}else if(!u&&campOpen()&&S.scrap>=drillCost()+300){S.scrap-=drillCost();S.drill=(S.drill||0)+1;buy=true;}
    else{const c=CST.find(c=>{const n=cNext(c);return n&&n.ok;});if(c){cBuy(c);buy=true;}}}
  if(modsOpen())for(const m of MODS.slice().sort((a,b)=>SIM.modScore(b.k)-SIM.modScore(a.k)))if(!(S.mods[m.k]||0)&&!(S.eq.w.mods||[]).includes(m.k)&&Object.entries(m.c).every(([k,v])=>(S.mat[k]||0)>=v)&&S.scrap>=mp(m)){for(const[k,v]of Object.entries(m.c))S.mat[k]-=v;S.scrap-=mp(m);S.mods[m.k]=(S.mods[m.k]||0)+1;}// v0.99: build one of each attachment into stock, best fit first
  SIM.loadout();
  for(const j of S.jobs)if(j.p>=j.t){S.scrap+=j.sc;}S.jobs=S.jobs.filter(j=>j.p<j.t);fillJobs();refresh();};
SIM.campaign=function(n,opt){opt=opt||{};const out=[];let fails=0;for(let i=0;i<n;i++){let di=S.unlocked-1;const tun=lineOpen(di)&&!lineFree(di);if(fails>=3&&!tun){di=Math.max(0,di-1);fails=0;}
    const r=SIM.run(di,Object.assign({},opt,{tun}));out.push(r);if(di===S.unlocked-1)fails=r.won?0:fails+1;SIM.camp();if(S.best[DIST.length-1]>=WAVES&&!opt.all)break;}return out;};
})();
