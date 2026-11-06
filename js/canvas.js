/* ================= canvas ================= */
const cv=$('c'),ctx=cv.getContext('2d'),lc=document.createElement('canvas'),lx=lc.getContext('2d');
let VW=0,VH=0,DPR=1,LS=.5;
function resize(){DPR=Math.min(1.5,window.devicePixelRatio||1);LS=S.eco?.3:.5;VW=innerWidth;VH=innerHeight;cv.width=Math.round(VW*DPR);cv.height=Math.round(VH*DPR);cv.style.width=VW+'px';cv.style.height=VH+'px';lc.width=Math.ceil(VW*LS);lc.height=Math.ceil(VH*LS);}
addEventListener('resize',resize);resize();
function cnv(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;}
function radial(stops){const c=cnv(128,128),g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,128,128);return c;}
const LSPR=radial([[0,'rgba(0,0,0,1)'],[.45,'rgba(0,0,0,.65)'],[1,'rgba(0,0,0,0)']]);
const VIG=radial([[0,'rgba(150,20,10,0)'],[.62,'rgba(150,20,10,0)'],[1,'rgba(150,20,10,.85)']]);
const FIRE=radial([[0,'rgba(255,120,40,.24)'],[1,'rgba(255,120,40,0)']]);
const GL={};const glow=c=>GL[c]||(GL[c]=radial([[0,c+'cc'],[.35,c+'55'],[1,c+'00']]));
function dark(hex,f){const n=parseInt(hex.slice(1),16);return'rgb('+[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.round(v*f)).join(',')+')';}
function rr(g,x,y,w,h,r){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);g.fill();}
