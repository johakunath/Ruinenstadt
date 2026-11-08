/* ================= U-Bahn (v0.50): tunnel levels between districts and the S+U network map =================
   Line k runs from district k to k+1 and is the gate: liberate district k, clear its line, then district k+1 opens (S.ln[k]).
   A tunnel is its own 2400 map, mostly rock. Walkable rects (TL) -> 20 px cell mask -> merged solid rects become walls.
   Back walls (north and west edges of walkable space) are tiled or concrete boxes; south and east edges stay open (cutaway).
   Sections run in order: each spawns its packs when you walk into their trigger and keeps a grating (gate) shut until they are down.
   End: start the generator on the target platform, hold the charge, beat Der Schaffner. Mockup: mockups/v050-ubahn.html */
const LINES=[{l:'S3',c:'#2a8a3a',g:'Rummelsburg'},{l:'U8',c:'#224f86',g:'Heinrich-Heine-Straße'},{l:'U2',c:'#da421e',g:'Klosterstraße'},{l:'U6',c:'#8c6dab',g:'Französische Straße'},{l:'U7',c:'#528dba',g:'Mierendorffplatz'},{l:'S5',c:'#e3801c',g:'Biesdorf'}];
const STN=['S Köpenick','U Warschauer Straße','U Alexanderplatz','U Potsdamer Platz','U Platz der Luftbrücke','U Rathaus Spandau','S Marzahn'];
// network map (viewBox 400x250): district interchanges and line routes (45° schematic), badge positions
const NETP=[[340,190],[250,140],[215,90],[165,115],[190,185],[45,120],[330,60]],NETL=[[[340,190],[300,190],[250,140]],[[250,140],[250,125],[215,90]],[[215,90],[190,90],[165,115]],[[165,115],[165,160],[190,185]],[[190,185],[110,185],[45,120]],[[45,120],[45,40],[310,40],[330,60]]],NETB=[[301,202],[265,120],[193,76],[148,140],[120,197],[180,32]];
// walkable rects [x,y,w,h,kind,axis]: p platform, t track bed (rails along axis), r room, g maintenance corridor. All multiples of 20
const TL=[[140,240,520,180,'p'],[140,420,2080,200,'t','x'],[1060,160,260,200,'r'],[1160,360,60,60,'g'],[1700,620,80,160,'g'],[1700,700,340,80,'g'],[1960,620,80,160,'g'],[2020,620,200,360,'t','y'],
  [380,980,1840,200,'t','x'],[1140,860,460,120,'p'],[1140,1180,460,120,'p'],[380,1180,200,440,'t','y'],[380,1620,1880,200,'t','x'],[1700,1480,560,140,'p'],[1700,1820,560,140,'p']];
const RUB=[1800,420,140,200],FLOOD=[620,980,460,200],GEN={x:2000,y:1898,r:200,need:35};
// sections: n name ({a} start station, {b} target station, {g} ghost station), packs (tr trigger rect, at spawn points, ty types), gate rect. Types: g ghoul, s spitter, b brute, r rat pack, w bomb, h howl (or ghoul), x district special, E elite ghoul, B elite brute
const TSEC=[{n:'Bahnsteig {a}',packs:[]},
  {n:'Tunnel',packs:[{tr:[660,420,500,200],at:[[1000,470],[1060,560],[1120,500],[960,580],[1100,440]],ty:'ggggrs'},{tr:[1160,420,480,200],at:[[1450,470],[1500,560],[1560,520],[1420,590]],ty:'ggsxb'}],gate:[1640,420,30,200]},
  {n:'Einsturz · Wartungsgang',packs:[{tr:[1680,420,120,360],at:[[1860,740],[1920,740],[1990,700]],ty:'rgg'},{tr:[1940,600,280,200],at:[[2080,880],[2160,900],[2120,820],[2060,920]],ty:'bggx'}],gate:[2020,940,200,30]},
  {n:'Geisterbahnhof {g}',packs:[{tr:[1900,960,320,240],at:[[1400,1060],[1300,1100],[1500,1120],[1250,920],[1450,1240]],ty:'Essgx'},{tr:[1140,860,460,440],at:[[1150,1020],[1150,1140],[1170,1080]],ty:'ggh'}],gate:[1100,980,30,200]},
  {n:'Geflutete Strecke',packs:[{tr:[700,980,420,200],at:[[700,1040],[760,1120],[650,1100],[600,1060]],ty:'rrwg'},{tr:[380,1100,200,200],at:[[480,1450],[440,1500],[520,1520]],ty:'sgg'}],gate:[380,1590,200,30]},
  {n:'Zugwrack',packs:[{tr:[380,1560,700,280],at:[[900,1760],[1000,1750],[1100,1770],[1300,1730],[1200,1790]],ty:'gggxs'},{tr:[1100,1600,400,240],at:[[1500,1700],[1550,1760],[1450,1780],[1600,1730]],ty:'bgBs'}],gate:[1660,1620,30,200]},
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
  if(b.ax==='x'){const q=P3(x,y+h,H);ctx.save();ctx.transform(ux,uy,0,1,q[0],q[1]);ctx.drawImage(b.tx,0,0,w,H,0,0,w,H);ctx.restore();faceS(x,y,w,h,0,H,0,INK);}
  else{const q=P3(x+w,y+h,H);ctx.save();ctx.transform(-vx,-vy,0,1,q[0],q[1]);ctx.drawImage(b.tx,0,0,h,H,0,0,h,H);ctx.restore();faceE(x,y,w,h,0,H,'rgba(8,5,4,.28)',INK);}
  faceT(x,y,w,h,H,'#100e0c',INK);}
function drawCol(b){const{x,y,w,h}=b;faceT(x+4,y+4,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,b.H,b.c||'#3f6a4a',INK);ibox(x-3,y-3,w+6,h+6,b.H-8,b.H,'#2c4a34',INK);if(b.yel)faceS(x,y,w,h,40,52,'#ed9e25');}
function drawStone(b){ibox(b.x,b.y,b.w,b.h,0,b.H,b.c,INK);}
function drawGate(b){const{x,y,w,h}=b,H=b.H;ibox(x,y,w,h,0,H,'#3a3632',INK,'#24211e');ctx.strokeStyle='#14110e';ctx.lineWidth=2;
  for(let f=.1;f<1;f+=.12){const a=P3(x+w*f,y+h,0),c=P3(x+w*f,y+h,H),d=P3(x+w,y+h*f,0),e=P3(x+w,y+h*f,H);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(c[0],c[1]);ctx.moveTo(d[0],d[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();}
  for(let i=0;i<6;i++){faceS(x+w*i/6,y,w/12,h,H-12,H,i%2?'#14110e':'#ed9e25');faceE(x,y+h*i/6,w,h/12,H-12,H,i%2?'#14110e':'#ed9e25');}}
function drawGen(b){const{x,y,w,h}=b,on=TUN&&TUN.lit;faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.35)');ibox(x,y,w,h,0,34,'#5a5048',INK);ibox(x+8,y+6,w-16,h-12,34,48,'#3a3632',INK);faceS(x+w*.3,y,w*.4,h,12,24,on?'#f2d14b':'#4a3a20');ibox(x+w-14,y+4,8,8,48,72,'#2a2622',INK);}
function drawTrain(b){const{x,y,w,h}=b,H=46;faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.4)');ibox(x,y,w,h,4,H,'#ed9e25',INK,'#c47f1c');faceS(x,y,w,h,4,12,'#3a2a14');
  for(let i=0;i<6;i++)faceS(x+12+i*(w-24)/6,y,(w-24)/6-8,h,22,38,i===2?'#d8642e':'#1a1410');faceS(x+w*.45,y,22,h,22,34,'#7a3a2a');faceE(x,y,w,h,22,38,'rgba(10,8,6,.6)');faceS(x,y,w,h,4,H,0,INK);}
// ground: rock, floor per kind, rails, platform edges, water, rubble
function tunGround(){const g=gx;g.fillStyle='#0b0a09';g.fillRect(0,0,WS,WS);for(let i=0;i<9000;i++){g.fillStyle=pick(['rgba(255,240,220,.025)','rgba(0,0,0,.4)']);const s=R(1,4);g.fillRect(R(0,WS),R(0,WS),s,s);}
  const inT=(x,y)=>TL.find(r=>r[4]==='t'&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]);
  for(const r of TL){const[x,y,w,h,k,ax]=r;
    if(k==='p'){g.fillStyle='#3e3d38';g.fillRect(x,y,w,h);for(let yy=y;yy<y+h;yy+=20)for(let xx=x;xx<x+w;xx+=20){g.fillStyle=pick(['#46453f','#3a3934','#42413b','#4a4842']);g.fillRect(xx+1,yy+1,18,18);}
      for(const[sx,sy,hor,o]of[[x+w/2,y+h+4,1,-1],[x+w/2,y-4,1,1],[x-4,y+h/2,0,1],[x+w+4,y+h/2,0,-1]])if(inT(sx,sy)){g.fillStyle='#ed9e25';if(hor)g.fillRect(x,o<0?y+h-12:y,w,10);else g.fillRect(o<0?x:x+w-10,y,10,h);g.fillStyle='rgba(0,0,0,.35)';if(hor)for(let xx=x;xx<x+w;xx+=14)g.fillRect(xx,o<0?y+h-12:y,6,10);}}
    else if(k==='t'){g.fillStyle='#1d1a17';g.fillRect(x,y,w,h);for(let i=0;i<w*h/90;i++){g.fillStyle=pick(['#26221e','#16130f','#2c2722']);g.fillRect(R(x,x+w),R(y,y+h),R(2,5),R(2,4));}
      const L=ax==='x'?w:h,Wd=ax==='x'?h:w;for(const f of [.27,.73]){const c=(ax==='x'?y:x)+Wd*f;for(let t=0;t<L;t+=24){g.fillStyle='#2e2219';if(ax==='x')g.fillRect(x+t,c-20,10,40);else g.fillRect(c-20,y+t,40,10);}
        g.fillStyle='#6a6258';for(const o of [-12,12]){if(ax==='x')g.fillRect(x,c+o-1,w,3);else g.fillRect(c+o-1,y,3,h);}g.fillStyle='rgba(255,240,220,.12)';for(const o of [-12,12]){if(ax==='x')g.fillRect(x,c+o-1,w,1);else g.fillRect(c+o-1,y,1,h);}}}
    else{g.fillStyle=k==='r'?'#34302a':'#2b2926';g.fillRect(x,y,w,h);g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1.5;for(let i=0;i<w*h/4000;i++){let a=R(x,x+w),b=R(y,y+h);g.beginPath();g.moveTo(a,b);for(let j=0;j<3;j++){a+=R(-14,14);b+=R(-14,14);g.lineTo(a,b);}g.stroke();}}}
  {const[x,y,w,h]=FLOOD;g.fillStyle='rgba(30,58,68,.82)';g.fillRect(x,y,w,h);g.strokeStyle='rgba(140,190,200,.18)';g.lineWidth=2;for(let i=0;i<60;i++){const a=R(x,x+w-30),b=R(y,y+h);g.beginPath();g.moveTo(a,b);g.quadraticCurveTo(a+12,b-4,a+R(20,40),b);g.stroke();}}
  {const[x,y,w,h]=RUB;for(let i=0;i<70;i++){g.fillStyle=pick(['#4a4038','#3a322a','#5a5048']);g.beginPath();g.ellipse(R(x-30,x+w+30),R(y,y+h),R(6,20),R(4,12),R(0,3),0,7);g.fill();}}
  for(let i=0;i<70;i++){const x=R(100,2300),y=R(100,2300),r=R(20,60),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(0,0,0,.4)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}}
// build the tunnel map for line k (instead of buildWorld)
function buildTunnel(k){const L=LINES[k];D=Object.assign({},DIST[k],{n:L.l+' · '+DIST[k].n+' → '+DIST[k+1].n,tun:1,lvl:DIST[k].lvl+6,geo:null,wet:0,day:0,cyber:0,dark:.93,nc:'5,6,7'});
  WS=2400;[SX,SY]=[300,330];G=cnv(WS,WS);gx=G.getContext('2d');walls=[];blds=[];barrels=[];reserved=[];marks=[];brk=[];spati=null;darks=[{x:0,y:0,w:WS,h:WS,seen:1}];waters=[];neons=[];shrines=[];ROADS=[];BLK=[];
  TUN={k,sec:0,live:[],gates:[],gen:null,lit:0,hold:0,boss:0,done:0};
  const C=20,N=WS/C,M=new Uint8Array(N*N),mk=(x,y,w,h,v)=>{for(let i=x/C;i<(x+w)/C;i++)for(let j=y/C;j<(y+h)/C;j++)M[j*N+i]=v;},at=(i,j)=>i>=0&&j>=0&&i<N&&j<N&&M[j*N+i];
  for(const r of TL)mk(r[0],r[1],r[2],r[3],1);mk(...RUB,0);
  // solid rects: runs per row, merged downwards while the run stays the same
  let open={};for(let j=0;j<=N;j++){const runs={};if(j<N)for(let i=0;i<N;){if(M[j*N+i]){i++;continue;}const s=i;while(i<N&&!M[j*N+i])i++;runs[s+','+i]=1;}
    for(const q in open)if(!runs[q]){walls.push(open[q]);delete open[q];}for(const q in runs){if(open[q])open[q].h+=C;else{const[a,b]=q.split(',').map(Number);open[q]={x:a*C,y:j*C,w:(b-a)*C,h:C};}}}
  tunGround();
  const kindAt=(x,y)=>(TL.find(r=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3])||[])[4],TT=tileTex(0),TC=tileTex(1),signs=[STN[k].slice(2),LINES[k].g,STN[k+1].slice(2)].map(signTex);let nc=0;
  const wall=(x,y,w,h,ax,cx,cy)=>{const kd=kindAt(cx,cy),p=kd==='p'||kd==='r';let tx=p?TT:TC;if(p&&ax==='x'&&w>=120&&nc++%3===1)tx=signs[cy<600?0:cy<1400?1:2];
    const b={x,y,w,h,H:96,top:96,R0:0,ax,tx,lights:[],draw:drawTile};if(!p&&(Math.random()<.45))b.lights.push(ax==='x'?{x:x+w/2,y:y+h,z:52,r:80,fl:Math.random()<.4}:{x:x+w,y:y+h/2,z:52,r:80,fl:Math.random()<.4});blds.push(b);};
  // north edges (south faces visible) and west edges (east faces visible), cut into chunks of at most 160
  for(let j=1;j<N;j++)for(let i=0;i<N;){if(!(at(i,j)&&!at(i,j-1))){i++;continue;}const s=i;while(i<N&&at(i,j)&&!at(i,j-1)&&i-s<8)i++;wall(s*C,j*C-16,(i-s)*C,16,'x',s*C+5,j*C+5);}
  for(let i=1;i<N;i++)for(let j=0;j<N;){if(!(at(i,j)&&!at(i-1,j))){j++;continue;}const s=j;while(j<N&&at(i,j)&&!at(i-1,j)&&j-s<8)j++;wall(i*C-16,s*C,16,(j-s)*C,'y',i*C+5,s*C+5);}
  const solid=(b,draw)=>{b.lights=b.lights||[];b.top=b.top||b.H;b.R0=0;b.draw=draw;blds.push(b);walls.push(b);return b;};
  // platforms: green iron columns, sandbags, fire barrels; start platform with the trader
  for(const[x0,x1,y]of[[220,640,330],[1180,1600,920],[1180,1600,1240],[1760,2240,1550],[1760,2240,1890]])for(let x=x0;x<=x1;x+=140)if(Math.hypot(x-GEN.x,y-GEN.y)>90)solid({x:x-8,y:y-8,w:16,h:16,H:96,yel:y<600},drawCol);
  for(const[x,y]of[[470,404],[520,404],[1300,1312-14],[1820,1600],[2140,1830]])solid({x:x-22,y:y-8,w:44,h:16,H:16,c:'#8f7c45'},drawStone);
  for(const q of [[180,280],[600,280],[1830,1510],[2200,1940]]){barrels.push({x:q[0],y:q[1],ph:R(0,6)});walls.push({x:q[0]-9,y:q[1]-9,w:18,h:18});}
  TUN.npc={x:420,y:290,r:12,t:1e9,near:false,offers:[0,1,2].map(i=>{const it=makeItem(tradeLvl()+(i===2?2:0),i===2&&Math.random()<.3?3:2,0);return{it,price:scrapVal(it)*5+15};})};
  // Betriebsraum: two chests and crates; ghost station shrine; rubble stones; wrecked train in row 3
  addBrk(1110,200,'chest',true);addBrk(1270,200,'chest',true);for(const q of [[1090,320],[1290,330],[1240,180]])addBrk(q[0],q[1],'crate',true);
  makeLitfass(1370,900);for(let i=0;i<9;i++){const w=R(30,60),h=R(30,60);solid({x:R(RUB[0],RUB[0]+RUB[2]-w),y:R(RUB[1],RUB[1]+RUB[3]-h),w,h,H:R(18,64),c:pick(['#4a4038','#5a5048','#3e362e'])},drawStone);}
  for(const x of [760,1030])solid({x,y:1646,w:250,h:44,H:46},drawTrain);
  TUN.gen=solid({x:GEN.x-30,y:GEN.y-18,w:60,h:36,H:72,lights:[]},drawGen);
  for(const s of TSEC)if(s.gate)addGate(s.gate);
  marks.push({x:400,y:330,n:'Bahnsteig '+STN[k].slice(2)},{x:1370,y:1080,n:'Geisterbahnhof '+L.g},{x:1980,y:1700,n:'Bahnsteig '+STN[k+1].slice(2)},{x:1190,y:260,n:'Betriebsraum',soft:1});
  decorate();gridBuild();
  const k2=600/WS;MB2=cnv(600,600);const m2=MB2.getContext('2d');m2.drawImage(G,0,0,600,600);const k1=192/WS;MB=cnv(192,192);const mg=MB.getContext('2d');mg.drawImage(G,0,0,192,192);mg.fillStyle='rgba(234,217,192,.3)';for(const r of TL)mg.fillRect(r[0]*k1,r[1]*k1,r[2]*k1,r[3]*k1);}
function addGate(r){const b={x:r[0],y:r[1],w:r[2],h:r[3],H:70,top:70,R0:0,lights:[],draw:drawGate};blds.push(b);walls.push(b);TUN.gates.push(b);}
function openGate(i){const b=TUN.gates[i];if(!b||b.open)return;b.open=1;walls.splice(walls.indexOf(b),1);blds.splice(blds.indexOf(b),1);gridDel(b);const x=b.x+b.w/2,y=b.y+b.h/2;burst(x,y,'#ed9e25',24,220);sfx('crash');shake=Math.max(shake,6);drops.push({x,y,heal:true,t:0});toast('<span style="color:var(--ember)">Gitter offen</span> · weiter Richtung '+STN[TUN.k+1].slice(2));}
function eliteOf(e,m){e.elite=m;e.hp*=2.6;e.max=e.hp;e.xp*=3;e.sc*=4;e.r=Math.round(e.r*1.15);if(m==='schnell')e.spd*=1.55;return e;}
// the district's own extra enemy (from MIX), spitter if it has none
function tunSpecial(){const T=['rat','bomb','shield','crow','howl','kabel','bass','uhr','wurz','kern'],M=MIX[D.i]||[],o=T.filter((t,i)=>M[i]>0);return o.length?pick(o):'spitter';}
function tunSpawn(c,x,y,sec){const out=[],add=(t,el)=>{const e=mkEnemy(t,x+R(-14,14),y+R(-14,14));if(el)eliteOf(e,el);e.sec=sec;enemies.push(e);out.push(e);};
  const t={g:'ghoul',s:'spitter',b:'brute',w:'bomb',h:(MIX[D.i]||[])[4]?'howl':'ghoul',x:tunSpecial(),E:'ghoul',B:'brute',r:'rat'}[c];
  if(t==='rat')for(let i=0;i<5;i++)add('rat');else add(t,c==='E'||c==='B'?pick(['schnell','brennend','spaltend','gepanzert']):0);return out;}
const inR=(r,x,y)=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3];
function tunUpdate(dt){const T=TUN;if(!T||T.done)return;P.wet=inR(FLOOD,P.x,P.y);
  // side room: optional elite guard
  if(!T.room&&inR(TL[2],P.x,P.y)){T.room=1;const[e]=tunSpawn('B',1190,190,-1);tunSpawn('g',1120,300,-1);tunSpawn('g',1270,300,-1);toast('Der Betriebsraum ist bewacht');sfx('horn');}
  // current section: trigger packs, open the gate when everything it spawned is down
  const s=TSEC[T.sec];if(s){for(const[i,p]of s.packs.entries()){if(T['p'+T.sec+'_'+i]||!inR(p.tr,P.x,P.y))continue;T['p'+T.sec+'_'+i]=1;[...p.ty].forEach((c,j)=>{const q=p.at[j%p.at.length];tunSpawn(c,q[0],q[1],T.sec);});sfx('horn');}
    const all=s.packs.every((p,i)=>T['p'+T.sec+'_'+i]),alive=enemies.some(e=>e.sec===T.sec&&e.hp>0);
    if(all&&!alive&&T.sec<TSEC.length-1&&!(T.sec===0&&P.x<660&&P.y<420)){if(s.gate)openGate(TSEC.filter((q,i)=>q.gate&&i<=T.sec).length-1);T.sec++;run.wave=T.sec+1;banner(tunName(T.k,TSEC[T.sec].n));}}
  // generator: walk to it to start, charge while you stay close, waves come out of the tunnel mouth, then Der Schaffner
  if(T.sec===TSEC.length-1){const d=Math.hypot(P.x-GEN.x,P.y-GEN.y);if(!T.hold&&d<70){T.hold=1;T.p=0;T.sp=1;banner('Generator anwerfen');toast('Bleib beim Generator, bis der Strom fließt');sfx('zap');}
    if(T.hold&&!T.lit){if(d<GEN.r){T.p+=dt;T.sp-=dt;}if(T.sp<=0){T.sp=R(1.8,2.6);const q=pick([[2240,1680],[2240,1770],[2230,1540],[2230,1900]]);tunSpawn(pick('ggsgxr'),q[0],q[1],9);if(T.p>GEN.need*.5&&!T.el){T.el=1;tunSpawn('B',2230,1720,9);}}
      if(T.p>=GEN.need){T.lit=1;T.gen.lights.push({x:GEN.x,y:GEN.y,z:40,r:200});for(const b of blds)if(b.draw===drawCol&&b.y>1400)b.lights.push({x:b.x+8,y:b.y+16,z:90,r:110});neons.push({x:GEN.x,y:GEN.y,z:60,c:'#f2d14b',s:60});
        sfx('win');flashT=.2;banner('Strom!');const b=mkEnemy('boss',2230,1720,false);b.st=run.tl?run.tl.t:0;b.name='Der Schaffner';b.v=-1;b.col='#3a4a5a';enemies.push(b);run.boss=b;T.boss=1;for(let i=0;i<3;i++)tunSpawn('g',2230,1650+i*60,9);toast('Aus dem Tunnel kommt etwas Großes');}}
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
  <div class="sub">Unter der Stadt: Tunnel, Betriebsraum, Einsturz, Geisterbahnhof ${L.g}, geflutete Strecke, Zugwrack. Am Bahnsteig ${STN[k+1].slice(2)} den Generator anwerfen und halten.</div>
  <div class="dgrid"><span>Gegnerstufe</span><b>${DIST[k].lvl+7+S.threat*3}+</b><span>Endgegner</span><b>Der Schaffner</b><span>Lohn</span><b>${fr?'Schrott und Beute':DIST[k+1].n+' freigeschaltet'}</b></div></div>`;}
