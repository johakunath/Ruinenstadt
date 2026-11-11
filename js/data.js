/* ================= data ================= */
const RAR=[{n:'Gewöhnlich',c:'#e8ddd0',m:1},{n:'Magisch',c:'#7d9bff',m:1.35},{n:'Selten',c:'#f2d14b',m:1.8},{n:'Legendär',c:'#ff8a3d',m:2.6}];
const ELC={fire:'#ff6a2a',acid:'#97C459',shock:'#7dd3ff'},ELN={fire:'Feuer',acid:'Säure',shock:'Strom'};
const RES={raser:{fire:1.2,acid:1.2,shock:.6},ghoul:{fire:1.6,acid:1,shock:1},brute:{fire:.5,acid:1.6,shock:1},spitter:{fire:1,acid:0,shock:1.6},koloss:{fire:.5,acid:1,shock:1.8},brand:{fire:0,acid:1.6,shock:1},hauptmann:{fire:1.3,acid:1,shock:1.3},hexe:{fire:1.6,acid:0,shock:1},turm:{fire:1,acid:1.6,shock:0},flieger:{fire:1,acid:1.3,shock:1.6},
 rat:{fire:1.4,acid:1.4,shock:1.4},bomb:{fire:1.3,acid:1,shock:1.4},shield:{fire:1,acid:1.6,shock:1.2},crow:{fire:1.3,acid:.8,shock:1.6},howl:{fire:1.3,acid:1.2,shock:1},ratten:{fire:1.6,acid:.4,shock:1},ritter:{fire:.8,acid:1,shock:1.7},platte:{fire:.5,acid:1.7,shock:1},volk:{fire:1,acid:.6,shock:1.7},uhr:{fire:1,acid:.5,shock:1.7},wurz:{fire:1.8,acid:.4,shock:1},kern:{fire:1.6,acid:.4,shock:1.1},kabel:{fire:1.6,acid:1,shock:.3},bass:{fire:1,acid:1.6,shock:.5}};
const BCOL=['#3a1a10','#2a3020','#34303e','#3a3020','#4a1a10','#4a3e36','#383e48','#4a4842','#8a8470'],BN=['Der Hauptmann von Köpenick','Die Spreehexe','Der Bassprediger','Der Fliegerkönig','Der Brandmeister','Die Rattenmutter','Der Zitadellenritter','Der Plattenkönig','Der Volkseigene Koloss'],BK=['hauptmann','hexe','turm','flieger','brand','ratten','ritter','platte','volk'];
// shield bearers: frontal block, hammer stun opens the guard (Schildträger, Uhrwerkläufer, Zitadellenritter)
const SHD=e=>e.type==='shield'||e.type==='uhr'||(e.type==='boss'&&e.v===6);
const ER=(e,el)=>RES[e.type==='boss'?(e.big?BK[e.v]||'brand':'koloss'):e.type][el];
const AFX={dmg:{n:'Schaden',u:'%',a:6,b:14},as:{n:'Angriffstempo',u:'%',a:5,b:10},crit:{n:'Krit-Chance',u:'%',a:3,b:7},spd:{n:'Lauftempo',u:'%',a:4,b:9},hp:{n:'Leben',u:'',a:10,b:24},
 regen:{n:'Leben pro Sekunde',u:'',a:.3,b:1,d:1},res:{n:'Widerstand',u:'%',a:4,b:9},el:{n:'Elementarschaden',u:'%',a:10,b:25},leech:{n:'Leben pro Kill',u:'',a:1,b:3},cdr:{n:'Abklingzeiten',u:'%',a:5,b:10,neg:1},luck:{n:'Beuteglück',u:'',a:1,b:2}};
const PACTS=[[['dmg',25,40],['as',-15,-10]],[['as',15,22],['dmg',-12,-8]],[['dmg',25,35],['hp',-30,-15]],[['res',15,22],['spd',-12,-8]],[['spd',14,20],['res',-12,-8]],[['crit',10,15],['hp',-20,-10]],[['luck',3,4],['dmg',-10,-8]],[['el',40,60],['crit',-6,-4]]];
const IMP={leder:[['spd',4]],helm:[['res',4]],mantel:[['regen',.5]],weste:[['res',7],['spd',-4]],feuer:[['res',5],['el',8]],bvg:[['spd',6]],spaeti:[['luck',2],['regen',.8]],panzer:[['res',12],['spd',-8]],herz:[['regen',1]],
 poncho:[['res',5],['spd',3]],kmantel:[['el',10]],nbrille:[['crit',2]],nauge:[['el',10]],zchip:[['crit',3]],karm:[['dmg',6]],reflex:[['cdr',6]],bherz:[['hp',25]],npumpe:[['leech',1]],bassarm:[['as',8],['el',15]],sichel:[['crit',3]],werkh:[['dmg',6]],aufzieh:[['as',6]],zeiger:[['crit',2],['as',4]],blaumann:[['res',4],['regen',.4]],stroh:[['luck',1]],gartenh:[['leech',1]]};
const SETS={kiez:{n:'Kiezwache',p:{w:['Brechstange der Kiezwache','blade','brech'],a:['Weste der Kiezwache','armor','weste'],t:['Abzeichen der Kiezwache','krit','abzeichen'],h:['Helm der Kiezwache','head','kiezhelm'],g:['Handschuhe der Kiezwache','hand','kiezhand']},b2:'+25% Widerstand',b3:'+60% Schaden',b5:'+15% Krit-Chance und +100 Leben'},
  spree:{n:'Spreegeist',p:{w:['Zwille des Spreegeists','sling','zwille'],a:['Mantel des Spreegeists','armor','mantel'],t:['Kiesel des Spreegeists','tempo','kiesel'],f:['Stiefel des Spreegeists','feet','spreestief'],r:['Ring des Spreegeists','tempo','spreering']},b2:'+25% Angriffstempo',b3:'Strom-Element und +80% Elementarschaden',b5:'+50% Elementarschaden und +10% Lauftempo'},
  zit:{n:'Zitadelle',p:{w:['Morgenstern der Zitadelle','hammer','morgen'],a:['Kettenhemd der Zitadelle','armor','kette'],t:['Wappen der Zitadelle','krit','wappen'],h:['Topfhelm der Zitadelle','head','topfhelm'],f:['Eisenstiefel der Zitadelle','feet','eisenstief']},b2:'+120 Leben',b3:'+55% Schaden und +20% Widerstand',b5:'+200 Leben und +4 Leben pro Kill'}};
// v0.68: set bonuses as data (pieces needed -> affix totals); sets have 5 pieces: weapon, body, talisman plus two of head, hands, feet, ring
const SETB={kiez:[[2,{res:25}],[3,{dmg:60}],[5,{crit:15,hp:100}]],spree:[[2,{as:25}],[3,{el:80}],[5,{el:50,spd:10}]],zit:[[2,{hp:120}],[3,{dmg:55,res:20}],[5,{hp:200,leech:4}]]};
const stashMax=()=>40+(S.camp&&S.camp.halle?20:0)+(cLv('markt')>=3?20:0);
const CAMP=[{k:'turm',n:'Wachturm',d:'+8% Widerstand, dauerhaft',p:150},{k:'sani',n:'Sanitätszelt',d:'Jede Expedition startet mit mindestens 2 Verbänden',p:140},{k:'garten',n:'Gemüsegarten',d:'Du startest jede Expedition satt (+10% Schaden für 60 Sekunden), +2 Gemüse nach jeder Expedition ab Welle 3',p:120},
  {k:'halle',n:'Lagerhalle',d:'+20 Plätze im Lager',p:180},{k:'funk',n:'Funkmast',d:'Ein zusätzliches Ereignis pro Expedition',p:200},{k:'presse',n:'Schrottpresse',d:'+15% Schrott von Gegnern',p:250},{k:'lampe',n:'Stirnlampen-Werkstatt',d:'Zweihändige Waffen bekommen in Dunkelzonen eine Stirnlampe',p:160}];
// v0.83 camp stations (#37): the camp is the S+U Warschauer Straße station, open once the S3 tunnel from Köpenick is cleared (campOpen).
// 3 levels per station: level 2 needs the station's NPC (SURV key; Ilse is always there), level 3 Alexanderplatz liberated (v0.83 bot: stricter gates made Köpenick and Xhain too hard). Levels set the old camp building flags (S.camp, effects unchanged) and raise the workshop caps (up)
const CST=[
 {k:'zeug',n:'Zeughaus',npc:'schmied',ln:'„Zeig mal her, das kriegen wir scharf.“',x:2010,y:1250,up:{dmg:[5,8,10]},lv:[{d:'Schärfen bis Stufe 5, Aufsätze ab Xhain, Umschmieden ab Mitte'},{d:'Schärfen bis 8, Stirnlampe für zweihändige Waffen in Dunkelzonen',camp:'lampe',c:{s:220,metall:5,kabel:2}},{d:'Schärfen bis 10',c:{s:650,metall:10,kabel:4}}]},
 {k:'hack',n:'Hackerspace',npc:'mechaniker',ln:'„Alles hat einen Schalter. Man muss ihn nur finden.“',x:2090,y:1520,up:{hp:[5,8,10]},lv:[{d:'Panzerung bis Stufe 5'},{d:'Panzerung bis 8, Schrottpresse: +15% Schrott von Gegnern',camp:'presse',c:{s:220,metall:4,kabel:3}},{d:'Panzerung bis 10, +8% Widerstand',camp:'turm',c:{s:650,metall:8,kabel:6}}]},
 {k:'imbiss',n:'Imbiss',npc:'koechin',ln:'„Erst essen, dann kämpfen.“',x:880,y:1290,lv:[{d:'Kochen'},{d:'Gemüsegarten: satt in die Expedition, +2 Gemüse, Spreewaldgurken',camp:'garten',c:{s:180,stoff:4,chemie:2}},{d:'Essen wirkt 20% stärker',c:{s:550,stoff:6,chemie:5}}]},
 {k:'laz',n:'Lazarett',npc:'doktor',ln:'„Setz dich. Nein, nicht da, das ist die Spüle.“',x:450,y:1320,lv:[{d:'Verbände und Molotows herstellen'},{d:'Jede Expedition startet mit mindestens 2 Verbänden',camp:'sani',c:{s:200,stoff:5,chemie:2}},{d:'Verbände heilen 60% statt 40%',c:{s:550,stoff:8,chemie:5}}]},
 {k:'kom',n:'Kommandantur',npc:'ilse',ln:'„Die Kiezwache hat Arbeit für dich.“',x:380,y:760,lv:[{d:'Quests'},{d:'Funkmast: ein Ereignis mehr pro Expedition',camp:'funk',c:{s:240,kabel:5,metall:2}},{d:'Quests geben 50% mehr Schrott',c:{s:600,kabel:8,metall:4}}]},
 {k:'markt',n:'Schwarzmarkt',npc:'kurier',ln:'„Alles da. Fragen kostet extra.“',x:1980,y:880,lv:[{d:'Lager mit 40 Plätzen'},{d:'Lagerhalle: +20 Plätze',camp:'halle',c:{s:200,stoff:3,metall:3}},{d:'Nochmal +20 Plätze',c:{s:500,stoff:6,metall:6}}]},
 {k:'exer',n:'Exerzierplatz',npc:'spaeher',ln:'„Nochmal. Und diesmal leiser.“',x:1640,y:1440,up:{dash:[2,4,5],luck:[2,4,5]},lv:[{d:'Ausdauer und Spürnase bis Stufe 2'},{d:'Ausdauer und Spürnase bis 4',c:{s:200,stoff:4,kabel:2}},{d:'Ausdauer und Spürnase bis 5',c:{s:550,stoff:6,kabel:5}}]}];
const LVREQ=[0,0,2],NPCN={ilse:'Ilse'};// LVREQ: district index that must be liberated for level 1..3
const campOpen=()=>typeof lineFree==='function'&&lineFree(0),cLv=k=>campOpen()?Math.max(1,(S.stn&&S.stn[k])||1):0,npcHere=k=>k==='ilse'||hasS(k),npcName=k=>NPCN[k]||(SURV.find(s=>s.k===k)||{n:k}).n;
const upMax=u=>{const c=CST.find(c=>c.up&&c.up[u.k]);return c?c.up[u.k][Math.max(0,cLv(c.k)-1)]:u.max;};
function cNext(c){const l=cLv(c.k),L=l&&c.lv[l];if(!L)return null;const q=[];if(!npcHere(c.npc))q.push(npcName(c.npc).split(',')[0]+' befreien');if((S.best[LVREQ[l]]||0)<WAVES)q.push(DIST[LVREQ[l]].n+' befreien');const miss=Object.entries(L.c).filter(([k,v])=>k==='s'?S.scrap<v:(S.mat[k]||0)<v);return{L,lv:l+1,q,miss,ok:!q.length&&!miss.length};}
function cBuy(c){const n=cNext(c);if(!n||!n.ok)return false;for(const[k,v]of Object.entries(n.L.c)){if(k==='s')S.scrap-=v;else S.mat[k]-=v;}S.stn[c.k]=n.lv;for(let i=1;i<n.lv;i++)if(c.lv[i].camp)S.camp[c.lv[i].camp]=1;refresh();save();return true;}
const ACH=[{k:'k100',n:'Aufräumer',d:'Besiege 100 Gegner',r:50,c:()=>S.rec.kills>=100},{k:'k1000',n:'Kiezlegende',d:'Besiege 1.000 Gegner',r:200,c:()=>S.rec.kills>=1000},
  {k:'leg1',n:'Ein Fund fürs Leben',d:'Finde ein legendäres Teil',r:100,c:()=>S.rec.legs>=1},{k:'win1',n:'Befreier',d:'Befreie einen Bezirk',r:100,c:()=>S.rec.wins>=1},
  {k:'win5',n:'Berlin atmet',d:'Befreie fünf Bezirke',r:400,c:()=>S.best.filter(b=>b>=WAVES).length>=5},{k:'th3',n:'Gegen die Übermacht',d:'Schalte Bedrohung 3 frei',r:300,c:()=>S.tmax>=3},
  {k:'set3',n:'Komplett',d:'Trage ein vollständiges Set',r:250,c:()=>['kiez','spree','zit'].some(k=>setCount(S.eq,k)>=5)},{k:'camp',n:'Zuhause',d:'Baue alle Stationen im Lager auf Stufe 3 aus',r:300,c:()=>CST.every(x=>cLv(x.k)>=3)},
  {k:'m5',n:'Meisterhand',d:'Erreiche Drill-Rang 5',r:150,c:()=>(S.drill||0)>=5},{k:'chest5',n:'Kellerkind',d:'Öffne 5 Kellertruhen',r:150,c:()=>S.rec.chests>=5},
  {k:'surv6',n:'Volles Lager',d:'Befreie alle sechs Gefangenen',r:300,c:()=>SURV.every(s=>hasS(s.k))},{k:'streak50',n:'Kettenreaktion',d:'Erreiche eine Serie von 50',r:150,c:()=>(S.rec.streak||0)>=50},{k:'endl20',n:'Nachtschicht',d:'Erreiche Welle 20 im Endlos-Modus',r:300,c:()=>(S.eb||[]).some(w=>w>=20)},
  {k:'legall',n:'Sammler',d:'Finde alle legendären Teile',r:500,c:()=>Object.keys(LEGP).every(k=>S.found&&S.found[k])},{k:'mods3',n:'Bastler',d:'Baue 3 Aufsätze in Waffen ein',r:100,c:()=>(S.rec.mods||0)>=3},{k:'spear5',n:'Schleifer',d:'Erreiche Drill-Rang 20',r:300,c:()=>(S.drill||0)>=20},{k:'th5',n:'Unaufhaltsam',d:'Schalte Bedrohung 5 frei',r:500,c:()=>S.tmax>=5},
  {k:'win8',n:'Ganz Berlin',d:'Befreie Marzahn',r:800,c:()=>S.best[DI('Marzahn')]>=WAVES},{k:'boss10',n:'Bezwinger',d:'Besiege 10 Endgegner',r:250,c:()=>S.rec.bosses>=10}];
let tipQ=[],tipT=0;function tip(k,txt){if(!S.tips||S.tips[k])return;S.tips[k]=1;tipQ.push(txt);}
function checkAch(){for(const a of ACH)if(!S.ach[a.k]&&a.c()){S.ach[a.k]=1;S.scrap+=a.r;toast(`Erfolg: <span style="color:var(--ember)">${a.n}</span> · +${a.r} Schrott`);sfx('win');}}
const SETC='#8fd16a',rc=it=>it.set?SETC:RAR[it.r].c,setCount=(eq,k)=>SLOTS.filter(s=>eq[s]&&eq[s].set===k).length;
const rfCost=it=>Math.round((20+it.ilvl*4+it.r*20)*Math.pow(1.4,it.rr||0));
// v0.65: Umschmieden also costs material (weapon metal, armour cloth, jewellery cable). Weapon mods open after Xhain, reforging after Potsdamer Platz (Mitte)
const rfMat=it=>[({w:'metall',a:'stoff',h:'stoff',g:'stoff',f:'stoff'})[it.slot]||'kabel',it.r+(it.rr||0)],modsOpen=()=>(S.best[1]||0)>=WAVES,forgeOpen=()=>(S.best[3]||0)>=WAVES;
const LOCK='<svg class="lk" width="10" height="11" viewBox="0 0 10 11" aria-hidden="true"><rect x="1" y="5" width="8" height="6" fill="#a8957d"/><path d="M3 5V3a2 2 0 0 1 4 0v2" stroke="#a8957d" fill="none" stroke-width="1.4"/></svg>';
const LEGP={turm:'Krits lösen eine Feuerexplosion aus',mauer:'Jeder vierte Treffer erzeugt eine Säurewelle',ring:'Geschosse springen auf einen weiteren Gegner über',
  spaeti:'Gegner und Kisten lassen doppelt so oft Döner und Vorräte fallen',panzer:'20% Chance, einen Treffer komplett abzublocken',herz:'Einmal pro Expedition überlebst du einen tödlichen Treffer mit 40% Leben',
  zitklinge:'Jeder Kill lädt deine Kraft um 1 Sekunde auf',pbrecher:'Krit-Kills lösen ein betäubendes Beben aus',kraehe:'Geschosse verlangsamen Gegner 2 Sekunden lang',rattenmantel:'Wirst du getroffen, schwappt eine Säurewelle um dich (alle 1,5 s)',ritter:'Am Ende jedes Sprints bebt der Boden',auge:'Elite-Gegner und Endgegner nehmen 25% mehr Schaden',siegsp:'Jeder Stoß verschießt eine goldene Klinge',bassarm:'Jeder fünfte Treffer entlädt einen Kettenblitz auf bis zu 4 Gegner',
  pickel:'Elite-Gegner und Endgegner heilen dich beim Tod um 15% Leben',kiezbox:'Jeder vierte Treffer betäubt den Gegner kurz',schaffner:'Jeder Kill verkürzt die Sprint-Abklingzeit um 0,5 Sekunden',weltuhr:'Dein erster Angriff nach einem Sprint ist immer ein Krit'};
const hasL=k=>SLOTS.some(s=>S.eq[s]&&baseOf(S.eq[s])===k);
const LEGEL={turm:'fire',mauer:'acid',ring:'shock',zitklinge:'shock',pbrecher:'fire',kraehe:'acid',siegsp:'fire'},TM={krit:'crit',tempo:'spd',heil:'regen'};
const EMC={schnell:'#7dd3ff',brennend:'#ff6a2a',spaltend:'#97C459',gepanzert:'#d6cfc0'},EMN={schnell:'Flink',brennend:'Brennend',spaltend:'Spaltend',gepanzert:'Gepanzert'};
const ENAME={ghoul:'Ghul',brute:'Brocken',spitter:'Speier',raser:'Raser',rat:'Ratte',bomb:'Zünder',shield:'Schildträger',crow:'Krähe',howl:'Heuler',kabel:'Kabelghul',bass:'Boxenkopf',uhr:'Uhrwerkläufer',wurz:'Wurzler',kern:'Kernspeier'};
const EDESC={schnell:'Deutlich schneller. Springt dich an (rote Linie), danach kurz offen.',brennend:'Hinterlässt eine Feuerspur. Zündet einen Flammenring um sich, danach kurz offen.',spaltend:'Wirft drei Säurekugeln und zerfällt beim Tod in kleinere Gegner.',gepanzert:'Nimmt nur halben Schaden. Nach seinem Stampfer ist die Panzerung offen.'};
// punish window in seconds after an elite or type special (gold ring, +30% damage taken)
const TACO={schnell:1.2,brennend:1,spaltend:1,gepanzert:1.6,brute:1,raser:.8};
const SHRN={as:['Adrenalin','+30% Angriffstempo'],res:['Eisenhaut','+25% Widerstand'],gold:['Goldrausch','doppelter Schrott von Gegnern'],spd:['Rückenwind','+25% Lauftempo'],zap:['Funkenflug','Treffer lösen oft Blitze aus']};
const MATS={stoff:['Stoff','#d6cfc0'],metall:['Metall','#9aa4b0'],chemie:['Chemie','#97C459'],kabel:['Kabel','#f2a04b']};
const EMAT={ghoul:'stoff',rat:'stoff',brute:'metall',shield:'metall',spitter:'chemie',bomb:'chemie',raser:'kabel',crow:'kabel',howl:'kabel',kabel:'kabel',bass:'metall',uhr:'metall',wurz:'stoff',kern:'chemie'};
// weapon mods (Aufsätze): recipe in materials + Schrott, effect applied in gear()/stats()
// v0.78: fewer, stronger mods with a mechanic each. eb: bonus vs elites and bosses, wt: every n-th attack is a Wucht hit, el: element (also as a second element), +35% element damage, procs on 50% of hits
const MODS=[{k:'nagel',n:'Nagelband',d:'+20% Schaden, gegen Elite und Endgegner zusätzlich +20%',c:{metall:4,stoff:2},p:60,a:[['dmg',20]],eb:.2},{k:'gewicht',n:'Gegengewicht',d:'Jeder 4. Angriff ist ein Wuchttreffer: sicherer Krit, doppelter Rückstoß, kurz betäubt',c:{metall:5,kabel:1},p:60,wt:4},
 {k:'batt',n:'Autobatterie',d:'Strom-Element, auch als zweites Element. +35% Elementarschaden, Element bei jedem 2. statt 3. Treffer',c:{kabel:4,metall:2},p:70,el:'shock'},
 {k:'tank',n:'Benzintank',d:'Feuer-Element, auch als zweites Element. +35% Elementarschaden, Element bei jedem 2. statt 3. Treffer',c:{chemie:3,metall:3},p:70,el:'fire'},{k:'phiole',n:'Säurephiole',d:'Säure-Element, auch als zweites Element. +35% Elementarschaden, Element bei jedem 2. statt 3. Treffer',c:{chemie:4,stoff:2},p:70,el:'acid'},
 {k:'dorn',n:'Stacheldraht',d:'+5 Leben pro Kill, +10% Widerstand',c:{metall:3,kabel:3},p:60,a:[['leech',5],['res',10]]}];
// equipment slots: w weapon, h head, a body, g hands, f feet, t talisman, r ring, i implant (locked until Potsdamer Platz). Main stat of h/a/g/f in SSTAT, t/r via TM
const SLOTS=['w','h','a','g','f','t','r','i'],SLOTN={w:'Waffe',h:'Kopf',a:'Körper',g:'Hände',f:'Füße',t:'Talisman',r:'Ring',i:'Implantat'},SSTAT={a:'hp',h:'res',g:'as',f:'spd'};
const typeN=it=>it.slot==='w'?KIND[it.kind].n:{h:'Kopfschutz',a:'Rüstung',g:'Handschuhe',f:'Schuhe',t:'Talisman',r:'Ring',i:'Implantat'}[it.slot];
const modSlots=it=>it&&it.slot==='w'?(it.r>=2||it.set?2:1):0;
const SURV=[{k:'doktor',n:'Dr. Ahmet',d:'Jede Expedition startet mit einem Verband mehr',c:'#d6cfc0'},{k:'schmied',n:'Mira, Tüftlerin',d:'Aufsätze kosten 30% weniger Schrott',c:'#8a4a32'},
 {k:'kurier',n:'Kurier Jonas',d:'Händler bieten ein viertes Teil an',c:'#3a6a8a'},{k:'koechin',n:'Oma Gerda',d:'Döner und Zutaten fallen doppelt so oft',c:'#7a3a6a'},
 {k:'spaeher',n:'Späherin Lin',d:'+1 Beuteglück',c:'#3B6D11'},{k:'mechaniker',n:'Kalle, Mechaniker',d:'-10% Sprint-Abklingzeit',c:'#c9a227'}];
const hasS=k=>S.surv&&S.surv[k];
// v0.78 food: ingredients (Zutaten) drop from enemies and crates, meals cost only ingredients and last the whole next expedition
const ZUT={fleisch:['Fleisch','#c0614a','🍖'],gemuese:['Gemüse','#8fd16a','🥕'],gewuerz:['Gewürze','#e0a43a','🌶️']},EZUT={ghoul:'fleisch',rat:'fleisch',brute:'fleisch',crow:'fleisch',howl:'fleisch',wurz:'gemuese',kern:'gemuese',spitter:'gemuese',shield:'gemuese'};
const MEALS=[{k:'suppe',n:'Erbsensuppe',d:'+35% Leben',c:{gemuese:3}},{k:'curry',n:'Currywurst',d:'+25% Schaden',c:{fleisch:2,gewuerz:1}},{k:'kaffee',n:'Filterkaffee',d:'+18% Angriffs- und Lauftempo',c:{gewuerz:2}},{k:'soljanka',n:'Soljanka',d:'+3 Leben pro Sekunde, +10% Widerstand',c:{fleisch:2,gemuese:2}},{k:'gurke',n:'Spreewaldgurken',d:'+4 Beuteglück, +50% Material und Zutaten',c:{gemuese:3,gewuerz:1},req:'garten'}];
// daily challenge: seeded world and spawns, two modifiers per day
const DMODS={blut:['Blutmond','Gegner sind 30% schneller'],elite:['Elitenacht','Doppelt so viele Elite-Gegner'],glas:['Glaskanone','+50% Schaden, -40% Leben'],dunkel:['Stromausfall','Die Nacht ist stockdunkel'],gold:['Goldrausch','Doppelter Schrott'],horde:['Horde','40% mehr Gegner pro Welle'],eisen:['Eiserne Haut','Gegner haben 30% mehr Leben, Beute ist besser']};
const dayKey=()=>{const t=new Date();return t.getFullYear()*10000+(t.getMonth()+1)*100+t.getDate();};
function rngFrom(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function dailyPlan(){const r=rngFrom(dayKey()*7+13),ks=Object.keys(DMODS),a=ks[Math.floor(r()*ks.length)];let b;do{b=ks[Math.floor(r()*ks.length)];}while(b===a);return{d:Math.floor(r()*Math.max(1,S.unlocked)),mods:[a,b]};}
let RNG0=null;const dm_=k=>run&&run.dmods&&run.dmods.includes(k);
function endDaily(){if(RNG0){Math.random=RNG0;RNG0=null;}if(run&&run.daily){const sc=run.kills*10+run.wave*50+(P.hp>0&&run.wave>=WAVES?1000:0);run.score=sc;const k=dayKey();if(!S.daily||S.daily.k!==k)S.daily={k,best:0,tries:0};S.daily.tries++;S.daily.best=Math.max(S.daily.best,sc);save();}}
// v0.85 Drill (Exerzierplatz): endless scrap sink that replaces weapon mastery. Each rank +2% damage and +2% life, cost grows linearly
// v0.86 implant modes: every implant has 3 passive settings, switchable anytime in the inventory (it.im)
const IMODE=[{k:'lauf',n:'Laufwerk',d:'+12% Lauftempo',a:{spd:12}},{k:'takt',n:'Taktgeber',d:'+10% Angriffstempo',a:{as:10}},{k:'haut',n:'Panzerhaut',d:'+8% Widerstand',a:{res:8}}];
const DRILL_D=.02,DRILL_H=.02,drillCost=()=>300+60*(S.drill||0);
const JOBT=[
 {k:'ghoul',n:t=>`Besiege ${t} Ghule`,t:()=>pick([30,40,50])},{k:'brute',n:t=>`Besiege ${t} Brocken`,t:()=>pick([8,12])},{k:'spitter',n:t=>`Besiege ${t} Speier`,t:()=>pick([10,15])},
 {k:'elite',n:t=>`Besiege ${t} Elite-Gegner`,t:()=>pick([2,3,4])},{k:'props',n:t=>`Zerschlage ${t} Kisten oder Tonnen`,t:()=>pick([12,18])},{k:'spati',n:t=>`Plündere ${t} Kisten in einem Späti`,t:()=>3},
 {k:'fire',n:t=>`Besiege ${t} brennende Gegner`,t:()=>pick([15,25])},{k:'acid',n:t=>`Besiege ${t} verätzte Gegner`,t:()=>pick([15,25])},{k:'shock',n:t=>`Triff ${t} Gegner mit Blitzen`,t:()=>pick([30,50])},
 {k:'chest',n:t=>t>1?`Öffne ${t} Kellertruhen`:'Öffne eine Kellertruhe',t:()=>pick([1,2])},{k:'zone',n:t=>t>1?`Halte ${t} Funksignale`:'Halte ein Funksignal',t:()=>pick([1,2])},{k:'trade',n:t=>`Kaufe ${t} Teile beim Händler`,t:()=>pick([1,2])},
 {k:'boss',n:t=>t>1?`Besiege ${t} Endgegner`:'Besiege einen Endgegner',t:()=>pick([1,2])},{k:'rescue',n:t=>'Befreie eine gefangene Person',t:()=>1},{k:'shrine',n:t=>t>1?`Nutze ${t} Litfaßsäulen`:'Nutze eine Litfaßsäule',t:()=>pick([1,2])},{k:'rat',n:t=>`Besiege ${t} Ratten`,t:()=>pick([30,50])},{k:'bomb',n:t=>`Besiege ${t} Zünder`,t:()=>pick([6,10])},{k:'shield',n:t=>`Besiege ${t} Schildträger`,t:()=>pick([5,8])},{k:'wave',n:t=>`Erreiche Welle ${t} in einem Bezirk`,t:()=>pick([10,14,18])}];
const CONS=[{k:'verband',n:'Verband',d:'Heilt 40% Leben über 3 Sekunden',p:15},{k:'molotow',n:'Molotow',d:'Wirft ein Feuerfeld, das Gegner in Brand setzt',p:25}],RZ=[0,.06,.03,.04,.14,.18,.2];
const DIFF=[{n:'Leicht',hp:.7,dmg:.6,luck:0,sc:1},{n:'Normal',hp:1.5,dmg:1.25,luck:0,sc:1},{n:'Schwer',hp:1.85,dmg:1.5,luck:4,sc:1.3}];
const DF=()=>DIFF[S.diff==null?1:S.diff];
const KIND={blade:{n:'Klinge',k:1,rate:.3,reach:60,arc:1.1,knock:240},hammer:{n:'Hammer',k:2.3,rate:.68,reach:74,arc:1.6,knock:430,stun:.6},sling:{n:'Werfer',k:.85,rate:.42,knock:120},spear:{n:'Speer',k:1.45,rate:.5,reach:98,arc:.34,knock:300}};
const NW={blade:['Rostiges Rohr','Bewehrungsstahl','Machete','Brechstange'],hammer:['Vorschlaghammer','Pflasterhammer','Rohrzange'],sling:['Jagdzwille','Nagelwerfer','Steinschleuder'],spear:['Rohrspeer','Fahnenstange','Harpune']};
const LEGW={blade:['Fernsehturm-Splitter','Klinge der Zitadelle'],hammer:['Mauerbrecher','Plattenbrecher'],sling:['Zorn der Ringbahn','Krähenschleuder'],spear:['Speer der Siegessäule']},LEGT=['Herz der Spree','Auge des Fernsehturms'],
// v0.68: legendaries for head, hands, feet and ring
LEGH=['Pickelhaube des Hauptmanns'],LEGG=['Fäuste des Kiezboxers'],LEGF=['Stiefel des Schaffners'],LEGR=['Ring der Weltzeituhr'];
const NA=['Lederjacke','Arbeitsmantel','Schutzweste','Feuerwehrjacke','BVG-Uniform'],LEGA=['Mantel des letzten Späti','Panzer vom Tempelhofer Feld','Mantel der Rattenmutter','Rüstung des Zitadellenritters'];
const NH=['Bauhelm','Schiebermütze','Wollmütze','Gasmaske'],NG=['Arbeitshandschuhe','Boxbandagen','Schweißerhandschuhe'],NF=['Turnschuhe','Arbeitsstiefel','Gummistiefel'];
const NR={krit:['Siegelring','Totenkopfring'],tempo:['Schraubenmutter','Drahtring'],heil:['Ehering','Kupferring']};
// looks of head, hand and foot items on the character (head overrides the body armor's helmet)
const HEADL={kiezhelm:{helmet:'hard',hc:'#3a5a8a'},topfhelm:{helmet:'steel',hc:'#8a8f96'},pickel:{helmet:'steel',hc:'#a89a68'},stroh:{helmet:'straw',hc:'#d8b860'},nbrille:{helmet:'goggles',hc:'#43d1cf'},helm:{helmet:'hard',hc:'#d9a520'},schieber:{helmet:'flat',hc:'#5a4a3a'},muetze:{helmet:'beanie',hc:'#8a2a24'},maske:{helmet:'mask',hc:'#4a4e44'}},GLOVE={kiezhand:'#3a5a8a',kiezbox:'#c23a2e',gartenh:'#6a8a3a',handsch:'#8a6a3a',bandage:'#e8ddd0',schweiss:'#5a3a24'},BOOT={spreestief:'#2f5a4a',eisenstief:'#6a6e76',schaffner:'#1f2430',turnsch:'#e8ddd0',stiefel:'#3a2618',gummi:'#2f4a2a'};
// Mitte (D.cyber): own weapon, armour and head bases, implants (slot i) drop only there. Neon weapons lean to shock
const NWM={blade:['Leuchtröhre'],hammer:['Boxenhammer'],sling:['Neonflinte'],spear:['Mikroständer']},NAM=['Regenponcho','Kabelmantel'],NHM=['Neonbrille'],NI={krit:['Neonauge','Zielchip'],tempo:['Kabelarm','Reflexkoppler'],heil:['Bassherz','Nanopumpe']},LEGI=['Arm des Basspredigers'];
// Alexanderplatz (D.gdr, v0.49): own bases. Sichel leans to acid, Zeigerlanze to shock, the Aufziehschleuder finisher fires a fan of three
const NWG={blade:['Sichel'],hammer:['Werkhammer'],sling:['Aufziehwerfer'],spear:['Zeigerlanze']},NAG=['Blaumann'],NHG=['Strohhut'],NGG=['Gartenhandschuhe'];
const NT={krit:['Spreekiesel','Mauerstück'],tempo:['Rabenfeder','Fahrradkette'],heil:['Kräuterbeutel','Currywurst-Abzeichen']};
const SUF=[[],['der Glut','des Schutts','der Asche','des Rauchs'],['des Spreewächters','der letzten Ruine','des Brandes'],[]];
const BASES={'Holzlatte':'latte','Rostiges Rohr':'rohr','Bewehrungsstahl':'stahl','Machete':'machete','Brechstange':'brech','Vorschlaghammer':'vorschlag','Pflasterhammer':'pflaster','Rohrzange':'zange',
 'Zwille':'zwille','Nagelschleuder':'nagel','Jagdzwille':'zwille','Nagelwerfer':'nagel','Steinschleuder':'stein','Fernsehturm-Splitter':'turm','Mauerbrecher':'mauer','Zorn der Ringbahn':'ring',
 'Lederjacke':'leder','Bauhelm':'helm','Arbeitsmantel':'mantel','Schutzweste':'weste','Feuerwehrjacke':'feuer','BVG-Uniform':'bvg','Mantel des letzten Späti':'spaeti','Panzer vom Tempelhofer Feld':'panzer',
 'Spreekiesel':'kiesel','Mauerstück':'stueck','Rabenfeder':'feder','Fahrradkette':'kette','Kräuterbeutel':'beutel','Currywurst-Abzeichen':'abzeichen','Herz der Spree':'herz',
 'Klinge der Zitadelle':'zitklinge','Plattenbrecher':'pbrecher','Krähenschleuder':'kraehe','Mantel der Rattenmutter':'rattenmantel','Rüstung des Zitadellenritters':'ritter','Auge des Fernsehturms':'auge','Morgenstern der Zitadelle':'morgen','Kettenhemd der Zitadelle':'kette','Wappen der Zitadelle':'wappen','Rohrspeer':'rspeer','Schiebermütze':'schieber','Wollmütze':'muetze','Gasmaske':'maske','Arbeitshandschuhe':'handsch','Boxbandagen':'bandage','Schweißerhandschuhe':'schweiss','Turnschuhe':'turnsch','Arbeitsstiefel':'stiefel','Gummistiefel':'gummi','Siegelring':'siegel','Totenkopfring':'totenk','Schraubenmutter':'mutter','Drahtring':'draht','Ehering':'ehe','Kupferring':'kupfer','Fahnenstange':'fahne','Harpune':'harpune','Speer der Siegessäule':'siegsp',
 'Leuchtröhre':'leucht','Boxenhammer':'boxh','Neonflinte':'neonfl','Mikroständer':'mikro','Regenponcho':'poncho','Kabelmantel':'kmantel','Neonbrille':'nbrille','Neonauge':'nauge','Zielchip':'zchip','Kabelarm':'karm','Reflexkoppler':'reflex','Bassherz':'bherz','Nanopumpe':'npumpe','Arm des Basspredigers':'bassarm','Sichel':'sichel','Werkhammer':'werkh','Aufziehschleuder':'aufzieh','Aufziehwerfer':'aufzieh','Zeigerlanze':'zeiger','Blaumann':'blaumann','Strohhut':'stroh','Gartenhandschuhe':'gartenh','Pickelhaube des Hauptmanns':'pickel','Helm der Kiezwache':'kiezhelm','Handschuhe der Kiezwache':'kiezhand','Stiefel des Spreegeists':'spreestief','Ring des Spreegeists':'spreering','Topfhelm der Zitadelle':'topfhelm','Eisenstiefel der Zitadelle':'eisenstief','Fäuste des Kiezboxers':'kiezbox','Stiefel des Schaffners':'schaffner','Ring der Weltzeituhr':'weltuhr'};
function baseOf(it){if(!it)return'none';if(it.base)return it.base;for(const n in BASES)if(it.name.startsWith(n))return(it.base=BASES[n]);return({blade:'rohr',hammer:'vorschlag',sling:'zwille',armor:'leder'}[it.kind])||'kiesel';}
const LOOK={none:{j:'#3d3a36',hood:'#2c2926'},leder:{j:'#4a2a1a',collar:'#2a160d',hair:1},helm:{j:'#45413b',helmet:'hard',hc:'#d9a520'},mantel:{j:'#5a5040',coat:1,hair:1},
 weste:{j:'#33302c',vest:'#4a5536',hair:1},feuer:{j:'#7a2416',stripes:'#e8d36a',helmet:'fire',hc:'#2a2522'},bvg:{j:'#26304a',helmet:'cap',hc:'#f2c230'},
 spaeti:{j:'#3a1a40',coat:1,scarf:'#f2d14b',hair:1},rattenmantel:{j:'#4a3e36',coat:1,scarf:'#97C459',hair:1},ritter:{j:'#383e48',vest:'#8a8f96',plates:1,helmet:'steel',hc:'#8a8f96'},kette:{j:'#4a4e54',vest:'#6a6e76',plates:1,hair:1},panzer:{j:'#3d3a36',vest:'#7a766c',plates:1,helmet:'steel',hc:'#8a8478'},
 poncho:{j:'#2e4450',coat:1,stripes:'#43d1cf',hair:1},blaumann:{j:'#2e4a7a',vest:'#26406a',hair:1},kmantel:{j:'#3a2a3a',coat:1,collar:'#bd2b77',hair:1}};
// b: boss id (index into BN/BK, also e.v of the district boss). v0.47: Neukölln removed, Mitte is the geographic government district with the Potsdamer Platz neon core (cyber: neon, implants, cable enemies; wet: rain rules; nc: night tint rgb)
// v0.49: Alexanderplatz replaces Prenzlauer Berg and sits between Xhain and Mitte (gdr: clockwork and garden enemies, district bases; day: daylight, light tint only)
const DIST=[
 {i:0,b:0,n:'Köpenick',lvl:0,ground:'#2a211b',road:'#231c17',walls:['#5a3f2e','#4e3a2c','#634634'],roof:['#3a2a22','#45302a','#33261f'],dark:.66,spit:.16,brute:.1,sw:3,bw:4,trees:16,spati:'Späti an der Altstadt'},
 {i:1,b:1,n:'Xhain',lvl:8,ground:'#262020',road:'#1f1a1a',walls:['#584540','#4b3c3a','#61493d'],roof:['#2f2826','#3a302b','#2a2321'],dark:.7,spit:.28,brute:.12,sw:1,bw:3,trees:10,spati:'Späti am Wrangelkiez'},
 {i:2,b:8,n:'Alexanderplatz',lvl:18,ground:'#3a3428',road:'#2e2a24',walls:['#b8a480','#a89474','#c8b490'],roof:['#5a5040','#4a4234','#62584a'],dark:.4,spit:.08,brute:.12,sw:1,bw:2,trees:10,spati:'Späti am Alex',gdr:1,day:1,nc:'30,20,8'},
 {i:3,b:2,n:'Mitte',lvl:30,ground:'#221f27',road:'#1a1a20',walls:['#5a5560','#4a4652','#625a64'],roof:['#2e2c34','#38343e','#2a2830'],dark:.74,spit:.14,brute:.16,sw:1,bw:2,trees:8,spati:'Späti am Potsdamer Platz',cyber:1,wet:1,nc:'4,7,12'},
 {i:4,b:3,n:'Tempelhof',lvl:42,ground:'#2a2418',road:'#241f17',walls:['#5e5040','#504436','#665642'],roof:['#3a3226','#463a2c','#30291f'],dark:.78,spit:.3,brute:.26,sw:1,bw:1,trees:12,spati:'Späti am Feld'},
 {i:5,b:6,n:'Spandau',lvl:54,ground:'#25231b',road:'#1f1c16',walls:['#5a4a38','#4e4032','#66523e'],roof:['#35291f','#3f3126','#2d231b'],dark:.82,spit:.24,brute:.26,sw:1,bw:1,trees:16,spati:'Späti an der Havel'},
 {i:6,b:7,n:'Marzahn',lvl:66,ground:'#26231f',road:'#1f1c19',walls:['#5e5a52','#54504a','#66625a'],roof:['#35322e','#3d3a35','#2e2b28'],dark:.84,spit:.26,brute:.28,sw:1,bw:1,trees:8,spati:'Späti Helle Mitte'}];
const DI=n=>DIST.findIndex(d=>d.n===n);
// extra enemy mix per district: [rat, bomb, shield, crow, howl, kabel, bass, uhr, wurz, kern]
const MIX=[[0,0,0,.06,0],[.14,.05,0,0,0],[0,.03,0,.05,0,0,0,.1,.08,.09],[0,.04,.08,0,0,.2,.07],[0,.08,0,.12,0],[0,.06,.1,.1,.05],[.08,.12,.1,.06,.07]];
const UPG=[{k:'dmg',n:'Schärfen',d:l=>`+${l*7}% Schaden`,max:10,base:15},{k:'hp',n:'Panzerung',d:l=>`+${l*15} Leben`,max:10,base:15},{k:'dash',n:'Ausdauer',d:l=>`-${l*8}% Sprint-Abklingzeit`,max:5,base:25},{k:'luck',n:'Spürnase',d:l=>`+${l} Beuteglück`,max:5,base:30}];
const upCost=u=>Math.round(u.base*1.25*Math.pow(1.65,S.upg[u.k]));// v0.77: about twice the total cost (was base*1.55^l)
// v0.82 blessing families (Hades-style): a held family is offered 2.5x as often, two held families unlock their Doppelsegen (duo). Weapon mods (w) are rare one-per-run cards that change how the weapon attacks
const FAM={el:['Element','#7dd3ff'],krit:['Kombo und Krit','#f2d14b'],sprint:['Sprint','#9fd8c8'],serie:['Serie','#e05050'],glut:['Glut','#ff7a2a'],boll:['Bollwerk','#9aa4b0'],dist:['Distanz','#b8e05a']};
const PERKS=[
 {k:'dmg',n:'Kiezwut',d:'+15% Schaden',max:5},{k:'hp',n:'Dickes Fell',d:'+25 maximales Leben',max:5,f:['boll']},{k:'spd',n:'Fersengeld',d:'+10% Lauftempo',max:3,f:['sprint']},
 {k:'crit',n:'Adlerblick',d:'+8% Krit-Chance',max:4,f:['krit']},{k:'rate',n:'Akkordarbeit',d:'+12% Angriffstempo',max:4,f:['serie']},{k:'reach',n:'Langer Kerl',d:'+20% Reichweite und Geschossgeschwindigkeit',max:3,f:['dist']},
 {k:'leech',n:'Aderlass',d:'Jeder Kill heilt 2 Leben',max:3,f:['serie']},{k:'ram',n:'Rammbock',d:'Sprint trifft Gegner auf dem Weg mit 120% Waffenschaden je Stufe',max:3,f:['sprint']},{k:'stun',n:'Kopfnuss',d:'Krits betäuben Gegner 0,6 s (Endgegner kürzer)',max:1,f:['krit']},
 {k:'boom',n:'Splitterleichen',d:'Gegner explodieren beim Tod: 35% Waffenschaden je Stufe an Nachbarn',max:3,f:['serie']},{k:'second',n:'Stehaufmännchen',d:'Überlebe einmal pro Lauf einen tödlichen Treffer',max:1},
 {k:'scrap',n:'SERO-Sammler',d:'+50% Schrott in diesem Lauf',max:2},{k:'dashcd',n:'Hakenschlag',d:'-20% Sprint-Abklingzeit',max:2,f:['sprint']},
 {k:'thorns',n:'Igelstellung',d:'Wer dich im Nahkampf trifft, nimmt 60% Waffenschaden je Stufe',max:3,f:['boll']},{k:'skill',n:'Notstrom',d:'-20% Abklingzeit deiner Kraft',max:2},{k:'magnet',n:'Elster',d:'Beute in der Nähe fliegt dir zu',max:2},
 {k:'fire',n:'Feuertaufe',d:'30% Chance je Treffer: Gegner brennen 2 s und nehmen jede Sekunde 45% des Trefferschadens',max:1,f:['el','glut']},{k:'acid',n:'Säurebad',d:'30% Chance je Treffer: Gegner sind 3 s verätzt und nehmen 25% mehr Schaden',max:1,f:['el']},
 {k:'shock',n:'Blitzableiter',d:'30% Chance je Treffer: Ein Blitz springt auf 2 Nachbarn über und macht 50% des Trefferschadens',max:1,f:['el']},{k:'spread',n:'Flächenbrand',d:'Brennende Gegner entzünden beim Tod ihre Nachbarn mit 80% ihres Brandschadens',max:1,req:'fire',f:['el','glut']},
 {k:'corrode',n:'Zersetzung',d:'Verätzte Gegner sind 30% langsamer',max:1,req:'acid',f:['el']},{k:'chain',n:'Kettenblitz',d:'Blitze springen auf 2 weitere Gegner je Stufe',max:2,req:'shock',f:['el']},
 {k:'elp',n:'Pulverfass',d:'+25% Elementarschaden',max:3,req:'any',f:['el']},{k:'res',n:'Abgehärtet',d:'+6% Widerstand',max:4,f:['boll']},
 {k:'combo',n:'Trommelfeuer',d:'Finisher kommen einen Schlag früher',max:1,f:['krit']},{k:'loot',n:'Mundraub',d:'Kisten und Tonnen geben doppelt Schrott und öfter Material',max:1},
 {k:'breaker',n:'Dicke Bertha',d:'+25% Schaden gegen Schildträger, Elite-Gegner und Endgegner',max:2,f:['boll']},{k:'blast',n:'Sprengmeister',d:'Molotows und Brandsätze brennen 50% größer, Explosionen verletzen dich nicht',max:1,f:['glut']},
 {k:'breath',n:'Atempause',d:'Jeder Sprint heilt 3% Leben',max:2,f:['sprint']},{k:'exec',n:'Gnadenstoß',d:'Normale Gegner unter 12% Leben sterben sofort',max:1,f:['serie']},
 {k:'mat',n:'Hamsterkauf',d:'+50% Materialfunde',max:2},{k:'rush',n:'Kiezrausch',d:'+2% Schaden je 10 Kills in der laufenden Serie',max:1,f:['serie']},
 {k:'pauke',n:'Paukenschlag',d:'Finisher treffen immer kritisch',max:1,f:['krit']},{k:'husar',n:'Husarenritt',d:'Nach einem Sprint 1 s lang +40% Schaden je Stufe',max:2,f:['sprint']},
 {k:'jagd',n:'Jagdfieber',d:'Jeder Kill: +6% Angriffstempo für 3 s, bis zu 5-mal',max:1,f:['serie']},{k:'schwel',n:'Schwelbrand',d:'Brand stapelt bis zu 3-mal und hält 1 s länger',max:1,req:'fire',f:['glut']},
 {k:'kachel',n:'Kachelofen',d:'Brandschaden heilt dich um 5% je Stufe',max:2,req:'fire',f:['glut']},{k:'stellung',n:'Stellungskrieg',d:'Im Stehen nimmst du 25% weniger Schaden',max:1,f:['boll']},
 {k:'retour',n:'Retourkutsche',d:'Wirst du getroffen, macht dein nächster Angriff doppelten Schaden',max:1,f:['boll']},{k:'kimme',n:'Kimme und Korn',d:'Je weiter das Ziel weg ist, desto mehr Schaden (bis +32%)',max:1,f:['dist']},
 {k:'durch',n:'Durchschlag',d:'Geschosse durchbohren einen Gegner mehr je Stufe',max:2,f:['dist']},
 {k:'d_brand',n:'Brandstifter',d:'Dein Sprint hinterlässt eine Feuerspur',max:1,duo:['glut','sprint']},{k:'d_mauer',n:'Brandmauer',d:'Wer dich im Nahkampf trifft, fängt Feuer',max:1,duo:['boll','glut']},
 {k:'d_sturm',n:'Sturmangriff',d:'Ein Kill kurz nach dem Sprint lädt den Sprint sofort auf',max:1,duo:['sprint','serie']},{k:'d_kurz',n:'Kurzschluss',d:'Krits lösen immer dein Element aus',max:1,duo:['krit','el']},
 {k:'d_ziel',n:'Zielwasser',d:'+25% Krit-Chance gegen entfernte Gegner',max:1,duo:['dist','krit']},
 {k:'m_rund',n:'Rundumschlag',d:'Dein Finisher trifft rundherum, +20% Reichweite',max:1,w:'blade'},{k:'m_dampf',n:'Dampfhammer',d:'30% langsamer, +70% Schaden, jeder Hieb schickt eine Druckwelle',max:1,w:'hammer'},
 {k:'m_schrot',n:'Schrotladung',d:'Jeder Schuss feuert 3 Kugeln mit je 55% Schaden, kürzere Reichweite',max:1,w:'sling'},{k:'m_spiess',n:'Wurfspieße',d:'Jeder Finisher wirft zusätzlich einen Speer, der 4 Gegner durchbohrt',max:1,w:'spear'}];
const pFam=p=>p.duo||p.f||[],famHeld=()=>{const h=new Set();if(run)for(const k in run.perks)if(run.perks[k]>0){const p=PERKS.find(x=>x.k===k);if(p&&!p.duo&&!p.w)(p.f||[]).forEach(f=>h.add(f));}return h;};
// v0.82 weapon powers (Kräfte): 3 per weapon class; since v0.86 power 1 or 2 is set on the weapon item (w.kr) and the third, the ultimate, is always equipped; the third is an ultimate with a long cooldown. Names: [default, Potsdamer Platz neon bases, Alexanderplatz bases]
const KR={blade:[{k:'saege',n:['Kreissäge','Neonwirbel','Ernteschlacht'],d:'Du wirbelst 1,2 s lang und triffst alles um dich herum',cd:7},
  {k:'fecht',n:['Fechtsprung','Phasensprung','Sonderschicht'],d:'Sprung durch die Gegner mit 180% Schaden. Ein Kill lädt die Kraft sofort auf',cd:6},
  {k:'saebel',n:['Säbeltanz','Übertakten','Übersoll'],d:'5 s lang +80% Angriffstempo, jeder Treffer kritisch',cd:24,u:1}],
 hammer:[{k:'fall',n:['Fallhammer','Bassdrop','Plattenbau'],d:'Druckwelle um dich: 250% Schaden, betäubt',cd:8},
  {k:'gully',n:['Gullydeckel','Schallmauer','Schutzwall'],d:'3 s Deckung: 70% weniger Schaden, du gehst langsamer. Danach ein Rundumschlag',cd:9},
  {k:'abriss',n:['Abrissbirne','Bassbombe','Rückbau'],d:'Sprung zum Ziel, riesige Druckwelle mit 400% Schaden, betäubt lange',cd:22,u:1}],
 sling:[{k:'nagel',n:['Nagelsturm','Plasmasalve','Aufziehsalve'],d:'Fächer aus 9 Geschossen',cd:6},
  {k:'brand',n:['Brandsatz','Plasmagranate','Braunkohle'],d:'Wurf auf das Ziel: Feuerfeld für 4 s',cd:8},
  {k:'sperr',n:['Sperrfeuer','Drohnenschwarm','Zapfenstreich'],d:'8 Einschläge auf Gegner in der Nähe, je 220% Schaden',cd:22,u:1}],
 spear:[{k:'spiess',n:['Spießrute','Rückkopplung','Stundenschlag'],d:'Speerwurf, durchbohrt alles in einer Linie',cd:7},
  {k:'stab',n:['Stabhochsprung','Stagedive','Sprungfeder'],d:'Sprung nach vorn, die Landung trifft alles im Kreis mit 220% Schaden',cd:6},
  {k:'stand',n:['Standarte','Verstärker','Weltzeituhr'],d:'Pflanzt 8 s eine Standarte. Darin +50% Schaden und Heilung, Gegner langsamer',cd:26,u:1}]};
const krVar=b=>({leucht:1,boxh:1,neonfl:1,mikro:1,sichel:2,werkh:2,aufzieh:2,zeiger:2})[b]||0,krOf=w=>{w=w||S.eq.w;return KR[w.kind][w.kr===1?1:0];},ulOf=w=>KR[(w||S.eq.w).kind][2],// v0.86: the regular power is chosen per weapon (w.kr 0/1, anytime in the inventory), the ultimate is always equipped on its own button
krName=(p,w)=>p.n[krVar(baseOf(w||S.eq.w))];
let run=null;const pk=k=>(run&&run.perks[k])||0;
