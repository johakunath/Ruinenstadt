/* ================= Alexanderplatz (v0.49): the GDR survived and went wild. Clockwork order, gardens, daylight =================
   Board docs/style/alexanderplatz.png, mockup mockups/v049-alexanderplatz-geo.html. Enemy and boss art here, map further down ---- */
const GBR='#c8902a',GOL='#736734',GRD='#af4237',GOC='#e7982b';
// Uhrwerkläufer: brass barrel on jointed legs, dome head with one lens, wind-up key on the back, chimney. The clock-face shield is drawn by gdrShield
function drawUhr(e,C,sw){const s=e.r/13;ctx.scale(s,s);
  const leg=(x,k,f)=>{stick(x,-16,x+k*7,-8+f,3.2,C('#5a5030'));stick(x+k*7,-8+f,x+k*2,0,3.2,C('#6a5e38'));ctx.fillStyle=C(GOC);ctx.beginPath();ctx.arc(x+k*7,-8+f,1.8,0,7);ctx.fill();};
  leg(-4,-1,sw*2);leg(4,1,-sw*2);ctx.strokeStyle='#4a7a3a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-10,-8);ctx.quadraticCurveTo(-12,-4,-9,-1);ctx.stroke();
  ctx.fillStyle=C(e.col);rr(ctx,-9,-38,18,23,5);ctx.fillStyle=C('#9a8a4a');rr(ctx,-9,-38,5,23,3);ctx.fillStyle=C('#4e4622');ctx.fillRect(5,-36,4,20);
  ctx.fillStyle='#c8b070';for(const y of [-34,-19])for(let i=0;i<5;i++)ctx.fillRect(-7+i*3.4,y,1.2,1.2);ctx.fillStyle=GRD;ctx.beginPath();ctx.arc(-3,-27,1.8,0,7);ctx.fill();
  const k=Math.cos(e.t*5);ctx.fillStyle=C('#d4a27e');ctx.fillRect(-14,-29,5,1.6);ctx.beginPath();ctx.ellipse(-15,-31,1.6*Math.abs(k)+.4,2.4,0,0,7);ctx.ellipse(-15,-26,1.6*Math.abs(k)+.4,2.4,0,0,7);ctx.fill();
  ctx.fillStyle=C('#8a856e');ctx.beginPath();ctx.arc(0,-38,6,Math.PI,0);ctx.fill();ctx.fillStyle=C(GOC);ctx.beginPath();ctx.arc(3,-41,2.2,0,7);ctx.fill();ctx.fillStyle='#fff4c0';ctx.fillRect(2.4,-42,1,1);
  ctx.fillStyle=C('#5a5030');ctx.fillRect(5,-46,3,7);for(let i=0;i<3;i++){const p=(e.t*.8+i/3)%1;ctx.fillStyle=`rgba(216,212,200,${.4*(1-p)})`;ctx.beginPath();ctx.arc(6.5+p*3,-48-p*14,1.5+p*3,0,7);ctx.fill();}
  ctx.globalCompositeOperation='lighter';ctx.drawImage(glow(GOC),-3,-47,12,12);ctx.globalCompositeOperation='source-over';return 46*s;}
// clock face held in front (shield direction fa): brass rim, enamel face, ticks, turning hands. Open guard: face tipped down and dull
function gdrShield(e,fy,C,boss){const fa=e.fa,s=boss?1:e.r/13,sr=boss?e.r+4:17*s,cx=e.x+Math.cos(fa)*sr,cy=fy-16*s+Math.sin(fa)*sr*.6,px=-Math.sin(fa),py=Math.cos(fa)*.6,op=e.guard>0,R0=boss?20:11;
  ctx.save();ctx.translate(cx,cy+(op?6*s:0));ctx.transform(px||.01,py,0,op?.5:1,0,0);ctx.scale(s,s);ctx.fillStyle=op?'rgba(140,110,60,.7)':C(GBR);ctx.beginPath();ctx.arc(0,0,R0,0,7);ctx.fill();
  ctx.fillStyle=op?'rgba(200,190,170,.5)':C('#efe2c4');ctx.beginPath();ctx.arc(0,0,R0*.8,0,7);ctx.fill();ctx.strokeStyle='#14100c';ctx.lineWidth=1;
  for(let i=0;i<12;i++){const a=i/12*6.283,r1=R0*(i%3?.66:.56);ctx.beginPath();ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);ctx.lineTo(Math.cos(a)*R0*.76,Math.sin(a)*R0*.76);ctx.stroke();}
  ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(e.t*.5-1.57)*R0*.45,Math.sin(e.t*.5-1.57)*R0*.45);ctx.moveTo(0,0);ctx.lineTo(Math.cos(e.t*3)*R0*.7,Math.sin(e.t*3)*R0*.7);ctx.stroke();
  ctx.fillStyle=GRD;ctx.beginPath();ctx.arc(0,0,1.6,0,7);ctx.fill();ctx.restore();}
// Wurzler: ghoul fused with roots, gardener apron, long root arms to the ground, sunflower bursting from the skull. Arms rise while casting (tw)
function drawWurz(e,C,sw){const s=e.r/12;ctx.scale(s,s);const cast=e.tw>0?1-e.tw/(e.twm||.9):0;
  ctx.strokeStyle=C('#5a4a2a');ctx.lineWidth=1.6;for(const[a,b,c,d]of[[-3,0,-14,3],[3,0,14,4],[0,0,-6,6],[2,0,8,6]]){ctx.beginPath();ctx.moveTo(a,b);ctx.quadraticCurveTo((a+c)/2,b+2,c,d);ctx.stroke();}
  limb(-3,-14,sw*.4,13,3.4,C('#3a4a6a'));limb(3,-14,-sw*.4,13,3.4,C('#44567a'));
  ctx.fillStyle=C('#7a8a6a');rr(ctx,-8,-36,16,22,5);ctx.fillStyle=C(GOL);rr(ctx,-6,-31,12,16,2);ctx.strokeStyle='#4a3a22';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-31);ctx.lineTo(-5,-36);ctx.moveTo(4,-31);ctx.lineTo(5,-36);ctx.stroke();
  const arm=(x,k,ph)=>{const lift=cast*16,sx=Math.sin(e.t*2+ph)*2;ctx.strokeStyle=C(k<0?'#6a5634':'#7a6640');ctx.lineWidth=2.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,-33);ctx.quadraticCurveTo(x+k*12,-28-lift,x+k*14+sx,-6-lift*1.6);ctx.stroke();
    ctx.lineWidth=1.1;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+k*14+sx,-6-lift*1.6);ctx.lineTo(x+k*(14+i*2.5)+sx,-1-lift*1.6+i);ctx.stroke();}};
  arm(-7,-1,0);ctx.fillStyle=C('#8a9a7a');ctx.beginPath();ctx.arc(3,-40,5.4,0,7);ctx.fill();ctx.fillStyle='#f2d14b';ctx.fillRect(4,-42,1.8,1.8);ctx.fillRect(7,-41.5,1.6,1.6);ctx.fillStyle='#3a1a10';ctx.fillRect(4,-37,4,1.4);
  ctx.strokeStyle=C('#5a4a2a');ctx.lineWidth=1.4;for(const[a,b]of[[-6,-12],[0,-15],[6,-11]]){ctx.beginPath();ctx.moveTo(2,-44);ctx.quadraticCurveTo(2+a*.6,-48,2+a,-44+b*.6);ctx.stroke();}
  const fx=6,fy=-56,fr=.4*Math.sin(e.t*1.5);ctx.save();ctx.translate(fx,fy);ctx.rotate(.3+fr*.2);for(let i=0;i<12;i++){ctx.fillStyle=i%2?GOC:'#f2c230';ctx.save();ctx.rotate(i/12*6.283);ctx.beginPath();ctx.ellipse(6,0,3.4,1.5,0,0,7);ctx.fill();ctx.restore();}
  ctx.fillStyle='#5a3a1a';ctx.beginPath();ctx.ellipse(0,0,4,3.2,0,0,7);ctx.fill();ctx.restore();ctx.strokeStyle='#4a7a3a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(4,-45);ctx.lineTo(fx,fy+3);ctx.stroke();
  ctx.fillStyle='#5a8a3a';for(const[a,b,r]of[[-6,-46,.5],[8,-30,-.6],[-8,-24,1]]){ctx.beginPath();ctx.ellipse(a,b,2.6,1.3,r,0,7);ctx.fill();}arm(7,1,2);return 64*s;}
// Kernspeier: sunflower in a cracked clay pot that hops along, ring of teeth in the seed disc. The mouth opens wide while it plants (tw)
function drawKern(e,C,sw){const s=e.r/11;ctx.scale(s,s);const ch=e.tw>0?1-e.tw/(e.twm||.7):0,hop=(e.mv||0)>8?Math.abs(Math.sin(e.t*9))*3:0;ctx.translate(0,-hop);
  ctx.fillStyle=C('#a8603a');ctx.beginPath();ctx.moveTo(-7,-9);ctx.lineTo(7,-9);ctx.lineTo(5,0);ctx.lineTo(-5,0);ctx.fill();ctx.fillStyle=C('#c8784a');ctx.fillRect(-8,-11,16,3);ctx.strokeStyle='#5a2a14';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(1,-8);ctx.lineTo(-1,-4);ctx.lineTo(2,-1);ctx.stroke();
  const bend=ch*-4;ctx.strokeStyle=C('#4a7a3a');ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-11);ctx.quadraticCurveTo(-3+bend,-24,1,-34);ctx.stroke();
  ctx.fillStyle=C('#5a8a3a');for(const[a,b,r]of[[-5,-20,-.5],[5,-26,.5]]){ctx.beginPath();ctx.ellipse(a,b,5,2.2,r,0,7);ctx.fill();}
  ctx.save();ctx.translate(3,-40);ctx.scale(.8,1);const pr=10+ch*2;for(let i=0;i<16;i++){ctx.fillStyle=i%2?C(GOC):C('#f2c230');ctx.save();ctx.rotate(i/16*6.283+Math.sin(e.t)*.05);ctx.beginPath();ctx.ellipse(pr,0,4.6,1.9,0,0,7);ctx.fill();ctx.restore();}
  ctx.fillStyle=C('#5a3a1a');ctx.beginPath();ctx.arc(0,0,7.4,0,7);ctx.fill();const m=2.4+ch*3.4;ctx.fillStyle='#1a0a06';ctx.beginPath();ctx.ellipse(1.5,0,m*.9,m,0,0,7);ctx.fill();
  ctx.fillStyle='#efe2c4';for(let i=0;i<8;i++){const a=i/8*6.283;ctx.fillRect(1.5+Math.cos(a)*m*.85-.5,Math.sin(a)*m*.95-.5,1.1,1.1);}ctx.fillStyle='#2a1a0a';for(let i=0;i<10;i++){const a=i/10*6.283;ctx.fillRect(Math.cos(a)*6-.5,Math.sin(a)*6-.5,1,1);}ctx.restore();
  if(ch>0){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow('#f2c230'),-10,-54,28,28);ctx.globalCompositeOperation='source-over';}return 54*s;}
// Brigadeghul: ghouls at the Alex wear the blue Blaumann, a cap and a red armband (drawn over the ghoul)
function gdrGhoul(C){ctx.save();ctx.translate(1,-18);ctx.rotate(.35);ctx.fillStyle=C('#2e4a7a');ctx.beginPath();ctx.ellipse(0,0,6.6,9,0,0,7);ctx.fill();ctx.fillStyle=C('#26406a');ctx.fillRect(-2,-8,1.4,14);ctx.fillRect(2,-8,1.4,14);ctx.restore();
  ctx.fillStyle=C('#2e4a7a');ctx.beginPath();ctx.arc(7,-28,5.2,Math.PI,0);ctx.fill();ctx.fillRect(8,-29,7,1.6);ctx.fillStyle=GRD;ctx.fillRect(-1,-22,4,3);}
// Volkseigener Koloss: a walking slab of Plattenbau on clockwork legs, the Weltzeituhr ring turning behind it (fast while spinning), hammer arm and compass arm, pilot ghoul behind the cab window
function drawKoloss(e,C,sw,t){const s=e.r/17*.85;ctx.scale(s,s);const sp=e.spin>0?6:1,rt=e.t*.6*sp;
  const leg=(x,k,f)=>{stick(x,-22,x+k*9,-11+f,6,C('#5a5030'));stick(x+k*9,-11+f,x+k*3,0,6,C(GOL));ctx.fillStyle=C(GOC);ctx.beginPath();ctx.arc(x+k*9,-11+f,3,0,7);ctx.fill();ctx.fillStyle=C('#4a4234');ctx.fillRect(x+k*3-6,-2,12,3);};
  leg(-11,-1,sw*3);leg(11,1,-sw*3);
  const RX=34,RY=13,cy=-74;ctx.strokeStyle=C(GOC);ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,cy,RX,RY,0,Math.PI,0);ctx.stroke();ctx.fillStyle=C(GBR);for(let i=0;i<20;i++){const a=i/20*6.283+rt;if(Math.sin(a)>.15)continue;ctx.fillRect(Math.cos(a)*RX-2,cy+Math.sin(a)*RY-2,4,4);}
  ctx.strokeStyle=C('#d4a27e');ctx.lineWidth=1.2;for(let r=0;r<3;r++){ctx.beginPath();ctx.ellipse(0,cy-6,12+r*7,(12+r*7)*.42,-.2+r*.2,Math.PI,0);ctx.stroke();}
  ctx.fillStyle=C(GOC);ctx.beginPath();ctx.arc(0,cy-8,4,0,7);ctx.fill();ctx.fillStyle='#8aa0a4';ctx.beginPath();ctx.arc(Math.cos(rt*2)*16,cy-6+Math.sin(rt*2)*5,2,0,7);ctx.fill();
  ctx.fillStyle=C('#a8a08a');ctx.fillRect(-22,-66,44,44);ctx.fillStyle=C('#88806c');ctx.fillRect(10,-66,12,44);ctx.strokeStyle='#14100c';ctx.lineWidth=1.4;ctx.strokeRect(-22,-66,44,44);
  ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1;for(const y of [-55,-44,-33]){ctx.beginPath();ctx.moveTo(-22,y);ctx.lineTo(22,y);ctx.stroke();}
  for(let i=0;i<5;i++)for(let j=0;j<4;j++){if(j===1&&i>0&&i<4)continue;ctx.fillStyle=(i+j)%3?'#3a3a36':'#e7a050';ctx.fillRect(-20+i*8.4,-64+j*11,5,6);}
  ctx.fillStyle='#2a3a3a';ctx.fillRect(-12,-54,24,8);ctx.fillStyle=C('#8a9a8a');ctx.beginPath();ctx.arc(1,-47,4,Math.PI,0);ctx.fill();ctx.fillStyle='#f2d14b';ctx.fillRect(-1,-50,1.4,1.4);ctx.fillRect(2.4,-50,1.4,1.4);ctx.fillStyle='rgba(120,190,190,.25)';ctx.fillRect(-12,-54,24,8);
  ctx.strokeStyle='#4a4438';ctx.beginPath();ctx.moveTo(-20,-30);ctx.lineTo(-14,-27);ctx.lineTo(-16,-24);ctx.lineTo(-9,-25);ctx.stroke();
  ctx.fillStyle=C('#5a5030');ctx.fillRect(-18,-74,4,8);ctx.fillRect(13,-72,4,6);for(let i=0;i<3;i++){const p=(e.t*.6+i/3)%1;ctx.fillStyle=`rgba(216,212,200,${.4*(1-p)})`;ctx.beginPath();ctx.arc(-16+p*4,-78-p*18,2+p*4,0,7);ctx.fill();}
  ctx.fillStyle=C(GRD);ctx.beginPath();ctx.moveTo(22,-66);ctx.lineTo(27,-66);ctx.lineTo(27,-46);ctx.lineTo(24.5,-50);ctx.lineTo(22,-44);ctx.fill();
  const sl=e.sum<.6?1:0;stick(-22,-54,-32,-40-sl*10,5,C(GOL));ctx.fillStyle=C('#5a5446');ctx.fillRect(-42,-46-sl*10,18,12);ctx.fillStyle=C('#7a7462');ctx.fillRect(-42,-46-sl*10,18,3);
  stick(22,-52,32,-40,5,C('#8a7a4a'));stick(32,-40,29,-24,2,C('#c8c2a8'));stick(32,-40,37,-24,2,C('#c8c2a8'));ctx.fillStyle=C(GOC);ctx.beginPath();ctx.arc(32,-40,2.6,0,7);ctx.fill();
  ctx.fillStyle='#5a8a3a';for(const[a,b,r]of[[-20,-24,.6],[-17,-22,-.4],[20,-28,.4]]){ctx.beginPath();ctx.ellipse(a,b,2.6,1.3,r,0,7);ctx.fill();}
  if(e.spin>0){ctx.globalCompositeOperation='lighter';ctx.drawImage(glow(GOC),-24,cy-24,48,48);ctx.globalCompositeOperation='source-over';}return 92*s;}
/* ---- map: world 4000, about 1.5 units per metre, north up. Spreeinsel (Museumsinsel, Dom, Palast der Republik) between Kupfergraben and Spree in the west,
   Alexanderplatz bigger than real (about 1.8x) as an open plaza east of the Stadtbahn, Fernsehturm on the Rathausforum, Karl-Marx-Allee to the east:
   60s pavilions first, Zuckerbäcker blocks from Strausberger Platz on. Stadtbahn viaduct carries overgrown BVG trams. Start at S+U Alexanderplatz ---- */
const ALEX={ws:4000,start:[2520,1300],land:[],
 rivers:[{n:'Spree',w:150,p:[[0,220],[500,280],[900,430],[1010,800],[1060,1250],[1160,1700],[1310,2150],[1600,2650],[2200,2850],[2800,2700],[3300,2640],[4000,2740]]},
  {n:'Kupfergraben',w:70,p:[[500,280],[430,700],[460,1300],[600,1950],[850,2500],[1250,2800],[1600,2650]]}],
 rail:[[0,1120],[700,1160],[1300,1190],[1800,1220],[2100,1290],[2250,1500],[2400,1950],[2700,2400],[2920,2650],[3050,3200],[3150,4000]],
 roads:{'Torstraße':[[0,110],[1300,100],[2600,90],[4000,80]],'Rosenthaler Straße':[[1180,980],[1260,600],[1330,100]],
  'Karl-Liebknecht-Straße':[[0,1520],[1060,1480],[1500,1340],[1900,1120],[2300,820],[2700,500],[3000,90]],'Otto-Braun-Straße':[[2750,900],[2850,500],[2950,85]],
  'Karl-Marx-Allee':[[2880,1560],[3200,1700],[3480,1830],[4000,2050]],'Mollstraße':[[2750,900],[3400,1100],[4000,1250]],
  'Grunerstraße':[[2150,1880],[1900,2150],[1700,2400],[1500,2700],[1350,3100]],'Alexanderstraße':[[2880,1700],[2950,2200],[2980,2450],[3020,2900],[3050,3200]],
  'Rathausstraße':[[960,2000],[1400,1900],[1850,1880],[2150,1880]],'Spandauer Straße':[[1500,1340],[1520,1700],[1560,1880]],
  'Breite Straße':[[900,2450],[900,3000],[860,3600]],'Holzmarktstraße':[[2980,2450],[3500,2400],[4000,2380]],'Wallstraße':[[860,3250],[1600,3150],[2400,3250],[3050,3200]],
  'Leipziger Straße':[[0,3300],[860,3250]],'Lichtenberger Straße':[[3480,1830],[3480,2400]]},
 bridges:[[505,1505,'Schlossbrücke'],[1108,1478,'Liebknechtbrücke'],[1240,1950,'Rathausbrücke'],[1580,2640,'Mühlendammbrücke'],[3005,2670,'Jannowitzbrücke']],
 stations:[['U','Alexanderplatz',2420,1440,1],['U','Hackescher Markt',1300,1150],['U','Jannowitzbrücke',2880,2420],['U','Klosterstraße',2000,2060],['U','Märkisches Museum',2000,3050],
  ['U','Rosa-Luxemburg-Platz',2300,640],['U','Schillingstraße',3330,1560],['U','Weinmeisterstraße',1500,800],['U','Strausberger Platz',3600,1700]],
 plaza:[[2330,1050],[2880,1050],[2900,1880],[2470,1880],[2330,1520]],
 zones:[['Museumsinsel',[[520,330],[900,460],[1000,800],[1020,1150],[480,1150],[440,700]],{lots:{park:1},fringe:'park'}],
  ['Lustgarten',[[490,1200],[1040,1200],[1080,1420],[540,1450]],{lots:{glashaus:2,park:1},fringe:'park'}],
  ['Palastgärten',[[560,1520],[1100,1520],[1220,2050],[700,2100]],{lots:{glashaus:2,park:1},fringe:'park'}],
  ['Fischerinsel',[[740,2200],[1250,2150],[1450,2550],[1200,2750],[900,2600]],{lots:{plattenbau:3,park:1},fringe:'plattenbau'}],
  ['Sonnenblumenfeld',[[0,1650],[480,1550],[620,2050],[820,2600],[700,3150],[0,3150]],{lots:{sonnen:3,kleingarten:1},fringe:'sonnen'}],
  ['Dorotheenstadt',[[0,300],[420,300],[440,1200],[0,1250]],{lots:{houses:3,hinterhof:2},fringe:'houses'}],
  ['Spandauer Vorstadt',[[1100,200],[2500,200],[2300,780],[1800,1050],[1350,1000],[1100,600]],{lots:{houses:3,hinterhof:3,market:1},fringe:'houses'}],
  ['Hackescher Markt',[[900,950],[1450,900],[1500,1200],[950,1200]],{lots:{houses:2,hinterhof:2,market:1},fringe:'houses'}],
  ['Rathausforum',[[1260,1500],[1900,1350],[2150,1500],[2150,1850],[1400,1850]],{lots:{park:1},fringe:'park'}],
  ['Nikolaiviertel',[[1400,1950],[2100,1950],[1800,2350],[1650,2550],[1450,2450]],{lots:{houses:3,market:1},fringe:'houses'}],
  ['Alexanderplatz',[[2330,1050],[2880,1050],[2900,1880],[2470,1880],[2330,1520]],{lots:{plaza:1},fringe:'plaza'}],
  ['Platte Nord',[[2750,200],[4000,180],[4000,1180],[3400,1020],[2900,850]],{lots:{plattenbau:4,park:1,parking:1},fringe:'plattenbau'}],
  ['Pavillons',[[2900,1420],[3400,1600],[3400,1900],[2900,1720]],{lots:{plattenbau:1,park:1},fringe:'plattenbau'}],
  ['Karl-Marx-Allee',[[3400,1540],[4000,1760],[4000,2340],[3400,2110]],{lots:{zucker:3},fringe:'zucker'}],
  ['Holzmarkt',[[3050,2000],[3400,2120],[3400,2350],[3080,2400]],{lots:{plattenbau:2,park:1},fringe:'plattenbau'}],
  ['Märkisches Ufer',[[1700,2930],[2900,2900],[3000,3150],[1700,3100]],{lots:{houses:3,hinterhof:1},fringe:'houses'}],
  ['Köllnischer Park',[[2200,3200],[2950,3200],[3000,3650],[2200,3650]],{lots:{park:2,forest:1},fringe:'park'}],
  ['Heinrich-Heine-Platte',[[3200,2850],[4000,2850],[4000,4000],[3300,4000]],{lots:{plattenbau:3,kleingarten:1},fringe:'plattenbau'}],
  ['Luisenstadt',[[0,3400],[2100,3350],[2150,3700],[3150,3750],[3250,4000],[0,4000]],{lots:{houses:3,hinterhof:2,ruins:1},fringe:'houses'}]],
 other:{lots:{houses:2,plattenbau:2,park:1},fringe:'houses'},
 marks:[[3500,2600,'Spree'],[420,560,'Kupfergraben'],[400,1200,'Stadtbahn']],
 lm:()=>{const K=ALEX;aPlaza();
  viaduct(segsOf(K.rail),{c:['#8a4430','#6a3020','#4a2216'],pc:'#7a3a26',pcap:'#4a2216',ps:22,z0:46,z1:60,d:40,step:72,tc:'#d6b436',skip:(x,y)=>Math.abs(x-1960)<230&&Math.abs(y-1255)<80,free:(x,y)=>roadD(x,y)<72});
  aStation(1960,1255);fernsehturm(1850,1640);weltzeit(2640,1440);aMarket(2480,1180);
  pond(2600,1720,80,52);aRim(2600,1720,80,52);pond(1520,1770,52,34);aRim(1520,1770,52,34);neptun(1520,1770);
  mBox(1750,2060,240,170,drawRathaus,'Rotes Rathaus',170);mBox(1640,1500,70,140,drawMarien,'Marienkirche',190);mBox(880,1330,200,180,drawBDom,'Berliner Dom',200);
  mBox(720,960,240,90,drawAltes,'Altes Museum',80);mBox(860,1800,200,340,drawPalast,'Palast der Republik',130,{pl:Array.from({length:14},()=>[R(.15,.85),R(.1,.9),R(4,30)]),iv:Array.from({length:7},()=>R(.05,.95))});mBox(3080,1050,120,120,drawHdL,'Haus des Lehrers',250);
  mBox(2450,880,110,110,drawHotel,'Hotel Stadt Berlin',330);mBox(3200,1560,150,70,drawKino,'Kino International',64);mBox(2050,560,140,100,drawVolks,'Volksbühne',96);
  mBox(2600,3030,160,90,drawMMus,'Märkisches Museum',150);strausberg(3480,1835);
  for(const q of [[640,1290],[620,1700],[1060,2020],[720,2040]])glashaus(q[0],q[1],R(110,140),70);
  for(const s of K.stations){const p=station(...s);if(s[4]&&p){SX=p[0];SY=p[1]+60;}}},
 post:()=>aBanners()};
DIST[DI('Alexanderplatz')].geo=ALEX;
// paved plaza with a slab grid, kept clear of lots and street fronts
function aPlaza(){const g=gx,P_=ALEX.plaza;g.save();g.beginPath();P_.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();g.fillStyle='#5a5244';g.fillRect(2300,1000,650,950);
  for(let x=2300;x<2950;x+=40)for(let y=1000;y<1950;y+=40){g.fillStyle=pick(['#625a4a','#585042','#6a6250','#544c3e']);g.fillRect(x+1,y+1,38,38);}
  for(let i=0;i<260;i++){g.strokeStyle='rgba(60,90,30,.5)';g.lineWidth=1.5;const x=R(2300,2950),y=R(1000,1950);g.beginPath();g.moveTo(x,y);g.lineTo(x+R(-6,6),y-R(4,10));g.stroke();}g.restore();
  for(let x=2330;x<2900;x+=60)for(let y=1050;y<1880;y+=60)if(inPoly(P_,x,y))reserved.push({x:x-30,y:y-30,w:60,h:60});
  reserved.push({x:2400,y:1880,w:560,h:380});}// open band south of the plaza: tall fronts there would cover it in the iso view
// stone rim tiers around a fountain basin
function aRim(cx,cy,rx,ry){const g=gx;g.strokeStyle='#8a8070';g.lineWidth=10;g.beginPath();g.ellipse(cx,cy,rx+6,ry+5,0,0,7);g.stroke();g.strokeStyle='#a89c84';g.lineWidth=4;g.beginPath();g.ellipse(cx,cy,rx+14,ry+11,0,0,7);g.stroke();
  g.fillStyle='#8a8070';g.beginPath();g.ellipse(cx,cy,rx*.3,ry*.3,0,0,7);g.fill();g.fillStyle='#3a6a6a';g.beginPath();g.ellipse(cx,cy,rx*.2,ry*.2,0,0,7);g.fill();}
// Fernsehturm: concrete shaft, sphere with a ring of lit windows and a brass gear rim (clockwork), red and white antenna, ivy climbing. Upright sprite on a plinth with the folded pavilion roofs around it
function fernsehturm(x,y){const W=130,H=860,c=cnv(W,H),t=c.getContext('2d'),cx=W/2,base=H-6;
  t.fillStyle='#8a856e';t.beginPath();t.moveTo(cx-56,base);t.lineTo(cx+56,base);t.lineTo(cx+40,base-24);t.lineTo(cx-40,base-24);t.fill();for(let i=0;i<5;i++){t.fillStyle=i%2?'#d8d2bc':'#b8b098';t.beginPath();t.moveTo(cx-56+i*22,base-6);t.lineTo(cx-45+i*22,base-34);t.lineTo(cx-34+i*22,base-6);t.fill();}
  const sg=t.createLinearGradient(cx-22,0,cx+22,0);sg.addColorStop(0,'#e0dac4');sg.addColorStop(.55,'#c8c2a8');sg.addColorStop(1,'#8a856e');t.fillStyle=sg;t.beginPath();t.moveTo(cx-24,base-24);t.lineTo(cx+24,base-24);t.lineTo(cx+12,base-560);t.lineTo(cx-12,base-560);t.fill();
  t.strokeStyle='rgba(0,0,0,.12)';t.lineWidth=1;for(let y=base-60;y>base-560;y-=40){t.beginPath();t.moveTo(cx-20,y);t.lineTo(cx+20,y);t.stroke();}
  t.strokeStyle='#4a7a3a';t.lineWidth=3;t.beginPath();t.moveTo(cx-10,base-30);for(let y=base-30;y>base-320;y-=24)t.lineTo(cx-12+Math.sin(y*.05)*5,y);t.stroke();t.fillStyle='#6a9a4a';for(let y=base-40;y>base-320;y-=18){t.beginPath();t.ellipse(cx-12+Math.sin(y*.05)*5+R(-4,4),y,4,2.4,R(-1,1),0,7);t.fill();}
  const sy=base-600;for(let a=0;a<24;a++){const q=a/24*6.283;t.save();t.translate(cx+Math.cos(q)*52,sy+Math.sin(q)*52);t.rotate(q);t.fillStyle='#c8902a';t.fillRect(-5,-5,10,10);t.restore();}
  const bg=t.createRadialGradient(cx-14,sy-14,4,cx,sy,46);bg.addColorStop(0,'#b8ccd0');bg.addColorStop(1,'#5a7074');t.fillStyle=bg;t.beginPath();t.arc(cx,sy,46,0,7);t.fill();
  t.fillStyle='#2a3438';t.fillRect(cx-46,sy-6,92,12);for(let i=-5;i<=5;i++){t.fillStyle=Math.random()<.5?'#f2c868':'#3a4448';t.fillRect(cx+i*8-3,sy-4,5,8);}t.strokeStyle='#14100c';t.lineWidth=2;t.beginPath();t.arc(cx,sy,46,0,7);t.stroke();
  t.fillStyle='#c8c2a8';t.fillRect(cx-6,sy-110,12,64);t.fillStyle='#8a856e';t.fillRect(cx+1,sy-110,5,64);for(let i=0;i<9;i++){t.fillStyle=i%2?'#ead9c0':'#af4237';t.fillRect(cx-3,sy-110-(i+1)*14,6,14);}
  blds.push({x:x-W/2,y,w:W,h:0,top:base,spr:c,sc:1.2,lights:[{x,y,z:720,r:90}]});walls.push({x:x-28,y:y-26,w:56,h:44});neons.push({x,y,z:720,c:'#f2c868',s:60});
  const g=gx;g.fillStyle='#5a5244';g.beginPath();g.arc(x,y,150,0,7);g.fill();for(let a=0;a<6;a++){g.fillStyle=a%2?'#8a856e':'#a09a80';g.beginPath();g.moveTo(x,y);g.arc(x,y,130,a*1.047,a*1.047+.6);g.fill();}
  reserved.push({x:x-170,y:y-170,w:340,h:340});marks.push({x,y:y+60,n:'Fernsehturm'});}
// Weltzeituhr: column, ring of city panels, orbit sculpture above with gear teeth and a glowing sun. Upright sprite
function weltzeit(x,y){const W=110,H=200,c=cnv(W,H),t=c.getContext('2d'),cx=W/2,base=H-4;t.fillStyle='#5a5446';t.beginPath();t.ellipse(cx,base-4,40,8,0,0,7);t.fill();
  t.fillStyle='#7a7060';t.fillRect(cx-6,base-104,12,100);for(let i=0;i<5;i++){t.fillStyle='#c8902a';t.fillRect(cx-7,base-24-i*16,14,3);}
  t.fillStyle='#e7982b';t.beginPath();t.moveTo(cx-48,base-104);t.lineTo(cx+48,base-104);t.lineTo(cx+54,base-114);t.lineTo(cx+48,base-124);t.lineTo(cx-48,base-124);t.lineTo(cx-54,base-114);t.fill();t.fillStyle='#b8741a';t.fillRect(cx+30,base-124,18,20);
  for(let i=0;i<7;i++){t.fillStyle='#f6e2b0';t.fillRect(cx-44+i*12,base-120,9,11);}t.strokeStyle='#14100c';t.lineWidth=1.5;t.strokeRect(cx-48,base-124,96,20);t.fillStyle='#14100c';t.fillRect(cx-1,base-160,2,36);
  t.strokeStyle='#d4a27e';t.lineWidth=2;for(let r=0;r<3;r++){t.beginPath();t.ellipse(cx,base-168,16+r*11,(16+r*11)*.42,-.25+r*.25,0,7);t.stroke();}
  for(let a=0;a<14;a++){const q=a/14*6.283;t.fillStyle='#c8902a';t.fillRect(cx+Math.cos(q)*44-3,base-168+Math.sin(q)*18-3,6,6);}t.fillStyle='#e7982b';t.beginPath();t.arc(cx,base-168,8,0,7);t.fill();
  t.fillStyle='#8aa0a4';t.beginPath();t.arc(cx+26,base-174,4,0,7);t.fill();t.fillStyle=GRD;t.beginPath();t.arc(cx-20,base-160,3,0,7);t.fill();
  blds.push({x:x-W/2,y,w:W,h:0,top:base,spr:c,sc:1.3,lights:[{x,y,z:210,r:60}]});walls.push({x:x-12,y:y-10,w:24,h:20});neons.push({x,y,z:215,c:GOC,s:40});reserved.push({x:x-80,y:y-80,w:160,h:160});marks.push({x,y:y+40,n:'Weltzeituhr'});}
// Neptunbrunnen: bronze Neptune on a rock in the basin
function neptun(x,y){const c=cnv(40,80),t=c.getContext('2d');t.fillStyle='#6a6458';t.beginPath();t.ellipse(20,74,16,5,0,0,7);t.fill();t.fillStyle='#3a5a4a';t.fillRect(14,38,12,34);t.beginPath();t.arc(20,32,7,0,7);t.fill();t.fillRect(8,40,6,18);t.fillStyle='#4a7a5a';t.fillRect(27,14,2,48);t.fillRect(23,12,10,3);
  blds.push({x:x-20,y,w:40,h:0,top:76,spr:c,sc:1.2,lights:[]});marks.push({x,y:y+40,n:'Neptunbrunnen'});}
// market on the Alex: stalls with striped awnings, crates
function drawStall(b){const{x,y,w,h}=b;faceT(x+3,y+3,w,h,0,'rgba(0,0,0,.3)');ibox(x,y+h*.4,w,h*.6,0,20,'#6a4a2e',INK,'#8a6a44');for(const q of [[x,y],[x+w-4,y],[x,y+h-4],[x+w-4,y+h-4]])ibox(q[0],q[1],4,4,0,40,'#3a2a1e');
  for(let u=0;u<w;u+=10)poly([P3(x+u,y-4,46),P3(x+u+10,y-4,46),P3(x+u+10,y+h+4,36),P3(x+u,y+h+4,36)],(u/10)%2?b.c:'#ead9c0',INK);
  for(let i=0;i<4;i++)ibox(x+6+i*(w-14)/4,y+h*.5,6,6,20,26,(b.gc||(b.gc=Array.from({length:4},()=>pick(['#e7982b','#af4237','#7b9a3a','#f2c230']))))[i]);}// v0.65: goods colours fixed per stall (random per frame flickered)
function aMarket(cx,cy){for(let i=0;i<8;i++){const x=cx-200+(i%4)*110,y=cy+Math.floor(i/4)*90,o={x,y,w:70,h:40,H:46,top:46,R0:0,c:pick([GRD,'#3a6a8a','#7b6a32',GOC]),lights:[],draw:drawStall};blds.push(o);walls.push({x,y:y+16,w:70,h:24});if(Math.random()<.6)addBrk(x+80,y+20,'crate',false);}marks.push({x:cx-40,y:cy+60,n:'Markt am Alex'});}
// Bahnhof Alexanderplatz: station hall on the viaduct (same art as the Ostbahnhof), closed
function aStation(cx,cy){const s=segsOf(ALEX.rail)[3],rot=rotN(Math.atan2(s.uy,s.ux)),w=360,h=96,b={x:cx-w/2,y:cy-h/2,w,h,hb:70,H:96,top:96,R0:0,rot,lw:Array.from({length:16},()=>Math.random()<.05),lights:[],draw:drawOstbf};
  blds.push(b);bShadow({...b,H:70});const ow=obWall(b);walls.push(ow);reserved.push({x:ow.x-20,y:ow.y-20,w:ow.w+40,h:ow.h+40});marks.push({x:cx,y:cy+20,n:'Bahnhof Alexanderplatz'});}
/* ---- buildings ---- */
const brickRows=(x,y,w,h,z1,c)=>{for(let z=8;z<z1;z+=8){ln3(P3(x,y+h,z),P3(x+w,y+h,z),c);ln3(P3(x+w,y+h,z),P3(x+w,y,z),c);}};
function drawRathaus(b){const{x,y,w,h}=b,c='#a84a36',Z=70;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,c,INK,'#6a3a2e');brickRows(x,y,w,h,Z,'rgba(0,0,0,.12)');
  for(let u=12;u<w-10;u+=18)for(const z of [12,40])poly([P3(x+u,y+h,z),P3(x+u+9,y+h,z),P3(x+u+9,y+h,z+16),P3(x+u+4.5,y+h,z+21),P3(x+u,y+h,z+16)],'#1a1410');
  for(let v=12;v<h-10;v+=18)for(const z of [12,40])faceE(x,y+v,w,9,z,z+16,'#1a1410');faceS(x,y,w,h,Z-6,Z-3,'#d8a040');faceE(x,y,w,h,Z-6,Z-3,'#a87830');
  const tx=x+w/2-24,ty=y+h-60;ibox(tx,ty,48,48,Z,Z+70,c,INK,'#6a3a2e');ibox(tx-3,ty-3,54,54,Z+70,Z+76,'#c8a070',INK);ibox(tx+8,ty+8,32,32,Z+76,Z+92,c,INK);
  const cp=P3(tx+24,ty+48,Z+48);ctx.fillStyle='#efe2c4';ctx.beginPath();ctx.ellipse(cp[0],cp[1],9,9,0,0,7);ctx.fill();ctx.strokeStyle='#14100c';ctx.lineWidth=1.2;ctx.stroke();ctx.beginPath();ctx.moveTo(cp[0],cp[1]);ctx.lineTo(cp[0],cp[1]-6);ctx.moveTo(cp[0],cp[1]);ctx.lineTo(cp[0]+4,cp[1]+2);ctx.stroke();
  const fp=P3(tx+24,ty+24,Z+92);ln3(fp,[fp[0],fp[1]-28],'#3a3632');ctx.fillStyle=GRD;ctx.fillRect(fp[0],fp[1]-28,14,8);}
function drawMarien(b){const{x,y,w,h}=b,c='#8a5a40',Z=50;faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h-40,0,Z,c,INK,'#5a3a2e');brickRows(x,y,w,h-40,Z,'rgba(0,0,0,.12)');
  for(let v=12;v<h-50;v+=20)faceE(x,y+v,w,8,12,40,'#1a1410');poly([P3(x,y,Z),P3(x+w,y,Z),P3(x+w,y+(h-40)/2,Z+28),P3(x,y+(h-40)/2,Z+28)],'#3e5a4a',INK);poly([P3(x,y+(h-40)/2,Z+28),P3(x+w,y+(h-40)/2,Z+28),P3(x+w,y+h-40,Z),P3(x,y+h-40,Z)],'#4a6a58',INK);
  const tx=x+w/2-20,ty=y+h-42;ibox(tx,ty,40,40,0,110,c,INK,'#5a3a2e');brickRows(tx,ty,40,40,110,'rgba(0,0,0,.12)');faceS(tx+14,ty,12,40,70,96,'#1a1410');
  const A=P3(tx+20,ty+20,190);poly([P3(tx,ty+40,110),P3(tx+40,ty+40,110),A],'#4a7a68',INK);poly([P3(tx+40,ty+40,110),P3(tx+40,ty,110),A],'#34584a',INK);ctx.fillStyle='#c8a040';ctx.beginPath();ctx.arc(A[0],A[1]-3,2.5,0,7);ctx.fill();}
function drawBDom(b){const{x,y,w,h}=b,c='#a89a7c',Z=80;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,c,INK,'#8a7e64');
  for(let u=18;u<w-14;u+=22){ibox(x+u,y+h,6,8,0,Z-10,'#c8bc9c',INK);faceS(x+u+8,y,8,h,16,Z-24,'#1a1814');}for(let v=18;v<h-14;v+=22)faceE(x,y+v,w,8,16,Z-24,'#1a1814');
  for(const q of [[x+4,y+4],[x+w-30,y+4],[x+4,y+h-30],[x+w-30,y+h-30]]){ibox(q[0],q[1],26,26,Z,Z+30,c,INK,'#8a7e64');domeAt(q[0]+13,q[1]+13,Z+30,10,'#5a7a68','#4a6a58');}
  domeAt(x+w/2,y+h/2,Z,58,'#6a8a72','#4a7a68');}
function drawAltes(b){const{x,y,w,h}=b,c='#d4c4a0',Z=60;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y+18,w,h-18,0,8,'#b8a888',INK);ibox(x+10,y,w-20,h-20,0,Z,c,INK,'#b8a888');
  for(let u=16;u<w-14;u+=13)ibox(x+u,y+h-14,6,6,8,Z-6,'#ece0c4',INK);ibox(x+6,y+h-20,w-12,12,Z-6,Z,'#e0d4b4',INK);ibox(x+w/2-30,y+h/2-26,60,40,Z,Z+18,c,INK,'#a89878');}
// Palast der Republik: bronze mirror glass on the long east face, white marble ends, a glass greenhouse vault on the roof, ivy on the facade
function drawPalast(b){const{x,y,w,h}=b,Z=64;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,'#e8e0cc',INK,'#5a4a3a');faceE(x,y,w,h,0,Z,'#8a5030');
  for(let v=6;v<h-6;v+=14)for(let z=6;z<Z-6;z+=14){const lit=(v*7+z*3)%5;faceE(x,y+v,w,10,z,z+10,lit?'#e8a050':'#3a2414');}faceE(x,y,w,h,0,5,'#d8d0bc');faceE(x,y,w,h,Z-5,Z,'#d8d0bc');
  for(let u=20;u<w-20;u+=40)faceS(x+u,y,22,h,10,Z-14,'#c8c0aa');
  const N=8,R0=40,zz=k=>Z+R0*Math.sin(Math.PI*k/N);for(let k=0;k<N;k++)poly([P3(x+w*k/N,y+20,zz(k)),P3(x+w*(k+1)/N,y+20,zz(k+1)),P3(x+w*(k+1)/N,y+h-20,zz(k+1)),P3(x+w*k/N,y+h-20,zz(k))],k<N/2?'rgba(140,200,180,.3)':'rgba(180,225,205,.42)');
  ctx.fillStyle='rgba(74,138,58,.75)';for(const q of b.pl){const p=P3(x+w*q[0],y+h*q[1],Z+q[2]);ctx.beginPath();ctx.arc(p[0],p[1],5,0,7);ctx.fill();}
  ctx.strokeStyle='rgba(40,60,50,.8)';ctx.lineWidth=1;for(let v=20;v<=h-20;v+=40){ctx.beginPath();for(let k=0;k<=N;k++){const p=P3(x+w*k/N,y+v,zz(k));k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  ctx.strokeStyle='#4a7a3a';ctx.lineWidth=2;for(const v of b.iv){const a=P3(x+w,y+h*v,0);ctx.beginPath();ctx.moveTo(a[0],a[1]);for(let z=0;z<Z;z+=8){const p=P3(x+w,y+h*v+Math.sin(z*.3)*4,z);ctx.lineTo(p[0],p[1]);}ctx.stroke();}}
function drawHdL(b){const{x,y,w,h}=b,Z=240;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,'#4a5a5e',INK,'#3a4446');glassRows(x,y,w,h,90,Z-6,'#8aa8b0',14);
  faceS(x,y,w,h,24,82,GRD);faceE(x,y,w,h,24,82,'#8a3530');const cs=[GOC,'#2a6a8a','#ead9c0',GOL,GOC,'#2a6a8a'];for(let i=0;i<6;i++){faceS(x+6+i*(w-12)/6,y,(w-12)/6-6,h,32,74,cs[i]);faceE(x,y+6+i*(h-12)/6,w,(h-12)/6-6,32,74,cs[(i+2)%6]);}
  ibox(x-30,y+h-6,w+60,30,0,20,'#5a6e72',INK);}
function drawHotel(b){const{x,y,w,h}=b,Z=320;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,'#d8d4c8',INK,'#a8a498');for(let u=6;u<w-4;u+=10)faceS(x+u,y,6,h,10,Z-10,'#5a6470');for(let v=6;v<h-4;v+=10)faceE(x,y+v,w,6,10,Z-10,'#4a545e');
  for(let z=10;z<Z;z+=12){faceS(x,y,w,h,z,z+1.5,'#e8e4d8');faceE(x,y,w,h,z,z+1.5,'#b8b4a8');}}
function drawKino(b){const{x,y,w,h}=b,Z=58;faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x+10,y+10,w-20,h-20,0,24,'#2a3438',INK);ibox(x,y,w,h,24,Z,'#d8c8a0',INK,'#b8a888');for(let u=6;u<w;u+=14)faceS(x+u,y,8,h,30,52,'#e8d8b0');
  ctx.fillStyle='#14100c';ctx.font='700 9px sans-serif';const p=P3(x+w*.2,y+h,40);ctx.save();ctx.translate(p[0],p[1]);ctx.transform(1,.5,0,1,0,0);ctx.fillText('INTERNATIONAL',0,0);ctx.restore();}
function drawVolks(b){const{x,y,w,h}=b,c='#8a7860',Z=80;faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,c,INK,'#6a5a48');for(let u=14;u<w-10;u+=16)ibox(x+u,y+h,6,10,0,Z-14,'#a8967a',INK);
  ibox(x+10,y+h+10,w-20,10,Z-14,Z-6,'#a8967a',INK);poly([P3(x+20,y+h+10,Z-6),P3(x+w-20,y+h+10,Z-6),P3(x+w/2,y+h+10,Z+14)],c,INK);ctx.fillStyle=GRD;const p=P3(x+w/2-12,y+h+10,Z+2);ctx.font='800 10px sans-serif';ctx.fillText('OST',p[0],p[1]);}
function drawMMus(b){const{x,y,w,h}=b,c='#8a4430',Z=60;faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,c,INK,'#5a2a20');brickRows(x,y,w,h,Z,'rgba(0,0,0,.14)');for(let u=12;u<w-8;u+=18)faceS(x+u,y,8,h,14,46,'#1a1410');
  poly([P3(x,y,Z),P3(x+w,y,Z),P3(x+w,y+h/2,Z+26),P3(x,y+h/2,Z+26)],'#5a3a30',INK);poly([P3(x,y+h/2,Z+26),P3(x+w,y+h/2,Z+26),P3(x+w,y+h,Z),P3(x,y+h,Z)],'#6a4434',INK);
  const tx=x+w-46,ty=y+h-40;ibox(tx,ty,36,36,0,130,c,INK,'#5a2a20');brickRows(tx,ty,36,36,130,'rgba(0,0,0,.14)');for(let i=0;i<4;i++){ibox(tx+i*10,ty+32,5,4,130,138,c,INK);ibox(tx+32,ty+i*10,4,5,130,138,c,INK);}}
// Zuckerbäcker tower (Strausberger Platz): tiered cream tower with a golden spire
function drawZTower(b){const{x,y,w,h}=b,c='#efe2c0';faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,150,c,INK,'#c8b490');for(let u=8;u<w-6;u+=12)faceS(x+u,y,6,h,16,140,'#5a4a3a');for(let v=8;v<h-6;v+=12)faceE(x,y+v,w,6,16,140,'#4a3a2a');
  for(let u=0;u<=w;u+=24){faceS(x+u-2,y,4,h,10,148,'#fff6dc');}faceS(x,y,w,h,0,12,'#c8b490');ibox(x+12,y+12,w-24,h-24,150,190,c,INK,'#c8b490');ibox(x+24,y+24,w-48,h-48,190,214,c,INK,'#c8b490');
  const A=P3(x+w/2,y+h/2,214);ln3(A,[A[0],A[1]-40],GBR);ctx.fillStyle=GOC;ctx.beginPath();ctx.arc(A[0],A[1]-42,4,0,7);ctx.fill();faceS(x,y,w,h,146,150,GBR);faceE(x,y,w,h,146,150,'#a87020');}
function strausberg(cx,cy){const g=gx;g.strokeStyle='#3a2f27';g.lineWidth=110;g.beginPath();g.arc(cx,cy,120,0,7);g.stroke();g.strokeStyle=D.road;g.lineWidth=86;g.beginPath();g.arc(cx,cy,120,0,7);g.stroke();
  g.fillStyle='#46582a';g.beginPath();g.arc(cx,cy,74,0,7);g.fill();pond(cx,cy,46,30);aRim(cx,cy,46,30);
  mBox(cx-110,cy-190,90,90,drawZTower,'Haus Berlin',214);mBox(cx-90,cy+90,90,90,drawZTower,'Haus des Kindes',214);reserved.push({x:cx-210,y:cy-240,w:420,h:480});marks.push({x:cx,y:cy+40,n:'Strausberger Platz'});}
// greenhouse: glass barrel vault on a low brick base, plants inside, garden beds around
function drawGlas(b){const{x,y,w,h}=b,Z=16,N=6,R0=34,zz=k=>Z+R0*Math.sin(Math.PI*k/N);faceT(x+5,y+4,w,h,0,'rgba(0,0,0,.3)');ibox(x,y,w,h,0,Z,'#8a5a40',INK,'#5a4a3a');
  ctx.fillStyle='rgba(74,138,58,.85)';for(const q of b.pl){const p=P3(x+w*q[0],y+h*q[1],Z+q[2]);ctx.beginPath();ctx.arc(p[0],p[1],q[3],0,7);ctx.fill();}ctx.fillStyle=GOC;for(const q of b.pl.slice(0,3)){const p=P3(x+w*q[0],y+h*q[1],Z+q[2]+4);ctx.beginPath();ctx.arc(p[0],p[1],2.4,0,7);ctx.fill();}
  for(let k=0;k<N;k++)poly([P3(x,y+h*k/N,zz(k)),P3(x+w,y+h*k/N,zz(k)),P3(x+w,y+h*(k+1)/N,zz(k+1)),P3(x,y+h*(k+1)/N,zz(k+1))],k<N/2?'rgba(150,210,190,.28)':'rgba(190,230,215,.4)');
  ctx.strokeStyle='rgba(40,60,50,.85)';ctx.lineWidth=1;for(let u=0;u<=w;u+=w/6){ctx.beginPath();for(let k=0;k<=N;k++){const p=P3(x+u,y+h*k/N,zz(k));k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  const gp=[];for(let k=0;k<=N;k++)gp.push(P3(x+w,y+h*k/N,zz(k)));poly(gp,'rgba(170,215,200,.35)',INK);}
function glashaus(cx,cy,w,h){if(resHit(cx-w/2,cy-h/2,w,h,1)||isWater(cx,cy)||roadD(cx,cy)<w/2+60)return null;const b={x:cx-w/2,y:cy-h/2,w,h,H:50,top:50,R0:0,pl:Array.from({length:9},()=>[R(.1,.9),R(.15,.85),R(2,18),R(4,8)]),lights:[],draw:drawGlas};
  blds.push(b);walls.push({x:b.x,y:b.y,w,h});reserved.push({x:b.x-20,y:b.y-20,w:w+40,h:h+40});const g=gx;for(let i=0;i<4;i++){const bx=cx+R(-w,w*.6),by=cy+h/2+R(20,60);g.fillStyle='#3a2a1e';g.fillRect(bx,by,R(40,70),14);g.fillStyle='#5a8a3a';for(let k=0;k<6;k++)g.fillRect(bx+4+k*9,by+3,4,6);}return b;}
// Zuckerbäcker block (Karl-Marx-Allee, v0.49): cream tiles, light pilasters, arcade shops on the ground floor, ochre cornice, sometimes a red banner. Same sprite layout as makeB
function zuckerB(b){const c=cnv(b.w,b.h+b.H),g=c.getContext('2d'),base=b.h+b.H;b.lights=[];b.wc='#e6d6b0';b.rc='#9a7a5a';g.fillStyle=b.wc;g.fillRect(0,b.h,b.w,b.H);
  for(let i=0;i<b.w*b.H/50;i++){g.fillStyle=Math.random()<.5?'rgba(0,0,0,.05)':'rgba(255,250,235,.08)';g.fillRect(R(0,b.w),R(b.h,base),R(2,5),R(2,4));}
  for(let x=0;x<b.w;x+=40){g.fillStyle='#fff6dc';g.fillRect(x+2,b.h+14,6,b.H-40);g.fillStyle='rgba(0,0,0,.1)';g.fillRect(x+8,b.h+14,2,b.H-40);}
  for(let y=b.h+24;y<base-46;y+=26)for(let x=14;x<b.w-16;x+=20){if(x%40<12)continue;const q=Math.random();g.fillStyle=q<.02?'#e0892e':q<.25?'#0b0806':'#2a2420';g.fillRect(x,y,10,15);g.fillStyle='rgba(255,250,235,.25)';g.fillRect(x-2,y-3,14,2);}
  g.fillStyle='#c8902a';g.fillRect(0,b.h,b.w,8);g.fillStyle='#a87020';g.fillRect(0,b.h+8,b.w,3);g.fillStyle='#c8b490';g.fillRect(0,base-40,b.w,40);
  for(let x=10;x<b.w-26;x+=32){g.fillStyle='#14100c';g.beginPath();g.moveTo(x,base);g.lineTo(x,base-24);g.arc(x+11,base-24,11,Math.PI,0);g.lineTo(x+22,base);g.fill();g.fillStyle='rgba(224,137,46,.18)';g.fillRect(x+3,base-20,16,20);}
  if(Math.random()<.6){const x=R(20,b.w-40);g.fillStyle=GRD;g.fillRect(x,b.h+20,16,Math.min(b.H-70,120));g.fillStyle=GOC;g.fillRect(x,b.h+20,16,4);}
  g.fillStyle='rgba(60,100,40,.6)';for(let i=0;i<b.w/30;i++){const x=R(0,b.w);g.fillRect(x,base-R(20,70),R(3,6),R(20,60));}
  g.fillStyle=b.rc;g.fillRect(0,0,b.w,b.h);for(let i=0;i<b.w*b.h/40;i++){g.fillStyle=Math.random()<.5?'rgba(0,0,0,.12)':'rgba(255,230,200,.05)';g.fillRect(R(0,b.w),R(0,b.h),2,2);}g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=2;g.strokeRect(1,1,b.w-2,b.h-2);
  b.spr=c;bShadow(b);}
/* ---- lots: zucker (Zuckerbäcker blocks), sonnen (sunflower field), glashaus (greenhouses with beds) ---- */
LOTS.zucker=b=>{const n=Math.max(1,Math.round(b.w*b.h/120000));for(let k=0,t=0;k<n&&t<n*12;t++){const w=R(200,300),h=R(80,110),x=R(b.x0+20,b.x1-20-w),y=R(b.y0+20,b.y1-20-h);if(x<b.x0+10||y<b.y0+10)continue;if(tryB(x,y,w,h,R(70,90),'zucker'))k++;}};
function sunCluster(x,y){const W=60,H=110,c=cnv(W,H),t=c.getContext('2d');for(let i=0;i<5;i++){const fx=8+Math.random()*44,fh=R(50,95),fy=H-fh;t.strokeStyle='#4a7a3a';t.lineWidth=2.5;t.beginPath();t.moveTo(fx,H);t.quadraticCurveTo(fx+R(-6,6),H-fh/2,fx,fy);t.stroke();
    t.fillStyle='#5a8a3a';t.beginPath();t.ellipse(fx-5,H-fh*.4,6,2.5,-.4,0,7);t.fill();for(let k=0;k<10;k++){const a=k/10*6.283;t.fillStyle=k%2?GOC:'#f2c230';t.beginPath();t.ellipse(fx+Math.cos(a)*7,fy+Math.sin(a)*5,4,2,a,0,7);t.fill();}t.fillStyle='#5a3a1a';t.beginPath();t.ellipse(fx,fy,4.4,3.4,0,0,7);t.fill();}
  blds.push({x:x-W/2,y,w:W,h:0,top:H-2,spr:c,sc:1,lights:[]});}
LOTS.sonnen=b=>{const g=gx;for(let y=b.y0+20;y<b.y1-10;y+=30){g.fillStyle='#4a3a24';g.fillRect(b.x0+10,y,b.w-20,10);}const n=Math.round(b.w*b.h/26000);for(let i=0,t=0;i<n&&t<n*6;t++){const q=inB(b,30);if(inWall(q.x,q.y,24)||resHit(q.x-30,q.y-10,60,20,1))continue;sunCluster(q.x,q.y);i++;}};
LOTS.glashaus=b=>{const n=Math.max(1,Math.round(b.w*b.h/90000));for(let i=0,t=0;i<n&&t<20;t++){const w=R(110,150),h=R(60,80),q=inB(b,Math.max(w,h)/2+20);if(glashaus(q.x,q.y,w,h))i++;}for(let i=0;i<3;i++){const q=inB(b,40);if(!inWall(q.x,q.y,30)&&!resHit(q.x-28,q.y-60,56,62))makeTree(q.x,q.y,'green');}};
LOTN.zucker='Zuckerbäcker';LOTN.sonnen='Sonnenblumen';LOTN.glashaus='Gewächshäuser';
// red banners on poles along the Karl-Marx-Allee (after lots and street fronts)
function aBanners(){const S0=ROADS.filter(s=>s.n==='Karl-Marx-Allee');for(const s of S0){const nx=-s.uy,ny=s.ux;for(let t=40;t<s.len-20;t+=150)for(const sd of [-1,1]){const x=s.ax+s.ux*t+nx*62*sd,y=s.ay+s.uy*t+ny*62*sd;if(inWall(x,y,14)||isWater(x,y))continue;
  const c=cnv(30,120),g=c.getContext('2d');g.fillStyle='#3a3632';g.fillRect(13,10,4,110);g.fillStyle=GRD;g.beginPath();g.moveTo(17,14);g.lineTo(29,14);g.lineTo(29,62);g.lineTo(23,56);g.lineTo(17,62);g.fill();g.fillStyle=GOC;g.fillRect(17,18,12,3);g.fillStyle='#c8902a';g.beginPath();g.arc(15,8,4,0,7);g.fill();
  blds.push({x:x-15,y,w:30,h:0,top:118,spr:c,sc:1.2,lights:[]});walls.push({x:x-3,y:y-3,w:6,h:5});}}}
