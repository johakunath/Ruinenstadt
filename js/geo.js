/* ================= geo: roads as segments, geographic districts =================
   ROADS holds every road as straight segments {ax,ay,bx,by,len,ux,uy,n}. Grid districts build it from RX/RY, geographic ones (D.geo) from their map data.
   Geographic map: water (lake polygon, rivers as polylines), roads only on land (a road over water is a bridge), zones pick lot types. Mockup: mockups/v040-koepenick-geo.html */
let ROADS=[];
function seg(ax,ay,bx,by,n){const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy);if(len>1)ROADS.push({ax,ay,bx,by,len,ux:dx/len,uy:dy/len,n});}
const segD=(s,x,y)=>{const t=clamp((x-s.ax)*s.ux+(y-s.ay)*s.uy,0,s.len);return Math.hypot(x-s.ax-s.ux*t,y-s.ay-s.uy*t);};
function roadD(x,y){let m=1e9;for(const s of ROADS){const d=segD(s,x,y);if(d<m)m=d;}return m;}
const onRoad=(x,y,m)=>roadD(x,y)<55+m;
// random point on a road: centre x,y, direction ux,uy, normal nx,ny, v: runs more along world y. skip(s) excludes segments
function roadPt(skip){let L=0;const A=skip?ROADS.filter(s=>!skip(s)):ROADS;for(const s of A)L+=s.len;let r=Math.random()*L;
  for(const s of A)if((r-=s.len)<=0){const t=R(0,s.len);return{x:s.ax+s.ux*t,y:s.ay+s.uy*t,ux:s.ux,uy:s.uy,nx:-s.uy,ny:s.ux,v:Math.abs(s.uy)>Math.abs(s.ux),s};}return{x:SX,y:SY,ux:1,uy:0,nx:0,ny:1,v:false};}
function roadsFromGrid(){ROADS=[];for(const p of RX)seg(p,0,p,WS);for(const p of RY)seg(0,p,WS,p,p===1480?'tram':0);}
const inPoly=(P_,x,y)=>{let c=false;for(let i=0,j=P_.length-1;i<P_.length;j=i++){const a=P_[i],b=P_[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;};
const lineD=(L,x,y)=>{let m=1e9;for(let i=1;i<L.length;i++){const ax=L[i-1][0],ay=L[i-1][1],dx=L[i][0]-ax,dy=L[i][1]-ay,l2=dx*dx+dy*dy,t=clamp(((x-ax)*dx+(y-ay)*dy)/l2,0,1);m=Math.min(m,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return m;};
const isWater=(x,y)=>{const K=D.geo;if(K.land.some(p=>inPoly(p,x,y)))return false;return K.lake&&inPoly(K.lake,x,y)||K.rivers.some(r=>lineD(r.p,x,y)<r.w/2);};
/* ---- Köpenick (v0.40). World 3600. Altstadt in the corner east of the Dahme and south of the Spree, Schlossinsel a small peninsula south of it ---- */
const Z_HOUSE={lots:{houses:3,hinterhof:2,market:1,reihen:1},fringe:'houses'};
const KOEP={ws:3600,start:[1100,1231],
 lake:[[2700,250],[3100,120],[3600,150],[3600,2150],[3250,2180],[2900,1980],[2660,1620],[2570,1250],[2610,800]],
 rivers:[{n:'Spree',w:150,p:[[2620,1040],[2250,1180],[1900,1330],[1600,1440],[1400,1500],[1100,1420],[750,1300],[350,1260],[0,1300]]},
  {n:'Dahme',w:140,p:[[1700,3600],[1670,3100],[1600,2600],[1520,2250],[1470,1950],[1450,1750],[1420,1520]]}],
 land:[[[1560,1840],[1640,1880],[1600,2060],[1530,2080],[1510,1960]]],
 roads:{'Bahnhofstraße':[[1640,1650],[1600,1520],[1550,1380],[1480,1000],[1420,500],[1400,0]],
  'Lindenstraße':[[1550,1380],[1250,1300],[900,1140],[500,900]],'An der Wuhlheide':[[500,900],[0,700]],
  'Müggelheimer Straße':[[1180,1760],[1460,1760],[1660,1680],[1880,1740],[2200,2060],[2700,2360],[3200,2500],[3600,2580]],
  'Oberspreestraße':[[1180,1760],[800,1810],[400,1860],[0,1900]],'Grünauer Straße':[[1180,1760],[1200,2000],[1250,2300],[1350,2900],[1400,3600]],
  'Wendenschloßstraße':[[1880,1740],[1800,2100],[1780,2400],[1800,3000],[1850,3600]],'Fürstenwalder Damm':[[1480,1000],[1800,850],[2250,700],[2460,480],[2520,0]],
  'Stubenrauchstraße':[[420,1860],[460,1270],[500,900]]},
 bridges:[[1590,1455,'Dammbrücke'],[1455,1760,'Lange Brücke'],[460,1285,'Stubenrauchbrücke']],
 zones:[['Wuhlheide',[[0,0],[1150,0],[1050,520],[600,680],[0,520]],{lots:{forest:4,park:1},fringe:'forest'}],
  ['Stadtforst',[[1950,2420],[2700,2520],[3600,2720],[3600,3600],[1960,3600]],{lots:{forest:5,park:1},fringe:'forest'}],
  ['Kleingärten',[[0,2000],[1050,2000],[1180,2800],[0,3000]],{lots:{kleingarten:4,efh:2,park:1},fringe:'efh'}],
  ['Allende-Viertel',[[1860,1950],[2450,2200],[2380,2450],[1860,2380]],{lots:{plattenbau:4,parking:1,park:1},fringe:'plattenbau'}],
  ['Oberschöneweide',[[0,780],[860,1180],[1000,1340],[0,1220]],{lots:{ruins:2,construction:2,parking:1,hinterhof:1},fringe:'ruins'}],
  ['Altstadt',[[1560,1560],[1750,1500],[1950,1450],[2030,1620],[1940,1820],[1740,1900],[1600,1860],[1550,1700]],{lots:{houses:3,hinterhof:2,market:2},fringe:'houses'}],
  ['Schlossinsel',[[1560,1840],[1640,1880],[1600,2060],[1530,2080],[1510,1960]],{lots:{park:1},fringe:'park'}],
  ['Friedrichshagen',[[2000,0],[2580,0],[2560,380],[2150,520]],{lots:{houses:3,hinterhof:2,market:1},fringe:'houses'}],
  ['Bahnhofsviertel',[[1460,600],[2200,560],[2350,980],[1430,1160]],Z_HOUSE],
  ['Wald',[[0,3050],[1250,2900],[1300,3600],[0,3600]],{lots:{forest:4,kleingarten:1},fringe:'forest'}]],
 other:{lots:{houses:3,efh:2,reihen:1,park:1,ruins:1,kleingarten:1},fringe:'houses'},
 marks:[[3120,1100,'Müggelsee'],[700,1340,'Spree'],[1560,2700,'Dahme']],
 lm:()=>{legacy(lmRathaus,1050,1230);reserved.push({x:1590,y:1420,w:520,h:360});const p=station('U','Köpenick',1452,760,1);if(p){SX=p[0];SY=p[1]+60;}}};// Rathausplatz stays open, start at S-Bahnhof Köpenick
DIST[0].geo=KOEP;
/* ---- Xhain = Friedrichshain-Kreuzberg (v0.42, north bank v0.43). World 3600. Kreuzberg south of the Spree with the Landwehrkanal and its bridges, the Friedrichshain bank north of it:
   Ostbahnhof on the Stadtbahn viaduct (start), Stralauer Platz and Mediaspree with modern towers, Berghain, East Side Gallery along the Mühlenstraße.
   Hochbahn U1 over Gitschiner and Skalitzer Straße onto the Oberbaumbrücke. Stations (S/U) mark the later fast-travel network. Mockups: mockups/v042-kreuzberg-geo.html, mockups/v043-xhain-geo.html ---- */
const XHAIN={ws:4000,start:[3756,700],land:[],
 rivers:[{n:'Spree',w:220,p:[[4000,2194],[3667,1898],[3278,1592],[2889,1333],[2500,1083],[2167,870],[1889,667],[1611,278],[1389,0]]},
  {n:'Landwehrkanal',w:90,p:[[3833,2056],[3556,2297],[3111,2472],[2556,2564],[2111,2481],[1667,2380],[1222,2269],[778,2241],[333,2287],[0,2314]]}],
 rail:[[1389,467],[2111,456],[2778,522],[3333,556],[4000,600]],// Stadtbahn viaduct
 roads:{'Warschauer Straße':[[3833,0],[3756,556],[3722,1083],[3463,1420]],'Oberbaumbrücke':[[3463,1420],[3092,1764]],
  'Skalitzer Straße':[[3092,1764],[2667,1852],[2222,1926]],'Gitschiner Straße':[[2222,1926],[1667,2037],[1111,2111],[889,2120],[0,2148]],
  'Oranienstraße':[[1500,1592],[2000,1630],[2500,1667],[2889,1807]],'Adalbertstraße':[[2167,972],[2200,1408],[2222,1926]],
  'Kottbusser Damm':[[2222,1926],[2389,2241],[2556,2564],[2722,3074],[2833,4000]],'Köpenicker Straße':[[1222,972],[2167,972],[2500,1314]],'Schillingbrücke':[[2500,1314],[2722,1148],[2911,972]],
  'Straße der Pariser Kommune':[[2911,972],[2756,556],[2689,0]],'Mühlenstraße':[[2111,522],[2500,800],[2889,1056],[3278,1311],[3463,1420]],'Andreasstraße':[[2111,522],[2222,0]],
  'Prinzenstraße':[[1500,444],[1500,1592],[1556,2056],[1611,2380],[1667,2926]],'Leipziger Straße':[[0,333],[1333,367]],
  'Friedrichstraße':[[889,2120],[944,1592],[1000,667],[1056,0]],'Mehringdamm':[[889,2120],[911,2519],[889,2908],[867,3444],[889,4000]],
  'Yorckstraße':[[0,2842],[889,2908]],'Gneisenaustraße':[[889,2908],[1444,2917],[2000,2953],[2711,3037]],'Bergmannstraße':[[867,3306],[1444,3314],[2056,3306]],
  'Columbiadamm':[[889,3722],[1778,3741],[2778,3676]],'Wiener Straße':[[2722,1841],[2889,2222],[3111,2472],[3333,2778],[4000,3000]],
  'Schlesische Straße':[[3092,1764],[3333,2022],[3611,2244],[3833,2444],[4000,2556]]},
 bridges:[[3278,1592,'Oberbaumbrücke'],[2711,1186,'Schillingbrücke'],[2544,2556,'Kottbusser Brücke'],[894,2241,'Hallesches Tor'],[1589,2361,'Baerwaldbrücke'],[3111,2472,'Lohmühlenbrücke'],[3611,2247,'Schlesische Brücke']],
 obf:[3067,540],bh:[3178,211],
 stations:[['U','Görlitzer Bahnhof',2722,1847],['U','Schlesisches Tor',3092,1764],['U','Kottbusser Tor',2222,1926],['U','Prinzenstraße',1556,2056],['U','Hallesches Tor',889,2120],['U','Moritzplatz',1500,1592],
  ['U','Mehringdamm',889,2908],['U','Gneisenaustraße',1444,2917],['U','Südstern',2000,2953],['U','Schönleinstraße',2444,2453],['U','Hermannplatz',2711,3037],['U','Warschauer Straße',3756,622,1]],
 zones:[['Stralauer Platz',[[2756,622],[3289,622],[3311,1278],[2889,1067],[2744,889]],{lots:{hochhaus:3,buero:1},fringe:'hochhaus'}],
  ['Mediaspree',[[3322,622],[3733,622],[3700,1111],[3500,1389],[3322,1278]],{lots:{buero:3,hochhaus:1},fringe:'buero'}],
  ['Wriezener Bahnhof',[[2722,0],[3778,0],[3778,500],[2722,500]],{lots:{ruins:2,construction:2,parking:1},fringe:'ruins'}],
  ['Andreasviertel',[[1444,0],[2644,0],[2722,622],[2333,711],[1944,622],[1611,222]],{lots:{plattenbau:3,parking:1,park:1},fringe:'plattenbau'}],
  ['Boxhagen',[[3800,0],[4000,0],[4000,667],[3800,667]],{lots:{houses:3,hinterhof:2},fringe:'houses'}],
  ['Osthafen',[[3733,667],[4000,667],[4000,2056],[3556,1611],[3700,1111]],{lots:{ruins:2,construction:2,parking:1},fringe:'ruins'}],
  ['Heinrich-Heine-Viertel',[[0,0],[1389,0],[1611,278],[1778,667],[0,667]],{lots:{plattenbau:3,parking:1,hinterhof:1},fringe:'plattenbau'}],
  ['Kotti',[[1978,1731],[2389,1731],[2444,2056],[2000,2056]],{lots:{plattenbau:3,market:1,parking:1},fringe:'plattenbau'}],
  ['Mauerstreifen',[[0,667],[1944,667],[2111,852],[1222,926],[0,908]],{lots:{ruins:3,construction:1,parking:1},fringe:'ruins'}],
  ['Wrangelkiez',[[3167,1733],[3333,1644],[3722,1956],[3889,2167],[3833,2389],[3611,2222],[3344,2011]],{lots:{houses:2,hinterhof:3,market:1},fringe:'houses'}],
  ['Görlitzer Park',[[2844,1911],[3089,1822],[3322,2044],[3600,2267],[3500,2344],[3133,2433],[2933,2211]],{lots:{park:3,ruins:1},fringe:'park'}],
  ['SO36',[[2222,1478],[2944,1522],[3000,1759],[2389,1731]],{lots:{houses:3,hinterhof:3,market:1},fringe:'houses'}],
  ['Mariannenplatz',[[2211,1089],[2578,1156],[2844,1467],[2211,1467]],{lots:{park:2,houses:1,hinterhof:1},fringe:'houses'}],
  ['Mehringplatz',[[622,1822],[1178,1822],[1178,2078],[622,2078]],{lots:{plattenbau:3,parking:1},fringe:'plattenbau'}],
  ['Gleisdreieck',[[0,2380],[778,2352],[800,2778],[0,2797]],{lots:{park:2,ruins:2,construction:1},fringe:'park'}],
  ['Viktoriapark',[[111,2981],[811,2972],[800,3630],[111,3630]],{lots:{park:3,forest:2},fringe:'forest'}],
  ['Bergmannkiez',[[956,2981],[2000,3000],[2000,3658],[956,3658]],{lots:{houses:3,hinterhof:2,market:2},fringe:'houses'}],
  ['Graefekiez',[[1722,2472],[2444,2611],[2644,2963],[1733,2908]],{lots:{houses:3,hinterhof:2,market:1},fringe:'houses'}],
  ['Hasenheide',[[2089,3056],[2689,3092],[2744,3648],[2089,3648]],{lots:{forest:3,park:2},fringe:'forest'}],
  ['Friedhöfe',[[0,3686],[2778,3741],[2800,4000],[0,4000]],{lots:{forest:2,park:2},fringe:'forest'}],
  ['Treptower Park',[[3667,2500],[4000,2333],[4000,3000],[3722,2778]],{lots:{forest:3,park:2},fringe:'forest'}],
  ['Kreuzkölln',[[2800,2658],[3500,2426],[4000,2936],[4000,4000],[2889,4000]],{lots:{houses:3,hinterhof:2,ruins:1},fringe:'houses'}]],
 other:{lots:{houses:3,hinterhof:3,ruins:1,market:1,construction:1},fringe:'houses'},
 marks:[[2278,944,'Spree'],[1278,2278,'Landwehrkanal'],[1889,444,'Stadtbahn']],
 lm:()=>{const K=XHAIN,HB=['Gitschiner Straße','Skalitzer Straße','Oberbaumbrücke','Warschauer Straße'];ostbahnhof(...K.obf);berghain(...K.bh);esg();
  viaduct(segsOf(K.rail),{c:['#7a3a26','#5a2a1a','#4a2216'],pc:'#6b3626',pcap:'#4a2216',ps:22,z0:46,z1:60,d:40,step:72,tc:'#a83228',skip:(x,y)=>Math.hypot(x-K.obf[0],y-K.obf[1])<230,free:(x,y)=>roadD(x,y)<72});
  const o=oberbaum(),Rd=K.roads,sh=p=>[p[0]+o[0],p[1]+o[1]],W=Rd['Warschauer Straße'];// Hochbahn: Gitschiner and Skalitzer, then the last stretch swings sideways onto the arcade; north side the same from Warschauer Straße
  for(const P_ of [[sh(Rd['Skalitzer Straße'][0]),...Rd['Skalitzer Straße'].slice(1),...Rd['Gitschiner Straße'].slice(1)],[W[1],W[2],sh(W[3])]])
    viaduct(segsOf(P_),{c:['#3f6a4a','#2c4a34','#223a2a'],pc:'#3f6a4a',pcap:'#2c4a34',ps:14,z0:62,z1:74,d:30,step:120,tc:'#d8b830',skip:(x,y)=>lineD(K.rail,x,y)<50,free:(x,y)=>ROADS.some(o=>!HB.includes(o.n)&&segD(o,x,y)<70)});for(const s of K.stations){const p=station(...s);if(s[4]&&p){SX=p[0];SY=p[1]+60;}}}};
DIST[1].geo=XHAIN;
/* ---- Xhain landmarks: custom-drawn iso boxes (b.draw runs inside withRot, so P3 follows b.rot) ---- */
const ln3=(a,b,c)=>{ctx.strokeStyle=c;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
const segsOf=P_=>{const A=[];for(let i=1;i<P_.length;i++){const ax=P_[i-1][0],ay=P_[i-1][1],dx=P_[i][0]-ax,dy=P_[i][1]-ay,len=Math.hypot(dx,dy);A.push({ax,ay,len,ux:dx/len,uy:dy/len});}return A;};
function drawPillar(b){const{x,y,w,h,H}=b;faceT(x+4,y+3,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,H-6,b.c,INK);ibox(x-3,y-3,w+6,h+6,H-6,H,b.cap,INK);
  for(let z=10;z<H-8;z+=12)ln3(P3(x,y+h,z),P3(x+w,y+h,z),'rgba(0,0,0,.25)');}
// deck span: slab z0..z1 in colours cs, gravel top with two rails along the long axis (lx: along local x). train: wrecked car on top in colour tc
function drawDeck(b){const{x,y,w,h,z0,z1}=b,C=b.cs;ibox(x,y,w,h,z0,z1,C[0],INK,'#3a3630');faceS(x,y,w,h,z0+3,z0+5,C[1]);faceE(x,y,w,h,z0+3,z0+5,C[2]);
  for(const f of [.32,.68])b.lx?ln3(P3(x,y+h*f,z1),P3(x+w,y+h*f,z1),'#8a8276'):ln3(P3(x+w*f,y,z1),P3(x+w*f,y+h,z1),'#8a8276');
  if(!b.train)return;const t=z1+24;if(b.lx)ibox(x+2,y+5,w-4,h-10,z1+2,t,b.tc,INK);else ibox(x+5,y+2,w-10,h-4,z1+2,t,b.tc,INK);
  const gl='#1a2024';if(b.lx)faceS(x+6,y+5,w-12,h-10,t-13,t-5,gl);else faceE(x+5,y+6,w-10,h-12,t-13,t-5,gl);
  if(b.lx)faceS(x+2,y+5,w-4,h-10,z1+4,z1+7,'#3a3a36');else faceE(x+5,y+2,w-10,h-4,z1+4,z1+7,'#2a2a26');
  ctx.fillStyle='rgba(110,55,25,.3)';for(const r of b.rust){const p=P3(x+w*r[0],y+h*r[1],t);ctx.beginPath();ctx.ellipse(p[0],p[1],5,2.5,0,0,7);ctx.fill();}}
// viaduct along segments S: deck spans of about o.step, pillars at the joints (collision, cover). No pillars over water, where o.free(x,y) (crossing roads) or o.skip(x,y). Wrecked trains run 3 spans long
function viaduct(S,o){const pil=[],g=gx;let tr=0;
  for(const s of S){const rot=rotN(Math.atan2(s.uy,s.ux)),hz=Math.abs(s.ux)>=Math.abs(s.uy),n=Math.max(1,Math.round(s.len/o.step)),L=s.len/n;
    for(let i=0;i<n;i++){const t=(i+.5)*L,cx=s.ax+s.ux*t,cy=s.ay+s.uy*t;if(o.skip(cx,cy))continue;const l=L+2,w=hz?l:o.d,h=hz?o.d:l;if(tr<=0&&Math.random()<.05)tr=3;const train=tr-->0;
      blds.push({x:cx-w/2,y:cy-h/2,w,h,H:o.z1+(train?24:0),top:o.z1+(train?24:0),R0:0,z0:o.z0,z1:o.z1,lx:hz,rot,train,cs:o.c,tc:o.tc,rust:Array.from({length:4},()=>[R(.1,.9),R(.2,.8)]),lights:[],draw:drawDeck});
      g.save();g.translate(cx,cy);g.rotate(Math.atan2(s.uy,s.ux));g.fillStyle='rgba(0,0,0,.22)';g.fillRect(-l/2,-o.d*.4,l,o.d*1.1);g.restore();}
    for(let i=0;i<=n;i++){const px=s.ax+s.ux*i*L,py=s.ay+s.uy*i*L;if(isWater(px,py)||o.skip(px,py)||o.free(px,py)||pil.some(p=>Math.hypot(p[0]-px,p[1]-py)<o.step*.5))continue;pil.push([px,py]);
      blds.push({x:px-o.ps/2,y:py-o.ps/2,w:o.ps,h:o.ps,H:o.z0,top:o.z0,R0:0,c:o.pc,cap:o.pcap,lights:[],draw:drawPillar});walls.push({x:px-o.ps/2-1,y:py-o.ps/2-1,w:o.ps+2,h:o.ps+2});}}}
// Oberbaumbrücke (after photos and de.wikipedia): seven brick vaults (7.5, 16, 19, 22, 19, 16, 7.5 m), on one side a brick arcade (cloister walk) carrying the U1 on top,
// small crenellated turrets on the piers and two tall towers with a battlement gallery and copper spires flanking the middle vault. Arcade sits on the far side so it never hides the road
const OBV=[7.5,16,19,22,19,16,7.5];
function drawArcade(b){const{x,y,w,h}=b,Hd=b.hd,c='#8a4430',m='#7a3a26';
  const tur=yy=>{for(const u of b.piers){const tx=x+u-11;ibox(tx,yy,22,22,0,Hd+20,c,INK);for(let i=0;i<3;i++){ibox(tx+i*8.5,yy,5,5,Hd+20,Hd+27,m,INK);ibox(tx+i*8.5,yy+17,5,5,Hd+20,Hd+27,m,INK);}}};
  tur(y-14);faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,Hd,c,INK,'#4a3a30');
  for(let z=8;z<Hd;z+=8)ln3(P3(x,y+h,z),P3(x+w,y+h,z),'rgba(0,0,0,.14)');
  for(let u=8;u<w-22;u+=28)poly([P3(x+u,y+h,4),P3(x+u,y+h,30),P3(x+u+9,y+h,42),P3(x+u+18,y+h,30),P3(x+u+18,y+h,4)],'#1a0f0a');
  for(const f of [.35,.65])ln3(P3(x,y+h*f,Hd),P3(x+w,y+h*f,Hd),'#8a8276');
  for(let u=0;u<w;u+=14)ibox(x+u,y,7,5,Hd,Hd+7,m,INK);for(let u=0;u<w;u+=14)ibox(x+u,y+h-5,7,5,Hd,Hd+7,m,INK);
  if(b.train)ibox(x+w*.15,y+h*.25,w*.3,h*.5,Hd+1,Hd+24,'#d8b830',INK);
  for(const u of b.tw){const S=44,tx=x+u-S/2,ty=y+h/2-S/2,H1=125;ibox(tx,ty,S,S,0,H1,c,INK);for(let z=8;z<H1;z+=8){ln3(P3(tx,ty+S,z),P3(tx+S,ty+S,z),'rgba(0,0,0,.14)');ln3(P3(tx+S,ty+S,z),P3(tx+S,ty,z),'rgba(0,0,0,.18)');}
    for(const z of [Hd+12,Hd+40]){faceS(tx+S*.38,ty,S*.24,S,z,z+18,'#110b08');faceE(tx,ty+S*.38,S,S*.24,z,z+18,'#110b08');}
    ibox(tx-6,ty-6,S+12,S+12,H1,H1+14,m,INK);for(let i=0;i<5;i++){ibox(tx-6+i*13,ty-6,6,6,H1+14,H1+22,m,INK);ibox(tx-6,ty-6+i*13,6,6,H1+14,H1+22,m,INK);ibox(tx-6+i*13,ty+S,6,6,H1+14,H1+22,m,INK);ibox(tx+S,ty-6+i*13,6,6,H1+14,H1+22,m,INK);}
    const z0=H1+14,z1=z0+24,i0=8;ibox(tx+i0,ty+i0,S-2*i0,S-2*i0,z0,z1,c,INK);faceS(tx+S/2-4,ty+i0,8,S-2*i0,z0+10,z1-6,'#110b08');
    const ax=tx+S/2,ay=ty+S/2,A=P3(ax,ay,z1+52),q=(a,b2)=>P3(a,b2,z1);poly([q(tx+i0-3,ty+S-i0+3),q(tx+S-i0+3,ty+S-i0+3),A],'#4a6a58',INK);poly([q(tx+S-i0+3,ty+S-i0+3),q(tx+S-i0+3,ty+i0-3),A],'#34503f',INK);
    ctx.fillStyle='#c8a040';ctx.beginPath();ctx.arc(A[0],A[1]-3,2.5,0,7);ctx.fill();}
  tur(y+h-8);}
function oberbaum(){const s=ROADS.find(q=>q.n==='Oberbaumbrücke'),g=gx,a=Math.atan2(s.uy,s.ux);let u0=-1,u1=-1;for(let t=0;t<=s.len;t+=6)if(isWater(s.ax+s.ux*t,s.ay+s.uy*t)){if(u0<0)u0=t;u1=t;}if(u0<0)return[0,0];u0-=20;u1+=20;
  const L=u1-u0,tot=OBV.reduce((p,q)=>p+q,0),pier=[];let acc=0;for(let i=0;i<OBV.length-1;i++){acc+=OBV[i];pier.push(u0+L*acc/tot);}
  g.save();g.translate(s.ax,s.ay);g.rotate(a);for(const sd of [-1,1]){const v0=sd<0?-68:43;g.fillStyle='#6b3626';g.fillRect(u0,v0,L,25);bricks(g,u0,v0,L,25,5);g.fillStyle='#4a2216';g.fillRect(u0,sd<0?v0:v0+21,L,4);
    let p0=u0;for(const p1 of [...pier,u1]){g.fillStyle='rgba(8,5,4,.55)';g.beginPath();g.ellipse((p0+p1)/2,sd*(sd>0?70:70),(p1-p0)/2-6,10+(p1-p0)*.06,0,sd<0?Math.PI:0,sd<0?0:Math.PI);g.fill();p0=p1;}}g.restore();
  const rot=rotN(a),ly=[-Math.sin(rot),Math.cos(rot)],sv=(-s.uy*ly[0]+s.ux*ly[1])>0?-1:1,v=sv*80,um=s.len/2,cx=s.ax+s.ux*um-s.uy*v,cy=s.ay+s.uy*um+s.ux*v,w=s.len,h=46;
  const lx=u=>w/2+(u-um),b={x:cx-w/2,y:cy-h/2,w,h,hd:60,H:220,top:220,R0:0,rot,piers:pier.filter((_,i)=>i!==2&&i!==3).map(lx).concat([12,w-12]),tw:[lx(pier[2]),lx(pier[3])],train:Math.random()<.5,lights:[],draw:drawArcade};
  blds.push(b);bShadow({...b,H:110});const ow=obWall(b);walls.push(ow);reserved.push({x:ow.x,y:ow.y,w:ow.w,h:ow.h});return[-s.uy*v,s.ux*v];}
// Ostbahnhof: long station hall along the viaduct with tall windows and a glass barrel roof (hb: wall height, H: ridge for sorting). Closed, no power
function drawOstbf(b){const{x,y,w,h}=b,H=b.hb,Rf=26,N=8;faceT(x+8,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,H,'#8a8f96',INK);
  for(let u=10;u<w-20;u+=26)if(Math.abs(u-w/2)>24)faceS(x+u,y,12,h,16,H-10,b.lw[Math.floor(u/26)]?'#c88a3a':'#1a2024');
  for(let v=12;v<h-12;v+=24)faceE(x,y+v,w,12,16,H-10,'#1a2024');faceS(x+w/2-18,y,36,h,0,30,'#0b0806');faceS(x+w/2-18,y,36,h,30,34,'#3a3e44');
  for(let k=0;k<N;k++){const f0=k/N,f1=(k+1)/N,z0=H+Rf*Math.sin(Math.PI*f0),z1=H+Rf*Math.sin(Math.PI*f1);poly([P3(x,y+h*f0,z0),P3(x+w,y+h*f0,z0),P3(x+w,y+h*f1,z1),P3(x,y+h*f1,z1)],k<N/2?'#6a8496':'#9ab4c4',INK);}
  ctx.strokeStyle='#3a4a54';ctx.lineWidth=1;for(let u=0;u<=w;u+=40){ctx.beginPath();for(let k=0;k<=N;k++){const p=P3(x+u,y+h*k/N,H+Rf*Math.sin(Math.PI*k/N));k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  const gp=[];for(let k=0;k<=N;k++)gp.push(P3(x+w,y+h*k/N,H+Rf*Math.sin(Math.PI*k/N)));poly(gp,'#5a7080',INK);
}
function ostbahnhof(cx,cy){const s=segsOf(XHAIN.rail)[2],rot=rotN(Math.atan2(s.uy,s.ux)),w=400,h=100,b={x:cx-w/2,y:cy-h/2,w,h,hb:72,H:98,top:98,R0:0,rot,lw:Array.from({length:16},()=>Math.random()<.05),lights:[],draw:drawOstbf};
  const dx=cx-Math.sin(rot)*(h/2+4),dy=cy+Math.cos(rot)*(h/2+4);
  blds.push(b);bShadow({...b,H:72});const ow=obWall(b);walls.push(ow);reserved.push({x:ow.x-20,y:ow.y-20,w:ow.w+40,h:ow.h+40});marks.push({x:cx,y:cy+20,n:'Ostbahnhof'});
  const g=gx;g.save();g.translate(dx,dy);g.rotate(rot);for(let i=0;i<9;i++){g.fillStyle=i%2?'#3a3632':'#45403a';g.fillRect(-60,i*9,120,9);}g.restore();}
// Berghain: concrete power station, low block with a tall middle hall, slit windows, red door light
function drawBerghain(b){const{x,y,w,h}=b,c='#7a7672';faceT(x+10,y+6,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,0,90,c,INK,'#4a4642');
  for(let i=0;i<9;i++)faceS(x+16+i*(w-32)/9,y,6,h,24,76,'#141210');for(let i=0;i<4;i++)faceE(x,y+16+i*(h-32)/4,w,6,24,76,'#141210');faceS(x+w*.72,y,16,h,0,22,'#0b0806');
  const hx=x+w*.25,hy=y+h*.15,hw=w*.42,hh=h*.6;ibox(hx,hy,hw,hh,90,190,'#86827e',INK,'#4e4a46');for(let i=0;i<5;i++)faceS(hx+10+i*(hw-20)/5,hy,5,hh,108,180,'#141210');for(let i=0;i<3;i++)faceE(hx,hy+8+i*(hh-16)/3,hw,5,108,180,'#141210');}
function berghain(x,y){const w=240,h=150,b={x,y,w,h,H:190,top:190,R0:0,lights:[{x:x+w*.72+8,y:y+h,z:24,r:55}],draw:drawBerghain};blds.push(b);bShadow({...b,H:90});walls.push({x,y,w,h});reserved.push({x:x-30,y:y-30,w:w+60,h:h+60});
  neons.push({x:x+w*.72+8,y:y+h,z:28,c:'#c23a2e',s:34});marks.push({x:x+w/2,y:y+h/2,n:'Berghain'});}
// East Side Gallery: painted wall pieces between Mühlenstraße and the Spree, murals on the river side (the visible south face)
function drawESG(b){const{x,y,w,h,H}=b;faceT(x+3,y+3,w,h,0,'rgba(0,0,0,.3)');ibox(x,y,w,h,0,H,'#d8d4cc',INK,'#b8b4ac');for(const m of b.mur)faceS(x+w*m[0],y,w*m[1],h,m[2],m[3],m[4]);faceS(x,y,w,h,0,H,0,INK);}
function esg(){const s0=ROADS.filter(s=>s.n==='Mühlenstraße');for(const s of s0){if(s.ax<2400)continue;const rot=rotN(Math.atan2(s.uy,s.ux)),nx=-s.uy,ny=s.ux;
  for(let t=20;t<s.len-140;t+=R(160,190)){const l=R(110,140),cx=s.ax+s.ux*(t+l/2)+nx*92,cy=s.ay+s.uy*(t+l/2)+ny*92;if(isWater(cx,cy))continue;
    const mur=Array.from({length:7},()=>{const f=R(0,.85);return[f,R(.08,.2),R(2,12),R(22,40),pick(['#d4537e','#7d9bff','#8fd16a','#f2d14b','#e8642e','#3a8aa8','#a050c0'])];});
    const b={x:cx-l/2,y:cy-4,w:l,h:8,H:44,top:44,R0:0,rot,mur,lights:[],draw:drawESG};blds.push(b);walls.push(obWall(b));}}
  const m=s0[2];marks.push({x:m.ax+m.ux*m.len/2-m.uy*95,y:m.ay+m.uy*m.len/2+m.ux*95,n:'East Side Gallery'});}
// S/U station entrance at a free spot next to the given point (off roads, water and walls). open: the one working station per map (start, later fast travel):
// lit sign on generator power, glow, name on the map. Closed stations: stairs boarded up, dead tilted sign, no label
// v0.52: entrance 1.6x bigger (playtest: too small) with a raised stone parapet on three sides (low boxes, open to the south where the stairs go down), sign scaled 1.35
function station(k,n,x0,y0,open){for(let r=0;r<=200;r+=25)for(let a=0;a<8;a++){const x=x0+Math.cos(a*.785)*r,y=y0+Math.sin(a*.785)*r;
    if(roadD(x,y)<100||isWater(x,y)||inWall(x,y,64)||ptRes(x,y)||x<80||y<80||x>WS-80||y>WS-80)continue;
    const g=gx,col=!open?'#2a3036':k==='S'?'#2a8a3a':'#1d4a8a';g.fillStyle='rgba(0,0,0,.4)';g.fillRect(x-40,y-24,80,50);g.fillStyle='#0b0806';g.fillRect(x-32,y-18,64,36);for(let i=0;i<9;i++){g.fillStyle=`rgba(90,80,70,${.15+i*.06})`;g.fillRect(x-32,y-18+i*4,64,2);}
    g.fillStyle='#5a5650';g.fillRect(x-35,y-21,70,4);g.fillRect(x-35,y-21,4,42);g.fillRect(x+31,y-21,4,42);g.fillStyle='#c8a428';g.fillRect(x-32,y+16,64,2);
    if(!open)for(let i=0;i<5;i++){g.save();g.translate(x,y-12+i*7);g.rotate(R(-.15,.15));g.fillStyle=pick(['#5a4028','#4a3424','#6a4a30']);g.fillRect(-36,-3,72,6);g.restore();}
    for(const q of [[x-37,y-23,74,5],[x-37,y-23,5,45],[x+32,y-23,5,45]])lowBox(q[0],q[1],q[2],q[3],14,'#6a665e','wall');
    const c=cnv(30,96),t=c.getContext('2d');if(!open){t.translate(15,60);t.rotate(R(-.25,.25));t.translate(-15,-60);}t.fillStyle='#3a3632';t.fillRect(13,24,4,72);t.fillStyle=col;t.fillRect(2,0,26,26);t.strokeStyle=open?'#ead9c0':'#4a4a48';t.lineWidth=2;t.strokeRect(3,1,24,24);
    t.fillStyle=open?'#fff':'#6a6a68';t.font='800 '+(k.length>1?11:18)+'px sans-serif';t.textAlign='center';t.fillText(k,15,k.length>1?17:20);if(!open){t.fillStyle='rgba(0,0,0,.4)';t.fillRect(2,14,26,12);}
    const sx=x+50;blds.push({x:sx-15,y,w:30,h:0,top:96,sc:1.35,spr:c,lights:open?[{x:sx,y,z:108,r:80}]:[]});if(open){neons.push({x:sx,y,z:112,c:k==='S'?'#5ad06a':'#4a8aff',s:52});marks.push({x,y:y-28,n:k+' '+n});}
    walls.push({x:x-32,y:y-18,w:64,h:36},{x:sx-3,y:y-3,w:6,h:5});reserved.push({x:x-90,y:y-80,w:190,h:170});return[x,y];}return null;}
/* ---- build: called by buildWorld for D.geo districts. Order: lot ground, water, roads, then lots are filled by buildWorld ---- */
const CS=240,GAP=50;// GAP: open ground between lots (v0.41: was 24, felt cramped with the bigger buildings)
function geoLayout(K){ROADS=[];for(const n in K.roads){const p=K.roads[n];for(let i=1;i<p.length;i++)seg(p[i-1][0],p[i-1][1],p[i][0],p[i][1],n);}
  const n=Math.ceil(WS/CS),cell=[];BLK=[];
  const zoneAt=(x,y)=>{for(const z of K.zones)if(inPoly(z[1],x,y))return z[2];return K.other;};
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){let w=0,r=0;for(let a=0;a<5;a++)for(let b=0;b<5;b++){const x=i*CS+20+a*50,y=j*CS+20+b*50;if(isWater(x,y))w++;else if(roadD(x,y)<80)r++;}
    cell[j*n+i]={i,j,water:w>12,clear:!w&&!r,z:zoneAt(i*CS+CS/2,j*CS+CS/2),used:false};}
  const C=(i,j)=>i<n&&j<n?cell[j*n+i]:null;
  for(const c of cell){if(c.used||c.water)continue;c.used=true;
    if(!c.clear){BLK.push({x0:c.i*CS,x1:(c.i+1)*CS,y0:c.j*CS,y1:(c.j+1)*CS,w:CS,h:CS,lot:c.z.fringe,fringe:1});continue;}
    let gw=1,gh=1;while(gw<3){const q=C(c.i+gw,c.j);if(!q||q.used||!q.clear||q.z!==c.z)break;gw++;}
    while(gh<3){let ok=true;for(let a=0;a<gw;a++){const q=C(c.i+a,c.j+gh);if(!q||q.used||!q.clear||q.z!==c.z)ok=false;}if(!ok)break;gh++;}
    for(let a=0;a<gw;a++)for(let b=0;b<gh;b++)C(c.i+a,c.j+b).used=true;
    const x0=c.i*CS+GAP/2,y0=c.j*CS+GAP/2,w=gw*CS-GAP,h=gh*CS-GAP;BLK.push({x0,x1:x0+w,y0,y1:y0+h,w,h,lot:wpick(c.z.lots)});}
  // keep buildings off roads and water: reserve squares along roads and the water rows (also used as water walls)
  for(const s of ROADS)for(let t=0;t<=s.len;t+=50)reserved.push({x:s.ax+s.ux*t-60,y:s.ay+s.uy*t-60,w:120,h:120,road:1});
  for(let y=0;y<WS;y+=40){let x0=-1;for(let x=0;x<=WS;x+=40){const wt=x<WS&&isWater(x+20,y+20)&&roadD(x+20,y+20)>=58;if(wt&&x0<0)x0=x;if(!wt&&x0>=0){walls.push({x:x0,y,w:x-x0,h:40,water:1});reserved.push({x:x0,y,w:x-x0,h:40});if(y%80===0)waters.push({x:x0,y,w:x-x0,h:40});x0=-1;}}}}
function geoWater(K){const g=gx;
  const path=(L,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();L.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();};
  const poly=(P_,c)=>{g.fillStyle=c;g.beginPath();P_.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();};
  if(K.lake){g.save();g.strokeStyle='#4a4038';g.lineWidth=16;g.beginPath();K.lake.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke();g.restore();poly(K.lake,'#1e3a44');}
  for(const r of K.rivers)path(r.p,r.w+14,'#4a4038');for(const r of K.rivers)path(r.p,r.w,'#1e3a44');
  for(const p of K.land)poly(p,D.ground);
  for(let i=0;i<2600;i++){const x=R(0,WS),y=R(0,WS);if(!isWater(x,y))continue;g.fillStyle=`rgba(170,205,215,${R(.06,.16)})`;g.fillRect(x,y,R(8,30),1.5);}
  // reeds on banks
  for(let i=0;i<500;i++){const x=R(0,WS),y=R(0,WS);if(isWater(x,y)||!isWater(x+R(-30,30),y+R(-30,30)))continue;g.strokeStyle=pick(['#4a5a2a','#5a6a30','#3b4a22']);g.lineWidth=1.5;for(let k=0;k<3;k++){g.beginPath();g.moveTo(x+k*2,y);g.lineTo(x+k*2+R(-2,2),y-R(8,14));g.stroke();}}}
function geoRoads(K,d){const g=gx;
  const stroke=(w,c,dash)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.setLineDash(dash||[]);for(const n in K.roads){const p=K.roads[n];g.beginPath();p.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();}g.setLineDash([]);};
  stroke(110,globalGroundPattern(g,'pavement')||'#3a2f27');stroke(86,globalGroundPattern(g,'asphalt')||d.road);stroke(3,'rgba(234,217,192,.09)',[24,30]);
  // bridges: railings where the road edge is over water, brick deck tint
  for(const s of ROADS)for(let t=0;t<s.len;t+=8){const cx=s.ax+s.ux*t,cy=s.ay+s.uy*t;if(!isWater(cx,cy))continue;g.fillStyle='rgba(107,54,38,.12)';g.fillRect(cx-40,cy-40,80,80);
    for(const sd of [-1,1]){const x=cx-s.uy*56*sd,y=cy+s.ux*56*sd;g.fillStyle='#2a221c';g.fillRect(x-3,y-3,6,6);if(t%32<8){g.fillStyle='#4a3a2e';g.fillRect(x-2,y-6,4,8);}}}
  for(let i=0;i<120;i++){const q=roadPt(),o=R(-40,40);g.fillStyle='rgba(8,5,4,.5)';g.beginPath();g.ellipse(q.x+q.nx*o,q.y+q.ny*o,R(6,16),R(4,10),R(0,3),0,7);g.fill();}
  // v0.57: only the main streets keep a name (K.main, else the 4 longest), bridges are labelled but no banner (br)
  {const len=n=>{const p=K.roads[n];let l=0;for(let i=1;i<p.length;i++)l+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return l;},mn=K.main||Object.keys(K.roads).filter(n=>!/^(tram|rail|hb)/.test(n)).sort((a,b)=>len(b)-len(a)).slice(0,4);
   for(const n of mn){const p=K.roads[n];if(!p)continue;const m=p[Math.floor(p.length/2)];marks.push({x:m[0],y:m[1],n,soft:1});}}
  for(const b of K.bridges)marks.push({x:b[0],y:b[1],n:b[2],br:1});for(const m of K.marks)marks.push({x:m[0],y:m[1],n:m[2],soft:1});
  // v0.57: only the 6 biggest quarters keep a name (map and arrival message)
  const ar=P_=>Math.abs(P_.reduce((a,q,i)=>{const r=P_[(i+1)%P_.length];return a+q[0]*r[1]-r[0]*q[1];},0)/2);
  for(const z of [...K.zones].sort((a,b)=>ar(b[1])-ar(a[1])).slice(0,6)){const P_=z[1],cx=P_.reduce((a,q)=>a+q[0],0)/P_.length,cy=P_.reduce((a,q)=>a+q[1],0)/P_.length;marks.push({x:cx,y:cy,n:z[0],soft:1});}}
// rotated building at centre cx,cy (rot in (-45°,45°]): free if footprint plus 30 margin is off water, roads, walls and reserved areas
const ptRes=(x,y)=>reserved.some(r=>!r.road&&x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h),rotN=a=>{while(a>Math.PI/4)a-=Math.PI/2;while(a<=-Math.PI/4)a+=Math.PI/2;return a;};
function tryBR(cx,cy,w,h,rot,H,st){const b0={x:cx-w/2,y:cy-h/2,w,h,rot};
  for(let a=0;a<=6;a++)for(let c=0;c<=4;c++){const[px,py]=obW(b0,(a/3-1)*(w/2+30),(c/2-1)*(h/2+30));if(px<10||py<10||px>WS-10||py>WS-10||isWater(px,py)||roadD(px,py)<44||inWall(px,py,4)||ptRes(px,py))return null;}
  const gb=st==='efh'?R(.55,.7)*h:st==='reihen'?R(.45,.55)*h:0,bb={x:b0.x,y:b0.y,w,h,H:Math.round(H*(st==='laube'?1.2:2)),top:H+gb*.5,R0:0,gable:gb,rot};
  makeB(bb,st);blds.push(bb);const ow=obWall(bb);walls.push(ow);reserved.push({x:ow.x,y:ow.y,w:ow.w,h:ow.h,road:1});return bb;}// road:1 = soft reserve, roadside props may ignore it (they check walls)
const bSpec=k=>k==='zucker'?['zucker',R(240,340),R(80,100),R(70,90)]:k==='hochhaus'?['hoch',R(110,150),R(90,120),R(130,170)]:k==='buero'?['buero',R(150,220),R(90,120),R(110,150)]:k==='efh'?['efh',R(80,100)*BSC,R(65,80)*BSC,44]:k==='reihen'?['reihen',4*58*BSC,R(70,85)*BSC,44]:k==='plattenbau'?['platte',R(240,420),R(64,90)*BSC,R(100,140)*BHS*.75]:k==='ruins'?['ruin',R(60,150)*BSC,R(30,60)*BSC,R(14,34)*BHS*.75]:[0,R(100,220)*BSC,R(50,105)*BSC,R(38,72)*BHS];
// street fronts: walk every road and line it with buildings turned to the road, picked from the zone's lot weights. Forest and park zones stay open.
// Urban fronts sometimes get a Hinterhaus behind them. A failed spot retries at 65% size, then moves on 40 units. Gap between fronts 50 to 110
function geoStreets(K){const zoneAt=(x,y)=>{for(const z of K.zones)if(inPoly(z[1],x,y))return z[2];return K.other;};
  for(const s of ROADS){const rot=rotN(Math.atan2(s.uy,s.ux)),hz=Math.abs(s.ux)>=Math.abs(s.uy);
   for(const sd of [-1,1]){let t=30;const nx=-s.uy*sd,ny=s.ux*sd;
    while(t<s.len-30){const px=s.ax+s.ux*t,py=s.ay+s.uy*t,L=zoneAt(px+nx*120,py+ny*120).lots,
      k=wpick({houses:(L.houses||0)+(L.hinterhof||0)+(L.market||0)*.5,efh:L.efh||0,reihen:L.reihen||0,plattenbau:L.plattenbau||0,ruins:L.ruins||0,hochhaus:L.hochhaus||0,buero:L.buero||0,zucker:L.zucker||0,none:(L.forest||0)+(L.park||0)+(L.kleingarten||0)*.5+(L.sonnen||0)+(L.glashaus||0)+.3});
      if(k==='none'||Math.random()<.2){t+=R(100,240);continue;}
      const[st,l0,d0,H]=bSpec(k);let ok=null,len=0;
      for(const f of [1,.65]){const l=l0*f,d=d0*f,off=82+d/2;len=l;if(Math.hypot(px+nx*off-SX,py+ny*off-SY)<220)break;
        ok=tryBR(px+s.ux*l/2+nx*off,py+s.uy*l/2+ny*off,hz?l:d,hz?d:l,rot,H,st);if(ok){
          if(k==='houses'&&Math.random()<.45){const[,l2,d2,H2]=bSpec('houses'),o2=82+d+70+d2*.35;tryBR(px+s.ux*l/2+nx*o2,py+s.uy*l/2+ny*o2,hz?Math.min(l,l2):d2*.7,hz?d2*.7:Math.min(l,l2),rot,H2*.8,0);}
          break;}}
      t+=ok?len+R(50,110):40;}}}}
// modern towers (v0.43, Stralauer Platz, Mediaspree): hoch = Wohnhochhaus (light, window grid with balconies), buero = glass office tower (spandrels, mullions, lit floors). Same sprite layout as makeB
function modernB(b,st){const c=cnv(b.w,b.h+b.H),g=c.getContext('2d'),O=st==='buero',base=b.h+b.H;b.lights=[];let nl=0;
  const wall=O?pick(['#4a6070','#3e5464','#56687a']):pick(['#d8d4cc','#c8ccd0','#e0d8c8','#b8b4ac']);b.wc=wall;b.rc='#4a4844';g.fillStyle=wall;g.fillRect(0,b.h,b.w,b.H);
  b.sharedWall=O?'glass':'plaster';b.sharedRoof='slate';globalPaintRect(g,'buildings/shared-'+b.sharedWall,0,b.h,b.w,b.H,.85);
  if(O){for(let y=b.h+6;y<base-18;y+=12){g.fillStyle='#26323c';g.fillRect(0,y,b.w,3);if(Math.random()<.015){g.fillStyle='rgba(200,150,80,.4)';g.fillRect(0,y+3,b.w,9);if(nl++<4)b.lights.push({x:b.x+b.w*R(.2,.8),y:b.y-b.H+y+7});}}
    g.fillStyle='rgba(20,28,34,.5)';for(let x=0;x<b.w;x+=10)g.fillRect(x,b.h,1,b.H);const gr=g.createLinearGradient(0,b.h,b.w,base);gr.addColorStop(0,'rgba(200,220,235,.2)');gr.addColorStop(.5,'rgba(200,220,235,0)');gr.addColorStop(1,'rgba(200,220,235,.12)');g.fillStyle=gr;g.fillRect(0,b.h,b.w,b.H);
    for(let i=0;i<b.w*b.H/900;i++){g.fillStyle='#0d1114';g.fillRect(Math.floor(R(0,b.w/10))*10+1,b.h+6+Math.floor(R(0,(b.H-24)/12))*12+3,9,9);}}
  else{for(let y=b.h+8;y<base-26;y+=15){for(let x=6;x<b.w-12;x+=14){const lit=Math.random()<.012&&nl<3;g.fillStyle=lit?'#e0892e':Math.random()<.15?'#0b0806':'#1a1a1e';g.fillRect(x,y,8,10);if(lit){nl++;b.lights.push({x:b.x+x+4,y:b.y-b.H+y+5});}}
      g.fillStyle='rgba(0,0,0,.28)';g.fillRect(0,y+11,b.w,3);g.fillStyle='rgba(60,60,60,.6)';for(let x=0;x<b.w;x+=5)g.fillRect(x,y+6,1,5);}}
  g.fillStyle='#1a2024';g.fillRect(0,base-18,b.w,18);g.fillStyle='rgba(125,170,200,.15)';g.fillRect(0,base-18,b.w,3);g.fillStyle='#0b0806';g.fillRect(Math.floor(b.w/2-8),base-16,16,16);
  for(let i=0;i<3;i++){const x=R(0,b.w),y=R(b.h,base),r=R(14,30),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(5,3,2,.6)');gr.addColorStop(1,'rgba(5,3,2,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,b.h,b.w,4);
  g.fillStyle='#4a4844';g.fillRect(0,0,b.w,b.h);globalPaintRect(g,'buildings/shared-slate',0,0,b.w,b.h,.85);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=3;g.strokeRect(1.5,1.5,b.w-3,b.h-3);
  for(let i=0;i<3;i++){const ux=R(10,b.w-40),uy=R(10,b.h-30);g.fillStyle='#5a5852';g.fillRect(ux,uy,R(18,30),R(14,22));g.fillStyle='rgba(255,240,220,.08)';g.fillRect(ux,uy,24,2);}
  b.spr=c;bShadow(b);}
