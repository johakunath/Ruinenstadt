const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
// Load the runner without starting Chromium or requiring an installed Playwright.
const env={require:k=>k==='playwright'?{}:require(k),module:{exports:{}},__dirname:__dirname,process:{env:{}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/perf_koep.cjs','utf8'),env);
const{nullVerdict,verdict,exitCode}=env.module.exports;
test('null control rejects negative bias, wide noise and insufficient samples',()=>{
 for(const [lo,hi,n]of[[-20,4,21],[-6,-1,21],[-1,6,21],[6,9,21],[-1,1,7],[NaN,1,21]])assert.equal(nullVerdict(lo,hi,5,n),'inconclusive');
 assert.equal(nullVerdict(-4.73,1.30,5,21),'pass');assert.equal(nullVerdict(-5,5,5,15),'pass');assert.equal(verdict(-20,4,5,21),'pass');
});
test('both proof entry points propagate every unsuccessful verdict',()=>{
 for(const[v,code]of Object.entries({pass:0,fail:1,inconclusive:2,'software-raster':3,error:4}))assert.equal(exitCode(v),code);
 const source=fs.readFileSync(__dirname+'/proof_koep_buildings.cjs','utf8'),body=source.match(/async function performance\(browser\)\{(.*?)\}async function main/s)[1];
 for(const v of['pass','fail','inconclusive','software-raster','error']){const process={},report={};const context={report,process,perfGate:{cfg:{},run:async()=>({verdict:v}),exitCode,table:()=>''},port:8765,save(){},console:{log(){}}};
 const fn=vm.runInNewContext('(async function(browser){'+body+'})',context);test('integrated '+v,async()=>{await fn({});assert.equal(process.exitCode,exitCode(v));});}
});
