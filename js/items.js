/* ================= items ================= */
let uid=Date.now();
function newJob(){const ex=S.jobs.map(j=>j.k),J=pick(JOBT.filter(j=>!ex.includes(j.k))),t=J.t();return{id:++uid,k:J.k,t,p:0,sc:Math.round((45+25*S.unlocked)*R(.85,1.2)),item:Math.random()<.6};}
function fillJobs(){while(S.jobs.length<3)S.jobs.push(newJob());}
function jobDone(j){toast(`Auftrag erledigt: <span style="color:var(--ember)">${JOBT.find(x=>x.k===j.k).n(j.t)}</span>`);sfx('bell');updateHot();}
function prog(k,n){for(const j of S.jobs)if(j.k===k&&j.p<j.t){j.p=Math.min(j.t,j.p+(n||1));if(j.p>=j.t)jobDone(j);}}
function progWave(w){for(const j of S.jobs)if(j.k==='wave'&&j.p<j.t&&w>j.p){j.p=Math.min(j.t,w);if(j.p>=j.t)jobDone(j);}}
function rollR(minR){const l=S.upg.luck+DF().luck+(ST?ST.luck:0)+(run?run.th:0),w=run?run.wave:1;const ws=[60,26+w+l*3,8+w*.7+l*2,1.2+w*.3+l*.8];for(let i=0;i<(minR||0);i++)ws[i]=0;let t=ws.reduce((a,b)=>a+b),x=Math.random()*t;for(let i=0;i<4;i++){if((x-=ws[i])<0)return i;}return minR||0;}
function makeItem(il,minR){
  const r=rollR(minR),roll=Math.random(),slot=roll<.45?'w':roll<.8?'a':'t',m=RAR[r].m*R(.85,1.15);let kind,name,val;
  if(slot==='w'){kind=pick(['blade','blade','hammer','sling']);name=r===3?LEGW[kind]:pick(NW[kind]);val=Math.round((4+il*1.6)*KIND[kind].k*m);}
  else if(slot==='a'){kind='armor';name=r===3?pick(LEGA):pick(NA);val=Math.round((12+il*6)*m);}
  else{kind=pick(['krit','tempo','heil']);name=r===3?'Herz der Spree':pick(NT[kind]);const b={krit:3+il*.35,tempo:4+il*.3,heil:.5+il*.12}[kind]*m;val=kind==='heil'?+b.toFixed(1):Math.round(b);}
  const base=BASES[name];if(r===1||r===2)name+=' '+pick(SUF[r]);
  const it={id:++uid,slot,kind,base,name,r,val,ilvl:il,afx:[]};rollAfx(it);return it;
}
function makeSetItem(il){const k=pick(['kiez','spree']),slot=pick(['w','a','t']),[name,kind,base]=SETS[k].p[slot];let val;
  if(slot==='w')val=Math.round((4+il*1.6)*KIND[kind].k*1.8);else if(slot==='a')val=Math.round((12+il*6)*1.8);else val=Math.round({krit:3+il*.35,tempo:4+il*.3}[kind]*1.8);
  const it={id:++uid,slot,kind,base,name,r:2,val,ilvl:il,afx:[],set:k};rollAfx(it);delete it.el;return it;}
function lootItem(il,minR,p){return Math.random()<(p||.05)?makeSetItem(il):makeItem(il,minR);}
function rollAfx(it){const r=it.r,il=it.ilvl,m=Math.sqrt(RAR[r].m);
  const add=(k,v)=>{if(k==='hp')v*=1+il*.15;if(v>0)v*=m;v=AFX[k].d?+v.toFixed(1):Math.round(v);if(!v)return;const f=it.afx.find(a=>a.k===k);if(f)f.v=AFX[k].d?+(f.v+v).toFixed(1):f.v+v;else it.afx.push({k,v});};
  let n=[0,1,2,3][r];
  if(r===3||(r===2&&Math.random()<.45)){pick(PACTS).forEach(q=>add(q[0],R(q[1],q[2])));n--;}
  const keys=Object.keys(AFX).filter(k=>!it.afx.some(a=>a.k===k));
  for(let i=0;i<n&&keys.length;i++){const k=keys.splice(Math.floor(Math.random()*keys.length),1)[0];add(k,R(AFX[k].a,AFX[k].b));}
  if(it.slot==='w'){if(r===3)it.el=LEGEL[it.base];else if(r>=1&&Math.random()<(r===1?.3:.5))it.el=pick(['fire','acid','shock']);}
  it.afx=it.afx.filter(a=>a.v!==0);}
const dps=it=>it.val/KIND[it.kind].rate;
function withItem(it){const e=Object.assign({},S.eq);e[it.slot]=it;return e;}
function better(it){return power(stats(withItem(it)))>power(stats())*1.01;}
function fmtA(f){const A=AFX[f.k];let v=A.neg?-f.v:f.v;return(v>0?'+':'−')+(A.d?Math.abs(v).toFixed(1):Math.abs(v))+A.u+' '+A.n;}
function afxLines(it){let h='';if(it.set){const Q=SETS[it.set],n=setCount(S.eq,it.set);h+=`<div class="af" style="color:${SETC}">Set ${Q.n} · ${n}/3 angelegt</div><div class="af" style="color:${n>=2?SETC:'var(--dim)'}">(2) ${Q.b2}</div><div class="af" style="color:${n>=3?SETC:'var(--dim)'}">(3) ${Q.b3}</div>`;}if(LEGP[baseOf(it)])h+=`<div class="af" style="color:${RAR[3].c};font-style:italic">${LEGP[baseOf(it)]}</div>`;if(it.el)h+=`<div class="st" style="color:${ELC[it.el]}">Element: ${ELN[it.el]}</div>`;if(modSlots(it)){const ms=it.mods||[];h+=`<div class="af" style="color:#f2a04b">Aufsätze ${ms.length}/${modSlots(it)}${ms.length?': '+ms.map(k=>(MODS.find(m=>m.k===k)||{}).n).join(', '):''}</div>`;}
  [...(IMP[baseOf(it)]||[]).map(q=>({k:q[0],v:q[1]})),...(it.afx||[])].forEach(f=>{h+=`<div class="af" style="color:${f.v>0?'var(--bone)':'var(--bad)'}">${fmtA(f)}</div>`;});return h;}
const SROWS=[['Kampfkraft',s=>power(s),0],['Schaden pro Treffer',s=>s.dmg,0],['Angriffe pro Sekunde',s=>1/s.rate,1],['Krit-Chance',s=>s.crit*100,0,'%'],['Leben',s=>s.maxHp,0],['Widerstand',s=>s.res*100,0,'%'],
  ['Lauftempo',s=>s.spd/1.65,0,'%'],['Leben pro Sekunde',s=>s.regen,1],['Elementarschaden',s=>s.els.length?s.elp*100:0,0,'%'],['Leben pro Kill',s=>s.leech,0],['Beuteglück',s=>s.luck,0],['Sprint-Abklingzeit',s=>s.dashCd,1,' s',1]];
function cmpBlock(it){const a=stats(),b=stats(withItem(it));let h='';
  for(const[n,f,d,u,inv]of SROWS){const fx=v=>v.toFixed(d)+(u||''),x=fx(f(a)),y=fx(f(b));if(x===y)continue;const good=inv?f(b)<f(a):f(b)>f(a);
    h+=`<div class="cmp"><span>${n}</span><span>${x} → <b style="color:${good?'var(--good)':'var(--bad)'}">${y}</b></span></div>`;}
  if(a.els.join()!==b.els.join())h+=`<div class="cmp"><span>Element</span><span>${a.els.map(e=>ELN[e]).join(', ')||'keins'} → <b>${b.els.map(e=>ELN[e]).join(', ')||'keins'}</b></span></div>`;
  return h||'<div class="sub">Keine Veränderung</div>';}
const scrapVal=it=>Math.round((it.r+1)*3*(1+it.ilvl*.08));
function statLine(it){if(it.slot==='w')return`${it.val} Schaden · ${KIND[it.kind].n} · ${Math.round(dps(it))} DPS`;if(it.slot==='a')return`+${it.val} Leben`;return{krit:`+${it.val}% Krit-Chance`,tempo:`+${it.val}% Tempo`,heil:`+${it.val} Leben pro Sekunde`}[it.kind];}

const Y='<path d="M12 21v-8M12 13L7 4M12 13l5-9"/><path d="M7 4q5 5 10 0" stroke-width="1.2"/>';
const ICO={
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
 herz:c=>`<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="${c}" fill-opacity=".3"/><path d="M8 12q2 2 4 0t4 0" stroke-width="1.2"/>`};
function icon(it,sz){if(!it)return'';const c=rc(it),f=ICO[baseOf(it)]||ICO.kiesel;
  return`<svg viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${f(c)}</svg>`;}
