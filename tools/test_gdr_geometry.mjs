// Gameplay and fallback geometry: node --test tools/test_gdr_geometry.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const fn=(file,name)=>{const s=read(file),a=s.indexOf('function '+name+'('),b=s.indexOf('\nfunction ',a+1);assert.ok(a>=0,name);return s.slice(a,b<0?s.length:b);};
const close=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-9,label+`: ${a} vs ${b}`);
function setup(gdr=true){
 const draws=[],calls=[],math=Object.create(Math);math.random=()=>.5;
 const ctx=new Proxy({globalAlpha:1},{get(o,k){return k in o?o[k]:(...a)=>calls.push([k,...a]);}});
 const env=vm.createContext({Math:math,D:{i:0,gdr,bw:99,sw:99},run:{th:0,wave:3},P:{x:500,y:500,r:12},R:(a,b)=>{draws.push(['R',a,b]);return a+(b-a)*.37;},pick:a=>{draws.push(['pick',...a]);return a[0];},ilvl:()=>1,dm_:()=>false,DF:()=>({hp:1,dmg:1}),ctx,SPRITES:{},spr:()=>null,fxShadow(){},fxSil(){},SHD:()=>false,limb(){},stick(){},rr(){},glow:()=>({}),Image:class{},wE:()=>3,MIX:[[]],RZ:[],WS:4000,WH:4000,VIEWR:()=>300,clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),spati:null,enemies:[],inWall:()=>false,tip(){}});
 for(const name of ['mkEnemy','spawnOne'])vm.runInContext(fn('js/combat.js',name),env);for(const f of ['js/anim.js','js/art.js'])vm.runInContext(read(f),env);vm.runInContext(read('js/alex.js').split('/* ---- map:')[0],env);
 return{env,draws,calls,run:s=>vm.runInContext(s,env)};
}
test('constructors and authored references agree; only GDR ghouls grow',()=>{
 for(const gdr of [false,true]){const {env,run}=setup(gdr);for(const [type,r,h]of [['uhr',22,64],['ghoul',gdr?20:10,gdr?44:32]]){env.e=run(`mkEnemy('${type}',10,20)`);const spec=run('ENEMY_ART[enemyVariant(e)]');assert.equal(env.e.r,r);assert.equal(spec.r,r);assert.equal(spec.h,h);assert.equal(run('EANI[enemyVariant(e)].radius'),r);}}
 const {run}=setup();assert.equal(run("mkEnemy('shield',0,0).r"),13);assert.equal(run("mkEnemy('brute',0,0).r"),17);
});
test('larger enemies retain HP, damage, ghoul speed and exact constructor random draws',()=>{
 const expected=[['R',70,86],['R',118,140],['R',74,84],['R',92,104],['R',0,3],['R',1.5,2.5],['pick',-1,1],['R',0,6.28],['R',2,3.5]];
 for(const gdr of [false,true])for(const [type,hp,dmg,spd]of [['uhr',58,13,34],['ghoul',20,7,70+16*.37],['rat',6,3,118+22*.37]]){const {run,draws}=setup(gdr),e=run(`mkEnemy('${type}',10,20)`);assert.equal(e.hp,hp);assert.equal(e.max,hp);assert.equal(e.dmg,dmg);close(e.spd,spd*1.06*1.01,type+' speed');assert.deepEqual(draws,expected,type+' RNG');}
});
test('normal and elite spawn probes enclose enlarged radii without changing other types',()=>{
 for(const [type,gdr,probe,base]of [['uhr',true,25,22],['ghoul',true,23,20],['ghoul',false,20,10],['shield',false,20,13]])for(const elite of [false,true]){
  const {env,run}=setup(gdr),probes=[];env.inWall=(x,y,r)=>(probes.push(r),false);env.MIX=[type==='uhr'?[0,0,0,0,0,0,0,1]:type==='shield'?[0,0,1]:[]];let n=0;env.Math.random=()=>n++===0?(type==='ghoul'?.99:0):(elite?0:1);run('spawnOne()');const e=env.enemies.at(-1);assert.equal(e.type,type);assert.equal(e.r,elite?Math.round(base*1.15):base);assert.deepEqual(probes,[probe]);assert.ok(probe>=e.r);
 }
});
test('clock shield origin, vertical offset, panel and open drop scale with body, including elites; boss stays unchanged',()=>{
 const {env,run,calls}=setup();
 for(const boss of [false,true])for(const r of [13,22,25])for(const guard of [0,1])for(const fa of [0,.8]){calls.length=0;env.e={x:70,r,fa,guard,t:1};env.fy=100;env.boss=boss;run('gdrShield(e,fy,x=>x,boss)');const s=boss?1:r/13,sr=boss?r+4:17*s,tr=calls.find(c=>c[0]==='translate'),scale=calls.find(c=>c[0]==='scale');close(tr[1],70+Math.cos(fa)*sr,'shield x');close(tr[2],100-16*s+Math.sin(fa)*sr*.6+(guard?6*s:0),'shield y');assert.deepEqual(scale,['scale',s,s]);assert.equal(calls.find(c=>c[0]==='arc')[3],boss?20:11);assert.equal(calls.find(c=>c[0]==='transform')[4],guard?.5:1);}
});
test('painted and fallback feet use the selected ground offset; Brigade fallback keeps worker height',()=>{
 const {env,run,calls}=setup();env.enemyLife=()=>[1,1,0,0,0];env.P={x:1000,y:1000,r:12};
 for(const gdr of [false,true])for(const [type,r]of [['uhr',22],['ghoul',gdr?20:10],['shield',13]])for(const painted of [false,true]){calls.length=0;env.D.gdr=gdr;env.e={type,x:50,y:60,r,t:1,hp:1,max:2,fa:0,col:'#888'};env.enemySprite=painted?e=>({key:'test',i:{},m:{},spec:{r,h:44,...(type==='uhr'?{ground:.25}:{})}}):()=>null;env.drawEnemySprite=()=>44;run('drawEnemy(e,0)');const ground=type==='uhr'?.25:painted||type==='ghoul'&&gdr?.4:.75,fy=60+r*ground;close(calls.find(c=>c[0]==='translate')[2],fy,'feet ground');if(!painted&&type==='ghoul'){const scale=calls.filter(c=>c[0]==='scale')[1],h=gdr?44:36;close(scale[1],r/10,'fallback width');close(scale[2],gdr?44/36:1,'fallback height');const bar=calls.filter(c=>c[0]==='fillRect').at(-1);close(bar[2],fy-h*1.15-10,'fallback health bar');}}
});
test('muzzle anchors share the optional ground offset and retain the default for other families',()=>{
 const {env,run}=setup();env.e={type:'spitter',x:0,y:0,r:22,t:1};env.enemyLife=()=>[1,1,0,0,0];
 for(const ground of [undefined,.25]){env.enemySprite=()=>({m:{anchor:[0,0],units:3,pivots:{mouth:[0,0]}},spec:{r:22,...(ground===undefined?{}:{ground})}});close(run('enemyMuzzle(e).y'),22*(ground??.4),'muzzle feet anchor');}
});
test('actual contact attack starts at enlarged base and elite rings and keeps its damage and cooldown',()=>{
 const {env,run}=setup(),line=read('js/update.js').split('\n').find(s=>s.trimStart().startsWith('if(d<e.r+P.r+2&&'));
 assert.ok(line);vm.runInContext('function contact(e,d){'+line+'}',env);env.state='play';env.pk=()=>0;const hits=[];env.hurt=(...a)=>(hits.push(a),true);
 for(const [type,r,dmg]of [['uhr',22,13],['uhr',25,13],['ghoul',20,7],['ghoul',23,7]])for(const delta of [-.01,.01]){hits.length=0;env.e={type,r,dmg,hcd:0,stun:0,hp:1};env.d=r+env.P.r+2+delta;run('contact(e,d)');assert.equal(hits.length,delta<0?1:0,type+' contact boundary');if(delta<0){assert.deepEqual(hits[0],[dmg,5]);assert.equal(env.e.hcd,.9);assert.equal(env.e.atk,.25);}}
});
test('actual wall resolution and crowd separation account for enlarged base and elite radii',()=>{
 const {env,run}=setup();env.nearWalls=()=>[{x:100,y:0,w:100,h:200}];env.spSafe=()=>false;vm.runInContext(fn('js/world.js','collide'),env);vm.runInContext(fn('js/update.js','steer'),env);
 for(const r of [20,22,23,25]){env.e={x:90,y:100,r,fly:false,side:1};run('collide(e)');assert.equal(env.e.x,100-r);env.e={x:50,y:50,r,fly:false,side:1};env.P={x:50,y:500};env.enemies=[env.e,{x:50+r+10,y:50,r:10,fly:false}];const q=run('steer(e,0,1,450)');assert.ok(q[0]<0,'larger crowd ring separates touching actors');}
});
