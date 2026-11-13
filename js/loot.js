// Ground loot: collection, legible rarity cues and explicit confirmation before losing valuables.
const importantDrop=d=>!d.taken&&!!d.item&&(d.item.r>=2||!!d.item.set);
const dropGlowRadius=d=>48+Math.sin(d.t*5)*4;
const dropNameVisible=d=>!!d.item&&!d.taken&&!d.h&&(d.item.r>=1||d.item.set||Math.hypot(d.x-P.x,d.y-P.y)<360);
let lootExitPending=null;
function resetLootExit(){lootExitPending=null;$('lootwarn').hidden=true;if(run){run.lootGuide=false;run.lootExitHold=false;}}
function lootGuideTarget(){if(!run||!run.lootGuide)return null;let target=null,dist=Infinity;for(const d of drops)if(importantDrop(d)){const n=Math.hypot(d.x-P.x,d.y-P.y);if(n<dist){target=d;dist=n;}}return target;}
function warnLootExit(kind){if(!drops.some(importantDrop))return false;if(lootExitPending&&lootExitPending.run===run)return true;lootExitPending={run,kind};run.lootGuide=true;state='lootwarn';clearInput();for(const id of ['optv','inv','perk','trade'])$(id).hidden=true;$('lootwarn').hidden=false;$('lootfind').focus();return true;}
function finishLootExit(leave){const pending=lootExitPending;lootExitPending=null;$('lootwarn').hidden=true;if(!pending||pending.run!==run)return;state='play';clearInput();last=performance.now();if(leave){pending.kind==='tunnel'?tunWin(true):win(true);return;}run.lootExitHold=true;run.quitArm=false;if(run.tun&&!run.exit)run.exit={x:GEN.x,y:GEN.y,r:55};}
$('lootwarn').addEventListener('click',e=>{const b=e.target.closest('[data-lootexit]');if(b)finishLootExit(b.dataset.lootexit==='leave');});
addEventListener('keydown',e=>{if(state==='lootwarn'&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finishLootExit(false);}},{capture:true});
function updateDrops(dt){
  const pr=36*(1+.65*pk('magnet'));
  for(const d of drops){d.t+=dt;if(d.vh===undefined){d.vh=R(150,210);d.h=0;const a=R(0,6.28),s=R(30,80);d.vx=Math.cos(a)*s;d.vy=Math.sin(a)*s;if(d.item&&d.item.r>=3){goldT=.6;sfx('legend');banner('Legendär!');}}
    if(d.vh!==null){d.h+=d.vh*dt;d.vh-=620*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(inWall(d.x,d.y,4)){d.x-=d.vx*dt;d.y-=d.vy*dt;d.vx=d.vy=0;}if(d.h<=0){d.h=0;d.vh=null;if(d.item&&d.item.r>=1)sfx('coin');}continue;}
    if(d.heal&&P.hp>=ST.maxHp)continue;
    const dx=P.x-d.x,dy=P.y-d.y,dd=Math.hypot(dx,dy),full=!!d.item&&S.bag.length>=BAG;// v0.65: full bag = items stay on the ground
    if(full){if(dd<pr+14&&bagFullT<=0){{bagFullT=6;toast('<span style="color:#c23a2e">Rucksack voll</span> · Beute bleibt liegen');}}continue;}
    if(dd<pr){d.taken=true;if(d.mat){S.mat[d.mat]=(S.mat[d.mat]||0)+1;nums.push({x:P.x,y:P.y-46,t:'+1 '+MATS[d.mat][0],col:MATS[d.mat][1],life:.9,pu:1});sfx('coin');}else if(d.zut){S.mat[d.zut]=(S.mat[d.zut]||0)+1;nums.push({x:P.x,y:P.y-46,t:'+1 '+ZUT[d.zut][0],col:ZUT[d.zut][1],life:.9,pu:1});sfx('coin');}else if(d.food){healDrop(.3);P.fed=30;toast(img('doener',26,'mico')+'Satt · +10% Schaden · 30 s');sfx('heal');}else if(d.heal){healDrop(.4);sfx('heal');}else addToBag(d.item);}}
  bagFullT-=dt;drops=drops.filter(d=>!d.taken);
}

function healDrop(fraction){const h=Math.min(Math.max(0,ST.maxHp-P.hp),Math.round(ST.maxHp*fraction));P.hp=Math.min(ST.maxHp,P.hp+h);if(h>0)nums.push({x:P.x,y:P.y-40,t:'+'+h,col:'#8fd16a',life:.9,pu:1});}
function dropRecovery(x,y,source){const food=source==='box'?.14:.03*(hasL('spaeti')?2:1)*(hasS('koechin')?2:1);if(Math.random()<food)drops.push({x:x+10,y,food:true,t:0});if(Math.random()<(source==='box'?.2:.1))drops.push({x,y:y+8,heal:true,t:0});}
function drawLootGlow(d,bob,c,hh,gs){ctx.drawImage(glow(c),d.x-gs,d.y+bob-gs-hh,gs*2,gs*2);if(d.item){ctx.strokeStyle=c+'aa';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(d.x,d.y+bob-hh+6,16,5,0,0,7);ctx.stroke();}}
