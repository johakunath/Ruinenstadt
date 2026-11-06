/* ================= panels ================= */
let invTab='bag',invFrom='menu',sel=null,invMsg='',allArm=false;
function cloudLine(){const m={off:'Spielstand auf diesem Gerät',sync:'Cloud wird geladen',on:'Cloud-Speicher aktiv · auf allen Geräten',slow:'Cloud gerade nicht erreichbar · speichert lokal',err:'Cloud nicht verfügbar · speichert lokal'};
  return`<div class="cloud${cloud.state==='on'?' on':''}">${m[cloud.state]}</div>`;}
function renderMenu(){
  $('menubox').innerHTML=`<h1>Ruinenstadt</h1><canvas id="campc" width="800" height="300" style="width:100%;height:auto;border:1px solid var(--edge);border-radius:4px;display:block" aria-label="Dein Lager"></canvas><p class="lead">Berlin, nach dem Fall. Befreie Bezirk um Bezirk, plündere, werde stärker.</p>
  <div class="scrap">Schrott <b>${S.scrap}</b></div>
  <div class="btns">${DIST.map((d,i)=>{const lock=i>=S.unlocked;return`<button class="dist${i===S.dist&&!lock?' on':''}${lock?' lock':''}" data-d="${i}"${lock?' aria-disabled="true"':''}><span class="dn">${d.n}</span><span class="dm">${lock?'Gesperrt':(S.best[i]>=10?'Befreit':S.best[i]?'Rekord: Welle '+S.best[i]+'/10':'Unerforscht')}</span></button>`;}).join('')}</div>
  <button class="btn main" id="go">Losziehen</button>
  <div class="two"><button class="btn" data-m="inv">Ausrüstung</button><button class="btn" data-m="shop">Werkstatt</button></div>
  <button class="btn" data-m="jobs">Aufträge${S.jobs.filter(j=>j.p>=j.t).length?` · <span class="ok">${S.jobs.filter(j=>j.p>=j.t).length} fertig</span>`:''}</button>
  ${S.tmax>0?`<div class="row"><button class="btn sm" data-m="thm" aria-label="Bedrohung senken">−</button><div class="scrap">Bedrohung <b>${S.threat}</b> von ${S.tmax}<br><span style="font-size:14px">${S.threat?`Gegner +${S.threat*25}% Leben · Beute +${S.threat*3} Stufen`:'Grundbedrohung'}</span></div><button class="btn sm" data-m="thp" aria-label="Bedrohung erhöhen">+</button></div>`:'<p class="hint">Befreie einen Bezirk, um höhere Bedrohung mit besserer Beute freizuschalten.</p>'}
  <button class="btn sm" data-m="diff">Schwierigkeit: ${DF().n}</button>
  <div class="two"><button class="btn sm" data-m="mute">${S.mute?'Ton aus':'Ton an'}</button><button class="btn sm" data-m="eco">${S.eco?'Akkusparen an':'Akkusparen aus'}</button></div>
  <button class="btn sm" data-m="music">${S.music?'Musik an':'Musik aus'}</button>
  ${cloudLine()}
  <div class="two"><button class="btn sm" data-m="exp">Spielstand kopieren</button><button class="btn sm" data-m="imp">Spielstand laden</button></div>
  <p class="hint">${S.rec.kills.toLocaleString('de-DE')} Gegner besiegt · ${S.rec.legs} Legendäre · ${S.rec.runs} Expeditionen · ${S.rec.wins} Befreiungen · ${Math.round(S.rec.time/60)} Minuten gespielt</p>
  <p class="hint">Baue dein Lager in der Werkstatt aus.</p>
  <p class="hint">Links ziehen: laufen · Hieb halten: kämpfen<br>Sprint: ausweichen · Kraft: Spezialangriff deiner Waffe<br>Kisten und Mülltonnen lassen sich zerschlagen<br>Verband und Molotow stellst du in der Werkstatt her<br>Dunkelzonen am U-Bahn-Schild: Fackel nur mit einhändiger Waffe<br>Tastatur: WASD, Leertaste, Shift, E, Q, R, P</p>
  <p class="hint">Version ${VERSION}</p>`;
  drawCamp();
}
function drawCamp(){const c=$('campc');if(!c)return;const g=c.getContext('2d'),W=800,H=300,K=S.camp;g.save();
  const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#120e0c');sky.addColorStop(1,'#2a211b');g.fillStyle=sky;g.fillRect(0,0,W,H);
  g.fillStyle='#0c0907';for(let i=0;i<14;i++){const x=i*60,h=40+((i*37)%70);g.fillRect(x,95-h,48,h+20);if(i%3===0){g.fillStyle='#e0892e';g.fillRect(x+12,95-h+14,6,8);g.fillStyle='#0c0907';}}
  g.fillStyle='#231b16';g.fillRect(0,110,W,H-110);for(let i=0;i<300;i++){g.fillStyle=Math.random()<.5?'rgba(0,0,0,.2)':'rgba(255,230,200,.04)';g.fillRect(Math.random()*W,110+Math.random()*(H-110),3,2);}
  const fx=400,fy=215,gl=g.createRadialGradient(fx,fy,0,fx,fy,220);gl.addColorStop(0,'rgba(255,140,50,.38)');gl.addColorStop(1,'rgba(255,140,50,0)');g.fillStyle=gl;g.fillRect(0,0,W,H);
  const tent=(x,y,col,mark)=>{g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-56,y+2,116,10);g.fillStyle=col;g.beginPath();g.moveTo(x-55,y);g.lineTo(x,y-70);g.lineTo(x+55,y);g.fill();g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.moveTo(x,y-70);g.lineTo(x+55,y);g.lineTo(x+10,y);g.fill();g.fillStyle='#0b0806';g.beginPath();g.moveTo(x-12,y);g.lineTo(x,y-34);g.lineTo(x+12,y);g.fill();if(mark){g.fillStyle=mark;g.fillRect(x-4,y-56,8,20);g.fillRect(x-10,y-50,20,8);}};
  tent(250,225,'#5a4a30');
  if(K.sani)tent(560,230,'#d6cfc0','#3B6D11');
  if(K.turm){g.fillStyle='#4a3424';g.fillRect(690,60,8,170);g.fillRect(740,60,8,170);g.strokeStyle='#4a3424';g.lineWidth=4;g.beginPath();g.moveTo(694,220);g.lineTo(744,120);g.moveTo(744,220);g.lineTo(694,120);g.stroke();g.fillStyle='#5a4030';g.fillRect(680,40,78,28);g.fillStyle='#3a2a20';g.beginPath();g.moveTo(674,42);g.lineTo(719,14);g.lineTo(764,42);g.fill();}
  if(K.funk){g.strokeStyle='#3a342e';g.lineWidth=3;g.beginPath();g.moveTo(620,225);g.lineTo(628,40);g.lineTo(636,225);g.moveTo(612,225);g.lineTo(628,120);g.lineTo(644,225);g.stroke();g.fillStyle='#ff4030';g.beginPath();g.arc(628,38,5,0,7);g.fill();}
  if(K.halle){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(64,238,170,10);g.fillStyle='#4a4740';g.fillRect(60,170,170,70);g.fillStyle='#3f3d38';g.beginPath();g.moveTo(52,172);g.lineTo(145,140);g.lineTo(238,172);g.fill();g.fillStyle='#14100d';g.fillRect(120,195,50,45);g.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<6;i++)g.fillRect(122,200+i*7,46,2);}
  if(K.garten){for(let r=0;r<3;r++){g.fillStyle='#3a2a1e';g.fillRect(300+r*60,262,48,22);for(let k=0;k<4;k++){g.fillStyle=['#4a5a2a','#3b4a22','#5a6a30'][k%3];g.beginPath();g.arc(306+r*60+k*12,262,6,0,7);g.fill();}}}
  if(K.presse){g.fillStyle='#5a5650';g.fillRect(470,150,70,70);g.fillStyle='#7a766c';g.fillRect(470,150,70,10);g.fillStyle='#3a3630';g.fillRect(480,170,50,40);g.fillStyle='#c23a2e';g.fillRect(528,160,8,8);}
  g.fillStyle='#4a4038';for(let i=0;i<8;i++){const a=i/8*6.283;g.beginPath();g.arc(fx+Math.cos(a)*30,fy+12+Math.sin(a)*10,8,0,7);g.fill();}
  g.fillStyle='#2a1d14';g.fillRect(fx-22,fy+2,44,8);
  for(let k=0;k<6;k++){g.fillStyle=k%2?'#EF9F27':'#FAC775';const h=30+((k*13)%22);g.beginPath();g.moveTo(fx-20+k*7,fy+4);g.lineTo(fx-12+k*7,fy+4);g.lineTo(fx-16+k*7,fy+4-h);g.fill();}
  const fig=(x,y,j,hat)=>{g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(x,y+2,14,4,0,0,7);g.fill();g.fillStyle='#1e1610';g.fillRect(x-6,y-18,5,18);g.fillRect(x+1,y-18,5,18);g.fillStyle=j;g.fillRect(x-9,y-42,18,26);g.fillStyle='#d9b48f';g.beginPath();g.arc(x,y-50,8,0,7);g.fill();if(hat){g.fillStyle=hat;g.beginPath();g.arc(x,y-53,8.5,Math.PI,0);g.fill();g.fillRect(x-10,y-54,20,3);}};
  fig(470,250,'#26304a','#f2c230');fig(330,245,LOOK[S.eq.a?baseOf(S.eq.a):'none'].j,null);
  g.font='600 22px sans-serif';g.fillStyle='rgba(234,217,192,.65)';g.textAlign='left';g.fillText('Ilse',446,282);g.textAlign='right';g.fillText(CAMP.filter(c=>K[c.k]).length+'/'+CAMP.length+' gebaut',788,288);
  g.restore();}
$('menubox').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;initAudio();sfx('ui');
  if(t.dataset.d!==undefined){const i=+t.dataset.d;if(i<S.unlocked){S.dist=i;save();buildWorld(DIST[i]);renderMenu();}return;}
  if(t.id==='go')return startRun(S.dist);const m=t.dataset.m;if(m==='inv'||m==='shop'||m==='jobs'){invTab=m==='inv'?'bag':m;openInv('menu');}
  if(m==='mute'){setMute(!S.mute);renderMenu();}if(m==='eco'){setEco(!S.eco);renderMenu();}if(m==='thm'){S.threat=Math.max(0,S.threat-1);save();renderMenu();}if(m==='thp'){S.threat=Math.min(S.tmax,S.threat+1);save();renderMenu();}if(m==='music'){S.music=!S.music;save();if(S.music)startMusic();else stopMusic();renderMenu();}if(m==='exp')exportSave();if(m==='imp')importSave();if(m==='diff'){S.diff=((S.diff==null?1:S.diff)+1)%3;save();renderMenu();}});
function openInv(from){invFrom=from;sel=null;invMsg='';allArm=false;if(run)run.quitArm=false;renderInv();$('inv').hidden=false;$('menu').hidden=true;}
function slotBtn(k,lbl){const it=S.eq[k],s=sel&&sel.src==='eq'&&sel.slot===k;return`<button class="slot${s?' sel':''}" data-eq="${k}" aria-label="${lbl}"><span class="ic${it?'':' empty'}" style="${it?'border-color:'+rc(it):''}">${it?icon(it,44):''}</span>${lbl}</button>`;}
function detail(){
  if(!sel)return`<div class="card"><div class="sub">Tippe ein Teil an, um es mit deiner Ausrüstung zu vergleichen.</div></div>`;
  const it=sel.src==='eq'?S.eq[sel.slot]:(sel.src==='stash'?S.stash:S.bag)[sel.i];if(!it)return`<div class="card"><div class="sub">Dieser Platz ist leer. Lege einen Talisman oder eine Rüstung aus dem Rucksack an.</div></div>`;
  const R_=RAR[it.r],camp=invFrom!=='run';let b='';
  if(sel.src==='bag')b=`<div class="two"><button class="btn main sm" data-a="equip">Anlegen</button><button class="btn sm" data-a="salv">Schrott +${scrapVal(it)}</button></div>${camp?'<button class="btn sm" data-a="tostash">Ins Lager</button>':''}`;
  else if(sel.src==='stash')b=`<div class="two"><button class="btn main sm" data-a="equip">Anlegen</button><button class="btn sm" data-a="salv">Schrott +${scrapVal(it)}</button></div><button class="btn sm" data-a="tobag">In den Rucksack</button>`;
  else if(it.slot!=='w')b=`<div class="two"><button class="btn sm" data-a="uneq">Ablegen</button><span></span></div>`;
  b+=`<div class="two">${sel.src!=='eq'?`<button class="btn sm" data-a="lock">${it.lock?'Entsperren':'Sperren'}</button>`:'<span></span>'}${camp&&it.r>0?`<button class="btn sm" data-a="forge">Umschmieden · ${rfCost(it)}</button>`:'<span></span>'}</div>`;
  const sk=it.slot==='w'?`<div class="sub">Kraft: ${KIND[it.kind].sk}</div>`:'';
  return`<div class="card"><div class="nm" style="color:${rc(it)}">${it.name}</div><div class="sub">${it.set?'Set-Teil':R_.n} · ${it.slot==='w'?KIND[it.kind].n:it.slot==='a'?'Rüstung':'Talisman'} · Stufe ${it.ilvl}</div>
    <div class="st">${statLine(it)}</div>${afxLines(it)}${sk}${sel.src!=='eq'?`<div class="lbl" style="text-align:left;margin-top:4px">Wenn angelegt</div>${cmpBlock(it)}`:'<div class="sub">Angelegt</div>'}${b}</div>`;}
const notUp=it=>better(it)!==true&&it.r<3&&!it.lock&&!it.set;
function renderInv(){
  const perkList=run&&invFrom==='run'?Object.keys(run.perks).map(k=>PERKS.find(p=>p.k===k).n+(run.perks[k]>1?' '+run.perks[k]:'')).join(' · '):'';
  if(invFrom==='run'&&invTab==='stash')invTab='bag';refresh();
  const tb=(k,n)=>`<button class="tab${invTab===k?' on':''}" data-t="${k}">${n}</button>`;
  const head=`<div class="tabs">${tb('bag','Rucksack')}${invFrom!=='run'?tb('stash','Lager'):''}${tb('jobs','Aufträge')}${tb('shop','Werkstatt')}</div>
    <div class="row"><div class="scrap" style="text-align:left">Schrott <b>${S.scrap}</b> · Kampfkraft <b>${power(ST)}</b></div><button class="btn sm main" data-a="close">${invFrom==='run'?'Weiter':'Zurück'}</button></div>
    <div class="scrap" style="font-size:16px">${invTab==='stash'?`Lager ${S.stash.length}/${stashMax()}`:`Rucksack ${S.bag.length}/${BAG}`}${invFrom==='run'?` · ${DIST[run.d].n} Welle ${run.wave}/10`:''}</div>${perkList?`<div class="perks">${perkList}</div>`:''}`;
  let body='';
  if(invTab==='bag'||invTab==='stash'){const LST=invTab==='stash'?S.stash:S.bag,N=invTab==='stash'?stashMax():BAG,src=invTab==='stash'?'stash':'bag';
    let cells='';for(let i=0;i<N;i++){const it=LST[i],s=sel&&sel.src===src&&sel.i===i;
      cells+=it?`<button class="cell${s?' sel':''}" data-b="${i}" style="border-color:${rc(it)}" aria-label="${it.name}">${icon(it,32)}${it.lock?LOCK:''}${better(it)?'<span class="up">▲</span>':''}${it.el?`<span class="el" style="background:${ELC[it.el]}"></span>`:''}</button>`:`<div class="cell" aria-hidden="true"></div>`;}
    const sum=f=>LST.filter(f).reduce((a,i)=>a+scrapVal(i),0),chips=[];
    ['Gewöhnliche','Magische','Seltene'].forEach((n,r)=>{const v=sum(i=>i.r===r&&!i.lock&&!i.set);if(v)chips.push(`<button class="chip" data-sr="${r}" style="color:${RAR[r].c}">${n} +${v}</button>`);});
    const va=sum(notUp);if(va)chips.push(`<button class="chip${allArm?' warn':''}" data-a="all">${allArm?'Sicher? Tippe erneut':'Alles ohne ▲ +'+va}</button>`);
    body=`<div class="eq">${slotBtn('w','Waffe')}${slotBtn('a','Rüstung')}${slotBtn('t','Talisman')}</div>${(()=>{const mk=S.eq.w.kind,l=mLvl(mk),nx=mNext(mk);return`<p class="hint">${MAST_N[mk]}-Meisterschaft Stufe ${l}${nx?` · ${S.mast[mk]||0}/${nx} EP`:' · maximal'} · +${4*l}% Schaden${l>=5?' · schnellere Kraft':''}</p>`;})()}${detail()}<div class="grid">${cells}</div>
      ${chips.length?`<div class="lbl">Verschrotten</div><div class="chips">${chips.join('')}</div><p class="hint">„Alles ohne ▲“ behält Verbesserungen, Legendäres, Set-Teile und Gesperrtes. ▲ heißt: mehr Kampfkraft.</p>`:''}
      <p class="hint">Gegnerkunde: Ghule fürchten <span style="color:${ELC.fire}">Feuer</span>. Brocken vertragen Feuer, aber keine <span style="color:${ELC.acid}">Säure</span>. Speier sind immun gegen Säure und anfällig für <span style="color:${ELC.shock}">Strom</span>. Der Schrottkoloss leitet Strom. Jeder Bezirk hat seinen eigenen Endgegner mit eigener Schwäche.</p>`;}
  else if(invTab==='jobs')body=`<p class="hint" style="text-align:left">Ilse von der Kiezwache hat Arbeit für dich. Fortschritt zählt in jeder Expedition, egal in welchem Bezirk.</p>`+S.jobs.map((j,i)=>{const J=JOBT.find(x=>x.k===j.k),done=j.p>=j.t;
      return`<div class="upg"><div><div class="un">${J.n(j.t)}</div><div class="ud">${Math.min(j.p,j.t)} / ${j.t} · ${j.sc} Schrott${j.item?' + seltenes Teil':''}</div><div class="pbar"><i style="width:${Math.round(100*Math.min(1,j.p/j.t))}%"></i></div></div>${done?`<button class="btn sm main" data-j="${i}">Abholen</button>`:`<button class="btn sm" data-jr="${i}">Tauschen · 10</button>`}</div>`;}).join('')+`<div class="lbl">Erfolge ${ACH.filter(a=>S.ach[a.k]).length} von ${ACH.length}</div>`+ACH.map(a=>`<div class="upg"><div><div class="un" style="${S.ach[a.k]?'color:var(--good)':''}">${a.n}</div><div class="ud">${a.d} · ${a.r} Schrott</div></div><span class="ud${S.ach[a.k]?' ok':''}">${S.ach[a.k]?'Erreicht':'Offen'}</span></div>`).join('');
  else body=UPG.map(u=>{const l=S.upg[u.k],mx=l>=u.max;return`<div class="upg"><div><div class="un">${u.n}</div><div class="ud">${u.d(l)}${mx?'':' → '+u.d(l+1)}</div>
      <div class="pips">${Array.from({length:u.max},(_,i)=>`<i class="${i<l?'f':''}"></i>`).join('')}</div></div>${mx?'<span class="ud">Maximal</span>':`<button class="btn sm${S.scrap>=upCost(u)?' main':''}" data-u="${u.k}">${upCost(u)} Schrott</button>`}</div>`;}).join('')+
    `<div class="lbl">Lagerausbau</div>`+CAMP.map(c=>`<div class="upg"><div><div class="un">${c.n}</div><div class="ud">${c.d}</div></div>${S.camp[c.k]?'<span class="ud ok">Gebaut</span>':`<button class="btn sm${S.scrap>=c.p?' main':''}" data-bd="${c.k}">${c.p} Schrott</button>`}</div>`).join('')+
    `<div class="lbl">Herstellen</div>`+CONS.map(c=>{const n=S.cons[c.k]||0;return`<div class="upg"><div><div class="un">${c.n}</div><div class="ud">${c.d} · ${n}/3 dabei</div></div>${n>=3?'<span class="ud">Voll</span>':`<button class="btn sm${S.scrap>=c.p?' main':''}" data-cr="${c.k}">${c.p} Schrott</button>`}</div>`;}).join('');
  const foot=`<div class="msg">${invMsg}</div><div class="two"><button class="btn sm" data-a="mute">${S.mute?'Ton aus':'Ton an'}</button><button class="btn sm" data-a="eco">${S.eco?'Akkusparen an':'Akkusparen aus'}</button></div>
    ${invFrom==='run'?`<button class="btn sm" data-a="quit">${run.quitArm?'Sicher? Tippe erneut':'Expedition abbrechen'}</button>`:''}`;
  $('invbox').innerHTML=head+body+foot;
}
$('invbox').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;invMsg='';sfx('ui');if(d.a!=='all')allArm=false;
  if(d.t){invTab=d.t;sel=null;}
  else if(d.b!==undefined)sel={src:invTab==='stash'?'stash':'bag',i:+d.b};
  else if(d.eq)sel={src:'eq',slot:d.eq};
  else if(d.u){const u=UPG.find(x=>x.k===d.u),c=upCost(u);if(S.scrap>=c&&S.upg[u.k]<u.max){S.scrap-=c;S.upg[u.k]++;refresh();save();sfx('coin');}else invMsg=`Dir fehlen ${c-S.scrap} Schrott.`;}
  else if(d.bd){const c=CAMP.find(x=>x.k===d.bd);if(S.camp[c.k]){}else if(S.scrap<c.p)invMsg=`Dir fehlen ${c.p-S.scrap} Schrott.`;else{S.scrap-=c.p;S.camp[c.k]=1;refresh();save();sfx('win');invMsg=`<span class="ok">${c.n} gebaut</span>`;}}
  else if(d.cr){const c=CONS.find(x=>x.k===d.cr);if(S.scrap<c.p)invMsg=`Dir fehlen ${c.p-S.scrap} Schrott.`;else if((S.cons[c.k]||0)<3){S.scrap-=c.p;S.cons[c.k]=(S.cons[c.k]||0)+1;save();sfx('coin');}}
  else if(d.j!==undefined){const j=S.jobs[+d.j];if(j&&j.p>=j.t){S.scrap+=j.sc;let m=`+${j.sc} Schrott`;if(j.item){const it=makeItem(DIST[S.unlocked-1].lvl+4,2);if(S.bag.length<BAG)S.bag.push(it);else if(S.stash.length<stashMax())S.stash.push(it);else S.scrap+=scrapVal(it);m+=` · <span style="color:${RAR[it.r].c}">${it.name}</span>`;}
    S.jobs[+d.j]=newJob();save();sfx('win');invMsg=`<span class="ok">${m}</span>`;}}
  else if(d.jr!==undefined){if(S.scrap<10)invMsg='Dir fehlen Schrott zum Tauschen.';else{S.scrap-=10;S.jobs[+d.jr]=newJob();save();}}
  else if(d.a==='close'){if(invFrom==='run')resume();else{$('inv').hidden=true;renderMenu();$('menu').hidden=false;}return;}
  else if(d.a==='equip'){const LST=sel.src==='stash'?S.stash:S.bag,i=sel.i,it=LST[i],old=S.eq[it.slot];S.eq[it.slot]=it;if(old)LST[i]=old;else LST.splice(i,1);sel={src:'eq',slot:it.slot};refresh();save();}
  else if(d.a==='salv'){const LST=sel.src==='stash'?S.stash:S.bag,it=LST[sel.i];if(it.lock){invMsg='Gesperrt. Erst entsperren.';renderInv();return;}S.scrap+=scrapVal(it);LST.splice(sel.i,1);sel=null;save();sfx('coin');}
  else if(d.a==='tostash'){if(S.stash.length>=stashMax())invMsg='Das Lager ist voll.';else{S.stash.push(S.bag.splice(sel.i,1)[0]);sel=null;save();}}
  else if(d.a==='tobag'){if(S.bag.length>=BAG)invMsg='Der Rucksack ist voll.';else{S.bag.push(S.stash.splice(sel.i,1)[0]);sel=null;save();}}
  else if(d.a==='uneq'){if(S.bag.length>=BAG)invMsg='Rucksack ist voll.';else{S.bag.push(S.eq[sel.slot]);S.eq[sel.slot]=null;refresh();save();}}
  else if(d.sr!==undefined){const r=+d.sr,K_=invTab==='stash'?'stash':'bag';S[K_]=S[K_].filter(it=>{if(it.r===r&&!it.lock&&!it.set){S.scrap+=scrapVal(it);return false;}return true;});sel=null;save();sfx('coin');}
  else if(d.a==='all'){const K_=invTab==='stash'?'stash':'bag';if(!allArm)allArm=true;else{allArm=false;S[K_]=S[K_].filter(it=>{if(notUp(it)){S.scrap+=scrapVal(it);return false;}return true;});sel=null;save();sfx('coin');}}
  else if(d.a==='lock'){const it=(sel.src==='stash'?S.stash:S.bag)[sel.i];if(it){it.lock=!it.lock;save();}}
  else if(d.a==='forge'){const it=sel.src==='eq'?S.eq[sel.slot]:(sel.src==='stash'?S.stash:S.bag)[sel.i],c=rfCost(it);if(S.scrap<c)invMsg=`Dir fehlen ${c-S.scrap} Schrott.`;else{S.scrap-=c;it.afx=[];rollAfx(it);if(it.set)delete it.el;it.rr=(it.rr||0)+1;refresh();save();sfx('coin');invMsg='<span class="ok">Umgeschmiedet</span>';}}
  else if(d.a==='mute')setMute(!S.mute);
  else if(d.a==='eco')setEco(!S.eco);
  else if(d.a==='quit'){if(!run.quitArm){run.quitArm=true;}else{S.best[run.d]=Math.max(S.best[run.d],run.wave-1);save();state='menu';run=null;refresh();$('inv').hidden=true;renderMenu();$('menu').hidden=false;return;}}
  updateHot();renderInv();});
function showEnd(won){
  const d=DIST[run.d];
  $('endbox').innerHTML=`<h2>${won?d.n+' befreit':'Gefallen'}</h2><p class="lead">${won?'Der Bezirk atmet wieder.':'Die Ruinen behalten dich heute Nacht.'}</p>
  <div class="stats"><div>Welle <b>${won?10:run.wave}</b> von 10 · ${DF().n}${run.th?' · Bedrohung '+run.th:''}</div><div><b>${run.kills}</b> Gegner besiegt · Stufe <b>${P.lvl}</b></div><div>Schrott gesammelt <b>+${run.sg}</b>${won?` (inkl. ${run.bonus} Bonus)`:''}</div>
  ${won&&run.unl?`<div style="color:var(--ember)">Neuer Bezirk: ${DIST[run.d+1].n}</div>`:''}${won&&run.thUnl?`<div style="color:var(--ember)">Bedrohung ${S.tmax} freigeschaltet</div>`:''}</div>
  <p class="hint">Deine Beute und dein Schrott bleiben erhalten. Segen verfallen.</p>
  <div class="btns">${won&&run.unl?`<button class="btn main" data-e="next">Weiter nach ${DIST[run.d+1].n}</button>`:''}<button class="btn${won&&run.unl?'':' main'}" data-e="again">${won?'Nochmal':'Nochmal versuchen'}</button><button class="btn" data-e="camp">Zum Lager</button></div>`;
  $('end').hidden=false;}
$('endbox').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;sfx('ui');const a=t.dataset.e;
  if(a==='next')startRun(run.d+1);else if(a==='again')startRun(run.d);else{$('end').hidden=true;state='menu';run=null;refresh();renderMenu();$('menu').hidden=false;}});
