// Task05: shared painted bodies and one eight-frame fire image. Missing components use the complete legacy drawing.
const PROP_KEYS=['crate','chest','bin','barrel','campfire','lamp','bench','litfass','sandbags','fence','flames'];
let PROP_OFF=false;
spriteReady.then(()=>{for(const k of PROP_KEYS)spr('props/'+k);});
function propImage(k){return PROP_OFF?null:spr('props/'+k);}
function paintProp(k,x,y,w,h){const i=propImage(k);if(!i)return false;ctx.drawImage(i,x-w/2,y-h,w,h);return true;}
function paintedBreakable(b){if(!['crate','chest','bin'].includes(b.type)||!propImage(b.type))return false;const w=(b.w+b.h)*IS,h={crate:29,chest:28,bin:34}[b.type],x=b.x+b.w/2,y=b.y+b.h/2+(b.w+b.h)*IS/4;
  if(b.type==='chest'){ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#c9a227'),x-w/2-6,y-h-6,w+12,h+12);ctx.restore();}
  ctx.save();if(b.flash>0)ctx.globalAlpha=.55;paintProp(b.type,x,y,w,h);ctx.restore();if(b.hp<b.max){ctx.strokeStyle='rgba(0,0,0,.65)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-3,y-14);ctx.lineTo(x+2,y-8);ctx.lineTo(x,y-4);ctx.stroke();}return true;}
// b.ph is a random phase assigned by world creation already; no gameplay RNG or random calls in render.
function propFlameFrame(b,t){const p=b.ph||0,speed=9*(1+.15*Math.sin(p*12.9898));return Math.floor(t*.001*speed+p*8) % 8;}
function paintedFire(b,t){const k=b.camp?'campfire':'barrel',i=propImage(k),fl=propImage('flames');if(!i||!fl)return false;const x=b.x,y=b.y,w=b.camp?36:18,h=b.camp?16:23;paintProp(k,x,y+3,w,h);
  const f=propFlameFrame(b,t),fw=fl.width/8,fh=fl.height,ww=b.camp?28:17,hh=b.camp?31:25;ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(fl,f*fw,0,fw,fh,x-ww/2,y-(b.camp?1:18)-hh,ww,hh);ctx.restore();return true;}
function paintedBillboard(b){if(!b.propKey)return false;const x=ix(b.x+b.w/2,b.y),y=iy(b.x+b.w/2,b.y),k=b.propKey;
  if(k==='litfass'){ctx.save();if(!b.lights.length)ctx.globalAlpha*=.65;const ok=paintProp(k,x,y+5,34,100);ctx.restore();return ok;}
  return paintProp(k,x,y,k==='lamp'?25:40,k==='lamp'?94:26);}
function paintedFence(b){const i=propImage('fence');if(!i)return false;const ax=b.w>=b.h,L=(ax?b.w:b.h)-4,o=ax?P3(b.x+2,b.y+b.h/2,0):P3(b.x+b.w/2,b.y+2,0),a=bAx();ctx.save();ctx.transform(ax?a[0]:a[2],ax?a[1]:a[3],0,1,o[0],o[1]);ctx.drawImage(i,0,-b.H,L,b.H);ctx.restore();return true;}
function paintedSandbags(b){const i=propImage('sandbags');if(!i)return false;const p=P3(b.x+b.w/2,b.y+b.h/2,0),w=(b.w+b.h)*IS,h=b.H+(b.w+b.h)*IS/4;ctx.save();ctx.translate(p[0],p[1]+(b.w+b.h)*IS/4);if(b.w>=b.h)ctx.scale(-1,1);ctx.drawImage(i,-w/2,-h,w,h);ctx.restore();return true;}
function propAssetStats(){return{decodedBytes:PROP_KEYS.reduce((n,k)=>n+(SPRITES['props/'+k]?SPRITES['props/'+k].w*SPRITES['props/'+k].h*4:0),0),derivedBytes:0};}

function drawSandbag(b){if(paintedSandbags(b))return;const n=Math.max(1,Math.round((b.w-12)/15));for(let i=0;i<n;i++)for(let r=0;r<2;r++){const p=P3(b.x+8+i*15+(r?7:0),b.y+b.h/2,r*7);ctx.fillStyle=r?'#9a8a64':'#8a7a5a';ctx.beginPath();ctx.ellipse(p[0],p[1],9,5,0,0,7);ctx.fill();ctx.strokeStyle='#504832';ctx.lineWidth=1;ctx.stroke();}}
