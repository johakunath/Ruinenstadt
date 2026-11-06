/* ================= character art (three-quarter view) ================= */
function limb(px,py,a,len,w,col){ctx.save();ctx.translate(px,py);ctx.rotate(a);ctx.fillStyle=col;rr(ctx,-w/2,-1,w,len+1,w/2);ctx.restore();}
function stick(x0,y0,x1,y1,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();}
function bar(x,len,w,col){ctx.fillStyle=col;ctx.fillRect(x,-w/2,len,w);}
function yfork(col,band){ctx.strokeStyle='#5a4030';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(10,0);ctx.moveTo(10,0);ctx.lineTo(19,-6);ctx.moveTo(10,0);ctx.lineTo(19,6);ctx.stroke();
  ctx.strokeStyle=band;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(19,-6);ctx.lineTo(15,0);ctx.lineTo(19,6);ctx.stroke();}
const WM={
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
  else if(L.helmet==='cap'){ctx.fillStyle=L.hc;rr(ctx,-6,-49,13,6,2);ctx.fillRect(4,-44,8,2);ctx.fillStyle='#26304a';ctx.fillRect(-6,-44.5,13,1.5);}
  else if(L.helmet==='steel'){ctx.fillStyle=L.hc;ctx.beginPath();ctx.arc(1,-41.5,8.6,Math.PI,0);ctx.fill();ctx.fillStyle='#5a5650';ctx.fillRect(-8,-42,18,2);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(-3,-49,3,5);}
}
function drawPlayer(t){
  if(state==='over'&&P.hp<=0)return;
  const moving=Math.hypot(P.mvx,P.mvy)>.15&&P.dashT<=0,sw=moving?Math.sin(P.walk):0,bob=moving?Math.abs(Math.cos(P.walk))*1.6:0,fx=P.x,fy=P.y+9,flip=Math.cos(P.face)<0?-1:1;
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(fx,fy,15,5,0,0,7);ctx.fill();
  const A=S.eq.a,L=LOOK[A?baseOf(A):'none']||LOOK.none,J=L.j,W=S.eq.w,toL=a=>flip>0?a:Math.PI-a;
  ctx.save();ctx.translate(fx,fy-bob);ctx.scale(flip*1.2,1.2);if(P.dashT>0)ctx.rotate(.18);
  if(P.inv>0&&P.dashT<=0&&Math.floor(P.inv*22)%2)ctx.globalAlpha=.45;
  let wa,aa;
  if(P.spin>0){wa=t*.03;aa=wa;}
  else if(P.swingT>0){if(P.swingKind==='sling'){wa=aa=toL(P.atkA);}else{const p=1-P.swingT/P.swingDur,arc=KIND[P.swingKind].arc,e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;wa=aa=toL(P.atkA-arc+2*arc*e);}}
  else{aa=Math.PI/2-.45+sw*.35;wa=W.kind==='sling'?-.2:W.kind==='hammer'?-2.1:-1.2;}
  limb(-4,-30,.25-sw*.5,12,4.5,dark(J,.7));ctx.fillStyle='#b8946f';ctx.beginPath();ctx.arc(-4+Math.sin(-(.25-sw*.5))*12,-30+Math.cos(.25-sw*.5)*12,2.3,0,7);ctx.fill();
  if(P.torch){const tx=-4-Math.sin(.25-sw*.5)*12,ty=-30+Math.cos(.25-sw*.5)*12;ctx.fillStyle='#5a4030';ctx.fillRect(tx-1.5,ty-15,3,15);ctx.fillStyle='#EF9F27';ctx.beginPath();ctx.moveTo(tx-3.5,ty-15);ctx.lineTo(tx+3.5,ty-15);ctx.lineTo(tx+Math.sin(t*.03)*1.5,ty-25-Math.sin(t*.02)*2);ctx.fill();ctx.fillStyle='#FAC775';ctx.beginPath();ctx.moveTo(tx-1.8,ty-15);ctx.lineTo(tx+1.8,ty-15);ctx.lineTo(tx,ty-20);ctx.fill();}
  limb(-2.5,-15,-sw*.55,14,5,'#1e1610');limb(2.5,-15,sw*.55,14,5,'#2a1f18');
  ctx.fillStyle='#120c09';ctx.save();ctx.translate(-2.5,-15);ctx.rotate(-sw*.55);ctx.fillRect(-2.5,11,6.5,3.5);ctx.restore();ctx.save();ctx.translate(2.5,-15);ctx.rotate(sw*.55);ctx.fillRect(-2.5,11,6.5,3.5);ctx.restore();
  ctx.fillStyle=J;if(L.coat){rr(ctx,-8.5,-33,17,26,4);ctx.fillStyle=dark(J,.75);ctx.fillRect(-.5,-20,1.2,13);}else rr(ctx,-8,-33,16,20,4);
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-8,-33,4,L.coat?26:20);
  if(L.collar){ctx.fillStyle=L.collar;ctx.fillRect(-6,-34,12,3);}
  if(L.vest){ctx.fillStyle=L.vest;rr(ctx,-6,-31,12,15,2);if(L.plates){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-6,-24,12,1.2);ctx.fillStyle='#b8b0a0';[[-4,-29],[3,-29],[-4,-19],[3,-19]].forEach(q=>ctx.fillRect(q[0],q[1],1.4,1.4));}}
  if(L.stripes){ctx.fillStyle=L.stripes;ctx.fillRect(-8,-24,16,2);ctx.fillRect(-8,-19,16,2);}
  if(L.scarf){ctx.fillStyle=L.scarf;ctx.fillRect(-6,-35,12,4);ctx.fillRect(-7,-33,3,8);}
  if(!L.coat){ctx.fillStyle='#1a120c';ctx.fillRect(-8,-15,16,2.2);}
  if(A&&A.r>=1){ctx.fillStyle=RAR[A.r].c;ctx.fillRect(-8,-33,16,1.6);}
  if(S.eq.t){ctx.fillStyle=RAR[S.eq.t.r].c;ctx.beginPath();ctx.arc(5,L.coat?-20:-14,2.2,0,7);ctx.fill();}
  drawHead(L,t);
  ctx.save();ctx.translate(4,-30);ctx.rotate(aa);ctx.fillStyle=J;rr(ctx,-2.3,-2.3,13,4.6,2.3);ctx.restore();
  const hx=4+Math.cos(aa)*12,hy=-30+Math.sin(aa)*12;
  ctx.save();ctx.translate(hx,hy);ctx.rotate(wa);drawWeaponModel(W);ctx.restore();
  ctx.fillStyle='#d9b48f';ctx.beginPath();ctx.arc(hx,hy,2.6,0,7);ctx.fill();
  ctx.restore();}
function drawCaptive(c,t){const x=c.x,y=c.y+9;ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(x,y,14,5,0,0,7);ctx.fill();
  ctx.fillStyle='#3a2a1e';ctx.fillRect(x-2,y-34,4,34);ctx.fillStyle=c.s.c;rr(ctx,x-7,y-24,14,16,4);ctx.fillStyle='#1e1610';ctx.fillRect(x-7,y-9,6,8);ctx.fillRect(x+1,y-9,6,8);
  ctx.fillStyle='#d9b48f';ctx.beginPath();ctx.arc(x,y-29,5.5,0,7);ctx.fill();ctx.strokeStyle='#a8957d';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-8,y-18);ctx.lineTo(x+8,y-14);ctx.moveTo(x-8,y-14);ctx.lineTo(x+8,y-18);ctx.stroke();
  if(!c.free&&Math.sin(t*.006)>0){ctx.font='600 13px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillStyle='#ead9c0';ctx.fillText('Hilfe!',x,y-44);}
  if(c.free){ctx.strokeStyle='rgba(143,209,106,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,22,8,0,0,7);ctx.stroke();}}
function drawEnemy(e,t){
  const fl=P.x<e.x?-1:1,f=e.flash>0,C=c=>f?'#ead9c0':c,mv=(e.mv||0)>8&&e.stun<=0,sw=mv?Math.sin(e.t*10):0,fy=e.y+e.r*.75,near=e.atk>0||Math.hypot(P.x-e.x,P.y-e.y)<e.r+34;
  ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(e.x,fy,e.r*1.1,e.r*.36,0,0,7);ctx.fill();
  if(e.elite){ctx.strokeStyle=EMC[e.elite];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e.x,fy,e.r*1.45,e.r*.5,0,0,7);ctx.stroke();}
  ctx.save();ctx.translate(e.x,fy);ctx.scale(fl*1.15,1.15);let H=34;
  if(e.type==='ghoul'||e.type==='shield'){const s=e.r/10;ctx.scale(s,s);H=36*s;const reach=near?8:0;
    limb(-2,-12,sw*.5,12,3,C('#3d1d12'));limb(3,-12,-sw*.5,12,3,C('#4a2414'));
    stick(0,-22,9+reach,-6-sw*3-reach*1.2,3,C('#4a2010'));
    ctx.save();ctx.translate(1,-18);ctx.rotate(.35);ctx.fillStyle=C(e.col);ctx.beginPath();ctx.ellipse(0,0,6.5,9,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;for(let i=-4;i<5;i+=3){ctx.beginPath();ctx.moveTo(-1,i);ctx.lineTo(4,i);ctx.stroke();}ctx.restore();
    ctx.fillStyle=C('#6e3620');ctx.beginPath();ctx.arc(7,-26,5.2,0,7);ctx.fill();ctx.fillStyle='#1f120c';ctx.fillRect(8,-23,5,2);
    ctx.fillStyle='#EF9F27';ctx.fillRect(8.5,-28.5,2,2);ctx.fillRect(11,-27.5,1.8,1.8);
    stick(3,-22,12+reach,-8+sw*3-reach*1.3,3,C('#5a2a18'));ctx.strokeStyle='#ead9c0';ctx.lineWidth=.9;ctx.beginPath();const cx=12+reach,cy=-8+sw*3-reach*1.3;ctx.moveTo(cx,cy);ctx.lineTo(cx+3,cy+2);ctx.moveTo(cx,cy);ctx.lineTo(cx+3,cy-1);ctx.stroke();}
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
  else if(e.type==='crow'){ctx.restore();const fy2=fy-28-(e.dive>0?-14:Math.sin(e.t*3)*4),fl2=e.dive>0?(e.rdx<0?-1:1):(e.x<P.x?1:-1),wf=e.dive>0?.2:Math.sin(e.t*18);
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
      else if(v===2){ctx.fillStyle='#8a8478';ctx.beginPath();ctx.arc(2,-50,8.2,Math.PI,0);ctx.fill();ctx.fillRect(-7,-51,18,2);ctx.strokeStyle='#7dd3ff';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(2,-58);ctx.lineTo(2,-70);ctx.stroke();ctx.fillStyle='#7dd3ff';ctx.beginPath();ctx.arc(2,-71,2+Math.sin(t*.03),0,7);ctx.fill();}
      else if(v===5){ctx.fillStyle='#6a5e52';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(-8+k*5,-55-Math.abs(Math.sin(t*.01+k))*3,3.2,2.2,0,0,7);ctx.fill();}ctx.fillStyle='#ff4030';for(let k=0;k<5;k++)ctx.fillRect(-6+k*5,-56,1,1);ctx.fillStyle='#c9a227';ctx.fillRect(-8,-52,22,2.4);}
      else if(v===6){ctx.fillStyle='#8a8f96';ctx.beginPath();ctx.arc(2,-50,8.4,Math.PI,0);ctx.fill();ctx.fillRect(-6.4,-50,16.8,6);ctx.fillStyle='#1a1a1a';ctx.fillRect(-1,-48,10,1.6);ctx.fillStyle='#c23a2e';ctx.beginPath();ctx.moveTo(2,-58);ctx.quadraticCurveTo(-10,-70,-16,-56);ctx.lineTo(2,-56);ctx.fill();}
      else if(v===7){ctx.fillStyle='#f2c230';ctx.beginPath();ctx.arc(2,-50,8,Math.PI,0);ctx.fill();ctx.fillRect(-8,-51,20,2.4);ctx.fillStyle='#7a766c';rr(ctx,-24,-62,20,12,1);ctx.fillStyle='#14181c';for(let k=0;k<3;k++)ctx.fillRect(-22+k*6,-59,3,3);}
      else if(v===3){ctx.fillStyle='#5a4030';ctx.beginPath();ctx.arc(2,-50,7.8,Math.PI,0);ctx.fill();ctx.fillRect(-6,-50,3,8);ctx.fillStyle='#7dd3ff';ctx.fillRect(3,-52,3.4,3);ctx.fillRect(7.5,-52,3.4,3);ctx.fillStyle='#ead9c0';ctx.fillRect(-12,-40+Math.sin(t*.01)*2,10,3);}}
    if(boss&&e.big&&e.v===4){ctx.fillStyle='#8a1e14';ctx.beginPath();ctx.arc(2,-50,7.4,Math.PI,0);ctx.fill();ctx.fillRect(-8,-51,20,2.4);
      for(let k=0;k<4;k++){const h=8+Math.sin(t*.02+k*1.9)*3;ctx.fillStyle=k%2?'#EF9F27':'#FAC775';ctx.beginPath();ctx.moveTo(-4+k*4,-57);ctx.lineTo(0+k*4,-57);ctx.lineTo(-2+k*4+Math.sin(t*.03+k)*1.5,-57-h);ctx.fill();}}
    ctx.fillStyle=boss&&e.big?(e.v===1?'#b5e07a':e.v===2?'#7dd3ff':'#ff6b2a'):'#EF9F27';ctx.fillRect(4,-50,2.4,2.4);ctx.fillRect(7,-49,2.4,2.4);
    stick(11,-34,16+reach,-15-reach*1.6-sw*2,6,C(col));ctx.fillStyle=C('#4a2010');ctx.beginPath();ctx.arc(16+reach,-14-reach*1.6-sw*2,6,0,7);ctx.fill();
    if(boss)H+=10*s;}
  ctx.restore();H*=1.15;
  if(e.type==='shield'||(e.type==='boss'&&e.v===6)){const fa=e.fa,sr=e.r+(e.type==='boss'?6:4),cx=e.x+Math.cos(fa)*sr,cy=fy-14+Math.sin(fa)*sr*.6,px=-Math.sin(fa),py=Math.cos(fa)*.6,L=e.type==='boss'?26:15,op=e.guard>0;
    ctx.lineCap='round';ctx.strokeStyle=op?'rgba(120,110,100,.6)':C('#5a6470');ctx.lineWidth=e.type==='boss'?11:8;ctx.beginPath();ctx.moveTo(cx-px*L,cy-py*L-(op?-6:0));ctx.lineTo(cx+px*L,cy+py*L-(op?-6:0));ctx.stroke();
    if(!op){ctx.strokeStyle=C('#9aa4b0');ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-px*L*.8,cy-py*L*.8-3);ctx.lineTo(cx+px*L*.8,cy+py*L*.8-3);ctx.stroke();}ctx.lineCap='butt';}
  if(e.buff>0&&e.type!=='howl'){ctx.strokeStyle='rgba(214,90,140,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(e.x,fy,e.r*1.25,e.r*.45,0,0,7);ctx.stroke();}
  if(e.stun>0){ctx.strokeStyle='#f2d14b';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(e.x,fy-H-4,e.r*.6,3,0,0,7);ctx.stroke();}
  if(e.elite){ctx.font='600 12px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillStyle=EMC[e.elite];ctx.fillText('Elite · '+EMN[e.elite],e.x,fy-H-14);}
  if(e.type!=='boss'&&(e.hp<e.max||e.elite)){ctx.fillStyle='#0d0907';ctx.fillRect(e.x-e.r,fy-H-10,e.r*2,3);ctx.fillStyle='#c23a2e';ctx.fillRect(e.x-e.r,fy-H-10,e.r*2*Math.max(0,e.hp)/e.max,3);}}
function drawProp(b){const x=b.x,y=b.y,w=b.w,h=b.h,f=b.flash>0;
  ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(x+3,y+h-2,w,5);
  if(b.type==='crate'){ctx.fillStyle=f?'#ead9c0':'#9a7040';ctx.fillRect(x,y-8,w,h-2);ctx.fillStyle=f?'#ead9c0':'#6b4a2a';ctx.fillRect(x,y+h-10,w,10);
    ctx.strokeStyle='#3a2414';ctx.lineWidth=1.2;ctx.strokeRect(x+.5,y-7.5,w-1,h+7);ctx.beginPath();ctx.moveTo(x,y-1);ctx.lineTo(x+w,y-1);ctx.moveTo(x,y+5);ctx.lineTo(x+w,y+5);ctx.moveTo(x,y+h-10);ctx.lineTo(x+w,y+h-10);ctx.moveTo(x+2,y+h-9);ctx.lineTo(x+w-2,y+h-1);ctx.stroke();}
  else if(b.type==='chest'){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#c9a227'),x-10,y-26,w+20,w+20);ctx.globalCompositeOperation='source-over';
    ctx.fillStyle=f?'#ead9c0':'#5a3a22';rr(ctx,x,y-10,w,h+10,3);ctx.fillStyle=f?'#ead9c0':'#6b4a2a';rr(ctx,x,y-15,w,8,4);ctx.fillStyle='#c9a227';ctx.fillRect(x+4,y-15,3,h+15);ctx.fillRect(x+w-7,y-15,3,h+15);ctx.fillRect(x+w/2-3,y-6,6,6);}
  else{ctx.fillStyle=f?'#ead9c0':'#d8642e';rr(ctx,x,y-12,w,h+12,3);ctx.fillStyle=f?'#ead9c0':'#a84a22';rr(ctx,x-1,y-15,w+2,5,2);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(x+w-5,y-10,4,h+10);
    ctx.fillStyle='#ead9c0';ctx.fillRect(x+3,y-3,w-8,3);}
  if(b.hp<b.max){ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+w*.3,y-6);ctx.lineTo(x+w*.5,y+2);ctx.lineTo(x+w*.4,y+8);ctx.stroke();}}
