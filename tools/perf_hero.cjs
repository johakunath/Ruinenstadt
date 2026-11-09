// Compare the unchanged v0.60 checkout (8766) with the new rig (8765).
// Start separate http.server processes at those roots. Pages use identical
// seeds, viewport and camera; samples alternate order to reduce timing bias.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const out=path.resolve(__dirname,'../pipeline/proof/07-player-rig-v2');
const median=a=>a.slice().sort((a,b)=>a-b)[Math.floor(a.length/2)];
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'block'}),pages=[];
for(const port of [8766,8765]){const p=await context.newPage();await p.goto(`http://127.0.0.1:${port}/index.html`);await p.evaluate(()=>{window.requestAnimationFrame=()=>0;heroPre();});await p.waitForFunction(()=>Object.values(HIMG).length>0&&Object.values(HIMG).every(i=>i.complete&&i.naturalWidth));pages.push(p);}
const report={baseline:'a94f7f1 (v0.60)',viewport:[960,640],dpr:2,method:'7 alternating-order pairs; 15 warmup + 50 timed full render calls each; seeded maps and stationary player, no enemies',districts:[]};
for(const district of [0,3]){for(const p of pages)await p.evaluate(di=>{Math.random=rngFrom(12345);startRun(di,false);resize();state='paused';P.x=SX;P.y=SY;cam.x=P.x;cam.y=P.y;P.inv=0;P.mvx=P.mvy=P.walk=P.swingT=P.spin=0;enemies=[];},district);
const samples=[];for(let j=0;j<7;j++){const pair={};for(const i of (j%2?[1,0]:[0,1])){pair[i?'v2':'v1']=await pages[i].evaluate(()=>{for(let k=0;k<15;k++)render(1200);const times=[];for(let k=0;k<50;k++){const t=performance.now();render(1200);times.push(performance.now()-t);}times.sort((a,b)=>a-b);return{median:times[25],p95:times[47]};});}samples.push(pair);}
const v1=median(samples.map(x=>x.v1.median)),v2=median(samples.map(x=>x.v2.median));report.districts.push({district:district===0?'Koepenick':'Mitte',samples,medianV1:v1,medianV2:v2,ratio:v2/v1});}
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'performance.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await browser.close();})().catch(e=>{console.error(e);process.exitCode=1;});
