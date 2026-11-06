/* ================= world ================= */
const ROADS=[520,1080],BL=[[0,465],[575,1025],[1135,1600]];
let darks=[],G=null,gx=null,walls=[],blds=[],barrels=[],reserved=[],marks=[],brk=[],spati=null,D=DIST[0];
function inWall(x,y,r){return walls.some(o=>x>o.x-r&&x<o.x+o.w+r&&y>o.y-r&&y<o.y+o.h+r);}
function wallAt(x,y){for(const o of walls)if(x>o.x&&x<o.x+o.w&&y>o.y&&y<o.y+o.h)return o;return null;}
function resHit(x,y,w,h){return reserved.some(r=>x<r.x+r.w+20&&x+w+20>r.x&&y<r.y+r.h+20&&y+h+20>r.y);}
function addLm(b){blds.push(b);walls.push(b);reserved.push({x:b.x+(b.ox||0),y:b.y-b.top,w:b.spr.width,h:b.h+b.top});}
function bricks(g,x,y,w,h,step){g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;for(let yy=y+step;yy<y+h;yy+=step){g.beginPath();g.moveTo(x,yy);g.lineTo(x+w,yy);g.stroke();}}
function shade(g,x,y,w,h){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x+w*.7,y,w*.3,h);}

function lmRathaus(){
  const b={x:640,y:300,w:300,h:90,H:84,top:174,lights:[]},c=cnv(b.w,b.h+b.top),g=c.getContext('2d'),R0=b.top-b.H,F0=R0+b.h;
  g.fillStyle='#7a3a26';g.fillRect(0,F0,b.w,b.H);bricks(g,0,F0,b.w,b.H,5);
  for(let r=0;r<2;r++)for(let k=0;k<12;k++){if(k<3)continue;const wx=12+k*24,wy=F0+10+r*36;if((k===7||k===8)&&r===1)continue;const lit=Math.random()<.2;g.fillStyle=lit?'#e0892e':'#110b08';
    g.beginPath();g.moveTo(wx,wy+22);g.lineTo(wx,wy+6);g.arc(wx+5,wy+6,5,Math.PI,0);g.lineTo(wx+10,wy+22);g.fill();if(lit)b.lights.push({x:b.x+wx+5,y:b.y-b.top+wy+12});}
  g.fillStyle='#0b0806';g.beginPath();g.moveTo(186,F0+b.H);g.lineTo(186,F0+b.H-22);g.arc(198,F0+b.H-22,12,Math.PI,0);g.lineTo(210,F0+b.H);g.fill();
  g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,F0,b.w,4);
  g.fillStyle='#4e2219';g.fillRect(0,R0,b.w,b.h);g.fillStyle='#5e2a1e';g.fillRect(0,R0,b.w,b.h/2);
  g.strokeStyle='rgba(0,0,0,.15)';for(let x=3;x<b.w;x+=6){g.beginPath();g.moveTo(x,R0);g.lineTo(x,R0+b.h);g.stroke();}
  g.fillStyle='#2a120c';g.fillRect(0,R0+b.h/2-2,b.w,4);
  for(const dx of [130,190,250]){g.fillStyle='#3a1a12';g.fillRect(dx,R0+b.h/2+8,20,16);g.fillStyle=Math.random()<.5?'#d9822b':'#110b08';g.fillRect(dx+5,R0+b.h/2+12,10,10);}
  const tx=34,tw=56;g.fillStyle='#6e3322';g.fillRect(tx,44,tw,b.h+b.top-44);bricks(g,tx,44,tw,b.h+b.top-44,5);shade(g,tx,44,tw,b.h+b.top-44);
  for(let i=0;i<4;i++){g.fillStyle='#110b08';g.fillRect(tx+tw/2-3,96+i*30,6,14);}
  g.fillStyle='#4a2216';for(let i=0;i<5;i++)g.fillRect(tx+i*12-2,38,8,8);
  g.fillStyle='#2c3a32';g.beginPath();g.moveTo(tx-4,40);g.lineTo(tx+tw+4,40);g.lineTo(tx+tw/2,0);g.fill();g.fillStyle='#3d5045';g.beginPath();g.moveTo(tx-4,40);g.lineTo(tx+tw/2,40);g.lineTo(tx+tw/2,0);g.fill();
  g.fillStyle='#f2d14b';g.beginPath();g.arc(tx+tw/2,66,11,0,7);g.fill();g.strokeStyle='#3a2414';g.lineWidth=2;g.beginPath();g.moveTo(tx+tw/2,66);g.lineTo(tx+tw/2,58);g.moveTo(tx+tw/2,66);g.lineTo(tx+tw/2+6,68);g.stroke();
  b.lights.push({x:b.x+tx+tw/2,y:b.y-b.top+66,r:70});
  b.spr=c;addLm(b);marks.push({x:790,y:420,n:'Rathaus Köpenick'});
  gx.fillStyle='rgba(0,0,0,.3)';gx.fillRect(b.x+b.w,b.y-b.H+14,16,b.h+b.H-14);gx.fillRect(b.x+10,b.y+b.h,b.w,10);
}
function lmSpree(){
  const g=gx,y0=150,y1=250;g.fillStyle='#10171a';g.fillRect(0,y0,WS,y1-y0);
  for(let i=0;i<260;i++){g.fillStyle=`rgba(150,180,190,${R(.03,.1)})`;g.fillRect(R(0,WS),R(y0+6,y1-8),R(8,30),1.5);}
  g.fillStyle='#4a4038';g.fillRect(0,y0-6,WS,6);g.fillRect(0,y1,WS,6);g.fillStyle='rgba(255,230,200,.08)';g.fillRect(0,y0-6,WS,2);g.fillRect(0,y1,WS,2);
  walls.push({x:0,y:y0,w:465,h:y1-y0},{x:575,y:y0,w:450,h:y1-y0},{x:1135,y:y0,w:465,h:y1-y0});
  g.fillStyle='#3a3029';g.fillRect(465,y0-8,110,y1-y0+16);g.fillStyle='#2a221c';g.fillRect(465,y0-8,6,y1-y0+16);g.fillRect(569,y0-8,6,y1-y0+16);
  g.fillStyle='#6b3626';g.fillRect(1025,y0-10,110,y1-y0+20);bricks(g,1025,y0-10,110,y1-y0+20,5);
  g.fillStyle='#4a2216';g.fillRect(1025,y0-10,8,y1-y0+20);g.fillRect(1127,y0-10,8,y1-y0+20);
  g.fillStyle='rgba(0,0,0,.5)';for(let i=0;i<3;i++){g.beginPath();g.arc(1040+i*40,y1+8,13,Math.PI,0);g.fill();}
  for(const tx of [1025,1115]){const b={x:tx,y:192,w:20,h:20,H:96,top:96,lights:[]},c=cnv(20,116),t=c.getContext('2d');
    t.fillStyle='#6b3626';t.fillRect(0,10,20,106);bricks(t,0,10,20,106,5);shade(t,0,10,20,106);t.fillStyle='#4a2216';t.fillRect(0,0,20,12);
    t.fillStyle='#6b3626';for(let i=0;i<3;i++)t.fillRect(i*7,0,5,5);t.fillStyle='#110b08';for(let i=0;i<4;i++)t.fillRect(8,24+i*20,4,10);
    t.fillStyle='#d9822b';t.fillRect(8,24,4,10);b.lights.push({x:tx+10,y:192-96+29,r:40});b.spr=c;addLm(b);}
  reserved.push({x:0,y:120,w:WS,h:160});marks.push({x:1080,y:220,n:'Oberbaumbrücke'});
}
function lmTurm(){
  const b={x:730,y:370,w:140,h:50,H:30,top:330,lights:[]},c=cnv(140,380),g=c.getContext('2d'),cx=70;
  gx.fillStyle='rgba(0,0,0,.28)';gx.beginPath();gx.moveTo(b.x+80,b.y+40);gx.lineTo(b.x+380,b.y+150);gx.lineTo(b.x+392,b.y+138);gx.lineTo(b.x+92,b.y+28);gx.fill();
  gx.beginPath();gx.arc(b.x+300,b.y+122,30,0,7);gx.fill();
  g.fillStyle='#2c2a28';g.fillRect(0,350,140,30);for(let i=0;i<9;i++){g.fillStyle=Math.random()<.2?'#d9822b':'#14181c';g.fillRect(6+i*15,356,10,16);}
  g.fillStyle='#3d3a36';g.fillRect(0,330,140,22);g.fillStyle='rgba(255,230,200,.08)';g.fillRect(0,330,140,2);
  g.fillStyle='#6e6a62';g.fillRect(cx-11,96,22,240);g.fillStyle='#8a8478';g.fillRect(cx-11,96,8,240);g.fillStyle='rgba(0,0,0,.2)';for(let y=110;y<330;y+=14)g.fillRect(cx-11,y,22,1);
  g.fillStyle='#5a5650';g.beginPath();g.arc(cx,72,40,0,7);g.fill();g.fillStyle='#6e6a62';g.beginPath();g.arc(cx-10,62,26,0,7);g.fill();g.fillStyle='#5a5650';g.beginPath();g.arc(cx+4,74,30,0,7);g.fill();
  for(let i=0;i<12;i++){const x=cx-38+i*6.4;g.fillStyle=Math.random()<.6?'#d9822b':'#14181c';g.fillRect(x,70,5,9);}
  g.fillStyle='#0d0806';g.beginPath();g.arc(cx+22,58,8,0,7);g.fill();
  for(let i=0;i<8;i++){g.fillStyle=i%2?'#8a8478':'#7a2a1e';g.fillRect(cx-2.5,i*4,5,4);}
  b.lights.push({x:b.x+cx,y:b.y-b.top+74,r:130});b.spr=c;addLm(b);marks.push({x:800,y:440,n:'Fernsehturm'});
}
function lmTempelhof(){
  const g=gx;g.fillStyle='#2e2c27';g.fillRect(1135,575,465,1025);
  for(let i=0;i<60;i++){g.fillStyle='rgba(60,70,30,.18)';g.beginPath();g.ellipse(R(1140,1600),R(580,1600),R(20,60),R(10,30),0,0,7);g.fill();}
  g.strokeStyle='rgba(234,217,192,.16)';g.lineWidth=4;g.setLineDash([30,26]);g.beginPath();g.moveTo(1370,600);g.lineTo(1370,1600);g.stroke();g.setLineDash([]);
  for(let i=0;i<6;i++){g.fillStyle='rgba(234,217,192,.12)';g.fillRect(1320+i*18,620,8,40);}
  const P0=[{x:1330,y:900,w:22,h:160},{x:1262,y:960,w:150,h:30},{x:1315,y:1042,w:52,h:14}];
  g.fillStyle='rgba(0,0,0,.4)';P0.forEach(r=>g.fillRect(r.x+6,r.y+8,r.w,r.h));
  P0.forEach((r,i)=>{g.fillStyle=i===1?'#55524a':'#5e5a52';g.fillRect(r.x,r.y,r.w,r.h);walls.push(r);});
  g.fillStyle='rgba(255,230,200,.1)';g.fillRect(1330,900,6,160);g.fillStyle='#14181c';for(let i=0;i<9;i++)g.fillRect(1338,912+i*14,6,5);
  g.fillStyle='#0d0806';g.fillRect(1380,960,10,30);g.beginPath();g.ellipse(1341,902,12,6,0,0,7);g.fill();
  const gr=g.createRadialGradient(1340,975,0,1340,975,80);gr.addColorStop(0,'rgba(5,3,2,.7)');gr.addColorStop(1,'rgba(5,3,2,0)');g.fillStyle=gr;g.fillRect(1260,895,160,160);
  barrels.push({x:1300,y:1080,ph:1},{x:1405,y:1010,ph:2});walls.push({x:1291,y:1071,w:18,h:18},{x:1396,y:1001,w:18,h:18});
  reserved.push({x:1135,y:575,w:465,h:1025});marks.push({x:1340,y:990,n:'Tempelhofer Feld'});
  const b={x:600,y:1300,w:400,h:80,H:58,top:58,lights:[]},c=cnv(400,138),t=c.getContext('2d');
  t.fillStyle='#4a4740';t.fillRect(0,80,400,58);t.fillStyle='rgba(0,0,0,.2)';for(let x=0;x<400;x+=8)t.fillRect(x,80,1,58);
  for(let i=0;i<4;i++){const dx=22+i*96;const lit=i===2;t.fillStyle=lit?'#c9752a':'#0e0c0a';t.fillRect(dx,92,70,46);t.fillStyle='rgba(0,0,0,.35)';for(let k=0;k<5;k++)t.fillRect(dx,98+k*8,70,2);if(lit)b.lights.push({x:600+dx+35,y:1300-58+80+30,r:90});}
  t.fillStyle='rgba(0,0,0,.45)';t.fillRect(0,80,400,4);t.fillStyle='#3f3d38';t.fillRect(0,0,400,80);for(let x=20;x<400;x+=40){t.fillStyle='#1d2228';t.fillRect(x,10,14,60);}
  t.fillStyle='rgba(255,230,200,.1)';t.fillRect(0,0,400,2);b.spr=c;addLm(b);marks.push({x:800,y:1400,n:'Flughafen Tempelhof'});
  gx.fillStyle='rgba(0,0,0,.3)';gx.fillRect(b.x+b.w,b.y-b.H+14,16,b.h+b.H-14);gx.fillRect(b.x+10,b.y+b.h,b.w,10);
}
function lmNeukoelln(){
  const b={x:585,y:300,w:430,h:90,H:96,top:150,lights:[]},c=cnv(b.w,b.h+b.top),g=c.getContext('2d'),R0=b.top-b.H,F0=R0+b.h;
  g.fillStyle='#8a7a62';g.fillRect(0,F0,b.w,b.H);g.fillStyle='rgba(0,0,0,.12)';for(let x=0;x<b.w;x+=24)g.fillRect(x,F0,3,b.H);
  for(let k=3;k<15;k++){const wx=10+k*24;for(let r=0;r<3;r++){const lit=Math.random()<.12;g.fillStyle=lit?'#e0892e':'#14181c';g.fillRect(wx+5,F0+20+r*24,12,16);if(lit)b.lights.push({x:b.x+wx+11,y:b.y-b.top+F0+28+r*24});}}
  g.fillStyle='#1a1e22';g.fillRect(120,F0+3,190,15);g.fillStyle='#f2d14b';g.font='600 12px sans-serif';g.textAlign='center';g.fillText('K A U F H A U S',215,F0+14);
  g.fillStyle='#0b0806';g.fillRect(170,F0+b.H-24,90,24);g.fillStyle='rgba(224,137,46,.2)';g.fillRect(176,F0+b.H-20,78,20);
  g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,F0,b.w,4);g.fillStyle='#4a4238';g.fillRect(0,R0,b.w,b.h);for(let i=0;i<5;i++){g.fillStyle='#2a2420';g.fillRect(90+i*55,R0+20,28,18);}
  g.fillStyle='rgba(255,230,200,.1)';g.fillRect(0,R0,b.w,2);
  for(const tx of [14,b.w-74]){g.fillStyle='#9a8a70';g.fillRect(tx,0,60,F0+b.H);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(tx+42,0,18,F0+b.H);
    for(let i=0;i<4;i++){g.fillStyle='#7dd3ff';g.globalAlpha=.55;g.fillRect(tx+8+i*12,6,5,F0-10);g.globalAlpha=1;}g.fillStyle='#6a5e4c';g.fillRect(tx-3,0,66,6);
    b.lights.push({x:b.x+tx+30,y:b.y-b.top+40,r:95});}
  b.spr=c;addLm(b);marks.push({x:800,y:440,n:'Hermannplatz'});
  gx.fillStyle='rgba(0,0,0,.3)';gx.fillRect(b.x+b.w,b.y-b.H+14,16,b.h+b.H-14);gx.fillRect(b.x+10,b.y+b.h,b.w,10);
}
/* ---- Späti: enterable shop ---- */
function makeSpati(){
  const w=176,h=118,H=50,dw=36,cands=[];for(let bi=0;bi<3;bi++)for(let bj=0;bj<3;bj++)if(!(bi===1&&bj===1))cands.push([bi,bj]);
  cands.sort(()=>Math.random()-.5);
  for(const[bi,bj]of cands){const[x0,x1]=BL[bi],[y0,y1]=BL[bj];
    for(let k=0;k<12;k++){const x=Math.round(R(x0+30,x1-30-w)),y=Math.round(R(y0+30+H,y1-30-h-70));if(y<y0+30+H||x<x0+20)continue;
      if(resHit(x,y-H,w,h+H+70))continue;
      const dx=w-64,sp={x,y,w,h,H,top:H,dx,dw,lights:[],fade:1,isSpati:true,name:D.spati,seen:false};
      const g=gx;
      for(let ty=y;ty<y+h;ty+=12)for(let tx=x;tx<x+w;tx+=12){g.fillStyle=((tx-x)/12+(ty-y)/12)%2?'#4a4036':'#3e352c';g.fillRect(tx,ty,12,12);}
      g.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<6;i++){g.beginPath();g.ellipse(x+R(10,w-10),y+R(10,h-10),R(8,18),R(5,10),0,0,7);g.fill();}
      const shelf=(sx,sy,sw)=>{g.fillStyle='#2a1f18';g.fillRect(sx,sy,sw,12);g.fillStyle='#5a4030';g.fillRect(sx,sy,sw,3);
        for(let i=sx+3;i<sx+sw-3;i+=5){g.fillStyle=pick(['#c23a2e','#f2d14b','#7d9bff','#8fd16a','#ead9c0','#d8642e']);g.fillRect(i,sy+4,3,6);}walls.push({x:sx,y:sy,w:sw,h:12});};
      shelf(x+10,y+8,w-20);shelf(x+30,y+48,78);
      g.fillStyle='#3a2a20';g.fillRect(x+10,y+h-38,52,14);g.fillStyle='#5a4030';g.fillRect(x+10,y+h-38,52,3);g.fillStyle='#14181c';g.fillRect(x+16,y+h-36,12,8);
      walls.push({x:x+10,y:y+h-38,w:52,h:14});
      walls.push({x,y,w,h:6},{x,y,w:6,h},{x:x+w-6,y,w:6,h},{x,y:y+h-6,w:dx,h:6},{x:x+dx+dw,y:y+h-6,w:w-dx-dw,h:6});
      const c=cnv(w,h+H),t=c.getContext('2d');
      t.fillStyle='#352a24';t.fillRect(0,0,w,h);for(let i=0;i<w*h/40;i++){t.fillStyle=Math.random()<.5?'rgba(0,0,0,.15)':'rgba(255,230,200,.04)';t.fillRect(R(0,w),R(0,h),2,2);}
      t.fillStyle='#4a4038';t.fillRect(20,20,26,18);t.fillStyle='#2a221c';t.fillRect(24,24,18,10);t.fillStyle='rgba(255,230,200,.12)';t.fillRect(0,0,w,2);
      t.fillStyle='#5a3f2e';t.fillRect(0,h,w,H);bricks(t,0,h,w,H,6);
      t.fillStyle='#1a1e22';t.fillRect(28,h+3,w-56,15);t.fillStyle='#f2d14b';t.font='600 12px sans-serif';t.textAlign='center';t.fillText('S P Ä T I',w/2,h+15);
      for(let i=0;i<w;i+=12){t.fillStyle=(i/12)%2?'#ead9c0':'#c23a2e';t.fillRect(i,h+20,12,8);}
      t.fillStyle='#e0892e';t.fillRect(10,h+31,56,15);for(let i=14;i<62;i+=6){t.fillStyle='rgba(40,20,10,.55)';t.fillRect(i,h+35,3,11);}
      t.fillStyle='#110b08';t.fillRect(74,h+31,28,15);
      t.fillStyle='#0b0806';t.fillRect(dx,h+28,dw,H-28);t.fillStyle='rgba(224,137,46,.25)';t.fillRect(dx+4,h+32,dw-8,H-32);
      t.fillStyle='rgba(0,0,0,.45)';t.fillRect(0,h,w,3);t.strokeStyle='rgba(0,0,0,.5)';t.lineWidth=2;t.strokeRect(1,1,w-2,h-2);
      sp.spr=c;sp.lights.push({x:x+38,y:y+h-12,r:70},{x:x+w/2,y:y+h/2,r:0,inner:1});blds.push(sp);reserved.push({x,y:y-H,w,h:h+H+70});spati=sp;
      gx.fillStyle='rgba(0,0,0,.3)';gx.fillRect(x+w,y-H+14,14,h+H-14);
      [[x+w-30,y+30],[x+120,y+80],[x+18,y+40]].forEach(p=>addBrk(p[0],p[1],'crate',true));
      return;}}
}
function makeDark(){const cands=[];for(let bi=0;bi<3;bi++)for(let bj=0;bj<3;bj++)if(!(bi===1&&bj===1))cands.push([bi,bj]);cands.sort(()=>Math.random()-.5);
  for(const[bi,bj]of cands){const[x0,x1]=BL[bi],[y0,y1]=BL[bj],w=Math.min(290,x1-x0-60),h=Math.min(230,y1-y0-60),x=x0+30+R(0,Math.max(0,x1-x0-60-w)),y=y0+30+R(0,Math.max(0,y1-y0-60-h));
    if(resHit(x,y,w,h))continue;const g=gx;
    g.fillStyle='rgba(8,6,5,.55)';g.fillRect(x,y,w,h);for(let i=0;i<70;i++){g.fillStyle=pick(['#2a221c','#1f1915','#3a2e25']);g.fillRect(x+R(0,w),y+R(0,h),R(4,14),R(3,9));}
    g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.strokeRect(x,y,w,h);
    g.fillStyle='#24201c';g.fillRect(x+16,y-10,4,28);g.fillStyle='#1d4a8a';g.fillRect(x+6,y-30,24,24);g.fillStyle='#fff';g.font='700 18px sans-serif';g.textAlign='center';g.fillText('U',x+18,y-11);
    reserved.push({x,y,w,h});darks.push({x,y,w,h,seen:false});
    for(let k=0;k<4;k++){const rx=x+R(20,w-60),ry=y+R(20,h-40),rw=R(24,44),rh=R(14,24);if(Math.hypot(rx+rw/2-(x+w/2),ry+rh/2-(y+h/2))<60)continue;
      g.fillStyle='rgba(0,0,0,.4)';g.fillRect(rx+3,ry+4,rw,rh);g.fillStyle='#3a2e25';g.fillRect(rx,ry,rw,rh);g.fillStyle='#4a3a2e';g.fillRect(rx,ry,rw,4);walls.push({x:rx,y:ry,w:rw,h:rh});}
    addBrk(x+w/2,y+h/2,'chest',true);return;}}
function addBrk(x,y,type,inside){const w={crate:22,bin:18,chest:28}[type],h={crate:18,bin:14,chest:18}[type],hp={crate:3,bin:2,chest:5}[type],b={x:x-w/2,y:y-h/2,w,h,type,inside,hp,max:hp,flash:0,brk:true};brk.push(b);walls.push(b);}
/* ---- props ---- */
function makeTree(tx,ty,kind){
  const Rr=R(18,28),W=Math.ceil(Rr*2+10),Ht=Math.ceil(Rr*2+30),c=cnv(W,Ht),g=c.getContext('2d'),cx=W/2,base=Ht-4;
  g.fillStyle='#2a1d14';g.fillRect(cx-3,base-30,6,30);g.fillStyle='#3a2a1e';g.fillRect(cx-3,base-30,2,30);
  if(kind==='dead'){g.strokeStyle='#2a1d14';g.lineCap='round';for(let i=0;i<6;i++){const a=-Math.PI/2+R(-1.1,1.1),l=R(Rr*.6,Rr);g.lineWidth=R(1.5,3);g.beginPath();g.moveTo(cx,base-26);g.lineTo(cx+Math.cos(a)*l,base-26+Math.sin(a)*l);g.stroke();}}
  else{const pal=kind==='autumn'?['#6b4a1e','#7a5a24','#5a3a16','#8a6a2a']:['#2f3b1c','#3b4a22','#4a5a2a','#26301a'],cy=base-30-Rr*.55;
    for(let i=0;i<9;i++){g.fillStyle=pal[i%pal.length];const a=R(0,6.28),d=R(0,Rr*.45);g.beginPath();g.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d*.8,Rr*R(.45,.65),0,7);g.fill();}
    g.fillStyle='rgba(255,230,180,.07)';g.beginPath();g.arc(cx-Rr*.3,cy-Rr*.35,Rr*.4,0,7);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.arc(cx+Rr*.3,cy+Rr*.3,Rr*.45,0,7);g.fill();}
  gx.fillStyle='rgba(0,0,0,.3)';gx.beginPath();gx.ellipse(tx+6,ty+2,Rr*.9,Rr*.4,0,0,7);gx.fill();
  blds.push({x:tx-cx,y:ty,w:W,h:0,top:base,spr:c,lights:[]});walls.push({x:tx-4,y:ty-5,w:8,h:7});
}
function makeLamp(lx_,ly,lit){
  const c=cnv(22,70),g=c.getContext('2d');g.fillStyle='#24201c';g.fillRect(4,8,4,62);g.fillRect(2,66,8,4);g.fillRect(4,8,14,3);
  g.fillStyle='#3a342e';g.fillRect(14,9,7,5);g.fillStyle=lit?'#f7d98a':'#1a1612';g.fillRect(15,13,5,2);
  blds.push({x:lx_-6,y:ly,w:22,h:0,top:70,spr:c,lights:lit?[{x:lx_+11,y:ly-8,r:105}]:[]});walls.push({x:lx_-3,y:ly-3,w:6,h:5});
}
function decorate(){
  const g=gx,greens=['#3b4a22','#4a5a2a','#2f3b1c','#56662e'];
  for(let i=0;i<220;i++){const p=pick(ROADS),v=Math.random()<.5,a=R(0,WS),o=pick([-1,1])*R(40,56),x=v?p+o:a,y=v?a:p+o;g.strokeStyle=pick(greens);g.lineWidth=1.2;
    for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+k*1.5,y);g.lineTo(x+k*1.5+R(-3,3),y-R(3,7));g.stroke();}}
  for(let i=0;i<45;i++){const x=R(0,WS),y=R(0,WS);if(inWall(x,y,10))continue;for(let k=0;k<5;k++){g.fillStyle=pick(greens);g.beginPath();g.arc(x+R(-8,8),y+R(-5,5),R(4,8),0,7);g.fill();}}
  for(let i=0;i<5;i++){const p=pick(ROADS),v=Math.random()<.5,a=R(80,WS-80),x=v?p+62:a,y=v?a:p+62;if(inWall(x,y,26)||resHit(x-20,y-6,40,12))continue;
    g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-18,y+3,38,6);g.fillStyle='#4a3424';for(let k=0;k<3;k++)g.fillRect(x-18,y-6+k*4,36,3);g.fillStyle='#24201c';g.fillRect(x-16,y+4,3,5);g.fillRect(x+13,y+4,3,5);}
  for(let i=0;i<8;i++){const p=pick(ROADS),a=R(60,WS-60),v=Math.random()<.5,x=v?p+R(-20,20):a,y=v?a:p+R(-20,20);g.fillStyle='#1c1612';g.beginPath();g.arc(x,y,9,0,7);g.fill();g.strokeStyle='#3a3029';g.lineWidth=1.5;g.beginPath();g.arc(x,y,9,0,7);g.stroke();g.beginPath();g.moveTo(x-6,y);g.lineTo(x+6,y);g.moveTo(x,y-6);g.lineTo(x,y+6);g.stroke();}
}
function buildWorld(d){
  D=d;G=cnv(WS,WS);gx=G.getContext('2d');walls=[];blds=[];barrels=[];reserved=[];marks=[];brk=[];spati=null;darks=[];const g=gx;
  g.fillStyle=d.ground;g.fillRect(0,0,WS,WS);
  const sp=['rgba(255,230,200,.04)','rgba(0,0,0,.18)','rgba(0,0,0,.1)','rgba(120,80,50,.08)'];
  for(let i=0;i<5000;i++){g.fillStyle=pick(sp);const s=R(1,5);g.fillRect(R(0,WS),R(0,WS),s,s);}
  const cob=['#3a2e25','#342920','#40332a','#2f251e'];
  for(let y=575;y<1025;y+=10)for(let x=575+((y/10)%2)*6;x<1025;x+=12){g.fillStyle=pick(cob);g.fillRect(x,y,10,8);}
  for(const p of ROADS){g.fillStyle=d.road;g.fillRect(p-55,0,110,WS);g.fillRect(0,p-55,WS,110);}
  for(const p of ROADS){g.fillStyle='#3a2f27';g.fillRect(p-55,0,12,WS);g.fillRect(p+43,0,12,WS);g.fillRect(0,p-55,WS,12);g.fillRect(0,p+43,WS,12);}
  for(const p of ROADS)for(const q of ROADS){g.fillStyle=d.road;g.fillRect(p-43,q-43,86,86);}
  g.strokeStyle='rgba(234,217,192,.09)';g.lineWidth=3;g.setLineDash([24,30]);
  for(const p of ROADS){g.beginPath();g.moveTo(p,0);g.lineTo(p,WS);g.stroke();}
  g.beginPath();g.moveTo(0,520);g.lineTo(WS,520);g.stroke();g.setLineDash([]);
  for(let x=0;x<WS;x+=14){g.fillStyle='#1c1511';g.fillRect(x,1080-16,5,32);}
  g.strokeStyle='#6b5a4a';g.lineWidth=2;[1080-10,1080+10].forEach(y=>{g.beginPath();g.moveTo(0,y);g.lineTo(WS,y);g.stroke();});
  for(let i=0;i<40;i++){const p=pick(ROADS),v=Math.random()<.5,a=R(0,WS),o=R(-40,40);g.fillStyle='rgba(8,5,4,.5)';g.beginPath();g.ellipse(v?p+o:a,v?a:p+o,R(6,16),R(4,10),R(0,3),0,7);g.fill();}
  for(let i=0;i<46;i++){const x=R(0,WS),y=R(0,WS),r=R(20,60),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(8,5,3,.55)');gr.addColorStop(1,'rgba(8,5,3,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  g.strokeStyle='rgba(10,6,4,.55)';g.lineWidth=1.5;for(let i=0;i<150;i++){let x=R(0,WS),y=R(0,WS);g.beginPath();g.moveTo(x,y);for(let k=0;k<4;k++){x+=R(-22,22);y+=R(-22,22);g.lineTo(x,y);}g.stroke();}
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(806,708,38,0,7);g.fill();
  g.fillStyle='#5a4636';g.beginPath();g.arc(800,700,36,0,7);g.fill();g.fillStyle='#14100d';g.beginPath();g.arc(800,700,27,0,7);g.fill();
  g.fillStyle='#6b5543';g.beginPath();g.arc(800,700,8,0,7);g.fill();g.strokeStyle='rgba(255,230,200,.12)';g.lineWidth=2;g.beginPath();g.arc(800,700,35,3.4,5.6);g.stroke();
  walls.push({x:768,y:668,w:64,h:64});
  [lmRathaus,lmSpree,lmTurm,lmTempelhof,lmNeukoelln][d.i]();
  makeSpati();makeDark();makeDark();
  for(let bi=0;bi<3;bi++)for(let bj=0;bj<3;bj++){if(bi===1&&bj===1)continue;const[x0,x1]=BL[bi],[y0,y1]=BL[bj];let n=0,tries=0;
    while(n<3&&tries++<80){const w=R(90,190),h=R(50,105),H=R(38,68),x=R(x0+24,x1-24-w),y=R(y0+24+H,y1-24-h);
      if(resHit(x,y-H,w,h+H))continue;
      if(blds.some(o=>o.h>0&&x<o.x+o.w+30&&x+w+30>o.x&&y-H<o.y+o.h+30&&y+h+30>o.y-o.top))continue;const b={x,y,w,h,H,top:H};makeB(b);blds.push(b);walls.push(b);n++;}}
  let ct=0;for(let i=0;i<70&&ct<11;i++){const p=pick(ROADS),v=Math.random()<.5,a=R(40,WS-90),w=v?22:48,h=v?48:22,x=v?p+R(-32,32)-w/2:a,y=v?a:p+R(-32,32)-h/2;
    if(Math.hypot(x+w/2-800,y+h/2-820)<230||inWall(x+w/2,y+h/2,46)||resHit(x,y,w,h))continue;drawCar(x,y,w,h,v);walls.push({x,y,w,h});ct++;}
  for(const q of [[700,780],[900,780]]){barrels.push({x:q[0],y:q[1],ph:R(0,6)});walls.push({x:q[0]-9,y:q[1]-9,w:18,h:18});}
  let tr=0;while(barrels.length<16&&tr++<400){const p=pick(ROADS),side=pick([-1,1]),v=Math.random()<.5,a=R(60,WS-60),o=side*R(46,58),x=v?p+o:a,y=v?a:p+o;
    if(inWall(x,y,24)||resHit(x-9,y-9,18,18)||Math.hypot(x-800,y-820)<160)continue;barrels.push({x,y,ph:R(0,6)});walls.push({x:x-9,y:y-9,w:18,h:18});}
  let lt=0,ln=0;while(ln<12&&lt++<300){const p=pick(ROADS),side=pick([-1,1]),v=Math.random()<.5,a=R(60,WS-60),x=v?p+side*50:a,y=v?a:p+side*50;
    if(inWall(x,y,30)||resHit(x-6,y-70,22,72)||Math.hypot(x-800,y-820)<120)continue;makeLamp(x,y,Math.random()<.55);ln++;}
  let tt=0,tn=0;while(tn<d.trees&&tt++<500){const x=R(30,WS-30),y=R(60,WS-20);
    if(inWall(x,y,34)||resHit(x-28,y-60,56,62)||Math.abs(x-520)<70||Math.abs(x-1080)<70||Math.abs(y-520)<70||Math.abs(y-1080)<70||Math.hypot(x-800,y-820)<200)continue;
    makeTree(x,y,d.i===2?pick(['dead','green','dead']):d.i===3?pick(['dead','autumn']):pick(['green','green','autumn','dead']));tn++;}
  let bt=0,bn=0;while(bn<16&&bt++<500){const x=R(40,WS-40),y=R(40,WS-40),ty=Math.random()<.45?'bin':'crate';if(inWall(x,y,26)||resHit(x-12,y-12,24,24)||Math.hypot(x-800,y-820)<120)continue;addBrk(x,y,ty,false);bn++;}
  decorate();
  MB=cnv(192,192);const mg=MB.getContext('2d');mg.drawImage(G,0,0,192,192);mg.fillStyle='rgba(0,0,0,.3)';mg.fillRect(0,0,192,192);mg.fillStyle='rgba(234,217,192,.32)';for(const b of blds)if(b.h>0)mg.fillRect(b.x*.12,b.y*.12,b.w*.12,b.h*.12);mg.fillStyle='rgba(0,0,0,.65)';for(const z of darks)mg.fillRect(z.x*.12,z.y*.12,z.w*.12,z.h*.12);mg.fillStyle='#1d4a8a';for(const z of darks)mg.fillRect(z.x*.12,z.y*.12-3,4,4);
}
const TAGS=['KIEZ','BERLIN','LIEBE','RUINE','WIR BLEIBEN','HALT DURCH','SPREE','B36','HOFFNUNG','KEIN AUSGANG'];
function makeB(b){
  const c=cnv(b.w,b.h+b.H),g=c.getContext('2d'),wall=pick(D.walls),roof=pick(D.roof);
  g.fillStyle=wall;g.fillRect(0,b.h,b.w,b.H);bricks(g,0,b.h,b.w,b.H,6);
  b.lights=[];const rows=Math.max(1,Math.floor((b.H-16)/20)),cols=Math.max(1,Math.floor((b.w-10)/18)),ox=(b.w-cols*18)/2+4;
  for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const wx=ox+k*18,wy=b.h+7+r*20,q=Math.random();
    if(q<.1){g.fillStyle='#e0892e';g.fillRect(wx,wy,9,12);g.fillStyle='rgba(255,215,150,.55)';g.fillRect(wx+1,wy+1,3,10);b.lights.push({x:b.x+wx+4.5,y:b.y-b.H+wy+6});}
    else if(q<.3){g.fillStyle='#4a3424';g.fillRect(wx,wy,9,12);g.fillStyle='#24180f';g.fillRect(wx,wy+3,9,2);g.fillRect(wx,wy+8,9,2);}
    else{g.fillStyle='#110b08';g.fillRect(wx,wy,9,12);}}
  g.fillStyle='#0b0806';g.fillRect(Math.floor(R(8,b.w-20)),b.h+b.H-17,12,17);
  if(Math.random()<.55){g.save();g.globalAlpha=.75;g.fillStyle=pick(['#d4537e','#7d9bff','#8fd16a','#f2d14b','#ead9c0','#d8642e']);g.font='600 '+Math.round(R(9,13))+'px sans-serif';
    g.translate(R(6,b.w*.5),b.h+b.H-R(4,10));g.rotate(R(-.12,.06));g.fillText(pick(TAGS),0,0);g.restore();}
  g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,b.h,b.w,4);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,b.h+b.H-3,b.w,3);
  for(let i=0;i<3;i++){const x=R(0,b.w),y=R(b.h,b.h+b.H),r=R(10,24),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(5,3,2,.55)');gr.addColorStop(1,'rgba(5,3,2,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  g.fillStyle=roof;g.fillRect(0,0,b.w,b.h);
  for(let i=0;i<b.w*b.h/30;i++){g.fillStyle=Math.random()<.5?'rgba(0,0,0,.15)':'rgba(255,230,200,.04)';g.fillRect(R(0,b.w),R(0,b.h),2,2);}
  for(let i=0;i<Math.floor(R(1,4));i++){g.fillStyle='#2a1f19';const vx=R(6,b.w-20),vy=R(6,b.h-16);g.fillRect(vx,vy,12,9);g.fillStyle='rgba(255,230,200,.08)';g.fillRect(vx,vy,12,2);}
  if(Math.random()<.4){for(let i=0;i<6;i++){g.fillStyle=pick(['#3b4a22','#4a5a2a','#2f3b1c']);g.beginPath();g.arc(R(6,b.w-6),R(6,b.h-6),R(3,7),0,7);g.fill();}}
  if(Math.random()<.65){const cx=R(b.w*.25,b.w*.75),cy=R(b.h*.3,b.h*.7),rr_=Math.min(b.w,b.h)*R(.18,.3);g.fillStyle='#0d0806';g.beginPath();
    for(let a=0;a<6.28;a+=.5){const q=rr_*R(.6,1.15);g.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q*.8);}g.closePath();g.fill();
    for(let i=0;i<14;i++){g.fillStyle=pick(['#4a3a2e','#5a4636','#3a2c22']);const a=R(0,6.28),q=rr_*R(.9,1.5);g.fillRect(cx+Math.cos(a)*q,cy+Math.sin(a)*q*.8,R(3,7),R(2,5));}}
  g.fillStyle='rgba(255,225,190,.13)';g.fillRect(0,0,b.w,2);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=2;g.strokeRect(1,1,b.w-2,b.h-2);
  g.globalCompositeOperation='destination-out';for(let i=0;i<3;i++){const x=R(0,b.w),s=R(8,22);g.beginPath();g.moveTo(x-s,0);g.lineTo(x+s,0);g.lineTo(x+R(-4,4),R(6,s));g.fill();}g.globalCompositeOperation='source-over';
  b.spr=c;
  gx.fillStyle='rgba(0,0,0,.32)';gx.fillRect(b.x+b.w,b.y-b.H+14,14,b.h+b.H-14);gx.fillRect(b.x+10,b.y+b.h,b.w,9);
  for(let i=0;i<10;i++){gx.fillStyle=pick(['#4a3a2e','#3d3027','#5a4636']);const s=R(3,9);gx.fillRect(b.x+R(-12,b.w+6),b.y+b.h+R(0,14),s,s*.7);}
}
function drawCar(x,y,w,h,v){const g=gx;g.fillStyle='rgba(0,0,0,.4)';g.fillRect(x+4,y+5,w,h);g.fillStyle='#0c0907';
  if(v){g.fillRect(x-2,y+6,4,9);g.fillRect(x+w-2,y+6,4,9);g.fillRect(x-2,y+h-15,4,9);g.fillRect(x+w-2,y+h-15,4,9);}else{g.fillRect(x+6,y-2,9,4);g.fillRect(x+w-15,y-2,9,4);g.fillRect(x+6,y+h-2,9,4);g.fillRect(x+w-15,y+h-2,9,4);}
  g.fillStyle=pick(['#6b3a24','#4a4038','#5c4a2e','#3d3a36','#5a2e22']);g.fillRect(x,y,w,h);
  g.fillStyle='rgba(0,0,0,.3)';if(v)g.fillRect(x+3,y+12,w-6,h-24);else g.fillRect(x+12,y+3,w-24,h-6);
  g.fillStyle='#1a1e22';if(v){g.fillRect(x+4,y+8,w-8,5);g.fillRect(x+4,y+h-13,w-8,4);}else{g.fillRect(x+8,y+4,5,h-8);g.fillRect(x+w-12,y+4,4,h-8);}
  const gr=g.createRadialGradient(x+w*R(.3,.7),y+h*R(.3,.7),0,x+w/2,y+h/2,Math.max(w,h)*.6);gr.addColorStop(0,'rgba(5,3,2,.7)');gr.addColorStop(1,'rgba(5,3,2,0)');g.fillStyle=gr;g.fillRect(x,y,w,h);
  for(let i=0;i<12;i++){g.fillStyle='rgba(186,100,40,.35)';g.fillRect(x+R(0,w-2),y+R(0,h-2),2,2);}}
function stamp(x,y,col,r){gx.fillStyle=col;for(let i=0;i<5;i++){gx.beginPath();gx.ellipse(x+R(-r,r)*.6,y+R(-r,r)*.4,R(r*.3,r*.7),R(r*.2,r*.45),R(0,3),0,7);gx.fill();}}
function collide(o){
  for(const r of walls){const cx=clamp(o.x,r.x,r.x+r.w),cy=clamp(o.y,r.y,r.y+r.h),dx=o.x-cx,dy=o.y-cy,d2=dx*dx+dy*dy;
    if(d2<o.r*o.r){if(d2===0){const l=o.x-r.x,ri=r.x+r.w-o.x,t=o.y-r.y,b=r.y+r.h-o.y,m=Math.min(l,ri,t,b);
        if(m===l)o.x=r.x-o.r;else if(m===ri)o.x=r.x+r.w+o.r;else if(m===t)o.y=r.y-o.r;else o.y=r.y+r.h+o.r;}
      else{const d=Math.sqrt(d2);o.x=cx+dx/d*o.r;o.y=cy+dy/d*o.r;}}}
  o.x=clamp(o.x,o.r,WS-o.r);o.y=clamp(o.y,o.r,WS-o.r);}
