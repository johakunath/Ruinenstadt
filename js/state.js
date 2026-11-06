/* ================= state ================= */
let captive=null,trove=null,MB=null,MB2=null,shrines=[],SHR={as:0,res:0,gold:0,spd:0,zap:0},cam={x:null,y:null},goldT=0,streak={n:0,t:0},beatT=0,stepT=0,rings=[],mols=[],fields=[],npc=null,zone=null,mf=0,state='menu',P=null,ST=null,bolts=[],corpses=[],hazards=[],freeze=0,flashT=0,enemies=[],drops=[],parts=[],nums=[],swings=[],eproj=[],pproj=[],teles=[],shocks=[],crate=null,shake=0;
function newPlayer(){P={x:1200,y:1220,r:12,hp:100,lvl:1,xp:0,face:-Math.PI/2,atkA:0,cd:0,inv:0,walk:0,dashT:0,dashCd:0,ddx:0,ddy:0,mvx:0,mvy:0,swingT:0,swingDur:.2,swingKind:'blade',skCd:0,spin:0,spinTick:0,ramHit:[]};}
function gear(eq){const A={};for(const k in AFX)A[k]=0;
  for(const s of ['w','a','t']){const it=eq[s];if(!it)continue;if(s==='a')A.hp+=it.val;if(s==='t')A[TM[it.kind]]+=it.val;
    (IMP[baseOf(it)]||[]).forEach(q=>A[q[0]]+=q[1]);(it.afx||[]).forEach(f=>A[f.k]+=f.v);
    (it.mods||[]).forEach(k=>{const M=MODS.find(m=>m.k===k);if(!M)return;(M.a||[]).forEach(q=>A[q[0]]+=q[1]);if(M.el&&(it.el||(it.mods.find(x=>MODS.find(m=>m.k===x&&m.el))!==k)))A.el+=20;});}
  const kz=setCount(eq,'kiez'),sp=setCount(eq,'spree');if(S.camp&&S.camp.turm)A.res+=8;if(kz>=2)A.res+=15;if(kz>=3)A.dmg+=30;if(sp>=2)A.as+=15;if(sp>=3)A.el+=40;const zt=setCount(eq,'zit');if(zt>=2)A.hp+=60;if(zt>=3){A.dmg+=25;A.res+=10;}return A;}
function stats(eq){eq=eq||S.eq;const w=eq.w,K=KIND[w.kind],A=gear(eq),lv=P?P.lvl:1,els=[];const wel=w.el||((w.mods||[]).map(k=>MODS.find(m=>m.k===k)).find(m=>m&&m.el)||{}).el;if(wel)els.push(wel);if(setCount(eq,'spree')>=3&&!els.includes('shock'))els.push('shock');['fire','acid','shock'].forEach(e=>{if(pk(e)&&!els.includes(e))els.push(e);});
  const asF=Math.max(.4,1+.12*pk('rate')+A.as/100+(SHR.as>0?.3:0)),cdr=clamp(A.cdr/100,0,.5);
  return{kind:w.kind,K,A,els,elp:Math.max(0,1+A.el/100+.25*pk('elp')),dmg:Math.max(1,(w.val+(lv-1)*2*K.k)*(1+.07*S.upg.dmg+.15*pk('dmg')+A.dmg/100+.04*mLvl(w.kind))),
    maxHp:Math.max(20,Math.round(100+(lv-1)*10+15*S.upg.hp+25*pk('hp')+A.hp)),crit:clamp(.08+.08*pk('crit')+A.crit/100,0,.75),spd:165*clamp(1+.1*pk('spd')+A.spd/100+(SHR.spd>0?.25:0),.5,1.8),
    regen:Math.max(0,A.regen),res:clamp(A.res/100+.06*pk('res')+(SHR.res>0?.25:0),-.5,.75),leech:Math.max(0,A.leech)+2*pk('leech'),luck:A.luck+(hasS('spaeher')?1:0),
    rate:K.rate/asF,reach:(K.reach||0)*(1+.2*pk('reach')),pspd:560*(1+.2*pk('reach')),
    dashCd:Math.max(.4,1.4*(1-.08*S.upg.dash)*(1-.2*pk('dashcd'))*(1-cdr)*(hasS('mechaniker')?.9:1)),skCd:{blade:7,hammer:8,sling:6}[w.kind]*(1-.2*pk('skill'))*(1-cdr)*(mLvl(w.kind)>=5?.85:1)};}
function power(st){const dps=st.dmg*(1+st.crit)/st.rate*(1+(st.els.length?.18*st.elp:0)),ehp=st.maxHp/(1-st.res)*(1+st.regen*.04);return Math.round(Math.sqrt(dps*ehp)*(1+(st.spd/165-1)*.4)*(1+st.luck*.01));}
function refresh(){if(!P){ST=stats();return;}const pct=ST?P.hp/ST.maxHp:1;ST=stats();P.hp=Math.min(ST.maxHp,Math.max(1,Math.round(ST.maxHp*pct)));}
const ilvl=()=>D.lvl+(run?Math.max(1,run.wave)+run.th*3:1);
function startRun(di,endless){
  initAudio();immerse();S.dist=di;save();
  S.rec.runs++;run={d:di,th:S.threat||0,wave:0,toSpawn:0,spawnT:0,cleared:true,perkDone:true,breakT:1.5,kills:0,sg:0,crateIn:-1,boss:null,quitArm:false,perks:{},booms:[],blasts:[],seen:{},second:false,endless:!!endless};
  buildWorld(DIST[di]);newPlayer();ST=stats();P.hp=ST.maxHp;
  enemies=[];rings=[];cam.x=null;for(const k in SHR)SHR[k]=0;streak.n=0;streak.t=0;goldT=0;drops=[];parts=[];nums=[];swings=[];eproj=[];pproj=[];teles=[];shocks=[];bolts=[];corpses=[];hazards=[];freeze=0;flashT=0;crate=null;npc=null;zone=null;captive=null;trove=null;mols=[];fields=[];shake=0;
  const evw=[2,3,4,6,7,8,9].sort(()=>Math.random()-.5).slice(0,S.camp.funk?4:3),evt=['ambush','trader','zone','cache','horde',...(SURV.some(s=>!hasS(s.k))?['rescue','rescue']:[])].sort(()=>Math.random()-.5);run.events={};evw.forEach((w,i)=>run.events[w]=evt[i%evt.length]);if(hasS('doktor'))S.cons.verband=Math.min(3,(S.cons.verband||0)+1);if(S.camp.sani)S.cons.verband=Math.max(S.cons.verband||0,2);
  ['menu','inv','end','perk','trade'].forEach(i=>$(i).hidden=true);state='play';last=performance.now();updateHot();banner(DIST[di].n+(run.endless?' · Endlos':run.th?' · Bedrohung '+run.th:''));tip('move','Links ziehen zum Laufen, Hieb halten zum Kämpfen. Zielen geht automatisch.');tip('dash','Sprint macht dich kurz unverwundbar. Nutze ihn gegen Geschosse.');if(S.camp.garten)P.fed=60;
}
