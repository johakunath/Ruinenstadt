// Frame time of a busy combat scene (24 enemies, swings, bolts, shocks, particles) per district. Serve the repo root first:
//   python3 -m http.server 8765 &  node tools/perf_vfx.cjs [label]   -> prints median/p95 ms of render(), saves screenshots to $SHOT_DIR if set
// Run on the old and the new checkout and compare. Headless Chromium rasterises in software, so compare ratios, not absolute tablet numbers.
const {chromium}=require('playwright'),path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']}),c=await b.newContext({viewport:{width:1280,height:800},deviceScaleFactor:2,serviceWorkers:'block'}),p=await c.newPage(),errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto(`http://127.0.0.1:${process.env.PORT||8765}/index.html`);await p.waitForTimeout(800);await p.evaluate(()=>{window.requestAnimationFrame=()=>0;});const out={};
for(const[di,name]of[[0,'koepenick'],[3,'mitte'],[2,'alex']]){out[name]=await p.evaluate(di=>{Math.random=rngFrom(12345);startRun(di,false);resize();state='play';P.x=SX;P.y=SY;cam.x=P.x;cam.y=P.y;P.inv=9;enemies=[];run.toSpawn=0;run.breakT=99;
  const ty=['ghoul','ghoul','ghoul','brute','spitter','rat','shield','raser'];for(let i=0;i<24;i++){const a=i/24*6.283,r=60+(i%4)*45;const e=mkEnemy(ty[i%ty.length],P.x+Math.cos(a)*r,P.y+Math.sin(a)*r);if(e&&!enemies.includes(e))enemies.push(e);}
  const scene=k=>{for(const e of enemies)e.hp=e.max=1e9;const n=enemies.length;swings=[{a:k*.4,life:.1,max:.2,kind:'sword',arc:1.1,reach:70,fin:k%3===0}];bolts=[];for(let i=0;i<4;i++)bolts.push({x0:P.x,y0:P.y-14,x1:enemies[i%n].x,y1:enemies[i%n].y-14,life:.12});shocks=[{x:P.x,y:P.y,r:60,max:130,hit:[]}];rings=[{x:P.x,y:P.y,r:80,max:170,col:'125,211,255'}];
    if(k%2===0){enemies[k%n].flash=.1;burst(enemies[k%n].x,enemies[k%n].y-10,'#c23a2e',8,160);if(typeof fxHit==='function')fxHit(enemies[k%n],k%4===0,null);}};
  for(let k=0;k<20;k++){scene(k);update(.016);render(1200+k*16);}const ts=[];for(let k=0;k<80;k++){scene(k);update(.016);P.hp=ST.maxHp;const t=performance.now();render(2000+k*16);ts.push(performance.now()-t);}ts.sort((a,b)=>a-b);return{median:+ts[40].toFixed(2),p95:+ts[76].toFixed(2)};},di);
  if(process.env.SHOT_DIR)await p.screenshot({path:path.join(process.env.SHOT_DIR,`${process.argv[2]||'run'}-${name}.png`)});}
console.log(JSON.stringify({label:process.argv[2]||'run',out,errs}));await b.close();})().catch(e=>{console.error(String(e).slice(0,600));process.exit(1);});
