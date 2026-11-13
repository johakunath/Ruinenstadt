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
 q.run('os.saved=100;osOff()');assert.equal(q.run('os.saved'),0);assert.equal(q.data.has('rs2sync'),false);
});
