// Exercise the production damage path, including mitigation, lethal follow-up and immunity.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../js/combat.js',import.meta.url),'utf8');
function setup(maxHp=461,res=.24){const env=vm.createContext({Math,P:{hp:maxHp,inv:0,guard:0,mvx:1,mvy:0},ST:{maxHp,res},state:'play',run:{tl:{dmg:0,hm:1}},nums:[],shocks:[],shake:0,spSafe:()=>false,hasL:()=>false,pk:()=>false,sfx(){},buzz(){},burst(){},die(){env.deaths++;env.P.hp=0;env.state='over';},deaths:0});for(const name of ['incomingDamage','enemyContactKind','hurt']){const a=source.indexOf('function '+name+'('),b=source.indexOf('\nfunction ',a+1);vm.runInContext(source.slice(a,b<0?source.length:b),env);}return{env,run:s=>vm.runInContext(s,env)};}
test('no hit can remove full maximum health, across damage scaling, armor and difficulties',()=>{
 for(const hp of [20,461,1000])for(const res of [-.5,0,.24,.75])for(const raw of [1,150,625,1e9])for(const difficulty of [.65,1.25,1.7]){const q=setup(hp,res);q.env.raw=raw*difficulty;assert.equal(q.run('hurt(raw,12)'),true);assert.ok(q.env.P.hp>0);assert.ok(q.env.run.tl.dmg<=Math.floor(hp*.45));assert.equal(q.env.deaths,0);}
});
test('strong attacks remain lethal in three hits, with shared immunity preventing same-frame stacking',()=>{
 const q=setup();q.run('hurt(10000,12)');assert.equal(q.env.P.hp,254);assert.equal(q.run('hurt(10000,12)'),false);assert.equal(q.env.P.hp,254);q.run('P.inv=0;hurt(10000,12)');assert.equal(q.env.P.hp,47);q.run('P.inv=0;hurt(10000,12)');assert.equal(q.env.deaths,1);assert.equal(q.env.run.tl.dmg,621);
});
test('body contact chips less than heavy bodies; actual charges and dives retain attack damage',()=>{
 const q=setup();assert.equal(q.run("incomingDamage(200,'contact')"),46);assert.equal(q.run("incomingDamage(200,'heavy-contact')"),61);assert.equal(q.run("incomingDamage(200,'attack')"),152);assert.equal(q.run("incomingDamage(10000,'contact')"),46);assert.equal(q.run("incomingDamage(10000,'heavy-contact')"),82);
 q.env.e={type:'ghoul',r:20,ru:0,dive:0};assert.equal(q.run('enemyContactKind(e)'),'heavy-contact');q.env.e.r=10;assert.equal(q.run('enemyContactKind(e)'),'contact');
 for(const type of ['ghoul','rat','brute','boss','uhr']){q.env.e={type,ru:0,dive:0};assert.equal(q.run('enemyContactKind(e)'),['brute','boss','uhr'].includes(type)?'heavy-contact':'contact');q.env.e.ru=.2;assert.equal(q.run('enemyContactKind(e)'),'attack');q.env.e.ru=0;q.env.e.dive=.2;assert.equal(q.run('enemyContactKind(e)'),'attack');}
});
test('guard and stance reductions still reduce a normal uncapped hit',()=>{const q=setup();q.env.P.guard=1;assert.equal(q.run("incomingDamage(100,'attack')"),23);q.env.P.guard=0;q.env.pk=k=>k==='stellung';q.env.P.mvx=0;assert.equal(q.run("incomingDamage(100,'attack')"),57);});
