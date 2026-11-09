// No packages needed: node --test tools/test_sprites.mjs
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../js/sprites.js',import.meta.url),'utf8');
function setup(fetch){const images=[];class Image{constructor(){this.complete=false;this.naturalWidth=0;images.push(this);}}const ctx=vm.createContext({fetch,Image});vm.runInContext(source,ctx);return{ctx,images,run:code=>vm.runInContext(code,ctx)};}
test('manifest loads once; images load once on demand; missing and failed images return null',async()=>{
  let requests=0;const env=setup(async()=>{requests++;return{ok:true,json:async()=>({'enemies/ghoul-idle':{w:32,h:64}})};});
  assert.equal(env.run("spr('enemies/ghoul-idle')"),null);
  await env.run('spriteReady');assert.equal(requests,1);assert.equal(env.images.length,0);
  assert.equal(env.run("spr('enemies/missing')"),null);assert.equal(env.images.length,0);
  assert.equal(env.run("spr('enemies/ghoul-idle')"),null);assert.equal(env.images.length,1);
  const im=env.images[0];assert.equal(im.src,'assets/enemies/ghoul-idle.webp');
  im.complete=true;assert.equal(env.run("spr('enemies/ghoul-idle')"),null);
  im.naturalWidth=32;assert.equal(env.run("spr('enemies/ghoul-idle')"),im);
  assert.equal(env.images.length,1);assert.equal(requests,1);
});
test('network, HTTP and invalid JSON failures leave fallback available',async()=>{
  for(const fetch of [async()=>{throw Error('offline');},async()=>({ok:false,status:404}),async()=>({ok:true,json:async()=>{throw Error('JSON');}})]){
    const env=setup(fetch);await env.run('spriteReady');assert.equal(env.run("spr('enemies/ghoul-idle')"),null);
  }
});
test('generic poses follow contact, walk, stun and hit timers with variant and missing-pose fallback',()=>{
  const art=readFileSync(new URL('../js/anim.js',import.meta.url),'utf8'),code=art.slice(art.indexOf('const EANI='),art.indexOf('const EFLASH='));
  const ctx=vm.createContext({P:{x:100,y:100,r:12},D:{},SPRITES:{'enemies/ghoul-idle':{anchor:[20,110],units:3},'enemies/rat-idle':{anchor:[20,30],units:3}},spr:()=>({})});vm.runInContext(code,ctx);
  const pose=e=>{ctx.e={type:'ghoul',x:0,y:0,r:10,hcd:1,t:0,...e};return vm.runInContext('enemySprite(e)?.key',ctx);};
  assert.equal(pose({}),'enemies/ghoul-idle');assert.equal(pose({mv:60,t:0}),'enemies/ghoul-walk-a');assert.equal(pose({mv:60,t:.2}),'enemies/ghoul-walk-b');
  assert.equal(pose({x:100,y:80,hcd:.1}),'enemies/ghoul-attack-a');assert.equal(pose({atk:.24}),'enemies/ghoul-attack-b');assert.equal(pose({atk:.05}),'enemies/ghoul-attack-a');
  assert.equal(pose({atk:.24,flash:.1}),'enemies/ghoul-hit');assert.equal(pose({stun:1,mv:60}),'enemies/ghoul-hit');assert.equal(pose({type:'shield'}),undefined);
  ctx.spr=k=>k.endsWith('-idle')?{}:null;assert.equal(pose({type:'rat',mv:60}),'enemies/rat-idle');assert.equal(pose({type:'rat',atk:.24}),'enemies/rat-idle');assert.equal(pose({type:'boss'}),undefined);ctx.spr=()=>({});// generic driver: any type with an idle frame, missing poses fall back
  ctx.D.gdr=1;assert.equal(pose({}),undefined);ctx.SPRITES['enemies/brigadeghoul-idle']={anchor:[20,110],units:3};assert.equal(pose({}),'enemies/brigadeghoul-idle');ctx.D.gdr=0;ctx.spr=()=>null;assert.equal(pose({}),undefined);
});
