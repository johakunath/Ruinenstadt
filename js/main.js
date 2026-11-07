/* ================= boot ================= */
load();resize();
fillJobs();S.dist=Math.min(S.dist,S.unlocked-1);buildWorld(DIST[S.dist]);newPlayer();ST=stats();P.hp=ST.maxHp;renderMenu();requestAnimationFrame(loop);
setTimeout(initCloud,0);
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});
