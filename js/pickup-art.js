// Painted world pickups: retain the old geometry and behavior; glow stays dynamic.
const PICKUP_KEYS='doener bandage bottle scrap stoff metall chemie kabel fleisch gemuese gewuerz bag-common bag-magic bag-rare bag-legendary bag-set'.split(' ');
let PICKUP_ART=true;
const pickupArtReady=spriteReady.then(()=>Promise.all(PICKUP_KEYS.map(async k=>{const key='props/pickup-'+k;if(!SPRITES[key])return;try{spr(key);await SPRIMG[key].decode();}catch(e){/* Original drawing is the loading/missing fallback. */}})));
function pickupKind(d){return d.food?'doener':d.zut||d.mat||(d.heal?((Math.floor(d.x+d.y)&1)?'bandage':'bottle'):d.scrap?'scrap':d.item?(d.item.set?'bag-set':['bag-common','bag-magic','bag-rare','bag-legendary'][d.item.r]||'bag-common'):null);}
function paintedDrop(d,bob){if(!PICKUP_ART)return false;const k=pickupKind(d),i=k&&spr('props/pickup-'+k);if(!i)return false;const hh=d.h||0,c=d.food?'#f2a04b':d.zut?ZUT[d.zut][1]:d.mat?MATS[d.mat][1]:d.heal?'#b7f4c0':d.item?rc(d.item):'#c9874a',size=d.food?36:d.item?34:30,gs=d.item?dropGlowRadius(d):d.heal?26:20;
  if(d.item&&d.item.r>=2&&!hh){ctx.fillStyle=c+'30';ctx.fillRect(d.x-3,d.y-(d.item.r>=3?140:70),6,d.item.r>=3?140:70);}
  if(hh){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(d.x,d.y+4,6,2.5,0,0,7);ctx.fill();}
  drawLootGlow(d,bob,c,hh,gs);ctx.drawImage(i,d.x-size/2,d.y+bob-hh-size*.65,size,size);return true;}
