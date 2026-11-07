/* ================= biomes: lot types per block, weather ================= */
// lots: weights for normal blocks. big: weights for large outer blocks. roads: chance for each extra outer road. trees: tree kinds. wx: weather.
const BIOME=[
 {lots:{houses:3,park:2,forest:2,kleingarten:1,ruins:1},big:{forest:3,water:2,park:1},roads:.5,trees:['green','green','autumn','dead'],grass:['#26301a','#2f3b1c','#3b4a22'],wx:'fireflies'},
 {lots:{houses:3,hinterhof:3,market:2,park:1,ruins:1,parking:1},big:{park:1,hinterhof:1},roads:.7,trees:['green','autumn','dead'],grass:['#283019','#313a1e','#3a4422'],wx:'rain'},
 {lots:{plattenbau:4,construction:2,ruins:2,parking:1,park:1},big:{plattenbau:2,construction:1},roads:.8,trees:['dead','green','dead'],grass:['#2a2c1c','#33361f','#3d4024'],wx:'ash'},
 {lots:{kleingarten:3,houses:1,parking:1,construction:1,airfield:2},big:{airfield:3,kleingarten:1},roads:.35,trees:['dead','autumn'],grass:['#2c2e18','#36381c','#414322'],wx:'dust'},
 {lots:{houses:3,market:3,hinterhof:2,parking:1,park:1},big:{market:1,park:1,hinterhof:1},roads:.65,trees:['green','autumn','dead'],grass:['#283019','#313a1e','#3a4422'],wx:'embers'},
 {lots:{houses:4,hinterhof:3,park:2,market:1,ruins:1},big:{park:2,hinterhof:1},roads:.6,trees:['autumn','autumn','green'],grass:['#2c3019','#363a1e','#40441f'],wx:'leaves'},
 {lots:{houses:2,forest:2,ruins:1,kleingarten:2,water:1},big:{water:2,forest:2},roads:.45,trees:['green','dark','autumn'],grass:['#232c18','#2b3620','#344026'],wx:'fog'},
 {lots:{plattenbau:5,parking:2,park:1,construction:1,ruins:1},big:{plattenbau:2,park:1},roads:.75,trees:['dead','green'],grass:['#2a2c1c','#33361f','#3d4024'],wx:'snow'}];
const LOTN={efh:'Einfamilienhäuser',reihen:'Reihenhäuser',park:'Park',forest:'Wald',kleingarten:'Kleingärten',market:'Markt',plattenbau:'Plattenbau',hinterhof:'Hinterhof',ruins:'Trümmerfeld',construction:'Baustelle',parking:'Parkplatz',water:'See',airfield:'Rollfeld',houses:'Altbau'};
const inB=(b,m)=>({x:R(b.x0+m,b.x1-m),y:R(b.y0+m,b.y1-m)});
function grassFill(b,pal,dens){const g=gx;g.fillStyle=pal[0];g.fillRect(b.x0+6,b.y0+6,b.w-12,b.h-12);
  for(let i=0;i<b.w*b.h/260*(dens||1);i++){g.fillStyle=pick(pal);g.globalAlpha=R(.4,.9);g.fillRect(R(b.x0+6,b.x1-8),R(b.y0+6,b.y1-8),R(2,7),R(2,5));}g.globalAlpha=1;
  g.strokeStyle='rgba(120,150,70,.18)';g.lineWidth=1;for(let i=0;i<b.w*b.h/900;i++){const x=R(b.x0+8,b.x1-8),y=R(b.y0+8,b.y1-8);g.beginPath();g.moveTo(x,y);g.lineTo(x+R(-2,2),y-R(3,7));g.stroke();}}
function lotGround(b){const g=gx,B=BIOME[D.i];
  if(b.lot==='park'||b.lot==='forest'||b.lot==='airfield')grassFill(b,b.lot==='forest'?B.grass.map(c=>dark(c,.8)):B.grass,b.lot==='forest'?1.4:1);
  else if(b.lot==='kleingarten'||b.lot==='efh'||b.lot==='reihen'){grassFill(b,B.grass,.6);}
  else if(b.lot==='market'){for(let y=b.y0+8;y<b.y1-8;y+=10)for(let x=b.x0+8+((y/10)%2)*6;x<b.x1-8;x+=12){g.fillStyle=pick(['#3d3128','#372c24','#433629','#30261f']);g.fillRect(x,y,10,8);}}
  else if(b.lot==='parking'){g.fillStyle='#211c19';g.fillRect(b.x0+8,b.y0+8,b.w-16,b.h-16);for(let i=0;i<b.w*b.h/600;i++){g.fillStyle='rgba(0,0,0,.2)';g.fillRect(R(b.x0,b.x1),R(b.y0,b.y1),R(2,6),R(2,4));}}
  else if(b.lot==='construction'){g.fillStyle='#4a3c2a';g.fillRect(b.x0+8,b.y0+8,b.w-16,b.h-16);for(let i=0;i<b.w*b.h/150;i++){g.fillStyle=pick(['#5a4a34','#3e3224','#54442e','rgba(0,0,0,.15)']);g.fillRect(R(b.x0+8,b.x1-10),R(b.y0+8,b.y1-10),R(2,5),R(2,4));}}
  else if(b.lot==='plattenbau'){g.fillStyle='#2b2723';g.fillRect(b.x0+8,b.y0+8,b.w-16,b.h-16);g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1;for(let x=b.x0+8;x<b.x1-8;x+=40){g.beginPath();g.moveTo(x,b.y0+8);g.lineTo(x,b.y1-8);g.stroke();}for(let y=b.y0+8;y<b.y1-8;y+=40){g.beginPath();g.moveTo(b.x0+8,y);g.lineTo(b.x1-8,y);g.stroke();}}
  else if(b.lot==='ruins'){for(let i=0;i<b.w*b.h/120;i++){g.fillStyle=pick(['#3a2e25','#4a3a2e','#2a211b','#55443a','rgba(0,0,0,.25)']);g.fillRect(R(b.x0+8,b.x1-10),R(b.y0+8,b.y1-10),R(2,8),R(2,6));}}
  else if(b.lot==='hinterhof'){g.fillStyle='#2e2620';g.fillRect(b.x0+8,b.y0+8,b.w-16,b.h-16);}}
function lotFill(b){if(b.center)return;const f=LOTS[b.lot];if(f)f(b);if(b.lot!=='houses'&&b.lot!=='plaza'&&LOTN[b.lot]&&Math.random()<.5){const q=inB(b,60);if(!inWall(q.x,q.y,20))marks.push({x:q.x,y:q.y,n:LOTN[b.lot],soft:1});}}
function tryB(x,y,w,h,H,st,force){const gb=st==='efh'?R(.55,.7)*h:st==='reihen'?R(.45,.55)*h:0;H+=gb*.5;const T=D.geo?20:H;// geo maps check the footprint only (iso facades rise on screen, not into the street north of the house)
  if(w<30||h<20||resHit(x,y-T,w,h+T)||!force&&blds.some(o=>o.h>0&&x<o.x+o.w+24&&x+w+24>o.x&&y-T<o.y+o.h+24&&y+h+24>o.y-(D.geo?0:o.top)))return null;const bb={x,y,w,h,H:Math.round((H-gb*.5)*(st==='laube'?1.2:2)),top:H,R0:0,gable:gb};makeB(bb,st);blds.push(bb);walls.push(bb);return bb;}
function bench(x,y){const g=gx;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-18,y+3,38,6);g.fillStyle='#4a3424';for(let k=0;k<3;k++)g.fillRect(x-18,y-6+k*4,36,3);g.fillStyle='#24201c';g.fillRect(x-16,y+4,3,5);g.fillRect(x+13,y+4,3,5);}
function pond(cx,cy,rx,ry){const g=gx;g.fillStyle='#3a3226';g.beginPath();g.ellipse(cx,cy,rx+8,ry+7,0,0,7);g.fill();g.fillStyle='#0f1a1d';g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,7);g.fill();
  g.fillStyle='rgba(120,170,180,.12)';g.beginPath();g.ellipse(cx-rx*.2,cy-ry*.3,rx*.6,ry*.35,0,0,7);g.fill();
  for(let y=cy-ry+8;y<cy+ry-8;y+=16){const hw=rx*Math.sqrt(Math.max(0,1-Math.pow((y+8-cy)/ry,2)))-10;if(hw>10)walls.push({x:cx-hw,y,w:hw*2,h:16,water:1});}
  for(let i=0;i<Math.round(rx/6);i++){const a=R(0,6.28);g.strokeStyle=pick(['#4a5a2a','#5a6a30','#3b4a22']);g.lineWidth=1.5;const x=cx+Math.cos(a)*(rx+4),y=cy+Math.sin(a)*(ry+3);for(let k=0;k<3;k++){g.beginPath();g.moveTo(x+k*2,y);g.lineTo(x+k*2+R(-2,2),y-R(8,14));g.stroke();}}
  waters.push({ex:cx,ey:cy,rx,ry});reserved.push({x:cx-rx-10,y:cy-ry-10,w:rx*2+20,h:ry*2+20});}
function fence(x,y,w,h,gate,col){const g=gx;g.strokeStyle=col||'#5a4636';g.lineWidth=2;const seg=(x0,y0,x1,y1)=>{g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();walls.push({x:Math.min(x0,x1)-2,y:Math.min(y0,y1)-2,w:Math.abs(x1-x0)+4,h:Math.abs(y1-y0)+4});
    g.fillStyle=col||'#5a4636';const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))/9;for(let i=0;i<=n;i++)g.fillRect(x0+(x1-x0)*i/n-1,y0+(y1-y0)*i/n-3,2,5);};
  seg(x,y,x+w,y);seg(x,y,x,y+h);seg(x+w,y,x+w,y+h);const gm=x+w*gate;seg(x,y+h,gm-16,y+h);seg(gm+16,y+h,x+w,y+h);}
function sprite(x,y,w,h,H,draw,lights){const c=cnv(w,h+H),t=c.getContext('2d');draw(t);const o={x,y,w,h,H,top:H,spr:c,lights:lights||[]};blds.push(o);if(h>0)walls.push(o);return o;}
const LOTS={
 houses(b){const n=Math.max(2,Math.round(b.w*b.h/(48000*BSC*BSC)*(D.geo?1.5:1)));let k=0,t=0;while(k<n&&t++<n*40){const w=Math.min(b.w-60,R(100,220)*BSC),h=R(50,105)*BSC,H=R(38,72)*BHS,x=R(b.x0+24,b.x1-24-w),y=R(b.y0+24+H,b.y1-24-h);if(tryB(x,y,w,h,H))k++;}
   for(let i=0;i<4;i++){const q=inB(b,40);if(!inWall(q.x,q.y,30)&&!resHit(q.x-28,q.y-60,56,62))makeTree(q.x,q.y,pick(BIOME[D.i].trees));}},
 park(b){const g=gx,pts=[];const sx=b.x0,sy=R(b.y0+60,b.y1-60),ex=b.x1,ey=R(b.y0+60,b.y1-60),mx=(sx+ex)/2+R(-80,80),my=R(b.y0+40,b.y1-40);
   g.strokeStyle='#3a3127';g.lineWidth=30;g.lineCap='round';g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(mx,my,ex,ey);g.stroke();g.strokeStyle='#4a4034';g.lineWidth=24;g.stroke();g.lineCap='butt';
   for(let i=0;i<=20;i++){const t=i/20,x=(1-t)*(1-t)*sx+2*(1-t)*t*mx+t*t*ex,y=(1-t)*(1-t)*sy+2*(1-t)*t*my+t*t*ey;pts.push([x,y]);if(i%7===3){bench(x+R(-6,6),y-26);}}
   const nearP=(x,y,m)=>pts.some(p=>Math.hypot(p[0]-x,p[1]-y)<m);
   if(b.w>300&&b.h>260&&Math.random()<.7){for(let t=0;t<20;t++){const rx=R(60,Math.min(130,b.w/4)),ry=rx*R(.5,.75),q=inB(b,rx+30);if(!nearP(q.x,q.y,rx+40)&&!resHit(q.x-rx-10,q.y-ry-10,rx*2+20,ry*2+20)){pond(q.x,q.y,rx,ry);break;}}}
   const n=Math.round(b.w*b.h/9000);for(let i=0,t=0;i<n&&t<n*6;t++){const q=inB(b,24);if(nearP(q.x,q.y,34)||inWall(q.x,q.y,30)||resHit(q.x-28,q.y-60,56,62))continue;makeTree(q.x,q.y,pick(BIOME[D.i].trees));i++;}
   for(let i=0;i<3;i++){const p=pick(pts);if(!inWall(p[0]+30,p[1],20))makeLamp(p[0]+28,p[1]+4,Math.random()<.6);}},
 forest(b){const g=gx;const n=Math.round(b.w*b.h/4200);for(let i=0,t=0;i<n&&t<n*5;t++){const q=inB(b,20);if(inWall(q.x,q.y,26)||resHit(q.x-28,q.y-60,56,62))continue;makeTree(q.x,q.y,pick(['green','green','dark',...BIOME[D.i].trees]));i++;}
   for(let i=0;i<Math.round(b.w*b.h/60000);i++){const q=inB(b,50),w=R(50,80);if(inWall(q.x,q.y,40)||resHit(q.x-4,q.y-4,w+8,18))continue;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(q.x+3,q.y+4,w,10);g.fillStyle='#3a2a1e';g.fillRect(q.x,q.y,w,10);g.fillStyle='#4a3626';g.fillRect(q.x,q.y,w,3);g.fillStyle='#2a1d14';g.beginPath();g.arc(q.x+w,q.y+5,5,0,7);g.fill();walls.push({x:q.x,y:q.y,w,h:10});}
   for(let i=0;i<b.w*b.h/8000;i++){const q=inB(b,10);g.fillStyle=pick(['#c23a2e','#ead9c0','#d8642e']);g.fillRect(q.x,q.y,3,2);g.fillStyle='#ead9c0';g.fillRect(q.x+1,q.y+2,1,2);}},
 water(b){const rx=b.w/2-50,ry=b.h/2-50;pond((b.x0+b.x1)/2,(b.y0+b.y1)/2,rx,ry);const g=gx,cx=(b.x0+b.x1)/2,y=(b.y0+b.y1)/2+ry-6;
   g.fillStyle='#4a3424';g.fillRect(cx-10,y-70,20,80);for(let k=0;k<8;k++){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(cx-10,y-66+k*10,20,2);}
   for(let i=0;i<6;i++){const a=R(0,6.28),x=cx+Math.cos(a)*(rx+30),yy=(b.y0+b.y1)/2+Math.sin(a)*(ry+26);if(x>b.x0+20&&x<b.x1-20&&yy>b.y0+40&&yy<b.y1-10&&!inWall(x,yy,24))makeTree(x,yy,pick(BIOME[D.i].trees));}
   marks.push({x:cx,y:(b.y0+b.y1)/2,n:D.i===0?'Müggelsee':D.i===6?'Havel':'Der See',soft:1});},
 kleingarten(b){const g=gx,pw=118,ph=96,gap=26;const cols=Math.floor((b.w-30)/(pw+gap)),rows=Math.floor((b.h-30)/(ph+gap));const ox=b.x0+(b.w-cols*(pw+gap)+gap)/2,oy=b.y0+(b.h-rows*(ph+gap)+gap)/2;
   for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=ox+c*(pw+gap),y=oy+r*(ph+gap);if(resHit(x,y,pw,ph))continue;
     const wild=Math.random()<.3;g.fillStyle=wild?'#2a3018':'#33301e';g.fillRect(x,y,pw,ph);
     if(!wild)for(let k=0;k<4;k++){g.fillStyle='#3a2a1e';g.fillRect(x+10,y+40+k*13,pw-56,7);for(let j=0;j<6;j++){g.fillStyle=pick(['#4a5a2a','#5a6a30','#6a7a34','#c23a2e','#f2d14b']);g.beginPath();g.arc(x+14+j*(pw-62)/6,y+43+k*13,3,0,7);g.fill();}}
     else for(let k=0;k<30;k++){g.fillStyle=pick(['#3b4a22','#4a5a2a','#2f3b1c']);g.beginPath();g.arc(x+R(6,pw-6),y+R(6,ph-6),R(3,7),0,7);g.fill();}
     fence(x,y,pw,ph,R(.3,.7),pick(['#5a4636','#6a5a46','#4a3a2e']));
     const sw=34,sh=26,sH=24;tryB(x+pw-sw-6,y+8+sH,sw,sh,sH,'laube');
     if(Math.random()<.25)addBrk(x+20,y+20,Math.random()<.5?'crate':'bin',false);}},
 market(b){const g=gx,cols=['#c23a2e','#3a6a8a','#d8a020','#3B6D11','#7a3a6a'];const sw=64,sh=30,gx_=40,gy=96;
   for(let y=b.y0+60;y<b.y1-50;y+=sh+gy)for(let x=b.x0+30;x<b.x1-sw-20;x+=sw+gx_){if(Math.random()<.35||resHit(x,y-28,sw,sh+28))continue;const c1=pick(cols);
     sprite(x,y,sw,sh,28,t=>{t.fillStyle='#3a2a20';t.fillRect(4,28,sw-8,sh);t.fillStyle='#5a4030';t.fillRect(4,28+sh-8,sw-8,8);
       for(let i=0;i<sw;i+=8){t.fillStyle=(i/8)%2?c1:'#ead9c0';t.fillRect(i,0,8,30);}t.fillStyle='rgba(0,0,0,.25)';t.fillRect(0,22,sw,8);
       for(let i=8;i<sw-8;i+=7){t.fillStyle=pick(['#c23a2e','#f2d14b','#8fd16a','#ead9c0','#d8642e','#7d9bff']);t.beginPath();t.arc(i,30+sh-12,3,0,7);t.fill();}
       t.fillStyle='rgba(255,230,200,.12)';t.fillRect(0,0,sw,2);});
     
     if(Math.random()<.4)addBrk(x+sw+14,y+sh-6,'crate',false);}
   if(Math.random()<.6){const q=inB(b,60);if(!inWall(q.x,q.y,24)){barrels.push({x:q.x,y:q.y,ph:R(0,6)});walls.push({x:q.x-9,y:q.y-9,w:18,h:18});}}},
 parking(b){const g=gx;for(let y=b.y0+30;y<b.y1-110;y+=130){for(let x=b.x0+24;x<b.x1-56;x+=54){g.fillStyle='rgba(234,217,192,.14)';g.fillRect(x,y,2,100);
     if(Math.random()<.3&&!resHit(x+4,y+3,46,94)){addVeh(x+5,y+5,44,92,true,pick(['car','car','trabi','van']));walls.push({x:x+5,y:y+5,w:44,h:92});}}}
   if(Math.random()<.5){const q=inB(b,60);g.fillStyle='rgba(0,0,0,.5)';g.beginPath();g.ellipse(q.x,q.y,40,24,0,0,7);g.fill();}},
 construction(b){const g=gx,cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2;
   if(!resHit(cx-20,cy-20,40,40)){g.fillStyle='rgba(0,0,0,.3)';g.save();g.translate(cx,cy);g.rotate(R(0,6.28));g.fillRect(0,-5,Math.min(b.w,b.h)*.45,10);g.restore();
     sprite(cx-14,cy,28,28,200,t=>{t.fillStyle='#c9a227';for(let y=0;y<196;y+=14){t.fillRect(6,y,3,14);t.fillRect(19,y,3,14);t.strokeStyle='#c9a227';t.lineWidth=1.5;t.beginPath();t.moveTo(8,y);t.lineTo(20,y+14);t.moveTo(20,y);t.lineTo(8,y+14);t.stroke();}
       t.fillStyle='#4a4740';t.fillRect(0,196,28,32);t.fillStyle='#2a2522';t.fillRect(2,2,24,12);t.fillStyle='#f2d14b';t.fillRect(4,4,8,6);},[{x:cx,y:cy-190,r:30}]).bb=1;}
   for(let i=0;i<Math.round(b.w*b.h/50000);i++){const q=inB(b,50);if(inWall(q.x,q.y,40)||resHit(q.x-30,q.y-20,60,40))continue;const k=Math.random();
     if(k<.4){const w=60,h=24;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(q.x+4,q.y+5,w,h);g.fillStyle=pick(['#3a6a8a','#8a3a2a','#3B6D11','#7a6a3a']);g.fillRect(q.x,q.y,w,h);g.fillStyle='rgba(0,0,0,.2)';for(let x=q.x+4;x<q.x+w;x+=6)g.fillRect(x,q.y,2,h);walls.push({x:q.x,y:q.y,w,h});}
     else if(k<.7){for(let r=0;r<3;r++)for(let c=0;c<4-r;c++){g.fillStyle='#5a5650';g.beginPath();g.arc(q.x+c*12+r*6,q.y-r*9,6,0,7);g.fill();g.fillStyle='#1a1612';g.beginPath();g.arc(q.x+c*12+r*6,q.y-r*9,3,0,7);g.fill();}walls.push({x:q.x-6,y:q.y-24,w:48,h:30});}
     else{g.fillStyle='#6a5a3e';g.beginPath();g.ellipse(q.x,q.y,30,16,0,0,7);g.fill();g.fillStyle='#7a6a4a';g.beginPath();g.ellipse(q.x-6,q.y-4,18,9,0,0,7);g.fill();walls.push({x:q.x-22,y:q.y-10,w:44,h:20});}}
   g.fillStyle='#d8642e';for(let x=b.x0+12;x<b.x1-12;x+=40){g.fillRect(x,b.y0+12,20,4);g.fillRect(x,b.y1-16,20,4);}},
 plattenbau(b){const n=Math.max(1,Math.floor(b.h/420));for(let k=0;k<n;k++){const w=Math.min(b.w-70,R(240,520)),h=R(64,90)*BSC,H=R(100,140)*BHS*.75,x=b.x0+R(30,Math.max(31,b.w-w-30)),y=b.y0+H+30+k*(b.h/n);if(y+h>b.y1-20)continue;tryB(x,y,w,h,H,'platte');}
   const g=gx;for(let i=0;i<3;i++){const q=inB(b,50);if(inWall(q.x,q.y,40)||resHit(q.x-30,q.y-30,60,60))continue;g.fillStyle='#5a4a3a';g.fillRect(q.x-20,q.y-14,40,28);g.strokeStyle='#8a3a2a';g.lineWidth=3;g.beginPath();g.moveTo(q.x-16,q.y);g.lineTo(q.x-16,q.y-30);g.lineTo(q.x+16,q.y-30);g.lineTo(q.x+16,q.y);g.stroke();break;}
   for(let i=0;i<3;i++){const q=inB(b,40);if(!inWall(q.x,q.y,30)&&!resHit(q.x-28,q.y-60,56,62))makeTree(q.x,q.y,pick(BIOME[D.i].trees));}},
 ruins(b){const g=gx;const n=Math.round(b.w*b.h/(45000*BSC*BSC));for(let k=0,t=0;k<n&&t<n*20;t++){const w=R(60,150)*BSC,h=R(30,60)*BSC,H=R(14,34)*BHS*.75,x=R(b.x0+20,b.x1-20-w),y=R(b.y0+20+H,b.y1-20-h);if(tryB(x,y,w,h,H,'ruin'))k++;}
   for(let i=0;i<Math.round(b.w*b.h/30000);i++){const q=inB(b,30);if(inWall(q.x,q.y,30)||resHit(q.x-25,q.y-15,50,30))continue;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(q.x+4,q.y+5,26,12,0,0,7);g.fill();
     for(let j=0;j<16;j++){g.fillStyle=pick(['#5a4636','#4a3a2e','#6b5543','#3a2c22','#7a3a26']);g.fillRect(q.x+R(-22,18),q.y+R(-10,8),R(4,10),R(3,7));}walls.push({x:q.x-20,y:q.y-9,w:40,h:18});}
   if(Math.random()<.7){const q=inB(b,60);if(!inWall(q.x,q.y,24)&&!resHit(q.x-9,q.y-9,18,18)){barrels.push({x:q.x,y:q.y,ph:R(0,6)});walls.push({x:q.x-9,y:q.y-9,w:18,h:18});}}},
 hinterhof(b){const m=20,d=R(70,90)*BSC,H=R(60,80)*BHS;if(b.h<H+3*d+2*m+120||b.w<2*d+240)return LOTS.houses(b);const gc=b.x0+R(.35,.65)*b.w,y1=b.y1-m-d;
   if(resHit(b.x0+m,b.y0+m,b.w-2*m,b.h-2*m))return LOTS.houses(b);
   tryB(b.x0+m,b.y0+m+H,b.w-2*m,d,H,0,1);const wy=b.y0+m+H+d,wh=y1-wy;
   tryB(b.x0+m,wy,d,wh,H*.6,0,1);tryB(b.x1-m-d,wy,d,wh,H*.6,0,1);
   tryB(b.x0+m,y1,gc-30-b.x0-m,d,H,0,1);tryB(gc+30,y1,b.x1-m-gc-30,d,H,0,1);
   const g=gx;g.fillStyle='#3a3029';g.fillRect(gc-30,y1,60,d+m);
   const cx=(b.x0+b.x1)/2,cy=(wy+y1)/2;if(!inWall(cx,cy,30))makeTree(cx,cy,pick(BIOME[D.i].trees));
   for(let i=0;i<4;i++){const q={x:cx+R(-80,80),y:cy+R(-50,50)};if(!inWall(q.x,q.y,24))addBrk(q.x,q.y,Math.random()<.6?'bin':'crate',false);}
   for(let i=0;i<5;i++){g.strokeStyle='#2a2522';g.lineWidth=1.5;const x=b.x0+m+d+20+i*14,y=wy+16;g.beginPath();g.arc(x,y,5,0,7);g.arc(x+9,y,5,0,7);g.stroke();}
   marks.push({x:cx,y:cy,n:'Hinterhof',soft:1});},
 // Einfamilienhäuser: plots with fence, garden and a gabled house. Reihenhäuser: rows of 3 to 6 units under one gable roof
 efh(b){const pw=Math.max(180,R(.9,1.1)*230),ph=230,cols=Math.max(1,Math.floor((b.w-20)/pw)),rows=Math.max(1,Math.floor((b.h-20)/ph));
   for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=b.x0+10+c*pw,y=b.y0+10+r*ph;if(Math.random()<.15||resHit(x,y,pw-10,ph-10))continue;
     const w=R(80,100)*BSC,h=R(65,80)*BSC,hx=x+R(10,Math.max(11,pw-w-20)),hy=y+ph-h-50;if(!tryB(hx,hy,w,h,44,'efh'))continue;
     fence(x,y,pw-10,ph-10,R(.3,.7),pick(['#5a4636','#6a5a46','#c8c0b0']));
     for(let i=0;i<2;i++){const tx=x+R(20,pw-30),ty=y+R(20,50);if(!inWall(tx,ty,26)&&!resHit(tx-28,ty-60,56,62))makeTree(tx,ty,pick(BIOME[D.i].trees));}
     if(Math.random()<.3)addBrk(x+pw-30,y+ph-30,'bin',false);}},
 reihen(b){const uw=R(52,64)*BSC,h=R(70,85)*BSC,ph=h+150;for(let y=b.y0+110;y+h<b.y1-30;y+=ph){const n=Math.min(6,Math.floor((b.w-40)/uw));if(n<3)return LOTS.houses(b);
     const x=b.x0+R(20,Math.max(21,b.w-n*uw-20)),bb=tryB(x,y,n*uw,h,44,'reihen');if(!bb)continue;
     const g=gx;for(let i=0;i<n;i++){g.fillStyle=pick(['#33301e','#3b4a22','#2a3018']);g.fillRect(x+i*uw+4,y+h+8,uw-8,50);g.fillStyle='#5a4636';g.fillRect(x+i*uw,y+h+8,2,50);}}},
 airfield(b){const g=gx,y=(b.y0+b.y1)/2;g.fillStyle='#2e2c27';g.fillRect(b.x0+10,y-40,b.w-20,80);g.fillStyle='rgba(234,217,192,.18)';for(let x=b.x0+20;x<b.x1-40;x+=60)g.fillRect(x,y-3,30,6);
   for(let i=0;i<b.w*b.h/9000;i++){const q=inB(b,10);if(Math.abs(q.y-y)<50)continue;g.strokeStyle=pick(['#5a6a30','#6a7a34','#4a5a2a']);g.lineWidth=1.5;for(let k=0;k<4;k++){g.beginPath();g.moveTo(q.x+k*2,q.y);g.lineTo(q.x+k*2+R(-3,3),q.y-R(6,12));g.stroke();}}
   if(Math.random()<.4){const q=inB(b,120);if(!resHit(q.x-70,q.y-40,140,80)){const a=R(-.4,.4);g.save();g.translate(q.x,q.y);g.rotate(a);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(-60,-6,130,16);g.fillRect(-14,-56,30,120);
       g.fillStyle='#6e6a62';g.fillRect(-64,-10,128,18);g.fillStyle='#5a5650';g.fillRect(-18,-60,28,120);g.fillRect(52,-24,10,46);g.fillStyle='#1a1e22';for(let k=0;k<6;k++)g.fillRect(-50+k*14,-6,6,6);g.fillStyle='#0d0806';g.beginPath();g.arc(-10,20,14,0,7);g.fill();g.restore();
       walls.push({x:q.x-62,y:q.y-12,w:124,h:22},{x:q.x-16,y:q.y-58,w:24,h:116});marks.push({x:q.x,y:q.y,n:'Rosinenbomber',soft:1});}}}
};
// ---- weather particles in view space ----
const WX=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),s:R(.4,1),w:R(0,6.28),z:R(1,2.6)}));
function drawWeather(t,dt){const k=BIOME[D.i].wx,n=S.eco?40:WX.length;
  for(let i=0;i<n;i++){const m=WX[i];
    if(k==='rain'){m.y+=m.s*dt*1.6;m.x-=m.s*dt*.25;if(m.y>1.05){m.y=-.05;m.x=Math.random()*1.2;}ctx.strokeStyle=`rgba(170,190,210,${.12+.12*m.s})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(m.x*VW,m.y*VH);ctx.lineTo(m.x*VW-3,m.y*VH+12*m.s);ctx.stroke();}
    else if(k==='ash'){m.y+=m.s*dt*.05;m.w+=dt;if(m.y>1.02){m.y=-.02;m.x=Math.random();}ctx.fillStyle=`rgba(200,195,185,${.18+.15*m.s})`;ctx.fillRect(m.x*VW+Math.sin(m.w)*14,m.y*VH,m.z,m.z);}
    else if(k==='dust'){m.x+=m.s*dt*.06;m.w+=dt*2;if(m.x>1.02){m.x=-.02;m.y=Math.random();}ctx.fillStyle=`rgba(210,190,140,${.12+.12*m.s})`;ctx.fillRect(m.x*VW,m.y*VH+Math.sin(m.w)*6,m.z*.8,m.z*.8);}
    else if(k==='fireflies'){if(i>30)break;m.w+=dt*m.s;m.x+=Math.cos(m.w*1.3)*dt*.01;m.y+=Math.sin(m.w)*dt*.01;if(m.x<0||m.x>1)m.x=Math.random();if(m.y<0||m.y>1)m.y=Math.random();const a=.3+.3*Math.sin(m.w*3);ctx.fillStyle=`rgba(210,240,120,${a})`;ctx.fillRect(m.x*VW,m.y*VH,2,2);ctx.fillStyle=`rgba(210,240,120,${a*.25})`;ctx.fillRect(m.x*VW-2,m.y*VH-2,6,6);}
    else if(k==='leaves'){if(i>40)break;m.y+=m.s*dt*.07;m.w+=dt*2;if(m.y>1.02){m.y=-.02;m.x=Math.random();}ctx.save();ctx.translate(m.x*VW+Math.sin(m.w)*20,m.y*VH);ctx.rotate(m.w);ctx.fillStyle=i%3?'rgba(150,90,30,.55)':'rgba(120,60,24,.55)';ctx.beginPath();ctx.ellipse(0,0,3.5,1.8,0,0,7);ctx.fill();ctx.restore();}
    else if(k==='snow'){m.y+=m.s*dt*.09;m.w+=dt;if(m.y>1.02){m.y=-.02;m.x=Math.random();}ctx.fillStyle=`rgba(235,235,240,${.35+.3*m.s})`;ctx.beginPath();ctx.arc(m.x*VW+Math.sin(m.w)*10,m.y*VH,m.z*.8,0,7);ctx.fill();}
    else if(k==='fog'){if(i>10)break;m.x+=dt*.008*m.s;if(m.x>1.3)m.x=-.3;const fx=m.x*VW,fy=m.y*VH;ctx.globalAlpha=.07;ctx.drawImage(glow('#c8ccd0'),fx-180,fy-90,360,180);ctx.globalAlpha=1;}
    else{if(i>36)break;m.y-=m.s*.016*.06;m.w+=.02;if(m.y<-.02){m.y=1.02;m.x=Math.random();}ctx.fillStyle=`rgba(239,159,39,${.25+.25*Math.sin(m.w*2)})`;ctx.fillRect(m.x*VW+Math.sin(m.w)*12,m.y*VH,m.z,m.z);}}}
function drawWaters(t){const camX=VB.x0,camY=VB.y0,VW_=VB.x1-VB.x0,VH_=VB.y1-VB.y0;ctx.strokeStyle='rgba(160,200,210,.16)';ctx.lineWidth=1.5;
  for(const w of waters){if(w.ex!=null){if(w.ex+w.rx<camX||w.ex-w.rx>camX+VW_||w.ey+w.ry<camY||w.ey-w.ry>camY+VH_)continue;for(let i=0;i<10;i++){const a=i*2.4+t*.0002*(i%3+1),r=.25+.6*((i*.37)%1),x=w.ex+Math.cos(a)*w.rx*r,y=w.ey+Math.sin(a*1.3)*w.ry*r*.8,l=8+6*Math.sin(t*.002+i);ctx.beginPath();ctx.moveTo(x-l,y);ctx.lineTo(x+l,y);ctx.stroke();}}
    else{if(w.y>camY+VH_||w.y+w.h<camY)continue;const a=Math.max(w.x,camX-30),b=Math.min(w.x+w.w,camX+VW_+30),span=b-a;if(span<=20)continue;// ripples only over this strip's own x range
      for(let i=0,n=Math.min(24,Math.ceil(24*span/(VW_+60)));i<n;i++){const x=a+((i*97+t*.03*(1+i%3))%span),y=w.y+10+((i*37)%(w.h-20)),l=10+6*Math.sin(t*.003+i);ctx.beginPath();ctx.moveTo(x-l,y);ctx.lineTo(x+l,y);ctx.stroke();}}}}
