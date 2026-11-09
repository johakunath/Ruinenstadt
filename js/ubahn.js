/* ================= U-Bahn (v0.50): tunnel levels between districts and the S+U network map =================
   Line k runs from district k to k+1 and is the gate: liberate district k, clear its line, then district k+1 opens (S.ln[k]).
   A tunnel is its own long map (v0.55: 16000 x 2400, route A along one S-curve), mostly rock. Walkable band, rooms and bypass -> 20 px cell mask -> merged solid rects become walls.
   Back walls (north and west edges of walkable space) are tiled or concrete boxes; south and east edges stay open (cutaway).
   Sections run in order: each spawns its packs when you walk into their trigger and keeps a grating (gate) shut until they are down.
   End: start the generator on the target platform, hold the charge, beat Der Schaffner. Mockup: mockups/v050-ubahn.html */
const LINES=[{l:'S3',c:'#2a8a3a',g:'Rummelsburg'},{l:'U8',c:'#224f86',g:'Heinrich-Heine-Straße'},{l:'U2',c:'#da421e',g:'Klosterstraße'},{l:'U6',c:'#8c6dab',g:'Französische Straße'},{l:'U7',c:'#528dba',g:'Mierendorffplatz'},{l:'S5',c:'#e3801c',g:'Biesdorf'}];
const STN=['S Köpenick','U Warschauer Straße','U Alexanderplatz','U Potsdamer Platz','U Platz der Luftbrücke','U Rathaus Spandau','S Marzahn'];
// network map (viewBox 400x250): district interchanges and line routes (45° schematic), badge positions
const NETP=[[340,190],[250,140],[215,90],[165,115],[190,185],[45,120],[330,60]],NETL=[[[340,190],[300,190],[250,140]],[[250,140],[250,125],[215,90]],[[215,90],[190,90],[165,115]],[[165,115],[165,160],[190,185]],[[190,185],[110,185],[45,120]],[[45,120],[45,40],[310,40],[330,60]]],NETB=[[301,202],[265,120],[193,76],[148,140],[120,197],[180,32]];
/* v0.55 route A (playtest 2: bigger, longer, curved): world 16000 x 2400, one gentle S-curve. Scale about 2.5x the old tunnel: track bed 620 wide with two tracks 300 apart,
   rails 72 apart (3 player widths), trains 150 wide. Everything is placed along the centre line: cy(x) is its y, ang(x) its angle, at(x,off) a point off to the side (negative = north) */
const TW=16000,TH=2400,TX0=200,TX1=15800,HW=310,PW=580,cy=x=>1200+420*Math.sin(Math.PI*(x-300)/7700),ang=x=>Math.atan(420*Math.PI/7700*Math.cos(Math.PI*(x-300)/7700)),
  at=(x,o)=>{const a=ang(x);return[x-o*Math.sin(a),cy(x)+o*Math.cos(a)];};
// stations (x ranges with platforms on both sides), side rooms and special stretches
const TST=[[TX0,1900],[5600,7400],[13400,TX1]],inSt=x=>TST.some(s=>x>=s[0]&&x<=s[1]),hwAt=x=>{let h=HW;for(const s of TST){const d=Math.max(s[0]-x,x-s[1]);if(d<450)h=Math.max(h,PW-(PW-HW)*Math.max(0,d)/450);}return h;};
const ROOM=[2380,0,700,420],RUBX=[4250,4700],BYP=[4000,4950],FLOOD=[9300,10800],GEN={x:14800,y:0,r:260,need:55};// y of ROOM and GEN set in buildTunnel
// sections: n name ({a} start, {b} target, {g} ghost station), packs (t: trigger x, sp: spawn x range ahead, ty types), gate x. Types: g ghoul, s spitter, b brute, r rat pack, w bomb, h howl (or ghoul), x district special, E elite ghoul, B elite brute
const TSEC=[{n:'Bahnsteig {a}',packs:[],end:1750},
  {n:'Tunnel',packs:[{t:2000,sp:[2500,2800],ty:'gggggrs'},{t:2600,sp:[3000,3300],ty:'gggsxbg'},{t:3200,sp:[3500,3750],ty:'ggsrxg'}],gate:3800},
  {n:'Einsturz · Wartungsgang',packs:[{t:3900,sp:[4000,4200],ty:'rggsg'},{t:4500,sp:[4750,5000],ty:'gggsx'},{t:4800,sp:[5050,5300],ty:'bgggxs'}],gate:5400},
  {n:'Geisterbahnhof {g}',packs:[{t:5500,sp:[5900,6300],ty:'Essggxg'},{t:6200,sp:[6600,6950],ty:'ggghsgr'},{t:6800,sp:[7100,7450],ty:'bggxsE'}],gate:7600},
  {n:'Kehrgleis',packs:[{t:7700,sp:[8000,8300],ty:'rrggsxg'},{t:8200,sp:[8500,8800],ty:'Bggwg'},{t:8700,sp:[8900,9150],ty:'gggsrx'}],gate:9200},
  {n:'Geflutete Strecke',packs:[{t:9300,sp:[9600,9900],ty:'rrwggg'},{t:9900,sp:[10200,10500],ty:'sggxsg'},{t:10400,sp:[10700,10950],ty:'bggwrs'}],gate:11000},
  {n:'Zugwrack',packs:[{t:11100,sp:[11400,11800],ty:'gggxsg'},{t:11800,sp:[12100,12500],ty:'bgBsgg'},{t:12500,sp:[12800,13150],ty:'ggxsbE'}],gate:13200},
  {n:'Bahnsteig {b}',packs:[]}];
const tunName=(k,s)=>s.replace('{a}',STN[k].slice(2)).replace('{b}',STN[k+1].slice(2)).replace('{g}',LINES[k].g);
const lineOpen=k=>k<LINES.length&&S.best[k]>=WAVES,lineFree=k=>!!(S.ln&&S.ln[k]);
let TUN=null,TILE=null;
function tileTex(conc){const c=cnv(200,96),g=c.getContext('2d');
  if(conc){g.fillStyle='#3a3833';g.fillRect(0,0,200,96);for(let i=0;i<260;i++){g.fillStyle=pick(['rgba(0,0,0,.18)','rgba(255,240,220,.05)','rgba(60,50,40,.3)']);g.fillRect(R(0,200),R(0,96),R(1,4),R(1,3));}
    g.fillStyle='rgba(0,0,0,.25)';for(let x=0;x<200;x+=50)g.fillRect(x,0,2,96);g.strokeStyle='#1a1816';g.lineWidth=3;for(const y of [18,26])g.beginPath(),g.moveTo(0,y),g.lineTo(200,y+R(-2,2)),g.stroke();
    g.fillStyle='#2a2622';g.fillRect(92,34,16,10);g.fillStyle='#c8902a';g.fillRect(95,36,10,6);g.fillStyle='#1c1a17';g.fillRect(0,82,200,14);return c;}
  g.fillStyle='#647872';g.fillRect(0,0,200,96);for(let y=0;y<80;y+=10)for(let x=(y/10%2)*10;x<200;x+=20){g.fillStyle=pick(['#6f8079','#5e716b','#687c75','#73847c','#56665f']);g.fillRect(x+1,y+1,18,8);}
  g.fillStyle='#ed9e25';g.fillRect(0,44,200,9);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(0,51,200,2);for(let i=0;i<14;i++){g.fillStyle='rgba(40,30,20,.35)';g.fillRect(R(0,200),R(0,80),R(2,10),R(6,30));}
  g.fillStyle='#2e2a26';g.fillRect(0,80,200,16);return c;}
function signTex(n){const c=tileTex(0),g=c.getContext('2d');g.font='700 15px sans-serif';const w=Math.min(190,g.measureText(n).width+16);g.fillStyle='#ead9c0';g.fillRect(100-w/2-2,18,w+4,22);g.fillStyle='#1d3a8a';g.fillRect(100-w/2,20,w,18);g.fillStyle='#fff';g.textAlign='center';g.fillText(n,100,34,186);return c;}
// wall chunk: texture on the visible face (south for north walls, east for west walls), dark top
function drawTile(b){const{x,y,w,h}=b,H=b.H,[ux,uy,vx,vy]=bAx();faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.3)');
  if(b.ax==='x'){const q=P3(x,y+h,H);ctx.save();ctx.transform(ux,uy,0,1,q[0],q[1]);ctx.drawImage(b.tx,0,0,Math.min(w,200),96,0,0,w,H);ctx.restore();faceS(x,y,w,h,0,H,0,INK);}
  else{const q=P3(x+w,y+h,H);ctx.save();ctx.transform(-vx,-vy,0,1,q[0],q[1]);ctx.drawImage(b.tx,0,0,Math.min(h,200),96,0,0,h,H);ctx.restore();faceE(x,y,w,h,0,H,'rgba(8,5,4,.28)',INK);}
  faceT(x,y,w,h,H,'#100e0c',INK);}
function drawCol(b){const{x,y,w,h}=b;faceT(x+4,y+4,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,b.H,b.c||'#3f6a4a',INK);ibox(x-3,y-3,w+6,h+6,b.H-8,b.H,'#2c4a34',INK);if(b.yel)faceS(x,y,w,h,40,52,'#ed9e25');}
function drawStone(b){ibox(b.x,b.y,b.w,b.h,0,b.H,b.c,INK);}
function drawGate(b){const{x,y,w,h}=b,H=b.H;ibox(x,y,w,h,0,H,'#3a3632',INK,'#24211e');ctx.strokeStyle='#14110e';ctx.lineWidth=2;
  for(let f=.1;f<1;f+=.12){const a=P3(x+w*f,y+h,0),c=P3(x+w*f,y+h,H),d=P3(x+w,y+h*f,0),e=P3(x+w,y+h*f,H);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(c[0],c[1]);ctx.moveTo(d[0],d[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();}
  for(let i=0;i<6;i++){faceS(x+w*i/6,y,w/12,h,H-12,H,i%2?'#14110e':'#ed9e25');faceE(x,y+h*i/6,w,h/12,H-12,H,i%2?'#14110e':'#ed9e25');}}
function drawGen(b){const{x,y,w,h}=b,on=TUN&&TUN.lit;faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,34,'#5a5048',INK);ibox(x+8,y+6,w-16,h-12,34,48,'#3a3632',INK);faceS(x+w*.3,y,w*.4,h,12,24,on?'#f2d14b':'#4a3a20');ibox(x+w-14,y+4,8,8,48,72,'#2a2622',INK);}
function drawTrain(b){const{x,y,w,h}=b,H=b.TH||46,z=v=>v*H/46;faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,z(4),H,'#ed9e25',INK,'#c47f1c');faceS(x,y,w,h,z(4),z(12),'#3a2a14');
  for(let i=0;i<6;i++)faceS(x+12+i*(w-24)/6,y,(w-24)/6-8,h,z(22),z(38),i===2?'#d8642e':'#1a1410');faceS(x+w*.45,y,w*.04,h,z(22),z(34),'#7a3a2a');faceE(x,y,w,h,z(22),z(38),'rgba(10,8,6,.6)');faceS(x,y,w,h,z(4),H,0,INK);}
// ground (v0.55): drawn at half resolution (G.k), world coords via gx.scale. Rock, track bed along the curve, sleepers across, rails, tiled platforms with yellow edges, water, rubble
const tLine=(g,o,x0,x1,st)=>{g.beginPath();for(let x=x0;x<=x1;x+=st){const p=at(x,o);x===x0?g.moveTo(p[0],p[1]):g.lineTo(p[0],p[1]);}g.stroke();};
function tunGround(){const g=gx;g.fillStyle='#0b0a09';g.fillRect(0,0,TW,TH);for(let i=0;i<14000;i++){g.fillStyle=pick(['rgba(255,240,220,.03)','rgba(0,0,0,.4)']);const s=R(2,6);g.fillRect(R(0,TW),R(0,TH),s,s);}
  // track bed and platforms
  g.beginPath();for(let x=TX0;x<=TX1;x+=40){const p=at(x,-hwAt(x));x===TX0?g.moveTo(p[0],p[1]):g.lineTo(p[0],p[1]);}for(let x=TX1;x>=TX0;x-=40){const p=at(x,hwAt(x));g.lineTo(p[0],p[1]);}g.closePath();g.fillStyle='#3e3d38';g.fill();
  g.beginPath();for(let x=TX0;x<=TX1;x+=40){const p=at(x,-HW);x===TX0?g.moveTo(p[0],p[1]):g.lineTo(p[0],p[1]);}for(let x=TX1;x>=TX0;x-=40){const p=at(x,HW);g.lineTo(p[0],p[1]);}g.closePath();g.fillStyle='#1d1a17';g.fill();
  for(let x=TX0;x<TX1;x+=40){const h=hwAt(x);if(h<=HW+20)continue;for(const sd of [-1,1])for(let o=HW+20;o<h-10;o+=40){const p=at(x,sd*(o+20));g.fillStyle=pick(['#46453f','#3a3934','#42413b','#4a4842']);g.fillRect(p[0]-19,p[1]-19,38,38);}}
  g.lineWidth=14;for(const s of TST)for(const sd of [-1,1]){g.strokeStyle='#ed9e25';g.setLineDash([]);tLine(g,sd*(HW+8),s[0]+60,s[1]-60,40);g.strokeStyle='rgba(0,0,0,.35)';g.setLineDash([8,20]);tLine(g,sd*(HW+8),s[0]+60,s[1]-60,40);}g.setLineDash([]);
  for(let i=0;i<16000;i++){const x=R(TX0,TX1),p=at(x,R(-HW,HW));g.fillStyle=pick(['#26221e','#16130f','#2c2722']);g.fillRect(p[0],p[1],R(3,8),R(3,6));}
  // sleepers across, then rails (gauge 72), two tracks 300 apart
  for(const o of [-150,150]){g.strokeStyle='#2e2219';g.lineWidth=16;for(let x=TX0+20;x<TX1;x+=46){const p=at(x,o-62),q=at(x,o+62);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();}
    for(const r of [-36,36]){g.strokeStyle='#6a6258';g.lineWidth=6;tLine(g,o+r,TX0,TX1,40);g.strokeStyle='rgba(255,240,220,.14)';g.lineWidth=2;tLine(g,o+r-2,TX0,TX1,40);}}
  // side room, maintenance bypass, water, rubble, blotches
  g.fillStyle='#34302a';g.fillRect(...ROOM);g.fillStyle='#2b2926';for(let x=BYP[0];x<BYP[1];x+=40){const y=cy(x)+HW-60;g.fillRect(x,y,42,230);}
  g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=2;for(let i=0;i<60;i++){let a=R(ROOM[0],ROOM[0]+ROOM[2]),b=R(ROOM[1],ROOM[1]+ROOM[3]);g.beginPath();g.moveTo(a,b);for(let j=0;j<3;j++){a+=R(-20,20);b+=R(-20,20);g.lineTo(a,b);}g.stroke();}
  g.beginPath();for(let x=FLOOD[0];x<=FLOOD[1];x+=40){const p=at(x,-HW);x===FLOOD[0]?g.moveTo(p[0],p[1]):g.lineTo(p[0],p[1]);}for(let x=FLOOD[1];x>=FLOOD[0];x-=40){const p=at(x,HW);g.lineTo(p[0],p[1]);}g.closePath();g.fillStyle='rgba(30,58,68,.84)';g.fill();
  g.strokeStyle='rgba(140,190,200,.2)';g.lineWidth=3;for(let i=0;i<200;i++){const x=R(FLOOD[0],FLOOD[1]-60),p=at(x,R(-HW+20,HW-20));g.beginPath();g.moveTo(p[0],p[1]);g.quadraticCurveTo(p[0]+20,p[1]-6,p[0]+R(30,70),p[1]);g.stroke();}
  for(let i=0;i<160;i++){const p=at(R(RUBX[0]-60,RUBX[1]+60),R(-HW,HW));g.fillStyle=pick(['#4a4038','#3a322a','#5a5048']);g.beginPath();g.ellipse(p[0],p[1],R(10,34),R(6,20),R(0,3),0,7);g.fill();}
  for(let i=0;i<220;i++){const x=R(TX0,TX1),p=at(x,R(-PW,PW)),r=R(40,120),gr=g.createRadialGradient(p[0],p[1],0,p[0],p[1],r);gr.addColorStop(0,'rgba(0,0,0,.4)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(p[0]-r,p[1]-r,r*2,r*2);}}
// pause map tab for the long tunnel: the whole route as an unrotated strip with sections, gates, you and enemies
function tunMapTab(c){const g=c.getContext('2d'),k=600/TW,oy=300-TH*k/2,T=(x,y)=>[x*k,oy+y*k];g.setTransform(1,0,0,1,0,0);g.fillStyle='#120d0a';g.fillRect(0,0,600,600);g.drawImage(MB2,0,oy);
  g.font='600 13px "Barlow Condensed",sans-serif';g.textAlign='center';for(const[i,s]of TSEC.entries())if(s.gate){const[x,y]=T(s.gate,cy(s.gate));g.fillStyle=i<TUN.sec?'#8fd16a':'#c23a2e';g.fillRect(x-1.5,y-14,3,28);}
  for(const m of marks){const[x,y]=T(m.x,m.y);g.fillStyle='#ead9c0';g.fillText(m.n,x,y-26);}for(const e of enemies){const[x,y]=T(e.x,e.y);g.fillStyle='#c23a2e';g.fillRect(x-1.5,y-1.5,3,3);}
  {const[x,y]=T(GEN.x,GEN.y);g.fillStyle='#f2d14b';g.beginPath();g.arc(x,y,4,0,7);g.fill();}{const[x,y]=T(P.x,P.y);g.fillStyle='#fff';g.beginPath();g.arc(x,y,5,0,7);g.fill();}
  g.fillStyle='#a8957d';g.textAlign='left';g.fillText(tunName(TUN.k,TSEC[TUN.sec].n)+' · Abschnitt '+(TUN.sec+1)+' von '+TSEC.length,12,oy+TH*k+30);}
// build the tunnel map for line k (instead of buildWorld)
function buildTunnel(k){const L=LINES[k];D=Object.assign({},DIST[k],{n:L.l+' · '+DIST[k].n+' → '+DIST[k+1].n,tun:1,lvl:DIST[k].lvl+6,geo:null,wet:0,day:0,cyber:0,dark:.93,nc:'5,6,7'});
  WS=TW;WH=TH;const sp=at(700,-440);[SX,SY]=sp;G=cnv(TW/2,TH/2);G.k=.5;gx=G.getContext('2d');gx.scale(.5,.5);walls=[];blds=[];barrels=[];reserved=[];marks=[];brk=[];spati=null;darks=[{x:0,y:0,w:TW,h:TH,seen:1}];waters=[];neons=[];shrines=[];ROADS=[];BLK=[];
  TUN={k,sec:0,live:[],gates:[],gen:null,lit:0,hold:0,boss:0,done:0};
  {const rc=cy(2730)-HW-420;ROOM[1]=Math.round(rc/20)*20;ROOM[3]=540;const g_=at(GEN.x,-450);GEN.y=g_[1];GEN.x=g_[0];}
  // walkable mask (20 px cells) -> merged solid rects as invisible collision walls
  const C=20,NX=TW/C,NY=TH/C,M=new Uint8Array(NX*NY),at_=(i,j)=>i>=0&&j>=0&&i<NX&&j<NY&&M[j*NX+i];
  for(let i=0;i<NX;i++){const x=i*C+C/2,c=cy(x),ca=Math.cos(ang(x)),h=hwAt(x);for(let j=0;j<NY;j++){const y=j*C+C/2,d=(y-c)*ca;let w=x>=TX0&&x<=TX1&&Math.abs(d)<=h;
      if(x>=RUBX[0]&&x<=RUBX[1]&&Math.abs(d)<=HW)w=false;if(x>=BYP[0]&&x<=BYP[1]&&d>=HW-60&&d<=HW+170)w=true;if(inR(ROOM,x,y))w=true;M[j*NX+i]=w?1:0;}}
  let open={};for(let j=0;j<=NY;j++){const runs={};if(j<NY)for(let i=0;i<NX;){if(M[j*NX+i]){i++;continue;}const s=i;while(i<NX&&!M[j*NX+i])i++;runs[s+','+i]=1;}
    for(const q in open)if(!runs[q]){walls.push(open[q]);delete open[q];}for(const q in runs){if(open[q])open[q].h+=C;else{const[a,b]=q.split(',').map(Number);open[q]={x:a*C,y:j*C,w:(b-a)*C,h:C};}}}
  tunGround();
  const TT=tileTex(0),TC=tileTex(1),signs=[STN[k].slice(2),L.g,STN[k+1].slice(2)].map(signTex);let nc=0;
  const tile=(b,st,cx)=>{let tx=st?TT:TC;if(st&&b.ax==='x'&&nc++%3===1)tx=signs[cx<3000?0:cx<10000?1:2];Object.assign(b,{H:120,top:120,R0:0,tx,lights:[],draw:drawTile});if(!st&&Math.random()<.4)b.lights.push(b.ax==='x'?{x:b.x+b.w/2,y:b.y+b.h,z:64,r:110,fl:Math.random()<.4}:{x:b.x+b.w,y:b.y+b.h/2,z:64,r:110,fl:Math.random()<.4});blds.push(b);};
  // the long north wall follows the curve as rotated segments (visible south face)
  const yb=x=>at(x,-hwAt(x))[1];for(let x=TX0;x<TX1;x+=160){const x1=Math.min(TX1,x+160),p=at(x,-hwAt(x)),q=at(x1,-hwAt(x1)),mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;if(mx>ROOM[0]-20&&mx<ROOM[0]+ROOM[2]+20)continue;
    const len=Math.hypot(q[0]-p[0],q[1]-p[1])+6,rot=clamp(Math.atan2(q[1]-p[1],q[0]-p[0]),-.75,.75);tile({x:mx-len/2,y:my-18,w:len,h:16,ax:'x',rot},inSt(mx),mx);}
  // other edges (room, bypass, rubble faces, tunnel start) from the mask: north edges and west edges, chunks of at most 8 cells
  for(let j=1;j<NY;j++)for(let i=0;i<NX;){const x=i*C+C/2;if(!(at_(i,j)&&!at_(i,j-1))||(Math.abs(j*C-yb(x))<50&&!(x>ROOM[0]-20&&x<ROOM[0]+ROOM[2]+20))){i++;continue;}const s=i;while(i<NX&&at_(i,j)&&!at_(i,j-1)&&i-s<8)i++;tile({x:s*C,y:j*C-16,w:(i-s)*C,h:16,ax:'x'},0,x);}
  for(let i=1;i<NX;i++)for(let j=0;j<NY;){if(!(at_(i,j)&&!at_(i-1,j))){j++;continue;}const s=j;while(j<NY&&at_(i,j)&&!at_(i-1,j)&&j-s<8)j++;tile({x:i*C-16,y:s*C,w:16,h:(j-s)*C,ax:'y'},inSt(i*C),i*C);}
  const solid=(b,draw)=>{b.lights=b.lights||[];b.top=b.top||b.H;b.R0=0;b.draw=draw;blds.push(b);walls.push(b.rot?obWall(b):b);return b;};
  // platforms: green iron columns, sandbags, fire barrels; trader on the start platform
  for(const s of TST)for(let x=s[0]+200;x<=s[1]-150;x+=300)for(const sd of [-1,1]){const p=at(x,sd*460);if(Math.hypot(p[0]-GEN.x,p[1]-GEN.y)>140)solid({x:p[0]-13,y:p[1]-13,w:26,h:26,H:120,yel:s[0]===TX0},drawCol);}
  for(const[x,o]of[[1250,-360],[1330,-360],[6200,380],[13900,-380],[15300,380]]){const p=at(x,o);solid({x:p[0]-32,y:p[1]-12,w:64,h:24,H:22,c:'#8f7c45'},drawStone);}
  for(const[x,o]of[[400,-500],[1700,-500],[6000,500],[13600,-500],[15500,500]]){const p=at(x,o);barrels.push({x:p[0],y:p[1],ph:R(0,6)});walls.push({x:p[0]-9,y:p[1]-9,w:18,h:18});}
  {const p=at(1100,-470);TUN.npc={x:p[0],y:p[1],r:12,t:1e9,near:false,offers:[0,1,2].map(i=>{const it=makeItem(tradeLvl()+(i===2?2:0),i===2&&Math.random()<.3?3:2,0);return{it,price:scrapVal(it)*5+15};})};}
  // Betriebsraum: chests and crates; ghost station shrine; rubble stones; two wrecked trains along the curve
  {const[x,y,w]=ROOM;addBrk(x+120,y+60,'chest',true);addBrk(x+w-160,y+60,'chest',true);for(const q of [[x+60,y+200],[x+w-80,y+220],[x+w/2,y+70]])addBrk(q[0],q[1],'crate',true);}
  {const p=at(6500,-480);makeLitfass(p[0],p[1]);}for(let i=0;i<14;i++){const x=R(RUBX[0],RUBX[1]-60),p=at(x,R(-HW,HW-60)),w=R(50,110),h=R(50,100);solid({x:p[0],y:p[1],w,h,H:R(30,110),c:pick(['#4a4038','#5a5048','#3e362e'])},drawStone);}
  for(const[x,o]of[[11650,-150],[12550,150]]){const p=at(x,o);solid({x:p[0]-300,y:p[1]-75,w:600,h:150,H:110,TH:110,rot:ang(x)},drawTrain);}
  {const p=[GEN.x,GEN.y];TUN.gen=solid({x:p[0]-45,y:p[1]-27,w:90,h:54,H:90,lights:[]},drawGen);}
  for(const s of TSEC)if(s.gate){const h=hwAt(s.gate)+60;addGate([s.gate,cy(s.gate)-h,40,2*h]);}
  const mk=(x,o,n,soft)=>{const p=at(x,o);marks.push({x:p[0],y:p[1],n,soft});};mk(900,-380,'Bahnsteig '+STN[k].slice(2));mk(6500,-380,'Geisterbahnhof '+L.g);mk(14300,-380,'Bahnsteig '+STN[k+1].slice(2));marks.push({x:ROOM[0]+ROOM[2]/2,y:ROOM[1]+120,n:'Betriebsraum',soft:1});
  gridBuild();
  // minimap: a 3200-wide window follows the player (drawMini), MB holds the whole tunnel at that scale
  const k1=192/3200;MB=cnv(TW*k1,TH*k1);const mg=MB.getContext('2d');mg.drawImage(G,0,0,MB.width,MB.height);
  const k2=600/TW;MB2=cnv(600,Math.ceil(TH*k2));MB2.getContext('2d').drawImage(G,0,0,MB2.width,MB2.height);}
function addGate(r){const b={x:r[0],y:r[1],w:r[2],h:r[3],H:70,top:70,R0:0,lights:[],draw:drawGate};blds.push(b);walls.push(b);TUN.gates.push(b);}
function openGate(i){const b=TUN.gates[i];if(!b||b.open)return;b.open=1;walls.splice(walls.indexOf(b),1);blds.splice(blds.indexOf(b),1);gridDel(b);const x=b.x+b.w/2,y=b.y+b.h/2;burst(x,y,'#ed9e25',24,220);sfx('crash');shake=Math.max(shake,6);drops.push({x,y,heal:true,t:0});toast('<span style="color:var(--ember)">Gitter offen</span> · weiter Richtung '+STN[TUN.k+1].slice(2));}
function eliteOf(e,m){e.elite=m;e.hp*=2.6;e.max=e.hp;e.xp*=3;e.sc*=4;e.r=Math.round(e.r*1.15);if(m==='schnell')e.spd*=1.55;return e;}
// the district's own extra enemy (from MIX), spitter if it has none
function tunSpecial(){const T=['rat','bomb','shield','crow','howl','kabel','bass','uhr','wurz','kern'],M=MIX[D.i]||[],o=T.filter((t,i)=>M[i]>0);return o.length?pick(o):'spitter';}
function tunSpawn(c,x,y,sec){const out=[],add=(t,el)=>{const e=mkEnemy(t,x+R(-14,14),y+R(-14,14));if(el)eliteOf(e,el);e.sec=sec;enemies.push(e);out.push(e);};
  const t={g:'ghoul',s:'spitter',b:'brute',w:'bomb',h:(MIX[D.i]||[])[4]?'howl':'ghoul',x:tunSpecial(),E:'ghoul',B:'brute',r:'rat'}[c];
  if(t==='rat')for(let i=0;i<5;i++)add('rat');else add(t,c==='E'||c==='B'?pick(['schnell','brennend','spaltend','gepanzert']):0);return out;}
const inR=(r,x,y)=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3];
function tunUpdate(dt){const T=TUN;if(!T||T.done)return;P.wet=P.x>=FLOOD[0]&&P.x<=FLOOD[1]&&Math.abs(P.y-cy(P.x))<HW;
  // side room: optional elite guard
  if(!T.room&&inR(ROOM,P.x,P.y)&&P.y<ROOM[1]+ROOM[3]-140){T.room=1;const x=ROOM[0]+ROOM[2]/2,y=ROOM[1]+120;tunSpawn('B',x,y,-1);tunSpawn('g',x-160,y+100,-1);tunSpawn('g',x+160,y+100,-1);toast('Der Betriebsraum ist bewacht');sfx('horn');}
  // current section: trigger packs when you pass x = t, they spawn ahead in small groups; the gate opens when everything the section spawned is down
  const s=TSEC[T.sec];if(s){for(const[i,p]of s.packs.entries()){if(T['p'+T.sec+'_'+i]||P.x<p.t)continue;T['p'+T.sec+'_'+i]=1;let q=null;[...p.ty].forEach((c,j)=>{if(j%3===0){const x=R(p.sp[0],p.sp[1]);q=at(x,R(-HW*.6,HW*.6));}tunSpawn(c,q[0]+R(-40,40),q[1]+R(-40,40),T.sec);});sfx('horn');}
    const all=s.packs.every((p,i)=>T['p'+T.sec+'_'+i]),alive=enemies.some(e=>e.sec===T.sec&&e.hp>0);
    if(all&&!alive&&T.sec<TSEC.length-1&&!(T.sec===0&&P.x<s.end)){if(s.gate)openGate(TSEC.filter((q,i)=>q.gate&&i<=T.sec).length-1);T.sec++;run.wave=T.sec+1;banner(tunName(T.k,TSEC[T.sec].n),1);}}
  // generator: walk to it to start, charge while you stay close, waves come out of the tunnel mouth, then Der Schaffner
  if(T.sec===TSEC.length-1){const d=Math.hypot(P.x-GEN.x,P.y-GEN.y),mouth=()=>at(TX1-120,R(-HW+60,HW-60));if(!T.hold&&d<90){T.hold=1;T.p=0;T.sp=1;banner('Generator anwerfen',1);toast('Bleib beim Generator, bis der Strom fließt');sfx('zap');}
    if(T.hold&&!T.lit){if(d<GEN.r){T.p+=dt;T.sp-=dt;}if(T.sp<=0){T.sp=R(1.6,2.4);const q=mouth();tunSpawn(pick('ggsgxr'),q[0],q[1],9);if(T.p>GEN.need*.5&&!T.el){T.el=1;const e=mouth();tunSpawn('B',e[0],e[1],9);}}
      if(T.p>=GEN.need){T.lit=1;T.gen.lights.push({x:GEN.x,y:GEN.y,z:40,r:260});for(const b of blds)if(b.draw===drawCol&&b.x>TST[2][0])b.lights.push({x:b.x+13,y:b.y+26,z:110,r:150});neons.push({x:GEN.x,y:GEN.y,z:70,c:'#f2d14b',s:70});
        sfx('win');flashT=.2;banner('Strom!',1);const q=at(TX1-260,0),b=mkEnemy('boss',q[0],q[1],false);b.st=run.tl?run.tl.t:0;b.name='Der Schaffner';b.v=-1;b.col='#3a4a5a';enemies.push(b);run.boss=b;T.boss=1;for(let i=0;i<3;i++){const e=mouth();tunSpawn('g',e[0],e[1],9);}toast('Aus dem Tunnel kommt etwas Großes');}}
    if(T.boss&&!run.boss&&!enemies.length){T.done=1;tunWin();}}}
// generator ring on the ground (charge), drawn in the ground layer
function tunDraw(t){const T=TUN;if(!T||!T.hold||T.lit)return;const p=T.p/GEN.need;ctx.fillStyle='rgba(242,209,75,.06)';ctx.beginPath();ctx.arc(GEN.x,GEN.y,GEN.r,0,7);ctx.fill();ctx.strokeStyle='rgba(242,209,75,.45)';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(GEN.x,GEN.y,GEN.r,0,7);ctx.stroke();ctx.setLineDash([]);
  ctx.strokeStyle='#f2d14b';ctx.lineWidth=6;ctx.beginPath();ctx.arc(GEN.x,GEN.y,GEN.r-8,-1.57,-1.57+6.283*p);ctx.stroke();}
function tunWin(){logRun('win');state='over';clearInput();const k=TUN.k;S.ln=S.ln||[];const first=!S.ln[k];S.ln[k]=1;S.dist=k+1;const unl=S.unlocked<k+2;if(unl)S.unlocked=k+2;
  const bonus=Math.round(40*(k+1)*DF().sc);S.scrap+=bonus;run.sg+=bonus;run.bonus=bonus;run.unl=unl;run.first=first;save();sfx('win');setTimeout(()=>showEnd(true),900);}
// start a tunnel run on line k (startRun with the tunnel flag)
const startTunnel=k=>startRun(k,false,false,k);
/* ---- menu: S+U network map (replaces the old district map) ---- */
function netSVG(){let h=`<svg class="bmap net" viewBox="0 0 400 250" role="group" aria-label="S- und U-Bahn-Netz"><rect width="400" height="250" fill="#14282b"/><text x="12" y="20" class="nett">S+U Netz · Ruinenstadt</text>`;
  const pts=a=>a.map(p=>p.join(',')).join(' ');
  LINES.forEach((L,k)=>{const fr=lineFree(k),op=lineOpen(k),sel=menuTun===k,P_=pts(NETL[k]);
    h+=`<g class="line${fr||op?'':' lock'}" data-l="${k}" role="button" tabindex="0" aria-label="${L.l} ${DIST[k].n} nach ${DIST[k+1].n}${fr?' frei':op?' Tunnel offen':' gesperrt'}">${sel?`<polyline points="${P_}" fill="none" stroke="#EF9F27" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>`:''}
    <polyline points="${P_}" fill="none" stroke="${fr||op?L.c:'#3a4a4e'}" stroke-width="${fr||op?6:3}" stroke-linecap="round" stroke-linejoin="round"${fr?'':` stroke-dasharray="${op?'7 5':'3 4'}"`}/>`;
    const a=NETL[k],m=a.reduce((b,p,i)=>i&&Math.hypot(p[0]-a[i-1][0],p[1]-a[i-1][1])>b.l?{l:Math.hypot(p[0]-a[i-1][0],p[1]-a[i-1][1]),i}:b,{l:0,i:1}),p0=a[m.i-1],p1=a[m.i],mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2,dl=m.l,nx=-(p1[1]-p0[1])/dl*4,ny=(p1[0]-p0[0])/dl*4;
    h+=`<line x1="${mx-nx}" y1="${my-ny}" x2="${mx+nx}" y2="${my+ny}" stroke="#a8b8b4" stroke-width="2"/>`;
    const b=NETB[k],S_=L.l[0]==='S';h+=`<rect x="${b[0]-10}" y="${b[1]-6}" width="20" height="12" rx="${S_?6:2}" fill="${fr||op?L.c:'#3a4a4e'}"/><text x="${b[0]}" y="${b[1]+3}" class="netb">${L.l}</text>`;
    if(op&&!fr)h+=`<text x="${b[0]}" y="${b[1]-10}" class="neto">Tunnel offen</text>`;
    h+=`<polyline points="${P_}" fill="none" stroke="transparent" stroke-width="18"/></g>`;});
  DIST.forEach((d,i)=>{const p=NETP[i],lock=i>=S.unlocked,on=i===S.dist&&menuTun==null,won=S.best[i]>=WAVES,lx=[0,30,17,-27,0,0,0][i],ly=[25,20,23,-5,25,26,26][i],an=lx>20?'start':lx<-20?'end':'middle';
    h+=`<g class="node${lock?' lock':''}" data-d="${i}" role="button" aria-label="${d.n}${lock?' gesperrt':''}" tabindex="0">${on?`<circle cx="${p[0]}" cy="${p[1]}" r="17" fill="none" stroke="#EF9F27" stroke-width="2"><animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite"/></circle>`:''}
    <rect x="${p[0]-12}" y="${p[1]-9}" width="24" height="18" rx="9" fill="${lock?'#2a211b':won?'#3B6D11':'#993C1D'}" stroke="${on?'#EF9F27':lock?'#4a5a5e':'#ead9c0'}" stroke-width="${on?3:2}"/>${won?`<path d="M${p[0]-4} ${p[1]}l3 3 5-6" stroke="#ead9c0" stroke-width="2" fill="none"/>`:lock?`<rect x="${p[0]-3}" y="${p[1]-2}" width="6" height="5" fill="#a8957d"/>`:''}
    <text x="${p[0]+lx}" y="${p[1]+ly}" class="mname${lock?' lock':''}" style="text-anchor:${an}">${d.n}</text>${lock?'':`<text x="${p[0]+lx}" y="${p[1]+ly+11}" class="nets" style="text-anchor:${an}">${STN[i]}</text>`}<circle cx="${p[0]}" cy="${p[1]}" r="22" fill="transparent"/></g>`;});
  return h+`<g transform="translate(12,238)" class="nets"><line x1="0" y1="0" x2="14" y2="0" stroke="#224f86" stroke-width="5"/><text x="18" y="3">frei</text><line x1="46" y1="0" x2="60" y2="0" stroke="#da421e" stroke-width="5" stroke-dasharray="5 3"/><text x="64" y="3">Tunnel offen</text><line x1="124" y1="0" x2="138" y2="0" stroke="#3a4a4e" stroke-width="3" stroke-dasharray="3 3"/><text x="142" y="3">gesperrt</text><line x1="190" y1="-4" x2="190" y2="4" stroke="#a8b8b4" stroke-width="2"/><text x="196" y="3">Geisterbahnhof</text></g></svg>`;}
let menuTun=null;
function tunCard(k){const L=LINES[k],fr=lineFree(k);return`<div class="dcard"><div class="dtop"><span class="dn"><span class="lbadge" style="background:${L.c};border-radius:${L.l[0]==='S'?9:3}px">${L.l}</span> ${DIST[k].n} → ${DIST[k+1].n}</span><span class="dm">${fr?'<span class="ok">Strecke frei</span>':'Tunnel offen'}</span></div>
  <div class="sub">Lange Röhre unter der Stadt: Tunnel mit Betriebsraum, Einsturz, Geisterbahnhof ${L.g}, Kehrgleis, geflutete Strecke, Zugwrack. Am Bahnsteig ${STN[k+1].slice(2)} den Generator anwerfen und halten.</div>
  <div class="dgrid"><span>Gegnerstufe</span><b>${DIST[k].lvl+7+S.threat*3}+</b><span>Endgegner</span><b>Der Schaffner</b><span>Lohn</span><b>${fr?'Schrott und Beute':DIST[k+1].n+' freigeschaltet'}</b></div></div>`;}
