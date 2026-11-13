// Run against a local HTTP server. Every sync request is mocked; no cloud save is written.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:800},serviceWorkers:'block'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://script.google.com/**',r=>r.abort());
  await page.goto(process.env.RUINENSTADT_TEST_URL||'http://localhost:8765/');
  await page.waitForSelector('#go');
  await page.evaluate(async()=>{
   await spriteReady;S=defSave();S.unlocked=2;S.ln=[1];S.t=10;S.pid='camp-test';
   window.syncCalls=[];window.remoteSave=null;
   osCall=async q=>{syncCalls.push(q.a);return q.a==='put'?{ok:true,t:S.t}:{ok:true,t:remoteSave?JSON.parse(remoteSave).t:0,s:remoteSave};};
   enterBase();baseMenu('bag');
  });
  await page.click('[data-a="opts"]');
  assert.equal(await page.locator('[data-o="oson"]').count(),1);
  // Confirmation uses the real handler; successful upload persists device metadata.
  page.once('dialog',d=>d.accept());await page.click('[data-o="oson"]');
  await page.waitForFunction(()=>os.state==='on');
  assert.equal(await page.evaluate(()=>!!JSON.parse(localStorage.getItem('rs2sync')).c),true);
  assert.equal(await page.locator('[data-o="osoff"]').count(),1);
  page.once('dialog',d=>d.accept());await page.click('[data-o="osoff"]');
  assert.equal(await page.evaluate(()=>localStorage.getItem('rs2sync')),null);
  await page.evaluate(()=>{remoteSave=JSON.stringify({...S,scrap:987,t:20});window.campPosition=[P.x,P.y];});
  page.once('dialog',d=>d.accept('ABCD-EFGH'));await page.click('[data-o="osjoin"]');
  await page.waitForFunction(()=>S.scrap===987&&os.state==='on');
  assert.deepEqual(await page.evaluate(()=>({state,camp:!!D.base,pos:[P.x,P.y],expected:campPosition,backedUp:lsGet('rs2bak').some(b=>JSON.parse(b.s).scrap===0)})),
   {state:'baseinv',camp:true,pos:await page.evaluate(()=>campPosition),expected:await page.evaluate(()=>campPosition),backedUp:true});
  await page.click('[data-o="close"]');await page.click('[data-a="close"]');
  assert.equal(await page.evaluate(()=>state),'base');
  // Conflict downloads can update camp, but must wait while an expedition is active.
  await page.evaluate(async()=>{remoteSave=JSON.stringify({...S,scrap:988,t:30});await osPull();});
  assert.equal(await page.evaluate(()=>S.scrap),988);
  await page.evaluate(()=>{leaveBase();startRun(0,false);pauseGame();openOpts('run');});
  assert.equal(await page.locator('[data-o="oson"], [data-o="osoff"], [data-o="osjoin"]').count(),0);
  await page.evaluate(async()=>{remoteSave=JSON.stringify({...S,scrap:999,t:40});os.base=0;await osPull();});
  assert.deepEqual(await page.evaluate(()=>({scrap:S.scrap,pending:os.pend,run:!!run})),{scrap:988,pending:true,run:true});
  assert.deepEqual(errors,[]);
  console.log('Camp activation, disconnect, code join, backup, camp preservation and expedition deferral passed; no real sync requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
