/* ================= world ================= */
// roads: RX vertical road centres, RY horizontal. Blocks (BLK) are the lots between them. The legacy 1600 map sits in the middle, shifted by OFF.
// BSC: building footprint scale, BHS: facade height scale (v0.40 made buildings bigger; turn down here if it gets too bulky)
const OFF=400,BSC=1.6,BHS=2;let SX=1200,SY=1220;let neons=[],RX=[920,1480],RY=[920,1480],BLK=[],waters=[];
let darks=[],G=null,gx=null,walls=[],blds=[],barrels=[],reserved=[],marks=[],brk=[],spati=null,D=DIST[0];
// rotated boxes (b.rot): the wall entry keeps the axis-aligned bounds in x,y,w,h for the grid and points to the box in ob. obL: point in the box's local frame (centre 0,0)
const obL=(b,x,y)=>{const c=Math.cos(b.rot),s=Math.sin(b.rot),dx=x-b.x-b.w/2,dy=y-b.y-b.h/2;return[dx*c+dy*s,-dx*s+dy*c];},
  obW=(b,u,v)=>{const c=Math.cos(b.rot),s=Math.sin(b.rot);return[b.x+b.w/2+u*c-v*s,b.y+b.h/2+u*s+v*c];},
  obbC=b=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(q=>obW(b,q[0]*b.w/2,q[1]*b.h/2)),
  front=(b,x,y)=>{if(!b.rot)return x>=b.x+b.w||y>=b.y+b.h;const[u,v]=obL(b,x,y);return u>=b.w/2||v>=b.h/2;};
function obWall(b){const C=obbC(b),xs=C.map(p=>p[0]),ys=C.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);return{x,y,w:Math.max(...xs)-x,h:Math.max(...ys)-y,ob:b,brk:b.brk};}
const inO=(o,x,y,r)=>{if(!o.ob)return x>o.x-r&&x<o.x+o.w+r&&y>o.y-r&&y<o.y+o.h+r;const[u,v]=obL(o.ob,x,y);return Math.abs(u)<o.ob.w/2+r&&Math.abs(v)<o.ob.h/2+r;};
function inWall(x,y,r){return walls.some(o=>inO(o,x,y,r));}
function wallAt(x,y){for(const o of nearWalls(x,y,1))if(!o.water&&!(o.gate&&!spSafe())&&inO(o,x,y,0))return o;return null;}
function resHit(x,y,w,h,nr){return reserved.some(r=>!(nr&&r.road)&&x<r.x+r.w+20&&x+w+20>r.x&&y<r.y+r.h+20&&y+h+20>r.y);}
// iso shadow on the ground: light from screen top-left, so shadows fall along world +x, length by height
function bShadow(b){if(b.rot){gx.save();const cx=b.x+b.w/2,cy=b.y+b.h/2;gx.translate(cx,cy);gx.rotate(b.rot);gx.translate(-cx,-cy);bShadow({...b,rot:0});gx.restore();return;}const L=Math.min(160,(b.FH||b.H)*(b.vs||1)*.45),g=gx;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.moveTo(b.x+b.w,b.y);g.lineTo(b.x+b.w+L,b.y+L*.25);g.lineTo(b.x+b.w+L,b.y+b.h+L*.25);g.lineTo(b.x+b.w,b.y+b.h);g.fill();g.fillRect(b.x+6,b.y+b.h,b.w,8);}
function addLm(b){b.vs=b.vs||1.5;blds.push(b);walls.push(b);reserved.push({x:b.x+(b.ox||0),y:b.y-b.top,w:b.spr.width,h:b.h+b.top});}
function bricks(g,x,y,w,h,step){g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;for(let yy=y+step;yy<y+h;yy+=step){g.beginPath();g.moveTo(x,yy);g.lineTo(x+w,yy);g.stroke();}}
function shade(g,x,y,w,h){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x+w*.7,y,w*.3,h);}

function lmRathaus(){
  const b={x:640,y:300,w:300,h:90,H:84,top:174,lights:[]},c=cnv(b.w,b.h+b.top),g=c.getContext('2d'),R0=b.top-b.H,F0=R0+b.h;
  g.fillStyle='#7a3a26';g.fillRect(0,F0,b.w,b.H);bricks(g,0,F0,b.w,b.H,5);
  for(let r=0;r<2;r++)for(let k=0;k<12;k++){if(k<3)continue;const wx=12+k*24,wy=F0+10+r*36;if((k===7||k===8)&&r===1)continue;const lit=Math.random()<.04;g.fillStyle=lit?'#c07028':'#110b08';
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
  bShadow(b);
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
  bShadow(b);
}
function lmWasserturm(){const g=gx,cx=1200,cy=760;g.fillStyle='#2f3b1c';g.beginPath();g.ellipse(cx,cy+40,190,110,0,0,7);g.fill();for(let i=0;i<300;i++){g.fillStyle=pick(['#3b4a22','#26301a','#4a5a2a']);g.fillRect(cx+R(-170,170),cy+40+R(-95,95),3,2);}
  const b={x:cx-70,y:cy,w:140,h:60,H:210,top:210,lights:[]},c=cnv(140,270),t=c.getContext('2d');
  const gr=t.createLinearGradient(0,0,140,0);gr.addColorStop(0,'#5a2a1c');gr.addColorStop(.35,'#8a4a32');gr.addColorStop(1,'#3a1a10');t.fillStyle=gr;t.fillRect(8,60,124,210);bricks(t,8,60,124,210,6);
  t.fillStyle='rgba(0,0,0,.2)';for(let x=20;x<130;x+=22)t.fillRect(x,60,2,210);
  for(let r=0;r<4;r++)for(let k=0;k<5;k++){const wx=18+k*22,wy=90+r*44,lit=Math.random()<.04;t.fillStyle=lit?'#c07028':'#110b08';t.beginPath();t.moveTo(wx,wy+18);t.lineTo(wx,wy+5);t.arc(wx+5,wy+5,5,Math.PI,0);t.lineTo(wx+10,wy+18);t.fill();if(lit)b.lights.push({x:b.x+wx+5,y:b.y-b.top+wy+10});}
  t.fillStyle='#4a2216';t.fillRect(0,48,140,16);t.fillStyle='#6b3626';for(let i=0;i<10;i++)t.fillRect(4+i*14,42,8,8);
  t.fillStyle='#2c3a32';t.beginPath();t.moveTo(4,48);t.lineTo(70,4);t.lineTo(136,48);t.fill();t.fillStyle='#3d5045';t.beginPath();t.moveTo(4,48);t.lineTo(70,4);t.lineTo(70,48);t.fill();
  t.fillStyle='#0b0806';t.beginPath();t.moveTo(58,270);t.lineTo(58,246);t.arc(70,246,12,Math.PI,0);t.lineTo(82,270);t.fill();b.lights.push({x:cx,y:cy-150,r:80});
  b.spr=c;addLm(b);bShadow(b);marks.push({x:cx,y:cy+60,n:'Wasserturm'});}
function lmZitadelle(){const g=gx,x0=1010,y0=800;
  const b={x:x0,y:y0,w:340,h:56,H:64,top:84,lights:[]},c=cnv(340,140),t=c.getContext('2d');t.fillStyle='#5a3a26';t.fillRect(0,20,340,56);t.fillStyle='#6a4430';t.fillRect(0,20,340,8);
  for(let i=0;i<17;i++){t.fillStyle='#6a4430';t.fillRect(i*20,8,12,14);}t.fillStyle='#7a5038';t.fillRect(0,76,340,64);bricks(t,0,76,340,64,7);
  t.fillStyle='#0b0806';t.beginPath();t.moveTo(150,140);t.lineTo(150,104);t.arc(170,104,20,Math.PI,0);t.lineTo(190,140);t.fill();t.fillStyle='rgba(224,137,46,.25)';t.fillRect(156,110,28,30);
  for(const wx of [40,90,250,300]){t.fillStyle='#110b08';t.fillRect(wx,96,8,16);}t.fillStyle='rgba(0,0,0,.4)';t.fillRect(0,76,340,4);b.lights.push({x:x0+170,y:y0+30,r:70});b.spr=c;addLm(b);
  const tw={x:1300,y:740,w:60,h:50,H:180,top:180,lights:[]},c2=cnv(60,230),u=c2.getContext('2d');const gr=u.createLinearGradient(0,0,60,0);gr.addColorStop(0,'#5a3a26');gr.addColorStop(.4,'#8a5a3e');gr.addColorStop(1,'#3a2416');
  u.fillStyle=gr;u.fillRect(4,30,52,200);bricks(u,4,30,52,200,6);for(let i=0;i<5;i++){u.fillStyle='#6a4430';u.fillRect(2+i*12,18,8,14);}u.fillStyle='#4a2c1c';u.fillRect(0,28,60,6);
  for(let i=0;i<4;i++){u.fillStyle='#110b08';u.fillRect(26,60+i*38,8,14);}u.fillStyle='#d9822b';u.fillRect(26,60,8,14);tw.lights.push({x:1330,y:740-180+67,r:60});tw.spr=c2;addLm(tw);
  g.fillStyle='#1e3a44';g.fillRect(x0-40,y0+60,420,30);walls.push({x:x0-40,y:y0+62,w:180,h:26,water:1},{x:x0+200,y:y0+62,w:180,h:26,water:1});waters.push({x:x0-40,y:y0+60,w:420,h:30});g.fillStyle='#4a3424';g.fillRect(x0+140,y0+56,60,38);
  marks.push({x:1180,y:900,n:'Zitadelle Spandau'});}
function lmMarzahn(){const b={x:1040,y:770,w:320,h:80,H:230,top:230};makeB(b,'platte');const t=b.spr.getContext('2d');
  t.fillStyle='#1a1e22';t.fillRect(70,10,180,22);t.fillStyle='#ff6a2a';t.font='700 16px sans-serif';t.textAlign='center';t.fillText('M A R Z A H N',160,27);b.lights.push({x:1200,y:770-230+20,r:90});
  addLm(b);bShadow(b);marks.push({x:1200,y:880,n:'Hochhaus Marzahn'});
  for(let i=0;i<4;i++){const q={x:R(1000,1400),y:R(560,700)};if(!inWall(q.x,q.y,30))makeTree(q.x,q.y,'dead');}}
const spSafe=()=>!!(spati&&spati.inside&&spati.calm>0),inSp=(o,m)=>spati&&o.x>spati.x-m&&o.x<spati.x+spati.w+m&&o.y>spati.y-m&&o.y<spati.y+spati.h+m;
/* ---- Späti: barricaded safe room (S2). Shutter (gate wall) keeps walkers out while calm lasts: 60 s per wave inside ---- */
function makeSpati(){const cands=lotCands();
  for(const[w,h]of[[260,170],[220,150],[176,118]])for(const q of cands){const H=58,dw=50,x0=q.x0,x1=q.x1,y0=q.y0,y1=q.y1;
    for(let k=0;k<12;k++){const x=Math.round(R(x0+30,x1-30-w)),y=Math.round(R(y0+30+H,y1-30-h-70));if(y<y0+30+H||x<x0+20||x+w>x1-20)continue;
      if(resHit(x-70,y-H,w+140,h+H+80))continue;
      const dx=Math.round((w-dw)/2),sp={x,y,w,h,H,top:H,dx,dw,lights:[],fade:1,isSpati:true,name:D.spati,seen:false,calm:60},g=gx,dk='#1a0f0a';
      for(let ty=y;ty<y+h;ty+=12)for(let tx=x;tx<x+w;tx+=12){g.fillStyle=((tx-x)/12+(ty-y)/12)%2?'#4f453a':'#40372e';g.fillRect(tx,ty,12,12);}
      g.fillStyle='rgba(0,0,0,.22)';for(let i=0;i<8;i++){g.beginPath();g.ellipse(x+R(14,w-14),y+R(14,h-14),R(8,20),R(5,10),0,0,7);g.fill();}
      const box=(bx,by,bw,bh,c,wall)=>{g.fillStyle=dk;g.fillRect(bx-1.5,by-1.5,bw+3,bh+3);g.fillStyle=c;g.fillRect(bx,by,bw,bh);g.fillStyle='rgba(255,230,200,.12)';g.fillRect(bx,by,bw,2);if(wall)walls.push({x:bx,y:by,w:bw,h:bh});};
      const goods=(px,base,maxX)=>{while(px<maxX){const k=pick(['bot','bot','bot','can','can','bag','box']),W={bot:4,can:4,bag:8,box:6}[k];if(px+W>maxX)break;
        if(k==='bot'){const c=pick(['#5a3010','#2f6a2a','#c8a030','#7a2a1a']);g.fillStyle=c;g.fillRect(px,base-9,4,9);g.fillRect(px+1,base-12,2,3);g.fillStyle=pick(['#f2d14b','#c8ccd4','#c23a2e']);g.fillRect(px+1,base-13,2,1);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(px+1,base-8,1,5);if(c==='#c8a030'){g.fillStyle='#1f3a6a';g.fillRect(px,base-6,4,2);}}
        else if(k==='can'){g.fillStyle=pick(['#c23a2e','#3a6ad0','#e8e0d0','#2a2a2a','#5aa04a']);g.fillRect(px,base-6,4,6);g.fillStyle='#c8ccd4';g.fillRect(px,base-6,4,1);g.fillStyle='rgba(255,255,255,.3)';g.fillRect(px+1,base-5,1,4);}
        else if(k==='bag'){g.fillStyle=pick(['#f2d14b','#c23a2e','#3a6ad0','#e0892e']);g.beginPath();g.moveTo(px,base);g.lineTo(px+1,base-9);g.lineTo(px+7,base-9);g.lineTo(px+8,base);g.fill();g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.arc(px+4,base-5,1.6,0,7);g.fill();g.fillStyle='rgba(0,0,0,.25)';g.fillRect(px+1,base-9,6,1);}
        else{g.fillStyle=pick(['#ead9c0','#c23a2e','#8fd16a','#d8642e']);g.fillRect(px,base-8,6,8);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(px,base-3,6,1);g.fillStyle='#1a1a1a';g.fillRect(px+1,base-7,4,2);}
        px+=W+1;}};
      const shelf=(sx,sy,sw)=>{box(sx,sy,sw,24,'#2a1f18',1);g.fillStyle='#1a120c';g.fillRect(sx+2,sy+2,sw-4,20);g.fillStyle='#6a4a34';g.fillRect(sx,sy+10,sw,2);g.fillRect(sx,sy+21,sw,3);goods(sx+3,sy+10,sx+sw-3);goods(sx+3,sy+21,sx+sw-3);};
      shelf(x+12,y+10,Math.round(w*.38));shelf(x+w-12-Math.round(w*.38),y+10,Math.round(w*.38));
      // fridge row (glowing), counter with till, oven, workbench, radio, mattress
      box(x+w-40,y+40,26,Math.round(h*.38),'#5fb8d0',1);for(let i=0;i<3;i++){const ry=y+46+i*Math.round(h*.12),rh=Math.round(h*.09);g.fillStyle='rgba(20,40,50,.55)';g.fillRect(x+w-36,ry,18,rh);goods(x+w-35,ry+rh,x+w-18);g.fillStyle='rgba(220,250,255,.22)';g.fillRect(x+w-36,ry,18,rh);}
      box(x+14,y+40,18,Math.round(h*.42),'#2a1f18',1);for(let i=0;i<4;i++){const ry=y+56+i*14;g.fillStyle='#4a3426';g.fillRect(x+14,ry,18,2);goods(x+16,ry,x+31);}
      const cx=x+Math.round(w*.5)-34,cy=y+Math.round(h*.42);box(cx,cy,68,26,'#5a3f2e',1);g.fillStyle='#ff8a3a';g.fillRect(cx+26,cy+7,16,12);g.fillStyle='#ffd27a';g.fillRect(cx+30,cy+10,8,6);g.fillStyle=dk;g.fillRect(cx+4,cy+4,14,10);
      box(x+44,y+h-48,40,20,'#6a4a34',1);g.fillStyle='#a8957d';g.fillRect(x+50,y+h-44,10,3);g.fillRect(x+64,y+h-42,14,2);g.fillStyle='#c23a2e';g.fillRect(x+72,y+h-46,6,6);
      box(x+w-86,y+h-46,30,18,'#4a5a6a',1);g.fillStyle='#8fd16a';g.fillRect(x+w-80,y+h-42,6,4);g.strokeStyle='#a8957d';g.lineWidth=1.5;g.beginPath();g.moveTo(x+w-62,y+h-46);g.lineTo(x+w-56,y+h-62);g.stroke();
      if(w>=220){box(x+w*.5-60,y+h*.42+36,34,16,'#7a6a5a',0);g.fillStyle='#ead9c0';g.fillRect(x+w*.5-58,y+h*.42+38,10,12);}
      g.fillStyle='rgba(255,200,120,.06)';g.fillRect(x,y,w,h);
      walls.push({x,y,w,h:6},{x,y,w:6,h},{x:x+w-6,y,w:6,h},{x,y:y+h-6,w:dx,h:6},{x:x+dx+dw,y:y+h-6,w:w-dx-dw,h:6},{x:x+dx,y:y+h-6,w:dw,h:6,gate:1});
      // sandbag walls in front, leaving a lane to the door
      const bag=(bx,by,n)=>{blds.push({x:bx-8,y:by-14,w:n*15+12,h:18,H:14,top:14,R0:0,fe:1,lights:[],draw:drawSandbag});};
      const sy=y+h+26,ln=Math.max(2,Math.floor((dx-24)/15));bag(x+8,sy,ln);bag(x+dx+dw+16,sy,ln);walls.push({x:x,y:sy-14,w:ln*15+12,h:18},{x:x+dx+dw+8,y:sy-14,w:ln*15+12,h:18});
      // roof and facade sprite
      const c=cnv(w,h+H),t=c.getContext('2d');
      t.fillStyle='#3a2e26';t.fillRect(0,0,w,h);for(let i=0;i<w*h/36;i++){t.fillStyle=Math.random()<.5?'rgba(0,0,0,.16)':'rgba(255,230,200,.04)';t.fillRect(R(0,w),R(0,h),2,2);}
      t.fillStyle='#4a4038';t.fillRect(20,18,30,20);t.fillStyle='#2a221c';t.fillRect(24,22,22,12);t.fillStyle='#55504a';t.fillRect(w-70,24,40,26);t.fillStyle='#3a3632';for(let i=0;i<4;i++)t.fillRect(w-66+i*9,28,5,18);
      t.strokeStyle='#6a5a4a';t.lineWidth=3;t.beginPath();t.moveTo(w*.35,h*.3);t.lineTo(w*.62,h*.55);t.stroke();t.fillStyle='rgba(255,230,200,.12)';t.fillRect(0,0,w,2);
      t.fillStyle='#5a3f2e';t.fillRect(0,h,w,H);bricks(t,0,h,w,H,6);t.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<w;i+=13)t.fillRect(i+((i/13)%2?6:0),h,1,H);
      t.fillStyle='#1a1e22';t.fillRect(w/2-58,h+3,116,16);t.strokeStyle='#e0892e';t.lineWidth=2;t.strokeRect(w/2-58,h+3,116,16);t.fillStyle='#f2d14b';t.font='700 12px sans-serif';t.textAlign='center';t.fillText('S P Ä T I',w/2,h+15);
      for(let i=0;i<w;i+=12){t.fillStyle=(i/12)%2?'#ead9c0':'#c23a2e';t.fillRect(i,h+21,12,7);}
      const win=(wx)=>{t.fillStyle='#110b08';t.fillRect(wx,h+31,Math.min(56,dx-24),H-35);t.fillStyle='rgba(224,137,46,.28)';t.fillRect(wx+3,h+34,Math.min(56,dx-24)-6,H-41);t.strokeStyle='#7a7a70';t.lineWidth=1.5;for(let j=wx+5;j<wx+Math.min(56,dx-24);j+=7){t.beginPath();t.moveTo(j,h+31);t.lineTo(j,h+H-4);t.stroke();}};
      win(10);win(w-10-Math.min(56,dx-24));
      t.fillStyle='#0b0806';t.fillRect(dx,h+28,dw,H-28);t.fillStyle='rgba(255,170,80,.3)';t.fillRect(dx+4,h+40,dw-8,H-40);
      t.fillStyle='#8a8a80';t.fillRect(dx-2,h+28,dw+4,13);t.fillStyle='#5a5a54';for(let j=h+30;j<h+41;j+=3)t.fillRect(dx-2,j,dw+4,1);
      t.fillStyle='rgba(0,0,0,.45)';t.fillRect(0,h,w,3);t.strokeStyle='rgba(0,0,0,.55)';t.lineWidth=2;t.strokeRect(1,1,w-2,h-2);
      {const e=cnv(h,H),u=e.getContext('2d');u.fillStyle='#4e3a2c';u.fillRect(0,0,h,H);bricks(u,0,0,h,H,6);for(let i=0;i<h;i+=12){u.fillStyle=(i/12)%2?'#ead9c0':'#c23a2e';u.fillRect(i,21,12,7);}u.fillStyle='#110b08';u.fillRect(h*.3,32,h*.4,H-38);u.strokeStyle='#7a7a70';u.lineWidth=1.5;for(let j=h*.3+5;j<h*.7;j+=7){u.beginPath();u.moveTo(j,32);u.lineTo(j,H-6);u.stroke();}sp.ef=e;}
      if(D===DIST[0])sp.koep={kind:'shop',windows:[],cuts:[]};
      sp.spr=c;sp.lights.push({x:x+w/2,y:y+h-10,r:90},{x:x+w/2,y:y+h/2,r:0,inner:1});neons.push({x:x+w/2,y:y+h,z:H-12,c:'#f2d14b',s:80},{x:x+w/2,y:y+h-6,c:'#e0892e',s:60},{x:cx+34,y:cy+12,c:'#ff8a3a',s:50});blds.push(sp);reserved.push({x:x-70,y:y-H,w:w+140,h:h+H+80});spati=sp;
      bShadow(sp);
      [[x+w-60,y+34],[x+w*.3,y+h*.3],[x+40,y+h-70]].forEach(p=>addBrk(p[0],p[1],'crate',true));
      return;}}
}
function makeDark(){const cands=lotCands();
  for(const q of cands){const x0=q.x0,x1=q.x1,y0=q.y0,y1=q.y1,w=Math.min(290,x1-x0-60),h=Math.min(230,y1-y0-60),x=x0+30+R(0,Math.max(0,x1-x0-60-w)),y=y0+30+R(0,Math.max(0,y1-y0-60-h));
    if(resHit(x,y,w,h))continue;const g=gx;
    g.fillStyle='rgba(8,6,5,.55)';g.fillRect(x,y,w,h);for(let i=0;i<70;i++){g.fillStyle=pick(['#2a221c','#1f1915','#3a2e25']);g.fillRect(x+R(0,w),y+R(0,h),R(4,14),R(3,9));}
    g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.strokeRect(x,y,w,h);
    g.fillStyle='#24201c';g.fillRect(x+16,y-10,4,28);g.fillStyle='#1d4a8a';g.fillRect(x+6,y-30,24,24);g.fillStyle='#fff';g.font='700 18px sans-serif';g.textAlign='center';g.fillText('U',x+18,y-11);
    reserved.push({x,y,w,h});darks.push({x,y,w,h,seen:false});neons.push({x:x+18,y:y-18,c:'#3a7ad8',s:40});
    for(let k=0;k<4;k++){const rx=x+R(20,w-60),ry=y+R(20,h-40),rw=R(24,44),rh=R(14,24);if(Math.hypot(rx+rw/2-(x+w/2),ry+rh/2-(y+h/2))<60)continue;
      g.fillStyle='rgba(0,0,0,.4)';g.fillRect(rx+3,ry+4,rw,rh);g.fillStyle='#3a2e25';g.fillRect(rx,ry,rw,rh);g.fillStyle='#4a3a2e';g.fillRect(rx,ry,rw,4);walls.push({x:rx,y:ry,w:rw,h:rh});}
    addBrk(x+w/2,y+h/2,'chest',true);return;}}
function addBrk(x,y,type,inside){const w={crate:22,bin:18,chest:28,akku:22}[type],h={crate:18,bin:14,chest:18,akku:16}[type],hp={crate:3,bin:2,chest:5,akku:2}[type],b={x:x-w/2,y:y-h/2,w,h,type,inside,hp,max:hp,flash:0,brk:true};brk.push(b);walls.push(b);}
/* ---- props ---- */
function makeTree(tx,ty,kind){
  const Rr=R(18,28),W=Math.ceil(Rr*2+10),Ht=Math.ceil(Rr*2+30),c=cnv(W,Ht),g=c.getContext('2d'),cx=W/2,base=Ht-4;
  g.fillStyle='#2a1d14';g.fillRect(cx-3,base-30,6,30);g.fillStyle='#3a2a1e';g.fillRect(cx-3,base-30,2,30);
  if(kind==='dead'){g.strokeStyle='#2a1d14';g.lineCap='round';for(let i=0;i<6;i++){const a=-Math.PI/2+R(-1.1,1.1),l=R(Rr*.6,Rr);g.lineWidth=R(1.5,3);g.beginPath();g.moveTo(cx,base-26);g.lineTo(cx+Math.cos(a)*l,base-26+Math.sin(a)*l);g.stroke();}}
  else{const pal=kind==='autumn'?['#6b4a1e','#7a5a24','#5a3a16','#8a6a2a']:kind==='dark'?['#1f2a14','#26331a','#2c3a1c','#1a2410']:['#2f3b1c','#3b4a22','#4a5a2a','#26301a'],cy=base-30-Rr*.55;
    for(let i=0;i<9;i++){g.fillStyle=pal[i%pal.length];const a=R(0,6.28),d=R(0,Rr*.45);g.beginPath();g.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d*.8,Rr*R(.45,.65),0,7);g.fill();}
    g.fillStyle='rgba(255,230,180,.07)';g.beginPath();g.arc(cx-Rr*.3,cy-Rr*.35,Rr*.4,0,7);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.arc(cx+Rr*.3,cy+Rr*.3,Rr*.45,0,7);g.fill();}
  gx.fillStyle='rgba(0,0,0,.3)';gx.beginPath();gx.ellipse(tx+6,ty+2,Rr*.9,Rr*.4,0,0,7);gx.fill();
  blds.push({x:tx-cx,y:ty,w:W,h:0,top:base,spr:c,lights:[],sc:1.6});walls.push({x:tx-4,y:ty-5,w:8,h:7});
}
function makeLitfass(x,y){const mk=on=>{const c=cnv(30,84),g=c.getContext('2d');g.fillStyle='#2a2522';g.fillRect(3,76,24,8);g.fillStyle='#3d4a3a';g.fillRect(5,18,20,60);
    const cols=on?['#c23a2e','#f2d14b','#7d9bff','#ead9c0','#8fd16a','#d4537e']:['#3a332e','#4a4038','#2e2824'];for(let i=0;i<5;i++){g.fillStyle=pick(cols);g.fillRect(5,20+i*11,20,10);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(5+R(2,12),22+i*11,R(4,8),2);}
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(18,18,7,60);g.fillStyle='#2c3a32';g.beginPath();g.ellipse(15,16,13,5,0,0,7);g.fill();g.beginPath();g.moveTo(3,16);g.lineTo(15,2);g.lineTo(27,16);g.fill();g.fillStyle='#c9a227';g.fillRect(14,0,2,4);return c;};
  const o={x:x-15,y:y-4,w:30,h:8,H:0,top:80,sc:1.25,spr:mk(1),propKey:'litfass',lights:[{x,y:y-40,r:70}]};blds.push(o);walls.push({x:x-11,y:y-6,w:22,h:10});shrines.push({x,y,o,off:mk(0),used:0});
  gx.fillStyle='rgba(0,0,0,.3)';gx.beginPath();gx.ellipse(x+6,y+2,16,6,0,0,7);gx.fill();}
function makeLamp(lx_,ly,lit){
  const c=cnv(22,70),g=c.getContext('2d');g.fillStyle='#24201c';g.fillRect(4,8,4,62);g.fillRect(2,66,8,4);g.fillRect(4,8,14,3);
  g.fillStyle='#3a342e';g.fillRect(14,9,7,5);g.fillStyle=lit?'#f7d98a':'#1a1612';g.fillRect(15,13,5,2);
  blds.push({x:lx_-6,y:ly,w:22,h:0,top:70,sc:1.35,spr:c,propKey:'lamp',lights:lit?[{x:lx_+5,y:ly,z:0,r:105,fl:Math.random()<.25}]:[]});if(lit)neons.push({x:lx_+5,y:ly,z:77,dx:9,c:'#f7d98a',s:30});walls.push({x:lx_-3,y:ly-3,w:6,h:5});
}
function decorate(){
  const g=gx,greens=['#3b4a22','#4a5a2a','#2f3b1c','#56662e'];
  for(let i=0;i<420*WS*WS/5.76e6;i++){const q=roadPt(),o=pick([-1,1])*R(40,56),x=q.x+q.nx*o,y=q.y+q.ny*o;if(inWall(x,y,2))continue;g.strokeStyle=pick(greens);g.lineWidth=1.2;
    for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+k*1.5,y);g.lineTo(x+k*1.5+R(-3,3),y-R(3,7));g.stroke();}}
  for(let i=0;i<90;i++){const x=R(0,WS),y=R(0,WS);if(inWall(x,y,10)||onRoad(x,y,0))continue;for(let k=0;k<5;k++){g.fillStyle=pick(greens);g.beginPath();g.arc(x+R(-8,8),y+R(-5,5),R(4,8),0,7);g.fill();}}
  for(let i=0;i<9;i++){const q=roadPt(),x=q.x+q.nx*62,y=q.y+q.ny*62;if(onRoad(x,y,-2)||inWall(x,y,26)||resHit(x-20,y-6,40,12,1))continue;
    g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-18,y+3,38,6);g.fillStyle='#4a3424';for(let k=0;k<3;k++)g.fillRect(x-18,y-6+k*4,36,3);g.fillStyle='#24201c';g.fillRect(x-16,y+4,3,5);g.fillRect(x+13,y+4,3,5);}
  for(let i=0;i<14;i++){const q=roadPt(),o=R(-20,20),x=q.x+q.nx*o,y=q.y+q.ny*o;if(inWall(x,y,10))continue;g.fillStyle='#1c1612';g.beginPath();g.arc(x,y,9,0,7);g.fill();g.strokeStyle='#3a3029';g.lineWidth=1.5;g.beginPath();g.arc(x,y,9,0,7);g.stroke();g.beginPath();g.moveTo(x-6,y);g.lineTo(x+6,y);g.moveTo(x,y-6);g.lineTo(x,y+6);g.stroke();}
}
function legacy(fn,ox,oy){ox=ox==null?OFF:ox;oy=oy==null?OFF:oy;const n=[walls.length,blds.length,reserved.length,marks.length,barrels.length],done=new Set();gx.save();gx.translate(ox,oy);fn();gx.restore();
  const sh=o=>{if(done.has(o))return;done.add(o);o.x+=ox;o.y+=oy;if(o.lights)o.lights.forEach(sh);};
  walls.slice(n[0]).forEach(sh);blds.slice(n[1]).forEach(sh);reserved.slice(n[2]).forEach(sh);marks.slice(n[3]).forEach(sh);barrels.slice(n[4]).forEach(sh);}
function makeLayout(d){const B=BIOME[d.i],ex=B.roads;RX=[920,1480];RY=[920,1480];
  for(const v of [340,2060]){if(Math.random()<ex)RX.push(v);if(Math.random()<ex)RY.push(v);}RX.sort((a,b)=>a-b);RY.sort((a,b)=>a-b);
  const iv=A=>{const o=[];let a=0;for(const r of A){o.push([a,r-55]);a=r+55;}o.push([a,WS]);return o;};BLK=[];
  for(const[x0,x1]of iv(RX))for(const[y0,y1]of iv(RY)){const b={x0,x1,y0,y1,w:x1-x0,h:y1-y0,center:x0===975&&y0===975};b.lot=b.center?'plaza':wpick(B.lots);BLK.push(b);}
  // big outer blocks prefer open biomes
  for(const b of BLK)if(!b.center&&b.w*b.h>500000&&B.big&&Math.random()<.6)b.lot=wpick(B.big);}
function wpick(o){let t=0;for(const k in o)t+=o[k];let r=Math.random()*t;for(const k in o){r-=o[k];if(r<=0)return k;}return Object.keys(o)[0];}
function lotCands(){return BLK.filter(b=>!b.center&&['houses','hinterhof','ruins','plattenbau','market','parking','construction','kleingarten'].includes(b.lot)&&b.w>=330&&b.h>=300).sort(()=>Math.random()-.5);}
function buildWorld(d){
  D=d;const K=d.geo;WS=WH=K?K.ws:2400;[SX,SY]=K?K.start:[1200,1220];const A=WS*WS/5.76e6;// A: area relative to the 2400 grid map, scales scatter counts
  if(typeof koepResetCache==='function')koepResetCache(null);
  G=cnv(WS,WS);gx=G.getContext('2d');walls=[];blds=[];barrels=[];reserved=[];marks=[];brk=[];spati=null;darks=[];waters=[];neons=[];const g=gx;
  if(K)geoLayout(K);else{makeLayout(d);roadsFromGrid();}
  g.fillStyle=d.ground;g.fillRect(0,0,WS,WS);
  const sp=['rgba(255,230,200,.04)','rgba(0,0,0,.18)','rgba(0,0,0,.1)','rgba(120,80,50,.08)'];
  for(let i=0;i<11000*A;i++){g.fillStyle=pick(sp);const s=R(1,5);g.fillRect(R(0,WS),R(0,WS),s,s);}
  for(const b of BLK)lotGround(b);
  if(K){geoWater(K);geoRoads(K,d);}else{
  const cob=['#3a2e25','#342920','#40332a','#2f251e'];
  for(let y=975;y<1425;y+=10)for(let x=975+((y/10)%2)*6;x<1425;x+=12){g.fillStyle=pick(cob);g.fillRect(x,y,10,8);}
  for(const p of RX){g.fillStyle=d.road;g.fillRect(p-55,0,110,WS);}for(const p of RY){g.fillStyle=d.road;g.fillRect(0,p-55,WS,110);}
  for(const p of RX){g.fillStyle='#3a2f27';g.fillRect(p-55,0,12,WS);g.fillRect(p+43,0,12,WS);}for(const p of RY){g.fillStyle='#3a2f27';g.fillRect(0,p-55,WS,12);g.fillRect(0,p+43,WS,12);}
  for(const p of RX)for(const q of RY){g.fillStyle=d.road;g.fillRect(p-43,q-43,86,86);
    g.fillStyle='rgba(234,217,192,.1)';for(let k=0;k<6;k++){g.fillRect(p-40+k*14,q-62,8,14);g.fillRect(p-40+k*14,q+48,8,14);g.fillRect(p-62,q-40+k*14,14,8);g.fillRect(p+48,q-40+k*14,14,8);}}
  g.strokeStyle='rgba(234,217,192,.09)';g.lineWidth=3;g.setLineDash([24,30]);
  for(const p of RX){g.beginPath();g.moveTo(p,0);g.lineTo(p,WS);g.stroke();}for(const p of RY){if(p===1480)continue;g.beginPath();g.moveTo(0,p);g.lineTo(WS,p);g.stroke();}g.setLineDash([]);
  for(let x=0;x<WS;x+=14){g.fillStyle='#1c1511';g.fillRect(x,1480-16,5,32);}
  g.strokeStyle='#6b5a4a';g.lineWidth=2;[1480-10,1480+10].forEach(y=>{g.beginPath();g.moveTo(0,y);g.lineTo(WS,y);g.stroke();});
  for(let i=0;i<80;i++){const v=Math.random()<.5,p=pick(v?RX:RY),a=R(0,WS),o=R(-40,40);g.fillStyle='rgba(8,5,4,.5)';g.beginPath();g.ellipse(v?p+o:a,v?a:p+o,R(6,16),R(4,10),R(0,3),0,7);g.fill();}
  }
  for(let i=0;i<90*A;i++){const x=R(0,WS),y=R(0,WS),r=R(20,60),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,d.day?'rgba(8,5,3,.22)':'rgba(8,5,3,.55)');gr.addColorStop(1,'rgba(8,5,3,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  g.strokeStyle='rgba(10,6,4,.55)';g.lineWidth=1.5;for(let i=0;i<300*A;i++){let x=R(0,WS),y=R(0,WS);g.beginPath();g.moveTo(x,y);for(let k=0;k<4;k++){x+=R(-22,22);y+=R(-22,22);g.lineTo(x,y);}g.stroke();}
  if(!K){
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(1206,1108,38,0,7);g.fill();
  g.fillStyle='#5a4636';g.beginPath();g.arc(1200,1100,36,0,7);g.fill();g.fillStyle='#14100d';g.beginPath();g.arc(1200,1100,27,0,7);g.fill();
  g.fillStyle='#6b5543';g.beginPath();g.arc(1200,1100,8,0,7);g.fill();g.strokeStyle='rgba(255,230,200,.12)';g.lineWidth=2;g.beginPath();g.arc(1200,1100,35,3.4,5.6);g.stroke();
  walls.push({x:1168,y:1068,w:64,h:64});
  }
  if(K){K.lm();reserved.push({x:SX-80,y:SY-80,w:160,h:160});}// landmarks of a geo district (js/geo.js), clear start
  else ({Tempelhof:()=>legacy(lmTempelhof),Spandau:lmZitadelle,Marzahn:lmMarzahn}[d.n]||(()=>{}))();// grid districts (v0.47: Neukölln removed, v0.49: Prenzlauer Berg removed)
  if(K)geoStreets(K);
  makeSpati();// v0.65: Dunkelzonen (makeDark) switched off, the U-Bahn network replaces them; an arena with a reward is on the backlog
  for(const b of BLK)lotFill(b);
  // vehicles at real scale: car about 4 x player width (44 x 96), bus 46 x 230, tram 44 x 250. Boxes stay axis-aligned, on diagonal roads they stand askew like abandoned wrecks
  const side=(q,o)=>({x:q.x+q.nx*o,y:q.y+q.ny*o}),far=(x,y,r)=>Math.hypot(x-SX,y-SY)>=r;
  // on geo maps vehicles turn with the road (rot), slightly askew
  const veh=(x,y,w,h,v,k,rot)=>{const cx=x+w/2,cy=y+h/2;if(rot){gx.save();gx.translate(cx,cy);gx.rotate(rot);gx.translate(-cx,-cy);}addVeh(x,y,w,h,v,k);if(rot)gx.restore();const b=blds[blds.length-1];b.rot=rot;walls.push(rot?obWall(b):{x,y,w,h});},vrot=q=>K?rotN(Math.atan2(q.uy,q.ux))+R(-.06,.06):0;
  let ct=0;for(let i=0;i<160*A&&ct<14*A;i++){const q=roadPt(),v=q.v,k=pick(['car','car','trabi','trabi','van']),s=k==='trabi'?.82:k==='van'?1.1:1,w=v?44:96*s,h=v?96*s:44,c=side(q,R(-8,8)+pick([-27,27])),x=c.x-w/2,y=c.y-h/2;
    if(!far(c.x,c.y,240)||inWall(c.x,c.y,90)||resHit(c.x-30,c.y-30,60,60,1)||x<0||y<0||x+w>WS||y+h>WS)continue;veh(x,y,w,h,v,k,vrot(q));ct++;}
  for(let i=0,n=0;i<80&&n<3;i++){const q=roadPt(s=>s.n==='tram'),v=q.v,w=v?46:230,h=v?230:46,c=side(q,R(-20,20)),x=c.x-w/2,y=c.y-h/2;if(!far(c.x,c.y,300)||inWall(c.x,c.y,130)||resHit(c.x-40,c.y-40,80,80,1)||x<0||y<0||x+w>WS||y+h>WS)continue;veh(x,y,w,h,v,'bus',vrot(q));n++;}
  if(!K)for(let i=0,n=0;i<40&&n<2;i++){const a=R(80,WS-330),x=a,y=1480-22,w=250,h=44;if(Math.abs(x+125-SX)<340||inWall(x+125,y+22,140)||resHit(x,y,w,h))continue;addVeh(x,y,w,h,false,'tram');walls.push({x,y,w,h});n++;}
  for(const q of [[SX-100,SY-40],[SX+100,SY-40]]){barrels.push({x:q[0],y:q[1],ph:R(0,6)});walls.push({x:q[0]-9,y:q[1]-9,w:18,h:18});}
  let tr=0;while(barrels.length<26*A&&tr++<600*A){const c=side(roadPt(),pick([-1,1])*R(46,58)),x=c.x,y=c.y;
    if(inWall(x,y,24)||resHit(x-9,y-9,18,18,1)||!far(x,y,160))continue;barrels.push({x,y,ph:R(0,6)});walls.push({x:x-9,y:y-9,w:18,h:18});}
  // campfires: survivors keep a few fires on open ground (parks, yards, ruins); drawn and lit like fire barrels (camp:1), log seats around
  for(let i=0,cf=0;i<400&&cf<5*A;i++){const b=pick(BLK);if(!b||!['park','hinterhof','ruins','parking','plattenbau','construction','hochhaus','kleingarten','market'].includes(b.lot))continue;const x=R(b.x0+40,b.x1-40),y=R(b.y0+40,b.y1-40);
    if(inWall(x,y,55)||resHit(x-30,y-30,60,60,1)||onRoad(x,y,10)||!far(x,y,260)||barrels.some(o=>o.camp&&Math.hypot(o.x-x,o.y-y)<500))continue;barrels.push({x,y,ph:R(0,6),camp:1});walls.push({x:x-14,y:y-8,w:28,h:16});
    gx.fillStyle='rgba(20,14,10,.6)';gx.beginPath();gx.ellipse(x,y,34,22,0,0,7);gx.fill();for(const sd of [-1,1]){gx.fillStyle='#4a3020';gx.fillRect(x+sd*36-4,y-12,8,26);gx.fillStyle='rgba(0,0,0,.3)';gx.fillRect(x+sd*36-4,y+12,8,3);}cf++;}
  let lt=0,ln=0;while(ln<22*A&&lt++<500*A){const c=side(roadPt(),pick([-1,1])*50),x=c.x,y=c.y;
    if(inWall(x,y,30)||resHit(x-6,y-70,22,72,1)||!far(x,y,120))continue;makeLamp(x,y,Math.random()<.05);ln++;}
  shrines=[];let st=0;while(shrines.length<3&&st++<300){const c=side(roadPt(),pick([-1,1])*70),x=c.x,y=c.y;
    if(inWall(x,y,40)||resHit(x-16,y-80,32,90,1)||!far(x,y,300)||x<120||y<120||x>WS-120||y>WS-120||shrines.some(h=>Math.hypot(h.x-x,h.y-y)<600))continue;makeLitfass(x,y);}
  if(!K){let tt=0,tn=0;while(tn<d.trees&&tt++<500){const x=R(975,1425),y=R(975,1425);
    if(inWall(x,y,34)||resHit(x-28,y-60,56,62)||Math.hypot(x-SX,y-SY)<200||Math.hypot(x-1200,y-1100)<80)continue;makeTree(x,y,pick(BIOME[d.i].trees));tn++;}}
  let bt=0,bn=0;while(bn<28*A&&bt++<800*A){const x=R(40,WS-40),y=R(40,WS-40),ty=D.cyber&&Math.random()<.3?'akku':Math.random()<.45?'bin':'crate';if(inWall(x,y,26)||resHit(x-12,y-12,24,24,1)||onRoad(x,y,-20)||!far(x,y,120))continue;addBrk(x,y,ty,false);bn++;}
  if(K&&K.post)K.post();
  decorate();gridBuild();
  const k2=600/WS;MB2=cnv(600,600);const m2=MB2.getContext('2d');m2.drawImage(G,0,0,600,600);m2.fillStyle='rgba(0,0,0,.25)';m2.fillRect(0,0,600,600);m2.fillStyle='rgba(234,217,192,.38)';for(const b of blds)if(b.h>0&&!b.veh&&!b.fe){m2.beginPath();(b.rot?obbC(b):[[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]]).forEach((p,i)=>m2[i?'lineTo':'moveTo'](p[0]*k2,p[1]*k2));m2.fill();}
  const k=192/WS;MB=cnv(192,192);const mg=MB.getContext('2d');mg.drawImage(G,0,0,192,192);mg.fillStyle='rgba(0,0,0,.3)';mg.fillRect(0,0,192,192);mg.fillStyle='rgba(234,217,192,.32)';for(const b of blds)if(b.h>0&&!b.veh&&!b.fe){mg.beginPath();(b.rot?obbC(b):[[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]]).forEach((p,i)=>mg[i?'lineTo':'moveTo'](p[0]*k,p[1]*k));mg.fill();}mg.fillStyle='rgba(0,0,0,.65)';for(const z of darks)mg.fillRect(z.x*k,z.y*k,z.w*k,z.h*k);mg.fillStyle='#1d4a8a';for(const z of darks)mg.fillRect(z.x*k,z.y*k-3,4,4);
}
const TAGS=['KIEZ','BERLIN','LIEBE','RUINE','WIR BLEIBEN','HALT DURCH','SPREE','B36','HOFFNUNG','KEIN AUSGANG'];
// Altbau variants (V): 0 Stuck ocker, 1 Klinker mit Balkonen, 2 grau abgeplatzt, 3 pastell mit Erker und Tordurchfahrt, 4 ausgebrannt. EF: Einfamilienhaus/Reihenhaus (gable roof via b.gable)
function makeB(b,st){if(st==='hoch'||st==='buero')return modernB(b,st);if(st==='zucker')return zuckerB(b);// zuckerB: js/alex.js
  const c=cnv(b.w,b.h+b.H),g=c.getContext('2d'),P_=st==='platte',L_=st==='laube',RU=st==='ruin',EF=st==='efh'||st==='reihen',AB=!P_&&!L_&&!RU&&!EF,V=AB?wpick({0:3,1:3,2:2,3:2,4:1})|0:-1;
  // Metadata only: no RNG or image/cache work during map construction. Legacy sprites remain the fallback.
  const kp=D===DIST[0]&&(P_||RU||AB)?(b.koep={kind:P_?'platte':RU||V===4?'c':V===3?'b':'a',windows:[],cuts:[],door:null}):null;
  const wall=P_?pick(['#6e6a62','#625e56','#76705f']):L_?pick(['#6a4a2e','#5a3e26','#7a5a3a']):EF?pick(['#c8b896','#b8a888','#d0c0a0','#a87a5a','#9a9a8a']):V===0?pick(['#a8844e','#b09060','#9a7a58','#b8a07a']):V===2?pick(['#6e6a62','#7a746a']):V===3?pick(['#8a9a80','#a08890','#8a98a8','#b0a080']):V===4?'#4a3a30':pick(D.walls);
  const roof=P_?'#3d3a36':L_?pick(['#8a3a2a','#3a5a3a','#4a4a5a']):RU||V===4?'#2a211b':EF?pick(['#7a3a2a','#5a3a2e','#4a4a50','#8a4a30']):pick(D.roof);b.wc=wall;b.rc=roof;
  const plaster=(x,y,w,h)=>{for(let i=0;i<w*h/40;i++){g.fillStyle=Math.random()<.5?'rgba(0,0,0,.06)':'rgba(255,240,220,.05)';g.fillRect(x+R(0,w),y+R(0,h),R(2,6),R(2,4));}};
  g.fillStyle=wall;g.fillRect(0,b.h,b.w,b.H);
  if(P_){g.fillStyle='rgba(0,0,0,.18)';for(let x=0;x<b.w;x+=36)g.fillRect(x,b.h,1.5,b.H);for(let y=b.h;y<b.h+b.H;y+=18)g.fillRect(0,y,b.w,1.5);}
  else if(L_){g.fillStyle='rgba(0,0,0,.2)';for(let x=0;x<b.w;x+=5)g.fillRect(x,b.h,1,b.H);}else if(V===1||RU||st==='reihen'&&Math.random()<.4)bricks(g,0,b.h,b.w,b.H,6);else plaster(0,b.h,b.w,b.H);
  b.lights=[];const k=BHS;
  // no power grid: a lit window is a candle (dim, flickering, small light). Shattered panes and boarded windows are common
  const win=(wx,wy,ww,wh,lit)=>{if(lit){g.fillStyle='#2a1608';g.fillRect(wx,wy,ww,wh);const gr=g.createRadialGradient(wx+ww/2,wy+wh*.7,0,wx+ww/2,wy+wh*.7,ww*.8);gr.addColorStop(0,'rgba(240,160,70,.85)');gr.addColorStop(1,'rgba(240,160,70,0)');g.fillStyle=gr;g.fillRect(wx,wy,ww,wh);b.lights.push({x:b.x+wx+ww/2,y:b.y-b.H+wy+wh/2,r:22,fl:1});}
    else{g.fillStyle='#110b08';g.fillRect(wx,wy,ww,wh);g.fillStyle='rgba(90,110,120,.12)';g.fillRect(wx+1,wy+1,ww*.4,wh-2);}};
  if(L_){g.fillStyle='#110b08';g.fillRect(4,b.h+6,9,8);g.fillStyle='#2a1d14';g.fillRect(b.w-14,b.h+6,9,b.H-6);}
  else if(EF){// units: Reihenhaus about 52-64*BSC wide, EFH is one unit. Door, two windows below, two above
    const n=st==='reihen'?Math.max(1,Math.round(b.w/(58*BSC))):1,uw=b.w/n,ww=8*k,wh=11*k,dw=10*k,dh=19*k,base=b.h+b.H;
    for(let i=0;i<n;i++){const x0=i*uw;if(i){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x0-1,b.h,2,b.H);}
      const dx=x0+(st==='reihen'?(i%2?uw-dw-8:8):uw*.3);g.fillStyle=pick(['#2a5a8a','#8a2a20','#3a5a3a','#c8a030','#3a2a1e','#5a3a5a']);g.fillRect(dx,base-dh,dw,dh);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(dx,base-dh,dw,2);g.fillStyle='#d8c070';g.fillRect(dx+dw-4,base-dh*.5,2,2);
      const ws=[x0+uw*.55,x0+uw*.15].filter(x=>Math.abs(x-dx)>ww+4);for(const wx of ws)win(wx,base-dh+2,ww,wh,Math.random()<.03);
      if(b.H>=dh+wh+12)for(const wx of [x0+uw*.2,x0+uw*.62])win(wx,b.h+Math.max(4,(b.H-dh-wh)/2-wh/2),ww,wh*.8,Math.random()<.02);
      if(Math.random()<.4){g.fillStyle='rgba(60,90,40,.5)';for(let j=0;j<8;j++)g.fillRect(x0+R(0,uw-6),base-R(4,16),R(3,6),R(3,8));}}}
  else{// floors and windows grow with BHS: Altbau about 24*BHS per floor, Platte 18*BHS. Altbau gets a mansard band with dormers on top
  const fh=(P_?18:24)*k,ww=(P_?10:9)*k,wh=(P_?10:13)*k,cw=18*k,mb=AB&&V!==4&&b.H>=110?Math.round(fh*.7):0,rows=Math.max(1,Math.floor((b.H-mb-(P_?8:16)*k)/fh)),cols=Math.max(1,Math.floor((b.w-10)/cw)),ox=(b.w-cols*cw)/2+(cw-ww)/2,ec=V===3&&cols>=3?Math.floor(cols/2):-1;
  if(mb){g.fillStyle='#3d4048';g.fillRect(0,b.h,b.w,mb);g.fillStyle='rgba(255,255,255,.06)';for(let y=b.h+3;y<b.h+mb;y+=4)g.fillRect(0,y,b.w,1);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,b.h+mb-3,b.w,3);
    for(let c=0;c<cols;c+=1+(cols>4)){const dx=ox+c*cw;g.fillStyle='#55585e';g.beginPath();g.moveTo(dx-3,b.h+mb-2);g.lineTo(dx+ww/2,b.h+2);g.lineTo(dx+ww+3,b.h+mb-2);g.fill();const lit=Math.random()<.01;if(kp)kp.windows.push({x:dx+1,y:mb*.4,w:ww-2,h:mb*.45,lit,state:'plain'});win(dx+1,b.h+mb*.4,ww-2,mb*.45,lit);}}
  if(ec>=0){g.fillStyle='rgba(255,250,240,.12)';g.fillRect(ox+ec*cw-6,b.h+mb,ww+12,b.H-mb-fh);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(ox+ec*cw+ww+6,b.h+mb,3,b.H-mb-fh);}
  for(let r=0;r<rows;r++){const wy=b.h+mb+(P_?4:7)*k+r*fh;if((V===0||V===3)&&r>0){g.fillStyle='rgba(255,235,200,.16)';g.fillRect(0,wy-6,b.w,3);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,wy-3,b.w,1);}
    for(let c=0;c<cols;c++){const wx=ox+c*cw,q=Math.random();if(RU&&r===0&&Math.random()<.5)continue;if(V===3&&c===ec&&r===rows-1)continue;
    if(kp)kp.windows.push({x:wx,y:wy-b.h,w:ww,h:wh,lit:q<(V===4?.008:P_?.012:.018),state:V!==4&&q>=.018&&q<.3&&!P_?'board':q<.48?'broken':'plain'});
    if(!P_){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(wx-2,wy+wh,ww+4,3);}
    if(V===4){win(wx,wy,ww,wh,q<.008);if((r+c)%2===0){const gr=g.createRadialGradient(wx+ww/2,wy,0,wx+ww/2,wy,ww*1.4);gr.addColorStop(0,'rgba(0,0,0,.7)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(wx-ww,wy-ww*1.4,ww*3,ww*2.4);}continue;}
    if(q<(P_?.012:.018))win(wx,wy,ww,wh,1);
    else if(q<.3&&!P_){g.fillStyle='#4a3424';g.fillRect(wx,wy,ww,wh);g.fillStyle='#24180f';for(let j=3;j<wh;j+=5)g.fillRect(wx,wy+j,ww,2);}
    else if(P_&&q<.2){g.fillStyle='#3a3a36';g.fillRect(wx-2,wy+wh-2,ww+4,4);g.fillStyle='#110b08';g.fillRect(wx,wy,ww,wh);}
    else if(q<.48){g.fillStyle='#0b0806';g.fillRect(wx,wy,ww,wh);g.fillStyle='rgba(170,190,200,.3)';g.beginPath();g.moveTo(wx,wy);g.lineTo(wx+ww*R(.3,.8),wy);g.lineTo(wx,wy+wh*R(.2,.6));g.fill();g.beginPath();g.moveTo(wx+ww,wy+wh);g.lineTo(wx+ww*R(.4,.9),wy+wh);g.lineTo(wx+ww,wy+wh*R(.4,.8));g.fill();}
    else win(wx,wy,ww,wh,0);
    if(V===0){g.fillStyle='rgba(240,215,160,.45)';g.beginPath();g.moveTo(wx-3,wy-2);g.lineTo(wx+ww/2,wy-7);g.lineTo(wx+ww+3,wy-2);g.fill();}
    if(V===1&&r<rows-1&&c%2===0&&c!==cols-1){const bx=wx-4,bw=ww+cw;g.fillStyle='#2a1f18';g.fillRect(bx,wy+wh,bw,3);for(let j=0;j<=bw;j+=4)g.fillRect(bx+j,wy+wh-7,1,7);g.fillRect(bx,wy+wh-8,bw,1.5);}
    if(V===2&&Math.random()<.18){const pw=R(10,24),ph=R(10,22),px=wx+R(-10,10),py=wy+R(-6,fh-ph);g.fillStyle=pick(D.walls);g.fillRect(px,py,pw,ph);bricks(g,px,py,pw,ph,5);}}}
  const base=b.h+b.H,dw=12*k,dh=17*k;
  if(V===3&&ec>=0){const ax=ox+ec*cw+ww/2;if(kp)kp.door={x:ax-dw*.8-1,y:b.H-dh*.75-dw*.8-1,w:dw*1.6+2,h:dh*.75+dw*.8+2};g.fillStyle='#0b0806';g.beginPath();g.moveTo(ax-dw*.8,base);g.lineTo(ax-dw*.8,base-dh*.75);g.arc(ax,base-dh*.75,dw*.8,Math.PI,0);g.lineTo(ax+dw*.8,base);g.fill();}
  else if((V===0||V===3)&&Math.random()<.45){const sh=fh*.85;if(kp)kp.door={x:0,y:b.H-sh-6,w:b.w,h:sh+6,shop:true};g.fillStyle='#2a1f18';g.fillRect(0,base-sh,b.w,sh);g.fillStyle='#1a1e22';g.fillRect(6,base-sh+8,b.w-12,sh-8);g.fillStyle='rgba(224,137,46,.15)';g.fillRect(10,base-sh+12,b.w*.3,sh-12);
    const ac=pick(['#c23a2e','#3a6a8a','#3B6D11','#d8a020']);for(let x=0;x<b.w;x+=12){g.fillStyle=(x/12)%2?ac:'#ead9c0';g.fillRect(x,base-sh-6,12,8);}g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,base-sh+2,b.w,2);}
  else{g.fillStyle='#0b0806';const dx=Math.floor(R(8,b.w-dw-8));if(kp)kp.door={x:dx,y:b.H-dh,w:dw,h:dh};g.fillRect(dx,base-dh,dw,dh);}
  if(V===4){g.globalCompositeOperation='destination-out';for(let x=0;x<b.w;x+=R(14,30)){const d_=R(6,b.H*.25);g.beginPath();g.moveTo(x,b.h-1);const x1=x+R(10,24),x2=x+R(4,14);g.lineTo(x1,b.h-1);g.lineTo(x2,b.h+d_);if(kp)kp.cuts.push([[x,b.h-1],[x1,b.h-1],[x2,b.h+d_]]);g.fill();}g.globalCompositeOperation='source-over';}}
  if(!L_&&Math.random()<.55){g.save();g.globalAlpha=.75;g.fillStyle=pick(['#d4537e','#7d9bff','#8fd16a','#f2d14b','#ead9c0','#d8642e']);g.font='600 '+Math.round(R(9,13))+'px sans-serif';
    g.translate(R(6,b.w*.5),b.h+b.H-R(4,10));g.rotate(R(-.12,.06));g.fillText(pick(TAGS),0,0);g.restore();}
  g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,b.h,b.w,4);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,b.h+b.H-3,b.w,3);
  for(let i=0;i<(L_?1:3);i++){const x=R(0,b.w),y=R(b.h,b.h+b.H),r=R(10,24),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(5,3,2,.55)');gr.addColorStop(1,'rgba(5,3,2,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  g.fillStyle=roof;g.fillRect(0,0,b.w,b.h);
  for(let i=0;i<b.w*b.h/30;i++){g.fillStyle=Math.random()<.5?'rgba(0,0,0,.15)':'rgba(255,230,200,.04)';g.fillRect(R(0,b.w),R(0,b.h),2,2);}
  if(RU){for(let i=0;i<b.w*b.h/60;i++){g.fillStyle=pick(['#4a3a2e','#5a4636','#3a2c22','#6b5543']);g.fillRect(R(0,b.w-4),R(0,b.h-3),R(2,6),R(2,4));}
    g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,b.w,4);g.fillRect(0,0,4,b.h);g.fillRect(b.w-4,0,4,b.h);
    g.globalCompositeOperation='destination-out';for(let x=0;x<b.w;x+=R(8,18)){const s=R(4,b.H*.6);g.beginPath();g.moveTo(x,b.h-2);const x1=x+R(6,14),x2=x+R(2,8);g.lineTo(x1,b.h-2);g.lineTo(x2,b.h+s);if(kp)kp.cuts.push([[x,b.h-2],[x1,b.h-2],[x2,b.h+s]]);g.fill();}g.globalCompositeOperation='source-over';}
  else if(P_){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,0,b.w,3);for(let x=30;x<b.w-20;x+=70){g.fillStyle='#2a2724';g.fillRect(x,b.h*.3,16,12);g.fillStyle='rgba(255,230,200,.06)';g.fillRect(x,b.h*.3,16,2);}
    g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;g.beginPath();g.moveTo(0,b.h/2);g.lineTo(b.w,b.h/2);g.stroke();}
  else if(L_){g.fillStyle='rgba(0,0,0,.2)';g.fillRect(0,b.h/2,b.w,b.h/2);g.strokeStyle='rgba(0,0,0,.25)';for(let x=0;x<b.w;x+=4){g.beginPath();g.moveTo(x,0);g.lineTo(x,b.h);g.stroke();}}
  else{for(let i=0;i<Math.floor(R(1,4));i++){g.fillStyle='#2a1f19';const vx=R(6,b.w-20),vy=R(6,b.h-16);g.fillRect(vx,vy,12,9);g.fillStyle='rgba(255,230,200,.08)';g.fillRect(vx,vy,12,2);}
  for(let i=0;i<Math.floor(R(0,3));i++){const cx=R(8,b.w-18),cy=R(4,b.h-18);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(cx+3,cy+4,10,12);g.fillStyle=pick(D.walls);g.fillRect(cx,cy,10,12);g.fillStyle='#14100d';g.fillRect(cx+2,cy+2,6,4);}
  if(Math.random()<.35){const cx=R(14,b.w-14),cy=R(10,b.h-10);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(cx+3,cy+3,7,4,0,0,7);g.fill();g.fillStyle='#b8b0a0';g.beginPath();g.ellipse(cx,cy,7,4,.4,0,7);g.fill();g.fillStyle='#7a766c';g.fillRect(cx-1,cy-1,2,2);}
  if(Math.random()<.2&&b.w>90){const px=R(8,b.w-60),py=R(6,Math.max(7,b.h-30));for(let r=0;r<2;r++)for(let k=0;k<4;k++){g.fillStyle='#1d2a3a';g.fillRect(px+k*12,py+r*11,11,10);g.fillStyle='rgba(125,170,220,.25)';g.fillRect(px+k*12,py+r*11,11,2);}}
  if(Math.random()<.4){for(let i=0;i<6;i++){g.fillStyle=pick(['#3b4a22','#4a5a2a','#2f3b1c']);g.beginPath();g.arc(R(6,b.w-6),R(6,b.h-6),R(3,7),0,7);g.fill();}}
  if(Math.random()<.65){const cx=R(b.w*.25,b.w*.75),cy=R(b.h*.3,b.h*.7),rr_=Math.min(b.w,b.h)*R(.18,.3);g.fillStyle='#0d0806';g.beginPath();
    for(let a=0;a<6.28;a+=.5){const q=rr_*R(.6,1.15);g.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q*.8);}g.closePath();g.fill();
    for(let i=0;i<14;i++){g.fillStyle=pick(['#4a3a2e','#5a4636','#3a2c22']);const a=R(0,6.28),q=rr_*R(.9,1.5);g.fillRect(cx+Math.cos(a)*q,cy+Math.sin(a)*q*.8,R(3,7),R(2,5));}}}
  if(!RU){g.fillStyle='rgba(255,225,190,.13)';g.fillRect(0,0,b.w,2);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=2;g.strokeRect(1,1,b.w-2,b.h-2);}
  if(!L_&&!P_){g.globalCompositeOperation='destination-out';for(let i=0;i<3;i++){const x=R(0,b.w),s=R(8,22);g.beginPath();g.moveTo(x-s,0);g.lineTo(x+s,0);const x1=x+R(-4,4),y1=R(6,s);g.lineTo(x1,y1);if(kp)kp.cuts.push([[x-s,0],[x+s,0],[x1,y1]]);g.fill();}g.globalCompositeOperation='source-over';}
  b.spr=c;
  bShadow(b);
  for(let i=0;i<(L_?2:10);i++){gx.fillStyle=pick(['#4a3a2e','#3d3027','#5a4636']);const s=R(3,9);gx.fillRect(b.x+R(-12,b.w+6),b.y+b.h+R(0,14),s,s*.7);}
}
function stamp(x,y,col,r){gx.fillStyle=col;for(let i=0;i<5;i++){gx.beginPath();gx.ellipse(x+R(-r,r)*.6,y+R(-r,r)*.4,R(r*.3,r*.7),R(r*.2,r*.45),R(0,3),0,7);gx.fill();}}
// spatial hash for walls: built after world generation, used by collide() and wallAt() every frame
let WG=new Map();const WC=128,wk=(x,y)=>x*1000+y;
function gridCells(o,f){const x0=Math.floor(o.x/WC),x1=Math.floor((o.x+o.w)/WC),y0=Math.floor(o.y/WC),y1=Math.floor((o.y+o.h)/WC);for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)f(wk(x,y));}
function gridBuild(){WG=new Map();for(const o of walls)gridCells(o,k=>{let a=WG.get(k);if(!a)WG.set(k,a=[]);a.push(o);});}
function gridDel(o){gridCells(o,k=>{const a=WG.get(k);if(a){const i=a.indexOf(o);if(i>=0)a.splice(i,1);}});}
const NB=[];function nearWalls(x,y,r){NB.length=0;const x0=Math.floor((x-r)/WC),x1=Math.floor((x+r)/WC),y0=Math.floor((y-r)/WC),y1=Math.floor((y+r)/WC);for(let i=x0;i<=x1;i++)for(let j=y0;j<=y1;j++){const a=WG.get(wk(i,j));if(a)for(const o of a)NB.push(o);}return NB;}
function collide(o){
  for(const r of nearWalls(o.x,o.y,o.r+2)){if(r.gate&&(o===P||!spSafe()))continue;if(r.ob){const b=r.ob,[u,v]=obL(b,o.x,o.y),hw=b.w/2,hh=b.h/2,cu=clamp(u,-hw,hw),cv=clamp(v,-hh,hh),du=u-cu,dv=v-cv,d2=du*du+dv*dv;
      if(d2<o.r*o.r){let nu,nv;if(d2===0){const m=Math.min(hw-u,u+hw,hh-v,v+hh);nu=m===hw-u?hw+o.r:m===u+hw?-hw-o.r:u;nv=m===hh-v?hh+o.r:m===v+hh?-hh-o.r:v;if(m===hw-u||m===u+hw)nv=v;else nu=u;}else{const d=Math.sqrt(d2);nu=cu+du/d*o.r;nv=cv+dv/d*o.r;}[o.x,o.y]=obW(b,nu,nv);}continue;}
    const cx=clamp(o.x,r.x,r.x+r.w),cy=clamp(o.y,r.y,r.y+r.h),dx=o.x-cx,dy=o.y-cy,d2=dx*dx+dy*dy;
    if(d2<o.r*o.r){if(d2===0){const l=o.x-r.x,ri=r.x+r.w-o.x,t=o.y-r.y,b=r.y+r.h-o.y,m=Math.min(l,ri,t,b);
        if(m===l)o.x=r.x-o.r;else if(m===ri)o.x=r.x+r.w+o.r;else if(m===t)o.y=r.y-o.r;else o.y=r.y+r.h+o.r;}
      else{const d=Math.sqrt(d2);o.x=cx+dx/d*o.r;o.y=cy+dy/d*o.r;}}}
  o.x=clamp(o.x,o.r,WS-o.r);o.y=clamp(o.y,o.r,WH-o.r);}
