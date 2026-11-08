/* ================= Mitte (v0.47): Regierungsviertel to Potsdamer Platz, the cyberpunk quarter =================
   World 4000, about 1.4 units per metre east of the Tiergarten (v0.47b: map shifted east, western Tiergarten squeezed to half), north up. Spree with the Spreebogen in the north, Tiergarten with the Neuer See in the west, Brandenburger Tor on the
   17. Juni / Unter den Linden axis, Potsdamer Platz as the neon core in the south (board docs/style/potsdamer-platz.png), Landwehrkanal at the bottom.
   Start at S+U Potsdamer Platz. Mockup: mockups/v047-mitte-geo.html. Landmarks are custom-drawn iso boxes (b.draw) like the Xhain ones in js/geo.js ---- */
const MITTE={ws:4000,start:[2120,2940],
 lake:[[130,2330],[310,2270],[450,2360],[430,2480],[260,2540],[120,2460]],
 rivers:[{n:'Spree',w:170,p:[[4000,930],[3600,1000],[3130,1110],[2700,1200],[2350,1250],[2060,1250],[1820,1080],[1580,830],[1300,760],[1040,840],[720,1060],[550,1260],[390,1190],[225,1080],[0,1000]]},
  {n:'Landwehrkanal',w:90,p:[[0,3180],[300,3330],[600,3440],[1200,3500],[1800,3700],[2300,3950],[2380,4000]]}],land:[],
 rail:[[0,700],[450,560],[1000,450],[1700,430],[2300,560],[2800,800],[3300,850],[4000,800]],// Stadtbahn viaduct
 roads:{'Invalidenstraße':[[0,240],[800,200],[1900,170],[4000,140]],'Hugo-Preuß-Brücke':[[1450,190],[1450,600],[1460,900],[1470,1200],[1470,1500]],
  'Scheidemannstraße':[[2180,1640],[1700,1610],[1470,1500]],'John-Foster-Dulles-Allee':[[1470,1500],[1000,1420],[625,1380]],
  'Ebertstraße':[[2180,1380],[2180,1640],[2160,1960],[2130,2400],[2060,2800]],'Straße des 17. Juni':[[150,2050],[800,1980],[2160,1900]],
  'Pariser Platz':[[2160,1900],[2450,1870]],'Unter den Linden':[[2450,1870],[2900,1810],[4000,1760]],
  'Wilhelmstraße':[[2450,140],[2400,1260],[2470,1860],[2500,2300],[2520,2800],[2580,3300],[2620,4000]],'Friedrichstraße':[[3130,140],[3140,1110],[3150,1780],[3170,2720],[3200,4000]],
  'Leipziger Straße':[[2060,2800],[2350,2820],[2800,2770],[4000,2720]],'Potsdamer Straße':[[2060,2800],[1770,2950],[1480,3150],[1220,3500],[1100,4000]],
  'Bellevuestraße':[[2060,2800],[1860,2620],[1550,2640]],'Entlastungsstraße':[[1470,1500],[1500,1980],[1530,2400],[1550,2640]],'Tiergartenstraße':[[0,2720],[650,2700],[1550,2640]],
  'Stresemannstraße':[[2060,2800],[2280,3150],[2595,3560]],'Markgrafenstraße':[[3700,1750],[3710,2730],[3720,4000]],'Zimmerstraße':[[2560,3150],[3180,3140],[4000,3110]]},
 bridges:[[3140,1110,'Weidendammer Brücke'],[2400,1245,'Marschallbrücke'],[1455,795,'Hugo-Preuß-Brücke'],[1210,3500,'Potsdamer Brücke']],
 stations:[['U','Potsdamer Platz',2120,2900,1],['U','Brandenburger Tor',2380,1960],['U','Bundestag',1600,1420],['U','Hauptbahnhof',1010,740],['U','Mendelssohn-Bartholdy-Park',1500,3250],
  ['U','Mohrenstraße',2700,2850],['U','Friedrichstraße',3000,1000],['U','Anhalter Bahnhof',2620,3480],['U','Bellevue',250,880]],
 zones:[['Tiergarten',[[0,1290],[225,1180],[390,1290],[550,1380],[700,1470],[1440,1580],[2120,1700],[2100,2560],[1860,2600],[1550,2600],[650,2620],[0,2640]],{lots:{park:3,forest:2},fringe:'park'}],
  ['Moabit',[[0,0],[900,0],[900,600],[450,640],[0,780]],{lots:{houses:3,hinterhof:2,ruins:1},fringe:'houses'}],
  ['Europacity',[[1500,0],[2350,0],[2350,600],[1700,560],[1500,600]],{lots:{construction:3,buero:2},fringe:'buero'}],
  ['Charité',[[2400,0],[4000,0],[4000,1000],[2600,1120],[2450,700]],{lots:{houses:2,hinterhof:2,ruins:1},fringe:'houses'}],
  ['Regierungsviertel',[[1100,1250],[2160,1250],[2160,1600],[1100,1500]],{lots:{park:1},fringe:'park'}],
  ['Dorotheenstadt',[[2220,1280],[4000,1110],[4000,1720],[2450,1820],[2220,1700]],{lots:{houses:2,buero:2,market:1},fringe:'houses'}],
  ['Ministergärten',[[2200,1960],[2430,1960],[2450,2700],[2180,2700]],{lots:{park:2,ruins:1},fringe:'park'}],
  ['Gendarmenmarkt',[[3260,1960],[3600,1960],[3600,2420],[3260,2420]],{lots:{market:1},fringe:'houses'}],['Checkpoint Charlie',[[2700,2950],[3600,2950],[3600,3400],[2700,3400]],{lots:{ruins:2,buero:1,parking:1},fringe:'ruins'}],
  ['Friedrichstadt',[[2560,1880],[4000,1800],[4000,2660],[2560,2740]],{lots:{buero:2,houses:2,ruins:1},fringe:'buero'}],
  ['Potsdamer Platz',[[1580,2660],[2160,2620],[2500,2650],[2540,3000],[2200,3250],[1850,3150],[1600,2950]],{lots:{buero:3,hochhaus:2},fringe:'buero'}],
  ['Kulturforum',[[800,2740],[1550,2720],[1600,3000],[1350,3330],[800,3300]],{lots:{park:1,ruins:1,construction:1},fringe:'ruins'}],
  ['Diplomatenviertel',[[0,2760],[750,2760],[750,3280],[300,3240],[0,3100]],{lots:{efh:2,houses:1,park:1},fringe:'efh'}],
  ['Gleisdreieck',[[0,3320],[1200,3600],[1800,3800],[2200,4000],[0,4000]],{lots:{ruins:2,park:1,construction:1,parking:1},fringe:'ruins'}],
  ['Anhalter Bahnhof',[[1900,3250],[2600,3100],[4000,2800],[4000,4000],[2450,4000],[1900,3700]],{lots:{ruins:2,houses:2,construction:1},fringe:'ruins'}]],
 other:{lots:{houses:2,buero:1,ruins:1,hinterhof:1},fringe:'houses'},
 marks:[[2600,1120,'Spree'],[575,3470,'Landwehrkanal'],[290,2410,'Neuer See'],[500,560,'Stadtbahn']],
 hbf:[1010,450],
 lm:()=>{const K=MITTE;mPuddles();grStern(170,2050);hbf(...K.hbf);
  viaduct(segsOf(K.rail),{c:['#7a3a26','#5a2a1a','#4a2216'],pc:'#6b3626',pcap:'#4a2216',ps:22,z0:46,z1:60,d:40,step:72,tc:'#a83228',skip:(x,y)=>Math.abs(x-K.hbf[0])<440&&Math.abs(y-K.hbf[1])<190,free:(x,y)=>roadD(x,y)<72});
  reichstag(1980,1440);kanzleramt(1260,1180);mBox(1680,1290,220,110,drawPLH,'Paul-Löbe-Haus',70);tor(2235,1890);
  sony(1740,2780);roundTower(1865,2785,46,250);kollhoff(2000,2705);stage(2205,2650);clinic(1900,3010);wallPieces(2200,2985);
  mBox(1330,2800,200,150,drawPhil,'Philharmonie',120);mBox(1250,3180,170,170,drawNNG,'Neue Nationalgalerie',42);anhalter(2360,3700);gendarmenmarkt(3430,2190);checkpoint(3180,3140);
  for(const s of K.stations){const p=station(...s);if(s[4]&&p){SX=p[0];SY=p[1]+60;}}},
 post:()=>mNeon()};
DIST[DI('Mitte')].geo=MITTE;
const MCY='#43d1cf',MMG='#ff4fa3',MAM='#e19142',ppZone=()=>MITTE.zones.find(z=>z[0]==='Potsdamer Platz')[1];
// generic landmark box at centre cx,cy with collision, reserve, shadow and a map label
function mBox(cx,cy,w,h,draw,name,H,o){const b=Object.assign({x:cx-w/2,y:cy-h/2,w,h,H,top:H,R0:0,lights:[],draw},o||{});blds.push(b);bShadow({...b,H:Math.min(H,140)});walls.push({x:b.x,y:b.y,w,h});
  reserved.push({x:b.x-30,y:b.y-30,w:w+60,h:h+60});if(name)marks.push({x:cx,y:cy,n:name});return b;}
const glassRows=(x,y,w,h,z0,z1,c,st)=>{for(let u=6;u<w-4;u+=st)faceS(x+u,y,st*.55,h,z0,z1,c);for(let v=6;v<h-4;v+=st)faceE(x,y+v,w,st*.55,z0,z1,c);};
/* ---- wet ground: neon puddles on roads (cyan, magenta, amber), denser in the Potsdamer Platz core ---- */
function mPuddles(){const g=gx,Z=ppZone(),pud=(x,y)=>{const r=R(14,40),c=pick(['67,209,207','255,79,163','225,145,66','150,170,200']),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${R(.12,.22)})`);gr.addColorStop(1,`rgba(${c},0)`);
    g.save();g.translate(x,y);g.scale(1,R(.4,.7));g.translate(-x,-y);g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.restore();g.fillStyle='rgba(200,220,235,.08)';g.fillRect(x-r*.4,y-1,r*.8,1.5);};
  for(let i=0;i<420;i++){const q=roadPt(),o=R(-46,46);pud(q.x+q.nx*o,q.y+q.ny*o);}
  for(let i=0,n=0;i<900&&n<160;i++){const x=R(2250,3250),y=R(2600,3260);if(inPoly(Z,x,y)&&!isWater(x,y)){pud(x,y);n++;}}}
// Großer Stern: roundabout around the Siegessäule (column with the golden Victoria on top, upright sprite)
function grStern(x,y){const g=gx;g.strokeStyle='#3a2f27';g.lineWidth=110;g.beginPath();g.arc(x,y,150,0,7);g.stroke();g.strokeStyle=D.road;g.lineWidth=86;g.beginPath();g.arc(x,y,150,0,7);g.stroke();
  g.fillStyle='#26332a';g.beginPath();g.arc(x,y,100,0,7);g.fill();g.fillStyle='#3d3128';g.beginPath();g.arc(x,y,38,0,7);g.fill();
  const W=70,H=360,c=cnv(W,H),t=c.getContext('2d'),cx=W/2,base=H-4;
  t.fillStyle='#5a2a24';t.fillRect(4,base-34,W-8,34);t.fillStyle='#7a3a30';t.fillRect(4,base-34,W-8,5);t.fillStyle='#3a1a14';t.fillRect(W-16,base-34,12,34);
  t.fillStyle='#b8ac94';t.fillRect(10,base-62,W-20,28);for(let i=0;i<6;i++){t.fillStyle='#8a806c';t.fillRect(13+i*8.5,base-60,3,24);}t.fillStyle='#6a6052';t.fillRect(8,base-66,W-16,5);
  const sg=t.createLinearGradient(cx-8,0,cx+8,0);sg.addColorStop(0,'#d8ccb0');sg.addColorStop(1,'#8a806c');t.fillStyle=sg;t.fillRect(cx-8,62,16,base-128);
  for(const y of [130,180,230]){t.fillStyle='#c9a227';t.fillRect(cx-10,y,20,14);t.fillStyle='#8a6a14';for(let k=0;k<4;k++)t.fillRect(cx-9+k*5,y+2,2,10);}
  t.fillStyle='#8a806c';t.fillRect(cx-12,56,24,8);t.fillStyle='#c9a227';t.fillRect(cx-6,48,12,8);
  t.fillStyle='#e8b830';t.beginPath();t.ellipse(cx,32,5,12,0,0,7);t.fill();t.beginPath();t.arc(cx,17,4,0,7);t.fill();t.beginPath();t.moveTo(cx-2,26);t.lineTo(cx-18,6);t.lineTo(cx-6,30);t.fill();t.beginPath();t.moveTo(cx+2,26);t.lineTo(cx+16,4);t.lineTo(cx+6,30);t.fill();
  t.strokeStyle='#e8b830';t.lineWidth=2;t.beginPath();t.moveTo(cx+3,22);t.lineTo(cx+10,2);t.stroke();t.beginPath();t.arc(cx+11,2,3,0,7);t.stroke();
  blds.push({x:x-W/2,y,w:W,h:0,top:base,spr:c,sc:1.25,lights:[{x,y,z:420,r:70}]});neons.push({x,y,z:420,c:'#f2c84b',s:40});walls.push({x:x-34,y:y-26,w:68,h:40});
  reserved.push({x:x-200,y:y-200,w:400,h:400});marks.push({x,y:y+60,n:'Siegessäule'});}
/* ---- Reichstag: sandstone block, four corner towers, portico on the south face, glass dome with a survivor fire inside ---- */
function drawReichstag(b){const{x,y,w,h}=b,c='#b8ac94',T=30,Z=72,ZT=108;faceT(x+10,y+6,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,Z,c,INK,'#8a8070');
  for(let u=24;u<w-24;u+=20)for(const z of [14,42])faceS(x+u,y,8,h,z,z+18,'#1a1814');for(let v=24;v<h-24;v+=20)for(const z of [14,42])faceE(x,y+v,w,8,z,z+18,'#1a1814');
  faceS(x,y,w,h,Z-6,Z-3,'#8a806c');faceE(x,y,w,h,Z-6,Z-3,'#6a6052');
  const tw=(tx,ty,z0,fs,fe)=>{ibox(tx,ty,T,T,z0,ZT,'#c4b8a0',INK,'#9a907c');if(fs)faceS(tx,ty,T,T,0,z0,'#c4b8a0',INK);if(fe)faceE(tx,ty,T,T,0,z0,dark('#c4b8a0',.62),INK);faceS(tx+10,ty,10,T,ZT-34,ZT-10,'#1a1814');faceE(tx,ty+10,T,10,ZT-34,ZT-10,'#1a1814');
    for(let i=0;i<4;i++){ibox(tx+i*8,ty+T-4,4,4,ZT,ZT+6,'#c4b8a0',INK);ibox(tx+T-4,ty+i*8,4,4,ZT,ZT+6,'#c4b8a0',INK);}};
  tw(x-6,y-6,Z);tw(x+w-T+6,y-6,Z,0,1);tw(x-6,y+h-T+6,Z,1,0);
  const C=P3(x+w/2,y+h/2,Z),Rr=50;ctx.fillStyle='#a89c84';ctx.fillRect(C[0]-Rr,C[1]-14,Rr*2,14);ctx.beginPath();ctx.ellipse(C[0],C[1],Rr,Rr/2,0,0,Math.PI);ctx.fill();ctx.fillStyle='#8a806c';ctx.beginPath();ctx.ellipse(C[0],C[1]-14,Rr,Rr/2,0,0,7);ctx.fill();
  const D0=[C[0],C[1]-14],fl=.5+.2*Math.sin(performance.now()*.006);ctx.fillStyle=`rgba(240,150,60,${fl*.5})`;ctx.beginPath();ctx.ellipse(D0[0],D0[1],Rr*.5,Rr*.25,0,0,7);ctx.fill();
  ctx.fillStyle='rgba(150,200,215,.35)';ctx.beginPath();ctx.ellipse(D0[0],D0[1],Rr,Rr*1.05,0,Math.PI,0);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(30,40,46,.7)';ctx.lineWidth=1;
  for(let k=1;k<4;k++){ctx.beginPath();ctx.ellipse(D0[0],D0[1],Rr*k/4,Rr*1.05,0,Math.PI,0);ctx.stroke();}for(let k=1;k<4;k++){const yy=D0[1]-Rr*1.05*k/4,hw=Rr*Math.sqrt(1-k*k/16);ctx.beginPath();ctx.moveTo(D0[0]-hw,yy);ctx.lineTo(D0[0]+hw,yy);ctx.stroke();}
  ctx.strokeStyle=INK;ctx.beginPath();ctx.ellipse(D0[0],D0[1],Rr,Rr*1.05,0,Math.PI,0);ctx.stroke();
  const px=x+w*.3,pw=w*.4,py=y+h;for(let i=0;i<6;i++)ibox(px+i*pw/5.4,py,7,12,0,Z-8,'#d0c4ac',INK);ibox(px-6,py,pw+14,14,Z-8,Z,'#c4b8a0',INK);poly([P3(px-6,py+14,Z),P3(px+pw+8,py+14,Z),P3(px+pw/2,py+14,Z+26)],'#c4b8a0',INK);
  tw(x+w-T+6,y+h-T+6,0);}
function reichstag(cx,cy){const b=mBox(cx,cy,300,200,drawReichstag,'Reichstag',140,{lights:[{x:cx,y:cy,z:110,r:90,fl:1}]});neons.push({x:cx,y:cy,z:100,c:'#f0a050',s:50});}
/* ---- Brandenburger Tor: six column pairs as separate pillars (walk through the passages), attic deck on top with the Quadriga, gate houses at both ends ---- */
function drawAttic(b){const{x,y,w,h,z0,z1}=b,c='#d8c8a0';ibox(x,y,w,h,z0,z1,c,INK,'#c8b890');faceS(x,y,w,h,z0+4,z0+7,'#a89870');faceE(x,y,w,h,z0+4,z0+7,'#8a7a58');
  for(let v=6;v<h-6;v+=10)faceE(x,y+v,w,5,z0+10,z0+14,'#b8a880');ibox(x+4,y+h*.3,w-8,h*.4,z1,z1+8,c,INK,'#c8b890');
  const cx=x+w/2,cy=y+h/2,Q='#4a6a58',z=z1+8;ibox(cx-12,cy-26,24,22,z,z+12,Q,INK);ibox(cx-12,cy+4,24,22,z,z+12,Q,INK);ibox(cx-7,cy-7,14,14,z,z+18,Q,INK);ibox(cx-2,cy-2,4,4,z+18,z+34,Q,INK);
  const a=P3(cx,cy,z+34);poly([a,P3(cx,cy-12,z+44),P3(cx,cy-4,z+30)],Q,INK);poly([a,P3(cx,cy+12,z+44),P3(cx,cy+4,z+30)],Q,INK);ln3(a,P3(cx+4,cy,z+52),'#6a8a78');}
// real gate: 62.5 m wide, 11 m deep, five passages (middle one wider). Here about 2.5x real so the passages stay walkable (middle 32, others 26, pillars 10 thick, 34 deep).
// All parts share a fade group (grp), so the whole gate turns transparent together
function tor(cx,cy){const W=34,c='#d8c8a0',cap='#c8b890',G_={};for(const o of [-93,-57,-21,21,57,93]){const y=cy+o-5;blds.push({x:cx-W/2,y,w:W,h:10,H:66,top:66,R0:0,c,cap,grp:G_,lights:[],draw:drawPillar});walls.push({x:cx-W/2,y,w:W,h:10});}
  for(const sd of [-1,1])mBox(cx,cy+sd*112,W+8,28,(b)=>{ibox(b.x,b.y,b.w,b.h,0,46,c,INK,cap);faceS(b.x+12,b.y,14,b.h,10,36,'#1a1814');faceE(b.x,b.y+8,b.w,10,10,36,'#1a1814');},0,46,{grp:G_});
  blds.push({x:cx-W/2-2,y:cy-100,w:W+4,h:200,H:130,top:130,R0:0,z0:66,z1:88,grp:G_,lights:[],draw:drawAttic});reserved.push({x:cx-60,y:cy-150,w:120,h:300});marks.push({x:cx,y:cy,n:'Brandenburger Tor'});
  neons.push({x:cx,y:cy,z:140,c:'#f0a050',s:30});}
/* ---- Kanzleramt (white cube with the round window, low wings), Paul-Löbe-Haus (glass and concrete slab) ---- */
function drawKanzler(b){const{x,y,w,h}=b,c='#e0ddd4';faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,50,c,INK,'#b8b4aa');glassRows(x,y,w,h,12,40,'#4a5a64',16);
  const cx=x+w*.3,cy=y+h*.15,cw=w*.4,ch=h*.7;ibox(cx,cy,cw,ch,50,150,'#ecebe4',INK,'#c8c4ba');ibox(cx-10,cy-10,cw+20,ch+20,150,156,'#f4f2ec',INK);
  const ring=(f)=>{const p=[];for(let i=0;i<20;i++){const a=i/20*6.283;p.push(f(Math.cos(a)*24,Math.sin(a)*24));}return p;};
  poly(ring((u,v)=>P3(cx+cw/2+u,cy+ch,100+v)),'#3a5260',INK);poly(ring((u,v)=>P3(cx+cw,cy+ch/2+u,100+v)),'#2e4450',INK);}
function kanzleramt(cx,cy){mBox(cx,cy,220,160,drawKanzler,'Kanzleramt',160);}
function drawPLH(b){const{x,y,w,h}=b;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,64,'#d0ccc0',INK,'#a8a498');glassRows(x,y,w,h,8,58,'#3e4e58',14);ibox(x-6,y-6,w+12,h+12,64,70,'#e8e4dc',INK);}
/* ---- Hauptbahnhof (v0.47b): open hall you walk through. Two tracks through the middle (a wrecked ICE on one), platforms with shops along both long walls,
   three doors per side, open ends where the Stadtbahn comes in, translucent glass barrel roof and the two office bridges ("Bügelbauten") crossing high above.
   Roof and bridges sort late (dk) and fade together (grp). Several floors: later (BACKLOG) ---- */
const HBF_SH=['Döner','Bäckerei','Presse','Späti','Apotheke','Blumen','Imbiss','Kiosk'];
function signC(t,col){const c=cnv(70,16),g=c.getContext('2d');g.fillStyle='#0c0a10';g.fillRect(0,0,70,16);g.strokeStyle=col;g.lineWidth=1.5;g.strokeRect(1,1,68,14);g.fillStyle=col;g.font='700 10px sans-serif';g.textAlign='center';g.fillText(t,35,12);return c;}
function onS(img,x,y,w,z,hh){const q=P3(x,y,z),[ux,uy]=bAx();ctx.save();ctx.transform(ux,uy,0,1,q[0],q[1]);ctx.drawImage(img,0,0,w,hh);ctx.restore();}// image on a south-facing plane, top edge at z
function drawShop(b){const{x,y,w,h}=b;faceT(x+3,y+3,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,24,'#3a2e28',INK,'#4a3a30');for(let u=0;u<w;u+=10)faceS(x+u,y-4,5,h+4,24,30,b.c);faceT(x,y-4,w,h+4,30,b.c);
  faceS(x+6,y,w-12,h,4,20,'rgba(224,137,46,.35)');ibox(x+4,y+2,4,4,30,52,'#2a2a30');ibox(x+w-8,y+2,4,4,30,52,'#2a2a30');onS(b.sg,x,y+2,w,56,14);}
function drawGlassW(b){const{x,y,w,h}=b;ibox(x,y,w,h,0,48,'#4a5a64',INK,'#5a6a74');for(let u=4;u<w;u+=16)faceS(x+u,y,10,h,4,44,'rgba(20,30,36,.85)');faceS(x,y,w,h,44,48,'#7a848c');}
function drawICE(b){const{x,y,w,h}=b;faceT(x+5,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,4,40,'#d8dcd8',INK,'#c8ccc8');faceS(x,y,w,h,12,15,'#c23a2e');faceE(x,y,w,h,12,15,'#8a2a20');
  for(let u=10;u<w-10;u+=16)faceS(x+u,y,12,h,20,32,'#1a2024');for(const r of b.rust){const p=P3(x+w*r,y+h,26);ctx.fillStyle='rgba(110,55,25,.35)';ctx.beginPath();ctx.ellipse(p[0],p[1],8,4,0,0,7);ctx.fill();}
  for(let u=w*.33;u<w;u+=w*.33)ln3(P3(x+u,y+h,4),P3(x+u,y+h,40),'#1a1814');}
function drawHbfRoof(b){const{x,y,w,h,z0}=b,Rf=48,N=10,zz=k=>z0+Rf*Math.sin(Math.PI*k/N);
  for(let k=0;k<N;k++)poly([P3(x,y+h*k/N,zz(k)),P3(x+w,y+h*k/N,zz(k)),P3(x+w,y+h*(k+1)/N,zz(k+1)),P3(x,y+h*(k+1)/N,zz(k+1))],k<N/2?'rgba(110,140,160,.22)':'rgba(160,190,205,.3)');
  ctx.strokeStyle='rgba(40,52,60,.8)';ctx.lineWidth=1;for(let u=0;u<=w;u+=40){ctx.beginPath();for(let k=0;k<=N;k++){const p=P3(x+u,y+h*k/N,zz(k));k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  for(const yy of [y,y+h])ln3(P3(x,yy,z0),P3(x+w,yy,z0),'#2a343c');const gp=[];for(let k=0;k<=N;k++)gp.push(P3(x+w,y+h*k/N,zz(k)));ctx.strokeStyle='#2a343c';ctx.lineWidth=2;ctx.beginPath();gp.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
function drawBuegel(b){const{x,y,w,h,z0,z1}=b;ibox(x,y,w,h,z0,z1,'#9aa4ac',INK,'#7a848c');glassRows(x,y,w,h,z0+6,z1-6,'#26323c',9);if(b.sg)onS(b.sg,x+w*.08,y+h,w*.84,z0-2,14);}
function hbf(cx,cy){const w=700,h=280,x0=cx-w/2,y0=cy-h/2,g=gx,G_={},dk=600;
  for(let x=x0;x<x0+w;x+=24)for(let y=y0;y<y0+h;y+=24){g.fillStyle=((x-x0)/24+(y-y0)/24)%2?'#3a3a42':'#30303a';g.fillRect(x,y,24,24);}
  for(const ty of [cy-30,cy+30]){g.fillStyle='#1e1a18';g.fillRect(x0-90,ty-18,w+180,36);for(let x=x0-90;x<x0+w+90;x+=10){g.fillStyle='#3a2a1e';g.fillRect(x,ty-14,4,28);}g.fillStyle='#8a8276';g.fillRect(x0-90,ty-9,w+180,2);g.fillRect(x0-90,ty+7,w+180,2);}
  g.fillStyle='#c8a020';g.fillRect(x0,cy-50,w,3);g.fillRect(x0,cy+48,w,3);
  const doors=[w*.25,w*.5,w*.75],seg=(yy)=>{let u=0;for(const d of [...doors,w+30]){const a=u,bb=d-30;if(bb-a>4){const o={x:x0+a,y:yy,w:bb-a,h:10,H:48,top:48,R0:0,lights:[],draw:drawGlassW};blds.push(o);walls.push({x:o.x,y:o.y,w:o.w,h:10});}u=d+30;}};
  seg(y0);seg(y0+h-10);
  const sc=['#c23a2e','#3a6a8a','#d8a020','#3B6D11','#7a3a6a','#43d1cf','#e19142','#ff4fa3'];let si=0;
  const slots=[0,...doors.flatMap(d=>[d-30,d+30]),w],mids=[];for(let i=0;i<slots.length;i+=2)mids.push((slots[i]+slots[i+1])/2-36);
  for(const[yy,up]of [[y0+14,0],[y0+h-48,1]])for(const u of mids){const c=sc[si%8],o={x:x0+u,y:yy,w:72,h:32,H:60,top:60,R0:0,c,sg:signC(HBF_SH[si++%8],c),lights:[{x:x0+u+36,y:yy+16,z:40,r:60,fl:Math.random()<.4}],draw:drawShop};
    blds.push(o);walls.push({x:o.x,y:o.y,w:72,h:32});neons.push({x:x0+u+36,y:yy+(up?0:32),z:50,c,s:30});if(Math.random()<.7)addBrk(x0+u+86,yy+(up?20:12),'crate',false);}
  {const o={x:x0+90,y:cy-45,w:380,h:30,H:44,top:44,R0:0,lights:[],rust:[.1,.3,.55,.8],draw:drawICE};blds.push(o);walls.push({x:o.x,y:o.y,w:o.w,h:o.h});}
  blds.push({x:x0,y:y0,w,h,H:110,top:110,R0:0,z0:62,grp:G_,dk,lights:[{x:cx-140,y:cy,z:20,r:110,fl:1},{x:cx+140,y:cy,z:20,r:110},{x:cx,y:cy+60,z:20,r:90,fl:1}],draw:drawHbfRoof});
  for(const f of [-1,1]){const bx=cx+f*255-22,by=y0-70,bh=h+140;blds.push({x:bx,y:by,w:44,h:bh,H:200,top:200,R0:0,z0:124,z1:200,grp:G_,dk,sg:f>0?signC('BERLIN HAUPTBAHNHOF','#e8e4dc'):null,lights:[],draw:drawBuegel});
    for(const ly of [by,by+bh-60]){const o={x:bx,y:ly,w:44,h:60,H:124,top:124,R0:0,c:'#8a949c',cap:'#7a848c',lights:[],draw:drawPillar};blds.push(o);walls.push({x:bx,y:ly,w:44,h:60});}}
  reserved.push({x:x0-30,y:y0-100,w:w+60,h:h+200});marks.push({x:cx,y:cy,n:'Hauptbahnhof'});}
/* ---- Gendarmenmarkt (Konzerthaus between the Französischer and the Deutscher Dom) and Checkpoint Charlie ---- */
function domeAt(cx,cy,z,r,c,top){const B=P3(cx,cy,z),T=P3(cx,cy,z+r*.9);ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(B[0],B[1],r,r/2,0,0,Math.PI);ctx.lineTo(T[0]-r,T[1]);ctx.ellipse(T[0],T[1],r,r/2,0,Math.PI,2*Math.PI);ctx.closePath();ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.stroke();
  for(let k=1;k<6;k++){const u=T[0]-r+k*r/3;ctx.strokeStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.moveTo(u,T[1]+Math.sqrt(Math.max(0,1-Math.pow((u-T[0])/r,2)))*r/2);ctx.lineTo(u,B[1]+Math.sqrt(Math.max(0,1-Math.pow((u-T[0])/r,2)))*r/2);ctx.stroke();}
  ctx.fillStyle=top;ctx.beginPath();ctx.ellipse(T[0],T[1],r*1.05,r*1.05,0,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();ibox(cx-3,cy-3,6,6,z+r*.9+r,z+r*.9+r+14,top,INK);}
function drawDom(b){const{x,y,w,h}=b,c='#d8ccb0';faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,50,c,INK,'#b8ac94');for(const f of [.5])for(let i=0;i<4;i++){ibox(x+w*.3+i*w*.13,y+h,5,8,0,40,'#e4dac0',INK);ibox(x+w,y+h*.3+i*h*.13,8,5,0,40,'#e4dac0',INK);}
  poly([P3(x+w*.25,y+h+8,40),P3(x+w*.75,y+h+8,40),P3(x+w*.5,y+h+8,58)],c,INK);domeAt(x+w/2,y+h/2,50,w*.32,'#cfc3a8','#4a7a68');}
function drawKonz(b){const{x,y,w,h}=b,c='#ddd2b8';faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,58,c,INK,'#b8ac94');for(let u=10;u<w-10;u+=14)faceS(x+u,y,6,h,14,44,'#2a2418');ibox(x+w*.2,y+h*.2,w*.6,h*.6,58,84,c,INK,'#a89c84');
  for(let i=0;i<6;i++)ibox(x+w,y+h*.2+i*h*.12,10,5,0,52,'#e8dec4',INK);poly([P3(x+w+10,y+h*.15,52),P3(x+w+10,y+h*.85,52),P3(x+w+10,y+h*.5,74)],c,INK);}
function gendarmenmarkt(cx,cy){const g=gx;g.fillStyle='#3a3530';g.fillRect(cx-150,cy-210,300,420);for(let i=0;i<500;i++){g.fillStyle=pick(['#433d36','#36302a','#2e2924']);g.fillRect(R(cx-150,cx+150),R(cy-210,cy+210),R(6,12),R(4,8));}
  mBox(cx,cy-150,90,90,drawDom,'Französischer Dom',150);mBox(cx,cy+150,90,90,drawDom,'Deutscher Dom',150);mBox(cx,cy,110,120,drawKonz,'Gendarmenmarkt',84);
  for(const q of [[cx-110,cy-60],[cx+110,cy+60],[cx-110,cy+70],[cx+110,cy-70]])makeTree(q[0],q[1],'green');reserved.push({x:cx-160,y:cy-220,w:320,h:440});}
function checkpoint(x,y){mBox(x,y,30,24,(b)=>{const{x,y,w,h}=b;ibox(x,y,w,h,0,34,'#e8e4dc',INK,'#c8c4b8');faceS(x+5,y,w-10,h,14,28,'#2a3038');ibox(x-2,y-2,w+4,h+4,34,38,'#d8d4cc',INK);},0,40);
  for(let i=0;i<10;i++){const a=i/10*6.283,bx=x+Math.cos(a)*34,by=y+Math.sin(a)*26;if(Math.abs(Math.sin(a))>.9)continue;gx.fillStyle='#8a7a5a';gx.beginPath();gx.ellipse(bx,by,8,5,0,0,7);gx.fill();}
  const c=cnv(64,120),t=c.getContext('2d');t.fillStyle='#24201c';t.fillRect(30,40,4,80);t.fillStyle='#ead9c0';t.fillRect(0,0,64,42);t.strokeStyle='#1a1a1a';t.strokeRect(1,1,62,40);t.fillStyle='#1a1a1a';t.font='700 6px sans-serif';t.textAlign='center';
  ['SIE VERLASSEN DEN','AMERIKANISCHEN','SEKTOR','YOU ARE LEAVING'].forEach((s,i)=>t.fillText(s,32,9+i*9));const sx=x+70,sy=y-30;blds.push({x:sx-32,y:sy,w:64,h:0,top:118,spr:c,sc:1.2,lights:[{x:sx,y:sy,z:120,r:50}]});walls.push({x:sx-3,y:sy-3,w:6,h:5});
  marks.push({x,y:y+30,n:'Checkpoint Charlie'});}
/* ---- Potsdamer Platz core ---- */
// Sony Center: ring of glass buildings with gaps, magenta tent roof on cables over the plaza (deck high above, fades when the player is under it)
function drawTent(b){const{x,y,w,z0}=b,r=w/2,cx=x+r,cy=y+r,A=P3(cx,cy,z0+70),rim=[];for(let i=0;i<24;i++){const a=i/24*6.283;rim.push(P3(cx+Math.cos(a)*r,cy+Math.sin(a)*r,z0+Math.sin(a+.8)*14));}
  poly(rim,'rgba(189,43,119,.2)');ctx.strokeStyle='rgba(255,79,163,.75)';ctx.lineWidth=1.2;for(const p of rim){ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(p[0],p[1]);ctx.stroke();}
  ctx.lineWidth=2;ctx.beginPath();rim.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.stroke();ln3(A,P3(cx,cy,z0+130),'#cfc8d8');ctx.fillStyle=MMG;ctx.beginPath();ctx.arc(A[0],A[1],3,0,7);ctx.fill();}
function sony(cx,cy){const R0=118;for(let i=0;i<6;i++){const a=i/6*6.283+.5,w=66,h=60,bx=cx+Math.cos(a)*R0-w/2,by=cy+Math.sin(a)*R0-h/2,H=R(110,150),bb={x:bx,y:by,w,h,H,top:H,R0:0};
    makeB(bb,'buero');blds.push(bb);walls.push(bb);}
  const g=gx;g.fillStyle='#24202a';g.beginPath();g.arc(cx,cy,R0-30,0,7);g.fill();g.strokeStyle='rgba(255,79,163,.25)';g.lineWidth=3;g.beginPath();g.arc(cx,cy,R0-40,0,7);g.stroke();
  blds.push({x:cx-R0-30,y:cy-R0-30,w:2*R0+60,h:2*R0+60,H:240,top:240,R0:0,z0:150,lights:[{x:cx,y:cy,z:30,r:120}],draw:drawTent});neons.push({x:cx,y:cy,z:220,c:MMG,s:90},{x:cx,y:cy,z:10,c:MMG,s:70});
  reserved.push({x:cx-R0-60,y:cy-R0-60,w:2*R0+120,h:2*R0+120});marks.push({x:cx,y:cy,n:'Sony Center'});}
// DB-Turm: round glass tower, cyan lit floors on generator power
function drawRound(b){const{x,y,w,H}=b,r=w/2,cx=x+r,cy=y+r,B=P3(cx,cy,0),T=P3(cx,cy,H);faceT(x+8,y+5,w,w,0,'rgba(0,0,0,.35)');
  const g=ctx.createLinearGradient(B[0]-r,0,B[0]+r,0);g.addColorStop(0,'#3a5a68');g.addColorStop(.4,'#2c4a58');g.addColorStop(1,'#14222a');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(B[0],B[1],r,r/2,0,0,Math.PI);ctx.lineTo(T[0]-r,T[1]);ctx.ellipse(T[0],T[1],r,r/2,0,Math.PI,2*Math.PI);ctx.closePath();ctx.fill();
  ctx.lineWidth=1.4;b.fl.forEach((on,i)=>{const z=14+i*9;ctx.strokeStyle=on?'rgba(67,209,207,.85)':'rgba(10,20,26,.7)';ctx.beginPath();ctx.ellipse(B[0],B[1]-z,r,r/2,0,.15,Math.PI-.15);ctx.stroke();});
  ctx.fillStyle='#4a6a78';ctx.beginPath();ctx.ellipse(T[0],T[1],r,r/2,0,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.moveTo(B[0]-r,B[1]);ctx.lineTo(T[0]-r,T[1]);ctx.moveTo(B[0]+r,B[1]);ctx.lineTo(T[0]+r,T[1]);ctx.stroke();
  ctx.fillStyle='rgba(200,230,240,.12)';ctx.fillRect(B[0]-r*.55,T[1],r*.18,B[1]-T[1]);}
function roundTower(cx,cy,r,H){const b=mBox(cx,cy,2*r,2*r,drawRound,'DB-Turm',H,{fl:Array.from({length:Math.floor((H-20)/9)},()=>Math.random()<.35)});b.lights.push({x:cx,y:cy+r,z:H*.6,r:80});neons.push({x:cx,y:cy+r,z:H*.5,c:MCY,s:70},{x:cx,y:cy,z:H,c:MCY,s:40});}
// Kollhoff-Tower: dark red brick, stepped top, a few amber windows
function drawKoll(b){const{x,y,w,h}=b,c='#7a3a2a';faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,200,c,INK,'#5a2a1e');for(let u=6;u<w;u+=8){ln3(P3(x+u,y+h,4),P3(x+u,y+h,196),'rgba(0,0,0,.28)');ln3(P3(x+w,y+u,4),P3(x+w,y+u,196),'rgba(0,0,0,.32)');}
  for(const q of b.lw)faceS(x+q[0],y,4,h,q[1],q[1]+6,MAM);ibox(x+8,y+8,w-16,h-16,200,226,c,INK,'#5a2a1e');ibox(x+16,y+16,w-32,h-32,226,244,c,INK,'#4a2418');ibox(x+w/2-2,y+h/2-2,4,4,244,272,'#3a3a3a',INK);}
function kollhoff(cx,cy){const b=mBox(cx,cy,70,70,drawKoll,'Kollhoff-Tower',272,{lw:Array.from({length:7},()=>[Math.floor(R(1,8))*8,Math.floor(R(2,22))*9])});b.lights.push({x:cx,y:cy+35,z:120,r:50});neons.push({x:cx,y:cy,z:276,c:'#ff3a2a',s:18});}
// open-air sound system stage (board): platform, speaker stacks with pulsing cones, banner with an animated equaliser, generator box
function drawStage(b){const{x,y,w,h}=b,t=performance.now(),k=.5+.5*Math.sin(t*.0157);faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,16,'#2a1430',INK,'#3a2040');
  ibox(x+20,y,w-40,6,16,74,'#1a0c1c',INK);for(let i=0;i<10;i++){const hh=6+20*Math.abs(Math.sin(t*.004+i*1.7));faceS(x+28+i*((w-56)/10),y,5,6,24,24+hh,MMG);}
  ibox(x+w/2-16,y+22,32,14,16,30,'#3a3a40',INK);ibox(x+w/2-12,y+24,24,10,30,32,'#5a5a64');
  for(const sx of [x-6,x+w-22]){ibox(sx,y+h-34,28,30,0,86,'#16161a',INK,'#222');for(const z of [20,46,70]){const p=P3(sx+14,y+h-4,z);ctx.strokeStyle=`rgba(255,79,163,${.4+.5*k})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p[0],p[1],7+k*1.5,0,7);ctx.stroke();ctx.fillStyle='#0a0a0c';ctx.beginPath();ctx.arc(p[0],p[1],5,0,7);ctx.fill();}}
  ln3(P3(x,y+h/2,96),P3(x+w,y+h/2,96),'#5a5a64');ln3(P3(x,y+h/2,92),P3(x+w,y+h/2,92),'#5a5a64');
  ibox(x+w+8,y+h-26,26,20,0,22,'#c8a020',INK,'#2a2a2a');for(let i=0;i<4;i++)faceS(x+w+10+i*6,y+h-26,3,20,4,18,'#1a1a1a');faceE(x+w+8,y+h-20,26,8,8,16,MMG);}
function stage(cx,cy){const b=mBox(cx,cy,150,60,drawStage,'Soundsystem',96,{lights:[{x:cx,y:cy+30,z:30,r:140}]});neons.push({x:cx,y:cy+30,z:40,c:MMG,s:110},{x:cx-75,y:cy+30,z:60,c:MMG,s:50},{x:cx+75,y:cy+30,z:60,c:MMG,s:50});}
// street implant clinic (board): counter, shelf with lit vials, tarp, cyan cross and cyber arm sign
function drawClinic(b){const{x,y,w,h}=b;faceT(x+5,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,14,0,62,'#14222a',INK);for(let i=0;i<6;i++)faceS(x+8+i*13,y,6,14,26,46,'rgba(67,209,207,.55)');
  for(const q of [[x,y],[x+w-4,y],[x,y+h-4],[x+w-4,y+h-4]])ibox(q[0],q[1],4,4,0,60,'#3a3a40');ibox(x+10,y+h-20,w-20,16,0,24,'#1a2a30',INK,'#2a3a44');ibox(x+w*.4,y+24,22,14,0,20,'#5a6470',INK);
  poly([P3(x-4,y-4,72),P3(x+w+4,y-4,72),P3(x+w+4,y+h+4,58),P3(x-4,y+h+4,58)],'rgba(58,74,80,.85)',INK);faceS(x+8,y,w-16,h+4,60,78,'#0a1a20',INK);
  const s=(a,b2,lw)=>{ctx.strokeStyle=MCY;ctx.lineWidth=lw||2.5;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.stroke();},yy=y+h+4;s(P3(x+20,yy,63),P3(x+20,yy,75));s(P3(x+14,yy,69),P3(x+26,yy,69));s(P3(x+38,yy,68),P3(x+64,yy,68),3);s(P3(x+64,yy,68),P3(x+72,yy,72));s(P3(x+64,yy,68),P3(x+72,yy,65));}
function clinic(cx,cy){mBox(cx,cy,90,60,drawClinic,'Implantat-Klinik',80,{lights:[{x:cx,y:cy+34,z:66,r:90}]});neons.push({x:cx,y:cy+34,z:70,c:MCY,s:70});}
// Berlin Wall pieces with the bear stencil and paint (board), plus striped barriers
function drawWallP(b){const{x,y,w,h,H}=b;faceT(x+3,y+3,w,h,0,'rgba(0,0,0,.3)');ibox(x,y,w,h,0,H,'#bab6aa',INK,'#9a968a');for(const m of b.mur)faceS(x+w*m[0],y,w*m[1],h,m[2],m[3],m[4]);
  const B=[[2,0],[5,0],[6,9],[10,9],[11,0],[14,0],[13,13],[16,20],[15,25],[12,23],[11,28],[7,28],[5,23],[1,25],[0,20],[3,13]];poly(B.map(q=>P3(x+w*.3+q[0]*1.4,y+h,6+q[1]*1.4)),'#1a1a1e');}
function drawBarrier(b){const{x,y,w,h}=b;ibox(x,y,w,h,0,16,'#ead9c0',INK);for(let u=0;u<w;u+=12)faceS(x+u,y,6,h,2,14,'#c23a2e');}
function wallPieces(x0,y0){for(let i=0;i<4;i++){const x=x0+i*62,y=y0+i*30,mur=Array.from({length:4},()=>[R(0,.8),R(.1,.2),R(30,44),R(46,54),pick(['#d4537e','#43d1cf','#f2d14b','#7d9bff'])]);
    blds.push({x,y,w:48,h:12,H:56,top:56,R0:0,mur,lights:[],draw:drawWallP});walls.push({x,y,w:48,h:12});}
  for(const q of [[x0-120,y0+40],[x0+90,y0-70],[x0+260,y0+160]]){blds.push({x:q[0],y:q[1],w:60,h:14,H:16,top:16,R0:0,lights:[],draw:drawBarrier});walls.push({x:q[0],y:q[1],w:60,h:14});}
  reserved.push({x:x0-140,y:y0-90,w:440,h:300});marks.push({x:x0+90,y:y0+40,n:'Mauerstücke',soft:1});}
/* ---- Kulturforum and the south: Philharmonie (golden tent roof), Neue Nationalgalerie (glass hall under a black steel roof), Anhalter Bahnhof portal ruin ---- */
function drawPhil(b){const{x,y,w,h}=b;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,50,'#d8a838',INK,'#c89828');for(let u=20;u<w-20;u+=26)faceS(x+u,y,6,h,14,40,'#2a1e0c');
  const A=P3(x+w*.45,y+h*.5,124),B=P3(x+w*.75,y+h*.55,96);poly([P3(x,y+h,50),P3(x+w*.6,y+h,50),A],'#c89828',INK);poly([P3(x+w*.6,y+h,50),P3(x+w,y+h,50),B],'#b88820',INK);poly([P3(x+w*.6,y+h,50),B,A],'#a07818',INK);poly([P3(x+w,y+h,50),P3(x+w,y,50),B],'#906a14',INK);}
function drawNNG(b){const{x,y,w,h}=b;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x+26,y+26,w-52,h-52,0,36,'#2e3e46',INK,'#222');for(let u=30;u<w-26;u+=12){ln3(P3(x+u,y+h-26,0),P3(x+u,y+h-26,36),'#1a2228');ln3(P3(x+w-26,y+u,0),P3(x+w-26,y+u,36),'#1a2228');}
  for(let i=0;i<4;i++){ibox(x+10+i*(w-30)/3,y+h-14,6,6,0,40,'#141416');ibox(x+w-14,y+10+i*(h-30)/3,6,6,0,40,'#141416');}ibox(x,y,w,h,40,48,'#141416',INK,'#1c1c1e');}
function drawAnh(b){const{x,y,w,h}=b,c='#8a4430';faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,100,c,INK,'#6a3020');for(let z=8;z<100;z+=8)ln3(P3(x,y+h,z),P3(x+w,y+h,z),'rgba(0,0,0,.18)');
  const m=x+w/2,ap=[P3(m-32,y+h,0)];for(let i=0;i<=10;i++){const a=Math.PI-i/10*Math.PI;ap.push(P3(m+Math.cos(a)*32,y+h,60+Math.sin(a)*32));}ap.push(P3(m+32,y+h,0));poly(ap,'#0b0806');
  ibox(x+w*.3,y,w*.4,h,100,124,c,INK,'#6a3020');poly([P3(x+w*.3,y+h,124),P3(x+w*.7,y+h,124),P3(m,y+h,146)],c,INK);for(const u of [.1,.82])faceS(x+w*u,y,14,h,30,70,'#0b0806');}
function anhalter(cx,cy){const w=180,h=24,b={x:cx-w/2,y:cy-h/2,w,h,H:146,top:146,R0:0,lights:[],draw:drawAnh};blds.push(b);bShadow({...b,H:100});walls.push({x:b.x,y:b.y,w:58,h},{x:b.x+w-58,y:b.y,w:58,h});
  reserved.push({x:b.x-30,y:b.y-30,w:w+60,h:h+60});marks.push({x:cx,y:cy,n:'Anhalter Bahnhof'});}
/* ---- after lots and street fronts: neon signs on the towers of the Potsdamer Platz core, neon poles along its roads ---- */
const NTXT=['BASS','CLUB','24H','KLINIK','TECHNO','KIOSK','SUB','NEON','RAVE'];
function neonPole(x,y){const col=pick([MCY,MMG,MAM]),c=cnv(44,124),t=c.getContext('2d');t.fillStyle='#24202a';t.fillRect(20,30,4,94);t.fillStyle='#0c0a10';t.fillRect(2,2,40,30);t.strokeStyle=col;t.lineWidth=2;t.strokeRect(3,3,38,28);
  if(Math.random()<.4){t.fillStyle=col;const B=[[2,0],[5,0],[6,9],[10,9],[11,0],[14,0],[13,13],[16,20],[15,25],[12,23],[11,28],[7,28],[5,23],[1,25],[0,20],[3,13]];t.beginPath();B.forEach((q,i)=>{const px=14+q[0]*.95,py=30-q[1]*.92;i?t.lineTo(px,py):t.moveTo(px,py);});t.fill();}
  else{t.fillStyle=col;t.font='800 11px sans-serif';t.textAlign='center';t.fillText(pick(NTXT),22,21);}
  blds.push({x:x-22,y,w:44,h:0,top:122,spr:c,sc:1.2,lights:[{x,y,z:130,r:60}]});neons.push({x,y,z:135,c:col,s:46});walls.push({x:x-4,y:y-4,w:8,h:6});}
function mNeon(){const Z=ppZone(),fw=(b,u)=>b.rot?obW(b,u-b.w/2,b.h/2):[b.x+u,b.y+b.h];
  for(const b of blds){if(!b.spr||!b.wc||b.draw||b.h<=0||!inPoly(Z,b.x+b.w/2,b.y+b.h/2))continue;const t=b.spr.getContext('2d'),n=1+(b.w>120);
    for(let k=0;k<n;k++){const col=pick([MCY,MMG,MAM]),u=Math.round(R(10,b.w-26)),sh=Math.min(b.H*.55,R(60,110)),y0=b.h+R(14,Math.max(15,b.H-sh-30)),txt=pick(NTXT);
      t.fillStyle='rgba(8,6,12,.9)';t.fillRect(u,y0,16,sh);t.strokeStyle=col;t.lineWidth=1.5;t.strokeRect(u+1,y0+1,14,sh-2);t.fillStyle=col;t.font='800 10px sans-serif';t.textAlign='center';[...txt].forEach((ch,i)=>{if(10+i*11<sh)t.fillText(ch,u+8,y0+12+i*11);});
      const[px,py]=fw(b,u+8),z=b.h+b.H-(y0+sh/2);neons.push({x:px,y:py,z,c:col,s:42});b.lights.push({x:px,y:py,z,r:55});}}
  for(let i=0,n=0;i<300&&n<14;i++){const q=roadPt(),sd=pick([-1,1]),x=q.x+q.nx*64*sd,y=q.y+q.ny*64*sd;if(!inPoly(Z,x,y)||inWall(x,y,26)||resHit(x-22,y-130,44,134,1)||Math.hypot(x-SX,y-SY)<120||neons.some(o=>o.z===135&&Math.hypot(o.x-x,o.y-y)<180))continue;neonPole(x,y);n++;}}
