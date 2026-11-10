// Painted building geometry/cache contract: node --test tools/test_gdr_buildings.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('assets/manifest.json'));
const kitKeys=['gdr-facade-south','gdr-facade-east','gdr-roof','gdr-ivy','gdr-plaster'].map(k=>'buildings/'+k);
const decorKeys=['gdr-banner-blue','gdr-banner-red','gdr-mural-pioneer'].map(k=>'buildings/'+k);
const close=(a,b,label='coordinate')=>assert.ok(Math.abs(a-b)<1e-8,`${label}: ${a} vs ${b}`);
const point=(a,b)=>{close(a[0],b[0]);close(a[1],b[1]);};
const mul=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
const project=(m,x,y)=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];
function setup(){
 const calls=[],canvases=[],patterns=[],requests=[],missing=new Set(),math=Object.create(Math);math.random=()=>{throw Error('rendering consumed random state');};
 let matrix=[1,0,0,1,0,0],stack=[];
 const ctx={fillStyle:null,save(){stack.push([matrix.slice(),this.fillStyle]);},restore(){[matrix,this.fillStyle]=stack.pop();},transform(...n){matrix=mul(matrix,n);},scale(x,y){this.transform(x,0,0,y,0,0);},translate(x,y){this.transform(1,0,0,1,x,y);},createPattern(c,repeat){const p={c,repeat,setTransform(m){this.matrix=m;}};patterns.push(p);return p;},fillRect(...args){calls.push({op:'fillRect',args,matrix:matrix.slice(),style:this.fillStyle});},drawImage(...args){calls.push({op:'drawImage',args,matrix:matrix.slice()});}};
 for(const op of ['beginPath','moveTo','lineTo','closePath','fill','stroke','rect','clip'])ctx[op]=(...args)=>calls.push({op,args,matrix:matrix.slice(),style:ctx.fillStyle});
 const sprites=structuredClone(manifest);for(const k of [...kitKeys,...decorKeys])sprites[k]??={w:362,h:482,units:3};
 const images=Object.fromEntries([...kitKeys,...decorKeys].map(k=>[k,{key:k}]));
 const env=vm.createContext({Math:math,D:{gdr:true},SPRITES:sprites,ctx,DOMMatrix:class{scale(x,y=x){return{a:x,b:0,c:0,d:y,e:0,f:0};}},spr(k){requests.push(k);return missing.has(k)?null:images[k];},cnv(w,h){const ops=[],c={width:w,height:h,ops,getContext:()=>({drawImage(...args){ops.push(args);}})};canvases.push(c);return c;},R(){throw Error('rendering consumed game RNG');},dark:c=>c,clamp:(x,a,b)=>Math.max(a,Math.min(b,x))});
 vm.runInContext(read('js/iso.js'),env);vm.runInContext(read('js/gdr-assets.js'),env);
 const run=s=>vm.runInContext(s,env),draw=(b,fn='drawGdrBuilding')=>{env.b=b;run(`withRot(b,()=>{result=${fn}(b);})`);return env.result;};
 return{env,run,draw,ctx,calls,canvases,patterns,requests,missing,images,sprites};
}
const building=(more={})=>({x:123,y:234,w:300,h:100,H:160,FH:160,top:160,R0:0,vs:1,rot:0,gdrKit:true,gdrDecor:true,lights:[],spr:{key:'legacy'},...more});
const corners=c=>{const a=c.args.length===9?c.args.slice(5):c.op==='drawImage'?c.args.slice(1):c.args;const[x,y,w,h]=a;return[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([x,y])=>project(c.matrix,x,y));};
function expectedFace(b,kind){const H=(b.FH||b.H)*(b.vs||1),p=(x,y,z)=>{const c=Math.cos(b.rot),s=Math.sin(b.rot),cx=b.x+b.w/2,cy=b.y+b.h/2;const u=cx+(x-cx)*c-(y-cy)*s,v=cy+(x-cx)*s+(y-cy)*c;return[(u-v)*Math.SQRT1_2,(u+v)*Math.SQRT1_2/2-z];};return(kind===0?[[b.x,b.y+b.h,H],[b.x+b.w,b.y+b.h,H],[b.x+b.w,b.y+b.h,0],[b.x,b.y+b.h,0]]:kind===1?[[b.x+b.w,b.y+b.h,H],[b.x+b.w,b.y,H],[b.x+b.w,b.y,0],[b.x+b.w,b.y+b.h,0]]:[[b.x,b.y,H],[b.x+b.w,b.y,H],[b.x+b.w,b.y+b.h,H],[b.x,b.y+b.h,H]]).map(q=>p(...q));}
test('any missing required kit image leaves no partial paint or shared cache, then retries',()=>{
 for(const missing of kitKeys){const s=setup();s.missing.add(missing);assert.equal(s.draw(building()),false);assert.equal(s.calls.length,0);assert.equal(s.canvases.length,0);assert.equal(s.patterns.length,0);assert.equal(s.run('gdrAssetStats().canvasBytes'),0);s.draw(building({gdrDecor:false}),'drawBox');assert.equal(s.calls.filter(c=>c.op==='drawImage'&&c.args[0]?.key==='legacy').length,3,'caller draws complete legacy fallback');s.calls.length=0;s.missing.clear();assert.equal(s.draw(building()),true);assert.equal(s.canvases.length,3);}
});
test('three cropped repeating textures are shared across sizes, rotations, scaling and replacement maps',()=>{
 const s=setup();let cacheBytes=0;
 for(const [index,b]of [building(),building({w:420,h:160,rot:.6,vs:1.5}),building({x:800,y:900,w:240,h:75,rot:-.6,vs:.7})].entries()){
  const before=JSON.stringify(b);assert.equal(s.draw(b),true);assert.equal(JSON.stringify(b),before,'draw does not attach per-building caches');assert.equal(s.canvases.length,3);assert.equal(s.patterns.length,3);if(index===0)cacheBytes=s.run('gdrAssetStats().canvasBytes');else assert.equal(s.run('gdrAssetStats().canvasBytes'),cacheBytes);
 }
 for(let n=0;n<3;n++){const m=s.sprites[kitKeys[n]],c=s.canvases[n],p=s.patterns[n];assert.equal(c.width,m.w-2);assert.equal(c.height,m.h-2);assert.equal(c.ops.length,1);assert.deepEqual(c.ops[0].slice(1),[1,1,m.w-2,m.h-2,0,0,m.w-2,m.h-2]);assert.equal(p.repeat,'repeat');close(p.matrix.a,1/m.units);close(p.matrix.d,1/m.units);}
 for(let frame=0;frame<60;frame++)s.draw(building({x:frame*3,rot:frame%2?.6:-.6}));assert.equal(s.canvases.length,3);assert.equal(s.patterns.length,3);
 assert.equal(cacheBytes,s.canvases.reduce((n,c)=>n+c.width*c.height*4,0));
});
test('painted face corners exactly match true P3 footprint and scaled height at supported rotations',()=>{
 for(const rot of [0,.6,-.6])for(const vs of [.65,1,1.6])for(const zoom of [1,2])for(const [w,h,FH]of [[300,100,160],[187,67,113]]){const s=setup(),b=building({rot,vs,w,h,FH});s.ctx.scale(zoom,zoom);assert.equal(s.draw(b),true);const fills=s.calls.filter(c=>c.op==='fillRect'&&s.patterns.includes(c.style));assert.equal(fills.length,3);for(let n=0;n<3;n++)corners(fills[n]).forEach((p,i)=>point(p,expectedFace(b,n)[i].map(v=>v*zoom)));}
});
test('unsupported anchors opt out before image requests or paint',()=>{
 for(const attrs of [{gable:30},{R0:24},{lights:[{x:1,y:2}]},{h:44},{FH:59},{FH:100,vs:.59}])for(const fn of ['drawGdrBuilding','drawGdrDecorations']){const s=setup();assert.equal(s.draw(building(attrs),fn),false);assert.equal(s.requests.length,0);assert.equal(s.calls.length,0);assert.equal(s.canvases.length,0);}
});
test('kit and decor enforce their own minimum supported width before loading images',()=>{
 for(const [fn,w]of [['drawGdrBuilding',47],['drawGdrDecorations',119]]){const s=setup();assert.equal(s.draw(building({w}),fn),false);assert.equal(s.requests.length,0);assert.equal(s.calls.length,0);}
});
test('missing decor retains all three painted kit faces, ivy and plaster without partial banners',()=>{
 for(const missing of decorKeys){const s=setup();s.missing.add(missing);assert.equal(s.draw(building()),true);assert.equal(s.calls.filter(c=>c.op==='fillRect'&&s.patterns.includes(c.style)).length,3);const painted=s.calls.filter(c=>c.op==='drawImage').map(c=>c.args[0].key);assert.deepEqual(painted,['buildings/gdr-ivy','buildings/gdr-plaster']);assert.equal(s.canvases.length,3);s.calls.length=0;s.missing.clear();assert.equal(s.draw(building()),true);assert.deepEqual(s.calls.filter(c=>c.op==='drawImage').map(c=>c.args[0].key),['buildings/gdr-ivy','buildings/gdr-plaster',...decorKeys]);assert.equal(s.canvases.length,3,'decor recovery reuses kit cache');}
});
test('missing kit preserves complete legacy faces and available decor',()=>{
 for(const missing of kitKeys){const s=setup();s.missing.add(missing);s.draw(building(),'drawBox');assert.deepEqual(s.calls.filter(c=>c.op==='drawImage').map(c=>c.args[0].key),['legacy','legacy','legacy',...decorKeys]);assert.equal(s.canvases.length,0);}
});
test('missing decor leaves full legacy canvas fallback and no painted overlay',()=>{
 for(const missing of decorKeys){const s=setup();s.missing.add(missing);const b=building({gdrKit:false});s.draw(b,'drawBox');assert.equal(s.calls.filter(c=>c.op==='drawImage'&&c.args[0]===b.spr).length,3);assert.equal(s.calls.filter(c=>c.op==='drawImage'&&c.args[0]?.key?.startsWith('buildings/gdr-')).length,0);assert.equal(s.canvases.length,0);}
});
test('other districts request no GDR images and draw exactly the untagged legacy box',()=>{
 const s=setup();s.env.D.gdr=false;const b=building();s.draw(b,'drawBox');const actual=structuredClone(s.calls);assert.equal(s.requests.length,0);assert.equal(s.canvases.length,0);s.calls.length=0;s.ctx.fillStyle=null;s.draw({...b,gdrKit:false,gdrDecor:false},'drawBox');assert.deepEqual(s.calls,actual);
});
test('decor image rectangles remain entirely within their south or east face',()=>{
 for(const fn of ['drawGdrBuilding','drawGdrDecorations'])for(const rot of [0,.6,-.6])for(const [w,h,H,vs]of [[120,45,60,1],[300,100,160,1],[420,150,100,1.5]]){const s=setup(),b=building({rot,w,h,H,FH:H,top:H,vs,gdrKit:false});b.gdrKit=true;assert.equal(s.draw(b,fn),true);const drawings=s.calls.filter(c=>c.op==='drawImage');assert.ok(drawings.length>0);for(const c of drawings){const f=c.args[0].key.endsWith('banner-red')?1:0,face=expectedFace(b,f),origin=face[0],u=[face[1][0]-origin[0],face[1][1]-origin[1]],v=[face[3][0]-origin[0],face[3][1]-origin[1]],det=u[0]*v[1]-u[1]*v[0];for(const p of corners(c)){const x=p[0]-origin[0],y=p[1]-origin[1],a=(x*v[1]-y*v[0])/det,z=(u[0]*y-u[1]*x)/det;assert.ok(a>=-1e-8&&a<=1+1e-8,`horizontal decor bound ${a}`);assert.ok(z>=-1e-8&&z<=1+1e-8,`vertical decor bound ${z}`);}}}
});

test('narrow vertical Zucker blocks retain exact kit faces and bounded ivy/plaster at scaled rotations',()=>{
 for(const w of [48,52])for(const H of [60,140])for(const rot of [0,.6,-.6])for(const vs of [1,1.5])for(const zoom of [1,2]){const s=setup(),b=building({w,h:200,H,FH:H,top:H,rot,vs});s.ctx.scale(zoom,zoom);assert.equal(s.draw(b),true);const fills=s.calls.filter(c=>c.op==='fillRect'&&s.patterns.includes(c.style));assert.equal(fills.length,3);for(let n=0;n<3;n++)corners(fills[n]).forEach((p,i)=>point(p,expectedFace(b,n)[i].map(v=>v*zoom)));const overlays=s.calls.filter(c=>c.op==='drawImage');assert.deepEqual(overlays.map(c=>c.args[0].key),['buildings/gdr-ivy','buildings/gdr-plaster']);const face=expectedFace(b,0).map(p=>p.map(v=>v*zoom)),origin=face[0],u=[face[1][0]-origin[0],face[1][1]-origin[1]],v=[face[3][0]-origin[0],face[3][1]-origin[1]],det=u[0]*v[1]-u[1]*v[0];for(const c of overlays)for(const p of corners(c)){const x=p[0]-origin[0],y=p[1]-origin[1],a=(x*v[1]-y*v[0])/det,z=(u[0]*y-u[1]*x)/det;assert.ok(a>=-1e-8&&a<=1+1e-8,`horizontal narrow overlay bound ${a}`);assert.ok(z>=-1e-8&&z<=1+1e-8,`vertical narrow overlay bound ${z}`);}}
});
