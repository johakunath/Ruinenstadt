/* ================= input ================= */
const keys={};let atkHeld=false,dashReq=false,skillReq=false;const joy={id:null,ox:0,oy:0,x:0,y:0};let rightId=null;
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space'){atkHeld=true;e.preventDefault();}if(e.code==='ShiftLeft'||e.code==='ShiftRight')dashReq=true;if(e.code==='KeyE'){if(manA!=null)aimA=manA;skillReq=true;}if(state==='play'&&!e.repeat){if(e.code==='KeyQ'||e.code==='Digit1')useCons('verband');if(e.code==='KeyF'||e.code==='Digit2')useCons('molotow',manTgt());}
  if(e.code==='Escape'&&!$('optv').hidden){closeOpts();return;}
  if(e.code==='Escape'||e.code==='KeyP'){if(state==='play')pauseGame();else if(state==='paused')resume();else if(state==='base')baseMenu('bag');else if(state==='baseinv')$('invbox').querySelector('[data-a=close]').click();}
  // v0.57 menu keys: Tab or I inventory, M map, J jobs, B blessings, K Kodex. The same key again closes
  const KT={Tab:'bag',KeyI:'bag',KeyM:'map',KeyJ:'jobs',KeyB:'segen',KeyK:'kodex'}[e.code];if(KT&&!$('optv').hidden){e.preventDefault();return;}// options window open: menu keys do nothing
  if(KT){e.preventDefault();
    if(state==='play')pauseGame(KT);else if(state==='paused'){if(invTab===KT)resume();else{invTab=KT;renderInv();}}
    else if(state==='base'&&KT!=='map'&&KT!=='segen')baseMenu(KT==='kodex'?'kodex':KT);else if(state==='baseinv'){if(invTab===KT)$('invbox').querySelector('[data-a=close]').click();else{invTab=KT;renderInv();}}}});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Space')atkHeld=false;});
cv.addEventListener('pointerdown',e=>{if(state!=='play'&&state!=='base')return;
  if(e.pointerType==='mouse'){mouse.on=true;mouse.x=e.clientX;mouse.y=e.clientY;document.body.classList.add('mouse');if(e.button===2)dashReq=true;else if(rightId===null){rightId=e.pointerId;atkHeld=true;}try{cv.setPointerCapture(e.pointerId);}catch(_){}return;}
  if(mouse.on){mouse.on=false;document.body.classList.remove('mouse');}
  if(e.clientX<SW*.55&&joy.id===null){joy.id=e.pointerId;joy.ox=e.clientX;joy.oy=e.clientY;joy.x=joy.y=0;}
  else if(rightId===null){rightId=e.pointerId;atkHeld=true;$('atk').classList.add('on');}try{cv.setPointerCapture(e.pointerId);}catch(_){}});
cv.addEventListener('pointermove',e=>{if(e.pointerId===joy.id){let dx=e.clientX-joy.ox,dy=e.clientY-joy.oy;const d=Math.hypot(dx,dy),m=JR;if(d>m){dx*=m/d;dy*=m/d;}joy.x=dx/m;joy.y=dy/m;}});
const up=e=>{if(e.pointerId===joy.id){joy.id=null;joy.x=joy.y=0;}if(e.pointerId===rightId){rightId=null;atkHeld=false;$('atk').classList.remove('on');}};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
const atkB=$('atk');atkB.addEventListener('pointerdown',e=>{e.preventDefault();atkHeld=true;atkB.classList.add('on');try{atkB.setPointerCapture(e.pointerId);}catch(_){}});
['pointerup','pointercancel'].forEach(n=>atkB.addEventListener(n,()=>{atkHeld=false;atkB.classList.remove('on');}));
$('dash').addEventListener('pointerdown',e=>{e.preventDefault();dashReq=true;});
/* drag-aim: drag off the skill or Molotov button to aim, tap fires at the nearest enemy */
const aim={id:null,k:null,ox:0,oy:0,dx:0,dy:0},AIMD=22;let aimA=null,aimP=null;
const aimOn=()=>aim.id!==null&&Math.hypot(aim.dx,aim.dy)>AIMD;
function aimStart(k,e){e.preventDefault();if(state!=='play')return;aim.id=e.pointerId;aim.k=k;aim.ox=e.clientX;aim.oy=e.clientY;aim.dx=aim.dy=0;try{e.target.setPointerCapture(e.pointerId);}catch(_){}}
function aimMove(e){if(e.pointerId!==aim.id)return;aim.dx=e.clientX-aim.ox;aim.dy=e.clientY-aim.oy;}
function aimEnd(e){if(e.pointerId!==aim.id)return;const on=aimOn(),a=wAng(Math.atan2(aim.dy,aim.dx)),k=aim.k;aim.id=null;if(e.type==='pointercancel')return;
  if(k==='skill'){aimA=on?a:null;skillReq=true;}else useCons('molotow',on?aimTgt(a):null);}
const aimTgt=a=>{const d=clamp(Math.hypot(aim.dx,aim.dy)*2.4,60,320);return{x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d};};
for(const[id,k]of[['skill','skill'],['c2','mol']]){const b=$(id);b.addEventListener('pointerdown',e=>aimStart(k,e));b.addEventListener('pointermove',aimMove);b.addEventListener('pointerup',aimEnd);b.addEventListener('pointercancel',aimEnd);}
/* mouse and keyboard (v0.54): WASD or arrows move, the cursor aims (manA), left button attacks, right button dashes, Space attacks, Shift dashes, E skill towards the cursor,
   Q or 1 Verband, F or 2 Molotov at the cursor, Esc or P pause. body.mouse hides the touch buttons until the next touch */
const mouse={on:false,x:0,y:0};let manA=null;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mouse.x=e.clientX;mouse.y=e.clientY;}},{passive:true});cv.addEventListener('contextmenu',e=>e.preventDefault());
const mouseW=()=>{const q=s2w(mouse.x/Z-OX,mouse.y/Z-OY);return{x:q[0],y:q[1]};};
const manTgt=()=>{if(manA==null)return null;if(mouse.on){const m=mouseW(),d=clamp(Math.hypot(m.x-P.x,m.y-P.y),60,320);return{x:P.x+Math.cos(manA)*d,y:P.y+Math.sin(manA)*d};}return{x:P.x+Math.cos(manA)*220,y:P.y+Math.sin(manA)*220};};
/* gamepad (standard mapping, gameplay only, menus stay touch or mouse). v0.57 Hades-style: A sprint, X attack (hold), Y skill, B Molotov (throw), RB Verband, RT attack too, LB skill too,
   left stick moves, right stick aims, Start pause, View (Back) map */
const pad={on:false,mx:0,my:0,aim:null,atk:false};let padPrev=[];
function padPoll(){const gs=navigator.getGamepads?navigator.getGamepads():[],gp=[...gs].find(g=>g&&g.connected);pad.on=!!gp;if(!gp){pad.mx=pad.my=0;pad.aim=null;pad.atk=false;return;}
  const dz=v=>Math.abs(v||0)<.2?0:v,b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed),pr=i=>b(i)&&!padPrev[i];pad.mx=dz(gp.axes[0]);pad.my=dz(gp.axes[1]);
  const rx=dz(gp.axes[2]),ry=dz(gp.axes[3]);pad.aim=Math.hypot(rx,ry)>.35?wAng(Math.atan2(ry,rx)):null;pad.atk=b(2)||b(7);
  if(pad.mx||pad.my||pad.atk){mouse.on=false;document.body.classList.add('mouse');}
  if(pr(9)){if(state==='play')pauseGame();else if(state==='paused')resume();}if(pr(8)){if(state==='play')pauseGame('map');else if(state==='paused')resume();}
  if(state==='play'){if(pr(0))dashReq=true;if(pr(3)||pr(4)){if(manA!=null)aimA=manA;skillReq=true;}if(pr(5))useCons('verband');if(pr(1))useCons('molotow',manTgt());}
  padPrev=gp.buttons.map(x=>x.pressed);}
// manual aim this frame: cursor (mouse) or right stick (pad); null = auto-aim
function manAim(){manA=pad.aim!=null?pad.aim:mouse.on&&state==='play'?(()=>{const m=mouseW();return Math.atan2(m.y-P.y,m.x-P.x);})():null;}
/* auto-attack: on by default for touch, swings whenever an enemy is in reach */
const autoAtk=()=>S.auto==null?matchMedia('(pointer:coarse)').matches:!!S.auto;
/* haptics: S.hap 0 off, 1 light (default), 2 strong; short pulses only */
let hapT=0;function buzz(ms){const h=S.hap==null?1:S.hap;if(!h||!navigator.vibrate)return;const n=performance.now();if(n<hapT)return;hapT=n+120;try{navigator.vibrate(Math.round(ms*(h===2?2:1)));}catch(_){}}
$('pause').addEventListener('click',()=>{if(state==='play')pauseGame();else if(state==='base')baseMenu('bag');});
document.addEventListener('visibilitychange',()=>{try{if(AC){if(document.hidden)AC.suspend();else AC.resume();}}catch(e){}if(document.hidden){if(state==='play')pauseGame();if(cloud.dirty){clearTimeout(cloud.timer);cloudPush();}}});
function clearInput(){joy.id=null;joy.x=joy.y=0;rightId=null;aim.id=null;atkHeld=false;dashReq=false;skillReq=false;atkB.classList.remove('on');}
function pauseGame(t){state='paused';clearInput();invTab=t||'bag';openInv('run');}
function resume(){$('inv').hidden=true;$('toasts').classList.remove('low');state='play';last=performance.now();updateHot();}
/* tablet comfort: fullscreen and keep the screen on during expeditions */
let wake=null;function immerse(){try{if(S.fs!==0&&!document.fullscreenElement&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(()=>{});}catch(e){}
  try{if(navigator.wakeLock&&!wake)navigator.wakeLock.request('screen').then(l=>{wake=l;l.addEventListener('release',()=>wake=null);}).catch(()=>{});}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&run)immerse();});
/* device back button (Android): closes menus and pauses instead of leaving. In camp it takes three presses within 2 s to leave the app.
   Browsers ignore history entries added without a tap, so the guard entry is re-armed on every tap. */
let backN=0,backT=0;const armBack=()=>{try{if(!(history.state&&history.state.rs))history.pushState({rs:1},'');}catch(_){}};
addEventListener('pointerdown',armBack,true);
addEventListener('popstate',()=>{
  if(!$('optv').hidden){closeOpts();return armBack();}
  if(state==='play'){pauseGame();return armBack();}
  if(state==='base'){leaveBase();return armBack();}
  if(!$('inv').hidden){const b=document.querySelector('#inv [data-a=close]');if(b)b.click();return armBack();}
  if(state!=='menu'||!$('trade').hidden||!$('perk').hidden||!$('end').hidden)return armBack();
  const n=performance.now();backN=n-backT<2000?backN+1:1;backT=n;
  if(backN<3){toast(`Noch ${3-backN}× Zurück zum Verlassen`);if(backN<2)armBack();else setTimeout(()=>{if(backN<3&&performance.now()-backT>=2000){backN=0;armBack();}},2100);}});
