const VERSION='0.43';
const $=id=>document.getElementById(id);
let WS=2400;// world size, set per district by buildWorld (geo districts are bigger)
const BAG=18,STASH0=40,R=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pick=a=>a[Math.floor(Math.random()*a.length)];
