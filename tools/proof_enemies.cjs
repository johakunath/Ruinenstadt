// Task 01. Serve this checkout on 8767 and an unchanged v0.63 on 8765.
// Run: node tools/proof_enemies.cjs. ENEMY_PROOF_PHASE=visual|perf can isolate a phase.
// Performance runs in a fresh browser only after all visual/offline contexts close.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'pipeline/proof/01-enemies');
const port=Number(process.env.ENEMY_PROOF_PORT||8767),baselinePort=Number(process.env.ENEMY_BASELINE_PORT||8765);
const variants='ghoul brute spitter rat crow shield bomb howl raser schrottkoloss kabel bass uhr wurz kern brigadeghoul'.split(' ');
const poses='idle walk-a walk-b attack-a attack-b hit'.split(' ');
const launch=()=>chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const settings={viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'block'};
const report={targetPort:port,baselinePort,started:new Date().toISOString(),errors:[],failedImages:[],gallery:[],scenes:[],behavior:{}};
fs.mkdirSync(out,{recursive:true});
const save=(name,data)=>fs.writeFileSync(path.join(out,name),JSON.stringify(data,null,2)+'\n');
const imageData=(name,data)=>fs.writeFileSync(path.join(out,name),Buffer.from(data.split(',')[1],'base64'));
function watch(page,label,{expected404}={}){
 const errors=[],failedImages=[],expected=[];
 page.on('pageerror',e=>errors.push({label,message:e.message}));
 page.on('response',r=>{if(r.request().resourceType()==='image'&&r.status()>=400){const item={status:r.status(),url:r.url()};(expected404&&r.url().includes(expected404)?expected:failedImages).push(item);}});
 page.on('requestfailed',r=>{if(r.resourceType()==='image')failedImages.push({url:r.url(),failure:r.failure()?.errorText});});
 return{errors,failedImages,expected};
}
async function loadEnemyArt(page){
 return page.evaluate(async()=>{await spriteReady;const keys=Object.keys(SPRITES).filter(k=>k.startsWith('enemies/'));for(const key of keys)spr(key);await Promise.all(keys.map(key=>SPRIMG[key].decode()));return{count:keys.length,keys};});
}
// All helpers below execute inside the page: every external input is passed as an argument.
async function installHelpers(page){
 await page.evaluate(()=>{
  window.__enemyProof={
   reset(di,tun){Math.random=rngFrom(12345);startRun(di,false,false,tun==null?undefined:tun);resize();state='paused';P.dark=false;P.inv=0;P.dashT=P.swingT=P.walk=P.mvx=P.mvy=P.spin=0;document.getElementById('banner').style.display='none';document.getElementById('toasts').style.display='none';return Z;},
   enemy(variant,pose='idle',face=1){D.gdr=variant==='brigadeghoul'?1:0;const type=variant==='brigadeghoul'?'ghoul':variant==='schrottkoloss'?'boss':variant,e=mkEnemy(type,0,0);e.big=false;e.hcd=1;e.fire=5;e.stun=0;e.flash=0;e.mv=0;e.atk=0;e.t=1;e.rdx=face;e.rdy=0;if(pose==='walk-a'||pose==='walk-b'){e.mv=60;e.t=pose==='walk-b'?1.2:1;}if(pose==='attack-a')e.atk=.05;if(pose==='attack-b')e.atk=.24;if(pose==='hit')e.flash=.1;return e;},
   card(variant,pose,face,factor,extra={}){
    const w=factor===1?220:360,h=factor===1?210:390,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),oldCtx=ctx,oldD=D,oldP=P;
    D={...D};P={...P,x:face*100,y:0};const e=Object.assign(this.enemy(variant,pose,face),extra);
    g.fillStyle='#201c1b';g.fillRect(0,0,w,h);g.fillStyle='#eee2c9';g.font='13px sans-serif';g.fillText(`${variant} / ${pose} / ${face>0?'right':'left'}`,8,19);
    ctx=g;g.save();g.translate(w/2,h-(factor===1?48:96));g.scale(factor,factor);
    // Ring is world-projected; drawEnemy is the actual upright renderer.
    g.strokeStyle='#ffd23f';g.lineWidth=1.1;g.beginPath();for(let j=0;j<=48;j++){const a=j/48*Math.PI*2,x=ix(Math.cos(a)*e.r,Math.sin(a)*e.r),y=iy(Math.cos(a)*e.r,Math.sin(a)*e.r);j?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();
    const choice=enemySprite(e);let painted=0;const real=g.drawImage;g.drawImage=function(im,...args){if(choice&&im===choice.i)painted++;return real.call(this,im,...args);};drawEnemy(e,1200);g.drawImage=real;g.restore();
    const pixels=g.getImageData(0,26,w,h-26).data,bg=[32,28,27];let edge=0,body=0;for(let y=0;y<h-26;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(Math.abs(pixels[i]-bg[0])+Math.abs(pixels[i+1]-bg[1])+Math.abs(pixels[i+2]-bg[2])>30){body++;if(x<2||x>=w-2||y<2||y>=h-28)edge++;}}
    ctx=oldCtx;D=oldD;P=oldP;return{canvas:c,key:choice?.key,painted:pose==='hit'?!!choice:painted>0,edge,body};
   },
   sheet(variants,poses,factor){const w=factor===1?220:360,h=factor===1?210:390,c=document.createElement('canvas');c.width=w*poses.length;c.height=h*variants.length*2;const g=c.getContext('2d'),seen=[];let row=0;for(const variant of variants)for(const face of [1,-1]){for(let j=0;j<poses.length;j++){const cell=this.card(variant,poses[j],face,factor);g.drawImage(cell.canvas,j*w,row*h);seen.push({variant,pose:poses[j],face,key:cell.key,painted:cell.painted,edge:cell.edge,body:cell.body});}row++;}return{data:c.toDataURL(),seen};},
   openGround(offsets){
    const boxes=blds.filter(isBox).map(b=>{const pts=b.rot?obbC(b):[[b.x,b.y],[b.x+b.w,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h]];return{b,x0:Math.min(...pts.map(q=>ix(...q))),x1:Math.max(...pts.map(q=>ix(...q))),y0:Math.min(...pts.map(q=>iy(...q)))-boxTop(b),y1:Math.max(...pts.map(q=>iy(...q)))};});
    const candidates=[];for(let x=100;x<WS-100;x+=45)for(let y=100;y<WH-100;y+=45)candidates.push({x,y,d:Math.hypot(x-SX,y-SY)});candidates.sort((a,b)=>a.d-b.d);
    const open=candidates.find(({x,y})=>offsets.every(q=>{const v=s2w(q[0],q[1]),xx=x+v[0],yy=y+v[1],X=ix(xx,yy),Y=iy(xx,yy);return !inWall(xx,yy,q[2]||22)&&!boxes.some(o=>!front(o.b,xx,yy)&&X>o.x0-30&&X<o.x1+30&&Y>o.y0&&Y-(q[3]||120)<o.y1);}));
    if(!open)throw Error(`No occlusion-free ground for ${D.n}: ${JSON.stringify(offsets)}`);P.x=open.x;P.y=open.y;cam.x=P.x;cam.y=P.y;return open;
   },
   world(types,baseZ,factor){const offsets=[[0,0,22,85],[-85,22],[70,27],[-25,74],[100,75]];types.forEach((type,i)=>{const spec=ENEMY_ART[type==='boss'?'schrottkoloss':type==='ghoul'&&D.gdr?'brigadeghoul':type];offsets[i+1][2]=spec.r+6;offsets[i+1][3]=spec.h*1.3+20;});const open=this.openGround(offsets.slice(0,types.length+1));enemies=types.map((type,i)=>{const q=s2w(...offsets[i+1]),e=mkEnemy(type,P.x+q[0],P.y+q[1]);e.mv=i===1?60:0;e.t=1+i*.21;e.hcd=1;e.fire=4;e.big=false;if(i===types.length-1&&type!=='boss'){e.elite='gepanzert';e.hp*=.7;}return e;});P.face=0;P.swingT=.1;P.swingDur=.2;P.atkA=0;Z=baseZ*factor;VW=SW/Z;VH=SH/Z;render(1200);drawDebug();hud();drawMini();return{district:D.n,open,baseZ,Z,types,enemies:enemies.map(e=>({type:e.type,key:enemySprite(e)?.key,r:e.r}))};}
  };
 });
}
async function gallery(page){
 for(const variant of variants)for(const factor of [1,2]){
  const result=await page.evaluate(({variant,poses,factor})=>__enemyProof.sheet([variant],poses,factor),{variant,poses,factor}),file=`gallery-${variant}-${factor}x.png`;imageData(file,result.data);report.gallery.push({file,...result,data:undefined});
  const bad=result.seen.filter(c=>!c.painted||c.edge||c.body<20);if(bad.length)throw Error('Undrawn or clipped gallery: '+JSON.stringify(bad));
 }
}
async function worldScenes(page){
 const names=['koepenick','xhain','alexanderplatz','mitte','tempelhof','spandau','marzahn','s3'];
 for(let di=0;di<8;di++){
  const scene=await page.evaluate(di=>{const z=__enemyProof.reset(di===7?0:di,di===7?0:null),extra=['rat','bomb','shield','crow','howl','kabel','bass','uhr','wurz','kern'],types=['ghoul','brute','spitter','raser','boss',...extra.filter((_,i)=>(MIX[D.i]||[])[i]>0)];return{z,types};},di);
  for(let start=0;start<scene.types.length;start+=4)for(const factor of [1,2]){
   const types=scene.types.slice(start,start+4),payload=await page.evaluate(({types,z,factor})=>__enemyProof.world(types,z,factor),{types,z:scene.z,factor}),file=`${names[di]}-${start/4+1}-${factor}x-debug-hit.png`;await page.screenshot({path:path.join(out,file)});report.scenes.push({file,...payload});
  }
 }
}
async function behavior(page){
 const payload=await page.evaluate(({variants})=>{
  __enemyProof.reset(0,null);const results={},images={};
  // Exercise the real hit() block arc with constant damage, no equipped procs.
  const savedST=ST;ST={...ST,els:[]};const damage=(angle,guard=0,stun=0)=>{const e=mkEnemy('shield',P.x+50,P.y);e.hp=e.max=1000;e.fa=angle;e.guard=guard;const hp=e.hp;hit(e,100,false,{knock:0,stun});return{lost:hp-e.hp,guard:e.guard};};
  results.shield={front:damage(Math.PI),rear:damage(0),insideArc:damage(Math.PI+1.19),outsideArc:damage(Math.PI+1.21),open:damage(Math.PI,1),hammer:damage(Math.PI,0,.8)};ST=savedST;
  const cards=[],labels=[];for(const fa of [0,Math.PI/2,Math.PI,Math.PI*1.5])for(const guard of [0,1]){const c=__enemyProof.card('shield','idle',1,2,{fa:sAng(fa),guard});cards.push(c.canvas);labels.push({fa,guard});}const sheet=document.createElement('canvas');sheet.width=360*4;sheet.height=390*2;const sg=sheet.getContext('2d');cards.forEach((c,i)=>{sg.drawImage(c,(i%4)*360,Math.floor(i/4)*390);sg.fillStyle='#fff';sg.fillText(`fa=${labels[i].fa.toFixed(2)} guard=${labels[i].guard}`,i%4*360+8,Math.floor(i/4)*390+38);});images.shield=sheet.toDataURL();
  // Isolated painted crow body bounds: body remains airborne, ring stays on ground.
  const oldCtx=ctx,c=document.createElement('canvas');c.width=240;c.height=240;ctx=c.getContext('2d');ctx.translate(120,180);P.x=100;P.y=0;const crow=__enemyProof.enemy('crow'),g=enemySprite(crow);ctx.save();ctx.scale(1.15,1.15);drawEnemySprite(g,crow,x=>x);ctx.restore();const pix=ctx.getImageData(0,0,240,240).data;let y0=240,y1=-1;for(let y=0;y<240;y++)for(let x=0;x<240;x++)if(pix[(y*240+x)*4+3]){y0=Math.min(y0,y);y1=Math.max(y1,y);}results.crow={bodyY:[y0,y1],ringY:180,airGap:180-y1};images.crow=c.toDataURL();ctx=oldCtx;
  // Authored mouths are checked against transformed pivots; fireGlob collision values remain legacy.
  results.mouth=[];for(const variant of ['spitter','kern'])for(const face of [1,-1]){P.x=face*100;P.y=0;const e=__enemyProof.enemy(variant,'attack-b',face),choice=enemySprite(e),m=choice.m,mouth=m.pivots.mouth,old=ctx,cv=document.createElement('canvas');cv.width=cv.height=600;ctx=cv.getContext('2d');const real=ctx.drawImage;let expected=null;
   ctx.drawImage=function(img,x,y,w,h){if(img===choice.i){const q=this.getTransform().transformPoint({x:x+mouth[0]/m.w*w,y:y+mouth[1]/m.h*h});expected={x:q.x,y:q.y};}return real.call(this,img,x,y,w,h);};drawEnemy(e,1200);ctx=old;if(!expected)throw Error('Mouth image was not drawn');const actual=enemyMuzzle(e);eproj=[];fireGlob(e,.4,210);const p=eproj[0],logical={x:p.x,y:p.y,vx:p.vx,vy:p.vy,r:p.r,life:p.life},initial={x:ix(p.x,p.y)+(p.mx||0)-ix(e.x,e.y),y:iy(p.x,p.y)-10+(p.my||0)-iy(e.x,e.y)};results.mouth.push({variant,face,key:choice.key,expected,actual,delta:Math.hypot(actual.x-expected.x,actual.y-expected.y),initial,initialDelta:Math.hypot(initial.x-actual.x,initial.y-actual.y),logical,projectile:p});}
  // Real attack-at-contact drawings include the player and both debug ground rings.
  const cw=360,ch=390,contacts=document.createElement('canvas');contacts.width=cw*4;contacts.height=ch*Math.ceil(variants.length/4);const cg=contacts.getContext('2d');results.contacts=[];
  for(let i=0;i<variants.length;i++){const variant=variants[i],oldD=D;D={...D};P.x=0;P.y=0;const e=__enemyProof.enemy(variant,'attack-b');const angle=wAng(0),distance=e.r+P.r;e.x=-Math.cos(angle)*distance;e.y=-Math.sin(angle)*distance;P.x=0;P.y=0;P.face=Math.PI;P.swingT=0;P.walk=P.mvx=P.mvy=P.inv=0;const card=document.createElement('canvas');card.width=cw;card.height=ch;ctx=card.getContext('2d');ctx.fillStyle='#201c1b';ctx.fillRect(0,0,cw,ch);ctx.fillStyle='#eee2c9';ctx.fillText(variant+' contact r+P.r',8,18);ctx.translate(cw/2+20,ch-55);ctx.scale(2,2);upr(e.x,e.y,()=>drawEnemy(e,1200));upr(P.x,P.y,()=>drawPlayer(1200));for(const [o,col]of [[e,'#ffd23f'],[P,'#ff3366']]){ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();for(let j=0;j<=48;j++){const a=j/48*6.283,x=ix(o.x+Math.cos(a)*o.r,o.y+Math.sin(a)*o.r),y=iy(o.x+Math.cos(a)*o.r,o.y+Math.sin(a)*o.r);j?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}cg.drawImage(card,i%4*cw,Math.floor(i/4)*ch);results.contacts.push({variant,distance,required:e.r+P.r,key:enemySprite(e)?.key});D=oldD;}
  ctx=oldCtx;images.contacts=contacts.toDataURL();
  const boss=mkEnemy('boss',P.x+100,P.y);boss.big=true;boss.v=0;boss.hcd=1;const bigCard=__enemyProof.card('schrottkoloss','idle',1,2,{big:true,v:0}),bigPx=bigCard.canvas.getContext('2d').getImageData(0,40,360,290).data;let bigBody=0;for(let i=0;i<bigPx.length;i+=4)if(Math.abs(bigPx[i]-32)+Math.abs(bigPx[i+1]-28)+Math.abs(bigPx[i+2]-27)>30)bigBody++;results.bigBoss={painted:!!enemySprite(boss),big:boss.big,canvasBodyPixels:bigBody};images['big-boss-canvas-fallback']=bigCard.canvas.toDataURL();
  return{results,images};
 },{variants});
 report.behavior=payload.results;for(const [name,data]of Object.entries(payload.images))imageData(`behavior-${name}.png`,data);
 const s=report.behavior.shield;if(s.front.lost!==20||s.rear.lost!==100||s.insideArc.lost!==20||s.outsideArc.lost!==100||s.open.lost!==100||s.hammer.guard<=0)throw Error('Shield blocking regression: '+JSON.stringify(s));
 if(report.behavior.crow.airGap<8)throw Error('Crow body touches the ground ring');
 if(report.behavior.mouth.some(x=>x.delta>.01||x.initialDelta>.01||x.logical.x!==0||x.logical.y!==-14||Math.abs(x.logical.vx-Math.cos(.4)*210)>.001||Math.abs(x.logical.vy-Math.sin(.4)*210)>.001||x.logical.life!==3.5))throw Error('Mouth pivot / visual origin / logical spawn regression');
 if(report.behavior.bigBoss.painted||report.behavior.bigBoss.canvasBodyPixels<30)throw Error('Task 06 district boss canvas fallback missing');
 // Actual world render: charge line, first-frame mouth projectiles and overlays.
 const action=await page.evaluate(()=>{
  const baseZ=__enemyProof.reset(0,null);__enemyProof.world(['raser','spitter','bass','crow'],baseZ,2);P.swingT=0;enemies[0].ch=.4;const a=Math.atan2(P.y-enemies[0].y,P.x-enemies[0].x);enemies[0].rdx=Math.cos(a);enemies[0].rdy=Math.sin(a);enemies[1].cast=.22;enemies[1].atk=.24;enemies[2].tw=.4;enemies[2].twm=.8;enemies[2].elite='schnell';enemies[2].hp*=.6;enemies[3].dive=.3;enemies[3].rdx=-1;enemies[3].rdy=0;eproj=[];fireGlob(enemies[1],Math.atan2(P.y-enemies[1].y,P.x-enemies[1].x),210);
  const text=[],real=ctx.fillText;ctx.fillText=function(s,...args){text.push(String(s));return real.call(this,s,...args);};render(1200);drawDebug();hud();drawMini();ctx.fillText=real;
  return{charge:{start:[enemies[0].x,enemies[0].y],projected:[scx(enemies[0].x,enemies[0].y),scy(enemies[0].x,enemies[0].y)],key:enemySprite(enemies[0])?.key},mouth:{enemy:enemies[1].type,offset:enemyMuzzle(enemies[1]),projectile:eproj[0]},eliteText:text.filter(s=>s.includes('Elite')),hud:{hp:document.getElementById('hpt').textContent,district:document.getElementById('dn').textContent,remaining:document.getElementById('rem').textContent}};
 });
 report.behavior.action=action;await page.screenshot({path:path.join(out,'behavior-charge-spit-elite-hud-2x.png')});if(!action.eliteText.length||!action.hud.hp||!action.hud.district)throw Error('Elite / HP / district HUD missing');
}
async function fallback(browser){
 const context=await browser.newContext(settings),page=await context.newPage(),missing='assets/enemies/brute-idle.webp',events=watch(page,'fallback',{expected404:missing});
 try{
  await page.route('**/'+missing,r=>r.fulfill({status:404,contentType:'text/plain',body:'intentional enemy proof missing frame'}));
  await page.goto(`http://127.0.0.1:${port}/index.html?debug=hit`);await page.evaluate(async()=>{await spriteReady;spr('enemies/brute-idle');});await page.waitForFunction(()=>SPRIMG['enemies/brute-idle']?.complete);
  const result=await page.evaluate(()=>{startRun(0,false);state='paused';window.requestAnimationFrame=()=>0;P.x=100;P.y=0;const e=mkEnemy('brute',0,0);e.hcd=1;e.mv=e.flash=e.atk=e.stun=0;const c=document.createElement('canvas');c.width=300;c.height=300;const g=c.getContext('2d'),old=ctx;ctx=g;g.translate(150,245);g.scale(2,2);let bodyPixels=0;const choice=enemySprite(e);drawEnemy(e,1200);ctx=old;const px=g.getImageData(0,0,300,300).data;for(let y=0;y<220;y++)for(let x=0;x<300;x++)if(px[(y*300+x)*4+3])bodyPixels++;return{key:'enemies/brute-idle',failed:!SPRIMG['enemies/brute-idle'].naturalWidth,choice:choice?.key||null,bodyPixels,data:c.toDataURL()};});
  imageData('missing-file-canvas-fallback.png',result.data);report.fallback={...result,data:undefined,...events};if(!result.failed||result.choice!==null||result.bodyPixels<30||events.expected.length!==1||events.errors.length||events.failedImages.length)throw Error('Actual HTTP404 canvas fallback failed: '+JSON.stringify(report.fallback));
 }finally{await context.close();}
}
async function offline(browser){
 const context=await browser.newContext({...settings,serviceWorkers:'allow'}),page=await context.newPage(),events=watch(page,'offline');
 try{
  await page.goto(`http://localhost:${port}/index.html?debug=hit`);await page.evaluate(()=>Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Service worker failed to activate within 25s')),25000))]));await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded',timeout:20000});await page.evaluate(()=>startRun(0,false));await page.waitForTimeout(3000);const decoded=await loadEnemyArt(page);
  const result=await page.evaluate(async keys=>{const names=await caches.keys(),all=await Promise.all(names.map(async name=>({name,urls:(await(await caches.open(name)).keys()).map(r=>new URL(r.url).pathname)})));return{state,version:VERSION,url:location.href,controller:!!navigator.serviceWorker.controller,expected:keys.length,decoded:keys.filter(k=>SPRIMG[k]?.naturalWidth).length,missing:keys.filter(k=>!all.some(c=>c.urls.includes('/assets/'+k+'.webp'))),caches:all.map(c=>({name:c.name,entries:c.urls.length}))};},decoded.keys);
  report.offline={...events,...result};save('offline-reload.json',report.offline);if(result.state!=='play'||!result.controller||result.decoded!==result.expected||result.missing.length||events.errors.length||events.failedImages.length)throw Error('Offline reload/run failed: '+JSON.stringify(report.offline));
 }finally{await context.close();}
}
async function visual(){
 let browser;try{
  browser=await launch();const context=await browser.newContext(settings),page=await context.newPage(),events=watch(page,'smoke/visual');await page.goto(`http://127.0.0.1:${port}/index.html?debug=hit`);await page.evaluate(()=>startRun(0,false));await page.waitForTimeout(3000);report.smoke=await page.evaluate(()=>({state,version:VERSION,enemyCount:enemies.length}));if(report.smoke.state!=='play')throw Error('3s run did not remain in play');
  report.schema=await loadEnemyArt(page);await page.evaluate(()=>{window.requestAnimationFrame=()=>0;});await installHelpers(page);await gallery(page);await worldScenes(page);await behavior(page);report.errors.push(...events.errors);report.failedImages.push(...events.failedImages);await context.close();await fallback(browser);await offline(browser);
  if(report.errors.length||report.failedImages.length)throw Error('Page errors / failed images: '+JSON.stringify({errors:report.errors,failedImages:report.failedImages}));
 }finally{if(browser)await browser.close();}
}
const median=a=>a.slice().sort((a,b)=>a-b)[Math.floor(a.length/2)];
async function performanceProof(){
 let browser;try{
  browser=await launch();const context=await browser.newContext(settings),pages=[],errors=[];for(const pport of [baselinePort,port]){const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${pport}/index.html`);await page.evaluate(async()=>{window.requestAnimationFrame=()=>0;heroPre();await spriteReady;for(const key of Object.keys(SPRITES).filter(k=>k.startsWith('enemies/')))spr(key);await Promise.all(Object.values(SPRIMG).map(i=>i.decode()));await Promise.all(Object.values(HIMG).map(i=>i.decode()));});pages.push(page);}
  const result={method:'Same seeded 40 mixed enemies, maps, viewport, camera and DPR. Seven alternating pairs; 15 warmup and 50 timed full renders each. Visual/offline browser closed before timing.',viewport:settings.viewport,dpr:2,baselinePort,targetPort:port,districts:[],errors};
  for(const di of [0,3]){
   const setups=[];for(const page of pages)setups.push(await page.evaluate(di=>{Math.random=rngFrom(12345);startRun(di,false);resize();state='paused';P.x=SX;P.y=SY;cam.x=P.x;cam.y=P.y;P.inv=P.swingT=P.walk=P.mvx=P.mvy=P.spin=0;const types=['ghoul','brute','spitter','rat','crow','shield','bomb','howl','raser','boss','kabel','bass','uhr','wurz','kern'];enemies=[];for(let j=0;j<40;j++){const q=s2w((j%8-3.5)*34,Math.floor(j/8)*23-32),e=mkEnemy(types[j%types.length],P.x+q[0],P.y+q[1]);e.big=false;e.hcd=1;e.mv=60;e.t=j*.17;e.fire=4;enemies.push(e);}return{version:VERSION,Z,WS,WH,name:D.n,types:enemies.map(e=>e.type),positions:enemies.map(e=>[e.x,e.y,e.r])};},di));
   if(JSON.stringify({...setups[0],version:undefined})!==JSON.stringify({...setups[1],version:undefined}))throw Error('Performance scenes differ: '+JSON.stringify(setups));
   const samples=[];for(let j=0;j<7;j++){const pair={};for(const index of j%2?[1,0]:[0,1])pair[index?'painted':'baseline']=await pages[index].evaluate(()=>{for(let k=0;k<15;k++)render(1200);const times=[];for(let k=0;k<50;k++){const begin=performance.now();render(1200);times.push(performance.now()-begin);}times.sort((a,b)=>a-b);return{median:times[25],p95:times[47]};});samples.push(pair);}
   const before=median(samples.map(p=>p.baseline.median)),after=median(samples.map(p=>p.painted.median));result.districts.push({district:setups[0].name,baselineVersion:setups[0].version,paintedVersion:setups[1].version,enemies:40,samples,medianBaseline:before,medianPainted:after,ratio:after/before});
  }
  if(errors.length)throw Error('Performance page errors: '+errors.join('; '));save('performance.json',result);report.performance=result;
 }finally{if(browser)await browser.close();}
}
(async()=>{try{const phase=process.env.ENEMY_PROOF_PHASE||'all';if(phase==='perf'&&fs.existsSync(path.join(out,'results.json')))Object.assign(report,JSON.parse(fs.readFileSync(path.join(out,'results.json'),'utf8')));report.completedPhases=report.completedPhases||[];if(phase!=='perf'){await visual();report.completedPhases.push('visual');}if(phase!=='visual'){await performanceProof();report.completedPhases.push('perf');}report.completedPhases=[...new Set(report.completedPhases)];report.finished=new Date().toISOString();report.status=report.completedPhases.includes('visual')&&report.completedPhases.includes('perf')?'passed':phase+'-passed';delete report.failure;save('results.json',report);console.log(JSON.stringify({status:report.status,gallery:report.gallery.length,scenes:report.scenes.length,performance:report.performance?.districts.map(d=>({district:d.district,ratio:d.ratio}))},null,2));}catch(error){report.status='failed';report.failure=error.stack;save('results.json',report);console.error(error);process.exitCode=1;}})();
