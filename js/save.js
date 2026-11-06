/* ================= save (local + cloud) ================= */
const START_W=()=>({id:1,slot:'w',kind:'blade',base:'latte',name:'Holzlatte',r:0,val:3,ilvl:0});
let S;
function defSave(){return{scrap:0,upg:{dmg:0,hp:0,dash:0,luck:0},unlocked:1,best:[0,0,0,0,0,0,0,0],cons:{verband:1,molotow:1},threat:0,tmax:0,music:true,camp:{},rec:{kills:0,legs:0,runs:0,wins:0,time:0,chests:0,bosses:0},ach:{},tips:{},eq:{w:START_W(),a:null,t:null},bag:[],stash:[],mast:{blade:0,hammer:0,sling:0},jobs:[],mute:false,eco:false,dist:0,diff:1,t:0,mat:{stoff:0,metall:0,chemie:0,kabel:0},mods:{},surv:{}};}
function fix(s){s=Object.assign(defSave(),s);if(!s.eq||!s.eq.w)s.eq={w:START_W(),a:s.eq&&s.eq.a||null,t:s.eq&&s.eq.t||null};if(s.bag.length>BAG)s.bag.length=BAG;if(!Array.isArray(s.stash))s.stash=[];while(s.best.length<DIST.length)s.best.push(0);if(!s.cons)s.cons={verband:1,molotow:1};if(!s.rec)s.rec={kills:0,legs:0,runs:0,wins:0,time:0};if(s.tmax==null){s.tmax=0;s.threat=0;}if(s.music==null)s.music=true;if(!s.camp)s.camp={};if(s.rec.chests==null){s.rec.chests=0;s.rec.bosses=0;}if(!s.ach)s.ach={};if(!s.tips)s.tips={};if(!s.mast)s.mast={blade:0,hammer:0,sling:0};if(!Array.isArray(s.jobs))s.jobs=[];if(!s.mat)s.mat={stoff:0,metall:0,chemie:0,kabel:0};if(!s.mods)s.mods={};if(!s.surv)s.surv={};return s;}
function load(){try{const s=JSON.parse(localStorage.getItem('rs2'));if(s&&s.upg&&s.eq)S=fix(s);}catch(e){}if(!S)S=defSave();}
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
load();
/* save code: copy and paste the save as text, works without any backend */
const b64e=t=>btoa(String.fromCharCode(...new TextEncoder().encode(t))),b64d=t=>new TextDecoder().decode(Uint8Array.from(atob(t),c=>c.charCodeAt(0)));
function applySave(rs){S=fix(rs);fillJobs();save();resize();S.dist=Math.min(S.dist,S.unlocked-1);buildWorld(DIST[S.dist]);ST=stats();P.hp=ST.maxHp;}
async function exportSave(){save();const code='RS1:'+b64e(JSON.stringify(S));
  try{await navigator.clipboard.writeText(code);toast('Spielstand-Code kopiert');}catch(e){prompt('Spielstand-Code kopieren:',code);}}
function importSave(){const code=(prompt('Spielstand-Code einfügen. Der aktuelle Spielstand wird ersetzt.')||'').trim();if(!code)return;
  let rs=null;try{rs=JSON.parse(b64d(code.replace(/^RS1:/,'')));}catch(e){}
  // dry run on a copy: only replace the current save if the game can compute stats with it
  let ok=false;const old=S;if(rs&&rs.upg&&rs.eq)try{S=fix(JSON.parse(JSON.stringify(rs)));ok=!!KIND[S.eq.w.kind]&&isFinite(power(stats()));}catch(e){}S=old;
  if(!ok){toast('Ungültiger Code');return;}applySave(rs);renderMenu();toast('Spielstand geladen');}
