// Bump CACHE with every release so installed copies pick up the new files.
const CACHE='ruinenstadt-0.52';
const SHELL=['./','index.html','css/style.css','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png',
  ...['core','save','canvas','iso','data','items','audio','world','biomes','geo','mitte','alex','ubahn','state','feedback','combat','input','panels','update','art','render','main'].map(n=>`js/${n}.js`),
  // painted icons and portraits, so menus work offline from the first start
  ...[...Array(58)].map((_,i)=>'I'+String(i+1).padStart(2,'0')).concat('C01 C02 C03 C04 C05 C06 C07 M01 M02 M03 M04 M05 M06 M07 R01 R02 R03 R04 R05'.split(' ')).map(n=>`assets/icons/${n}.webp`),
  ...'E01 E02 E03 E04 E05 E06 E07 E08 E09 E10 S01 S02 S03 S04 S05 S06 X01 X02 X04 X05 X06 X07 X08'.split(' ').map(n=>`assets/portraits/${n}.webp`)];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('ruinenstadt-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Stale-while-revalidate: serve from cache, refresh in the background. Fonts are cached too, so the game works offline.
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;});
    if(hit){net.catch(()=>{});return hit;}
    return net.catch(()=>c.match('index.html'));
  }));
});
