/* ================= input ================= */
const keys={};let atkHeld=false,dashReq=false,skillReq=false;const joy={id:null,ox:0,oy:0,x:0,y:0};let rightId=null;
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space'){atkHeld=true;e.preventDefault();}if(e.code==='ShiftLeft'||e.code==='ShiftRight')dashReq=true;if(e.code==='KeyE')skillReq=true;
  if(e.code==='Escape'||e.code==='KeyP'){if(state==='play')pauseGame();else if(state==='paused')resume();}});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Space')atkHeld=false;});
cv.addEventListener('pointerdown',e=>{if(state!=='play')return;
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
function aimEnd(e){if(e.pointerId!==aim.id)return;const on=aimOn(),a=Math.atan2(aim.dy,aim.dx),k=aim.k;aim.id=null;if(e.type==='pointercancel')return;
  if(k==='skill'){aimA=on?a:null;skillReq=true;}else useCons('molotow',on?aimTgt(a):null);}
const aimTgt=a=>{const d=clamp(Math.hypot(aim.dx,aim.dy)*2.4,60,320);return{x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d};};
for(const[id,k]of[['skill','skill'],['c2','mol']]){const b=$(id);b.addEventListener('pointerdown',e=>aimStart(k,e));b.addEventListener('pointermove',aimMove);b.addEventListener('pointerup',aimEnd);b.addEventListener('pointercancel',aimEnd);}
/* auto-attack: on by default for touch, swings whenever an enemy is in reach */
const autoAtk=()=>S.auto==null?matchMedia('(pointer:coarse)').matches:!!S.auto;
/* haptics: S.hap 0 off, 1 light (default), 2 strong; short pulses only */
let hapT=0;function buzz(ms){const h=S.hap==null?1:S.hap;if(!h||!navigator.vibrate)return;const n=performance.now();if(n<hapT)return;hapT=n+120;try{navigator.vibrate(Math.round(ms*(h===2?2:1)));}catch(_){}}
$('pause').addEventListener('click',()=>{if(state==='play')pauseGame();});
document.addEventListener('visibilitychange',()=>{try{if(AC){if(document.hidden)AC.suspend();else AC.resume();}}catch(e){}if(document.hidden){if(state==='play')pauseGame();if(cloud.dirty){clearTimeout(cloud.timer);cloudPush();}}});
function clearInput(){joy.id=null;joy.x=joy.y=0;rightId=null;aim.id=null;atkHeld=false;dashReq=false;skillReq=false;atkB.classList.remove('on');}
function pauseGame(){state='paused';clearInput();openInv('run');}
function resume(){$('inv').hidden=true;state='play';last=performance.now();updateHot();}
/* tablet comfort: fullscreen and keep the screen on during expeditions */
let wake=null;function immerse(){try{if(S.fs!==0&&!document.fullscreenElement&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(()=>{});}catch(e){}
  try{if(navigator.wakeLock&&!wake)navigator.wakeLock.request('screen').then(l=>{wake=l;l.addEventListener('release',()=>wake=null);}).catch(()=>{});}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&run)immerse();});
