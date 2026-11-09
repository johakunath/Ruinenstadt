// Renderer invariants: node --test tools/test_enemies.mjs (no browser required).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('assets/manifest.json'));
const variants='ghoul brute spitter rat crow shield bomb howl raser schrottkoloss kabel bass uhr wurz kern brigadeghoul'.split(' ');
const poses='idle walk-a walk-b attack-a attack-b hit'.split(' ');
function setup(){
 const env=vm.createContext({Math,Image:class{},D:{},P:{x:100,y:100,r:12},SPRITES:manifest,spr:key=>manifest[key]?{naturalWidth:manifest[key].w}:null});
 vm.runInContext(read('js/anim.js'),env);vm.runInContext(read('js/art.js'),env);return{env,run:s=>vm.runInContext(s,env)};
}
test('every selected enemy family has six authored, anchored, cached frames',()=>{
 const {run}=setup(),specs=run('ENEMY_ART');
 for(const variant of variants){
  assert.ok(specs[variant],variant+' spec');assert.ok(specs[variant].r>0&&specs[variant].h>0,variant+' base dimensions');
  if(variant!=='crow')assert.ok(Math.abs(manifest[`enemies/${variant}-idle`].h/3-specs[variant].h)<1.5,variant+' authored idle height keeps bars and stun ring aligned');
  for(const pose of poses){const key=`enemies/${variant}-${pose}`,m=manifest[key];assert.ok(m,key);assert.equal(m.units,3,key+' units');assert.ok(m.w>0&&m.h>0,key+' dimensions');assert.equal(m.anchor.length,2);assert.ok(m.anchor[0]>=0&&m.anchor[0]<m.w&&m.anchor[1]>=0&&m.anchor[1]<m.h,key+' anchor');assert.ok(fs.existsSync(new URL('../assets/'+key+'.webp',import.meta.url)),key+' image');}
 }
 const ctx=vm.createContext({self:{addEventListener(){}},caches:{}});vm.runInContext(read('sw.js'),ctx);const shell=Array.from(vm.runInContext('SHELL',ctx));
 for(const variant of variants)for(const pose of poses)assert.ok(shell.includes(`assets/enemies/${variant}-${pose}.webp`),variant+' '+pose+' offline shell');
 assert.ok(manifest['enemies/shield-panel']);assert.ok(shell.includes('assets/enemies/shield-panel.webp'));
});
test('pose selection follows hit, contact, movement and attack timers for every family',()=>{
 const {env,run}=setup();
 const pose=(variant,changes={})=>{env.D={gdr:variant==='brigadeghoul'};env.e={type:variant==='brigadeghoul'?'ghoul':variant==='schrottkoloss'?'boss':variant,x:0,y:0,r:10,hcd:1,t:0,...changes};return run('enemySprite(e)?.key');};
 for(const variant of variants){
  assert.equal(pose(variant),`enemies/${variant}-idle`);
  assert.equal(pose(variant,{mv:60,t:0}),`enemies/${variant}-walk-a`);
  assert.equal(pose(variant,{mv:60,t:.2}),`enemies/${variant}-walk-b`);
  assert.equal(pose(variant,{atk:.24}),`enemies/${variant}-attack-b`);
  assert.equal(pose(variant,{atk:.05}),`enemies/${variant}-attack-a`);
  assert.equal(pose(variant,{flash:.1,atk:.24}),`enemies/${variant}-hit`);
  assert.equal(pose(variant,{stun:1,mv:60}),`enemies/${variant}-hit`);
 }
 assert.equal(pose('ghoul',{x:100,y:80,hcd:.1}),'enemies/ghoul-attack-a');
 assert.equal(pose('schrottkoloss',{big:true}),undefined,'district bosses remain canvas until task 06');
 assert.equal(pose('unknown'),undefined);env.spr=()=>null;assert.equal(pose('brute'),undefined,'missing frame falls back');
});
test('mouth anchors are explicit for ranged frames and do not move combat positions',()=>{
 for(const variant of ['spitter','kern'])for(const pose of poses){const key=`enemies/${variant}-${pose}`,m=manifest[key];assert.ok(m?.pivots?.mouth,key+' named mouth');const [x,y]=m.pivots.mouth;assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<m.w&&y>=0&&y<m.h,key+' mouth bounds');}
 const {env,run}=setup();for(const variant of ['spitter','kern']){env.e={type:variant,x:50,y:70,r:11,hcd:1,t:0};const before=JSON.stringify(env.e);const offset=run('enemyMuzzle(e)');assert.ok(offset&&Number.isFinite(offset.x)&&Number.isFinite(offset.y),variant+' mouth screen vector');assert.equal(JSON.stringify(env.e),before);}
});
test('elite radius scales painted bodies from each family base radius',()=>{
 const {env,run}=setup(),specs=run('ENEMY_ART');
 for(const variant of variants){const scales=[],images=[];env.ctx={save(){},restore(){},scale(...s){scales.push(s);},translate(){},drawImage(...args){images.push(args);}};env.D={gdr:variant==='brigadeghoul'};env.e={type:variant==='brigadeghoul'?'ghoul':variant==='schrottkoloss'?'boss':variant,x:0,y:0,r:specs[variant].r*1.15,hcd:1,t:0};const height=run('drawEnemySprite(enemySprite(e),e,x=>x)');assert.ok(height>0,variant);assert.equal(scales.length,1,variant);assert.ok(Math.abs(scales[0][0]-1.15)<1e-9,variant);assert.equal(images.length,1,variant);const m=manifest[`enemies/${variant}-idle`];assert.deepEqual(images[0].slice(1),[-m.anchor[0]/m.units,-m.anchor[1]/m.units,m.w/m.units,m.h/m.units],variant+' authored anchor');}
});
test('spit originates visually at the mouth while legacy projectile collision coordinates stay fixed',()=>{
 const {env,run}=setup(),combat=read('js/combat.js'),from=combat.indexOf('function fireGlob('),to=combat.indexOf('\nfunction ',from+1);vm.runInContext(combat.slice(from,to<0?combat.length:to),env);
 env.ix=(x,y)=>(x-y)*Math.SQRT1_2;env.iy=(x,y)=>(x+y)*Math.SQRT1_2/2;
 for(const type of ['spitter','kern'])for(const face of [1,-1]){
  env.P={x:face*100,y:0,r:12};env.e={type,x:0,y:0,r:11,hcd:1,t:0,dmg:9};env.eproj=[];run('fireGlob(e,.4,210)');const p=env.eproj[0],m=run('enemyMuzzle(e)');
  assert.equal(p.x,0);assert.equal(p.y,-14);assert.equal(p.r,6);assert.equal(p.life,3.5);assert.equal(p.ml,p.life);assert.equal(p.dmg,9);assert.equal(p.vx,Math.cos(.4)*210);assert.equal(p.vy,Math.sin(.4)*210);assert.equal(env.e.cast,.22);
  assert.ok(Math.abs(env.ix(p.x,p.y)+p.mx-m.x)<1e-9);assert.ok(Math.abs(env.iy(p.x,p.y)-10+p.my-m.y)<1e-9);
 }
});
