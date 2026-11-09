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
const SETS={kiez:{n:'Kiezwache',p:{w:['Brechstange der Kiezwache','blade','brech'],a:['Weste der Kiezwache','armor','weste'],t:['Abzeichen der Kiezwache','krit','abzeichen']},b2:'+20% Widerstand',b3:'+45% Schaden'},
  spree:{n:'Spreegeist',p:{w:['Zwille des Spreegeists','sling','zwille'],a:['Mantel des Spreegeists','armor','mantel'],t:['Kiesel des Spreegeists','tempo','kiesel']},b2:'+20% Angriffstempo',b3:'Strom-Element und +60% Elementarschaden'},
  zit:{n:'Zitadelle',p:{w:['Morgenstern der Zitadelle','hammer','morgen'],a:['Kettenhemd der Zitadelle','armor','kette'],t:['Wappen der Zitadelle','krit','wappen']},b2:'+90 Leben',b3:'+40% Schaden und +15% Widerstand'}};
const stashMax=()=>40+(S.camp&&S.camp.halle?20:0);
const CAMP=[{k:'turm',n:'Wachturm',d:'+8% Widerstand, dauerhaft',p:150},{k:'sani',n:'Sanitätszelt',d:'Jede Expedition startet mit mindestens 2 Verbänden',p:140},{k:'garten',n:'Gemüsegarten',d:'Du startest jede Expedition satt (+10% Schaden für 60 Sekunden)',p:120},
  {k:'halle',n:'Lagerhalle',d:'+20 Plätze im Lager',p:180},{k:'funk',n:'Funkmast',d:'Ein zusätzliches Ereignis pro Expedition',p:200},{k:'presse',n:'Schrottpresse',d:'+15% Schrott von Gegnern',p:250},{k:'lampe',n:'Stirnlampen-Werkstatt',d:'Zweihändige Waffen bekommen in Dunkelzonen eine Stirnlampe',p:160}];
const ACH=[{k:'k100',n:'Aufräumer',d:'Besiege 100 Gegner',r:50,c:()=>S.rec.kills>=100},{k:'k1000',n:'Kiezlegende',d:'Besiege 1.000 Gegner',r:200,c:()=>S.rec.kills>=1000},
  {k:'leg1',n:'Ein Fund fürs Leben',d:'Finde ein legendäres Teil',r:100,c:()=>S.rec.legs>=1},{k:'win1',n:'Befreier',d:'Befreie einen Bezirk',r:100,c:()=>S.rec.wins>=1},
  {k:'win5',n:'Berlin atmet',d:'Befreie fünf Bezirke',r:400,c:()=>S.best.filter(b=>b>=WAVES).length>=5},{k:'th3',n:'Gegen die Übermacht',d:'Schalte Bedrohung 3 frei',r:300,c:()=>S.tmax>=3},
  {k:'set3',n:'Komplett',d:'Trage ein vollständiges Set',r:250,c:()=>['kiez','spree','zit'].some(k=>setCount(S.eq,k)>=3)},{k:'camp',n:'Zuhause',d:'Baue das Lager komplett aus',r:300,c:()=>CAMP.every(x=>S.camp[x.k])},
  {k:'m5',n:'Meisterhand',d:'Erreiche Meisterschaft 5 mit einer Waffe',r:150,c:()=>['blade','hammer','sling','spear'].some(k=>mLvl(k)>=5)},{k:'chest5',n:'Kellerkind',d:'Öffne 5 Kellertruhen',r:150,c:()=>S.rec.chests>=5},
  {k:'surv6',n:'Volles Lager',d:'Befreie alle sechs Gefangenen',r:300,c:()=>SURV.every(s=>hasS(s.k))},{k:'streak50',n:'Kettenreaktion',d:'Erreiche eine Serie von 50',r:150,c:()=>(S.rec.streak||0)>=50},{k:'endl20',n:'Nachtschicht',d:'Erreiche Welle 20 im Endlos-Modus',r:300,c:()=>(S.eb||[]).some(w=>w>=20)},
  {k:'legall',n:'Sammler',d:'Finde alle legendären Teile',r:500,c:()=>Object.keys(LEGP).every(k=>S.found&&S.found[k])},{k:'mods3',n:'Bastler',d:'Baue 3 Aufsätze in Waffen ein',r:100,c:()=>(S.rec.mods||0)>=3},{k:'spear5',n:'Lanzenreiter',d:'Erreiche Speer-Meisterschaft 5',r:150,c:()=>mLvl('spear')>=5},{k:'th5',n:'Unaufhaltsam',d:'Schalte Bedrohung 5 frei',r:500,c:()=>S.tmax>=5},
  {k:'win8',n:'Ganz Berlin',d:'Befreie Marzahn',r:800,c:()=>S.best[DI('Marzahn')]>=WAVES},{k:'boss10',n:'Bezwinger',d:'Besiege 10 Endgegner',r:250,c:()=>S.rec.bosses>=10}];
let tipQ=[],tipT=0;function tip(k,txt){if(!S.tips||S.tips[k])return;S.tips[k]=1;tipQ.push(txt);}
function checkAch(){for(const a of ACH)if(!S.ach[a.k]&&a.c()){S.ach[a.k]=1;S.scrap+=a.r;toast(`Erfolg: <span style="color:var(--ember)">${a.n}</span> · +${a.r} Schrott`);sfx('win');}}
const SETC='#8fd16a',rc=it=>it.set?SETC:RAR[it.r].c,setCount=(eq,k)=>SLOTS.filter(s=>eq[s]&&eq[s].set===k).length;
const rfCost=it=>Math.round((20+it.ilvl*4+it.r*20)*Math.pow(1.4,it.rr||0));
// v0.62: Umschmieden also costs material (weapon metal, armour cloth, jewellery cable). Weapon mods open after Xhain, reforging after Potsdamer Platz (Mitte)
const rfMat=it=>[({w:'metall',a:'stoff',h:'stoff',g:'stoff',f:'stoff'})[it.slot]||'kabel',it.r+(it.rr||0)],modsOpen=()=>(S.best[1]||0)>=WAVES,forgeOpen=()=>(S.best[3]||0)>=WAVES;
const LOCK='<svg class="lk" width="10" height="11" viewBox="0 0 10 11" aria-hidden="true"><rect x="1" y="5" width="8" height="6" fill="#a8957d"/><path d="M3 5V3a2 2 0 0 1 4 0v2" stroke="#a8957d" fill="none" stroke-width="1.4"/></svg>';
const LEGP={turm:'Krits lösen eine Feuerexplosion aus',mauer:'Jeder vierte Treffer erzeugt eine Säurewelle',ring:'Geschosse springen auf einen weiteren Gegner über',
  spaeti:'Gegner und Kisten lassen doppelt so oft Döner und Vorräte fallen',panzer:'20% Chance, einen Treffer komplett abzublocken',herz:'Einmal pro Expedition überlebst du einen tödlichen Treffer mit 40% Leben',
  zitklinge:'Jeder Kill lädt deine Kraft um 1 Sekunde auf',pbrecher:'Krit-Kills lösen ein betäubendes Beben aus',kraehe:'Geschosse verlangsamen Gegner 2 Sekunden lang',rattenmantel:'Wirst du getroffen, schwappt eine Säurewelle um dich (alle 1,5 s)',ritter:'Am Ende jedes Sprints bebt der Boden',auge:'Elite-Gegner und Endgegner nehmen 25% mehr Schaden',siegsp:'Jeder Stoß verschießt eine goldene Klinge',bassarm:'Jeder fünfte Treffer entlädt einen Kettenblitz auf bis zu 4 Gegner'};
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
const MODS=[{k:'nagel',n:'Nagelband',d:'+12% Schaden',c:{metall:3,stoff:1},p:30,a:[['dmg',12]]},{k:'griff',n:'Griffband',d:'+10% Angriffstempo',c:{stoff:4},p:25,a:[['as',10]]},
 {k:'gewicht',n:'Gegengewicht',d:'+6% Krit-Chance',c:{metall:4},p:30,a:[['crit',6]]},{k:'batt',n:'Autobatterie',d:'Strom-Element, sonst +20% Elementarschaden',c:{kabel:3,metall:1},p:40,el:'shock'},
 {k:'tank',n:'Benzintank',d:'Feuer-Element, sonst +20% Elementarschaden',c:{chemie:2,metall:2},p:40,el:'fire'},{k:'phiole',n:'Säurephiole',d:'Säure-Element, sonst +20% Elementarschaden',c:{chemie:3,stoff:1},p:40,el:'acid'},
 {k:'dorn',n:'Stacheldraht',d:'+2 Leben pro Kill',c:{metall:2,kabel:2},p:35,a:[['leech',2]]}];
// equipment slots: w weapon, h head, a body, g hands, f feet, t talisman, r ring, i implant (locked until Potsdamer Platz). Main stat of h/a/g/f in SSTAT, t/r via TM
const SLOTS=['w','h','a','g','f','t','r','i'],SLOTN={w:'Waffe',h:'Kopf',a:'Körper',g:'Hände',f:'Füße',t:'Talisman',r:'Ring',i:'Implantat'},SSTAT={a:'hp',h:'res',g:'as',f:'spd'};
const typeN=it=>it.slot==='w'?KIND[it.kind].n:{h:'Kopfschutz',a:'Rüstung',g:'Handschuhe',f:'Schuhe',t:'Talisman',r:'Ring',i:'Implantat'}[it.slot];
const modSlots=it=>it&&it.slot==='w'?(it.r>=2||it.set?2:1):0;
const SURV=[{k:'doktor',n:'Dr. Ahmet',d:'Jede Expedition startet mit einem Verband mehr',c:'#d6cfc0'},{k:'schmied',n:'Mira, Schmiedin',d:'Aufsätze kosten 30% weniger Schrott',c:'#8a4a32'},
 {k:'kurier',n:'Kurier Jonas',d:'Händler bieten ein viertes Teil an',c:'#3a6a8a'},{k:'koechin',n:'Oma Gerda',d:'Döner fallen doppelt so oft',c:'#7a3a6a'},
 {k:'spaeher',n:'Späherin Lin',d:'+1 Beuteglück',c:'#3B6D11'},{k:'mechaniker',n:'Kalle, Mechaniker',d:'-10% Sprint-Abklingzeit',c:'#c9a227'}];
const hasS=k=>S.surv&&S.surv[k];
const MEALS=[{k:'suppe',n:'Erbsensuppe',d:'+20% Leben',p:30},{k:'curry',n:'Currywurst',d:'+12% Schaden',p:40},{k:'kaffee',n:'Filterkaffee',d:'+10% Angriffs- und Lauftempo',p:40},{k:'soljanka',n:'Soljanka',d:'+1,5 Leben pro Sekunde',p:35},{k:'gurke',n:'Spreewaldgurken',d:'+2 Beuteglück',p:50,req:'garten'}];
// daily challenge: seeded world and spawns, two modifiers per day
const DMODS={blut:['Blutmond','Gegner sind 30% schneller'],elite:['Elitenacht','Doppelt so viele Elite-Gegner'],glas:['Glaskanone','+50% Schaden, -40% Leben'],dunkel:['Stromausfall','Die Nacht ist stockdunkel'],gold:['Goldrausch','Doppelter Schrott'],horde:['Horde','40% mehr Gegner pro Welle'],eisen:['Eiserne Haut','Gegner haben 30% mehr Leben, Beute ist besser']};
const dayKey=()=>{const t=new Date();return t.getFullYear()*10000+(t.getMonth()+1)*100+t.getDate();};
function rngFrom(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function dailyPlan(){const r=rngFrom(dayKey()*7+13),ks=Object.keys(DMODS),a=ks[Math.floor(r()*ks.length)];let b;do{b=ks[Math.floor(r()*ks.length)];}while(b===a);return{d:Math.floor(r()*Math.max(1,S.unlocked)),mods:[a,b]};}
let RNG0=null;const dm_=k=>run&&run.dmods&&run.dmods.includes(k);
function endDaily(){if(RNG0){Math.random=RNG0;RNG0=null;}if(run&&run.daily){const sc=run.kills*10+run.wave*50+(P.hp>0&&run.wave>=WAVES?1000:0);run.score=sc;const k=dayKey();if(!S.daily||S.daily.k!==k)S.daily={k,best:0,tries:0};S.daily.tries++;S.daily.best=Math.max(S.daily.best,sc);save();}}
const MAST_N={blade:'Klingen',hammer:'Hammer',sling:'Schleuder',spear:'Speer'};
const mLvl=k=>Math.min(10,Math.floor(Math.sqrt(((S.mast&&S.mast[k])||0)/40))),mNext=k=>{const l=mLvl(k);return l>=10?0:40*(l+1)*(l+1);};
const JOBT=[
 {k:'ghoul',n:t=>`Besiege ${t} Ghule`,t:()=>pick([30,40,50])},{k:'brute',n:t=>`Besiege ${t} Brocken`,t:()=>pick([8,12])},{k:'spitter',n:t=>`Besiege ${t} Speier`,t:()=>pick([10,15])},
 {k:'elite',n:t=>`Besiege ${t} Elite-Gegner`,t:()=>pick([2,3,4])},{k:'props',n:t=>`Zerschlage ${t} Kisten oder Tonnen`,t:()=>pick([12,18])},{k:'spati',n:t=>`Plündere ${t} Kisten in einem Späti`,t:()=>3},
 {k:'fire',n:t=>`Besiege ${t} brennende Gegner`,t:()=>pick([15,25])},{k:'acid',n:t=>`Besiege ${t} verätzte Gegner`,t:()=>pick([15,25])},{k:'shock',n:t=>`Triff ${t} Gegner mit Blitzen`,t:()=>pick([30,50])},
 {k:'chest',n:t=>t>1?`Öffne ${t} Kellertruhen`:'Öffne eine Kellertruhe',t:()=>pick([1,2])},{k:'zone',n:t=>t>1?`Halte ${t} Funksignale`:'Halte ein Funksignal',t:()=>pick([1,2])},{k:'trade',n:t=>`Kaufe ${t} Teile beim Händler`,t:()=>pick([1,2])},
 {k:'boss',n:t=>t>1?`Besiege ${t} Endgegner`:'Besiege einen Endgegner',t:()=>pick([1,2])},{k:'rescue',n:t=>'Befreie eine gefangene Person',t:()=>1},{k:'shrine',n:t=>t>1?`Nutze ${t} Litfaßsäulen`:'Nutze eine Litfaßsäule',t:()=>pick([1,2])},{k:'rat',n:t=>`Besiege ${t} Ratten`,t:()=>pick([30,50])},{k:'bomb',n:t=>`Besiege ${t} Zünder`,t:()=>pick([6,10])},{k:'shield',n:t=>`Besiege ${t} Schildträger`,t:()=>pick([5,8])},{k:'wave',n:t=>`Erreiche Welle ${t} in einem Bezirk`,t:()=>pick([10,14,18])}];
const CONS=[{k:'verband',n:'Verband',d:'Heilt 40% Leben über 3 Sekunden',p:15},{k:'molotow',n:'Molotow',d:'Wirft ein Feuerfeld, das Gegner in Brand setzt',p:25}],RZ=[0,.06,.03,.04,.14,.18,.2];
const DIFF=[{n:'Leicht',hp:.7,dmg:.6,luck:0,sc:1},{n:'Normal',hp:1.5,dmg:1.25,luck:0,sc:1},{n:'Schwer',hp:1.85,dmg:1.5,luck:4,sc:1.3}];
const DF=()=>DIFF[S.diff==null?1:S.diff];
const KIND={blade:{n:'Klinge',k:1,rate:.3,reach:60,arc:1.1,knock:240,sk:'Wirbel'},hammer:{n:'Hammer',k:2.3,rate:.68,reach:74,arc:1.6,knock:430,stun:.6,sk:'Stoß'},sling:{n:'Schleuder',k:.85,rate:.42,knock:120,sk:'Salve'},spear:{n:'Speer',k:1.45,rate:.5,reach:98,arc:.34,knock:300,sk:'Wurf'}};
const NW={blade:['Rostiges Rohr','Bewehrungsstahl','Machete','Brechstange'],hammer:['Vorschlaghammer','Pflasterhammer','Rohrzange'],sling:['Zwille','Nagelschleuder','Steinschleuder'],spear:['Rohrspeer','Fahnenstange','Harpune']};
const LEGW={blade:['Fernsehturm-Splitter','Klinge der Zitadelle'],hammer:['Mauerbrecher','Plattenbrecher'],sling:['Zorn der Ringbahn','Krähenschleuder'],spear:['Speer der Siegessäule']},LEGT=['Herz der Spree','Auge des Fernsehturms'];
const NA=['Lederjacke','Arbeitsmantel','Schutzweste','Feuerwehrjacke','BVG-Uniform'],LEGA=['Mantel des letzten Späti','Panzer vom Tempelhofer Feld','Mantel der Rattenmutter','Rüstung des Zitadellenritters'];
const NH=['Bauhelm','Schiebermütze','Wollmütze','Gasmaske'],NG=['Arbeitshandschuhe','Boxbandagen','Schweißerhandschuhe'],NF=['Turnschuhe','Arbeitsstiefel','Gummistiefel'];
const NR={krit:['Siegelring','Totenkopfring'],tempo:['Schraubenmutter','Drahtring'],heil:['Ehering','Kupferring']};
// looks of head, hand and foot items on the character (head overrides the body armor's helmet)
const HEADL={stroh:{helmet:'straw',hc:'#d8b860'},nbrille:{helmet:'goggles',hc:'#43d1cf'},helm:{helmet:'hard',hc:'#d9a520'},schieber:{helmet:'flat',hc:'#5a4a3a'},muetze:{helmet:'beanie',hc:'#8a2a24'},maske:{helmet:'mask',hc:'#4a4e44'}},GLOVE={gartenh:'#6a8a3a',handsch:'#8a6a3a',bandage:'#e8ddd0',schweiss:'#5a3a24'},BOOT={turnsch:'#e8ddd0',stiefel:'#3a2618',gummi:'#2f4a2a'};
// Mitte (D.cyber): own weapon, armour and head bases, implants (slot i) drop only there. Neon weapons lean to shock
const NWM={blade:['Leuchtröhre'],hammer:['Boxenhammer'],sling:['Neonflinte'],spear:['Mikroständer']},NAM=['Regenponcho','Kabelmantel'],NHM=['Neonbrille'],NI={krit:['Neonauge','Zielchip'],tempo:['Kabelarm','Reflexkoppler'],heil:['Bassherz','Nanopumpe']},LEGI=['Arm des Basspredigers'];
// Alexanderplatz (D.gdr, v0.49): own bases. Sichel leans to acid, Zeigerlanze to shock, the Aufziehschleuder finisher fires a fan of three
const NWG={blade:['Sichel'],hammer:['Werkhammer'],sling:['Aufziehschleuder'],spear:['Zeigerlanze']},NAG=['Blaumann'],NHG=['Strohhut'],NGG=['Gartenhandschuhe'];
const NT={krit:['Spreekiesel','Mauerstück'],tempo:['Rabenfeder','Fahrradkette'],heil:['Kräuterbeutel','Currywurst-Abzeichen']};
const SUF=[[],['der Glut','des Schutts','der Asche','des Rauchs'],['des Spreewächters','der letzten Ruine','des Brandes'],[]];
const BASES={'Holzlatte':'latte','Rostiges Rohr':'rohr','Bewehrungsstahl':'stahl','Machete':'machete','Brechstange':'brech','Vorschlaghammer':'vorschlag','Pflasterhammer':'pflaster','Rohrzange':'zange',
 'Zwille':'zwille','Nagelschleuder':'nagel','Steinschleuder':'stein','Fernsehturm-Splitter':'turm','Mauerbrecher':'mauer','Zorn der Ringbahn':'ring',
 'Lederjacke':'leder','Bauhelm':'helm','Arbeitsmantel':'mantel','Schutzweste':'weste','Feuerwehrjacke':'feuer','BVG-Uniform':'bvg','Mantel des letzten Späti':'spaeti','Panzer vom Tempelhofer Feld':'panzer',
 'Spreekiesel':'kiesel','Mauerstück':'stueck','Rabenfeder':'feder','Fahrradkette':'kette','Kräuterbeutel':'beutel','Currywurst-Abzeichen':'abzeichen','Herz der Spree':'herz',
 'Klinge der Zitadelle':'zitklinge','Plattenbrecher':'pbrecher','Krähenschleuder':'kraehe','Mantel der Rattenmutter':'rattenmantel','Rüstung des Zitadellenritters':'ritter','Auge des Fernsehturms':'auge','Morgenstern der Zitadelle':'morgen','Kettenhemd der Zitadelle':'kette','Wappen der Zitadelle':'wappen','Rohrspeer':'rspeer','Schiebermütze':'schieber','Wollmütze':'muetze','Gasmaske':'maske','Arbeitshandschuhe':'handsch','Boxbandagen':'bandage','Schweißerhandschuhe':'schweiss','Turnschuhe':'turnsch','Arbeitsstiefel':'stiefel','Gummistiefel':'gummi','Siegelring':'siegel','Totenkopfring':'totenk','Schraubenmutter':'mutter','Drahtring':'draht','Ehering':'ehe','Kupferring':'kupfer','Fahnenstange':'fahne','Harpune':'harpune','Speer der Siegessäule':'siegsp',
 'Leuchtröhre':'leucht','Boxenhammer':'boxh','Neonflinte':'neonfl','Mikroständer':'mikro','Regenponcho':'poncho','Kabelmantel':'kmantel','Neonbrille':'nbrille','Neonauge':'nauge','Zielchip':'zchip','Kabelarm':'karm','Reflexkoppler':'reflex','Bassherz':'bherz','Nanopumpe':'npumpe','Arm des Basspredigers':'bassarm','Sichel':'sichel','Werkhammer':'werkh','Aufziehschleuder':'aufzieh','Zeigerlanze':'zeiger','Blaumann':'blaumann','Strohhut':'stroh','Gartenhandschuhe':'gartenh'};
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
const upCost=u=>Math.round(u.base*Math.pow(1.55,S.upg[u.k]));
const PERKS=[
 {k:'dmg',n:'Glutzorn',d:'+15% Schaden',max:5},{k:'hp',n:'Zähigkeit',d:'+25 maximales Leben',max:5},{k:'spd',n:'Leichtfuß',d:'+10% Lauftempo',max:3},
 {k:'crit',n:'Scharfes Auge',d:'+8% Krit-Chance',max:4},{k:'rate',n:'Schnelle Hand',d:'+12% Angriffstempo',max:4},{k:'reach',n:'Weiter Arm',d:'+20% Reichweite und Geschossgeschwindigkeit',max:3},
 {k:'leech',n:'Blutdurst',d:'Jeder Kill heilt 2 Leben',max:3},{k:'ram',n:'Rammbock',d:'Sprint verletzt Gegner auf dem Weg',max:3},{k:'stun',n:'Erschütterung',d:'Krits betäuben Gegner kurz',max:1},
 {k:'boom',n:'Splitterleichen',d:'Gegner explodieren beim Tod und verletzen Nachbarn',max:3},{k:'second',n:'Zweiter Atem',d:'Überlebe einmal einen tödlichen Treffer',max:1},
 {k:'scrap',n:'Schrottsammler',d:'+50% Schrott in diesem Lauf',max:2},{k:'dashcd',n:'Ausweichkünstler',d:'-20% Sprint-Abklingzeit',max:2},
 {k:'thorns',n:'Dornenmantel',d:'Wer dich im Nahkampf trifft, nimmt Schaden',max:3},{k:'skill',n:'Kraftreserve',d:'-20% Abklingzeit deiner Kraft',max:2},{k:'magnet',n:'Elster',d:'Beute in der Nähe fliegt dir zu',max:2},
 {k:'fire',n:'Feuertaufe',d:'Deine Treffer setzen Gegner manchmal in Brand',max:1},{k:'acid',n:'Säurebad',d:'Deine Treffer verätzen Gegner manchmal, sie nehmen dann mehr Schaden',max:1},
 {k:'shock',n:'Blitzableiter',d:'Deine Treffer lassen manchmal Blitze auf Nachbarn überspringen',max:1},{k:'spread',n:'Flächenbrand',d:'Brennende Gegner entzünden beim Tod ihre Nachbarn',max:1,req:'fire'},
 {k:'corrode',n:'Zersetzung',d:'Verätzte Gegner sind 30% langsamer',max:1,req:'acid'},{k:'chain',n:'Kettenblitz',d:'Blitze springen auf 2 weitere Gegner',max:2,req:'shock'},
 {k:'elp',n:'Urgewalt',d:'+25% Elementarschaden',max:3,req:'any'},{k:'res',n:'Abgehärtet',d:'+6% Widerstand',max:4},
 {k:'combo',n:'Kombo-Meister',d:'Finisher kommen einen Schlag früher',max:1},{k:'loot',n:'Plünderer',d:'Kisten und Tonnen geben doppelt Schrott und öfter Material',max:1},
 {k:'breaker',n:'Schildbrecher',d:'+25% Schaden gegen Schildträger, Elite-Gegner und Endgegner',max:2},{k:'blast',n:'Sprengmeister',d:'Molotows brennen 50% größer, Explosionen verletzen dich nicht',max:1},
 {k:'breath',n:'Atempause',d:'Jeder Sprint heilt 3% Leben',max:2},{k:'exec',n:'Gnadenstoß',d:'Normale Gegner unter 12% Leben sterben sofort',max:1},
 {k:'mat',n:'Sammler',d:'+50% Materialfunde',max:2},{k:'rush',n:'Rausch',d:'+2% Schaden je 10 Kills in der laufenden Serie',max:1}];
let run=null;const pk=k=>(run&&run.perks[k])||0;
