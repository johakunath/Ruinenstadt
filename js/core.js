const VERSION='0.45';
// v0.45: 20 waves per district (was 10). wE() is the wave on the old 10-wave scale, used wherever difficulty, loot or pacing grew per wave
const WAVES=20,wE=()=>run?run.wave/2:.5;
const $=id=>document.getElementById(id);
let WS=2400;// world size, set per district by buildWorld (geo districts are bigger)
const BAG=18,STASH0=40,R=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pick=a=>a[Math.floor(Math.random()*a.length)];
