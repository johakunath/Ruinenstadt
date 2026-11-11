// Task 07 player rig proof. Start `python3 -m http.server 8765` first.
// Generates visual sheets and a deterministic browser smoke report; performance
// comparisons are kept in the main proof harness.
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'pipeline/proof/07-player-rig-v2');
const meta=JSON.parse(fs.readFileSync(path.join(root,'assets/raw/codex/07-player-rig-v2/weapons.json'),'utf8'));
const build=fs.readFileSync(path.join(root,'tools/build_hero.py'),'utf8');
const ids=(build.match(/^WEAP\s*=\s*'([^']+)'\.split\(\)/m)||[])[1]?.split(/\s+/)||[];
if(!ids.length)throw Error('Could not read build_hero.py WEAP icon list');
const kindById={I01:'blade',I02:'blade',I03:'blade',I04:'blade',I05:'blade',I06:'hammer',I07:'hammer',I08:'hammer',I09:'sling',I10:'sling',I11:'sling',I12:'spear',I13:'spear',I14:'spear',I15:'blade',I16:'hammer',I32:'sling',I48:'hammer',I51:'blade',I52:'hammer',I53:'sling',I56:'spear',I59:'blade',I60:'hammer',I61:'sling',I62:'spear'};
const weaponIds=ids.map(id=>({id,kind:kindById[id]}));
for(const w of weaponIds)if(!meta[w.id]||!w.kind)throw Error(`Missing weapon metadata or kind for ${w.id}`);
fs.mkdirSync(out,{recursive:true});

const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const slug=s=>String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let activeBrowser=null;

(async()=>{
 const browser=activeBrowser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'block'});
 const page=await context.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).hostname==='127.0.0.1'&&!r.url().includes('__proof_missing__'))failed.push([r.status(),r.url()]);});
 await page.goto('http://127.0.0.1:8765/index.html?debug=hit');
 await page.waitForFunction(()=>typeof HR==='object'&&HR.v>=2&&typeof drawHero==='function',{timeout:30000});
 const schema=await page.evaluate(async()=>{
   const required=['parts','outfits','hats','gloves','boots','sh','hip','upper','lower','hand'];
   const missing=required.filter(k=>!(k in HR));
   if(missing.length)throw Error('HR v2 schema missing: '+missing.join(', '));
   const fail=[];
   for(const [k,v] of Object.entries(HR.parts))if(!Array.isArray(v)||v.length!==4||v.some(n=>!Number.isFinite(n)))fail.push('invalid HR.parts['+k+']');
   for(const [k,o] of Object.entries(HR.outfits))for(const p of ['t','u','l'])if(!HR.parts[o[p]])fail.push(`outfit ${k} missing ${p} part ${o[p]}`);
   for(const [k,p] of Object.entries(HR.hats))if(!HR.parts[p])fail.push(`hat ${k} missing part ${p}`);
   for(const [k,g] of Object.entries(HR.gloves))for(const p of ['palm','fingers'])if(!HR.parts[g[p]])fail.push(`glove ${k} missing ${p} part`);
   for(const [k,p] of Object.entries(HR.boots))if(!HR.parts[p])fail.push(`boot ${k} missing part ${p}`);
   if(!Array.isArray(HR.sh)||HR.sh.length!==2||Math.abs(HR.sh[0]+.87)>.03||Math.abs(HR.sh[1]+37.33)>.08)fail.push('shared shoulder pivot drift');
   if(HR.hip!==-16||HR.upper!==10||HR.lower!==10||HR.hand!==20)fail.push('shared hip/arm/hand dimensions drift');
   heroPre();
   const names=Object.keys(HR.parts);
   for(const k of names)himg(k);
   await Promise.all(names.map(k=>new Promise(resolve=>{const im=HIMG[k];if(!im)return resolve();if(im.complete)return resolve();im.onload=im.onerror=resolve;setTimeout(resolve,10000);})))
   const failed=names.filter(k=>!HIMG[k]||!HIMG[k].naturalWidth);
   if(failed.length)fail.push('unloaded rig images: '+failed.join(', '));
   return{version:HR.v,partCount:names.length,outfitKeys:Object.keys(HR.outfits),hatKeys:Object.keys(HR.hats),gloveKeys:Object.keys(HR.gloves),bootKeys:Object.keys(HR.boots),fail};
 });
 if(schema.fail.length)throw Error(schema.fail.join('\n'));
 await page.evaluate(()=>{window.requestAnimationFrame=()=>0;});
 const gear=await page.evaluate(()=>({
   outfits:Object.keys(HR.outfits),hats:Object.keys(HR.hats),gloves:Object.keys(HR.gloves),boots:Object.keys(HR.boots),
   iconBase:Object.fromEntries(Object.entries(ICOI).map(([base,id])=>[id,base]))
 }));
 const outfitNames=gear.outfits;
 if(outfitNames.length!==14)throw Error(`Expected 14 outfits including mannequin, found ${outfitNames.length}`);
 const sheetPayload=await page.evaluate(({outfits,hats,gloves,boots,iconBase,weapons})=>{
   const saved={eq:S.eq,st:ST,ctx,state,props:{}};
   for(const k of ['x','y','face','mvx','mvy','walk','swingT','swingDur','swingKind','atkA','spin','dashT','inv','torch'])saved.props[k]=P[k];
   const realDraw=drawHero;let lastPainted=null;
   drawHero=function(...args){lastPainted=realDraw(...args);return lastPainted;};
   const makeItem=(slot,base,kind)=>({id:9000,slot,base,kind,r:0,val:10,ilvl:1,afx:[],name:base});
   const setLoadout=(outfit,extra={})=>{
     S.eq=Object.assign({},saved.eq,{w:makeItem('w','latte','blade'),a:outfit==='none'?null:makeItem('a',outfit,'armor'),h:null,g:null,f:null},extra);
     ST=stats(S.eq);state='play';P.x=0;P.y=0;P.face=0;P.dashT=0;P.inv=0;P.torch=false;P.spin=0;
   };
   const drawCell=(w,h,scale,outfit,gearItem,pose,label)=>{
     const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
     g.fillStyle='#211a15';g.fillRect(0,0,w,h);g.fillStyle='rgba(150,90,35,.13)';g.beginPath();g.ellipse(w/2,h*.78,w*.4,h*.13,0,0,7);g.fill();
     if(gearItem){const extra={};extra[gearItem.slot]=makeItem(gearItem.slot,gearItem.base,gearItem.kind||({w:'blade',a:'armor',h:'head',g:'hand',f:'feet'}[gearItem.slot]));setLoadout(outfit,extra);}else setLoadout(outfit);
     P.animSpeed=null;P.mvx=pose==='step'?1:0;P.mvy=0;P.walk=pose==='step'?.65:0;P.swingT=pose==='swing'?.115:0;P.swingDur=.2;P.swingKind=S.eq.w.kind;P.atkA=-.85;
     const old=ctx;ctx=g;g.save();g.translate(w/2,h*.81);g.scale(scale,scale);drawPlayer(1200);g.restore();ctx=old;
     const painted=lastPainted;g.fillStyle='#ead9c0';g.font='12px sans-serif';g.textAlign='left';g.fillText(label,6,15);
     return{canvas:c,painted};
   };
   const renderRows=(rows,cell,cols,scale,poses)=>{
     const count=rows.length*poses.length,canvas=document.createElement('canvas');canvas.width=cols*cell[0];canvas.height=Math.ceil(count/cols)*cell[1];const g=canvas.getContext('2d');g.fillStyle='#16110e';g.fillRect(0,0,canvas.width,canvas.height);
     const seen=[];let i=0;
     for(const row of rows)for(const pose of poses){const outfit=row.outfit||'none';const {canvas:card,painted}=drawCell(cell[0],cell[1],scale,outfit,row.item||null,pose,`${row.label||outfit} · ${pose}`);g.drawImage(card,(i%cols)*cell[0],Math.floor(i/cols)*cell[1]);seen.push({label:row.label||outfit,pose,painted});i++;}
     return{data:canvas.toDataURL('image/png'),seen};
   };
   const outfitsRows=outfits.map(outfit=>({outfit,label:outfit}));
   const large=renderRows(outfitsRows,[360,340],4,2,['idle','step','swing']);
   const game=renderRows(outfitsRows,[180,160],7,1,['idle','step','swing']);
   const weaponRows=[];
   for(const [id,base] of Object.entries(iconBase))if(weapons.some(w=>w.id===id)){
     const w=weapons.find(x=>x.id===id);weaponRows.push({label:`${id} ${base}`,slot:'w',base,kind:w.kind});
   }
   for(const base of hats)weaponRows.push({label:`hat ${base}`,slot:'h',base,kind:'head'});
   const wearRows=[];
   for(const base of gloves)wearRows.push({label:`glove ${base}`,slot:'g',base,kind:'hand'});
   for(const base of boots)wearRows.push({label:`boot ${base}`,slot:'f',base,kind:'feet'});
   const weaponGearRows=weaponRows.filter(x=>x.slot==='w').map(item=>({label:item.label,item}));
   const hatRows=weaponRows.filter(x=>x.slot==='h').map(item=>({label:item.label,item}));
   const wearGearRows=wearRows.map(item=>({label:item.label,item}));
   const weaponLarge=renderRows(weaponGearRows,[360,340],5,2,['idle','step','swing']);
   const weaponGame=renderRows(weaponGearRows,[180,160],7,1,['idle','step','swing']);
   const wearLarge=renderRows([...hatRows,...wearGearRows],[300,280],5,2,['idle','step','swing']);
   const wearGame=renderRows([...hatRows,...wearGearRows],[180,160],7,1,['idle','step','swing']);
   const result={large:large.data,game:game.data,weaponsLarge:weaponLarge.data,weaponsGame:weaponGame.data,wearLarge:wearLarge.data,wearGame:wearGame.data,largeSeen:large.seen,gameSeen:game.seen,weaponSeen:[...weaponLarge.seen,...weaponGame.seen],wearSeen:[...wearLarge.seen,...wearGame.seen],weaponCount:weaponRows.filter(x=>x.slot==='w').length,wearCount:hatRows.length+wearGearRows.length};
   drawHero=realDraw;ctx=saved.ctx;S.eq=saved.eq;ST=saved.st;state=saved.state;for(const k in saved.props)P[k]=saved.props[k];
   return result;
 },{outfits:gear.outfits,hats:gear.hats,gloves:gear.gloves,boots:gear.boots,iconBase:gear.iconBase,weapons:weaponIds});
 const writeData=(name,data)=>fs.writeFileSync(path.join(out,name),Buffer.from(data.split(',')[1],'base64'));
 writeData('outfits-large.png',sheetPayload.large);writeData('outfits-game.png',sheetPayload.game);
 writeData('weapons-large.png',sheetPayload.weaponsLarge);writeData('weapons-game.png',sheetPayload.weaponsGame);
 writeData('wearables-large.png',sheetPayload.wearLarge);writeData('wearables-game.png',sheetPayload.wearGame);
 const badPaint=[...sheetPayload.largeSeen,...sheetPayload.gameSeen,...sheetPayload.weaponSeen,...sheetPayload.wearSeen].filter(x=>!x.painted);
 if(badPaint.length)throw Error('Rig images failed to load for: '+badPaint.slice(0,8).map(x=>x.label).join(', '));

 const inventory=await page.evaluate(()=>{
   startRun(0,false);state='paused';
   const mk=(slot,base,kind)=>({id:9200,slot,base,kind,r:0,val:10,ilvl:1,afx:[],name:base});
   S.eq=Object.assign({},S.eq,{w:mk('w','rspeer','spear'),a:mk('a','blaumann','armor'),h:mk('h','stroh','head'),g:mk('g','gartenh','hand'),f:mk('f','gummi','feet')});ST=stats();
   const real=drawHero,calls=[],caught=[];drawHero=function(...args){try{const ok=real(...args);calls.push(ok);return ok;}catch(e){caught.push(e.message);throw e;}};
   openInv('menu');drawHero=real;
   return{open:!$('inv').hidden,doll:!!$('dollc'),calls,caught,drawn:calls.includes(true),canvasSize:$('dollc')?[$('dollc').width,$('dollc').height]:null};
 });
 if(!inventory.open||!inventory.doll||!inventory.drawn||inventory.caught.length)throw Error('Inventory paper-doll smoke failed: '+JSON.stringify(inventory));
 await page.screenshot({path:path.join(out,'inventory-smoke.png')});

 const fallbackContext=await browser.newContext({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'block'});
 const fallbackPage=await fallbackContext.newPage();
 fallbackPage.route('**/assets/hero/rig/t-leder.webp',route=>route.fulfill({status:404,contentType:'text/plain',body:'intentional proof miss'}));
 await fallbackPage.goto('http://127.0.0.1:8765/index.html?debug=hit');
 await fallbackPage.waitForFunction(()=>HR?.v===2&&HIMG['t-leder']?.complete,{timeout:30000});
 const fallback=await fallbackPage.evaluate(()=>{
   const c=document.createElement('canvas');c.width=150;c.height=170;const g=c.getContext('2d'),old=ctx;let result;
   S.eq=Object.assign({},S.eq,{w:{id:1,slot:'w',base:'latte',kind:'blade',val:10,r:0,afx:[]},a:{id:2,slot:'a',base:'leder',kind:'armor',val:10,r:0,afx:[]},h:null,g:null,f:null});ST=stats();state='play';P.x=0;P.y=0;P.face=0;P.mvx=P.mvy=P.walk=P.swingT=P.spin=P.dashT=P.inv=0;
   const real=drawHero;drawHero=function(...args){result=real(...args);return result;};ctx=g;g.translate(75,142);g.scale(2.3,2.3);drawPlayer(1200);ctx=old;drawHero=real;
   const pixels=g.getImageData(0,0,c.width,c.height).data;let alpha=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i])alpha++;
   return{expectedMissingPart:'t-leder',sourceFailed:!HIMG['t-leder'].naturalWidth,drawHeroResult:result,visibleFallbackPixels:alpha,data:c.toDataURL('image/png')};
 });
 if(!fallback.sourceFailed||fallback.drawHeroResult!==false||fallback.visibleFallbackPixels<20)throw Error('Actual missing-file code fallback did not render visibly');
 writeData('missing-file-fallback.png',fallback.data);
 await fallbackContext.close();

 const sceneShots=[];
 const districtScenes=[0,1,2,3,4,5,6].map((di,i)=>({di,tun:null,slug:['koepenick','xhain','alexanderplatz','mitte','tempelhof','spandau','marzahn'][i]})).concat([{di:0,tun:0,slug:'ubahn'}]);
 for(const row of districtScenes){
   const scene=await page.evaluate(({di,tun})=>{
     startRun(di,false,false,tun==null?undefined:tun);resize();state='paused';P.dark=false;S.eq=Object.assign({},S.eq,{w:{id:1,slot:'w',base:'latte',kind:'blade',val:10,r:0,afx:[]},a:null,h:null,g:null,f:null});ST=stats();
     const boxes=blds.filter(isBox).map(b=>{const pts=b.rot?obbC(b):[[b.x,b.y],[b.x+b.w,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h]];return{b,x0:Math.min(...pts.map(q=>ix(...q))),x1:Math.max(...pts.map(q=>ix(...q))),y0:Math.min(...pts.map(q=>iy(...q)))-boxTop(b),y1:Math.max(...pts.map(q=>iy(...q)))};});
     const candidates=[];for(let x=180;x<WS-180;x+=80)for(let y=180;y<WH-180;y+=80)candidates.push({x,y,d:Math.hypot(x-SX,y-SY)});candidates.sort((a,b)=>a.d-b.d);
     const offsets=[[0,0],[-70,20],[65,15],[110,55],[-110,65]];const open=candidates.find(({x,y})=>offsets.every(q=>{const w=s2w(...q),xx=x+w[0],yy=y+w[1],X=ix(xx,yy),Y=iy(xx,yy);return !inWall(xx,yy,24)&&!boxes.some(o=>!front(o.b,xx,yy)&&X>o.x0-18&&X<o.x1+18&&Y>o.y0&&Y-50<o.y1);}));
     if(!open)throw Error(`No occlusion-free hero position for ${D.n}`);
     P.x=open.x;P.y=open.y;P.inv=0;P.dashT=0;P.face=0;P.swingDur=.2;P.swingT=P.swingDur/2;P.swingKind='blade';P.atkA=0;cam.x=P.x;cam.y=P.y;
     document.getElementById('banner').style.display='none';document.getElementById('toasts').style.display='none';return{district:D.n,WS,WH,Z};
   },row);
   for(const factor of [1,2]){
     const file=`${row.slug}-${factor}x-debug-hit.png`;
     await page.evaluate(({baseZ,factor})=>{Z=baseZ*factor;VW=SW/Z;VH=SH/Z;render(1200);drawDebug();hud();drawMini();},{baseZ:scene.Z,factor});
     await page.screenshot({path:path.join(out,file)});sceneShots.push({file,...scene,factor});
   }
 }

 // Re-load with the service worker active, then prove that the cached shell and
 // every v2 part remain loadable after taking the context fully offline.
 const offlineContext=await browser.newContext({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'allow'});
 const offlinePage=await offlineContext.newPage(),offlineErrors=[];offlinePage.on('pageerror',e=>offlineErrors.push(e.message));
 await offlinePage.goto('http://localhost:8765/index.html?debug=hit');
 const swReady=await Promise.race([offlinePage.evaluate(()=>navigator.serviceWorker.ready.then(()=>true)),pause(20000).then(()=>false)]);
 if(!swReady){const sw=await offlinePage.evaluate(async()=>({regs:(await navigator.serviceWorker.getRegistrations()).map(r=>({scope:r.scope,installing:r.installing?.state,waiting:r.waiting?.state,active:r.active?.state}))}));throw Error('Service worker install did not activate within 20 seconds: '+JSON.stringify(sw));}
 await offlinePage.reload({waitUntil:'domcontentloaded'});
 await offlinePage.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
 await offlineContext.setOffline(true);
 let offlineResult;
 try{
   await offlinePage.reload({waitUntil:'domcontentloaded',timeout:15000});
   await offlinePage.evaluate(()=>{heroPre();startRun(0,false);});
   await offlinePage.waitForTimeout(3000);
   offlineResult=await offlinePage.evaluate(async()=>{
     const parts=Object.keys(HR.parts),loaded=[];heroPre();
     await Promise.all(parts.map(k=>new Promise(resolve=>{const im=HIMG[k];if(!im)return resolve();if(im.complete)return resolve();im.onload=im.onerror=resolve;setTimeout(resolve,10000);})))
     for(const k of parts)if(HIMG[k]?.naturalWidth)loaded.push(k);
     return{url:location.href,hr:HR.v,partCount:parts.length,loadedParts:loaded.length,missing:parts.filter(k=>!loaded.includes(k)),controller:!!navigator.serviceWorker.controller,state};
   });
 }catch(e){offlineResult={error:e.message};}
 await offlineContext.setOffline(false);
 await offlineContext.close();
 fs.writeFileSync(path.join(out,'offline-reload.json'),JSON.stringify(offlineResult,null,2)+'\n');
 if(offlineResult.error||offlineResult.hr!==2||offlineResult.missing?.length||offlineResult.state!=='play'||offlineErrors.length)throw Error('Offline reload/run failed: '+JSON.stringify({offlineResult,offlineErrors}));

 const report={schema,outfits:outfitNames.length,largeOutfitCells:sheetPayload.largeSeen.length,gameOutfitCells:sheetPayload.gameSeen.length,weaponGearCells:sheetPayload.weaponCount*3*2,wearableGearCells:sheetPayload.wearCount*3*2,weaponIds,inventory,sceneShots,fallback:{expectedMissingPart:fallback.expectedMissingPart,sourceFailed:fallback.sourceFailed,drawHeroResult:fallback.drawHeroResult,visibleFallbackPixels:fallback.visibleFallbackPixels},offline:offlineResult,errors,failed,offlineErrors};
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
 await browser.close();activeBrowser=null;
 if(errors.length||failed.length)process.exitCode=1;
})().catch(async e=>{console.error(e);if(activeBrowser)await activeBrowser.close().catch(()=>{});process.exitCode=1;});
