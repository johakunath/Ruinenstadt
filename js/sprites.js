// Painted world sprites: one manifest fetch; missing/loading images keep the canvas fallback.
const SPRITES=Object.create(null),SPRIMG=Object.create(null);
const spriteReady=fetch('assets/manifest.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(m=>{if(m&&typeof m==='object'&&!Array.isArray(m))for(const k in m)if(/^(buildings|vehicles|nature|enemies|bosses|props)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(k))SPRITES[k]=m[k];}).catch(()=>{});
function spr(k){if(!SPRITES[k])return null;let i=SPRIMG[k];if(!i){i=SPRIMG[k]=new Image();i.src='assets/'+k+'.webp';}return i.complete&&i.naturalWidth?i:null;}
