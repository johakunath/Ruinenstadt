// Task06 source/runtime invariants: node --test tools/test_bosses.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('assets/manifest.json'));
const bosses='hauptmann hexe bassprediger flieger brand ratten ritter platte volk'.split(' '),poses='idle walk-a walk-b attack-a attack-b hit'.split(' ');
function setup(){const env=vm.createContext({Math,Image:class{},D:{},P:{x:100,y:100,r:12},SPRITES:manifest,spr:key=>manifest[key]?{naturalWidth:manifest[key].w}:null});vm.runInContext(read('js/anim.js'),env);return{env,run:s=>vm.runInContext(s,env)};}
test('all nine bosses have six anchored offline frames inside the decoded budget',()=>{
 let bytes=0;const ctx=vm.createContext({self:{addEventListener(){}},caches:{}});vm.runInContext(read('sw.js'),ctx);const shell=Array.from(vm.runInContext('SHELL',ctx));
 for(const boss of bosses)for(const pose of poses){const key=`bosses/${boss}-${pose}`,m=manifest[key];assert.ok(m,key);assert.equal(m.units,3,key);assert.ok(m.anchor[0]>=0&&m.anchor[0]<m.w&&m.anchor[1]>=0&&m.anchor[1]<m.h,key+' anchor');assert.ok(fs.existsSync(new URL('../assets/'+key+'.webp',import.meta.url)),key+' image');assert.ok(shell.includes(`assets/${key}.webp`),key+' offline');bytes+=m.w*m.h*4;}
 assert.ok(bytes<40_000_000,`decoded ${bytes}`);
});
test('district boss variant and pose selection are deterministic and use the bosses group',()=>{
 const {env,run}=setup(),specs=run('ENEMY_ART');env.Math.random=()=>{throw Error('gameplay RNG consumed');};
 for(let v=0;v<bosses.length;v++){const boss=bosses[v];assert.equal(specs[boss].r,42,boss);env.e={type:'boss',big:true,v,x:0,y:0,r:42,hcd:1,t:0};assert.equal(run('enemySprite(e)?.key'),`bosses/${boss}-idle`);env.e.mv=60;assert.equal(run('enemySprite(e)?.key'),`bosses/${boss}-walk-a`);env.e.mv=0;env.e.atk=.24;assert.equal(run('enemySprite(e)?.key'),`bosses/${boss}-attack-b`);env.e.flash=.1;assert.equal(run('enemySprite(e)?.key'),`bosses/${boss}-hit`);}
 env.spr=()=>null;env.e={type:'boss',big:true,v:0,x:0,y:0,r:42,hcd:1,t:0};assert.equal(run('enemySprite(e)'),null,'missing art keeps canvas fallback');
 env.spr=key=>manifest[key]?{naturalWidth:manifest[key].w}:null;run('BOSS_ART_ENABLED=false');assert.equal(run('enemySprite(e)'),null,'performance toggle keeps canvas fallback');
});
test('builder records five source cells and the deliberate idle-to-walk-b reuse',()=>{
 const picks=JSON.parse(read('assets/raw/codex/06-bosses/poses/picks.json'));
 for(const boss of bosses){assert.equal(picks[`${boss}-idle`].cell,0,boss);assert.equal(picks[`${boss}-walk-a`].cell,1,boss);assert.equal(picks[`${boss}-walk-b`].cell,0,boss);assert.equal(picks[`${boss}-attack-a`].cell,2,boss);assert.equal(picks[`${boss}-attack-b`].cell,3,boss);assert.equal(picks[`${boss}-hit`].cell,4,boss);}
});
test('painted Zitadellenritter retains the directional guard-aware shield overlay',()=>{
 const art=read('js/art.js');
 assert.match(art,/else if\(SHD\(e\)&&!drawEnemyShield\(e,fy\)\)/);
 assert.doesNotMatch(art,/SHD\(e\)&&!\(g&&e\.type==='boss'&&e\.big\)/);
});
