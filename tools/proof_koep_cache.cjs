// Compare the actual projected cache against live texture-kit composition at source resolution.
// NODE_PATH=.tools-browser/node_modules; KOEP_PROOF_PORT defaults to 8765.
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const p=await browser.newPage({viewport:{width:960,height:640},deviceScaleFactor:2,serviceWorkers:'block'});
  await p.goto(`http://127.0.0.1:${Number(process.env.KOEP_PROOF_PORT||8765)}/index.html`);
  const result=await p.evaluate(async()=>{
   await spriteReady;for(const k of KOEP_KEYS)spr(k);await Promise.all(Object.values(SPRIMG).map(i=>i.decode()));
   initAudio();Math.random=rngFrom(20261110);startRun(0,false);requestAnimationFrame=()=>0;state='paused';await koepPrepareMap();
   const comparisons=[];
   for(const st of ['altbau','ruin'])for(const rot of [0,.6,-.6]){
    const b={x:1000,y:1000,w:192,h:96,H:180,top:180,R0:0,rot};makeB(b,st);await koepPrepare(b);
    const entry=KOEPCACHE.items.get(b);if(!entry)throw Error('Cache not ready');
    const r=entry.bounds,reference=cnv(r.w*3,r.h*3),actual=cnv(r.w*3,r.h*3),previous=ctx;
    try{
     ctx=reference.getContext('2d');ctx.scale(3,3);ctx.translate(-r.x,-r.y);withRot(b,()=>drawKoepBuildingLive(b));
     ctx=actual.getContext('2d');ctx.scale(3,3);ctx.translate(-r.x,-r.y);withRot(b,()=>drawKoepBuilding(b));
    }finally{ctx=previous;}
    const a=reference.getContext('2d').getImageData(0,0,reference.width,reference.height).data,z=actual.getContext('2d').getImageData(0,0,actual.width,actual.height).data;
    let changedChannels=0,maxDifference=0,changedAlpha=0;
    for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-z[i]);if(d){changedChannels++;maxDifference=Math.max(maxDifference,d);if(i%4===3)changedAlpha++;}}
    comparisons.push({st,rot,width:actual.width,height:actual.height,changedChannels,maxDifference,changedAlpha});
    reference.width=actual.width=reference.height=actual.height=0;
   }
   return{comparisons,stats:koepAssetStats()};
  });
  if(result.comparisons.some(x=>x.changedChannels))throw Error('Projected cache changed source pixels: '+JSON.stringify(result));
  console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
