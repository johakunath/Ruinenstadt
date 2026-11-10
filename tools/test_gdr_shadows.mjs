// GDR shadow cache invariants: node --test tools/test_gdr_shadows.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
function setup(){
 const canvases=[],draws=[],ops=[],env=vm.createContext({Math,D:{day:true},P:{dark:false},ctx:{globalAlpha:1,save(){},restore(){this.globalAlpha=1;},translate(...a){ops.push(['translate',...a]);},scale(...a){ops.push(['scale',...a]);},transform(...a){ops.push(['transform',...a]);},drawImage(...a){draws.push({args:a,alpha:this.globalAlpha});}},cnv(w,h){const calls=[],g={setTransform(...a){calls.push(['setTransform',...a]);},drawImage(...a){calls.push(['drawImage',...a]);},fillRect(...a){calls.push(['fillRect',...a]);}};const c={width:w,height:h,calls,getContext:()=>g};canvases.push(c);return c;}});vm.runInContext(read('js/vfx.js'),env);return{env,canvases,draws,ops,run:s=>vm.runInContext(s,env)};
}
test('GDR cache separates frames, light projection and face while reusing across position and elite scale',()=>{
 const {env,canvases,draws,ops,run}=setup();env.i={};env.m={w:126,h:192,anchor:[60,190],units:3};
 for(const key of ['enemies/uhr-idle','enemies/uhr-walk-a','enemies/brigadeghoul-idle'])for(const dark of [false,true])for(const fl of [-1,1]){env.key=key;env.P.dark=dark;env.fl=fl;const n=canvases.length;run('fxSil(key,i,m,10,20,1.15,fl)');assert.equal(canvases.length,n+1);run('fxSil(key,i,m,100,200,1.3,fl)');assert.equal(canvases.length,n+1,'position/elite scale reuse');}
 assert.equal(run('Object.keys(GSIL).length'),12);assert.equal(run('Object.keys(SIL).length'),0);assert.equal(ops.filter(c=>c[0]==='transform').length,0,'no per-frame affine warp');assert.ok(ops.filter(c=>c[0]==='scale').every(c=>c[1]===c[2]),'runtime scales uniformly');assert.ok(draws.every(c=>c.alpha===.3),'day alpha retained even in a dark area');
 env.D.day=false;run("fxSil('enemies/uhr-idle',i,m,0,0,1,-1)");assert.equal(canvases.length,12,'night reuses the existing short projection');assert.equal(draws.at(-1).alpha,.38);
});
test('projected canvases enclose every source corner with two pixels of padding and expose world bounds',()=>{
 const {env,canvases,draws,run}=setup();env.i={};env.m={w:113,h:197,anchor:[58,190],units:3};
 for(const dark of [false,true])for(const fl of [-1,1]){env.P.dark=dark;env.fl=fl;run("fxSil('enemies/uhr-hit',i,m,0,0,1,fl)");const cv=canvases.at(-1),t=cv.calls.find(c=>c[0]==='setTransform').slice(1),[a,b,c,d,e,f]=t;
  for(const x of [0,env.m.w])for(const y of [0,env.m.h]){const u=a*x+c*y+e,v=b*x+d*y+f;assert.ok(u>=2-1e-9&&u<=cv.width-2+1e-9,'horizontal padding');assert.ok(v>=2-1e-9&&v<=cv.height-2+1e-9,'vertical padding');}
  assert.deepEqual(cv.calls.filter(c=>c[0]==='setTransform').at(-1),['setTransform',1,0,0,1,0,0]);assert.equal(draws.at(-1).args[3],cv.width/env.m.units);assert.equal(draws.at(-1).args[4],cv.height/env.m.units);
 }
});
test('other enemies retain the existing silhouette cache and affine rendering path',()=>{
 const {env,canvases,ops,run}=setup();env.i={};env.m={w:60,h:96,anchor:[30,94],units:3};for(const key of ['enemies/ghoul-idle','enemies/shield-idle','bosses/uhr-idle']){env.key=key;run('fxSil(key,i,m,0,0,1,-1)');run('fxSil(key,i,m,10,20,2,1)');}
 assert.equal(canvases.length,3);assert.equal(run('Object.keys(SIL).length'),3);assert.equal(run('Object.keys(GSIL).length'),0);assert.equal(ops.filter(c=>c[0]==='transform').length,6);
});
