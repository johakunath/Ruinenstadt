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
 lm:()=>{legacy(lmRathaus,1050,1230);reserved.push({x:1590,y:1420,w:520,h:360});}};// Rathausplatz stays open
DIST[0].geo=KOEP;
/* ---- Kreuzberg (v0.42). World 3600. Spree in the north-east cuts off the Friedrichshain bank (Oberbaumbrücke, Schillingbrücke), Landwehrkanal runs across with many bridges.
   Hochbahn U1 over Gitschiner and Skalitzer Straße onto the Oberbaumbrücke. Start in Görli. Mockup: mockups/v042-kreuzberg-geo.html ---- */
const KREUZ={ws:3600,start:[2850,1520],land:[],
 rivers:[{n:'Spree',w:170,p:[[3600,1650],[3300,1330],[2950,1000],[2600,720],[2250,450],[1950,220],[1700,0]]},
  {n:'Landwehrkanal',w:80,p:[[3450,1500],[3200,1760],[2800,1950],[2300,2050],[1900,1960],[1500,1850],[1100,1730],[700,1700],[300,1750],[0,1780]]}],
 roads:{'Warschauer Straße':[[3350,450],[3117,814]],'Oberbaumbrücke':[[3117,814],[2783,1186]],
  'Skalitzer Straße':[[2783,1186],[2400,1280],[2000,1360]],'Gitschiner Straße':[[2000,1360],[1500,1480],[1000,1560],[800,1570],[0,1600]],
  'Oranienstraße':[[1350,1000],[1800,1040],[2250,1080],[2600,1231]],'Adalbertstraße':[[1950,330],[1980,800],[2000,1360]],
  'Kottbusser Damm':[[2000,1360],[2150,1700],[2300,2050],[2450,2600],[2550,3600]],'Köpenicker Straße':[[1100,330],[1950,330],[2250,700]],'Schillingbrücke':[[2250,700],[2450,520],[2620,330]],
  'Prinzenstraße':[[1350,0],[1350,1000],[1400,1500],[1450,1850],[1500,2440]],'Friedrichstraße':[[800,1570],[850,1000],[900,0]],'Mehringdamm':[[800,1570],[820,2000],[800,2420],[780,3000],[800,3600]],
  'Yorckstraße':[[0,2350],[800,2420]],'Gneisenaustraße':[[800,2420],[1300,2430],[1800,2470],[2440,2560]],'Bergmannstraße':[[780,2850],[1300,2860],[1850,2850]],
  'Columbiadamm':[[800,3300],[1600,3320],[2500,3250]],'Wiener Straße':[[2450,1268],[2750,1650],[3000,1850],[3200,2200],[3600,2400]],
  'Schlesische Straße':[[2783,1186],[3050,1380],[3230,1560],[3450,1800],[3600,1950]]},
 bridges:[[2950,1000,'Oberbaumbrücke'],[2440,560,'Schillingbrücke'],[2290,2040,'Kottbusser Brücke'],[805,1700,'Hallesches Tor'],[1430,1830,'Baerwaldbrücke'],[3000,1850,'Lohmühlenbrücke'],[3310,1645,'Schlesische Brücke']],
 zones:[['Kotti',[[1780,1150],[2150,1150],[2200,1500],[1800,1500]],{lots:{plattenbau:3,market:1,parking:1},fringe:'plattenbau'}],
  ['Osthafen',[[1900,0],[3600,0],[3600,1500],[3250,1200],[2900,880],[2550,600],[2200,330]],{lots:{ruins:2,construction:2,parking:1,houses:1},fringe:'ruins'}],
  ['Mauerstreifen',[[0,0],[1750,0],[1900,200],[1100,280],[0,260]],{lots:{ruins:3,construction:1,parking:1},fringe:'ruins'}],
  ['Wrangelkiez',[[2700,1240],[2800,1200],[3050,1390],[3220,1570],[3150,1620],[2950,1450]],{lots:{houses:2,hinterhof:3,market:1},fringe:'houses'}],
  ['Görlitzer Park',[[2560,1340],[2700,1260],[2950,1450],[3150,1620],[3050,1780],[2750,1620]],{lots:{park:3,ruins:1},fringe:'park'}],
  ['SO36',[[2000,850],[2650,900],[2700,1180],[2150,1150]],{lots:{houses:3,hinterhof:3,market:1},fringe:'houses'}],
  ['Mariannenplatz',[[2050,420],[2300,480],[2600,800],[2050,800]],{lots:{park:2,houses:1,hinterhof:1},fringe:'houses'}],
  ['Mehringplatz',[[620,1330],[1000,1330],[1000,1520],[620,1520]],{lots:{plattenbau:3,parking:1},fringe:'plattenbau'}],
  ['Gleisdreieck',[[0,1850],[700,1820],[720,2280],[0,2300]],{lots:{park:2,ruins:2,construction:1},fringe:'park'}],
  ['Viktoriapark',[[100,2500],[730,2490],[720,3200],[100,3200]],{lots:{park:3,forest:2},fringe:'forest'}],
  ['Bergmannkiez',[[860,2500],[1800,2520],[1800,3230],[860,3230]],{lots:{houses:3,hinterhof:2,market:2},fringe:'houses'}],
  ['Graefekiez',[[1550,1950],[2200,2100],[2380,2480],[1560,2420]],{lots:{houses:3,hinterhof:2,market:1},fringe:'houses'}],
  ['Hasenheide',[[1880,2580],[2420,2620],[2470,3220],[1880,3220]],{lots:{forest:3,park:2},fringe:'forest'}],
  ['Friedhöfe',[[0,3260],[2500,3320],[2520,3600],[0,3600]],{lots:{forest:2,park:2},fringe:'forest'}],
  ['Treptower Park',[[3300,1880],[3600,1700],[3600,2350],[3450,2200]],{lots:{forest:3,park:2},fringe:'forest'}],
  ['Kreuzkölln',[[2520,2150],[3150,1900],[3600,2450],[3600,3600],[2600,3600]],{lots:{houses:3,hinterhof:2,ruins:1},fringe:'houses'}]],
 other:{lots:{houses:3,hinterhof:3,ruins:1,market:1,construction:1},fringe:'houses'},
 marks:[[2300,330,'Spree'],[1150,1760,'Landwehrkanal']],
 lm:()=>{oberbaum();hochbahn(['Gitschiner Straße','Skalitzer Straße','Oberbaumbrücke','Warschauer Straße']);}};
DIST[1].geo=KREUZ;
/* ---- Kreuzberg landmarks: custom-drawn iso boxes (b.draw runs inside withRot, so P3 follows b.rot) ---- */
const ln3=(a,b,c)=>{ctx.strokeStyle=c;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
function drawPillar(b){const{x,y,w,h,H}=b;faceT(x+4,y+3,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,H-6,'#3f6a4a',INK);ibox(x-3,y-3,w+6,h+6,H-6,H,'#2c4a34',INK);
  for(let z=10;z<H-8;z+=12)ln3(P3(x,y+h,z),P3(x+w,y+h,z),'rgba(0,0,0,.25)');}
// deck span: steel slab z0..z1, gravel top with two rails along the long axis (lx: along local x). train: wrecked U-Bahn car on top
function drawDeck(b){const{x,y,w,h,z0,z1}=b;ibox(x,y,w,h,z0,z1,'#3f6a4a',INK,'#3a3630');faceS(x,y,w,h,z0+3,z0+5,'#2c4a34');faceE(x,y,w,h,z0+3,z0+5,'#223a2a');
  for(const f of [.32,.68])b.lx?ln3(P3(x,y+h*f,z1),P3(x+w,y+h*f,z1),'#8a8276'):ln3(P3(x+w*f,y,z1),P3(x+w*f,y+h,z1),'#8a8276');
  if(!b.train)return;const t=z1+24;if(b.lx)ibox(x+2,y+5,w-4,h-10,z1+2,t,'#d8b830',INK);else ibox(x+5,y+2,w-10,h-4,z1+2,t,'#d8b830',INK);
  const gl='#1a2024';if(b.lx)faceS(x+6,y+5,w-12,h-10,t-13,t-5,gl);else faceE(x+5,y+6,w-10,h-12,t-13,t-5,gl);
  if(b.lx)faceS(x+2,y+5,w-4,h-10,z1+4,z1+7,'#3a3a36');else faceE(x+5,y+2,w-10,h-4,z1+4,z1+7,'#2a2a26');
  ctx.fillStyle='rgba(110,55,25,.3)';for(const r of b.rust){const p=P3(x+w*r[0],y+h*r[1],t);ctx.beginPath();ctx.ellipse(p[0],p[1],5,2.5,0,0,7);ctx.fill();}}
function drawTower(b){const{x,y,w,h,H}=b,c='#8a4430';faceT(x+6,y+4,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,H-12,c,INK);
  for(let z=8;z<H-12;z+=8){ln3(P3(x,y+h,z),P3(x+w,y+h,z),'rgba(0,0,0,.16)');ln3(P3(x+w,y+h,z),P3(x+w,y,z),'rgba(0,0,0,.2)');}
  for(let i=0;i<4;i++){const z=26+i*30;faceS(x+w*.38,y,w*.24,h,z,z+14,b.lit[i]?'#e0892e':'#110b08');faceE(x,y+h*.38,w,h*.24,z,z+14,'#110b08');}
  ibox(x-3,y-3,w+6,h+6,H-12,H,'#7a3a26',INK);const m=(w+6)/7;for(let i=0;i<7;i+=2){ibox(x-3+i*m,y-3,m,5,H,H+8,'#7a3a26',INK);ibox(x-3+i*m,y+h-2,m,5,H,H+8,'#7a3a26',INK);ibox(x-3,y-3+i*m,5,m,H,H+8,'#7a3a26',INK);ibox(x+w-2,y-3+i*m,5,m,H,H+8,'#7a3a26',INK);}}
// Oberbaumbrücke: brick edges and arches along the part over water, two crenellated towers beside the deck
function oberbaum(){const s=ROADS.find(q=>q.n==='Oberbaumbrücke'),g=gx,a=Math.atan2(s.uy,s.ux);let u0=-1,u1=-1;for(let t=0;t<=s.len;t+=6)if(isWater(s.ax+s.ux*t,s.ay+s.uy*t)){if(u0<0)u0=t;u1=t;}if(u0<0)return;u0-=20;u1+=20;
  g.save();g.translate(s.ax,s.ay);g.rotate(a);for(const sd of [-1,1]){const v0=sd<0?-68:43;g.fillStyle='#6b3626';g.fillRect(u0,v0,u1-u0,25);bricks(g,u0,v0,u1-u0,25,5);g.fillStyle='#4a2216';g.fillRect(u0,sd<0?v0:v0+21,u1-u0,4);
    for(let u=u0+20;u<u1-10;u+=40){g.fillStyle='rgba(8,5,4,.55)';g.beginPath();g.ellipse(u,sd*70,14,10,0,sd<0?Math.PI:0,sd<0?0:Math.PI);g.fill();}}g.restore();
  const um=(u0+u1)/2,rot=rotN(a);for(const v of [-82,82]){const cx=s.ax+s.ux*um-s.uy*v,cy=s.ay+s.uy*um+s.ux*v,b={x:cx-18,y:cy-18,w:36,h:36,H:150,top:150,R0:0,rot,lights:[],lit:[0,1,2,3].map(()=>Math.random()<.4),draw:drawTower};
    b.lit.forEach((l,i)=>{if(l)b.lights.push({x:cx,y:cy,z:33+i*30,r:40});});blds.push(b);const ow=obWall(b);walls.push(ow);reserved.push({x:ow.x,y:ow.y,w:ow.w,h:ow.h});}}
// Hochbahn: deck spans of about 120 along the named roads, green steel pillars at the joints (collision, cover). No pillars over water or on crossings. Some spans carry a wrecked train (3 spans long)
function hochbahn(names){const on=q=>names.includes(q.n),pil=[],g=gx;let tr=0;
  for(const s of ROADS){if(!on(s))continue;const rot=rotN(Math.atan2(s.uy,s.ux)),hz=Math.abs(s.ux)>=Math.abs(s.uy),n=Math.max(1,Math.round(s.len/120)),L=s.len/n;
    for(let i=0;i<n;i++){const t=(i+.5)*L,cx=s.ax+s.ux*t,cy=s.ay+s.uy*t,l=L+2,d=30,w=hz?l:d,h=hz?d:l;if(tr<=0&&Math.random()<.06)tr=3;const train=tr-->0;
      blds.push({x:cx-w/2,y:cy-h/2,w,h,H:train?98:74,top:train?98:74,R0:0,z0:62,z1:74,lx:hz,rot,train,rust:Array.from({length:4},()=>[R(.1,.9),R(.2,.8)]),lights:[],draw:drawDeck});
      g.save();g.translate(cx,cy);g.rotate(Math.atan2(s.uy,s.ux));g.fillStyle='rgba(0,0,0,.22)';g.fillRect(-l/2,-12,l,34);g.restore();}
    for(let i=0;i<=n;i++){const px=s.ax+s.ux*i*L,py=s.ay+s.uy*i*L;if(isWater(px,py)||pil.some(p=>Math.hypot(p[0]-px,p[1]-py)<60)||ROADS.some(o=>!on(o)&&segD(o,px,py)<70))continue;pil.push([px,py]);
      blds.push({x:px-7,y:py-7,w:14,h:14,H:62,top:62,R0:0,lights:[],draw:drawPillar});walls.push({x:px-8,y:py-8,w:16,h:16});}}}
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
  stroke(110,'#3a2f27');stroke(86,d.road);stroke(3,'rgba(234,217,192,.09)',[24,30]);
  // bridges: railings where the road edge is over water, brick deck tint
  for(const s of ROADS)for(let t=0;t<s.len;t+=8){const cx=s.ax+s.ux*t,cy=s.ay+s.uy*t;if(!isWater(cx,cy))continue;g.fillStyle='rgba(107,54,38,.12)';g.fillRect(cx-40,cy-40,80,80);
    for(const sd of [-1,1]){const x=cx-s.uy*56*sd,y=cy+s.ux*56*sd;g.fillStyle='#2a221c';g.fillRect(x-3,y-3,6,6);if(t%32<8){g.fillStyle='#4a3a2e';g.fillRect(x-2,y-6,4,8);}}}
  for(let i=0;i<120;i++){const q=roadPt(),o=R(-40,40);g.fillStyle='rgba(8,5,4,.5)';g.beginPath();g.ellipse(q.x+q.nx*o,q.y+q.ny*o,R(6,16),R(4,10),R(0,3),0,7);g.fill();}
  for(const n in K.roads){const p=K.roads[n],m=p[Math.floor(p.length/2)];marks.push({x:m[0],y:m[1],n,soft:1});}
  for(const b of K.bridges)marks.push({x:b[0],y:b[1],n:b[2]});for(const m of K.marks)marks.push({x:m[0],y:m[1],n:m[2],soft:1});
  for(const z of K.zones){const P_=z[1],cx=P_.reduce((a,q)=>a+q[0],0)/P_.length,cy=P_.reduce((a,q)=>a+q[1],0)/P_.length;marks.push({x:cx,y:cy,n:z[0],soft:1});}}
// rotated building at centre cx,cy (rot in (-45°,45°]): free if footprint plus 30 margin is off water, roads, walls and reserved areas
const ptRes=(x,y)=>reserved.some(r=>!r.road&&x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h),rotN=a=>{while(a>Math.PI/4)a-=Math.PI/2;while(a<=-Math.PI/4)a+=Math.PI/2;return a;};
function tryBR(cx,cy,w,h,rot,H,st){const b0={x:cx-w/2,y:cy-h/2,w,h,rot};
  for(let a=0;a<=6;a++)for(let c=0;c<=4;c++){const[px,py]=obW(b0,(a/3-1)*(w/2+30),(c/2-1)*(h/2+30));if(px<10||py<10||px>WS-10||py>WS-10||isWater(px,py)||roadD(px,py)<44||inWall(px,py,4)||ptRes(px,py))return null;}
  const gb=st==='efh'?R(.55,.7)*h:st==='reihen'?R(.45,.55)*h:0,bb={x:b0.x,y:b0.y,w,h,H:Math.round(H*(st==='laube'?1.2:2)),top:H+gb*.5,R0:0,gable:gb,rot};
  makeB(bb,st);blds.push(bb);const ow=obWall(bb);walls.push(ow);reserved.push({x:ow.x,y:ow.y,w:ow.w,h:ow.h,road:1});return bb;}// road:1 = soft reserve, roadside props may ignore it (they check walls)
const bSpec=k=>k==='efh'?['efh',R(80,100)*BSC,R(65,80)*BSC,44]:k==='reihen'?['reihen',4*58*BSC,R(70,85)*BSC,44]:k==='plattenbau'?['platte',R(240,420),R(64,90)*BSC,R(100,140)*BHS*.75]:k==='ruins'?['ruin',R(60,150)*BSC,R(30,60)*BSC,R(14,34)*BHS*.75]:[0,R(100,220)*BSC,R(50,105)*BSC,R(38,72)*BHS];
// street fronts: walk every road and line it with buildings turned to the road, picked from the zone's lot weights. Forest and park zones stay open.
// Urban fronts sometimes get a Hinterhaus behind them. A failed spot retries at 65% size, then moves on 40 units. Gap between fronts 50 to 110
function geoStreets(K){const zoneAt=(x,y)=>{for(const z of K.zones)if(inPoly(z[1],x,y))return z[2];return K.other;};
  for(const s of ROADS){const rot=rotN(Math.atan2(s.uy,s.ux)),hz=Math.abs(s.ux)>=Math.abs(s.uy);
   for(const sd of [-1,1]){let t=30;const nx=-s.uy*sd,ny=s.ux*sd;
    while(t<s.len-30){const px=s.ax+s.ux*t,py=s.ay+s.uy*t,L=zoneAt(px+nx*120,py+ny*120).lots,
      k=wpick({houses:(L.houses||0)+(L.hinterhof||0)+(L.market||0)*.5,efh:L.efh||0,reihen:L.reihen||0,plattenbau:L.plattenbau||0,ruins:L.ruins||0,none:(L.forest||0)+(L.park||0)+(L.kleingarten||0)*.5+.3});
      if(k==='none'||Math.random()<.2){t+=R(100,240);continue;}
      const[st,l0,d0,H]=bSpec(k);let ok=null,len=0;
      for(const f of [1,.65]){const l=l0*f,d=d0*f,off=82+d/2;len=l;if(Math.hypot(px+nx*off-SX,py+ny*off-SY)<220)break;
        ok=tryBR(px+s.ux*l/2+nx*off,py+s.uy*l/2+ny*off,hz?l:d,hz?d:l,rot,H,st);if(ok){
          if(k==='houses'&&Math.random()<.45){const[,l2,d2,H2]=bSpec('houses'),o2=82+d+70+d2*.35;tryBR(px+s.ux*l/2+nx*o2,py+s.uy*l/2+ny*o2,hz?Math.min(l,l2):d2*.7,hz?d2*.7:Math.min(l,l2),rot,H2*.8,0);}
          break;}}
      t+=ok?len+R(50,110):40;}}}}
