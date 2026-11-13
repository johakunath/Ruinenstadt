// Ground loot: collection, legible rarity cues and explicit confirmation before losing valuables.
const importantDrop=d=>!d.taken&&!!d.item&&(d.item.r>=3||!!d.item.set);
const dropGlowRadius=d=>30+Math.sin(d.t*5)*3;
const dropNameVisible=d=>!!d.item&&!d.taken&&!d.h&&(d.item.r>=1||d.item.set||Math.hypot(d.x-P.x,d.y-P.y)<360);
let lootExitPending=null;
function resetLootExit(){lootExitPending=null;$('lootwarn').hidden=true;if(run){run.lootGuide=false;run.lootExitHold=false;}}
function lootGuideTarget(){if(!run||!run.lootGuide)return null;let target=null,dist=Infinity;for(const d of drops)if(importantDrop(d)){const n=Math.hypot(d.x-P.x,d.y-P.y);if(n<dist){target=d;dist=n;}}return target;}
function warnLootExit(kind){if(!drops.some(importantDrop))return false;if(lootExitPending&&lootExitPending.run===run)return true;lootExitPending={run,kind};run.lootGuide=true;state='lootwarn';clearInput();for(const id of ['optv','inv','perk','trade'])$(id).hidden=true;$('lootwarn').hidden=false;$('lootfind').focus();return true;}
function finishLootExit(leave){const pending=lootExitPending;lootExitPending=null;$('lootwarn').hidden=true;if(!pending||pending.run!==run)return;state='play';clearInput();last=performance.now();if(leave){pending.kind==='tunnel'?tunWin(true):win(true);return;}run.lootExitHold=true;run.quitArm=false;if(run.tun&&!run.exit)run.exit={x:GEN.x,y:GEN.y,r:55};}
$('lootwarn').addEventListener('click',e=>{const b=e.target.closest('[data-lootexit]');if(b)finishLootExit(b.dataset.lootexit==='leave');});
addEventListener('keydown',e=>{if(state==='lootwarn'&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finishLootExit(false);}},{capture:true});
function updateDrops(dt){
  const mr=150*pk('magnet'),pr=36*(1+.65*pk('magnet'));
  for(const d of drops){d.t+=dt;if(d.vh===undefined){d.vh=R(150,210);d.h=0;const a=R(0,6.28),s=R(30,80);d.vx=Math.cos(a)*s;d.vy=Math.sin(a)*s;if(d.item&&d.item.r>=3){goldT=.6;sfx('legend');banner('Legendär!');}}
    if(d.vh!==null){d.h+=d.vh*dt;d.vh-=620*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(inWall(d.x,d.y,4)){d.x-=d.vx*dt;d.y-=d.vy*dt;d.vx=d.vy=0;}if(d.h<=0){d.h=0;d.vh=null;if(d.item&&d.item.r>=1)sfx('coin');}continue;}
    const dx=P.x-d.x,dy=P.y-d.y,dd=Math.hypot(dx,dy),full=!!d.item&&S.bag.length>=BAG;// v0.65: full bag = items stay on the ground
    if(full){if(dd<pr+14&&bagFullT<=0){{bagFullT=6;toast('<span style="color:#c23a2e">Rucksack voll</span> · Beute bleibt liegen');}}continue;}
    if(dd>1&&(run.cleared||dd<mr)){const sp=run.cleared?520:420;d.x+=dx/dd*Math.min(dd,sp*dt);d.y+=dy/dd*Math.min(dd,sp*dt);}
    if(dd<pr){d.taken=true;if(d.mat){S.mat[d.mat]=(S.mat[d.mat]||0)+1;nums.push({x:P.x,y:P.y-46,t:'+1 '+MATS[d.mat][0],col:MATS[d.mat][1],life:.9,pu:1});sfx('coin');}else if(d.zut){S.mat[d.zut]=(S.mat[d.zut]||0)+1;nums.push({x:P.x,y:P.y-46,t:'+1 '+ZUT[d.zut][0],col:ZUT[d.zut][1],life:.9,pu:1});sfx('coin');}else if(d.food){P.hp=Math.min(ST.maxHp,P.hp+ST.maxHp*.25);P.fed=30;toast(img('doener',26,'mico')+'Döner · <span style="color:var(--good)">satt: +10% Schaden für 30 Sekunden</span>');sfx('heal');}else if(d.heal){const h=Math.round(ST.maxHp*.3);P.hp=Math.min(ST.maxHp,P.hp+h);nums.push({x:P.x,y:P.y-40,t:'+'+h,col:'#8fd16a',life:.9,pu:1});sfx('heal');}else addToBag(d.item);}}
  bagFullT-=dt;drops=drops.filter(d=>!d.taken);
}
