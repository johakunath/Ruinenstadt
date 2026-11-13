/* ================= boot ================= */
Promise.all([globalAssetReady,koepSpecialReady,xhainAssetReady]).then(()=>{
load();histSync();resize();heroPre();
fillJobs();S.dist=Math.min(S.dist,S.unlocked-1);buildWorld(DIST[S.dist]);newPlayer();ST=stats();P.hp=ST.maxHp;renderMenu();requestAnimationFrame(loop);
setTimeout(initCloud,0);initSync();
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});
});
