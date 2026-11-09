/* ================= anim: generic enemy animation driver (v0.62) =================
   One driver for every enemy type, painted or canvas-drawn (pipeline/contract.md, "Enemy animation driver").
   Frames: assets/enemies/<type>-<pose>.webp in the manifest. Only <type>-idle is required, missing poses fall back (POSEFB).
   Poses: idle, walk-a..d (EANI[type].walk frames at EANI[type].fps), attack-a (wind-up), attack-b (strike), hit.
   Code-side life (enemyLife) works without any frame: breathing, walk bob, anticipation squash, strike stretch and lunge, hit squash, spawn pop. */
const EANI={_:{fps:6,walk:2}};// per-type overrides, e.g. rat:{fps:10}, brute:{fps:4,life:.6} (life scales squash and stretch)
const POSEFB={'attack-b':['attack-a','idle'],'attack-a':['idle'],'walk-a':['idle'],'walk-b':['walk-a','idle'],'walk-c':['walk-a','idle'],'walk-d':['walk-b','walk-a','idle'],hit:['idle'],idle:[]};
const eNear=e=>Math.hypot(P.x-e.x,P.y-e.y)<e.r+P.r+14,eWind=e=>e.tw>0?1-e.tw/e.twm:e.ch>0?1-e.ch/.6:eNear(e)&&e.hcd<.16?Math.min(1,1-e.hcd/.16):0;// 0..1 progress of a wind-up (telegraph, charge, melee about to land)
const ENEMY_ART={ghoul:{r:10,h:32},brute:{r:17,h:52},spitter:{r:11,h:24},rat:{r:6,h:6.1},crow:{r:8,h:16},shield:{r:13,h:44},bomb:{r:11,h:28},howl:{r:11,h:50},raser:{r:11,h:18},schrottkoloss:{r:34,h:83},kabel:{r:9,h:35},bass:{r:15,h:56},uhr:{r:13,h:44},wurz:{r:12,h:55},kern:{r:11,h:42},brigadeghoul:{r:10,h:36.5}};
const ENEMYPRE={},ENEMY_POSES=['idle','walk-a','walk-b','attack-a','attack-b','hit'];
for(const [k,v]of Object.entries(ENEMY_ART))EANI[k]={radius:v.r,life:.45};
function enemyPose(e){const A=EANI[enemyVariant(e)]||EANI[e.type]||EANI._;return e.flash>0||e.stun>0?'hit':e.cast>0||e.ru>0||e.dive>0||e.atk>.1?'attack-b':e.atk>0||eWind(e)>0||e.fuse>0||(e.type==='spitter'||e.type==='howl')&&e.fire<.45?'attack-a':(e.mv||0)>8?'walk-'+'abcd'[Math.floor(e.t*(A.fps||6))%(A.walk||2)]:'idle';}
function enemyVariant(e){return e.type==='boss'?(e.big?null:'schrottkoloss'):e.type==='ghoul'&&D.gdr?'brigadeghoul':e.type;}
function enemySprite(e){const variant=enemyVariant(e),b='enemies/'+variant+'-';if(!variant||!SPRITES[b+'idle'])return null;if(!ENEMYPRE[variant]){ENEMYPRE[variant]=1;for(const p of ENEMY_POSES)spr(b+p);}const p=enemyPose(e);let key=b+p,i=spr(key);if(!i)for(const q of POSEFB[p]||[]){key=b+q;if((i=spr(key)))break;}const idle=SPRITES[b+'idle'],spec=ENEMY_ART[variant]||{r:(EANI[e.type]||EANI._).radius||10,h:idle.anchor[1]/idle.units};return i?{i,m:SPRITES[key],key,variant,spec,H:spec.h}:null;}
function enemyFlip(e){return(e.ru>0||e.ch>0||e.dive>0)&&Number.isFinite(e.rdx)&&Number.isFinite(e.rdy)?(e.rdx-e.rdy<0?-1:1):(P.x-P.y<e.x-e.y?-1:1);}
const EFLASH={},GFLASH=EFLASH;
function drawEnemySprite(g,e,C){const m=g.m,s=e.r/g.spec.r;ctx.save();ctx.scale(s,s);let i=g.i,flight=e.type==='crow'?28-(e.dive>0?14:e.rest>0?16:-Math.sin(e.t*3)*4):0;
  if(flight)ctx.translate(0,-flight/(1.15*s));if(e.type==='kern'&&(e.mv||0)>8)ctx.translate(0,-Math.abs(Math.sin(e.t*9))*3);if(e.type==='bomb'&&e.fuse>0)ctx.scale(1+.08*Math.sin(e.t*40),1);
  if(e.flash>0){i=GFLASH[g.key];if(!i){i=GFLASH[g.key]=cnv(m.w,m.h);const c=i.getContext('2d');c.drawImage(g.i,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#ead9c0';c.fillRect(0,0,m.w,m.h);}}
  ctx.drawImage(i,-m.anchor[0]/m.units,-m.anchor[1]/m.units,m.w/m.units,m.h/m.units);
  if(D.cyber&&g.variant==='ghoul'){ctx.strokeStyle=C('#d6409a');ctx.lineWidth=1.1;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(1,-26);ctx.quadraticCurveTo(-10-k*2,-30+k*3,-8-k*2,-15+k*2);ctx.stroke();}ctx.fillStyle=C('#ff4fa3');ctx.fillRect(2,-24,2,2);}
  if(D.cyber&&g.variant==='brute'){ctx.strokeStyle=C('#d6409a');ctx.lineWidth=1.5;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-6+k*4,-40);ctx.quadraticCurveTo(-18+k*3,-52+Math.sin(e.t*3+k)*3,-14-k*2,-23);ctx.stroke();}}
  ctx.restore();return g.spec.h*s+flight/1.15;}
function drawEnemyShield(e,fy){if(e.type!=='shield')return false;const key='enemies/shield-panel',i=spr(key),m=SPRITES[key];if(!i||!m)return false;const fa=e.fa,sr=e.r+4,op=e.guard>0,s=e.r/13;
  let img=i;if(e.flash>0){img=GFLASH[key];if(!img){img=GFLASH[key]=cnv(m.w,m.h);const c=img.getContext('2d');c.drawImage(i,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#ead9c0';c.fillRect(0,0,m.w,m.h);}}ctx.save();ctx.translate(e.x+Math.cos(fa)*sr,fy-14+Math.sin(fa)*sr*.6+(op?6:0));ctx.transform(-Math.sin(fa)||.01,Math.cos(fa)*.6,0,op?.5:1,0,0);ctx.scale(s,s);ctx.globalAlpha*=op?.65:1;ctx.drawImage(img,-m.anchor[0]/m.units,-m.anchor[1]/m.units,m.w/m.units,m.h/m.units);ctx.restore();return true;}
// Mouth launch follows the same pose/life transform as the drawn frame; physics stays unchanged.
function enemyMuzzle(e){const g=enemySprite(e),p=g&&g.m.pivots&&g.m.pivots.mouth;if(!p)return null;const m=g.m,fl=enemyFlip(e),L=enemyLife(e,fl),s=e.r/g.spec.r*1.15,hop=e.type==='kern'&&(e.mv||0)>8?Math.abs(Math.sin(e.t*9))*3:0,x=fl*(p[0]-m.anchor[0])/m.units*s*L[0],y=((p[1]-m.anchor[1])/m.units-hop)*s*L[1],c=Math.cos(L[2]),n=Math.sin(L[2]);return{x:L[3]+c*x-n*y,y:e.r*.4+L[4]+n*x+c*y};}
// squash/stretch around the feet: returns [sx, sy, lean (radians, + = away from the player), ox (px towards the player), oy]
function enemyLife(e,fl){const k=(EANI[enemyVariant(e)]||EANI[e.type]||EANI._).life||1;let sx=1,sy=1,ln=0,ox=0,oy=0;
  if(e.t<.22){const q=e.t/.22,b=1+2.2*Math.pow(q-1,3)+1.2*Math.pow(q-1,2);sx*=b;sy*=b;}// spawn pop (ease out back)
  if(e.flash>0){const q=Math.min(1,e.flash/.1)*k;sx+=.16*q;sy-=.16*q;ln+=.14*q;ox-=2.5*q;}
  else if(e.stun>0)ln+=.07*Math.sin(e.t*14);
  else if(e.atk>0){const q=Math.min(1,e.atk/.25)*k;sx-=.08*q;sy+=.13*q;ln-=.12*q;ox+=5*q;}
  else{const w=eWind(e)*k;if(w>0){sx+=.1*w;sy-=.13*w;ln+=.1*w;ox-=2*w;}else if((e.mv||0)>8){const b=Math.sin(e.t*12+e.r);sy+=.035*b;sx-=.025*b;oy-=Math.abs(b)*.8;}else{const b=Math.sin(e.t*2.6+e.r);sy+=.022*b;sx-=.012*b;}}
  return[sx,sy,-ln*fl,ox*fl,oy];}
