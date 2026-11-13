// Shared painted materials. Decode before the first map; a failed image keeps its legacy surface.
const GLOBAL_GROUND=['asphalt','cobble','pavement','dirt','grass','sand','plaza','ballast','concrete'];
const GLOBAL_BUILDING=['plaster','brick','wood','terracotta','slate','glass'];
const GLOBAL_KEYS=GLOBAL_GROUND.map(k=>'props/ground-'+k).concat(GLOBAL_BUILDING.map(k=>'buildings/shared-'+k));
const GLOBAL_TEX=Object.create(null),GLOBAL_PAT=new WeakMap();
let GLOBAL_ART=true;
function globalPattern(g,key){if(!GLOBAL_ART||!GLOBAL_TEX[key])return null;let a=GLOBAL_PAT.get(g);if(!a)GLOBAL_PAT.set(g,a=Object.create(null));if(!a[key]){const p=g.createPattern(GLOBAL_TEX[key].image,'repeat');if(!p)return null;p.setTransform(new DOMMatrix().scale(1/GLOBAL_TEX[key].units));a[key]=p;}return a[key];}
const globalGroundPattern=(g,k)=>globalPattern(g,'props/ground-'+k),globalBuildingPattern=(g,k)=>globalPattern(g,'buildings/shared-'+k);
function globalPaintRect(g,key,x,y,w,h,alpha=1){const p=globalPattern(g,key);if(!p)return false;g.save();g.globalAlpha*=alpha;g.fillStyle=p;g.fillRect(x,y,w,h);g.restore();return true;}
function globalLotGround(g,b){const k={market:'cobble',parking:'asphalt',construction:'sand',plattenbau:'pavement',ruins:'dirt',hochhaus:'plaza',buero:'plaza',hinterhof:'cobble',zucker:'plaza',houses:'pavement'}[b.lot];if(k)globalPaintRect(g,'props/ground-'+k,b.x0+8,b.y0+8,b.w-16,b.h-16,.9);}
// A roof slope is a parallelogram in the same P3 geometry as the legacy roof.
function globalRoofFace(g,a,b,d,w,h,key){const p=globalBuildingPattern(g,key);if(!p||w<=0||h<=0)return false;g.save();g.transform((b[0]-a[0])/w,(b[1]-a[1])/w,(d[0]-a[0])/h,(d[1]-a[1])/h,a[0],a[1]);g.fillStyle=p;g.fillRect(0,0,w,h);g.restore();return true;}
function globalAssetStats(){return{decodedBytes:GLOBAL_KEYS.reduce((n,k)=>n+(SPRITES[k]?SPRITES[k].w*SPRITES[k].h*4:0),0),canvasBytes:Object.values(GLOBAL_TEX).reduce((n,t)=>n+t.image.width*t.image.height*4,0),ready:Object.keys(GLOBAL_TEX).length,total:GLOBAL_KEYS.length};}
const globalAssetReady=spriteReady.then(()=>Promise.all(GLOBAL_KEYS.map(async key=>{const m=SPRITES[key];if(!m)return;try{spr(key);const i=SPRIMG[key];await i.decode();if(!i.naturalWidth)return;const image=document.createElement('canvas');image.width=Math.max(1,i.naturalWidth-2);image.height=Math.max(1,i.naturalHeight-2);image.getContext('2d').drawImage(i,1,1,image.width,image.height,0,0,image.width,image.height);GLOBAL_TEX[key]={image,units:m.units||3};}catch(e){/* Missing/offline art uses the original drawing. */}}))).then(()=>{for(const k of GLOBAL_KEYS)globalPattern(ctx,k);});// Warm roof patterns outside drawing.
