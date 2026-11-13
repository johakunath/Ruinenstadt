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
  // The real handler starts an upload and persists device metadata.
  await page.click('[data-o="oson"]');
  await page.waitForFunction(()=>os.state==='on');
  assert.equal(await page.evaluate(()=>!!JSON.parse(localStorage.getItem('rs2sync')).c),true);
  assert.equal(await page.locator('[data-o="osoff"]').count(),1);
  page.once('dialog',d=>d.accept());await page.click('[data-o="osoff"]');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('rs2sync')).off),1);
  await page.evaluate(()=>{remoteSave=JSON.stringify({...S,scrap:987,t:20});window.campPosition=[P.x,P.y];});
  page.once('dialog',d=>d.accept('ABCD-EFGH'));await page.click('[data-o="osjoin"]');
  await page.waitForFunction(()=>S.scrap===987&&os.state==='on');
  assert.deepEqual(await page.evaluate(()=>({state,camp:!!D.base,pos:[P.x,P.y],expected:campPosition,backedUp:lsGet('rs2bak').some(b=>JSON.parse(b.s).scrap===0)})),
   {state:'baseinv',camp:true,pos:await page.evaluate(()=>campPosition),expected:await page.evaluate(()=>campPosition),backedUp:true});
  await page.click('[data-o="close"]');
  // A background pull must invalidate item actions from the previous save.
  await page.evaluate(()=>{S.bag=[{...START_W(),id:201,name:'Old first item'},{...START_W(),id:202,name:'Old selected item'}];renderInv();});
  await page.click('[data-b="1"]');assert.equal(await page.locator('[data-a="salv"]').count(),1);
  await page.evaluate(async()=>{
   allArm=true;invMsg='Old save message';
   remoteSave=JSON.stringify({...S,t:25,bag:[{...START_W(),id:301,name:'Downloaded item'}]});await osPull();
  });
  assert.deepEqual(await page.evaluate(()=>({selection:sel,armed:allArm,message:invMsg,ids:S.bag.map(it=>it.id)})),{selection:null,armed:false,message:'',ids:[301]});
  assert.equal(await page.locator('[aria-label="Downloaded item"]').count(),1);
  assert.equal(await page.locator('[data-a="salv"], [aria-label="Old selected item"]').count(),0);
  await page.click('[data-a="close"]');
  assert.equal(await page.evaluate(()=>state),'base');
  // Conflict downloads can update camp, but must wait while an expedition is active.
  await page.evaluate(async()=>{remoteSave=JSON.stringify({...S,scrap:988,t:30});await osPull();});
  assert.equal(await page.evaluate(()=>S.scrap),988);
  await page.evaluate(()=>{leaveBase();startRun(0,false);pauseGame();openOpts('run');});
  assert.equal(await page.locator('[data-o="oson"], [data-o="osoff"], [data-o="osjoin"]').count(),0);
  await page.evaluate(async()=>{remoteSave=JSON.stringify({...S,scrap:999,t:40});os.base=0;await osPull();});
  assert.deepEqual(await page.evaluate(()=>({scrap:S.scrap,pending:os.pend,run:!!run})),{scrap:988,pending:true,run:true});
  assert.deepEqual(errors,[]);
  await page.close();
  // Exercise the real boot on a public hostname, with a fully mocked backend.
  const live=await browser.newPage({viewport:{width:1280,height:800},serviceWorkers:'block'}),requests=[];let remote=null;
  live.setDefaultTimeout(15000);
  live.on('pageerror',e=>errors.push(e.message));live.on('dialog',()=>errors.push('Unexpected startup dialog'));
  await live.route('http://ruinenstadt.test/**',async r=>{
   const url=new URL(r.request().url());url.host='localhost:8765';
   await r.continue({url:url.href});
  });
  await live.route('https://script.google.com/**',async r=>{
   const q=r.request().postDataJSON();requests.push(q);
   if(q.a==='put')remote={s:q.s,t:q.t||Date.now()};
   await r.fulfill({headers:{'access-control-allow-origin':'*'},json:q.a==='get'?{ok:true,...(remote||{s:null,t:0})}:{ok:true,t:remote&&remote.t}});
  });
  await live.goto('http://ruinenstadt.test/');await live.waitForFunction(()=>os.state==='on');
  const code=await live.evaluate(()=>os.code);assert.match(code,/^[A-Z2-9]{8}$/);
  assert.equal(requests[0].a,'put');
  await live.reload();await live.waitForFunction(()=>os.state==='on');assert.equal(await live.evaluate(()=>os.code),code);
  assert.equal(requests.filter(q=>q.a==='get').length,1);
  await live.evaluate(()=>{startRun(0,false);S.scrap=321;save();});
  await live.waitForFunction(()=>os.state==='on'&&!os.dirty&&!os.busy);
  assert.equal(JSON.parse(requests.filter(q=>q.a==='put').at(-1).s).scrap,321);
  assert.deepEqual(errors,[]);
  console.log('Automatic public startup, reload/code reuse, mission upload, camp controls, backup and expedition deferral passed; all sync requests mocked.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
