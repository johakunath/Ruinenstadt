/* Run only when the parent authorizes browser work. Needs an already running repo server.
   GDR_PROOF_URL=http://127.0.0.1:8765 node capture.mjs
   Resolve Playwright from the caller's environment; do not install dependencies here. */
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium}=createRequire(import.meta.url)('playwright');
const root=path.dirname(fileURLToPath(import.meta.url)),url=process.env.GDR_PROOF_URL||'http://127.0.0.1:8765';
await mkdir(path.join(root,'proof'),{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.GDR_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1440,height:1280},deviceScaleFactor:1,serviceWorkers:'block'});
const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('requestfailed',r=>failed.push({url:r.url(),failure:r.failure()}));
await page.route('**/__gdrproof/*',async route=>{
  const name=new URL(route.request().url()).pathname.split('/').at(-1);
  if(!['facades.png','kit.png','full-b.png'].includes(name))return route.abort();
  await route.fulfill({status:200,contentType:'image/png',body:await readFile(path.join(root,'assets',name))});
});
try{
  await page.goto(url+'/?debug=hit',{waitUntil:'networkidle'});
  // Disable subsequent animation scheduling, then flush the already scheduled game frame.
  await page.evaluate(()=>{window.requestAnimationFrame=()=>0;});
  await page.waitForTimeout(60);
  await page.addScriptTag({path:path.join(root,'proof.js')});
  const info=await page.evaluate(()=>window.__gdrProof.init());
  const frames=[];
  for(const factor of [1,2])for(const rot of [0,.6,-.6])for(const mode of ['old','A','B']){
    const meta=await page.evaluate(({mode,rot,factor})=>window.__gdrProof.frame(mode,rot,factor,true),{mode,rot,factor});
    const file=`${mode}-zoom${factor}-rot${rot<0?'minus':rot>0?'plus':'zero'}${rot===0?'':'060'}.png`;
    await page.locator('#c').screenshot({path:path.join(root,'proof',file)});frames.push({...meta,file});
  }
  const result={info,frames,pageErrors:errors,requestFailures:failed,performance:'Not measured: fixture captures are not performance evidence.'};
  await writeFile(path.join(root,'proof','results.json'),JSON.stringify(result,null,2)+'\n');
  if(errors.length||failed.length)throw new Error(JSON.stringify({errors,failed}));
  console.log('Captured 18 world-renderer comparisons in '+path.join(root,'proof'));
}finally{await browser.close();}
