// Browser, visual, fallback and offline proof for task06 boss sprites.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),port=+(process.env.BOSS_PROOF_PORT||8765),base=`http://localhost:${port}`,out=path.resolve(root,process.env.BOSS_PROOF_OUT||'pipeline/proof/06-bosses');
const bosses='hauptmann hexe bassprediger flieger brand ratten ritter platte volk'.split(' '),poses='idle walk-a walk-b attack-a attack-b hit'.split(' ');
fs.mkdirSync(out,{recursive:true});
const save=(name,value)=>fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n'),imageData=(name,data)=>fs.writeFileSync(path.join(out,name),Buffer.from(data.split(',')[1],'base64'));
async function launch(){return chromium.launch({executablePath:process.env.CHROMIUM_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});}
async function load(page){await page.goto(`${base}/index.html?debug=hit`);return page.evaluate(async()=>{await spriteReady;const keys=Object.keys(SPRITES).filter(k=>k.startsWith('bosses/'));keys.forEach(k=>spr(k));await Promise.all(keys.map(k=>SPRIMG[k].decode()));return{version:VERSION,keys,decoded:keys.filter(k=>SPRIMG[k].naturalWidth).length};});}
async function gallery(page,factor){return page.evaluate(({bosses,poses,factor})=>{
 const cw=factor===1?270:470,ch=factor===1?260:440,c=document.createElement('canvas');c.width=cw*poses.length;c.height=ch*bosses.length;
 const g=c.getContext('2d'),seen=[],oldCtx=ctx,oldP=P,oldD=D;D={...D};P={...P,x:100,y:0,r:12};
 const setPose=(e,p)=>{e.hcd=1;e.t=1;e.mv=e.atk=e.flash=e.stun=0;if(p==='walk-a'){e.mv=60;e.t=1;}if(p==='walk-b'){e.mv=60;e.t=1.2;}if(p==='attack-a')e.atk=.05;if(p==='attack-b')e.atk=.24;if(p==='hit')e.flash=.1;};
 for(let v=0;v<bosses.length;v++)for(let j=0;j<poses.length;j++){
  const p=poses[j],e=mkEnemy('boss',0,0,true);e.big=true;e.v=v;e.r=42;setPose(e,p);
  const x=j*cw,y=v*ch;g.fillStyle='#201c1b';g.fillRect(x,y,cw,ch);g.fillStyle='#ead9c0';g.font=`${factor===1?12:18}px sans-serif`;g.fillText(`${bosses[v]} / ${p}`,x+7,y+(factor===1?16:24));
  ctx=g;g.save();g.translate(x+cw/2,y+ch-(factor===1?58:92));g.scale(factor,factor);
  g.strokeStyle='#ffd23f';g.lineWidth=1;g.beginPath();for(let k=0;k<=48;k++){const a=k/48*Math.PI*2,X=ix(Math.cos(a)*e.r,Math.sin(a)*e.r),Y=iy(Math.cos(a)*e.r,Math.sin(a)*e.r);k?g.lineTo(X,Y):g.moveTo(X,Y);}g.stroke();
  const choice=enemySprite(e);let painted=0,real=g.drawImage;g.drawImage=function(im,...args){if(choice&&im===choice.i)painted++;return real.call(this,im,...args);};drawEnemy(e,1200);g.drawImage=real;g.restore();
  const pix=g.getImageData(x,y+22,cw,ch-22).data;let edge=0,body=0;for(let yy=0;yy<ch-22;yy++)for(let xx=0;xx<cw;xx++){const q=(yy*cw+xx)*4;if(Math.abs(pix[q]-32)+Math.abs(pix[q+1]-28)+Math.abs(pix[q+2]-27)>35){body++;if(xx<2||xx>=cw-2||yy<2||yy>=ch-24)edge++;}}
  seen.push({boss:bosses[v],pose:p,key:choice&&choice.key,painted:p==='hit'?!!choice:painted>0,edge,body});
 }
 ctx=oldCtx;P=oldP;D=oldD;return{data:c.toDataURL(),seen};
},{bosses,poses,factor});}
async function fallback(browser){
 const missing='assets/bosses/hauptmann-idle.webp',context=await browser.newContext({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/'+missing,r=>r.fulfill({status:404,contentType:'text/plain',body:'intentional task06 fallback'}));
 try{
  await page.goto(`${base}/index.html`);await page.evaluate(async()=>{await spriteReady;spr('bosses/hauptmann-idle');});await page.waitForFunction(()=>SPRIMG['bosses/hauptmann-idle']?.complete);
  const r=await page.evaluate(()=>{startRun(0,false);state='paused';const e=mkEnemy('boss',0,0,true);e.big=true;e.v=0;e.r=42;e.hcd=1;const c=document.createElement('canvas');c.width=c.height=360;const g=c.getContext('2d'),old=ctx;ctx=g;g.translate(180,300);g.scale(2,2);const choice=enemySprite(e);drawEnemy(e,1200);ctx=old;const a=g.getImageData(0,0,360,360).data;let pixels=0;for(let i=3;i<a.length;i+=4)if(a[i])pixels++;return{failed:!SPRIMG['bosses/hauptmann-idle'].naturalWidth,choice:choice&&choice.key,pixels,data:c.toDataURL()};});
  imageData('fallback.png',r.data);delete r.data;r.errors=errors;if(!r.failed||r.choice||r.pixels<30||errors.length)throw Error('boss fallback failed '+JSON.stringify(r));return r;
 }finally{await context.close();}
}
async function offline(browser){const context=await browser.newContext({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'allow'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));try{await page.goto(`${base}/index.html`);await page.evaluate(()=>Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('service worker timeout')),25000))]));await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded',timeout:20000});const result=await page.evaluate(async()=>{await spriteReady;const keys=Object.keys(SPRITES).filter(k=>k.startsWith('bosses/'));keys.forEach(k=>spr(k));await Promise.all(keys.map(k=>SPRIMG[k].decode()));startRun(0,false);const names=await caches.keys(),urls=(await Promise.all(names.map(async n=>(await(await caches.open(n)).keys()).map(r=>new URL(r.url).pathname)))).flat();return{version:VERSION,state,controller:!!navigator.serviceWorker.controller,expected:keys.length,decoded:keys.filter(k=>SPRIMG[k].naturalWidth).length,missing:keys.filter(k=>!urls.includes('/assets/'+k+'.webp'))};});result.errors=errors;if(result.state!=='play'||!result.controller||result.decoded!==result.expected||result.missing.length||errors.length)throw Error('offline boss proof failed '+JSON.stringify(result));return result;}finally{await context.close();}}
(async()=>{
 const browser=await launch(),report={started:new Date().toISOString(),errors:[]};
 try{
  const context=await browser.newContext({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'block'}),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));report.load=await load(page);
  for(const factor of [1,2]){const g=await gallery(page,factor);imageData(`gallery-${factor}x.png`,g.data);const bad=g.seen.filter(x=>!x.painted||x.body<30);if(bad.length)throw Error('gallery failure '+JSON.stringify(bad));report[`gallery${factor}x`]=g.seen;}
  await context.close();report.fallback=await fallback(browser);report.offline=await offline(browser);if(report.errors.length)throw Error(report.errors.join('; '));report.status='passed';report.finished=new Date().toISOString();save('results.json',report);console.log(JSON.stringify({status:report.status,frames:report.load.keys.length,offline:report.offline.decoded}));
 }catch(e){report.status='failed';report.failure=e.stack;save('results.json',report);console.error(e);process.exitCode=1;}finally{await browser.close();}
})();
