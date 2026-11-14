// Painted district caches stream around the camera (v0.99): nearest buildings bake first and the farthest are released over budget,
// so high-DPR tablets (scale 3) show painted architecture where the player is instead of whatever fit first.
const DC_ALL=[];
// Tablets (DPR 2) would bake at 3x; 2.5x keeps the visible set inside the 40 MB budget with barely softer painted surfaces.
const dcScale=()=>Math.min(2.5,koepScale());
const dcFocus=()=>cam.x!=null?[cam.x,cam.y]:P?[P.x,P.y]:[SX,SY];
function dcDist(b){const[f,g]=dcFocus();return Math.hypot(b.x+(b.w||0)/2-f,b.y+(b.h||0)/2-g);}
function dcReg(st){st.queue=[];st.scale=0;DC_ALL.push(st);return st;}
// Room for one bake: evict cached buildings clearly farther away than the candidate (150 units hysteresis against thrashing).
function dcRoom(st,b,bytes){if(st.used()+bytes<=st.limit)return true;const d=dcDist(b)+150,C=st.cache(),far=[...C.keys()].map(k=>[k,dcDist(k)]).filter(a=>a[1]>d).sort((a,b)=>b[1]-a[1]);for(const[k]of far){st.drop(k);if(st.used()+bytes<=st.limit)return true;}return false;}
function dcNext(st){const C=st.cache();let best=null,bd=Infinity;for(const a of st.queue)if(!C.has(a[0])){const d=dcDist(a[0]);if(d<bd){bd=d;best=a;}}return best;}
// Bake up to n nearest missing buildings; false once a bake finds no room (everything cached is nearer).
function dcStep(st,n){for(let k=0;k<n;k++){const a=dcNext(st);if(!a)return false;st.bake(a[0],a[1]);if(!st.cache().has(a[0]))return false;}return true;}
function dcFill(st,job,cur){return new Promise(resolve=>{const step=()=>{if(cur()!==job||!st.on())return resolve();if(dcStep(st,4))setTimeout(step,0);else resolve();};setTimeout(step,0);});}
setInterval(()=>{if(document.hidden)return;for(const st of DC_ALL)if(st.on()&&st.queue.length&&st.scale===dcScale())dcStep(st,3);},250);
