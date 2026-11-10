// node --test tools/test_koep_buildings.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const fn=(s,name)=>{const a=s.indexOf('function '+name+'('),b=s.indexOf('\nfunction ',a+1);return s.slice(a,b<0?s.length:b);};
const keys=['a-window','a-wall','b-window','b-wall','c-window','c-wall','platte-window','platte-wall','roof','shopfront','ivy','damage','roof-ruin'].map(k=>'buildings/koep-'+k);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} vs ${b}`);
const mul=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
const project=(m,x,y)=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];
function setup(){const calls=[],canvases=[],patterns=[],missing=new Set(),requests=[],jobs=[];let matrix=[1,0,0,1,0,0],stack=[];
 const ctx={fillStyle:null,save(){stack.push([matrix.slice(),this.fillStyle]);},restore(){[matrix,this.fillStyle]=stack.pop();},transform(...n){matrix=mul(matrix,n);},translate(x,y){this.transform(1,0,0,1,x,y);},scale(x,y){this.transform(x,0,0,y,0,0);},createPattern(c,repeat){const p={c,repeat,setTransform(m){this.matrix=m;}};patterns.push(p);return p;},fillRect(...args){calls.push({op:'fillRect',args,matrix:matrix.slice(),style:this.fillStyle});},drawImage(...args){calls.push({op:'drawImage',args,matrix:matrix.slice()});}};
 for(const op of ['beginPath','moveTo','lineTo','closePath','fill','stroke','rect','clip'])ctx[op]=(...args)=>calls.push({op,args,matrix:matrix.slice()});
 const manifest=JSON.parse(read('assets/manifest.json')),sprites=Object.fromEntries(keys.map(k=>[k,manifest[k]||{w:146,h:146,units:3,pivots:{apertureTL:[40,30],apertureBR:[100,120]}}])),images=Object.fromEntries(keys.map(k=>[k,{key:k}]));
 const D={},math=Object.create(Math);math.random=()=>{throw Error('render RNG');};
 const env=vm.createContext({Math:math,D,DIST:[D],SPRITES:sprites,ctx,DOMMatrix:class{scale(x,y=x){return{a:x,d:y};}},spr(k){requests.push(k);return missing.has(k)?null:images[k];},cnv(w,h){const c={width:Math.ceil(w),height:Math.ceil(h),ops:[]},g={drawImage(...args){c.ops.push(args);}};for(const op of ['scale','translate','transform','save','restore','beginPath','rect','clip','moveTo','lineTo','closePath','fillRect','fill','stroke'])g[op]=(...args)=>c.ops.push({op,args});c.getContext=()=>g;canvases.push(c);return c;},R(){throw Error('render RNG');},setTimeout:f=>jobs.push(f),P:{x:0,y:0},drawGdrBuilding:()=>false,drawGdrDecorations(){},clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),dark:x=>x});
 vm.runInContext(read('js/iso.js'),env);vm.runInContext(read('js/koep-assets.js'),env);
 const run=s=>vm.runInContext(s,env),draw=(b,method='drawKoepBuildingLive')=>{env.b=b;run(`withRot(b,()=>{result=${method}(b);})`);return env.result;};return{env,run,draw,calls,canvases,patterns,missing,requests,sprites,images,ctx,jobs,flush:async()=>{while(jobs.length)jobs.shift()();await Promise.resolve();}};}
const building=(more={})=>({x:123,y:234,w:300,h:100,H:160,top:160,R0:0,vs:1,rot:0,spr:{key:'legacy'},lights:[],koep:{kind:'a',windows:[{x:21,y:14,w:18,h:26,lit:true,state:'plain'},{x:57,y:14,w:18,h:26,lit:false,state:'board'}],cuts:[],door:{x:90,y:126,w:24,h:34}},...more});
const rectCorners=c=>{const a=c.op==='drawImage'?c.args.slice(5):c.args;const[x,y,w,h]=a;return[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([u,v])=>project(c.matrix,u,v));};
function projection(b,x,y,z){const c=Math.cos(b.rot),s=Math.sin(b.rot),cx=b.x+b.w/2,cy=b.y+b.h/2,u=cx+(x-cx)*c-(y-cy)*s,v=cy+(x-cx)*s+(y-cy)*c;return[(u-v)*Math.SQRT1_2,(u+v)*Math.SQRT1_2/2-z];}
test('every missing component or invalid aperture gives complete legacy fallback before any paint',()=>{
 for(const key of keys){const s=setup();s.missing.add(key);const b=building();assert.equal(s.draw(b),false);assert.equal(s.calls.length,0);assert.equal(s.canvases.length,0);s.draw(b,'drawBox');assert.equal(s.calls.filter(c=>c.op==='drawImage'&&c.args[0]===b.spr).length,3);s.missing.clear();assert.equal(s.draw(b),true);}
 const s=setup();s.sprites[keys[0]].pivots.apertureBR=[0,0];assert.equal(s.draw(building()),false);assert.equal(s.calls.length,0);assert.equal(s.canvases.length,0);
});
test('live composition shares six source-resolution patterns without attaching caches to building records',()=>{
 const s=setup();for(let frame=0;frame<90;frame++){const b=building({x:frame*7,w:frame%2?420:187,rot:frame%2?.6:-.6,vs:frame%2?1.5:.8});const before=JSON.stringify(b);assert.equal(s.draw(b),true);assert.equal(JSON.stringify(b),before);assert.equal(s.canvases.length,6);assert.equal(s.patterns.length,6);}
 for(let n=0;n<6;n++){const m=s.sprites[keys[[1,3,5,7,8,12][n]]],c=s.canvases[n];assert.equal(c.width,m.w-2);assert.equal(c.height,m.h-2);assert.equal(c.ops.length,1);close(s.patterns[n].matrix.a,1/m.units);}
 assert.equal(s.run('koepAssetStats().perBuildingCanvasBytes'),0);assert.equal(s.run('koepAssetStats().canvasBytes'),s.canvases.reduce((n,c)=>n+c.width*c.height*4,0));
});
test('face geometry, crop and roof exactly meet the P3 footprint for arbitrary supported rotations and heights',()=>{
 for(const rot of [0,.6,-.6])for(const vs of [.7,1,1.5])for(const [w,h]of [[300,100],[187,160]]){const s=setup(),b=building({rot,vs,w,h});s.draw(b);const fills=s.calls.filter(c=>c.op==='fillRect'&&s.patterns.some(p=>p===c.style));const south=rectCorners(fills[0]);const wanted=[[b.x,b.y+h,b.H*vs],[b.x+w,b.y+h,b.H*vs],[b.x+w,b.y+h,0],[b.x,b.y+h,0]].map(p=>projection(b,...p));for(let i=0;i<4;i++)for(let j=0;j<2;j++)close(south[i][j],wanted[i][j]);const eastFill=fills[1],sw=Math.min(w,h*1.5),off=w-sw;for(const[u,v,x,y,z]of [[off,0,b.x+w,b.y+h,b.H*vs],[w,0,b.x+w,b.y,b.H*vs],[w,b.H,b.x+w,b.y,0],[off,b.H,b.x+w,b.y+h,0]]){const actual=project(eastFill.matrix,u,v),expected=projection(b,x,y,z);close(actual[0],expected[0]);close(actual[1],expected[1]);}const roof=rectCorners(fills.at(-1));for(const[i,p]of [[b.x,b.y,b.H*vs],[b.x+w,b.y,b.H*vs],[b.x+w,b.y+h,b.H*vs],[b.x,b.y+h,b.H*vs]].entries()){const expected=projection(b,...p);close(roof[i][0],expected[0]);close(roof[i][1],expected[1]);}}
});
test('painted openings align with every recorded window and legacy candle patches retain exact source pixels',()=>{
 for(const rot of [0,.6,-.6])for(const vs of [.8,1.5])for(const[kind,n]of [['a',0],['b',2],['c',4],['platte',6]]){const s=setup(),b=building({rot,vs});b.koep.kind=kind;s.draw(b);const m=s.sprites[keys[n]],paint=s.calls.find(c=>c.op==='drawImage'&&c.args[0]===s.images[keys[n]]),v=b.koep.windows[0],a=m.pivots.apertureTL,z=m.pivots.apertureBR,[,sx,sy,sw,sh,dx,dy,dw,dh]=paint.args;for(const[x,y,u,t]of [[a[0],a[1],v.x,v.y],[z[0],z[1],v.x+v.w,v.y+v.h]]){close(dx+(x-sx)/sw*dw,u);close(dy+(y-sy)/sh*dh,t);}assert.ok(dx>=v.x+v.w/2-18-1e-8);assert.ok(dx+dw<=v.x+v.w/2+18+1e-8);const copies=s.calls.filter(c=>c.op==='drawImage'&&c.args[0]===b.spr);assert.equal(copies.length,6);assert.deepEqual(copies[0].args.slice(1),[v.x,b.h+v.y,v.w,v.h,v.x,v.y,v.w,v.h]);}
});
test('Altbau, slab and collapsed roofs use their selected roof materials',()=>{
 for(const[kind,index]of [['a',4],['b',4],['c',5],['platte',3]]){const s=setup(),b=building();b.koep.kind=kind;s.draw(b);const fills=s.calls.filter(c=>c.op==='fillRect'&&s.patterns.includes(c.style));assert.equal(fills.at(-1).style,s.patterns[index]);}
});
test('overlapping ruin cuts use intersected complements on roof and both facades',()=>{
 const s=setup(),cuts=[[[0,98],[20,98],[10,145]],[[9,98],[28,98],[18,145]],[[50,0],[80,0],[65,20]]],b=building({koep:{kind:'c',windows:[],cuts}});s.draw(b);const clips=s.calls.filter(c=>c.op==='clip');assert.equal(clips.length,8);assert.equal(clips.filter(c=>c.args[0]==='evenodd').length,5);assert.equal(s.canvases.length,6,'no silhouette bitmap allocation');assert.equal(s.calls.filter(c=>c.op==='stroke').length,0,'no outline bridges a missing corner');
});
test('Späti retains sign, door, bars, side window, light records, and separate exterior geometry',()=>{
 const s=setup(),b=building({w:260,h:170,H:58,top:58,dx:105,dw:50,isSpati:true,ef:{key:'east'},lights:[{x:253,y:394,r:90},{x:253,y:319,inner:1}],koep:{kind:'shop',windows:[],cuts:[]}}),before=JSON.stringify(b);s.draw(b);assert.equal(JSON.stringify(b),before);assert.equal(s.calls.filter(c=>c.op==='drawImage'&&c.args[0]===s.images[keys[9]]).length,1);const legacy=s.calls.filter(c=>c.op==='drawImage'&&c.args[0]===b.spr);assert.ok(legacy.some(c=>JSON.stringify(c.args.slice(1))===JSON.stringify([71,172,118,18,71,2,118,18])));assert.ok(!legacy.some(c=>c.args[1]===0&&c.args[2]===170&&c.args[3]===260),'no full-width procedural fascia copy');assert.equal(legacy.length,3,'only sign, center shutter, and roof retain legacy pixels');const painted=s.calls.find(c=>c.op==='drawImage'&&c.args[0]===s.images[keys[9]]);assert.deepEqual(painted.args.slice(5),[0,0,260,58]);assert.ok(legacy.some(c=>c.args[1]===103&&c.args[2]===198&&c.args[3]===54));assert.equal(s.calls.filter(c=>c.op==='drawImage'&&c.args[0]===b.ef).length,2);
});
test('landmarks, gables, towers, vehicles and other districts opt out without requests or paint',()=>{
 for(const attrs of [{koep:null},{gable:24},{R0:20},{veh:{}},{bb:true}]){const s=setup();assert.equal(s.draw(building(attrs)),false);assert.equal(s.requests.length,0);assert.equal(s.calls.length,0);}const s=setup();s.env.D={i:1};assert.equal(s.draw(building()),false);assert.equal(s.requests.length,0);
});
test('queued projections default to 3 px/screen unit without DPR/Z, keep original sprites, then use one draw without allocations',async()=>{
 const s=setup(),b=building(),before=JSON.stringify(b);s.env.blds=[b];s.env.b=b;
 assert.equal(s.draw(b,'drawKoepBuilding'),false,'pending facade retains complete procedural fallback');assert.equal(s.canvases.length,6,'draw only initializes shared kit; facade allocation is scheduled');
 const ready=s.run('koepPrepare(b)');await s.flush();assert.equal(await ready,true);assert.equal(s.run('koepCacheReady(b)'),true);assert.equal(s.canvases.length,7);const c=s.canvases.at(-1);const bounds=s.run('koepBounds(b)');assert.equal(c.width,bounds.w*3);assert.equal(c.height,bounds.h*3);assert.deepEqual(c.ops[0],{op:'scale',args:[3,3]});assert.equal(JSON.stringify(b),before,'cache is external to gameplay/fallback records');
 s.calls.length=0;for(let frame=0;frame<60;frame++)assert.equal(s.draw(b,'drawKoepBuilding'),true);assert.equal(s.canvases.length,7);const painted=s.calls.filter(c=>c.op==='drawImage');assert.equal(painted.length,60,'one cached image draw per building includes every face, roof and shadow');assert.equal(painted[0].args[0],c);assert.deepEqual(painted[0].args.slice(1),[bounds.x,bounds.y,bounds.w,bounds.h]);assert.equal(s.run('koepAssetStats().perBuildingCanvasBytes'),c.width*c.height*4);
});
test('decimal 40 MB budget prioritizes nearby facades and evicts before allocating a newly visible source',async()=>{
 const s=setup(),near=building({x:0,y:0,w:800,H:650,top:650}),far=building({x:5000,y:5000,w:800,H:650,top:650});s.env.blds=[far,near];s.env.near=near;s.env.far=far;const before=JSON.stringify([near,far]),ready=s.run('koepPrepareMap()');await s.flush();await ready;assert.equal(s.run('koepCacheReady(near)'),true);assert.equal(s.run('koepCacheReady(far)'),false);const first=s.canvases.at(-1);let stats=s.run('koepAssetStats()');assert.equal(stats.cacheLimitBytes,40000000);assert.ok(stats.totalBytes<=40000000);assert.equal(stats.cachedBuildings,1);
 const fartherReady=s.run('koepPrepare(far)');await s.flush();assert.equal(await fartherReady,true);assert.equal(first.width,0,'eviction explicitly releases the decoded canvas before another is created');assert.equal(s.run('koepCacheReady(near)'),false);stats=s.run('koepAssetStats()');assert.equal(stats.evictions,1);assert.ok(stats.maxAllocatedBytes<=40000000);assert.ok(stats.totalBytes<=40000000);assert.equal(JSON.stringify([near,far]),before);
});
test('a forced visible cache keeps an already drawn farther building and evicts unused nearer prefetch',async()=>{
 const s=setup(),near=building({x:0,y:0,w:600,H:500,top:500}),drawn=building({x:4000,y:4000,w:600,H:500,top:500}),visible=building({x:7000,y:7000,w:600,H:500,top:500});s.env.blds=[visible,near,drawn];Object.assign(s.env,{near,drawn,visible});const ready=s.run('koepPrepareMap()');await s.flush();await ready;assert.equal(s.run('koepCacheReady(near)'),true);assert.equal(s.run('koepCacheReady(drawn)'),true);assert.equal(s.run('koepCacheReady(visible)'),false);assert.equal(s.run('KOEPCACHE.clock'),0,'prewarming never marks an entry as used');assert.equal(s.draw(drawn,'drawKoepBuilding'),true);assert.equal(s.run('KOEPCACHE.clock'),1);
 const prepared=s.run('koepPrepare(visible)');await s.flush();assert.equal(await prepared,true);assert.equal(s.run('koepCacheReady(near)'),false,'unused nearer prefetch loses to an actual visible draw');assert.equal(s.run('koepCacheReady(drawn)'),true);assert.equal(s.run('koepCacheReady(visible)'),true);assert.equal(s.run('KOEPCACHE.clock'),1,'scheduled preparation never increments draw usage');assert.ok(s.run('koepAssetStats().totalBytes')<=40000000);assert.equal(s.run('koepAssetStats().evictions'),1);
});
test('district/map exit releases facade memory and invalidates pending jobs without repeated allocation',async()=>{
 const s=setup(),b=building();s.env.blds=[b];let ready=s.run('koepPrepareMap()');await s.flush();await ready;const c=s.canvases.at(-1),count=s.canvases.length;s.env.D={i:1};assert.equal(s.draw(b,'drawKoepBuilding'),false);assert.equal(c.width,0);assert.equal(s.run('koepAssetStats().perBuildingCanvasBytes'),0);for(let i=0;i<10;i++)s.draw(b,'drawKoepBuilding');assert.equal(s.canvases.length,count);
 s.env.D=s.env.DIST[0];s.env.blds=[building({x:700})];ready=s.run('koepPrepareMap()');s.env.D={i:1};s.draw(b,'drawKoepBuilding');await s.flush();assert.equal(await ready,false);assert.equal(s.run('koepAssetStats().cachedBuildings'),0);assert.equal(s.canvases.length,count,'a cancelled job creates no canvas');
});
test('projected bounds enclose every face and shadow corner; rotation/dimension changes invalidate cached art',async()=>{
 const s=setup(),b=building();s.env.b=b;s.env.blds=[b];for(const rot of [0,.6,-.6]){b.rot=rot;assert.equal(s.run('koepCacheReady(b)'),false);const ready=s.run('koepPrepare(b)');await s.flush();assert.equal(await ready,true);const r=s.run('koepBounds(b)');for(const z of [0,b.H])for(const[u,v]of [[0,0],[b.w,0],[b.w,b.h],[0,b.h]]){const p=projection(b,b.x+u,b.y+v,z);assert.ok(p[0]>=r.x+1&&p[0]<=r.x+r.w-1);assert.ok(p[1]>=r.y+1&&p[1]<=r.y+r.h-1);}for(const[u,v]of [[0,0],[b.w,0],[b.w,b.h],[0,b.h]]){const p=projection(b,b.x+5+u,b.y+5+v,0);assert.ok(p[0]>=r.x+1&&p[0]<=r.x+r.w-1);assert.ok(p[1]>=r.y+1&&p[1]<=r.y+r.h-1);}assert.equal(s.draw(b,'drawKoepBuilding'),true);}
 const old=s.canvases.at(-1);b.w+=20;assert.equal(s.run('koepCacheReady(b)'),false);assert.equal(s.draw(b,'drawKoepBuilding'),false,'changed geometry returns complete fallback until rebuilt');await s.flush();assert.equal(old.width,0);assert.equal(s.run('koepCacheReady(b)'),true);assert.equal(s.draw(b,'drawKoepBuilding'),true);
});
// Frozen fallback/RNG fingerprints are from makeB before this task. They include drawing
// commands/style assignments, all RNG outputs, light records, and canvas allocations.
const fallbackFingerprints={
 'altbau:0':'29ce7328add19ecf9e7c115bc2406d01c57cbe2384a5e6eca36a88214bbbf33c',
 'altbau:1':'ae6aa9e408c114832d07614477af58d9b8b77c37124c1890c555fae8a240f32c',
 'altbau:2':'b26aa3e9be75feb1df5c48f380fef289f44f4bbde4490b5407e98c50e1d40048',
 'altbau:3':'cbec7a786d425f5212c8f29c17a726dfd2dc4888541569c4656d338ab976124b',
 'altbau:4':'fd42020fb110e7d01093948304c5f6ed3da8a87f6eb312a59d1953ef4500ff51',
 'platte:0':'6b240e23f91320db66fb42d43317dd597a90098e8168f47b1bbd07f6ec522046',
 'ruin:0':'3607f9b4dd6a9e82f88cf85f94438fed6845404a225d22741f2b8339f368f96b',
 'efh:0':'7486005852223760f9936faa262207d05071b2a6c76f9824270a6605703c3932',
 'reihen:0':'6140938af2e46598f3879b9ee1bb2bde6f6de70cc12cfa7db42093fe6079e170',
 'laube:0':'a81b952c57f7c4337b50a7da4b1882ca52410b3285c526b62484c216e0109dd7',
 'spati:0':'637f8bfdbc0f306b003157c34a0c7437851f1b6a10861f34dd5e22b850d5b69e'
};
function construct(st,V=0,source=read('js/world.js'),district=true){let seed=123456789,count=0,gid=0;const trace=[],canvases=[],math=Object.create(Math);math.random=()=>{count++;return(seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296;};
 const context=()=>new Proxy({},{get(o,k){if(k in o)return o[k];if(k==='createRadialGradient'||k==='createLinearGradient')return(...args)=>{const id=++gid;trace.push([k,...args,id]);return{id,addColorStop(...p){trace.push(['color',id,...p]);}};};return(...args)=>trace.push([k,...args]);},set(o,k,v){trace.push(['set',k,v]);o[k]=v;return true;}});
 const D={walls:['#5a3f2e','#4e3a2c','#634634'],roof:['#3a2a22','#45302a','#33261f']},env=vm.createContext({Math:math,D,DIST:district?[D]:[{}],BHS:2,BSC:1.6,TAGS:['KIEZ','BERLIN','LIEBE','RUINE','WIR BLEIBEN','HALT DURCH','SPREE','B36','HOFFNUNG','KEIN AUSGANG'],gx:context(),bShadow(){},R:(a,b)=>a+(b-a)*math.random(),pick:a=>a[Math.floor(math.random()*a.length)],wpick:()=>{math.random();return V;},cnv(w,h){const g=context(),c={width:w,height:h,getContext:()=>g};canvases.push(c);return c;}});
 vm.runInContext(fn(source,'bricks'),env);
 if(st==='spati'){Object.assign(env,{walls:[],blds:[],neons:[],reserved:[],spati:null,lotCands:()=>[{x0:0,y0:0,x1:900,y1:900}],resHit:()=>false,addBrk:(...a)=>trace.push(['addBrk',...a])});vm.runInContext(fn(source,'makeSpati')+'\nmakeSpati();b=spati;',env);}
 else{vm.runInContext(fn(source,'makeB'),env);env.b={x:200,y:300,w:192,h:96,H:180,top:180,R0:0};vm.runInContext(`makeB(b,${JSON.stringify(st)})`,env);}
 const data={trace,count,seed,lights:env.b.lights,canvases:canvases.map(c=>[c.width,c.height]),...(st==='spati'?{walls:env.walls,neons:env.neons,reserved:env.reserved}: {})};return{...data,b:env.b,hash:crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')};}
test('construction preserves legacy fallback pixels, RNG stream, lights, and one original canvas',()=>{
 for(const[fixture,hash]of Object.entries(fallbackFingerprints)){const[st,V]=fixture.split(':');const result=construct(st,+V);assert.equal(result.hash,hash,fixture);assert.equal(result.canvases.length,st==='spati'?2:1);}
 assert.ok(Object.keys(fallbackFingerprints).length>=10,'baseline fingerprints cover every legacy Altbau variant and non-target styles');
});
test('all recorded silhouette triangles equal the actual legacy destination-out paths',()=>{
 for(const[st,V]of [['ruin',0],['altbau',0],['altbau',4],['platte',0]]){const r=construct(st,V),cuts=[];let active=false,path=[];for(const op of r.trace){if(op[0]==='set'&&op[1]==='globalCompositeOperation')active=op[2]==='destination-out';if(!active)continue;if(op[0]==='beginPath')path=[];if(op[0]==='moveTo'||op[0]==='lineTo')path.push(op.slice(1));if(op[0]==='fill')cuts.push(path);}assert.deepEqual(JSON.parse(JSON.stringify(r.b.koep.cuts)),cuts);}
});
test('recorded candle centres match all original light anchors; non-target styles never get tags',()=>{
 let lights=0;for(const st of ['altbau','platte','ruin'])for(let V=0;V<5;V++){const r=construct(st,V);assert.ok(r.b.koep);for(const l of r.lights){const v=r.b.koep.windows.find(v=>v.lit&&Math.abs(l.x-(r.b.x+v.x+v.w/2))<1e-8&&Math.abs(l.y-(r.b.y-r.b.H+r.b.h+v.y+v.h/2))<1e-8);assert.ok(v,'each light retains its exact window');lights++;}assert.equal(construct(st,V,read('js/world.js'),false).b.koep,undefined);}
 assert.ok(lights>0,'fixture contains actual candle emitters');for(const st of ['efh','reihen','laube'])assert.equal(construct(st).b.koep,undefined);
});
export {construct};
test('cache bakes at device scale (DPR*Z, quarter steps, max 3) and a zoom change invalidates it',async()=>{
 const s=setup(),b=building();s.env.b=b;s.env.blds=[b];s.env.DPR=2;s.env.Z=1.1851851851851851;assert.equal(s.run('koepScale()'),2.5);
 let ready=s.run('koepPrepare(b)');await s.flush();assert.equal(await ready,true);const c=s.canvases.at(-1),r=s.run('koepBounds(b)');assert.equal(c.width,Math.ceil(r.w*2.5));assert.equal(c.height,Math.ceil(r.h*2.5));assert.deepEqual(c.ops[0],{op:'scale',args:[2.5,2.5]});assert.equal(s.run('koepAssetStats().perBuildingCanvasBytes'),c.width*c.height*4);
 s.env.Z=1.48;assert.equal(s.run('koepScale()'),3);assert.equal(s.run('koepCacheReady(b)'),false,'resize forces a rebake');ready=s.run('koepPrepare(b)');await s.flush();assert.equal(await ready,true);assert.equal(c.width,0,'stale cache released');assert.equal(s.canvases.at(-1).width,r.w*3);
 s.env.DPR=1;s.env.Z=1;assert.equal(s.run('koepScale()'),1);s.env.DPR=2;s.env.Z=1.8;assert.equal(s.run('koepScale()'),3);
});
