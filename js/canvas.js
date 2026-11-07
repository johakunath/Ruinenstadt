/* ================= canvas ================= */
let ctx=null;const cv=$("c"),lc=document.createElement('canvas'),lx=lc.getContext('2d');ctx=cv.getContext("2d");
// SW/SH: screen in CSS px. Z: world zoom so big screens (tablets) show a similar slice of the world as phones. VW/VH: visible world units.
let VW=0,VH=0,SW=0,SH=0,Z=1,DPR=1,LS=.5,JR=50;const TAB=()=>Math.min(SW,SH)>=600;
function resize(){SW=innerWidth;SH=innerHeight;Z=clamp(Math.min(SW,SH)/540,1,1.8);VW=SW/Z;VH=SH/Z;JR=TAB()?72:50;
  DPR=Math.min(S.eco?1.25:2,window.devicePixelRatio||1);LS=S.eco?.3:.5;cv.width=Math.round(SW*DPR);cv.height=Math.round(SH*DPR);cv.style.width=SW+'px';cv.style.height=SH+'px';lc.width=Math.ceil(VW*LS);lc.height=Math.ceil(VH*LS);document.body.classList.toggle('tab',TAB());}
addEventListener('resize',resize);resize();
function cnv(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;}
function radial(stops){const c=cnv(128,128),g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,128,128);return c;}
const LSPR=radial([[0,'rgba(0,0,0,1)'],[.45,'rgba(0,0,0,.65)'],[1,'rgba(0,0,0,0)']]);
const VIG=radial([[0,'rgba(150,20,10,0)'],[.62,'rgba(150,20,10,0)'],[1,'rgba(150,20,10,.85)']]);
const FIRE=radial([[0,'rgba(255,120,40,.24)'],[1,'rgba(255,120,40,0)']]);
const GL={};const glow=c=>GL[c]||(GL[c]=radial([[0,c+'cc'],[.35,c+'55'],[1,c+'00']]));
function dark(hex,f){const n=parseInt(hex.slice(1),16);return'rgb('+[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.round(v*f)).join(',')+')';}
function rr(g,x,y,w,h,r){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);g.fill();}
