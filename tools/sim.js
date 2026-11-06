/* Balance simulator: injected into the running game page. A bot plays runs at accelerated time
   (game logic only, no rendering) and manages the camp between runs. Used by tools/balance.mjs. */
(()=>{
const SIM=window.SIM={log:[],stuck:{t:0,x:0,y:0,ax:0,ay:0,at:0}};
SIM.setup=function(){loop=function(){};toast=function(){};banner=function(){};sfx=function(){};S.mute=true;S.music=false;S.tips={};for(const k in S.tips)S.tips[k]=1;tip=function(){};updateHot=function(){};};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const GC=24;let GW=0,GB=null;function gridFree(){GW=Math.ceil(WS/GC);GB=new Uint8Array(GW*GW);for(let y=0;y<GW;y++)for(let x=0;x<GW;x++)GB[y*GW+x]=inWall(x*GC+GC/2,y*GC+GC/2,11)?1:0;}
function pathTo(tx,ty){if(!GB)return null;const W=GW,s=Math.floor(P.y/GC)*W+Math.floor(P.x/GC),g=Math.floor(clamp(ty,0,WS-1)/GC)*W+Math.floor(clamp(tx,0,WS-1)/GC);if(s===g)return null;
  const prev=new Int32Array(W*W).fill(-1),q=[s];prev[s]=s;let h=0,found=false;while(h<q.length){const c=q[h++];if(c===g){found=true;break;}const cx=c%W,cy=(c-cx)/W;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=W)continue;const n=ny*W+nx;if(prev[n]!==-1||(GB[n]&&n!==g))continue;prev[n]=c;q.push(n);}}
  if(!found)return null;let c=g,p=[];while(c!==s){p.push(c);c=prev[c];}p.reverse();const k=p[Math.min(2,p.length-1)];return{x:(k%W)*GC+GC/2,y:Math.floor(k/W)*GC+GC/2};}
SIM.goto=function(tx,ty){const d=Math.hypot(tx-P.x,ty-P.y);if(d<60||!SIM.blocked(tx,ty))return{x:(tx-P.x)/Math.max(1,d),y:(ty-P.y)/Math.max(1,d)};const w=pathTo(tx,ty);if(!w)return{x:(tx-P.x)/d,y:(ty-P.y)/d};const e=Math.max(1,Math.hypot(w.x-P.x,w.y-P.y));return{x:(w.x-P.x)/e,y:(w.y-P.y)/e};};
SIM.blocked=function(tx,ty){const n=Math.ceil(Math.hypot(tx-P.x,ty-P.y)/20);for(let i=1;i<n;i++){const x=P.x+(tx-P.x)*i/n,y=P.y+(ty-P.y)*i/n;if(inWall(x,y,10))return true;}return false;};
SIM.think=function(dt){
  const es=enemies.filter(e=>e.hp>0);let near=null,nd=1e9;for(const e of es){const d=dist(e,P);if(d<nd){nd=d;near=e;}}
  let mx=0,my=0,threat=false;const away=(o,w)=>{const d=Math.max(1,dist(o,P));mx+=(P.x-o.x)/d*w;my+=(P.y-o.y)/d*w;};
  for(const tl of teles)if(dist(tl,P)<tl.r+P.r+14){away(tl,3);threat=true;if(tl.t<.3&&P.dashCd<=0)dashReq=true;}
  for(const h of hazards)if(Math.hypot(P.x-h.x,(P.y+9-h.y)*1.6)<h.r+24){away(h,1.5);threat=true;}
  for(const p of eproj){const d=Math.hypot(p.x-P.x,p.y-(P.y-14));if(d<90){const ap=(P.x-p.x)*p.vx+(P.y-14-p.y)*p.vy>0;if(ap){mx+=-p.vy/200;my+=p.vx/200;threat=true;if(d<45&&P.dashCd<=0)dashReq=true;}}}
  for(const e of es){if(e.type==='bomb'&&e.fuse>0&&dist(e,P)<110){away(e,3);threat=true;}if(e.ch>0&&dist(e,P)<300){const px=-e.rdy,py=e.rdx;mx+=px*2;my+=py*2;}}
  const ranged=ST.kind==='sling';
  if(near&&nd<700){const ux=(near.x-P.x)/nd,uy=(near.y-P.y)/nd,crowd=es.filter(e=>dist(e,P)<150).length;
    if(ranged){if(nd<170){mx-=ux;my-=uy;}else if(nd>300||SIM.blocked(near.x,near.y)){const g=SIM.goto(near.x,near.y);mx+=g.x;my+=g.y;}else{mx+=-uy*.8;my+=ux*.8;}}
    else if(P.hp<ST.maxHp*.3&&crowd>=3){mx-=ux;my-=uy;mx+=-uy;my+=ux;}
    else if(nd>near.r+P.r+8){const g=SIM.goto(near.x,near.y);mx+=g.x;my+=g.y;}
    if((!ranged&&(crowd>=3||(near.type==='boss'&&nd<130)))||(ranged&&nd<330))skillReq=true;
    if(S.cons.molotow>0&&es.filter(e=>dist(e,near)<90).length>=5&&Math.random()<.02)useCons('molotow');}
  else{let tg=null;
    if(captive)tg=captive;else if(trove)tg=trove;else if(crate)tg=crate;else if(zone)tg=zone;
    else{let bd=1e9;for(const d of drops){const q=dist(d,P);if(q<bd&&q<900){bd=q;tg=d;}}for(const h of shrines)if(!h.used){const q=dist(h,P);if(q<500&&q<bd){bd=q;tg={x:h.x,y:h.y+10};}}}
    if(!tg)tg={x:SX,y:SY};const d=Math.max(1,dist(tg,P));if(d>8){const g=SIM.goto(tg.x,tg.y);mx+=g.x;my+=g.y;}}
  if(P.hp<ST.maxHp*.38&&S.cons.verband>0&&!(P.hot>0))useCons('verband');
  // stuck: if we want to move but don't, sidestep for a moment
  const st=SIM.stuck;st.t+=dt;if(st.at>0){st.at-=dt;mx+=st.ax;my+=st.ay;}
  if(st.t>.8){if(Math.hypot(mx,my)>.4&&Math.hypot(P.x-st.x,P.y-st.y)<10){const a=Math.atan2(my,mx)+(Math.random()<.5?1.6:-1.6);st.ax=Math.cos(a)*1.5;st.ay=Math.sin(a)*1.5;st.at=.7;}st.t=0;st.x=P.x;st.y=P.y;}
  const l=Math.hypot(mx,my);joy.x=l>.05?mx/l:0;joy.y=l>.05?my/l:0;atkHeld=true;};
SIM.run=function(di,opt){opt=opt||{};startRun(di,opt.endless);gridFree();const dt=1/30;let t=0,thinkT=0,hp0=0,dmgTaken=0,lastHp=P.hp,wv=0,wt=0,slow=[0,0,''],diag='';const p0=power(ST);
  while(state!=='over'&&t<(opt.maxT||1500)){
    if(state==='perk'){SIM.equip();const cs=[...document.querySelectorAll('#perkbox .pcard')];const c=cs.find(b=>b.classList.contains('ep'))||cs.find(b=>b.classList.contains('ra'))||cs[Math.floor(Math.random()*cs.length)];c.click();continue;}
    if(state==='trade'){if(npc)npc.offers.forEach((o,i)=>{if(o&&S.scrap>=o.price&&better(o.it)&&S.bag.length<BAG){S.scrap-=o.price;S.bag.push(o.it);npc.offers[i]=null;}});$('trade').hidden=true;state='play';continue;}
    if(state==='paused'){resume();continue;}
    if(freeze>0){freeze-=dt;continue;}
    thinkT-=dt;if(thinkT<=0){thinkT=.1;SIM.think(.1);}
    update(dt);t+=dt;if(run.wave!==wv){if(t-wt>slow[1])slow=[wv,Math.round(t-wt),slow[2]];wv=run.wave;wt=t;diag='';}if(t-wt>90&&!diag){diag='w'+run.wave+' stuck with '+enemies.length+': '+[...new Set(enemies.map(e=>e.type+(e.fly?'(f)':'')))].join(',')+' toSpawn '+run.toSpawn;}if(P.hp<lastHp)dmgTaken+=lastHp-P.hp;lastHp=P.hp;}
  const won=run&&S.best[run.d]>=10&&run.wave>=10&&P.hp>0;
  const r={d:di,won:!!(state==='over'&&P.hp>0),wave:run.wave,t:Math.round(t),lvl:P.lvl,pw0:p0,pw:power(ST),kills:run.kills,scrap:run.sg,dmg:Math.round(dmgTaken),boss:run.boss?run.boss.name:'',slow:slow[0]+':'+slow[1]+'s '+diag};
  state='menu';run=null;enemies=[];refresh();return r;};
SIM.equip=function(){let ch=true,n=0;while(ch&&n++<20){ch=false;for(let i=0;i<S.bag.length;i++){const it=S.bag[i];if(better(it)){const old=S.eq[it.slot];S.eq[it.slot]=it;if(old)S.bag[i]=old;else S.bag.splice(i,1);refresh();ch=true;break;}}}};
SIM.camp=function(){SIM.equip();
  for(const it of S.bag.splice(0))S.scrap+=scrapVal(it);
  for(const c of CONS)while((S.cons[c.k]||0)<3&&S.scrap>=c.p*3){S.scrap-=c.p;S.cons[c.k]=(S.cons[c.k]||0)+1;}
  let buy=true;while(buy){buy=false;const u=UPG.filter(u=>S.upg[u.k]<u.max).sort((a,b)=>upCost(a)-upCost(b))[0];if(u&&S.scrap>=upCost(u)){S.scrap-=upCost(u);S.upg[u.k]++;buy=true;}
    else{const c=CAMP.find(c=>!S.camp[c.k]&&S.scrap>=c.p);if(c){S.scrap-=c.p;S.camp[c.k]=1;buy=true;}}}
  const w=S.eq.w;for(const m of MODS){if(modSlots(w)<=(w.mods||[]).length)break;if((w.mods||[]).includes(m.k))continue;if(Object.entries(m.c).every(([k,v])=>(S.mat[k]||0)>=v)&&S.scrap>=m.p){for(const[k,v]of Object.entries(m.c))S.mat[k]-=v;S.scrap-=m.p;w.mods=(w.mods||[]).concat(m.k);}}
  for(const j of S.jobs)if(j.p>=j.t){S.scrap+=j.sc;}S.jobs=S.jobs.filter(j=>j.p<j.t);fillJobs();refresh();};
SIM.campaign=function(n,opt){opt=opt||{};const out=[];let fails=0;for(let i=0;i<n;i++){let di=S.unlocked-1;if(fails>=3){di=Math.max(0,di-1);fails=0;}
    const r=SIM.run(di,opt);out.push(r);if(di===S.unlocked-1)fails=r.won?0:fails+1;SIM.camp();if(S.best[DIST.length-1]>=10&&!opt.all)break;}return out;};
})();
