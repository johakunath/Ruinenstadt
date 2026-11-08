/* ================= save (local + cloud) ================= */
const START_W=()=>({id:1,slot:'w',kind:'blade',base:'latte',name:'Holzlatte',r:0,val:5,ilvl:0});
let S;
function defSave(){return{w20:1,d7:1,d8:1,u50:1,ln:[],scrap:0,upg:{dmg:0,hp:0,dash:0,luck:0},unlocked:1,best:[0,0,0,0,0,0,0],cons:{verband:1,molotow:1},threat:0,tmax:0,music:true,camp:{},rec:{kills:0,legs:0,runs:0,wins:0,time:0,chests:0,bosses:0},ach:{},tips:{},eq:{w:START_W(),h:null,a:null,g:null,f:null,t:null,r:null,i:null},bag:[],stash:[],mast:{blade:0,hammer:0,sling:0,spear:0},jobs:[],mute:false,eco:false,dist:0,diff:1,t:0,mat:{stoff:0,metall:0,chemie:0,kabel:0},mods:{},surv:{},eb:[],tlog:[]};}
function fix(s){const u5=!s.u50,w10=!s.w20,nk=!s.d7,n8=!s.d8;s=Object.assign(defSave(),s);if(!s.eq||!s.eq.w)s.eq={w:START_W(),a:s.eq&&s.eq.a||null,t:s.eq&&s.eq.t||null};if(s.bag.length>BAG)s.bag.length=BAG;if(!Array.isArray(s.stash))s.stash=[];while(s.best.length<DIST.length)s.best.push(0);if(!s.cons)s.cons={verband:1,molotow:1};if(!s.rec)s.rec={kills:0,legs:0,runs:0,wins:0,time:0};if(s.tmax==null){s.tmax=0;s.threat=0;}if(s.music==null)s.music=true;if(!s.camp)s.camp={};if(s.rec.chests==null){s.rec.chests=0;s.rec.bosses=0;}if(!s.ach)s.ach={};if(!s.tips)s.tips={};if(!s.mast)s.mast={blade:0,hammer:0,sling:0};if(!Array.isArray(s.jobs))s.jobs=[];if(!s.mat)s.mat={stoff:0,metall:0,chemie:0,kabel:0};if(!s.mods)s.mods={};if(!s.surv)s.surv={};if(!Array.isArray(s.eb))s.eb=[];if(w10){s.best=s.best.map(b=>b*2);s.eb=s.eb.map(b=>b*2);for(const j of s.jobs)if(j.k==='wave'){j.t*=2;j.p*=2;}}/* v0.45: 20 waves, old records count double *//* v0.47: Neukölln (old index 4) removed, later districts move down one */if(nk){const cut=a=>{if(Array.isArray(a)&&a.length>4)a.splice(4,1);};cut(s.best);cut(s.eb);if(s.unlocked>5)s.unlocked--;if(s.dist>4)s.dist--;
    if(s.lb){const n={};for(const k in s.lb){const i=+k;if(i<4)n[i]=1;else if(i>4)n[i-1]=1;}s.lb=n;}for(const t of s.tlog||[]){if(t.d===4){t.d=-1;t.dn='Neukölln';}else if(t.d>4)t.d--;}s.d7=1;}
  /* v0.49: Prenzlauer Berg (old index 4) removed, Alexanderplatz inserted at 2: old 2,3 move to 3,4 */if(n8){const f=i=>i<2?i:i===2?3:i===3?4:i===4?-1:i,mv=a=>Array.isArray(a)?[a[0]||0,a[1]||0,0,a[2]||0,a[3]||0,a[5]||0,a[6]||0]:a;s.best=mv(s.best);s.eb=mv(s.eb);
    if(s.unlocked===3)s.unlocked=4;else if(s.unlocked===4)s.unlocked=5;s.dist=s.dist===4?4:Math.max(0,f(s.dist));
    if(s.lb){const n={};for(const k in s.lb){const i=f(+k);if(i>=0)n[i]=1;}s.lb=n;}for(const t of s.tlog||[]){if(t.d==null||t.d<0)continue;const i=f(t.d);if(i<0){t.d=-1;t.dn='Prenzlauer Berg';}else t.d=i;}s.d8=1;}
  /* v0.50: districts open through U-Bahn tunnels (S.ln[k]: line k to k+1 cleared). Lines to districts already open count as cleared */if(u5){s.ln=[];for(let k=0;k<s.unlocked-1;k++)s.ln[k]=1;s.u50=1;}if(!Array.isArray(s.ln))s.ln=[];
  s.unlocked=Math.min(s.unlocked,DIST.length);for(const k of SLOTS)if(!(k in s.eq))s.eq[k]=null;return s;}
function load(){S=null;try{const s=JSON.parse(localStorage.getItem('rs2'));if(s&&s.upg&&s.eq)S=fix(s);}catch(e){}if(!S)S=defSave();}
const cloud={ref:null,state:'off',busy:false,dirty:false,timer:0};
function save(){checkAch();S.t=Date.now();try{localStorage.setItem('rs2',JSON.stringify(S));}catch(e){}cloudQueue();}
function cloudQueue(){if(!cloud.ref||cloud.state==='err')return;cloud.dirty=true;clearTimeout(cloud.timer);cloud.timer=setTimeout(cloudPush,3000);}
async function cloudPush(retry){
  if(!cloud.ref||!cloud.dirty)return;if(cloud.busy){cloud.timer=setTimeout(cloudPush,1500);return;}
  cloud.busy=true;cloud.dirty=false;
  try{await cloud.ref.set({s:JSON.stringify(S),t:S.t,v:4});cloud.state='on';}
  catch(e){const c=e&&e.code;if((c==='unavailable'||c==='resource_exhausted')&&!retry){cloud.busy=false;cloud.dirty=true;setTimeout(()=>cloudPush(true),2000+Math.random()*2000);return;}cloud.state='err';}
  cloud.busy=false;if(cloud.dirty)cloud.timer=setTimeout(cloudPush,3000);if(state==='menu')renderMenu();}
async function initCloud(){
  const C=window.claude;if(!C||!C.use)return;
  try{const[db,user]=await Promise.all([C.use('db'),C.use('user')]);if(!db||!user)return;const id=await user.id();if(!id)return;
    cloud.ref=db.doc('data/users/'+id+'/save');cloud.state='sync';if(state==='menu')renderMenu();
    const slow=setTimeout(()=>{if(cloud.state==='sync'){cloud.state='slow';if(state==='menu')renderMenu();}},10000);
    const snap=await cloud.ref.get();clearTimeout(slow);
    const rd=snap.exists?snap.data():null;let rs=null;try{rs=rd&&rd.s?JSON.parse(rd.s):null;}catch(e){}
    if(rs&&(rs.t||0)>(S.t||0)&&state==='menu'){S=fix(rs);fillJobs();try{localStorage.setItem('rs2',JSON.stringify(S));}catch(e){}resize();S.dist=Math.min(S.dist,S.unlocked-1);buildWorld(DIST[S.dist]);ST=stats();P.hp=ST.maxHp;toast('Spielstand aus der Cloud geladen');}
    else if(S.t&&(!rs||(rs.t||0)<S.t)){cloud.dirty=true;await cloudPush();}
    cloud.state=cloud.state==='err'?'err':'on';if(state==='menu')renderMenu();
  }catch(e){cloud.state=cloud.ref?'err':'off';if(state==='menu')renderMenu();}}
S=defSave();// placeholder until data.js has run; the real load() runs in main.js because fix() needs DIST and SLOTS from data.js
/* save code: copy and paste the save as text, works without any backend */
const b64e=t=>btoa(String.fromCharCode(...new TextEncoder().encode(t))),b64d=t=>new TextDecoder().decode(Uint8Array.from(atob(t),c=>c.charCodeAt(0)));
function applySave(rs){S=fix(rs);fillJobs();save();resize();S.dist=Math.min(S.dist,S.unlocked-1);buildWorld(DIST[S.dist]);ST=stats();P.hp=ST.maxHp;}
// new game: progress back to zero, options (sound, difficulty, input, display) and run telemetry stay. Two confirms because it cannot be undone
function newGame(){if(!confirm('Neues Spiel starten? Fortschritt, Ausrüstung, Lager und Schrott werden gelöscht. Tipp: vorher „Spielstand kopieren“.'))return;if(!confirm('Wirklich alles löschen?'))return;
  const keep={};for(const k of ['mute','music','eco','auto','hap','fs','diff','tips','tlog'])if(S[k]!=null)keep[k]=S[k];S=fix(Object.assign(defSave(),keep));fillJobs();save();resize();buildWorld(DIST[0]);ST=stats();P.hp=ST.maxHp;menuOpt=false;renderMenu();toast('Neues Spiel gestartet');}
async function exportSave(){save();const code='RS1:'+b64e(JSON.stringify(S));
  try{await navigator.clipboard.writeText(code);toast('Spielstand-Code kopiert');}catch(e){prompt('Spielstand-Code kopieren:',code);}}
function importSave(){const code=(prompt('Spielstand-Code einfügen. Der aktuelle Spielstand wird ersetzt.')||'').trim();if(!code)return;
  let rs=null;try{rs=JSON.parse(b64d(code.replace(/^RS1:/,'')));}catch(e){}
  // dry run on a copy: only replace the current save if the game can compute stats with it
  let ok=false;const old=S;if(rs&&rs.upg&&rs.eq)try{S=fix(JSON.parse(JSON.stringify(rs)));ok=!!KIND[S.eq.w.kind]&&isFinite(power(stats()));}catch(e){}S=old;
  if(!ok){toast('Ungültiger Code');return;}applySave(rs);renderMenu();toast('Spielstand geladen');}
