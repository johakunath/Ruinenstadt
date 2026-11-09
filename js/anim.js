/* ================= anim: generic enemy animation driver (v0.62) =================
   One driver for every enemy type, painted or canvas-drawn (pipeline/contract.md, "Enemy animation driver").
   Frames: assets/enemies/<type>-<pose>.webp in the manifest. Only <type>-idle is required, missing poses fall back (POSEFB).
   Poses: idle, walk-a..d (EANI[type].walk frames at EANI[type].fps), attack-a (wind-up), attack-b (strike), hit.
   Code-side life (enemyLife) works without any frame: breathing, walk bob, anticipation squash, strike stretch and lunge, hit squash, spawn pop. */
const EANI={_:{fps:6,walk:2}};// per-type overrides, e.g. rat:{fps:10}, brute:{fps:4,life:.6} (life scales squash and stretch)
const POSEFB={'attack-b':['attack-a','idle'],'attack-a':['idle'],'walk-a':['idle'],'walk-b':['walk-a','idle'],'walk-c':['walk-a','idle'],'walk-d':['walk-b','walk-a','idle'],hit:['idle'],idle:[]};
const eNear=e=>Math.hypot(P.x-e.x,P.y-e.y)<e.r+P.r+14,eWind=e=>e.tw>0?1-e.tw/e.twm:e.ch>0?1-e.ch/.6:eNear(e)&&e.hcd<.16?Math.min(1,1-e.hcd/.16):0;// 0..1 progress of a wind-up (telegraph, charge, melee about to land)
function enemyPose(e){const A=EANI[e.type]||EANI._;return e.flash>0||e.stun>0?'hit':e.atk>0?(e.atk>.1?'attack-b':'attack-a'):eWind(e)>0?'attack-a':(e.mv||0)>8?'walk-'+'abcd'[Math.floor(e.t*(A.fps||6))%(A.walk||2)]:'idle';}
function enemySprite(e){const b='enemies/'+e.type+'-';if(!SPRITES[b+'idle']||e.type==='boss'||(D.gdr&&e.type==='ghoul'))return null;const p=enemyPose(e);let key=b+p,i=spr(key);if(!i)for(const q of POSEFB[p]){key=b+q;if((i=spr(key)))break;}return i?{i,m:SPRITES[key],key,H:SPRITES[b+'idle'].anchor[1]/SPRITES[b+'idle'].units}:null;}
const EFLASH={};
function drawEnemySprite(g,e,C){const m=g.m,s=e.r/10;ctx.save();ctx.scale(s,s);let i=g.i;if(e.flash>0){i=EFLASH[g.key];if(!i){i=EFLASH[g.key]=cnv(m.w,m.h);const c=i.getContext('2d');c.drawImage(g.i,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#ead9c0';c.fillRect(0,0,m.w,m.h);}}
  ctx.drawImage(i,-m.anchor[0]/m.units,-m.anchor[1]/m.units,m.w/m.units,m.h/m.units);
  if(D.cyber&&e.type==='ghoul'){ctx.strokeStyle=C('#d6409a');ctx.lineWidth=1.1;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(1,-26);ctx.quadraticCurveTo(-10-k*2,-30+k*3,-8-k*2,-15+k*2);ctx.stroke();}ctx.fillStyle=C('#ff4fa3');ctx.fillRect(2,-24,2,2);}ctx.restore();return g.H*s;}
// squash/stretch around the feet: returns [sx, sy, lean (radians, + = away from the player), ox (px towards the player), oy]
function enemyLife(e,fl){const k=(EANI[e.type]||EANI._).life||1;let sx=1,sy=1,ln=0,ox=0,oy=0;
  if(e.t<.22){const q=e.t/.22,b=1+2.2*Math.pow(q-1,3)+1.2*Math.pow(q-1,2);sx*=b;sy*=b;}// spawn pop (ease out back)
  if(e.flash>0){const q=Math.min(1,e.flash/.1)*k;sx+=.16*q;sy-=.16*q;ln+=.14*q;ox-=2.5*q;}
  else if(e.stun>0)ln+=.07*Math.sin(e.t*14);
  else if(e.atk>0){const q=Math.min(1,e.atk/.25)*k;sx-=.08*q;sy+=.13*q;ln-=.12*q;ox+=5*q;}
  else{const w=eWind(e)*k;if(w>0){sx+=.1*w;sy-=.13*w;ln+=.1*w;ox-=2*w;}else if((e.mv||0)>8){const b=Math.sin(e.t*12+e.r);sy+=.035*b;sx-=.025*b;oy-=Math.abs(b)*.8;}else{const b=Math.sin(e.t*2.6+e.r);sy+=.022*b;sx-=.012*b;}}
  return[sx,sy,-ln*fl,ox*fl,oy];}
