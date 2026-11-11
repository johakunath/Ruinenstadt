/* ================= Basis (v0.56, decision L2; v0.83 moved to S+U Warschauer Straße with stations): the camp as a walkable underground station =================
   A disused U-Bahn station (since v0.83 S+U Warschauer Straße). You walk around; stepping into a glowing ring opens that place's menu (Werkstatt, Lager, Aufträge, Lagerfeuer,
   Bauplätze). The train on the track leaves for the network map (camp menu), which stays as the quick way in. state 'base': no run, no enemies, menus from the camp (invFrom 'base').
   Map 2400 x 1500: tracks in the north (y 200 to 560), platform hall south of the yellow edge. Reuses the tunnel art from js/ubahn.js */
const BZ=[];// zones {x,y,r,n,act,near}
function baseSign(n,col){const c=cnv(280,34),g=c.getContext('2d');g.font='600 17px "Barlow Condensed",sans-serif';const w=Math.min(276,g.measureText(n).width+20);g.fillStyle='rgba(13,9,7,.85)';g.fillRect(140-w/2,2,w,30);g.strokeStyle=col||'#ef9f27';g.lineWidth=1.5;g.strokeRect(140-w/2+.5,2.5,w-1,29);g.fillStyle=col||'#ead9c0';g.textAlign='center';g.fillText(n,140,23);return c;}
function basePerson(col){const c=cnv(30,56),g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(15,52,11,4,0,0,7);g.fill();g.fillStyle='#2a221c';g.fillRect(9,38,5,14);g.fillRect(16,38,5,14);
  g.fillStyle=col;rr(g,7,20,16,20,4);g.fillStyle='#d9b48f';g.beginPath();g.arc(15,13,6.5,0,7);g.fill();g.fillStyle='rgba(0,0,0,.25)';g.fillRect(7,34,16,3);return c;}
// billboard sprite (sign, person): footprint centre x,y, drawn upright and depth-sorted like trees
const bBoard=(x,y,spr,top)=>blds.push({x:x-spr.width/2,y,w:spr.width,h:0,top:top||spr.height,spr,lights:[]});
// v0.83 camp = S+U Warschauer Straße (Xhain), open after the S3 tunnel. Platform hall in the north, side rooms in the south: old toilets (Lazarett), station bakery (Imbiss),
// a corridor to the stairs, a mezzanine (Exerzierplatz) and the maintenance room (Zeughaus, Hackerspace). Stations from CST, art from js/camp-art.js (SVG, rasterized once)
const SVGC={};function svgCnv(k,svg){if(SVGC[k])return SVGC[k];const m=svg.match(/width="(\d+)"[^>]*height="(\d+)"/),c=cnv(+m[1],+m[2]),im=new Image();im.onload=()=>c.getContext('2d').drawImage(im,0,0);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);return SVGC[k]=c;}
const cArt=(grp,k,i)=>typeof CAMPSVG!=='undefined'&&CAMPSVG[grp]&&CAMPSVG[grp][k]?svgCnv(grp+k+(i||0),i==null?CAMPSVG[grp][k]:CAMPSVG[grp][k][i]):null;
function floorT(g,x0,y0,x1,y1,t,cols,ln){for(let y=y0;y<y1;y+=t)for(let x=x0;x<x1;x+=t){g.fillStyle=cols[((x-x0)/t+(y-y0)/t)%cols.length|0];g.fillRect(x+(ln||1),y+(ln||1),Math.min(t,x1-x)-(ln||1),Math.min(t,y1-y)-(ln||1));}}
function buildBase(keepPos){if(typeof koepResetCache==='function')koepResetCache(null);D=Object.assign({},DIST[1],{n:'S+U Warschauer Straße',base:1,tun:0,geo:null,wet:0,day:0,cyber:0,dark:.62,nc:'6,5,4'});TUN=null;
  WS=2400;WH=1760;[SX,SY]=[1200,780];G=cnv(WS,WH);G.k=1;gx=G.getContext('2d');walls=[];blds=[];barrels=[];reserved=[];marks=[];brk=[];spati=null;darks=[];waters=[];neons=[];shrines=[];ROADS=[];BLK=[];BZ.length=0;
  const g=gx;g.fillStyle='#0b0a09';g.fillRect(0,0,WS,WH);
  // track bed with two tracks, platform edge
  g.fillStyle='#1d1a17';g.fillRect(200,200,2000,360);for(let i=0;i<3000;i++){g.fillStyle=pick(['#26221e','#16130f','#2c2722']);g.fillRect(R(200,2200),R(200,560),R(3,8),R(3,6));}
  for(const c of [290,470]){g.fillStyle='#2e2219';for(let x=210;x<2200;x+=46)g.fillRect(x,c-62,16,124);for(const r of [-36,36]){g.fillStyle='#6a6258';g.fillRect(200,c+r-3,2000,6);g.fillStyle='rgba(255,240,220,.14)';g.fillRect(200,c+r-3,2000,2);}}
  // floors: hall tiles, toilet tiles, bakery checker, corridor concrete, rubber mezzanine, oily maintenance concrete
  floorT(g,200,560,2200,1110,40,['#46453f','#3a3934','#42413b','#4a4842']);
  floorT(g,200,1110,710,1490,20,['#bdb8aa','#a9a496','#b3ae9f']);floorT(g,710,1110,1100,1430,30,['#6a3a2a','#cbbfa8']);
  floorT(g,1100,1110,1300,1760,50,['#3a3833','#34322d']);floorT(g,1300,1300,1890,1700,60,['#2f3a2f','#334033']);floorT(g,1890,1110,2200,1700,80,['#33302b','#2d2a26']);floorT(g,1310,1110,1890,1295,40,['#24221e','#201e1a']);
  for(let i=0;i<70;i++){g.fillStyle=`rgba(${pick(['20,14,8','60,40,20','10,10,10'])},${R(.08,.25)})`;g.beginPath();g.ellipse(R(220,2180),R(580,1690),R(10,60),R(6,30),R(0,3),0,7);g.fill();}// grime
  g.fillStyle='#ed9e25';g.fillRect(200,560,2000,14);g.fillStyle='rgba(0,0,0,.35)';for(let x=200;x<2200;x+=28)g.fillRect(x,560,8,14);
  g.fillStyle='rgba(60,40,24,.5)';g.beginPath();g.ellipse(1200,880,170,95,0,0,7);g.fill();
  // walls: tiled back wall with the station sign, outer walls, room walls with doorways
  const TT=tileTex(0),SG=signTex('Warschauer Straße'),wall=(x,y,w,h,tx,H)=>{H=H||46;const b={x,y,w,h,H,top:H,R0:0,ax:w>=h?'x':'y',tx:tx||TT,lights:[],draw:drawTile};blds.push(b);walls.push({x,y,w,h});return b;};
  for(let x=200;x<2200;x+=200)blds.push({x,y:184,w:200,h:16,H:120,top:120,R0:0,ax:'x',tx:(x/200)%3===1?SG:TT,lights:[{x:x+100,y:200,z:100,r:140}],draw:drawTile});
  walls.push({x:0,y:0,w:WS,h:200},{x:0,y:0,w:200,h:WH},{x:2200,y:0,w:200,h:WH},{x:0,y:1700,w:WS,h:60},{x:200,y:200,w:2000,h:350});
  for(let y=200;y<1500;y+=200)wall(184,y,16,Math.min(200,1500-y),0,110);
  // south wall of the hall with four doorways: toilets, bakery, corridor, maintenance
  for(const[x0,x1]of[[200,420],[520,830],[930,1100],[1300,1990],[2090,2200]])for(let x=x0;x<x1;x+=200)wall(x,1100,Math.min(200,x1-x),14);
  wall(700,1114,14,380);wall(200,1490,514,14);// toilets
  wall(1086,1114,14,320);wall(714,1430,386,14);wall(1086,1430,14,270);// bakery, corridor west side
  wall(1300,1114,14,186);wall(1314,1286,576,14);wall(1880,1114,14,586);// corridor east, mezzanine north, maintenance west
  solid_({x:700,y:400,w:800,h:150,H:110,TH:110},drawTrain);
  for(let x=400;x<=2000;x+=400)solid_({x:x-13,y:687,w:26,h:26,H:120,lights:[{x,y:713,z:110,r:170}]},drawCol);
  const light=(x,y,r)=>blds.push({x:x-1,y,w:2,h:0,top:1,spr:cnv(2,1),lights:[{x,y,z:90,r}]});light(450,1300,190);light(900,1260,180);light(1200,1500,150);light(1600,1480,200);light(2040,1380,210);
  // dressing (deco SVGs)
  const deco=(k,x,y,sc)=>{const c=cArt('deco',k);if(c){blds.push({x:x-c.width/2,y,w:c.width,h:0,top:c.height,spr:c,sc:sc||1,lights:[]});walls.push({x:x-40*(sc||1),y:y-22,w:80*(sc||1),h:24});}};
  deco('klo',300,1160);deco('klo',600,1160);deco('theke',800,1160);deco('kiosk',2120,700);deco('automat',1480,620);deco('automat',1560,620);deco('bank',880,630);deco('bank',1720,1060);deco('plakat',1150,1112,.8);deco('treppe',1200,1700,1.2);
  // places: [x,y,name,action]
  const place=(x,y,n,act,col)=>{BZ.push({x,y,r:62,n,act,near:false});bBoard(x,y-60,baseSign(n,col),120);marks.push({x,y,n});};
  place(1100,640,'Abfahrt · Netzplan',()=>leaveBase(),'#7dd3ff');
  barrels.push({x:1200,y:880,ph:0,camp:1});walls.push({x:1186,y:872,w:28,h:16});
  for(const c of CST){const l=cLv(c.k),sp=cArt('st',c.k,l-1);if(sp)blds.push({x:c.x-sp.width/2,y:c.y,w:sp.width,h:0,top:sp.height,spr:sp,lights:[]});else lowBox(c.x-55,c.y-30,110,40,30+15*l,'#5a4636','cont');walls.push({x:c.x-60,y:c.y-34,w:120,h:36});
    if(npcHere(c.npc)){const f=cArt('npc',c.npc);bBoard(c.x-78,c.y+30,f||basePerson('#7a3a2a'));walls.push({x:c.x-88,y:c.y+22,w:20,h:12});}
    const rx=c.x+20,ry=c.y+82;BZ.push({x:rx,y:ry,r:52,n:c.n,act:()=>openStn(c.k),near:false});bBoard(c.x,c.y+4,baseSign(c.n+' · '+l+'/3','#ef9f27'),(sp?sp.height:90)+38);marks.push({x:rx,y:ry,n:c.n});}
  if(!keepPos)BZ.forEach(z=>z.near=Math.hypot(z.x-SX,z.y-SY)<z.r);else BZ.forEach(z=>z.near=P&&Math.hypot(z.x-P.x,z.y-P.y)<z.r+30);gridBuild();
  const k=192/3200;MB=cnv(Math.ceil(WS*k),Math.ceil(WH*k));MB.getContext('2d').drawImage(G,0,0,MB.width,MB.height);MB2=cnv(600,Math.ceil(WH*600/WS));MB2.getContext('2d').drawImage(G,0,0,MB2.width,MB2.height);}
function solid_(b,draw){b.lights=b.lights||[];b.top=b.top||b.H;b.R0=0;b.draw=draw;blds.push(b);walls.push(b);return b;}
function enterBase(){initAudio();immerse();run=null;buildBase();newPlayer();ST=stats();P.hp=ST.maxHp;enemies=[];drops=[];parts=[];nums=[];swings=[];eproj=[];pproj=[];npc=null;captive=null;zone=null;crate=null;trove=null;cam.x=null;
  ['menu','inv','end','perk','trade'].forEach(i=>$(i).hidden=true);document.body.classList.add('base');state='base';last=performance.now();banner('S+U Warschauer Straße');tip('base','Lauf in einen leuchtenden Ring vor einer Station, um sie zu öffnen. Der Zug bringt dich zum Netzplan.');}
function leaveBase(){document.body.classList.remove('base');clearInput();state='menu';buildWorld(DIST[S.dist]);newPlayer();ST=stats();P.hp=ST.maxHp;cam.x=null;renderMenu();$('menu').hidden=false;}
function baseMenu(tab){clearInput();invTab=tab;state='baseinv';openInv('base');}
function baseUpdate(dt){padPoll();let mx=joy.x+pad.mx,my=joy.y+pad.my;if(keys.KeyA||keys.ArrowLeft)mx-=1;if(keys.KeyD||keys.ArrowRight)mx+=1;if(keys.KeyW||keys.ArrowUp)my-=1;if(keys.KeyS||keys.ArrowDown)my+=1;
  let ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;ml=1;}if(ml>0){const q=s2w(mx,my);mx=q[0];my=q[1];}/* v0.65: constant SCREEN speed (vertical used to be half as fast in 2:1 iso) */P.mvx=mx;P.mvy=my;
  const gaitX=P.x,gaitY=P.y;P.x+=mx*ST.spd*dt;P.y+=my*ST.spd*dt;if(ml>.15)P.face=Math.atan2(my,mx);collide(P);heroAdvance(P,ST,gaitX,gaitY,dt);P.swingT-=dt;dashReq=false;skillReq=false;
  for(const z of BZ){const d=Math.hypot(z.x-P.x,z.y-P.y);if(d<z.r&&!z.near){z.near=true;sfx('bell');z.act();return;}if(d>z.r+30)z.near=false;}}
// ground rings for the places (ground layer, world coords)
function baseDraw(t){if(!D.base)return;for(const z of BZ){const a=.35+.2*Math.sin(t*.004+z.x);ctx.strokeStyle=`rgba(239,159,39,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,7);ctx.stroke();ctx.fillStyle='rgba(239,159,39,.06)';ctx.fill();}}
