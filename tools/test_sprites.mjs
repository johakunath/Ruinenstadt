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
