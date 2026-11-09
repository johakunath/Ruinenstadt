/* ================= feedback ================= */
function toast(h){const d=document.createElement('div');d.className='toast';d.innerHTML=h;const T=$('toasts');T.classList.toggle('low',state!=='play');T.append(d);setTimeout(()=>d.remove(),5500);while(T.children.length>4)T.firstChild.remove();}
let bannerT=0;function banner(t){const b=$('banner');b.textContent=t;b.style.opacity=1;bannerT=2.6;}
function burst(x,y,col,n,sp){for(let i=0;i<n;i++){const a=R(0,6.28),s=R(.3,1)*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:R(.3,.7),max:.7,col,size:R(2,4)});}if(parts.length>400)parts.splice(0,parts.length-400);}
const embers=Array.from({length:36},()=>({x:Math.random(),y:Math.random(),s:R(.02,.06),w:R(0,6.28),z:R(1,2.6)}));
function updateHot(){$('pause').classList.toggle('hot',S.bag.some(it=>better(it))||S.jobs.some(j=>j.p>=j.t));}
