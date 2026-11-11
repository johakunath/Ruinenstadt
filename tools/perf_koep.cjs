// Köpenick building-kit performance gate (see .claude/skills/asset-perf-gate/SKILL.md).
// Own browser context per run (no prior fixture work), paired on/off batches, median of paired ratios + bootstrap 95% CI.
// Standalone: serve repo on KOEP_PROOF_PORT (8765), set NODE_PATH/CHROMIUM_PATH (tools/browser-setup.md), `node tools/perf_koep.cjs`.
// Exit code: 0 pass, 1 fail, 2 inconclusive (CI straddles the limit), 3 software raster (not a GPU result), 4 error.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),env=process.env;
const cfg={port:+(env.KOEP_PROOF_PORT||8765),pairs:+(env.KOEP_PERF_PAIRS||21),warm:+(env.KOEP_PERF_WARM||100),frames:+(env.KOEP_PERF_FRAMES||300),limit:5,viewport:(env.KOEP_PERF_VIEWPORT||'1280x800').split('x').map(Number),dpr:+(env.KOEP_PERF_DPR||2),headed:env.KOEP_PERF_HEADED==='1',out:path.resolve(root,env.KOEP_PERF_OUT||'pipeline/proof/02-buildings-koepenick/perf')};
const KEYS=['a-window','a-wall','b-window','b-wall','c-window','c-wall','platte-window','platte-wall','roof','shopfront','ivy','damage','roof-ruin'].map(k=>'assets/buildings/koep-'+k+'.webp');
const hashes=()=>Object.fromEntries(['index.html','sw.js','assets/manifest.json',...fs.readdirSync(path.join(root,'js')).filter(f=>f.endsWith('.js')).map(f=>'js/'+f),'tools/perf_koep.cjs',...KEYS].sort().map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]));
const median=a=>{const s=a.slice().sort((x,y)=>x-y),n=s.length;return n%2?s[n>>1]:(s[n/2-1]+s[n/2])/2;};
// Seeded bootstrap so the same samples always give the same interval.
function ci(a,n=5000){let r=20261110;const rnd=()=>(r=(r*1103515245+12345)%2147483648)/2147483648,m=[];for(let i=0;i<n;i++)m.push(median(a.map(()=>a[Math.floor(rnd()*a.length)])));m.sort((x,y)=>x-y);return[m[Math.floor(n*.025)],m[Math.floor(n*.975)]];}
// Fewer than 15 pairs is a smoke run: the CI is not trustworthy, so it never passes or fails.
const verdict=(lo,hi,limit,n)=>n<15?'inconclusive':hi<=limit?'pass':lo>limit?'fail':'inconclusive';
const nullVerdict=(lo,hi,limit,n)=>n>=15&&Number.isFinite(lo)&&Number.isFinite(hi)&&lo>=-limit&&hi<=limit?'pass':'inconclusive';
const exitCode=v=>({pass:0,fail:1,inconclusive:2,'software-raster':3}[v]??4);
async function gpuInfo(page){return page.evaluate(()=>{const g=document.createElement('canvas').getContext('webgl'),x=g&&g.getExtension('WEBGL_debug_renderer_info'),renderer=g?(x?g.getParameter(x.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER)):'no webgl';return{renderer,vendor:g&&x?g.getParameter(x.UNMASKED_VENDOR_WEBGL):'',ua:navigator.userAgent,cores:navigator.hardwareConcurrency,software:/swiftshader|llvmpipe|software|basic render|no webgl/i.test(renderer)};});}
async function scene(page,di){return page.evaluate(async di=>{window.requestAnimationFrame=()=>0;initAudio();Math.random=rngFrom(20261110);startRun(di,false);resize();state='paused';P.dark=P.inv=P.swingT=P.walk=P.mvx=P.mvy=P.spin=0;shake=KX=KY=0;let x=SX,y=SY;
  if(di===0){const b=blds.find(b=>b.koep&&obbC({...b,rot:b.rot||0}).every(p=>p[0]>P.r+40&&p[0]<WS-P.r-40&&p[1]>P.r+40&&p[1]<WH-P.r-40));if(b){x=b.x+b.w/2;y=b.y+b.h+45;}}
  P.x=cam.x=x;P.y=cam.y=y;enemies=[];const types=['ghoul','brute','spitter','rat','crow','shield','bomb','howl','raser','boss','kabel','bass','uhr','wurz','kern'];
  for(let i=0;i<40;i++){const q=s2w((i%8-3.5)*34,Math.floor(i/8)*23-32),e=mkEnemy(types[i%types.length],x+q[0],y+q[1]);e.big=false;e.hcd=1;e.mv=60;e.t=i*.17;e.fire=4;enemies.push(e);}
  await spriteReady;heroPre();for(const k of Object.keys(SPRITES))spr(k);await Promise.all(Object.values(SPRIMG).map(i=>i.decode().catch(()=>{})));await Promise.all(Object.values(HIMG).map(i=>i.decode().catch(()=>{})));await koepPrepareMap();
  const vis=[],o=drawKoepBuilding;drawKoepBuilding=b=>{if(koepEligible(b))vis.push(b);return o(b);};try{render(1200);}finally{drawKoepBuilding=o;}const u=[...new Set(vis)];await Promise.all(u.map(koepPrepare));
  const un=u.filter(b=>!koepCacheReady(b));if(un.length)throw Error('Visible Köpenick buildings uncached after warmup: '+un.length);
  return{district:D.n,version:VERSION,buildings:blds.length,enemies:enemies.length,camera:[x,y],Z,DPR,bakeScale:koepScale(),visibleKit:u.length,cache:koepAssetStats()};},di);}
const batch=(page,mode,c)=>page.evaluate(({mode,warm,frames})=>{const o=drawKoepBuilding;if(mode==='off')drawKoepBuilding=()=>false;try{Math.random=rngFrom(6789);for(let i=0;i<warm;i++)render(1200);const t=performance.now();for(let i=0;i<frames;i++)render(1200);return(performance.now()-t)/frames;}finally{drawKoepBuilding=o;}},{mode,warm:c.warm,frames:c.frames});
async function run(browser,c=cfg){const ctx=await browser.newContext({viewport:{width:c.viewport[0],height:c.viewport[1]},deviceScaleFactor:c.dpr,serviceWorkers:'block'}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{await page.goto(`http://127.0.0.1:${c.port}/index.html`);await page.waitForFunction(()=>typeof spriteReady!=='undefined');
  const gpu=await gpuInfo(page),result={method:`Fresh context. Per district ${c.pairs} alternating-order pairs; each sample ${c.warm} warmup + ${c.frames} timed full render(1200) calls with the kit hook on vs off. Gate: median of paired on/off ratios, seeded bootstrap 95% CI; pass if CI high <= +${c.limit}%, fail if CI low > +${c.limit}%, else inconclusive.`,viewport:c.viewport,dpr:c.dpr,headed:c.headed,gpu,sourceHashes:hashes(),started:new Date().toISOString(),districts:[]};
  for(const di of [0,2]){const sc=await scene(page,di),samples=[];
   for(let j=0;j<c.pairs;j++){const p={};for(const m of j%2?['off','on']:['on','off'])p[m]=await batch(page,m,c);samples.push(p);}
   const pct=samples.map(s=>(s.on/s.off-1)*100),[lo,hi]=ci(pct),d={scene:sc,samples,offMedian:median(samples.map(s=>s.off)),onMedian:median(samples.map(s=>s.on)),medianPairedPct:median(pct),ci95Pct:[lo,hi],verdict:di===2?nullVerdict(lo,hi,c.limit,c.pairs):verdict(lo,hi,c.limit,c.pairs)};
   result.districts.push(d);console.log(`${sc.district}: off ${d.offMedian.toFixed(3)} ms, on ${d.onMedian.toFixed(3)} ms, paired median ${d.medianPairedPct.toFixed(2)}% [${lo.toFixed(2)}, ${hi.toFixed(2)}] -> ${d.verdict}`);}
  result.errors=errors;const v=result.districts.map(d=>d.verdict);result.verdict=errors.length?'error':gpu.software?'software-raster':v.includes('fail')?'fail':v.includes('inconclusive')?'inconclusive':'pass';
  const after=hashes();if(JSON.stringify(after)!==JSON.stringify(result.sourceHashes))result.verdict='error',result.errors.push('Sources changed during the run');
  result.finished=new Date().toISOString();return result;}finally{await ctx.close();}}
function table(r){return['| District | Off ms | On ms | Paired median | 95% CI | Verdict |','|---|---|---|---|---|---|',...r.districts.map(d=>`| ${d.scene.district} | ${d.offMedian.toFixed(3)} | ${d.onMedian.toFixed(3)} | ${d.medianPairedPct.toFixed(2)}% | ${d.ci95Pct.map(x=>x.toFixed(2)+'%').join(' … ')} | ${d.verdict} |`)].join('\n');}
module.exports={run,table,cfg,verdict,nullVerdict,exitCode};
if(require.main===module)(async()=>{const browser=await chromium.launch({executablePath:env.CHROMIUM_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:!cfg.headed});
 try{const r=await run(browser);fs.mkdirSync(cfg.out,{recursive:true});const stamp=r.started.replace(/[:.]/g,'-'),file=path.join(cfg.out,`perf-${stamp}.json`);fs.writeFileSync(file,JSON.stringify(r,null,2)+'\n');
  console.log(`\nGPU: ${r.gpu.renderer}${r.gpu.software?' (SOFTWARE, not a GPU result)':''}\n${cfg.viewport.join('x')} @ DPR ${cfg.dpr}, ${cfg.pairs} pairs\n\n${table(r)}\n\nVerdict: ${r.verdict}\nSaved: ${path.relative(root,file)}`);
  process.exitCode=exitCode(r.verdict);}catch(e){console.error(e);process.exitCode=4;}finally{await browser.close();}})();
