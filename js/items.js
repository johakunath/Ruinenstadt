/* ================= items ================= */
let uid=Date.now();
function newJob(){const ex=S.jobs.map(j=>j.k),J=pick(JOBT.filter(j=>!ex.includes(j.k))),t=J.t();return{id:++uid,k:J.k,t,p:0,sc:Math.round((45+25*S.unlocked)*R(.85,1.2)),item:Math.random()<.6};}
function fillJobs(){while(S.jobs.length<3)S.jobs.push(newJob());}
function jobDone(j){toast(`Auftrag erledigt: <span style="color:var(--ember)">${JOBT.find(x=>x.k===j.k).n(j.t)}</span>`);sfx('bell');updateHot();}
function prog(k,n){for(const j of S.jobs)if(j.k===k&&j.p<j.t){j.p=Math.min(j.t,j.p+(n||1));if(j.p>=j.t)jobDone(j);}}
function progWave(w){for(const j of S.jobs)if(j.k==='wave'&&j.p<j.t&&w>j.p){j.p=Math.min(j.t,w);if(j.p>=j.t)jobDone(j);}}
// rarity weights white, blue, yellow, legendary (v0.41: was 60, 26+w+l*3, 8+w*.7+l*2, 1.2+w*.3+l*.8; bot found only 19% white and 5 to 10 legendaries per Köpenick run)
function rollR(minR){const l=S.upg.luck+DF().luck+(ST?ST.luck:0)+(run?run.th:0)+(dm_('eisen')?3:0),w=run?wE():1;const ws=[60,18+w*.6+l*.8,4+w*.35+l*.4,.1+w*.04+l*.03];for(let i=0;i<(minR||0);i++)ws[i]=0;let t=ws.reduce((a,b)=>a+b),x=Math.random()*t;for(let i=0;i<4;i++){if((x-=ws[i])<0)return i;}return minR||0;}
function makeItem(il,minR,fs){il+=3*D.i;// v0.65: item level +3 per district so the first drops of the next district beat the end of the last one
  // v0.68: legendaries exist for every slot (head, hands, feet and ring one each); sets still only for weapon, body and talisman
  const cy=D.cyber,gd=D.gdr,r=rollR(minR),roll=Math.random(),slot=fs||(cy&&Math.random()<(r===3?.25:.12)?'i':0)||(r===3?(roll<.3?'w':roll<.55?'a':roll<.67?'t':roll<.76?'h':roll<.84?'g':roll<.92?'f':'r'):roll<.3?'w':roll<.46?'a':roll<.56?'h':roll<.66?'g':roll<.76?'f':roll<.88?'t':'r'),m=RAR[r].m*R(.85,1.15)*.9;let kind,name,val;
  if(slot==='w'){kind=pick(['blade','blade','hammer','sling','spear']);name=r===3?pick(LEGW[kind]):pick(cy&&Math.random()<.45?NWM[kind]:gd&&Math.random()<.45?NWG[kind]:NW[kind]);val=Math.round((4+il*1.6)*KIND[kind].k*m);}
  else if(slot==='a'){kind='armor';name=r===3?pick(LEGA):pick(cy&&Math.random()<.4?NAM:gd&&Math.random()<.4?NAG:NA);val=Math.round((12+il*6)*m);}
  else if(slot==='h'){kind='head';name=r===3?pick(LEGH):pick(cy&&Math.random()<.4?NHM:gd&&Math.random()<.4?NHG:NH);val=Math.round((2+il*.12)*m);}
  else if(slot==='g'||slot==='f'){kind=slot==='g'?'hand':'feet';name=r===3?pick(slot==='g'?LEGG:LEGF):pick(slot==='g'?(gd&&Math.random()<.4?NGG:NG):NF);val=Math.round((3+il*.12)*m);}
  else if(slot==='i'){kind=r===3?'tempo':pick(['krit','tempo','heil']);name=r===3?pick(LEGI):pick(NI[kind]);val=+({krit:2.5+il*.3,tempo:3+il*.25,heil:.4+il*.1}[kind]*m).toFixed(kind==='heil'?1:0);}
  else{kind=pick(['krit','tempo','heil']);name=r===3?pick(slot==='r'?LEGR:LEGT):pick((slot==='r'?NR:NT)[kind]);const b={krit:3+il*.35,tempo:4+il*.3,heil:.5+il*.12}[kind]*m;val=kind==='heil'?+b.toFixed(1):Math.round(b);}
  const base=BASES[name];if(r===1||r===2)name+=' '+pick(SUF[r]);
  const it={id:++uid,slot,kind,base,name,r,val,ilvl:il,afx:[]};rollAfx(it);return it;
}
function makeSetItem(il){const k=pick(['kiez','spree','zit']),slot=pick(Object.keys(SETS[k].p)),[name,kind,base]=SETS[k].p[slot];let val;
  if(slot==='w')val=Math.round((4+il*1.6)*KIND[kind].k*1.8);else if(slot==='a')val=Math.round((12+il*6)*1.8);else if(slot==='h')val=Math.round((2+il*.12)*1.8);else if(slot==='g'||slot==='f')val=Math.round((3+il*.12)*1.8);else val=Math.round({krit:3+il*.35,tempo:4+il*.3}[kind]*1.8);
  const it={id:++uid,slot,kind,base,name,r:2,val,ilvl:il,afx:[],set:k};rollAfx(it);delete it.el;return it;}
function lootItem(il,minR,p){return Math.random()<(p||.05)?makeSetItem(il):makeItem(il,minR);}
function rollAfx(it){const r=it.r,il=it.ilvl,m=Math.sqrt(RAR[r].m);
  const add=(k,v)=>{if(k==='hp')v*=1+il*.15;if(v>0)v*=m;v=AFX[k].d?+v.toFixed(1):Math.round(v);if(!v)return;const f=it.afx.find(a=>a.k===k);if(f)f.v=AFX[k].d?+(f.v+v).toFixed(1):f.v+v;else it.afx.push({k,v});};
  let n=[0,1,2,3][r];
  if(r===3||(r===2&&Math.random()<.45)){pick(PACTS).forEach(q=>add(q[0],R(q[1],q[2])));n--;}
  const keys=Object.keys(AFX).filter(k=>!it.afx.some(a=>a.k===k));
  for(let i=0;i<n&&keys.length;i++){const k=keys.splice(Math.floor(Math.random()*keys.length),1)[0];add(k,R(AFX[k].a,AFX[k].b));}
  if(it.slot==='w'){if(r===3)it.el=LEGEL[it.base];else if(r>=1&&Math.random()<(r===1?.3:.5))it.el=pick(['fire','acid','shock']);if(r>=1&&r<3&&(it.base==='leucht'||it.base==='neonfl'||it.base==='zeiger')&&Math.random()<.6)it.el='shock';if(r>=1&&r<3&&it.base==='sichel'&&Math.random()<.6)it.el='acid';}
  it.afx=it.afx.filter(a=>a.v!==0);}
const dps=it=>it.val/KIND[it.kind].rate;
function withItem(it){const e=Object.assign({},S.eq);e[it.slot]=it;return e;}
// v0.87 item level is the basic comparison (Diablo style): higher ilvl than the equipped piece = better, empty slot = better
// rarity lifts the shown item level like WoW (a higher quality item counts as a few levels higher): +0 white, +3 magic, +6 rare and set, +10 legendary. Tunable.
const RIL=[0,3,6,10],ilv=it=>(it.ilvl||0)+RIL[it.r||0];
function better(it){const e=S.eq[it.slot];return!e||ilv(it)>ilv(e);}
const avgIl=()=>{const a=Object.values(S.eq).filter(Boolean);return a.length?Math.round(a.reduce((s,x)=>s+ilv(x),0)/a.length):0;};
function fmtA(f){const A=AFX[f.k];let v=A.neg?-f.v:f.v;return(v>0?'+':'−')+(A.d?Math.abs(v).toFixed(1):Math.abs(v))+A.u+' '+A.n;}
function extraLines(it){let h='';if(it.set){const Q=SETS[it.set],n=setCount(S.eq,it.set);h+=`<div class="af" style="color:${SETC}">Set ${Q.n} · ${n}/${Object.keys(Q.p).length} angelegt</div><div class="af" style="color:${n>=2?SETC:'var(--dim)'}">(2) ${Q.b2}</div><div class="af" style="color:${n>=3?SETC:'var(--dim)'}">(3) ${Q.b3}</div><div class="af" style="color:${n>=5?SETC:'var(--dim)'}">(5) ${Q.b5}</div>`;}if(LEGP[baseOf(it)])h+=`<div class="af" style="color:${RAR[3].c};font-style:italic">${LEGP[baseOf(it)]}</div>`;if(it.el)h+=`<div class="st" style="color:${ELC[it.el]}">Element: ${ELN[it.el]}</div>`;if(modSlots(it)){const ms=it.mods||[];h+=`<div class="af" style="color:#f2a04b">Aufsätze ${ms.length}/${modSlots(it)}${ms.length?': '+ms.map(k=>(MODS.find(m=>m.k===k)||{}).n).join(', '):''}</div>`;}return h;}
const afxAll=it=>[...(IMP[baseOf(it)]||[]).map(q=>({k:q[0],v:q[1]})),...(it.afx||[])];
function afxLines(it){let h=extraLines(it);afxAll(it).forEach(f=>{h+=`<div class="af" style="color:${f.v>0?'var(--bone)':'var(--bad)'}">${fmtA(f)}</div>`;});return h;}
// item comparison (v0.53): aligned rows, same affix on the same row in both cards. diff: show the change against o (the equipped item) next to each row
const afxMap=it=>{const m={};afxAll(it).forEach(f=>m[f.k]=(m[f.k]||0)+f.v);return m;},nfD=(v,d)=>(v>0?'+':'−')+(d?Math.abs(v).toFixed(1):Math.round(Math.abs(v)));
function cmpRows(it,other,diff){const A=it?afxMap(it):{},B=other?afxMap(other):{},bv=x=>x.slot==='w'?dps(x):x.val,dc=(d,t)=>Math.abs(d)<1e-9?'':`<b style="color:${d>0?'var(--good)':'var(--bad)'}">${t}</b>`;
  const base=it?statLine(it):'Nichts angelegt',bd=diff&&it&&other?dc(bv(it)-bv(other),nfD(bv(it)-bv(other),bv(it)%1||bv(other)%1)+(it.slot==='w'?' DPS':'')):'';let h=`<div class="crow cbase"><span>${base}</span>${bd}</div>`;
  for(const k of Object.keys(AFX)){if(!(k in A)&&!(k in B))continue;const a=A[k],X=AFX[k],d=(a||0)-(B[k]||0);
    h+=`<div class="crow">${a!=null?`<span style="color:${a>0?'var(--bone)':'var(--bad)'}">${fmtA({k,v:a})}</span>`:'<span class="cnone">–</span>'}${diff?dc(d,nfD(X.neg?-d:d,X.d)+X.u+(B[k]==null?' neu':'')):''}</div>`;}
  return h;}
const SROWS=[['Schaden pro Treffer',s=>s.dmg,0],['Angriffe pro Sekunde',s=>1/s.rate,1],['Krit-Chance',s=>s.crit*100,0,'%'],['Leben',s=>s.maxHp,0],['Widerstand',s=>s.res*100,0,'%'],
  ['Lauftempo',s=>s.spd/1.82,0,'%'],['Leben pro Sekunde',s=>s.regen,1],['Elementarschaden',s=>s.els.length?s.elp*100:0,0,'%'],['Leben pro Kill',s=>s.leech,0],['Beuteglück',s=>s.luck,0],['Sprint-Abklingzeit',s=>s.dashCd,1,' s',1]];
function cmpBlock(it){const a=stats(),b=stats(withItem(it));let h='';
  for(const[n,f,d,u,inv]of SROWS){const fx=v=>v.toFixed(d)+(u||''),x=fx(f(a)),y=fx(f(b));if(x===y)continue;const good=inv?f(b)<f(a):f(b)>f(a);
    h+=`<div class="cmp"><span>${n}</span><span>${x} → <b style="color:${good?'var(--good)':'var(--bad)'}">${y}</b></span></div>`;}
  if(a.els.join()!==b.els.join())h+=`<div class="cmp"><span>Element</span><span>${a.els.map(e=>ELN[e]).join(', ')||'keins'} → <b>${b.els.map(e=>ELN[e]).join(', ')||'keins'}</b></span></div>`;
  return h||'<div class="sub">Keine Veränderung</div>';}
const itemPrice=it=>Math.round((it.r+1)*3*(1+it.ilvl*.08));// trader price base (the old scrap value)
// v0.87 salvage: rarer pieces give far more scrap and may also drop materials (slot decides which)
const scrapVal=it=>Math.round([3,8,20,50][it.r||0]*(1+it.ilvl*.08)),SALVM={w:['metall','metall','kabel'],a:['stoff','stoff','metall'],h:['stoff','metall'],g:['stoff','chemie'],f:['stoff','metall'],t:['kabel','chemie'],r:['kabel','chemie'],i:['kabel','kabel','chemie']},SALVN=[.3,.7,1.5,3];
function salvage(it,tot){const sc=scrapVal(it),n=SALVN[it.r||0],c=Math.floor(n)+(Math.random()<n%1?1:0);S.scrap+=sc;tot.sc+=sc;for(let i=0;i<c;i++){const k=pick(SALVM[it.slot]||['metall']);S.mat[k]=(S.mat[k]||0)+1;tot.m[k]=(tot.m[k]||0)+1;}retMods(it);}
const salvMsg=t=>`+${t.sc} Schrott`+Object.entries(t.m).map(([k,v])=>` · <span style="color:${MATS[k][1]}">+${v} ${MATS[k][0]}</span>`).join('');
function statLine(it){if(it.slot==='w')return`${it.val} Schaden · ${KIND[it.kind].n} · ${Math.round(dps(it))} DPS`;if(it.slot==='a')return`+${it.val} Leben`;if(SSTAT[it.slot])return`+${it.val}% ${AFX[SSTAT[it.slot]].n}`;return{krit:`+${it.val}% Krit-Chance`,tempo:`+${it.val}% Tempo`,heil:`+${it.val} Leben pro Sekunde`}[it.kind];}

const Y='<path d="M12 21v-8M12 13L7 4M12 13l5-9"/><path d="M7 4q5 5 10 0" stroke-width="1.2"/>';
const ICO={
 rspeer:c=>`<path d="M4 20L18 6" stroke-width="2.4"/><path d="M18 6l3-3-1 5z" fill="${c}"/>`,
 fahne:c=>`<path d="M5 21V3" stroke-width="2.2"/><path d="M5 4h12l-3 3 3 3H5" fill="${c}" fill-opacity=".45"/>`,
 harpune:c=>`<path d="M4 20L18 6" stroke-width="2.2"/><path d="M18 6l3-3-1 5zM15 6l2 3M12 9l2 3" fill="${c}"/>`,
 siegsp:c=>`<path d="M4 20L18 6" stroke-width="2.6"/><path d="M18 6l3-3-1 5z" fill="${c}"/><circle cx="9" cy="15" r="2.5" fill="${c}" fill-opacity=".5"/>`,
 zitklinge:c=>`<path d="M5 19L18 6" stroke-width="2.6"/><path d="M7 12l5 5" stroke-width="2"/><path d="M18 6l2-3-3 1z" fill="${c}"/>`,
 pbrecher:c=>`<path d="M5 21L13 13" stroke-width="2.6"/><rect x="11" y="3" width="10" height="9" fill="${c}" fill-opacity=".4"/><path d="M11 7.5h10"/>`,
 kraehe:c=>Y+`<path d="M16 3q5 2 3 8q-4-2-3-8z" fill="${c}" fill-opacity=".45"/>`,
 rattenmantel:c=>`<path d="M8 3L4 6l2 3 1-1v14h10V8l1 1 2-3-4-3-4 4z" fill="${c}" fill-opacity=".25"/><path d="M17 20q5 1 4-5" />`,
 ritter:c=>`<path d="M6 5h12l2 5-2 11H6L4 10z" fill="${c}" fill-opacity=".25"/><path d="M12 7v11M8 11h8"/>`,
 auge:c=>`<path d="M3 12q9-9 18 0q-9 9-18 0z" fill="${c}" fill-opacity=".2"/><circle cx="12" cy="12" r="3" fill="${c}"/>`,
 morgen:c=>`<path d="M5 21L12 14" stroke-width="2.4"/><circle cx="15.5" cy="9" r="5" fill="${c}" fill-opacity=".35"/><path d="M15.5 2v2.5M15.5 13.5V16M8.5 9H11M20 9h2.5"/>`,
 kette:c=>`<path d="M8 3v4l-3 2v12h14V9l-3-2V3" fill="${c}" fill-opacity=".2"/><path d="M8 11h8M8 14h8M8 17h8" stroke-dasharray="1.5 1.5"/>`,
 wappen:c=>`<path d="M5 4h14v7c0 5-4 8-7 10-3-2-7-5-7-10z" fill="${c}" fill-opacity=".25"/><path d="M12 7v9M8 11h8"/>`,
 pickel:c=>`<path d="M4 16a8 8 0 0 1 16 0z" fill="${c}" fill-opacity=".3"/><path d="M2 16h20M12 8V2" stroke-width="2"/>`,
 kiezbox:c=>`<path d="M7 21v-8L5 9l2-1 2 3V4h2v6V3h2v7V4h2v7l1-3 2 1-2 6v6z" fill="${c}" fill-opacity=".4"/><circle cx="12" cy="12" r="2" fill="${c}"/>`,
 schaffner:c=>`<path d="M7 3h6v11l7 2v4H5v-6z" fill="${c}" fill-opacity=".3"/><path d="M5 18h15M9 8h4" stroke-width="1.4"/>`,
 weltuhr:c=>`<circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="2" fill="${c}" fill-opacity=".5"/><path d="M12 13V9M12 13l3 2M10 4l2-2 2 2" stroke-width="1.4"/>`,
 latte:c=>`<path d="M4 20L20 4" stroke-width="4.5"/><circle cx="14" cy="10" r="1" fill="${c}"/>`,
 rohr:c=>`<path d="M5 19L19 5" stroke-width="3.6"/><path d="M7 14l3 3M14 7l3 3" stroke-width="2"/>`,
 stahl:c=>`<path d="M4 20L20 4" stroke-width="2"/><path d="M6.5 15.5l2 2M10 12l2 2M13.5 8.5l2 2M17 5l2 2" stroke-width="1.3"/>`,
 machete:c=>`<path d="M4 20l4-4" stroke-width="3.2"/><path d="M8 16L19 4q3 3 0 7l-7 8z" fill="${c}" fill-opacity=".3"/>`,
 brech:c=>`<path d="M5 21L17 6" stroke-width="2.8"/><path d="M17 6q2-3 4-1" stroke-width="2.4"/><path d="M5 21l-1.5-2.5" stroke-width="2.4"/>`,
 vorschlag:c=>`<path d="M4 21L13 12" stroke-width="2.8"/><path d="M11 8l5-5 6 6-5 5z" fill="${c}" fill-opacity=".3"/>`,
 pflaster:c=>`<path d="M5 20L14 11" stroke-width="2.6"/><path d="M12 9l4-4 4 4-4 4z" fill="${c}" fill-opacity=".3"/>`,
 zange:c=>`<path d="M5 20L14 11" stroke-width="3"/><path d="M14 11l2-7 4 1-2 4 3 1-3 3z" fill="${c}" fill-opacity=".3"/>`,
 zwille:c=>Y, nagel:c=>Y+'<path d="M12 2v5" stroke-width="1.6"/>', stein:c=>Y+`<circle cx="12" cy="6" r="2" fill="${c}" fill-opacity=".4"/>`,
 turm:c=>`<path d="M6 20L17 7" stroke-width="2.4"/><circle cx="15.5" cy="8.5" r="3.6" fill="${c}" fill-opacity=".3"/><path d="M18 6l3-3" stroke-width="1.6"/>`,
 mauer:c=>`<path d="M4 21L12 13" stroke-width="3"/><rect x="11" y="3" width="10" height="11" fill="${c}" fill-opacity=".3"/><path d="M11 8.5h10M16 3v5.5M13.5 8.5V14M18.5 8.5V14" stroke-width="1"/>`,
 ring:c=>'<path d="M12 21v-8M12 13L7 4M12 13l5-9"/>'+`<circle cx="12" cy="7" r="3.2" fill="${c}" fill-opacity=".35"/>`,
 leder:c=>`<path d="M8 4L3 7l2.5 4L7 10v10h10V10l1.5 1L21 7l-5-3-4 4z" fill="${c}" fill-opacity=".25"/><path d="M12 8v12"/>`,
 helm:c=>`<path d="M4 16a8 8 0 0 1 16 0z" fill="${c}" fill-opacity=".3"/><path d="M2 16h20M12 8v8"/>`,
 mantel:c=>`<path d="M8 3L4 6l2 3 1-1v14h10V8l1 1 2-3-4-3-4 4z" fill="${c}" fill-opacity=".25"/><path d="M12 7v15"/>`,
 weste:c=>`<path d="M8 3v4l-3 2v12h14V9l-3-2V3l-4 4z" fill="${c}" fill-opacity=".25"/><path d="M7 13h10M7 17h10" stroke-width="1.4"/>`,
 feuer:c=>`<path d="M8 4L3 7l2.5 4L7 10v10h10V10l1.5 1L21 7l-5-3-4 4z" fill="${c}" fill-opacity=".25"/><path d="M7 14h10M7 17h10" stroke-width="1.6"/>`,
 bvg:c=>`<path d="M5 13a7 6 0 0 1 14 0z" fill="${c}" fill-opacity=".3"/><path d="M3 13h18l-2 3H5z"/><circle cx="12" cy="10" r="1.2" fill="${c}"/>`,
 spaeti:c=>`<path d="M8 3L4 6l2 3 1-1v14h10V8l1 1 2-3-4-3-4 4z" fill="${c}" fill-opacity=".25"/><path d="M12 12l1 2h2l-1.6 1.3.6 2.2L12 16l-2 1.5.6-2.2L9 14h2z" fill="${c}"/>`,
 panzer:c=>`<path d="M6 5h12l2 5-2 11H6L4 10z" fill="${c}" fill-opacity=".25"/><path d="M6 10h12M12 5v16"/><circle cx="8.5" cy="7.5" r=".8" fill="${c}"/><circle cx="15.5" cy="7.5" r=".8" fill="${c}"/>`,
 kiesel:c=>`<ellipse cx="12" cy="13" rx="8" ry="6" fill="${c}" fill-opacity=".3"/><path d="M8 11q3-2 6 0" stroke-width="1.2"/>`,
 stueck:c=>`<rect x="4" y="7" width="16" height="10" fill="${c}" fill-opacity=".3"/><path d="M4 12h16M10 7v5M15 12v5" stroke-width="1.2"/>`,
 feder:c=>`<path d="M5 20C8 10 13 5 20 4c-1 7-6 12-15 16z" fill="${c}" fill-opacity=".3"/><path d="M5 20L15 9" stroke-width="1.2"/>`,
 kette:c=>`<rect x="2" y="9" width="8" height="6" rx="3"/><rect x="8" y="9" width="8" height="6" rx="3"/><rect x="14" y="9" width="8" height="6" rx="3"/>`,
 beutel:c=>`<path d="M8 8h8l3 10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="${c}" fill-opacity=".3"/><path d="M9 8l-1-4h8l-1 4"/><path d="M10 14h4M12 12v4" stroke-width="1.4"/>`,
 abzeichen:c=>`<circle cx="12" cy="12" r="8" fill="${c}" fill-opacity=".3"/><path d="M7 13q5-4 10 0" stroke-width="2.4"/>`,
 schieber:c=>`<path d="M4 15q0-8 8-8t8 6z" fill="${c}" fill-opacity=".3"/><path d="M3 15h18"/>`,
 muetze:c=>`<path d="M5 17V12a7 7 0 0 1 14 0v5z" fill="${c}" fill-opacity=".3"/><path d="M5 15h14"/><circle cx="12" cy="4" r="1.8" fill="${c}"/>`,
 maske:c=>`<path d="M6 6h12v7a6 6 0 0 1-12 0z" fill="${c}" fill-opacity=".25"/><circle cx="9.5" cy="10" r="2"/><circle cx="14.5" cy="10" r="2"/><rect x="10" y="16" width="4" height="5" fill="${c}" fill-opacity=".4"/>`,
 handsch:c=>`<path d="M7 21v-8L5 9l2-1 2 3V4h2v6V3h2v7V4h2v7l1-3 2 1-2 6v6z" fill="${c}" fill-opacity=".3"/>`,
 bandage:c=>`<path d="M7 21v-8L5 9l2-1 2 3V4h2v6V3h2v7V4h2v7l1-3 2 1-2 6v6z" fill="${c}" fill-opacity=".15"/><path d="M7 14h10M7 17h10" stroke-width="1.4"/>`,
 schweiss:c=>`<path d="M6 21v-9L4 8l3-1 2 3V4h8v7l2-3 2 1-3 6v6z" fill="${c}" fill-opacity=".35"/><path d="M6 17h12"/>`,
 turnsch:c=>`<path d="M3 17l2-6 5 1 3 2 7 1 1 3H3z" fill="${c}" fill-opacity=".3"/><path d="M8 13l1 2M11 13.5l1 2" stroke-width="1.2"/>`,
 stiefel:c=>`<path d="M7 3h6v11l7 2v4H5v-6z" fill="${c}" fill-opacity=".3"/><path d="M5 18h15"/>`,
 gummi:c=>`<path d="M7 2h6v12l7 2v5H6V12z" fill="${c}" fill-opacity=".3"/><path d="M7 6h6"/>`,
 siegel:c=>`<circle cx="12" cy="14" r="6"/><rect x="9" y="3" width="6" height="5" rx="1" fill="${c}" fill-opacity=".5"/>`,
 totenk:c=>`<circle cx="12" cy="15" r="5.5"/><path d="M8.5 5a3.5 3.5 0 0 1 7 0v2h-7z" fill="${c}" fill-opacity=".5"/>`,
 mutter:c=>`<path d="M12 4l7 4v8l-7 4-7-4V8z" fill="${c}" fill-opacity=".25"/><circle cx="12" cy="12" r="3.5"/>`,
 draht:c=>`<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="4.5" stroke-dasharray="2 2"/>`,
 ehe:c=>`<circle cx="12" cy="13" r="7"/><path d="M10 4l2-2 2 2-2 2z" fill="${c}"/>`,
 kupfer:c=>`<circle cx="12" cy="12" r="7" stroke-width="3"/>`,
 sichel:c=>`<path d="M4 21l5-5" stroke-width="2.6"/><path d="M9 16C7 8 13 3 19 4c2 1 2 4 0 6-1-3-4-4-7-2s-3 5-3 8z" fill="${c}" fill-opacity=".3"/>`,
 werkh:c=>`<path d="M4 21l9-9" stroke-width="2.4"/><circle cx="16" cy="8" r="5" fill="${c}" fill-opacity=".3"/><circle cx="16" cy="8" r="1.8"/><path d="M16 1v2M16 13v2M9 8h2M21 8h2M11 3l1.5 1.5M19.5 11.5L21 13M21 3l-1.5 1.5M12.5 11.5L11 13" stroke-width="1.3"/>`,
 aufzieh:c=>`<path d="M8 21v-8L4 5M8 13l4-8" stroke-width="2.2"/><path d="M4 5q4 6 8 0"/><path d="M14 15c1-2 3-2 3 0s2 2 3 0" stroke-width="1.4"/><circle cx="20" cy="18" r="1.6"/><circle cx="20" cy="21" r="1.6"/>`,
 zeiger:c=>`<path d="M3 21L15 9" stroke-width="2"/><path d="M15 9l2-6 4 4-6 2z" fill="${c}" fill-opacity=".45"/><circle cx="14" cy="10" r="2.2"/>`,
 blaumann:c=>`<path d="M8 3h8v5l3 2v11H5V10l3-2z" fill="${c}" fill-opacity=".25"/><path d="M9 3v6h6V3M8 13h3" stroke-width="1.4"/>`,
 stroh:c=>`<ellipse cx="12" cy="15" rx="10" ry="3" fill="${c}" fill-opacity=".25"/><path d="M7 15c0-5 2-8 5-8s5 3 5 8"/><path d="M7 13h10" stroke-width="1.6"/>`,
 gartenh:c=>`<path d="M7 21v-8L5 9l2-1 2 3V4h2v6V3h2v7V4h2v7l1-3 2 1-2 6v6z" fill="${c}" fill-opacity=".3"/><path d="M7 16h10" stroke-width="1.6"/>`,
 leucht:c=>`<path d="M5 19L19 5" stroke-width="4.2" stroke-opacity=".45"/><path d="M5 19L19 5" stroke-width="1.6"/><path d="M3.5 20.5l2-2M18.5 5.5l2-2" stroke-width="2.4"/>`,
 boxh:c=>`<path d="M4 21L12 13" stroke-width="2.6"/><rect x="10" y="3" width="11" height="10" fill="${c}" fill-opacity=".25"/><circle cx="15.5" cy="8" r="2.6"/>`,
 neonfl:c=>`<path d="M2 14h14l3-3h3v4h-3l-2 2H9l-2 4H4l1-4H2z" fill="${c}" fill-opacity=".25"/><path d="M8 12h6" stroke-width="2.6"/>`,
 mikro:c=>`<path d="M5 21L16 8" stroke-width="2.2"/><ellipse cx="18" cy="5.5" rx="3" ry="2.4" transform="rotate(-48 18 5.5)" fill="${c}" fill-opacity=".45"/><path d="M3 21h5"/>`,
 poncho:c=>`<path d="M12 3l-4 3-6 13h20L16 6z" fill="${c}" fill-opacity=".25"/><path d="M5 15h14" stroke-width="1.6"/>`,
 kmantel:c=>`<path d="M8 3L4 6l2 3 1-1v14h10V8l1 1 2-3-4-3-4 4z" fill="${c}" fill-opacity=".25"/><path d="M9 10q3 4 0 8M15 10q-3 4 0 8" stroke-width="1.3"/>`,
 nbrille:c=>`<path d="M2 11h20" stroke-width="1.6"/><rect x="4" y="8" width="7" height="6" rx="2" fill="${c}" fill-opacity=".45"/><rect x="13" y="8" width="7" height="6" rx="2" fill="${c}" fill-opacity=".45"/>`,
 nauge:c=>`<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5" fill="${c}"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke-width="1.4"/>`,
 zchip:c=>`<rect x="6" y="6" width="12" height="12" rx="1.5" fill="${c}" fill-opacity=".25"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke-width="1.4"/><circle cx="12" cy="12" r="2"/>`,
 karm:c=>`<path d="M3 16l7-7 4 1 5-5 2 2-5 5 1 4-7 7z" fill="${c}" fill-opacity=".25"/><path d="M8 13l3 3M11 10l3 3" stroke-width="1.3"/>`,
 reflex:c=>`<path d="M13 2L5 13h6l-1 9 8-12h-6z" fill="${c}" fill-opacity=".3"/><circle cx="19" cy="5" r="2"/>`,
 bherz:c=>`<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="${c}" fill-opacity=".25"/><path d="M6 12h3l1.5-3 2 6 1.5-3h4" stroke-width="1.4"/>`,
 npumpe:c=>`<rect x="8" y="3" width="8" height="18" rx="3" fill="${c}" fill-opacity=".25"/><path d="M8 9h8M8 15h8M12 1v2M12 21v2" stroke-width="1.4"/>`,
 bassarm:c=>`<path d="M3 16l7-7 4 1 5-5 2 2-5 5 1 4-7 7z" fill="${c}" fill-opacity=".35"/><circle cx="10" cy="14" r="2.5"/><path d="M17 15l2 2 3-1" stroke-width="1.4"/>`,
 herz:c=>`<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="${c}" fill-opacity=".3"/><path d="M8 12q2 2 4 0t4 0" stroke-width="1.2"/>`};
// v0.68 set pieces for head, hands, feet, ring: SVG fallback = existing shapes until painted icons exist (pipeline/tasks/12-set-pieces.md)
Object.assign(ICO,{kiezhelm:ICO.helm,kiezhand:ICO.handsch,spreestief:ICO.stiefel,spreering:ICO.siegel,topfhelm:ICO.maske,eisenstief:ICO.gummi});
// painted icons and portraits (ChatGPT sheets, cut by tools/cut_sheets.py); ids from docs/chatgpt-assets.md, SVG stays as fallback
const ICOI={latte:'I01',rohr:'I02',stahl:'I03',machete:'I04',brech:'I05',vorschlag:'I06',pflaster:'I07',zange:'I08',zwille:'I09',nagel:'I10',stein:'I11',rspeer:'I12',fahne:'I13',harpune:'I14',turm:'I15',mauer:'I16',
 leder:'I17',mantel:'I18',weste:'I19',feuer:'I20',bvg:'I21',helm:'I22',schieber:'I23',muetze:'I24',maske:'I25',handsch:'I26',bandage:'I27',schweiss:'I28',turnsch:'I29',stiefel:'I30',gummi:'I31',ring:'I32',
 siegel:'I33',totenk:'I34',mutter:'I35',draht:'I36',ehe:'I37',kupfer:'I38',kiesel:'I39',stueck:'I40',feder:'I41',kette:'I42',beutel:'I43',abzeichen:'I44',herz:'I45',wappen:'I46',auge:'I47',morgen:'I48',
 spaeti:'I49',panzer:'I50',zitklinge:'I51',pbrecher:'I52',kraehe:'I53',rattenmantel:'I54',ritter:'I55',siegsp:'I56',khemd:'I57',karm:'I58',bassarm:'I58',
 leucht:'I59',boxh:'I60',neonfl:'I61',mikro:'I62',poncho:'I63',kmantel:'I64',nbrille:'I65',nauge:'I66',zchip:'I67',reflex:'I68',bherz:'I69',npumpe:'I70',doener:'D01',
 verband:'C01',molotow:'C02',suppe:'C03',curry:'C04',kaffee:'C05',soljanka:'C06',gurke:'C07',m_nagel:'M01',griff:'M02',gewicht:'M03',batt:'M04',tank:'M05',phiole:'M06',dorn:'M07',
 stoff:'R01',metall:'R02',chemie:'R03',kabel:'R04',schrott:'R05',
 sichel:'I71',werkh:'I72',aufzieh:'I73',zeiger:'I74',blaumann:'I75',stroh:'I76',gartenh:'I77',pickel:'I78',kiezhelm:'I79',kiezhand:'I80',spreestief:'I81',spreering:'I82',topfhelm:'I83',eisenstief:'I84',
 kiezbox:'I85',schaffner:'I86',weltuhr:'I87',fleisch:'Z01',gemuese:'Z02',gewuerz:'Z03'};
const PORTI={ghoul:'E01',brute:'E02',spitter:'E03',rat:'E04',crow:'E05',shield:'E06',bomb:'E07',howl:'E08',raser:'E09',boss:'E10',
 doktor:'S01',schmied:'S02',kurier:'S03',koechin:'S04',spaeher:'S05',mechaniker:'S06',kabel:'E13',bass:'E14',hauptmann:'X01',hexe:'X02',turm:'X09',flieger:'X04',brand:'X05',ratten:'X06',ritter:'X07',platte:'X08'};
const pImgSrc=k=>PORTI[k]&&`assets/portraits/${PORTI[k]}.webp`;
const img=(k,sz,cl)=>ICOI[k]?`<img class="${cl||'ico'}" src="assets/icons/${ICOI[k]}.webp" width="${sz}" height="${sz}" alt="" draggable="false">`:'';
function icon(it,sz){if(!it)return'';const b=baseOf(it),k=b==='kette'&&(it.slot==='a'||/^Kettenhemd/.test(it.name))?'khemd':b;if(ICOI[k])return img(k,sz);const c=rc(it),f=ICO[b]||ICO.kiesel;
  return`<svg viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${f(c)}</svg>`;}
// blessing (Segen) icons: hex medallion, frame colour = rarest card picked for it (white, blue, gold), glyph per blessing in a 24 grid
const PQC=['#e8ddd0','#7d9bff','#f2d14b'],PQN=['Gewöhnlich','Selten','Episch'];
const PG={dmg:['#ff8a3d','f','<path d="M12 3c5 5 7 9 5 14a5 5 0 0 1-10 0c-1-4 2-6 2-9 2 2 2 4 3 5 1-3 0-6 0-10z"/>'],
 hp:['#e05050','f','<path d="M12 20l-7-7a4.5 4.5 0 0 1 7-5.5A4.5 4.5 0 0 1 19 13z"/>'],
 spd:['#c9b08a','s','<path d="M3 8h7M2 12h8M3 16h7M13 6l6 6-6 6M10 6l6 6-6 6"/>'],
 crit:['#f2d14b','s','<path d="M3 12q9-9 18 0q-9 9-18 0z"/><circle cx="12" cy="12" r="2.6" fill="#f2d14b"/>'],
 rate:['#ead9c0','s','<circle cx="12" cy="13" r="7"/><path d="M12 9v4l3 2M10 3h4"/>'],
 reach:['#c9b08a','s','<path d="M3 12h16M15 8l4 4-4 4M3 8v8"/>'],
 leech:['#c23a2e','f','<path d="M5 5h14l-5 15-2-6-2 6z"/>'],
 ram:['#c9b08a','f','<path d="M3 9h9V5l8 7-8 7v-4H3z"/>'],
 stun:['#f2d14b','f','<path d="M12 3l2.2 6H21l-5.5 4 2 7-5.5-4.2L6.5 20l2-7L3 9h6.8z"/>'],
 boom:['#ff8a3d','f','<path d="M12 2l2 6 6-3-3 6 6 2-6 2 3 6-6-3-2 6-2-6-6 3 3-6-6-2 6-2-3-6 6 3z"/>'],
 second:['#8fd16a','f','<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>'],
 scrap:['#b8b8c8','s','<path d="M12 4l7 4v8l-7 4-7-4V8z"/><circle cx="12" cy="12" r="3"/>'],
 dashcd:['#ead9c0','s','<path d="M3 18q8-12 17-10M15 4l5 4-4 5"/><path d="M3 13l3-1M4 8l3 0" stroke-width="1.4"/>'],
 thorns:['#a8b060','f','<path d="M12 2l2 6 5-3-2 6 6 1-6 2 3 5-5-2-1 6-2-5-4 4 0-6-6-1 5-3-4-4 6 0z"/>'],
 skill:['#f2a04b','s','<rect x="4" y="7" width="14" height="10" rx="1.5"/><path d="M18 10h2v4h-2M12 8l-3 4h3l-2 4" /> '],
 magnet:['#b8b8c8','f','<path d="M5 4h4v8a3 3 0 0 0 6 0V4h4v8a7 7 0 0 1-14 0z"/><path d="M5 4h4v3H5zM15 4h4v3h-4z" fill="#e05050"/>'],
 fire:['#ff6a2a','f','<path d="M12 3c5 5 7 9 5 14a5 5 0 0 1-10 0c-1-4 2-6 2-9 2 2 2 4 3 5 1-3 0-6 0-10z"/>'],
 acid:['#97C459','f','<path d="M12 3c4 6 7 9 7 12a7 7 0 0 1-14 0c0-3 3-6 7-12z"/>'],
 shock:['#7dd3ff','f','<path d="M14 2L5 13h6l-2 9 10-12h-6z"/>'],
 spread:['#ff6a2a','f','<path d="M8 6c3 3 4 6 3 9a3.5 3.5 0 0 1-7 0c0-3 2-4 2-6 1 1 1 2 2 3zM16 4c3 3 5 7 3 11a4 4 0 0 1-8 0c0-3 2-5 2-7 1 1 2 2 2 4 1-3 1-5 1-8z"/>'],
 corrode:['#97C459','f','<path d="M12 3c4 6 7 9 7 12a7 7 0 0 1-14 0c0-3 3-6 7-12z"/><path d="M8 15h8M9 18h6" stroke="#120d0a" stroke-width="1.6"/>'],
 chain:['#7dd3ff','f','<path d="M9 2L3 10h4l-2 6 7-8H8zM18 8l-6 8h4l-2 6 7-8h-4z"/>'],
 elp:['#ead9c0','f','<circle cx="12" cy="6" r="3.4" fill="#ff6a2a"/><circle cx="6" cy="17" r="3.4" fill="#97C459"/><circle cx="18" cy="17" r="3.4" fill="#7dd3ff"/>'],
 res:['#9aa4b0','f','<path d="M12 3l8 3v6c0 5-4 8-8 10-4-2-8-5-8-10V6z"/>'],
 combo:['#ead9c0','s','<path d="M4 19L10 5M10 19L16 5M16 19l4-9" stroke-width="2.4"/>'],
 loot:['#c9a227','s','<rect x="4" y="8" width="16" height="12" rx="1"/><path d="M4 12h16M12 8v12M7 8l2-4h6l2 4"/>'],
 breaker:['#9aa4b0','f','<path d="M12 3l8 3v6c0 5-4 8-8 10-4-2-8-5-8-10V6z"/><path d="M12 4l-2 6 4 2-3 8" stroke="#120d0a" stroke-width="1.8" fill="none"/>'],
 blast:['#ff8a3d','f','<path d="M10 9h4v2l2 3v8H8v-8l2-3z"/><path d="M12 2c2 2 2 4 0 6-2-2-2-4 0-6z" fill="#f2d14b"/>'],
 breath:['#9fd8c8','s','<path d="M3 9h11a3 3 0 1 0-3-3M3 14h14a3 3 0 1 1-3 3"/>'],
 exec:['#e8ddd0','f','<path d="M5 11a7 7 0 0 1 14 0v4h-3v4H8v-4H5z"/><circle cx="9" cy="11" r="1.8" fill="#120d0a"/><circle cx="15" cy="11" r="1.8" fill="#120d0a"/>'],
 mat:['#d6cfc0','f','<path d="M8 8h8l3 10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"/><path d="M9 8l-1-4h8l-1 4" fill="none" stroke="#d6cfc0" stroke-width="2"/>'],
 rush:['#c23a2e','s','<path d="M5 13l7-7 7 7M5 20l7-7 7 7" stroke-width="2.6"/>']};
// v0.82 family glyph (FAMG), power icon (KRG) and weapon class badge (WCG) come from js/glyphs.js
function famIcon(f,sz,on){const g=typeof FAMG!=='undefined'&&FAMG[f],c=FAM[f][1];return`<svg class="fg${on?' on':''}" viewBox="0 0 24 24" width="${sz}" height="${sz}" role="img" aria-label="${FAM[f][0]}">${g?g[1]:`<circle cx="12" cy="12" r="7" fill="${c}"/>`}</svg>`;}
function krIcon(k,sz){const g=typeof KRG!=='undefined'&&KRG[k];return`<svg viewBox="0 0 48 48" width="${sz}" height="${sz}" aria-hidden="true">${g||'<circle cx="24" cy="24" r="16" fill="#f2a04b"/>'}</svg>`;}
const IMPG='<rect x="6" y="6" width="12" height="12" rx="1.5" fill="none" stroke="#7dd3ff" stroke-width="1.8"/><circle cx="12" cy="12" r="2.2" fill="#7dd3ff"/><path d="M9 2.5v3.5M15 2.5v3.5M9 18v3.5M15 18v3.5M2.5 9h3.5M2.5 15h3.5M18 9h3.5M18 15h3.5" stroke="#7dd3ff" stroke-width="1.6"/>';// v0.87 implant badge, same corner as the weapon class badge
const wcBadge=(it,c)=>it&&it.slot==='i'?`<span class="wcb" title="Implantat"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">${IMPG}</svg></span>`:it&&it.slot==='w'&&typeof WCG!=='undefined'&&WCG[it.kind]?`<span class="wcb" title="${KIND[it.kind].n}"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">${WCG[it.kind].replace(/CUR/g,c||'#ead9c0')}</svg></span>`:'';
function pIcon(k,sz,q){const g=PG[k]||PG.dmg,f=PQC[q||0],st=g[1]==='s';
  return`<svg viewBox="0 0 32 32" width="${sz}" height="${sz}" aria-hidden="true"><path d="M16 1.5L29 9v14l-13 7.5L3 23V9z" fill="#1c140f" stroke="${f}" stroke-width="2"/><g transform="translate(6 6) scale(.8333)" fill="${st?'none':g[0]}" stroke="${st?g[0]:'none'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${g[2]}</g></svg>`;}
