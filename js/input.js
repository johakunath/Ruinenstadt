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
$('skill').addEventListener('pointerdown',e=>{e.preventDefault();skillReq=true;});
$('pause').addEventListener('click',()=>{if(state==='play')pauseGame();});
document.addEventListener('visibilitychange',()=>{try{if(AC){if(document.hidden)AC.suspend();else AC.resume();}}catch(e){}if(document.hidden){if(state==='play')pauseGame();if(cloud.dirty){clearTimeout(cloud.timer);cloudPush();}}});
function clearInput(){joy.id=null;joy.x=joy.y=0;rightId=null;atkHeld=false;dashReq=false;skillReq=false;atkB.classList.remove('on');}
function pauseGame(){state='paused';clearInput();openInv('run');}
function resume(){$('inv').hidden=true;state='play';last=performance.now();updateHot();}
/* tablet comfort: fullscreen and keep the screen on during expeditions */
let wake=null;function immerse(){try{if(S.fs!==0&&!document.fullscreenElement&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(()=>{});}catch(e){}
  try{if(navigator.wakeLock&&!wake)navigator.wakeLock.request('screen').then(l=>{wake=l;l.addEventListener('release',()=>wake=null);}).catch(()=>{});}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&run)immerse();});
