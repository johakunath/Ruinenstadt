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
 lm:'rathaus'};
DIST[0].geo=KOEP;
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
  for(let y=0;y<WS;y+=40){let x0=-1;for(let x=0;x<=WS;x+=40){const wt=x<WS&&isWater(x+20,y+20)&&roadD(x+20,y+20)>=58;if(wt&&x0<0)x0=x;if(!wt&&x0>=0){walls.push({x:x0,y,w:x-x0,h:40,water:1});reserved.push({x:x0,y,w:x-x0,h:40});if(y%120===0)waters.push({x:x0,y,w:x-x0,h:40});x0=-1;}}}}
function geoWater(K){const g=gx;
  const path=(L,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();L.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();};
  const poly=(P_,c)=>{g.fillStyle=c;g.beginPath();P_.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();};
  if(K.lake){g.save();g.strokeStyle='#4a4038';g.lineWidth=16;g.beginPath();K.lake.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke();g.restore();poly(K.lake,'#10171a');}
  for(const r of K.rivers)path(r.p,r.w+14,'#4a4038');for(const r of K.rivers)path(r.p,r.w,'#10171a');
  for(const p of K.land)poly(p,D.ground);
  for(let i=0;i<2600;i++){const x=R(0,WS),y=R(0,WS);if(!isWater(x,y))continue;g.fillStyle=`rgba(150,180,190,${R(.03,.1)})`;g.fillRect(x,y,R(8,30),1.5);}
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
