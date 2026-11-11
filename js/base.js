/* ================= Basis (v0.56, decision L2): the camp as a walkable underground station =================
   A disused U-Bahn station under Lindenstraße (Köpenick). You walk around; stepping into a glowing ring opens that place's menu (Werkstatt, Lager, Aufträge, Lagerfeuer,
   Bauplätze). The train on the track leaves for the network map (camp menu), which stays as the quick way in. state 'base': no run, no enemies, menus from the camp (invFrom 'base').
   Map 2400 x 1500: tracks in the north (y 200 to 560), platform hall south of the yellow edge. Reuses the tunnel art from js/ubahn.js */
const BZ=[];// zones {x,y,r,n,act,near}
function baseSign(n,col){const c=cnv(280,34),g=c.getContext('2d');g.font='600 17px "Barlow Condensed",sans-serif';const w=Math.min(276,g.measureText(n).width+20);g.fillStyle='rgba(13,9,7,.85)';g.fillRect(140-w/2,2,w,30);g.strokeStyle=col||'#ef9f27';g.lineWidth=1.5;g.strokeRect(140-w/2+.5,2.5,w-1,29);g.fillStyle=col||'#ead9c0';g.textAlign='center';g.fillText(n,140,23);return c;}
function basePerson(col){const c=cnv(30,56),g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(15,52,11,4,0,0,7);g.fill();g.fillStyle='#2a221c';g.fillRect(9,38,5,14);g.fillRect(16,38,5,14);
  g.fillStyle=col;rr(g,7,20,16,20,4);g.fillStyle='#d9b48f';g.beginPath();g.arc(15,13,6.5,0,7);g.fill();g.fillStyle='rgba(0,0,0,.25)';g.fillRect(7,34,16,3);return c;}
// billboard sprite (sign, person): footprint centre x,y, drawn upright and depth-sorted like trees
const bBoard=(x,y,spr,top)=>blds.push({x:x-spr.width/2,y,w:spr.width,h:0,top:top||spr.height,spr,lights:[]});
function buildBase(){if(typeof koepResetCache==='function')koepResetCache(null);D=Object.assign({},DIST[0],{n:'Basis Lindenstraße',base:1,tun:0,geo:null,wet:0,day:0,cyber:0,dark:.62,nc:'6,5,4'});TUN=null;
  WS=2400;WH=1500;[SX,SY]=[1200,760];G=cnv(WS,WH);G.k=1;gx=G.getContext('2d');walls=[];blds=[];barrels=[];reserved=[];marks=[];brk=[];spati=null;darks=[];waters=[];neons=[];shrines=[];ROADS=[];BLK=[];BZ.length=0;
  const g=gx;g.fillStyle='#0b0a09';g.fillRect(0,0,WS,WH);
  // track bed with two tracks, tiled platform, yellow edge
  g.fillStyle='#1d1a17';g.fillRect(200,200,2000,360);for(let i=0;i<3000;i++){g.fillStyle=pick(['#26221e','#16130f','#2c2722']);g.fillRect(R(200,2200),R(200,560),R(3,8),R(3,6));}
  for(const c of [290,470]){g.fillStyle='#2e2219';for(let x=210;x<2200;x+=46)g.fillRect(x,c-62,16,124);for(const r of [-36,36]){g.fillStyle='#6a6258';g.fillRect(200,c+r-3,2000,6);g.fillStyle='rgba(255,240,220,.14)';g.fillRect(200,c+r-3,2000,2);}}
  for(let y=560;y<1300;y+=40)for(let x=200;x<2200;x+=40){g.fillStyle=pick(['#46453f','#3a3934','#42413b','#4a4842']);g.fillRect(x+1,y+1,38,38);}
  g.fillStyle='#ed9e25';g.fillRect(200,560,2000,14);g.fillStyle='rgba(0,0,0,.35)';for(let x=200;x<2200;x+=28)g.fillRect(x,560,8,14);
  g.fillStyle='rgba(60,40,24,.5)';g.beginPath();g.ellipse(1200,960,190,110,0,0,7);g.fill();// warm worn floor around the fire
  // walls: back wall behind the tracks (tiles, station signs), west wall; the track bed is fenced off except at the train door
  const TT=tileTex(0),SG=signTex('Lindenstraße');for(let x=200;x<2200;x+=200)blds.push({x,y:184,w:200,h:16,H:120,top:120,R0:0,ax:'x',tx:(x/200)%3===1?SG:TT,lights:[{x:x+100,y:200,z:100,r:140}],draw:drawTile});
  for(let y=200;y<1300;y+=200)blds.push({x:184,y,w:16,h:Math.min(200,1300-y),H:120,top:120,R0:0,ax:'y',tx:TT,lights:[],draw:drawTile});
  walls.push({x:0,y:0,w:WS,h:200},{x:0,y:0,w:200,h:WH},{x:2200,y:0,w:200,h:WH},{x:0,y:1300,w:WS,h:200},{x:200,y:200,w:2000,h:350});
  solid_({x:700,y:400,w:800,h:150,H:110,TH:110},drawTrain);
  for(let x=400;x<=2000;x+=400)solid_({x:x-13,y:687,w:26,h:26,H:120,lights:[{x,y:713,z:110,r:170}]},drawCol);
  // places: [x,y,name,menu tab]
  const place=(x,y,n,act,col)=>{BZ.push({x,y,r:62,n,act,near:false});bBoard(x,y-60,baseSign(n,col),120);marks.push({x,y,n});};
  place(1100,640,'Abfahrt · Netzplan',()=>leaveBase(),'#7dd3ff');
  lowBox(380,860,120,46,38,'#5a4636','cont');lowBox(400,830,40,26,58,'#6a5a46','cont');place(440,960,'Werkstatt',()=>baseMenu('shop'));
  for(const[x,y,w,h,H]of[[330,1150,60,50,44],[400,1160,70,46,36],[340,1110,46,40,72]])lowBox(x,y,w,h,H,'#7a5530','cont');place(440,1250,'Lager',()=>baseMenu('stash'));
  lowBox(1900,820,120,10,80,'#2a2622','cont');place(1960,900,'Ilse · Aufträge',()=>baseMenu('jobs'));
  barrels.push({x:1200,y:950,ph:0,camp:1});walls.push({x:1186,y:942,w:28,h:16});BZ.push({x:1200,y:950,r:95,n:'Lagerfeuer',act:()=>baseMenu('shop'),near:false});bBoard(1200,880,baseSign('Lagerfeuer · Essen'),130);
  // camp buildings: built ones stand as structures, the rest as marked building plots
  const spots={turm:[1700,1150],sani:[1450,1180],garten:[900,1180],halle:[650,1180],funk:[2050,1150],presse:[750,900],lampe:[1650,880]};
  for(const c of CAMP){const[x,y]=spots[c.k]||[1200,1200],b=S.camp[c.k];if(b)baseBuilding(c.k,x,y);else{g.strokeStyle='rgba(239,159,39,.55)';g.lineWidth=3;g.setLineDash([12,8]);g.strokeRect(x-60,y-40,120,80);g.setLineDash([]);}
    BZ.push({x,y,r:58,n:c.n,act:()=>baseMenu('shop'),near:false});bBoard(x,y-50,baseSign(b?c.n:'Bauplatz · '+c.n+' · '+c.p,b?'#ead9c0':'#a8957d'),110);}
  // survivors around the fire
  const sv=SURV.filter(s=>hasS(s.k));sv.forEach((s,i)=>{const a=i/Math.max(1,sv.length)*6.283+.4;bBoard(1200+Math.cos(a)*120,950+Math.sin(a)*70,basePerson(s.c));});
  bBoard(1960,880,basePerson('#7a3a2a'));// Ilse at her board
  BZ.forEach(z=>z.near=Math.hypot(z.x-SX,z.y-SY)<z.r);gridBuild();
  const k=192/3200;MB=cnv(Math.ceil(WS*k),Math.ceil(WH*k));MB.getContext('2d').drawImage(G,0,0,MB.width,MB.height);MB2=cnv(600,Math.ceil(WH*600/WS));MB2.getContext('2d').drawImage(G,0,0,MB2.width,MB2.height);}
function solid_(b,draw){b.lights=b.lights||[];b.top=b.top||b.H;b.R0=0;b.draw=draw;blds.push(b);walls.push(b);return b;}
function baseBuilding(k,x,y){const B={turm:()=>{lowBox(x-30,y-30,60,60,170,'#4a3424','cont');},sani:()=>{lowBox(x-60,y-35,120,70,56,'#d6cfc0','cont');},garten:()=>{for(let i=0;i<3;i++)lowBox(x-60+i*42,y-20,34,44,18,'#3B6D11','cont');},
    halle:()=>{lowBox(x-70,y-40,140,80,80,'#4a4740','cont');},funk:()=>{lowBox(x-10,y-10,20,20,230,'#3a342e','cont');},presse:()=>{lowBox(x-40,y-30,80,60,60,'#55524c','cont');},lampe:()=>{lowBox(x-45,y-25,90,50,40,'#5a3a2e','cont');}}[k];if(B)B();}
function enterBase(){initAudio();immerse();run=null;buildBase();newPlayer();ST=stats();P.hp=ST.maxHp;enemies=[];drops=[];parts=[];nums=[];swings=[];eproj=[];pproj=[];npc=null;captive=null;zone=null;crate=null;trove=null;cam.x=null;
  ['menu','inv','end','perk','trade'].forEach(i=>$(i).hidden=true);document.body.classList.add('base');state='base';last=performance.now();banner('Basis Lindenstraße');tip('base','Lauf in einen leuchtenden Ring, um ihn zu öffnen. Der Zug bringt dich zum Netzplan.');}
function leaveBase(){document.body.classList.remove('base');clearInput();state='menu';buildWorld(DIST[S.dist]);newPlayer();ST=stats();P.hp=ST.maxHp;cam.x=null;renderMenu();$('menu').hidden=false;}
function baseMenu(tab){clearInput();invTab=tab;state='baseinv';openInv('base');}
function baseUpdate(dt){padPoll();let mx=joy.x+pad.mx,my=joy.y+pad.my;if(keys.KeyA||keys.ArrowLeft)mx-=1;if(keys.KeyD||keys.ArrowRight)mx+=1;if(keys.KeyW||keys.ArrowUp)my-=1;if(keys.KeyS||keys.ArrowDown)my+=1;
  let ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;ml=1;}if(ml>0){const q=s2w(mx,my);mx=q[0];my=q[1];}/* v0.65: constant SCREEN speed (vertical used to be half as fast in 2:1 iso) */P.mvx=mx;P.mvy=my;
  P.x+=mx*ST.spd*dt;P.y+=my*ST.spd*dt;if(ml>.15){P.walk+=dt*heroGait(P,ST).cadence;P.face=Math.atan2(my,mx);}collide(P);P.swingT-=dt;dashReq=false;skillReq=false;
  for(const z of BZ){const d=Math.hypot(z.x-P.x,z.y-P.y);if(d<z.r&&!z.near){z.near=true;sfx('bell');z.act();return;}if(d>z.r+30)z.near=false;}}
// ground rings for the places (ground layer, world coords)
function baseDraw(t){if(!D.base)return;for(const z of BZ){const a=.35+.2*Math.sin(t*.004+z.x);ctx.strokeStyle=`rgba(239,159,39,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,7);ctx.stroke();ctx.fillStyle='rgba(239,159,39,.06)';ctx.fill();}}
