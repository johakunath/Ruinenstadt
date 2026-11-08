// Bump CACHE with every release so installed copies pick up the new files.
const CACHE='ruinenstadt-0.42';
const SHELL=['./','index.html','css/style.css','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png',
  ...['core','save','canvas','iso','data','items','audio','world','biomes','geo','state','feedback','combat','input','panels','update','art','render','main'].map(n=>`js/${n}.js`)];
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
