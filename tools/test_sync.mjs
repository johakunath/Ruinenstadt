// Cloud upload age must reflect acknowledged writes, never queued/failed saves or pulls.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../js/sync.js',import.meta.url),'utf8');
function setup(){let now=100000;const data=new Map(),nodes=[{textContent:''}],intervals=[];
 const env=vm.createContext({Date:{now:()=>now},Math,JSON,Uint8Array,AbortController,crypto:{getRandomValues:a=>a.fill(1)},location:{hostname:'localhost'},window:{},S:{pid:'abcdefgh',t:10},state:'play',localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},setTimeout:()=>1,clearTimeout(){},setInterval:f=>intervals.push(f),document:{hidden:false,addEventListener(){},querySelectorAll:()=>nodes},$:()=>({hidden:false}),renderMenu(){},renderOpts(){},toast(){},lsGet:()=>[],confirm:()=>true});
 vm.runInContext(source,env);return{env,data,nodes,intervals,run:s=>vm.runInContext(s,env),time:n=>now=n};}
test('only an acknowledged upload sets the persisted clock; failures preserve it',async()=>{
 const q=setup();q.run("os.code='ABCDEFGH';os.dirty=true;osCall=async()=>({ok:true,t:10})");await q.run('osPush()');
 assert.equal(q.run('os.saved'),100000);assert.equal(JSON.parse(q.data.get('rs2sync')).s,100000);
 q.time(225000);assert.equal(q.run('osAge()'),'Letzter Cloud-Upload vor 2 Min. 05 Sek.');
 q.run('os.dirty=true;osCall=async()=>{throw Error("offline")}');await q.run('osPush()');assert.equal(q.run('os.saved'),100000);assert.equal(q.run('os.state'),'slow');
 q.run('os.dirty=true;osCall=async()=>({ok:true,t:20})');await q.run('osPush()');assert.equal(q.run('os.saved'),225000);
});
test('reload restores age and the visible label ticks without rebuilding options',()=>{
 const q=setup();q.data.set('rs2sync',JSON.stringify({c:'ABCDEFGH',b:10,s:10000}));q.run('osPull=()=>{};initSync()');
 assert.equal(q.run('os.saved'),10000);q.time(75000);q.intervals[0]();assert.equal(q.nodes[0].textContent,'Letzter Cloud-Upload vor 1 Min. 05 Sek.');
 q.time(0);assert.equal(q.run('osAge()'),'Letzter Cloud-Upload vor 0 Min. 00 Sek.');
});
test('old metadata and downloaded saves cannot masquerade as successful uploads',async()=>{
 const q=setup();q.data.set('rs2sync',JSON.stringify({c:'ABCDEFGH',b:90000}));q.run('osPull=()=>{};initSync()');
 assert.match(q.run('osAge()'),/^Noch kein bestätigter/);q.run('adoptSave=()=>{};svMore=()=>false');q.run('osAdopt(JSON.stringify({upg:{},eq:{}}),95000)');assert.equal(q.run('os.saved'),0);
 q.run('os.saved=100;osOff()');assert.equal(q.run('os.saved'),0);assert.equal(JSON.parse(q.data.get('rs2sync')).off,1);
});
test('public startup creates and persists one code before uploading, then reuses it',async()=>{
 const q=setup();q.run("location.hostname='ruinenstadt.example';window.calls=[];confirm=()=>{throw Error('unexpected prompt')};osCall=async x=>{window.calls.push(x);return {ok:true,t:10};};initSync()");
 const first=JSON.parse(q.data.get('rs2sync'));assert.match(first.c,/^[A-Z2-9]{8}$/);assert.equal(first.s,0);
 await q.run('Promise.resolve()');assert.equal(q.run('os.state'),'on');assert.equal(q.run('window.calls[0].a'),'put');
 q.run("os.code=null;osCall=async x=>{window.calls.push(x);return {ok:true,t:10,s:null};};initSync()");
 assert.equal(q.run('os.code'),first.c);assert.equal(q.run('window.calls[1].a'),'get');
});
test('offline automatic startup retains the code and retries unconfirmed data',async()=>{
 const q=setup();q.run("location.hostname='ruinenstadt.example';osCall=async()=>{throw Error('offline')};initSync()");
 const code=q.run('os.code');await q.run('Promise.resolve()');assert.equal(q.run('os.state'),'slow');assert.equal(q.run('os.dirty'),true);
 assert.equal(JSON.parse(q.data.get('rs2sync')).c,code);assert.equal(q.run('os.saved'),0);
 q.run('osCall=async()=>({ok:true,t:10})');await q.run('osPush()');assert.equal(q.run('os.code'),code);assert.equal(q.run('os.state'),'on');
});
test('explicit off survives startup, while manual re-enable clears the opt-out',async()=>{
 const q=setup();q.run("location.hostname='ruinenstadt.example';osOff();window.calls=[];osCall=async x=>{window.calls.push(x);return {ok:true,t:10};};initSync()");
 assert.equal(q.run('os.code'),null);assert.equal(q.run('window.calls.length'),0);
 q.run('osOn()');await q.run('Promise.resolve()');assert.ok(q.run('os.code'));assert.equal(JSON.parse(q.data.get('rs2sync')).off,undefined);
});
test('development and simulation startups do not automatically create cloud saves',()=>{
 for(const host of ['localhost','127.0.0.1','']){const q=setup();q.env.location.hostname=host;q.run('initSync()');assert.equal(q.run('os.code'),null);}
 const q=setup();q.run("location.hostname='ruinenstadt.example';window.SIM=true;initSync()");assert.equal(q.run('os.code'),null);
});
test('telemetry uploads run history without a cloud-save connection',async()=>{
 const q=setup();q.run("location.hostname='ruinenstadt.example';window.calls=[];hkey=e=>e.id;lsGet=k=>k==='rs2hist'?[{id:'run1'}]:[];lsSet=()=>{};osCall=async x=>{window.calls.push(x);return {ok:true};}");
 await q.run('osTl()');assert.equal(q.run('os.code'),null);assert.equal(q.run('window.calls[0].a'),'tl');assert.equal(q.run('window.calls[0].p'),'abcdefgh');
});
