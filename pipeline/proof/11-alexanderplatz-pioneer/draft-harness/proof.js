/* DEV ONLY. Inject with page.addScriptTag after the game has booted.
   No global renderer replacement. One box only; old drawBox remains fallback. */
window.__gdrProof=(function(){
  const PPU=3,legacy=drawBox,W=240,H=90,FH=160,ready={value:false};
  let mode='old',fixture=null,baseZoom=null,cache=null,bmock=null;
  const labels={old:'Alt: Zuckerbäcker',A:'A: gemalte Flächentexturen',B:'B: Vollbild-Mock · Geometrie angenähert, Ansicht fest'};
  function image(url){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('Bild fehlt: '+url));i.src=url;});}
  function paint(c,img,sx,sy,sw,sh,x,y,w,h){c.getContext('2d').drawImage(img,sx,sy,sw,sh,x*PPU,y*PPU,w*PPU,h*PPU);}
  function makeCache(f,a){
    const south=cnv(W*PPU,FH*PPU),east=cnv(H*PPU,FH*PPU),roof=cnv(W*PPU,H*PPU);
    // 768/1024 = 120/160. Repeat full modules, never stretch a whole facade to 240.
    for(let x=0;x<W;x+=120)paint(south,f,0,0,768,1024,x,0,120,160);
    // East is the first 90 world units of a 120-unit module, not a squeezed full module.
    paint(east,f,768,0,576,1024,0,0,90,160);
    const rg=roof.getContext('2d');rg.fillStyle='#36585d';rg.fillRect(0,0,roof.width,roof.height);
    for(let x=0;x<W;x+=90)paint(roof,a,0,0,512,512,x,0,90,90);
    // Defined local facade coords, measured from top-left. Alpha remains from the atlas.
    paint(south,a,512,0,512,512,106,7,30,118); // ivy, upper edge anchor
    paint(south,a,1024,0,512,512,192,8,48,48); // damaged plaster, top-right anchor
    paint(east,a,145,524,234,487,52,20,18,65); // blue Pioneer banner, top-centre anchor
    return {south,east,roof};
  }
  function drawA(b){
    if(!ready.value||!cache)return legacy(b);
    const {x,y,w,h}=b,vs=b.vs||1,fh=b.FH||b.H,hs=fh*vs,[ux,uy,vx,vy]=bAx();
    faceT(x+5,y+5,w,h,0,'rgba(0,0,0,.25)');
    let q=P3(x,y+h,hs);ctx.save();ctx.transform(ux,uy,0,vs,q[0],q[1]);ctx.drawImage(cache.south,0,0,w,fh);ctx.restore();
    q=P3(x+w,y+h,hs);ctx.save();ctx.transform(-vx,-vy,0,vs,q[0],q[1]);ctx.drawImage(cache.east,0,0,h,fh);ctx.restore();
    // The east source is already cool/shaded. Keep its painted split; don't add legacy .42 again.
    faceS(x,y,w,h,0,hs*.35,'rgba(8,5,4,.12)');
    q=P3(x,y,hs);ctx.save();ctx.transform(ux,uy,vx,vy,q[0],q[1]);ctx.drawImage(cache.roof,0,0,w,h);ctx.restore();
    faceS(x,y,w,h,0,hs,0,INK);faceE(x,y,w,h,0,hs,0,INK);faceT(x,y,w,h,hs,0,INK);
  }
  function drawB(b){
    if(!ready.value||!bmock)return legacy(b);
    // This source has a presentation perspective, not the engine's exact 2:1 projection.
    // Mirror its left end to the right, approximate overall bounds, anchor one ground corner.
    // Do not rotate/deform a flat finished painting and claim it follows a rotated footprint.
    const prior=ROT;ROT=null;
    try{const dw=(W+H)*IS,dh=FH+(W+H)*IS/2,p=P3(b.x+W,b.y+H,0),ax=(1774-274)/1774*dw,ay=859/887*dh;
      faceT(b.x+5,b.y+5,W,H,0,'rgba(0,0,0,.25)');ctx.save();ctx.translate(p[0]-ax+dw,p[1]-ay);ctx.scale(-1,1);ctx.drawImage(bmock,0,0,dw,dh);ctx.restore();
    }finally{ROT=prior;}
  }
  function drawFixture(b){if(mode==='A')drawA(b);else if(mode==='B')drawB(b);else legacy(b);}
  function footprint(){ctx.save();ctx.setTransform(DPR*Z,0,0,DPR*Z,0,0);ctx.translate(OX,OY);withRot(fixture,()=>faceT(fixture.x,fixture.y,W,H,0,0,'#35f4ee'));ctx.restore();}
  function resetGround(){
    // Restore the original map crop before painting a single fixture shadow. Called only on rotation changes.
    gx.clearRect(fixture.x-250,fixture.y-250,800,700);gx.drawImage(cache.ground,fixture.x-250,fixture.y-250);
    bShadow(fixture);
  }
  async function init(base='/__gdrproof/'){
    const [f,a,b]=await Promise.all([image(base+'facades.png'),image(base+'kit.png'),image(base+'full-b.png')]);
    cache=makeCache(f,a);bmock=b;ready.value=true;
    // This is a laboratory fixture drawn by the real world renderer. Reload to restore a normal run.
    const district=DIST.findIndex(d=>d.gdr);startRun(district,false);state='paused';
    const selected=blds.find(b=>b.wc==='#e6d6b0');if(!selected)throw new Error('Kein Zuckerbäcker im GDR-Plan');
    fixture={x:clamp(selected.x,400,WS-1000),y:clamp(selected.y,400,WH-1000),w:W,h:H,H:FH,FH,top:FH,R0:0,vs:1,rot:0,lights:[],draw:drawFixture};
    // Legacy zuckerB writes a ground shadow. Save the crop first, then restore it in resetGround.
    cache.ground=cnv(800,700);cache.ground.getContext('2d').drawImage(G,fixture.x-250,fixture.y-250,800,700,0,0,800,700);
    zuckerB(fixture);blds=[fixture];walls=[obWall(fixture)];barrels=[];brk=[];neons=[];waters=[];marks=[];spati=null;
    npc=null;captive=null;zone=null;crate=null;trove=null;enemies=[];drops=[];parts=[];nums=[];eproj=[];pproj=[];teles=[];shocks=[];corpses=[];hazards=[];fields=[];mols=[];bolts=[];rings=[];swings=[];
    P.x=fixture.x+W+80;P.y=fixture.y+H+70;P.mvx=P.mvy=0;shake=0;resetGround();
    baseZoom=Z;document.querySelectorAll('body > :not(canvas):not(script)').forEach(el=>el.style.visibility='hidden');
    return {footprint:[W,H],height:FH,units:PPU,cacheSizes:[cache.south,cache.east,cache.roof].map(c=>[c.width,c.height]),defaultZoom:baseZoom};
  }
  function frame(next,rot=0,factor=1,outline=true){
    if(!fixture)throw new Error('init zuerst ausführen');if(!Object.hasOwn(labels,next))throw new Error('Unbekannter Modus');
    mode=next;fixture.rot=rot;fixture.oa=1;walls=[obWall(fixture)];resetGround();
    Z=baseZoom*factor;VW=SW/Z;VH=SH/Z;lc.width=Math.ceil(VW*LS);lc.height=Math.ceil(VH*LS);
    // Same camera target in all methods; frame centre is roughly halfway up the building.
    cam.x=P.x=fixture.x+W/2;cam.y=P.y=fixture.y+H/2;P.mvx=P.mvy=0;
    P.x=fixture.x+W/2;P.y=fixture.y+H+45;cam.x=P.x;cam.y=P.y;
    const previousKX=KX,previousKY=KY;
    KX=ix(P.x,P.y)-ix(fixture.x+W/2,fixture.y+H/2);
    KY=iy(P.x,P.y)-iy(fixture.x+W/2,fixture.y+H/2)+FH*.42;
    try{render(1000);}finally{KX=previousKX;KY=previousKY;}
    if(outline)footprint();
    ctx.setTransform(DPR,0,0,DPR,0,0);ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillStyle='rgba(10,22,25,.92)';ctx.fillRect(12,12,SW-24,54);ctx.fillStyle='#f3ce43';ctx.font='17px sans-serif';ctx.fillText(labels[mode],24,35);ctx.fillStyle='#eadfc6';ctx.font='13px sans-serif';ctx.fillText('Ein Gebäude · 240 × 90 · Höhe 160 · Rotation '+rot.toFixed(2)+' · Zoom '+factor+'× · Türkis: echter Fußabdruck',24,55);
    return {mode,rot,factor,zoom:Z,footprint:[W,H],height:FH,approximate:mode==='B'};
  }
  return {init,frame,ready,drawA};
})();
