/* ================= online save + telemetry (v0.76) =================
   Backend: Google Sheet with Apps Script web app (tools/sync/Code.gs, setup tools/sync/README.md). Empty SYNC_URL hides everything.
   Online save is opt-in per player with a sync code (XXXX-XXXX) that moves the save between devices; local save stays the primary copy.
   Concurrency: every push carries the server time of the last sync (os.base); the server refuses it if another device wrote since, then this device pulls (old local state goes into the backups).
   Run telemetry: every logged run (rs2hist, not bot runs) goes up once, anonymous player id S.pid, opt-out S.tlo. Never from localhost. */
const SYNC_URL='https://script.google.com/macros/s/AKfycbyUCf3slojkaYJhVemGU54EBidrXFhj2FoOANlOZQQdIxhO4YIWTW1kF9FPv3hVDXQ/exec';
const os={code:null,base:0,state:'off',busy:false,dirty:false,timer:0,pend:false};
const lsG=k=>{try{return localStorage.getItem(k);}catch(e){return null;}},lsS=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v);}catch(e){}};
const osDev=()=>/^(localhost|127\.0\.0\.1|)$/.test(location.hostname)||!!window.SIM,osFmt=c=>c?c.slice(0,4)+'-'+c.slice(4):'';
const rid=(n,a)=>{const r=crypto.getRandomValues(new Uint8Array(n));return[...r].map(x=>a[x%a.length]).join('');};
async function osCall(q){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),15000);try{const r=await fetch(SYNC_URL,{method:'POST',body:JSON.stringify(q),signal:ac.signal});if(!r.ok)throw 0;return await r.json();}finally{clearTimeout(to);}}// text/plain POST: no CORS preflight, service worker ignores non-GET
function osKeep(){lsS('rs2sync',os.code?JSON.stringify({c:os.code,b:os.base}):null);}
function osUi(st){os.state=st;if(state==='menu')renderMenu();if(!$('optv').hidden)renderOpts();}
// remote save replaces the local one (backup first), same steps as the artifact cloud pull
function osAdopt(s,t){let rs=null;try{rs=JSON.parse(s);}catch(e){}if(!rs||!rs.upg||!rs.eq)return false;adoptSave(rs,'Online');os.base=t;osKeep();return true;}
function osQueue(){if(!SYNC_URL||!os.code)return;if(os.pend&&state==='menu'&&!os.busy){osPull();return;}os.dirty=true;clearTimeout(os.timer);os.timer=setTimeout(osPush,3000);}
async function osPush(){if(!os.code||!os.dirty)return;if(os.busy){os.timer=setTimeout(osPush,1500);return;}if(os.pend)return osPull();
  const c=os.code;os.busy=true;os.dirty=false;let r=null;try{r=await osCall({a:'put',c,s:JSON.stringify(S),t:S.t,b:os.base});}catch(e){}os.busy=false;if(os.code!==c)return;// disconnected or switched meanwhile
  if(r&&r.ok){os.base=r.t;osKeep();osUi('on');}else if(r&&r.newer){os.pend=true;osPull();}
  else{os.dirty=true;os.timer=setTimeout(osPush,30000);osUi('slow');}}
// pull: adopt the remote save if another device wrote since the last sync, otherwise push local changes. Outside the menu it waits (os.pend)
async function osPull(){if(!os.code||os.busy)return;const c=os.code;os.busy=true;let r=null;try{r=await osCall({a:'get',c});}catch(e){}os.busy=false;if(os.code!==c)return;
  if(!r||!r.ok){osUi('slow');return;}
  if(r.s&&r.t!==os.base){if(state!=='menu'){os.pend=true;return;}os.pend=false;if(osAdopt(r.s,r.t))toast('Neuerer Online-Spielstand geladen · alter Stand gesichert');osUi('on');return;}
  os.pend=false;if(!r.s){os.base=0;}if(!r.s||(S.t||0)>os.base){os.dirty=true;osPush();}else osUi('on');}
function osOn(){if(!confirm('Spielstand online speichern? Du bekommst einen Code. Mit ihm spielst du auf anderen Geräten weiter.'))return;os.code=rid(8,'ABCDEFGHJKMNPQRSTUVWXYZ23456789');os.base=0;osKeep();os.state='sync';os.dirty=true;osPush();toast('Online-Code '+osFmt(os.code));}
async function osJoin(){const c=(prompt('Online-Code eingeben (z. B. ABCD-1234). Der Spielstand auf diesem Gerät wird ersetzt, eine Sicherung bleibt.')||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(!c)return;
  if(!/^[A-Z2-9]{8}$/.test(c)){toast('Ungültiger Code');return;}osUi('sync');let r=null;try{r=await osCall({a:'get',c});}catch(e){}
  if(!r||!r.ok){osUi(os.code?'on':'off');toast('Server nicht erreichbar');return;}if(!r.s){osUi(os.code?'on':'off');toast('Code unbekannt');return;}
  os.code=c;os.dirty=false;if(state!=='menu'){os.base=0;os.pend=true;osKeep();osUi('sync');return;}// a run started meanwhile: adopt on the way back to camp
  os.pend=false;if(osAdopt(r.s,r.t))toast('Online-Spielstand geladen');osUi('on');}
function osOff(){if(!confirm('Online-Speichern auf diesem Gerät beenden? Der Spielstand bleibt hier und online erhalten. Notiere den Code '+osFmt(os.code)+', um ihn wieder zu verbinden.'))return;os.code=null;os.base=0;clearTimeout(os.timer);osKeep();osUi('off');}
async function osCopy(){try{await navigator.clipboard.writeText(osFmt(os.code));toast('Code kopiert');}catch(e){prompt('Online-Code:',osFmt(os.code));}}
// telemetry: uploads every run of the history once (backfills old runs on the first start), max 10 batches per call
async function osTl(){if(!SYNC_URL||osDev()||S.tlo||os.tlBusy)return;os.tlBusy=true;
  try{const sent=new Set(lsGet('rs2tls'));for(let i=0;i<10;i++){const p=lsGet('rs2hist').filter(e=>!e.bot&&!sent.has(hkey(e))).slice(0,50);if(!p.length)break;
    const r=await osCall({a:'tl',p:S.pid,r:p});if(!r||!r.ok)break;for(const e of p)sent.add(hkey(e));lsSet('rs2tls',[...sent].slice(-1500));}}catch(e){}os.tlBusy=false;}
function initSync(){if(!S.pid){S.pid=rid(12,'abcdefghijkmnpqrstuvwxyz23456789');try{localStorage.setItem('rs2',JSON.stringify(S));}catch(e){}}if(!SYNC_URL)return;
  try{const j=JSON.parse(lsG('rs2sync'));if(j&&j.c){os.code=j.c;os.base=+j.b||0;os.state='sync';}}catch(e){}if(os.code)osPull();setTimeout(osTl,4000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(os.dirty){clearTimeout(os.timer);osPush();}}else if(os.code&&state==='menu')osPull();});}
// options rows (panels.js renderOpts)
function syncRows(row,tg){if(!SYNC_URL)return'';const st={sync:'verbindet …',on:'synchron',slow:'gerade nicht erreichbar, speichert lokal'}[os.state]||'';
  return(os.code?row('Online speichern',`Code <b>${osFmt(os.code)}</b> · ${st}. Auf einem anderen Gerät „Code eingeben“.`,`<button class="btn sm" data-o="oscp">Kopieren</button> <button class="btn sm" data-o="osoff">Trennen</button>`)
    :row('Online speichern','Spielstand online sichern und auf anderen Geräten weiterspielen.',`<button class="btn sm" data-o="oson">Aktivieren</button> <button class="btn sm" data-o="osjoin">Code eingeben</button>`))
    +row('Spielstatistik senden','Anonyme Run-Daten (Wellen, Schaden, FPS, Gerätetyp) helfen beim Balancing.',tg('tlo',!S.tlo));}
