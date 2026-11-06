const VERSION='0.31';
const $=id=>document.getElementById(id);
const WS=2400,BAG=18,STASH0=40,R=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pick=a=>a[Math.floor(Math.random()*a.length)];
