const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
const page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:2}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8765/index.html');await page.evaluate(async()=>{window.requestAnimationFrame=()=>0;initAudio();Math.random=rngFrom(20261110);startRun(0,false);resize();state='paused';await spriteReady;for(const k of KOEP_KEYS)spr(k);await Promise.all(KOEP_KEYS.map(k=>SPRIMG[k].decode()));P.x=cam.x=1600;P.y=cam.y=1400;await koepPrepareMap();});
const samples=[];for(let i=0;i<25;i++){await page.evaluate(()=>render(1200));await page.waitForTimeout(150);samples.push(await page.evaluate(()=>koepAssetStats()));}
const tail=samples.slice(-5);if(errors.length||tail.some(s=>s.evictions!==tail[0].evictions||s.perBuildingCanvasBytes!==tail[0].perBuildingCanvasBytes)||samples.some(s=>s.maxAllocatedBytes>40000000))throw Error(JSON.stringify({errors,samples}));
const out='pipeline/proof/02-buildings-koepenick/review';fs.mkdirSync(out,{recursive:true});await page.screenshot({path:out+'/overflow-2560.png'});fs.writeFileSync(out+'/overflow.json',JSON.stringify({viewport:[2560,1440],camera:[1600,1400],errors,samples},null,2));console.log(JSON.stringify({stable:true,first:samples[0],last:samples.at(-1),errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
