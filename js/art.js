/* ================= character art (three-quarter view) ================= */
function limb(px,py,a,len,w,col){ctx.save();ctx.translate(px,py);ctx.rotate(a);ctx.fillStyle=col;rr(ctx,-w/2,-1,w,len+1,w/2);ctx.restore();}
function stick(x0,y0,x1,y1,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();}
function bar(x,len,w,col){ctx.fillStyle=col;ctx.fillRect(x,-w/2,len,w);}
function yfork(col,band){ctx.strokeStyle='#5a4030';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(10,0);ctx.moveTo(10,0);ctx.lineTo(19,-6);ctx.moveTo(10,0);ctx.lineTo(19,6);ctx.stroke();
  ctx.strokeStyle=band;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(19,-6);ctx.lineTo(15,0);ctx.lineTo(19,6);ctx.stroke();}
const WM={
 rspeer:()=>{bar(-8,40,3,'#7d7a74');ctx.fillStyle='#c8ccd4';ctx.beginPath();ctx.moveTo(32,-3.5);ctx.lineTo(44,0);ctx.lineTo(32,3.5);ctx.fill();ctx.fillStyle='#5a5650';ctx.fillRect(28,-2.5,4,5);},
 fahne:()=>{bar(-8,40,2.6,'#8a6a44');ctx.fillStyle='#c23a2e';ctx.beginPath();ctx.moveTo(26,-2);ctx.lineTo(40,-2);ctx.lineTo(36,-9);ctx.lineTo(40,-16);ctx.lineTo(26,-16);ctx.fill();ctx.fillStyle='#d6cfc0';ctx.beginPath();ctx.moveTo(40,-3);ctx.lineTo(46,0);ctx.lineTo(40,3);ctx.fill();},
 harpune:()=>{bar(-8,40,3,'#4a4038');ctx.fillStyle='#9aa4b0';ctx.beginPath();ctx.moveTo(32,-3);ctx.lineTo(45,0);ctx.lineTo(32,3);ctx.fill();ctx.fillRect(28,-6,2,12);ctx.fillRect(24,-5,2,10);},
 siegsp:()=>{bar(-8,40,3.2,'#c9a227');ctx.fillStyle='#f2d14b';ctx.beginPath();ctx.moveTo(32,-4.5);ctx.lineTo(48,0);ctx.lineTo(32,4.5);ctx.fill();ctx.fillStyle='#ff8a3d';ctx.beginPath();ctx.arc(10,0,3,0,7);ctx.fill();},
 zitklinge:()=>{bar(-4,9,4,'#2a1d14');ctx.fillStyle='#c8ccd4';ctx.beginPath();ctx.moveTo(5,-2.6);ctx.lineTo(33,0);ctx.lineTo(5,2.6);ctx.fill();ctx.fillStyle='#7dd3ff';ctx.fillRect(4,-5,3,10);},
 pbrecher:()=>{bar(-4,30,3.6,'#5a5650');ctx.fillStyle='#7a766c';ctx.fillRect(22,-8,12,16);ctx.fillStyle='#14181c';ctx.fillRect(24,-5,3,3);ctx.fillRect(29,-5,3,3);ctx.fillRect(24,1,3,3);ctx.fillRect(29,1,3,3);},
 morgen:()=>{bar(-4,26,3.4,'#4a3020');ctx.fillStyle='#6a6e76';ctx.beginPath();ctx.arc(26,0,6,0,7);ctx.fill();ctx.fillStyle='#9aa4b0';for(let k=0;k<6;k++){const q=k*1.05;ctx.fillRect(26+Math.cos(q)*7-1,Math.sin(q)*7-1,2.4,2.4);}},
 latte:()=>{bar(-4,28,5,'#8a6a44');ctx.fillStyle='#5a4030';ctx.fillRect(-4,-2.5,28,1.2);ctx.fillStyle='#b8b0a0';ctx.fillRect(20,-1,2,2);},
 rohr:()=>{bar(-4,28,4,'#7d7a74');ctx.fillStyle='#5a5650';ctx.fillRect(6,-3,3,6);ctx.fillRect(18,-3,3,6);ctx.fillStyle='rgba(186,100,40,.6)';ctx.fillRect(12,-2,4,4);},
 stahl:()=>{bar(-4,31,3,'#6e4a2e');ctx.fillStyle='#4a3020';for(let i=0;i<27;i+=3)ctx.fillRect(i,-2,1.2,4);},
 machete:()=>{bar(-4,9,4,'#2a1d14');ctx.fillStyle='#cfc8bb';ctx.beginPath();ctx.moveTo(5,-2.5);ctx.lineTo(28,-4);ctx.quadraticCurveTo(33,0,28,3.5);ctx.lineTo(5,2.5);ctx.fill();ctx.fillStyle='#8a847a';ctx.fillRect(5,1,23,1.5);},
 brech:()=>{bar(-4,28,3.2,'#9a2a1e');ctx.strokeStyle='#9a2a1e';ctx.lineWidth=3.2;ctx.beginPath();ctx.arc(24,-5,5,Math.PI/2,-Math.PI/2,true);ctx.stroke();},
 vorschlag:()=>{bar(-4,30,3.6,'#6b4a30');ctx.fillStyle='#5a5650';ctx.fillRect(23,-8,10,16);ctx.fillStyle='#7a766c';ctx.fillRect(23,-8,10,3);},
 pflaster:()=>{bar(-4,24,3.2,'#6b4a30');ctx.fillStyle='#6e6a62';ctx.fillRect(18,-6,8,12);ctx.fillStyle='#8a8478';ctx.fillRect(18,-6,8,2);},
 zange:()=>{bar(-4,24,3.6,'#9a2a1e');ctx.fillStyle='#6e6a62';ctx.fillRect(18,-6,10,4);ctx.fillRect(18,2,7,4);ctx.fillRect(18,-6,4,12);},
 zwille:()=>yfork(0,'#c9b48f'),nagel:()=>{yfork(0,'#c9b48f');ctx.fillStyle='#b8b0a0';ctx.fillRect(15,-.8,6,1.6);},stein:()=>{yfork(0,'#c9b48f');ctx.fillStyle='#8a8478';ctx.beginPath();ctx.arc(16,0,2.6,0,7);ctx.fill();},
 turm:()=>{bar(-4,30,3,'#8a8478');ctx.fillStyle='#6e6a62';ctx.beginPath();ctx.arc(21,0,5.5,0,7);ctx.fill();ctx.fillStyle='#f2a04b';ctx.fillRect(16,-1,10,2);ctx.fillStyle='#c23a2e';ctx.fillRect(26,-1,8,2);},
 mauer:()=>{bar(-4,30,4,'#5a3a26');ctx.fillStyle='#8a3a26';ctx.fillRect(22,-11,13,22);ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.strokeRect(22,-11,13,22);ctx.beginPath();ctx.moveTo(22,-3);ctx.lineTo(35,-3);ctx.moveTo(22,4);ctx.lineTo(35,4);ctx.stroke();ctx.fillStyle='#d4537e';ctx.fillRect(24,-9,4,4);ctx.fillStyle='#7d9bff';ctx.fillRect(29,6,4,3);},
 sichel:()=>{bar(-4,12,3.6,'#7a5030');ctx.fillStyle='#af4237';ctx.fillRect(2,-2,6,4);ctx.fillStyle='#c8ccc8';ctx.beginPath();ctx.moveTo(10,-2);ctx.quadraticCurveTo(16,-18,30,-12);ctx.quadraticCurveTo(36,-6,30,2);ctx.quadraticCurveTo(28,-8,20,-8);ctx.quadraticCurveTo(13,-6,12,2);ctx.closePath();ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(14,-6);ctx.quadraticCurveTo(20,-14,30,-10);ctx.stroke();},
 werkh:()=>{bar(-4,26,3.4,'#7a5030');ctx.fillStyle='#af4237';ctx.fillRect(-4,-2,7,4);ctx.fillStyle='#c8902a';for(let k=0;k<8;k++){const q=k*.785;ctx.fillRect(28+Math.cos(q)*8-1.5,Math.sin(q)*8-1.5,3,3);}ctx.fillStyle='#736734';ctx.fillRect(21,-7,14,14);ctx.fillStyle='#e7982b';ctx.beginPath();ctx.arc(28,0,3,0,7);ctx.fill();},
 aufzieh:()=>{yfork(0,'#c8902a');ctx.strokeStyle='#c8902a';ctx.lineWidth=1.2;for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(2+k*2.4,4.5,1.2,2.6,0,0,7);ctx.stroke();}ctx.fillStyle='#d4a27e';ctx.beginPath();ctx.arc(-4,4,2,0,7);ctx.arc(-4,8,2,0,7);ctx.fill();},
 zeiger:()=>{bar(-8,40,2.6,'#c8902a');ctx.fillStyle='#2a2018';ctx.beginPath();ctx.moveTo(30,-3);ctx.lineTo(40,-5);ctx.lineTo(48,0);ctx.lineTo(40,5);ctx.lineTo(30,3);ctx.fill();ctx.strokeStyle='#e7982b';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(37,0,2.6,0,7);ctx.stroke();},
 leucht:()=>{bar(-4,8,4,'#2a2a30');ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#43d1cf'),0,-10,40,20);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#d8fbff';ctx.fillRect(4,-1.8,28,3.6);ctx.fillStyle='#5a5a64';ctx.fillRect(3,-2.5,2,5);ctx.fillRect(31,-2.5,2,5);},
 boxh:()=>{bar(-4,26,3.4,'#3a3a40');ctx.fillStyle='#16161a';ctx.fillRect(20,-9,14,18);ctx.strokeStyle='#ff4fa3';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(27,0,4.5,0,7);ctx.stroke();},
 neonfl:()=>{ctx.fillStyle='#4a4038';ctx.fillRect(-6,-3,12,6);ctx.fillStyle='#5a5650';ctx.fillRect(4,-3.5,30,7);ctx.fillStyle='#e19142';ctx.fillRect(12,-2,12,4);ctx.fillStyle='#3a3632';ctx.fillRect(32,-1.6,10,3.2);ctx.fillStyle='#9b3e39';ctx.fillRect(26,3,3,6);},
 mikro:()=>{bar(-8,40,2.4,'#3a3a40');ctx.fillStyle='#1a1a1e';ctx.beginPath();ctx.ellipse(36,0,5,3.6,0,0,7);ctx.fill();ctx.strokeStyle='#8a8a94';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(36,0,5,3.6,0,0,7);ctx.stroke();ctx.fillStyle='#ff4fa3';ctx.fillRect(30,-1,3,2);},
 ring:()=>{yfork(0,'#ff8a3d');ctx.strokeStyle='#ff8a3d';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(19,0,5,0,7);ctx.stroke();}};
function drawWeaponModel(it){const b=baseOf(it);(WM[b]||WM[{kraehe:'ring'}[b]]||WM.rohr)();if(it.r>=1&&it.kind!=='sling'){ctx.fillStyle=RAR[it.r].c;ctx.fillRect(6,-.6,18,1.2);}
  if(it.r===3||it.el){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow(it.el?ELC[it.el]:RAR[3].c),12,-13,26,26);ctx.globalCompositeOperation='source-over';}}
function drawHead(L,t){
  if(L.hood){ctx.fillStyle=L.hood;ctx.beginPath();ctx.arc(0,-40,8.6,0,7);ctx.fill();ctx.fillStyle='#d9b48f';ctx.beginPath();ctx.arc(2.6,-39.5,5.4,0,7);ctx.fill();}
  else{ctx.fillStyle='#d9b48f';ctx.beginPath();ctx.arc(1,-40,7,0,7);ctx.fill();
    if(!L.helmet){ctx.fillStyle='#2a1c14';ctx.beginPath();ctx.arc(0,-42,7.2,Math.PI*.95,Math.PI*1.95);ctx.fill();ctx.fillRect(-7,-42,4,6);}}
  ctx.fillStyle='#120c09';ctx.fillRect(5,-41,1.7,2);ctx.fillStyle='rgba(120,60,40,.35)';ctx.fillRect(3,-37,4,1);
  if(L.helmet==='hard'){ctx.fillStyle=L.hc;ctx.beginPath();ctx.arc(1,-42,7.8,Math.PI,0);ctx.fill();ctx.fillRect(-8,-43,19,2.6);ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(-2,-49,3,6);}
  else if(L.helmet==='fire'){ctx.fillStyle=L.hc;ctx.beginPath();ctx.arc(1,-42,8,Math.PI,0);ctx.fill();ctx.fillRect(-11,-43,22,2.6);ctx.fillStyle='#e8d36a';ctx.fillRect(-2,-49,4,4);}
  else if(L.helmet==='straw'){ctx.fillStyle=L.hc;ctx.beginPath();ctx.ellipse(1,-44,12,3.4,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(1,-45,6.4,Math.PI,0);ctx.fill();ctx.fillStyle='#af4237';ctx.fillRect(-5.4,-46.5,12.8,2);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-11,-43.5,24,1);}
  else if(L.helmet==='cap'){ctx.fillStyle=L.hc;rr(ctx,-6,-49,13,6,2);ctx.fillRect(4,-44,8,2);ctx.fillStyle='#26304a';ctx.fillRect(-6,-44.5,13,1.5);}
  else if(L.helmet==='flat'){ctx.fillStyle=L.hc;ctx.beginPath();ctx.ellipse(1,-46,8.5,3.6,0,0,7);ctx.fill();ctx.fillRect(3,-45,9,2);}
  else if(L.helmet==='beanie'){ctx.fillStyle=L.hc;ctx.beginPath();ctx.arc(1,-43,7.6,Math.PI,0);ctx.fill();ctx.fillRect(-6.6,-44,15.2,3);ctx.beginPath();ctx.arc(1,-51,2.2,0,7);ctx.fill();}
  else if(L.helmet==='mask'){ctx.fillStyle='#2a1c14';ctx.beginPath();ctx.arc(0,-42,7.2,Math.PI*.95,Math.PI*1.95);ctx.fill();ctx.fillStyle=L.hc;rr(ctx,-1,-44,9,9,3);ctx.fillStyle='#9ff8ff';ctx.fillRect(4,-42,2.4,2.4);ctx.fillStyle='#2a2a26';ctx.fillRect(5,-37,4,4);}
  else if(L.helmet==='goggles'){ctx.fillStyle='#2a1c14';ctx.beginPath();ctx.arc(0,-42,7.2,Math.PI*.95,Math.PI*1.95);ctx.fill();ctx.fillStyle='#1a1a1e';ctx.fillRect(-7,-43,15,3);ctx.fillStyle=L.hc;ctx.fillRect(2,-43.5,6,3.4);ctx.globalCompositeOperation='lighter';ctx.drawImage(glow(L.hc),-2,-50,16,14);ctx.globalCompositeOperation='source-over';}
  else if(L.helmet==='steel'){ctx.fillStyle=L.hc;ctx.beginPath();ctx.arc(1,-41.5,8.6,Math.PI,0);ctx.fill();ctx.fillStyle='#5a5650';ctx.fillRect(-8,-42,18,2);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(-3,-49,3,5);}
}
/* Painted player rig v3 step 1: shared mannequin, knees, ankles and two-part fists.
   Generated HR/HW in js/hero.js, with source grip/tip pivots in the manifest. */
const HIMG={},HHAT={helm:1,schieber:1,muetze:1,maske:1,nbrille:1,stroh:1},HWL={blade:22,hammer:34,spear:48,sling:16};
function himg(k){let i=HIMG[k];if(!i){i=HIMG[k]=new Image();i.src='assets/hero/rig/'+k+'.webp';}return i.complete&&i.naturalWidth?i:null;}
function heroKeys(){const A=S.eq.a,b=A?baseOf(A):'none',o=b==='kette'?'khemd':HR.outfits[b]?b:'none',h=S.eq.h&&HR.hats[baseOf(S.eq.h)]||null;return{o,h};}
function heroPre(){Object.keys(HR.parts).forEach(himg);}
function hpart(img,x,y,w,h){ctx.drawImage(img,x,y,w,h);}
// Compose registered base/clothing pairs once at rig resolution; joints remain animated.
const HCOMP={},HREADY={};
function heroLayer(key,names){if(HCOMP[key])return HCOMP[key];const rs=6,rr=names.map(k=>HR.parts[k]),x=Math.floor(Math.min(...rr.map(r=>r[0]))*rs)/rs,y=Math.floor(Math.min(...rr.map(r=>r[1]))*rs)/rs,w=Math.ceil((Math.max(...rr.map(r=>r[0]+r[2]))-x)*rs),h=Math.ceil((Math.max(...rr.map(r=>r[1]+r[3]))-y)*rs),i=cnv(w,h),c=i.getContext('2d');for(let j=0;j<names.length;j++){const r=rr[j];c.drawImage(HIMG[names[j]],(r[0]-x)*rs,(r[1]-y)*rs,r[2]*rs,r[3]*rs);}return HCOMP[key]={i,r:[x,y,w/rs,h/rs]};}
// Pure joint pose: no gameplay mutation, RNG, or per-frame canvas creation.
// Analogue input already controls travel speed. Blend short walking into long-stride running.
function heroGait(p,st){const input=Math.min(1,Math.hypot((p.mvx-p.mvy)*Math.SQRT1_2,(p.mvx+p.mvy)*Math.SQRT1_2/2)),speed=p.root>0||p.dashT>0?0:input*(st.spd||182)/182*(p.wet?.7:1),r=Math.max(0,Math.min(1,(speed-.45)/.55)),run=r*r*(3-2*r);return{speed,run,cadence:speed>.15?(7+3*run)*Math.sqrt(speed):0};}
function heroPose(p,st){const gait=heroGait(p,st),{speed,run}=gait,dash=p.dashT>0,attack=p.swingT>0||p.spin>0,stride=Math.min(1.15,speed)*(attack?.6:1),phase=p.walk||0,progress=p.swingT>0?Math.max(0,Math.min(1,1-p.swingT/p.swingDur)):0,beat=Math.sin(progress*Math.PI),leg=q=>{const a=Math.sin(q)*(.45+.35*run)*stride,k=Math.max(0,-Math.sin(q))*(.65+.45*run)*Math.min(1,stride);return{hip:a,knee:k,ankle:-a-k};},near=leg(phase),far=leg(phase+Math.PI);
  if(dash){Object.assign(near,{hip:-.55,knee:.9,ankle:-.35});Object.assign(far,{hip:.5,knee:.15,ankle:-.65});}
  const ext=l=>Math.cos(l.hip)*HR.thigh+Math.cos(l.hip+l.knee)*HR.shin,bob=16-Math.max(ext(near),ext(far)),lean=dash?.12:attack?(progress-.5)*.09:(.045+.075*run)*Math.min(1,speed),twist=Math.sin(phase)*(.025+.015*run)*stride;
  return{near,far,bob,lean,torso:lean+twist,head:-lean*.55-twist*.7,speed,run,attack,progress,beat,armSwing:(.48+.22*run)*Math.min(1.15,speed),weaponSway:attack||dash?0:Math.sin(phase-.45)*.12*run,frontBend:.12+(.4+.25*run)*stride*(.5+.5*Math.cos(phase)),backBend:.12+(.4+.25*run)*stride*(.5-.5*Math.cos(phase))};}
function heroShoulder(pose,far){const x=HR.sh[0]+(far?-1.6:0),y=HR.sh[1]-HR.hip,c=Math.cos(pose.torso),s=Math.sin(pose.torso);return[x*c-y*s,HR.hip+x*s+y*c];}
function heroArmJoint(shoulder,angle,bend,target){let a=angle,b=bend;if(target){const dx=target[0]-shoulder[0],dy=target[1]-shoulder[1],d=Math.min(HR.upper+HR.lower,Math.hypot(dx,dy));b=Math.acos(Math.max(-1,Math.min(1,(d*d-HR.upper*HR.upper-HR.lower*HR.lower)/(2*HR.upper*HR.lower))));a=Math.atan2(dy,dx)-Math.atan2(HR.lower*Math.sin(b),HR.upper+HR.lower*Math.cos(b));}return{a,b,elbow:[shoulder[0]+Math.cos(a)*HR.upper,shoulder[1]+Math.sin(a)*HR.upper],hand:[shoulder[0]+Math.cos(a)*HR.upper+Math.cos(a+b)*HR.lower,shoulder[1]+Math.sin(a)*HR.upper+Math.sin(a+b)*HR.lower]};}
function drawHero(t,sw,aa,wa,W,GC,CY){const{o,h}=heroKeys(),R=HR.outfits[o],gl=S.eq.g&&HR.gloves[baseOf(S.eq.g)],boot=HR.boots[S.eq.f&&baseOf(S.eq.f)]||HR.boots.stiefel,pa=gl?gl.palm:'palm',fi=gl?gl.fingers:'fingers',id=ICOI[baseOf(W)],q=id&&HW[id],wk=q?'weapon-'+id.toLowerCase():null;
  const readyKey=[o,h,boot,pa,fi,wk].join('|');let im=HREADY[readyKey];if(!im){im={};const keys=['body','upper','upper-d','lower','lower-d','head','leg-thigh','leg-thigh-d','leg-shin','leg-shin-d',R.t,R.u,R.u+'-d',R.l,R.l+'-d',R.thigh,R.thigh+'-d',R.shin,R.shin+'-d',boot,boot+'-d',pa,fi,...(h?[h]:[]),...(wk?[wk]:[])];for(const k of keys){im[k]=himg(k);if(!im[k])return false;}HREADY[readyKey]=im;}
  const pose=heroPose(P,ST),part=k=>ctx.drawImage(im[k],...HR.parts[k]),layer=(k,names)=>{const g=heroLayer(k,names);ctx.drawImage(g.i,...g.r);},leg=(far,l)=>{const d=far?'-d':'';ctx.save();ctx.translate(far?-2.4:1.2,HR.hip);ctx.rotate(l.hip);layer(R.thigh+d,['leg-thigh'+d,R.thigh+d]);ctx.translate(0,R.knee);ctx.rotate(l.knee);layer(R.shin+d,['leg-shin'+d,R.shin+d]);ctx.translate(0,HR.shin);ctx.rotate(l.ankle);part(boot+d);ctx.restore();},arm=(far,j)=>{const d=far?'-d':'',sh=heroShoulder(pose,far);ctx.save();ctx.translate(...sh);ctx.rotate(j.a-Math.PI/2);layer(R.u+d,['upper'+d,R.u+d]);ctx.translate(0,HR.upper);ctx.rotate(j.b);layer(R.l+d,['lower'+d,R.l+d]);ctx.restore();};
  if(W.kind==='hammer'&&!pose.attack)wa=.42;wa+=pose.weaponSway;
  const frontAngle=pose.attack?aa:Math.PI/2-.35-Math.sin(P.walk||0)*pose.armSwing,backAngle=Math.PI/2+.1+Math.sin(P.walk||0)*pose.armSwing,oldBend=P.swingT>0?.16:.08,target=pose.attack?[HR.sh[0]+Math.cos(aa)*HR.upper+Math.cos(aa+oldBend)*HR.lower,HR.sh[1]+Math.sin(aa)*HR.upper+Math.sin(aa+oldBend)*HR.lower-pose.bob]:null,front=heroArmJoint(heroShoulder(pose,false),frontAngle,pose.frontBend,target),back=heroArmJoint(heroShoulder(pose,true),backAngle,pose.backBend,null);
  ctx.save();ctx.translate(0,pose.bob);leg(true,pose.far);arm(true,back);
  if(P.torch){const[tx,ty]=back.hand;ctx.fillStyle='#5a4030';ctx.fillRect(tx-1.5,ty-15,3,15);ctx.fillStyle='#EF9F27';ctx.beginPath();ctx.moveTo(tx-3.5,ty-15);ctx.lineTo(tx+3.5,ty-15);ctx.lineTo(tx+Math.sin(t*.03)*1.5,ty-25-Math.sin(t*.02)*2);ctx.fill();}
  ctx.save();ctx.translate(0,HR.hip);ctx.rotate(pose.torso);ctx.translate(0,-HR.hip);layer(R.t,['body',R.t]);ctx.translate(0,-41);ctx.rotate(pose.head);ctx.translate(0,41);layer(h||'head',h?['head',h]:['head']);ctx.restore();leg(false,pose.near);arm(false,front);
  if(CY){const sh=heroShoulder(pose,false);stick(...sh,...front.elbow,1,'#43d1cf');stick(...front.elbow,...front.hand,1,'#43d1cf');}
  ctx.save();ctx.translate(...front.hand);ctx.rotate(wa);part(pa);
  if(q){const sc=HWL[W.kind]/q[3];ctx.save();ctx.rotate(-q[0]);ctx.drawImage(im[wk],-q[1]*sc,-q[2]*sc,im[wk].naturalWidth*sc,im[wk].naturalHeight*sc);ctx.restore();if(W.r===3||W.el){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow(W.el?ELC[W.el]:RAR[3].c),HWL[W.kind]*.4,-13,26,26);ctx.globalCompositeOperation='source-over';}}
  else drawWeaponModel(W);
  part(fi);ctx.restore();ctx.restore();return true;}

const IIMG={};function himgI(id){let i=IIMG[id];if(!i){i=IIMG[id]=new Image();i.src='assets/icons/'+id+'.webp';}return i.complete&&i.naturalWidth?i:null;}
function drawPlayer(t){
  if(state==='over'&&P.hp<=0)return;
  const moving=Math.hypot(P.mvx,P.mvy)>.15&&P.dashT<=0,sw=moving?Math.sin(P.walk):0,bob=moving?Math.abs(Math.cos(P.walk))*1.6:0,fx=P.x,fy=P.y+9,flip=Math.cos(P.face)<0?-1:1;
  fxShadow(fx,fy,13,44);
  const A=S.eq.a,L0=LOOK[A?baseOf(A):'none']||LOOK.none,J=L0.j,W=S.eq.w,toL=a=>flip>0?a:Math.PI-a,HD=S.eq.h,L=HD?Object.assign({},L0,{hood:0},HEADL[baseOf(HD)]):L0,GC=S.eq.g&&GLOVE[baseOf(S.eq.g)],BC=S.eq.f&&BOOT[baseOf(S.eq.f)];
  ctx.save();ctx.translate(fx,fy);ctx.scale(flip*1.2,1.2);
  if(P.inv>0&&P.dashT<=0&&Math.floor(P.inv*22)%2)ctx.globalAlpha=.45;
  let wa,aa;
  if(P.spin>0){wa=t*.03;aa=wa;}
  else if(P.swingT>0){if(P.swingKind==='sling'){wa=aa=toL(P.atkA);}else if(P.swingKind==='spear'){wa=aa=toL(P.atkA);}else{const p=1-P.swingT/P.swingDur,arc=KIND[P.swingKind].arc,e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;wa=aa=toL(P.atkA-arc+2*arc*e);}}
  else{aa=Math.PI/2-.45+sw*.35;wa=W.kind==='sling'?-.2:W.kind==='hammer'?-2.1:W.kind==='spear'?-1.05:-1.2;}
  if(drawHero(t,sw,aa,wa,W,GC,!!S.eq.i)){ctx.restore();return;}
  ctx.translate(0,-bob/1.2);if(P.dashT>0)ctx.rotate(.18);
  limb(-4,-30,.25-sw*.5,12,4.5,dark(J,.7));ctx.fillStyle=GC?dark(GC,.8):'#b8946f';ctx.beginPath();ctx.arc(-4+Math.sin(-(.25-sw*.5))*12,-30+Math.cos(.25-sw*.5)*12,2.3,0,7);ctx.fill();
  if(P.torch){const tx=-4-Math.sin(.25-sw*.5)*12,ty=-30+Math.cos(.25-sw*.5)*12;ctx.fillStyle='#5a4030';ctx.fillRect(tx-1.5,ty-15,3,15);ctx.fillStyle='#EF9F27';ctx.beginPath();ctx.moveTo(tx-3.5,ty-15);ctx.lineTo(tx+3.5,ty-15);ctx.lineTo(tx+Math.sin(t*.03)*1.5,ty-25-Math.sin(t*.02)*2);ctx.fill();ctx.fillStyle='#FAC775';ctx.beginPath();ctx.moveTo(tx-1.8,ty-15);ctx.lineTo(tx+1.8,ty-15);ctx.lineTo(tx,ty-20);ctx.fill();}
  limb(-2.5,-15,-sw*.55,14,5,'#1e1610');limb(2.5,-15,sw*.55,14,5,'#2a1f18');
  const bh=BC&&baseOf(S.eq.f)!=='turnsch'?6:3.5;ctx.fillStyle=BC||'#120c09';ctx.save();ctx.translate(-2.5,-15);ctx.rotate(-sw*.55);ctx.fillRect(-2.5,14.5-bh,6.5,bh);ctx.restore();ctx.save();ctx.translate(2.5,-15);ctx.rotate(sw*.55);ctx.fillRect(-2.5,14.5-bh,6.5,bh);ctx.restore();
  ctx.fillStyle=J;if(L.coat){rr(ctx,-8.5,-33,17,26,4);ctx.fillStyle=dark(J,.75);ctx.fillRect(-.5,-20,1.2,13);}else rr(ctx,-8,-33,16,20,4);
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-8,-33,4,L.coat?26:20);
  if(L.collar){ctx.fillStyle=L.collar;ctx.fillRect(-6,-34,12,3);}
  if(L.vest){ctx.fillStyle=L.vest;rr(ctx,-6,-31,12,15,2);if(L.plates){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-6,-24,12,1.2);ctx.fillStyle='#b8b0a0';[[-4,-29],[3,-29],[-4,-19],[3,-19]].forEach(q=>ctx.fillRect(q[0],q[1],1.4,1.4));}}
  if(L.stripes){ctx.fillStyle=L.stripes;ctx.fillRect(-8,-24,16,2);ctx.fillRect(-8,-19,16,2);}
  {ctx.fillStyle=L.scarf||'#9b3328';ctx.fillRect(-6,-35,12,4);ctx.fillRect(-7,-33,3,8);}
  if(!L.coat){ctx.fillStyle='#1a120c';ctx.fillRect(-8,-15,16,2.2);}
  if(A&&A.r>=1){ctx.fillStyle=RAR[A.r].c;ctx.fillRect(-8,-33,16,1.6);}
  if(S.eq.t){ctx.fillStyle=RAR[S.eq.t.r].c;ctx.beginPath();ctx.arc(5,L.coat?-20:-14,2.2,0,7);ctx.fill();}
  drawHead(L,t);
  const CY=!!S.eq.i;ctx.save();ctx.translate(4,-30);ctx.rotate(aa);ctx.fillStyle=CY?'#6a7480':J;rr(ctx,-2.3,-2.3,13,4.6,2.3);if(CY){ctx.fillStyle='#43d1cf';ctx.fillRect(1,-.6,10,1.2);ctx.fillStyle='#3a3e46';ctx.fillRect(5,-2.3,1.4,4.6);}ctx.restore();// implant: cyber arm (board)
  const hx=4+Math.cos(aa)*12,hy=-30+Math.sin(aa)*12;
  ctx.save();ctx.translate(hx,hy);ctx.rotate(wa);drawWeaponModel(W);ctx.restore();
  ctx.fillStyle=CY?'#8a96a4':GC||'#d9b48f';ctx.beginPath();ctx.arc(hx,hy,GC||CY?3:2.6,0,7);ctx.fill();
  ctx.restore();}
function drawCaptive(c,t){const x=c.x,y=c.y+9;ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(x,y,14,5,0,0,7);ctx.fill();
  ctx.fillStyle='#3a2a1e';ctx.fillRect(x-2,y-34,4,34);ctx.fillStyle=c.s.c;rr(ctx,x-7,y-24,14,16,4);ctx.fillStyle='#1e1610';ctx.fillRect(x-7,y-9,6,8);ctx.fillRect(x+1,y-9,6,8);
  ctx.fillStyle='#d9b48f';ctx.beginPath();ctx.arc(x,y-29,5.5,0,7);ctx.fill();ctx.strokeStyle='#a8957d';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-8,y-18);ctx.lineTo(x+8,y-14);ctx.moveTo(x-8,y-14);ctx.lineTo(x+8,y-18);ctx.stroke();
  if(!c.free&&Math.sin(t*.006)>0){ctx.font='600 13px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillStyle='#ead9c0';ctx.fillText('Hilfe!',x,y-44);}
  if(c.free){ctx.strokeStyle='rgba(143,209,106,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,22,8,0,0,7);ctx.stroke();}}
// Generic painted enemy driver, motion and launch pivots: js/anim.js.
function drawEnemy(e,t){
  const g=enemySprite(e),fl=enemyFlip(e),f=e.flash>0,C=c=>f?'#ead9c0':c,mv=(e.mv||0)>8&&e.stun<=0,sw=mv?Math.sin(e.t*10):0,fy=e.y+e.r*(g?(g.spec.ground??.4):e.type==='uhr'?.25:e.type==='ghoul'&&D.gdr?.4:.75),near=e.atk>0||Math.hypot(P.x-e.x,P.y-e.y)<e.r+34;
  if(g&&e.type!=='crow')fxSil(g.key,g.i,g.m,e.x,fy,1.15*e.r/g.spec.r,fl);else fxShadow(e.x,fy,e.r,e.fly?e.r:e.r*3.2);
  if(e.elite){ctx.strokeStyle=EMC[e.elite];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e.x,fy,e.r*1.45,e.r*.5,0,0,7);ctx.stroke();}
  if(e.tw>0){const p=1-e.tw/e.twm;ctx.strokeStyle=`rgba(255,80,60,${.4+.5*p})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,fy,e.r*(1.2+p),e.r*(.45+.35*p),0,0,7);ctx.stroke();}
  if(e.open>0){ctx.strokeStyle='#f2d14b';ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.beginPath();ctx.ellipse(e.x,fy,e.r*1.9,e.r*.7,0,0,7);ctx.stroke();ctx.setLineDash([]);}
  const L=enemyLife(e,fl);ctx.save();ctx.translate(e.x+L[3],fy+L[4]);ctx.rotate(L[2]);ctx.scale(fl*1.15*L[0],1.15*L[1]);let H=34;
  if(g)H=drawEnemySprite(g,e,C);
  else if(e.type==='ghoul'||e.type==='shield'){const s=e.r/10,sy=D.gdr&&e.type==='ghoul'?e.r/20*44/36:s;ctx.scale(s,sy);H=36*sy;const reach=near?8:0;
    limb(-2,-12,sw*.5,12,3,C('#3d1d12'));limb(3,-12,-sw*.5,12,3,C('#4a2414'));
    stick(0,-22,9+reach,-6-sw*3-reach*1.2,3,C('#4a2010'));
    ctx.save();ctx.translate(1,-18);ctx.rotate(.35);ctx.fillStyle=C(e.col);ctx.beginPath();ctx.ellipse(0,0,6.5,9,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;for(let i=-4;i<5;i+=3){ctx.beginPath();ctx.moveTo(-1,i);ctx.lineTo(4,i);ctx.stroke();}ctx.restore();
    ctx.fillStyle=C('#6e3620');ctx.beginPath();ctx.arc(7,-26,5.2,0,7);ctx.fill();ctx.fillStyle='#1f120c';ctx.fillRect(8,-23,5,2);
    ctx.fillStyle='#EF9F27';ctx.fillRect(8.5,-28.5,2,2);ctx.fillRect(11,-27.5,1.8,1.8);
    stick(3,-22,12+reach,-8+sw*3-reach*1.3,3,C('#5a2a18'));ctx.strokeStyle='#ead9c0';ctx.lineWidth=.9;ctx.beginPath();const cx=12+reach,cy=-8+sw*3-reach*1.3;ctx.moveTo(cx,cy);ctx.lineTo(cx+3,cy+2);ctx.moveTo(cx,cy);ctx.lineTo(cx+3,cy-1);ctx.stroke();
    if(D.cyber&&e.type==='ghoul'){ctx.strokeStyle=C('#d6409a');ctx.lineWidth=1.2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(4,-28);ctx.quadraticCurveTo(-4-i*3,-30+i*2,-6-i*2,-18+i*3);ctx.stroke();}ctx.fillStyle='#ff4fa3';ctx.fillRect(8.5,-28.5,2,2);ctx.fillRect(11,-27.5,1.8,1.8);}if(D.gdr&&e.type==='ghoul')gdrGhoul(C);}// Mitte: cable-wired ghouls (board). Alexanderplatz: Brigadeghul (js/alex.js)
  else if(e.type==='uhr')H=drawUhr(e,C,sw);else if(e.type==='wurz')H=drawWurz(e,C,sw);else if(e.type==='kern')H=drawKern(e,C,sw);else if(e.type==='boss'&&e.big&&e.v===8)H=drawKoloss(e,C,sw,t);
  else if(e.type==='kabel'){const s=e.r/9;ctx.scale(s,s);H=34*s;const ru=e.ru>0;limb(-2,-12,sw*.8,13,2.4,C('#4a3a40'));limb(3,-12,-sw*.8,13,2.4,C('#54424a'));
    ctx.save();ctx.translate(1,-19);ctx.rotate(ru?.9:.55);ctx.fillStyle=C(e.col);ctx.beginPath();ctx.ellipse(0,0,4.5,9,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=.8;for(let i=-5;i<6;i+=2.5){ctx.beginPath();ctx.moveTo(-2,i);ctx.lineTo(3,i);ctx.stroke();}ctx.restore();
    const hx=ru?10:7,hy=ru?-23:-28;ctx.fillStyle=C('#8a7478');ctx.beginPath();ctx.arc(hx,hy,4.6,0,7);ctx.fill();ctx.strokeStyle=C('#d6409a');ctx.lineWidth=1.3;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(hx-2,hy-3);ctx.quadraticCurveTo(hx-10-i*2,hy-10+i*3+Math.sin(e.t*6+i)*2,hx-14-i*2,hy+2+i*4);ctx.stroke();}
    ctx.fillStyle='#ff4fa3';ctx.fillRect(hx+1.5,hy-1.5,2,2);stick(3,-22,11+(near?6:0),-9+sw*3,2.2,C('#6a5260'));stick(-1,-22,-7,-11-sw*3,2.2,C('#6a5260'));ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#ff4fa3'),hx-6,hy-6,12,12);ctx.globalCompositeOperation='source-over';}
  else if(e.type==='bass'){const s=e.r/15;ctx.scale(s,s);H=60*s;const k=e.tw>0?1-e.tw/(e.twm||.8):0,pul=.5+.5*Math.sin(e.t*8);limb(-6,-14,sw*.35,14,6,C('#26222c'));limb(5,-14,-sw*.35,14,6,C('#2e2a34'));
    ctx.fillStyle=C(e.col);rr(ctx,-12,-40,24,28,6);ctx.fillStyle=C('#c8a020');ctx.fillRect(-12,-30,24,3);ctx.fillStyle='#1a1a1a';for(let i=0;i<4;i++)ctx.fillRect(-11+i*6,-30,3,3);stick(-11,-34,-16,-14+sw*2,5,C('#3a3448'));stick(11,-34,17,-14-sw*2,5,C('#3a3448'));
    ctx.fillStyle=C('#16161a');rr(ctx,-11,-64,22,26,2);ctx.strokeStyle=`rgba(255,79,163,${.5+.5*Math.max(k,pul*.6)})`;ctx.lineWidth=2;for(const yy of [-57,-45]){ctx.beginPath();ctx.arc(0,yy,4+k*2,0,7);ctx.stroke();}ctx.fillStyle='#43d1cf';ctx.fillRect(-9,-62,4,1.6);
    if(k>0||pul>.8){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#ff4fa3'),-16,-70,32,32);ctx.globalCompositeOperation='source-over';}}
  else if(e.type==='spitter'){const s=e.r/11;ctx.scale(s,s);H=42*s;const ch=e.fire<.5?1-e.fire/.5:0;
    limb(-4,-9,sw*.4,9,4,C('#2f2618'));limb(3,-9,-sw*.4,9,4,C('#3a3020'));
    ctx.fillStyle=C(e.col);ctx.beginPath();ctx.ellipse(0,-17,10.5,12,0,0,7);ctx.fill();ctx.fillStyle=C('#6e5a3a');ctx.beginPath();ctx.ellipse(2.5,-14,6,7,0,0,7);ctx.fill();
    ctx.fillStyle=`rgba(151,196,89,${.55+.4*ch})`;ctx.beginPath();ctx.ellipse(-4,-29,7+ch*3,6+ch*3,0,0,7);ctx.fill();ctx.fillStyle='rgba(220,255,160,.35)';ctx.beginPath();ctx.arc(-6,-31-ch*2,2+ch,0,7);ctx.fill();
    ctx.fillStyle=C('#4a3a24');ctx.beginPath();ctx.arc(7,-24,4.6,0,7);ctx.fill();ctx.fillStyle='#EF9F27';ctx.fillRect(8.5,-25.8,2,2);
    stick(10,-21,10.5,-16+Math.sin(e.t*4),1.4,'#97C459');stick(4,-18,8,-11,2.4,C('#4a3a24'));}
  else if(e.type==='raser'){const s=e.r/11;ctx.scale(s,s);H=36*s;const ru=e.ru>0;
    limb(-2,-12,sw*.8,12,3.2,C('#2a140b'));limb(3,-12,-sw*.8,12,3.2,C('#341a0e'));
    ctx.save();ctx.translate(1,-18);ctx.rotate(ru?.9:e.ch>0?.2:.55);ctx.fillStyle=C(e.col);ctx.beginPath();ctx.ellipse(0,0,6,10,0,0,7);ctx.fill();ctx.restore();
    const hx0=ru?10:7,hy0=ru?-22:-27;ctx.fillStyle=C('#4a2414');ctx.beginPath();ctx.arc(hx0,hy0,5,0,7);ctx.fill();
    ctx.fillStyle=C('#b8b0a0');for(let i=0;i<3;i++){const hx=hx0-4-i*3,hy=hy0-4+i*1.5;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx-5,hy-5);ctx.lineTo(hx-1,hy+2);ctx.fill();}
    ctx.fillStyle=e.ch>0?'#ff4030':'#EF9F27';ctx.fillRect(hx0+2,hy0-2,2.2,2.2);stick(-1,-22,-8,-12+sw*3,3,C('#4a2414'));}
  else if(e.type==='rat'){const s=e.r/6;ctx.scale(s,s);H=14*s;ctx.strokeStyle=C('#8a6a60');ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-6,-4);ctx.quadraticCurveTo(-14,-2+sw*3,-16,-8);ctx.stroke();
    ctx.fillStyle=C('#2a221c');for(const q of [-3,3])ctx.fillRect(q+sw*q*.4,-2,2,3);ctx.fillStyle=C(e.col);ctx.beginPath();ctx.ellipse(0,-5,7.5,4.5,0,0,7);ctx.fill();ctx.fillStyle=C('#6a5e52');ctx.beginPath();ctx.ellipse(6,-6,4,3.2,0,0,7);ctx.fill();
    ctx.fillStyle=C('#c88a8a');ctx.fillRect(9.5,-6.5,1.6,1.4);ctx.beginPath();ctx.arc(4,-9,1.6,0,7);ctx.fill();ctx.fillStyle='#ff4030';ctx.fillRect(7,-7.5,1.3,1.3);}
  else if(e.type==='bomb'){const s=e.r/11;ctx.scale(s,s);H=40*s;const fu=e.fuse>0,bl=fu&&Math.floor(e.fuse*14)%2;if(fu)ctx.scale(1+.08*Math.sin(e.t*40),1);
    limb(-3,-11,sw*.5,11,3.4,C('#2a1d14'));limb(3,-11,-sw*.5,11,3.4,C('#352418'));ctx.fillStyle=C(e.col);ctx.beginPath();ctx.ellipse(1,-19,7,9,.3,0,7);ctx.fill();
    ctx.fillStyle=bl?'#ffefd0':C('#a83020');rr(ctx,-11,-32,9,20,3);ctx.fillStyle=bl?'#ffefd0':C('#7a2016');ctx.fillRect(-11,-26,9,2);ctx.fillRect(-11,-19,9,2);ctx.fillStyle='#2a2522';ctx.fillRect(-8,-35,3,4);
    ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#ff8a3d'),-14,-46,16,16);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#FAC775';ctx.fillRect(-7,-39+Math.sin(e.t*20),2,2);
    ctx.fillStyle=C('#5a4030');ctx.beginPath();ctx.arc(7,-26,4.6,0,7);ctx.fill();ctx.fillStyle='#EF9F27';ctx.fillRect(8.5,-27.5,2,2);stick(5,-20,11,-12+sw*2,2.6,C('#4a3424'));}
  else if(e.type==='crow'){ctx.restore();const fy2=fy-28-(e.dive>0?-14:e.rest>0?-16:Math.sin(e.t*3)*4),fl2=e.dive>0?(e.rdx<0?-1:1):(e.x<P.x?1:-1),wf=e.dive>0?.2:Math.sin(e.t*18);
    ctx.save();ctx.translate(e.x,fy2);ctx.scale(fl2*1.2,1.2);ctx.fillStyle=C('#1a1614');ctx.beginPath();ctx.ellipse(0,0,8,4,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-12,-2);ctx.lineTo(-11,3);ctx.fill();
    ctx.fillStyle=C('#2a2422');ctx.beginPath();ctx.moveTo(-2,-1);ctx.lineTo(-6+wf*2,-12*wf-2);ctx.lineTo(4,-2);ctx.fill();ctx.beginPath();ctx.moveTo(-2,1);ctx.lineTo(-4,8*wf+2);ctx.lineTo(4,1);ctx.fill();
    ctx.fillStyle=C('#1a1614');ctx.beginPath();ctx.arc(7,-2,3.4,0,7);ctx.fill();ctx.fillStyle='#c9a227';ctx.beginPath();ctx.moveTo(10,-2.5);ctx.lineTo(14,-1);ctx.lineTo(10,0);ctx.fill();ctx.fillStyle=e.dive>0?'#ff4030':'#EF9F27';ctx.fillRect(7.5,-3.5,1.6,1.6);
    ctx.restore();ctx.save();H=40;}
  else if(e.type==='howl'){const s=e.r/11;ctx.scale(s,s);H=46*s;const scr=e.fire<.5;
    limb(-2,-14,sw*.4,14,2.6,C('#2a1a22'));limb(3,-14,-sw*.4,14,2.6,C('#341f2a'));ctx.fillStyle=C(e.col);rr(ctx,-5,-34,11,22,4);
    stick(-3,-30,scr?-10:-8,scr?-46:-18,2.4,C('#4a2a3a'));stick(4,-30,scr?12:9,scr?-46:-18,2.4,C('#4a2a3a'));
    ctx.fillStyle=C('#6a4a5a');ctx.beginPath();ctx.ellipse(2,-40,6,7,0,0,7);ctx.fill();ctx.fillStyle='#120a0e';ctx.beginPath();ctx.ellipse(4,-37,2.6,scr?4.5:2,0,0,7);ctx.fill();ctx.fillStyle='#d65a8c';ctx.fillRect(3,-43,2,2);ctx.fillRect(6,-42.5,2,2);
    if(e.buff>0||scr){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#d65a8c'),-14,-56,32,32);ctx.globalCompositeOperation='source-over';}}
  else{const boss=e.type==='boss',s=boss?e.r/17*.85:e.r/17;ctx.scale(s,s);H=56*s;const reach=near?8:0,col=e.col;
    if(boss&&!e.big){ctx.strokeStyle='#6b5a4a';ctx.lineWidth=2.5;ctx.lineCap='round';[[-6,-40,-20,-64],[-2,-42,-8,-70],[6,-42,14,-66],[-10,-34,-26,-48]].forEach(q=>{ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[2],q[3]);ctx.stroke();});}
    limb(-6,-14,sw*.35,14,7,C('#2a140b'));limb(5,-14,-sw*.35,14,7,C('#341a0e'));
    stick(-11,-34,-15,-15+sw*2,6,C(dark(col,.8)));ctx.fillStyle=C('#4a2010');ctx.beginPath();ctx.arc(-15,-14+sw*2,5,0,7);ctx.fill();
    ctx.fillStyle=C(col);rr(ctx,-14,-43,28,31,8);ctx.fillStyle=C(dark(col,.8));rr(ctx,-9,-30,18,14,4);
    ctx.fillStyle=C(boss&&e.big?['#c9a227','#3b4a22','#7a766c','#5a4a30','#2a2522'][e.v]||'#2a2522':'#5a5048');rr(ctx,-17,-46,13,9,2);rr(ctx,4,-46,13,9,2);ctx.fillStyle='#8a8478';[[-14,-43],[-8,-43],[7,-43],[13,-43]].forEach(q=>ctx.fillRect(q[0],q[1],1.6,1.6));
    ctx.fillStyle=C('#3d1d12');ctx.beginPath();ctx.arc(2,-48,6.6,0,7);ctx.fill();
    if(boss&&e.big&&e.v!==4){const v=e.v;
      if(v===0){ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.arc(2,-50,7.6,Math.PI,0);ctx.fill();ctx.fillRect(-7,-51,18,2.4);ctx.fillStyle='#c9a227';ctx.fillRect(1,-65,2.4,11);ctx.beginPath();ctx.arc(2.2,-53,2.2,0,7);ctx.fill();ctx.fillStyle='#2a1c14';ctx.fillRect(3,-45,8,2);}
      else if(v===1){ctx.fillStyle='#2f3b1c';ctx.beginPath();ctx.moveTo(-9,-42);ctx.quadraticCurveTo(2,-74,13,-42);ctx.fill();ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#97c459'),-6,-60,24,24);ctx.globalCompositeOperation='source-over';}
      else if(v===2){const pu=.5+.5*Math.sin(t*.0157);ctx.fillStyle='#16161a';rr(ctx,-9,-74,22,28,2);ctx.strokeStyle=`rgba(255,79,163,${.5+.5*pu})`;ctx.lineWidth=2;for(const yy of [-66,-54]){ctx.beginPath();ctx.arc(2,yy,4.5+pu*1.5,0,7);ctx.stroke();}
        ctx.strokeStyle='#d6409a';ctx.lineWidth=2;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-6+k*4,-46);ctx.quadraticCurveTo(-20+k*3,-56+Math.sin(t*.004+k)*4,-16-k*2,-28);ctx.stroke();}ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#ff4fa3'),-18,-84,40,40);ctx.globalCompositeOperation='source-over';}// Bassprediger: speaker head, pink cables
      else if(v===5){ctx.fillStyle='#6a5e52';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(-8+k*5,-55-Math.abs(Math.sin(t*.01+k))*3,3.2,2.2,0,0,7);ctx.fill();}ctx.fillStyle='#ff4030';for(let k=0;k<5;k++)ctx.fillRect(-6+k*5,-56,1,1);ctx.fillStyle='#c9a227';ctx.fillRect(-8,-52,22,2.4);}
      else if(v===6){ctx.fillStyle='#8a8f96';ctx.beginPath();ctx.arc(2,-50,8.4,Math.PI,0);ctx.fill();ctx.fillRect(-6.4,-50,16.8,6);ctx.fillStyle='#1a1a1a';ctx.fillRect(-1,-48,10,1.6);ctx.fillStyle='#c23a2e';ctx.beginPath();ctx.moveTo(2,-58);ctx.quadraticCurveTo(-10,-70,-16,-56);ctx.lineTo(2,-56);ctx.fill();}
      else if(v===7){ctx.fillStyle='#f2c230';ctx.beginPath();ctx.arc(2,-50,8,Math.PI,0);ctx.fill();ctx.fillRect(-8,-51,20,2.4);ctx.fillStyle='#7a766c';rr(ctx,-24,-62,20,12,1);ctx.fillStyle='#14181c';for(let k=0;k<3;k++)ctx.fillRect(-22+k*6,-59,3,3);}
      else if(v===3){ctx.fillStyle='#5a4030';ctx.beginPath();ctx.arc(2,-50,7.8,Math.PI,0);ctx.fill();ctx.fillRect(-6,-50,3,8);ctx.fillStyle='#7dd3ff';ctx.fillRect(3,-52,3.4,3);ctx.fillRect(7.5,-52,3.4,3);ctx.fillStyle='#ead9c0';ctx.fillRect(-12,-40+Math.sin(t*.01)*2,10,3);}}
    if(boss&&e.big&&e.v===4){ctx.fillStyle='#8a1e14';ctx.beginPath();ctx.arc(2,-50,7.4,Math.PI,0);ctx.fill();ctx.fillRect(-8,-51,20,2.4);
      for(let k=0;k<4;k++){const h=8+Math.sin(t*.02+k*1.9)*3;ctx.fillStyle=k%2?'#EF9F27':'#FAC775';ctx.beginPath();ctx.moveTo(-4+k*4,-57);ctx.lineTo(0+k*4,-57);ctx.lineTo(-2+k*4+Math.sin(t*.03+k)*1.5,-57-h);ctx.fill();}}
    ctx.fillStyle=boss&&e.big?(e.v===1?'#b5e07a':e.v===2?'#7dd3ff':'#ff6b2a'):'#EF9F27';ctx.fillRect(4,-50,2.4,2.4);ctx.fillRect(7,-49,2.4,2.4);
    stick(11,-34,16+reach,-15-reach*1.6-sw*2,6,C(col));ctx.fillStyle=C('#4a2010');ctx.beginPath();ctx.arc(16+reach,-14-reach*1.6-sw*2,6,0,7);ctx.fill();
    if(D.cyber&&!boss){ctx.strokeStyle=C('#d6409a');ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-6+i*4,-50);ctx.quadraticCurveTo(-18+i*3,-62+Math.sin(e.t*3+i)*3,-14-i*2,-30);ctx.stroke();}ctx.fillStyle='#ff4fa3';ctx.fillRect(-8,-36,3,3);ctx.fillRect(8,-24,3,3);}// Mitte: brutes with pink cables (board)
    if(boss)H+=10*s;}
  ctx.restore();H*=1.15;
  if(e.type==='uhr')gdrShield(e,fy,C);
  else if(SHD(e)&&!drawEnemyShield(e,fy)){const fa=e.fa,sr=e.r+(e.type==='boss'?6:4),cx=e.x+Math.cos(fa)*sr,cy=fy-14+Math.sin(fa)*sr*.6,px=-Math.sin(fa),py=Math.cos(fa)*.6,L=e.type==='boss'?26:15,op=e.guard>0;
    ctx.lineCap='round';ctx.strokeStyle=op?'rgba(120,110,100,.6)':C('#5a6470');ctx.lineWidth=e.type==='boss'?11:8;ctx.beginPath();ctx.moveTo(cx-px*L,cy-py*L-(op?-6:0));ctx.lineTo(cx+px*L,cy+py*L-(op?-6:0));ctx.stroke();
    if(!op){ctx.strokeStyle=C('#9aa4b0');ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-px*L*.8,cy-py*L*.8-3);ctx.lineTo(cx+px*L*.8,cy+py*L*.8-3);ctx.stroke();}ctx.lineCap='butt';}
  if(e.buff>0&&e.type!=='howl'){ctx.strokeStyle='rgba(214,90,140,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(e.x,fy,e.r*1.25,e.r*.45,0,0,7);ctx.stroke();}
  if(e.stun>0){ctx.strokeStyle='#f2d14b';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(e.x,fy-H-4,e.r*.6,3,0,0,7);ctx.stroke();}
  if(e.elite||e.open>0){ctx.font='600 12px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillStyle=e.open>0?'#f2d14b':EMC[e.elite];ctx.fillText(e.open>0?'Offen!':'Elite · '+EMN[e.elite],e.x,fy-H-14);}
  if(e.type!=='boss'&&(e.hp<e.max||e.elite)){ctx.fillStyle='#0d0907';ctx.fillRect(e.x-e.r,fy-H-10,e.r*2,3);ctx.fillStyle='#c23a2e';ctx.fillRect(e.x-e.r,fy-H-10,e.r*2*Math.max(0,e.hp)/e.max,3);}}
function drawProp(b){const x=b.x,y=b.y,w=b.w,h=b.h,f=b.flash>0;
  ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(x+3,y+h-2,w,5);
  if(b.type==='crate'){ctx.fillStyle=f?'#ead9c0':'#9a7040';ctx.fillRect(x,y-8,w,h-2);ctx.fillStyle=f?'#ead9c0':'#6b4a2a';ctx.fillRect(x,y+h-10,w,10);
    ctx.strokeStyle='#3a2414';ctx.lineWidth=1.2;ctx.strokeRect(x+.5,y-7.5,w-1,h+7);ctx.beginPath();ctx.moveTo(x,y-1);ctx.lineTo(x+w,y-1);ctx.moveTo(x,y+5);ctx.lineTo(x+w,y+5);ctx.moveTo(x,y+h-10);ctx.lineTo(x+w,y+h-10);ctx.moveTo(x+2,y+h-9);ctx.lineTo(x+w-2,y+h-1);ctx.stroke();}
  else if(b.type==='chest'){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#c9a227'),x-10,y-26,w+20,w+20);ctx.globalCompositeOperation='source-over';
    ctx.fillStyle=f?'#ead9c0':'#5a3a22';rr(ctx,x,y-10,w,h+10,3);ctx.fillStyle=f?'#ead9c0':'#6b4a2a';rr(ctx,x,y-15,w,8,4);ctx.fillStyle='#c9a227';ctx.fillRect(x+4,y-15,3,h+15);ctx.fillRect(x+w-7,y-15,3,h+15);ctx.fillRect(x+w/2-3,y-6,6,6);}
  else if(b.type==='akku'){const k=.5+.5*Math.sin(performance.now()*.006+x);ctx.fillStyle=f?'#ead9c0':'#2a2a30';rr(ctx,x,y-12,w,h+12,2);ctx.fillStyle='#c8a020';ctx.fillRect(x,y-12,w,3);ctx.fillStyle='#1a1a1a';for(let i=0;i<w;i+=6)ctx.fillRect(x+i,y-12,3,3);
    ctx.fillStyle=`rgba(255,79,163,${.5+.4*k})`;ctx.fillRect(x+4,y-6,w-8,7);ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#ff4fa3'),x-6,y-16,w+12,w+12);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#f2d14b';ctx.fillRect(x+w/2-1,y-4,2,4);}// battery pack (board), breaks into a shock nova
  else{ctx.fillStyle=f?'#ead9c0':'#d8642e';rr(ctx,x,y-12,w,h+12,3);ctx.fillStyle=f?'#ead9c0':'#a84a22';rr(ctx,x-1,y-15,w+2,5,2);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(x+w-5,y-10,4,h+10);
    ctx.fillStyle='#ead9c0';ctx.fillRect(x+3,y-3,w-8,3);}
  if(b.hp<b.max){ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+w*.3,y-6);ctx.lineTo(x+w*.5,y+2);ctx.lineTo(x+w*.4,y+8);ctx.stroke();}}
