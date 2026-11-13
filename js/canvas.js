/* ================= canvas ================= */
let ctx=null;const cv=$("c"),lc=document.createElement('canvas'),lx=lc.getContext('2d');ctx=cv.getContext("2d");
// SW/SH: screen in CSS px. Z: world zoom so big screens (tablets) show a similar slice of the world as phones. VW/VH: visible world units.
let VW=0,VH=0,SW=0,SH=0,Z=1,DPR=1,LS=.5,JR=50;const TAB=()=>Math.min(SW,SH)>=600;
// v0.77: big desktop screens (short side 1000+ CSS px, e.g. 1440p) zoom up to 2.1 so the hero is bigger; phones and tablets keep the old curve.
// Bildschärfe Ausgewogen: canvas backing store capped at about 1.6 MP, the browser scales it up (fill rate is the cost on big screens, mainly in Firefox)
// Desktop (fine pointer, no touch) gets 15% more zoom on top (playtest: hero too small on the PC; telemetry showed 1171x580 CSS px at 200% Windows scaling).
// rqOn(): Bildschärfe Ausgewogen, default on desktop. Telemetry of the same PC run: 2.7 MP canvas, 20 fps, 98% slow frames in Firefox
const DESK=()=>!matchMedia('(pointer:coarse)').matches&&!('ontouchstart'in window),rqOn=()=>S.rq==null?DESK():!!S.rq;
function resize(){SW=innerWidth;SH=innerHeight;const ms=Math.min(SW,SH);Z=ms>=1000?clamp(1.8+(ms-1000)*.0012,1.8,2.1):clamp(ms/540,1,1.8);if(DESK())Z=Math.min(2.3,Z*1.15);else if(TAB()&&matchMedia('(pointer:coarse)').matches)Z*=1.1;VW=SW/Z;VH=SH/Z;JR=TAB()?72:50;
  DPR=Math.min(S.eco?1.25:2,window.devicePixelRatio||1);if(rqOn())DPR=Math.max(1,Math.min(DPR,Math.sqrt(1.6e6/(SW*SH))));LS=S.eco?.3:.5;cv.width=Math.round(SW*DPR);cv.height=Math.round(SH*DPR);cv.style.width=SW+'px';cv.style.height=SH+'px';lc.width=Math.ceil(VW*LS);lc.height=Math.ceil(VH*LS);document.body.classList.toggle('tab',TAB());}
addEventListener('resize',resize);resize();
function cnv(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;}
function radial(stops){const c=cnv(128,128),g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,128,128);return c;}
const LSPR=radial([[0,'rgba(0,0,0,1)'],[.45,'rgba(0,0,0,.65)'],[1,'rgba(0,0,0,0)']]);
const VIG=radial([[0,'rgba(150,20,10,0)'],[.62,'rgba(150,20,10,0)'],[1,'rgba(150,20,10,.85)']]);
const FIRE=radial([[0,'rgba(255,120,40,.24)'],[1,'rgba(255,120,40,0)']]);
const GL={};const glow=c=>GL[c]||(GL[c]=radial([[0,c+'cc'],[.35,c+'55'],[1,c+'00']]));
function dark(hex,f){const n=parseInt(hex.slice(1),16);return'rgb('+[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.round(v*f)).join(',')+')';}
function rr(g,x,y,w,h,r){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);g.fill();}
