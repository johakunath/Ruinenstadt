/* ================= data ================= */
const RAR=[{n:'Gewöhnlich',c:'#e8ddd0',m:1},{n:'Magisch',c:'#7d9bff',m:1.35},{n:'Selten',c:'#f2d14b',m:1.8},{n:'Legendär',c:'#ff8a3d',m:2.6}];
const ELC={fire:'#ff6a2a',acid:'#97C459',shock:'#7dd3ff'},ELN={fire:'Feuer',acid:'Säure',shock:'Strom'};
const RES={raser:{fire:1.2,acid:1.2,shock:.6},ghoul:{fire:1.6,acid:1,shock:1},brute:{fire:.5,acid:1.6,shock:1},spitter:{fire:1,acid:0,shock:1.6},koloss:{fire:.5,acid:1,shock:1.8},brand:{fire:0,acid:1.6,shock:1},hauptmann:{fire:1.3,acid:1,shock:1.3},hexe:{fire:1.6,acid:0,shock:1},turm:{fire:1,acid:1.6,shock:0},flieger:{fire:1,acid:1.3,shock:1.6},
 rat:{fire:1.4,acid:1.4,shock:1.4},bomb:{fire:1.3,acid:1,shock:1.4},shield:{fire:1,acid:1.6,shock:1.2},crow:{fire:1.3,acid:.8,shock:1.6},howl:{fire:1.3,acid:1.2,shock:1},ratten:{fire:1.6,acid:.4,shock:1},ritter:{fire:.8,acid:1,shock:1.7},platte:{fire:.5,acid:1.7,shock:1}};
const BN=['Der Hauptmann von Köpenick','Die Spreehexe','Der Turmwächter','Der Fliegerkönig','Der Brandmeister','Die Rattenmutter','Der Zitadellenritter','Der Plattenkönig'],BK=['hauptmann','hexe','turm','flieger','brand','ratten','ritter','platte'];
const ER=(e,el)=>RES[e.type==='boss'?(e.big?BK[e.v]||'brand':'koloss'):e.type][el];
const AFX={dmg:{n:'Schaden',u:'%',a:6,b:14},as:{n:'Angriffstempo',u:'%',a:5,b:10},crit:{n:'Krit-Chance',u:'%',a:3,b:7},spd:{n:'Lauftempo',u:'%',a:4,b:9},hp:{n:'Leben',u:'',a:10,b:24},
 regen:{n:'Leben pro Sekunde',u:'',a:.3,b:1,d:1},res:{n:'Widerstand',u:'%',a:4,b:9},el:{n:'Elementarschaden',u:'%',a:10,b:25},leech:{n:'Leben pro Kill',u:'',a:1,b:3},cdr:{n:'Abklingzeiten',u:'%',a:5,b:10,neg:1},luck:{n:'Beuteglück',u:'',a:1,b:2}};
const PACTS=[[['dmg',25,40],['as',-15,-10]],[['as',15,22],['dmg',-12,-8]],[['dmg',25,35],['hp',-30,-15]],[['res',15,22],['spd',-12,-8]],[['spd',14,20],['res',-12,-8]],[['crit',10,15],['hp',-20,-10]],[['luck',3,4],['dmg',-10,-8]],[['el',40,60],['crit',-6,-4]]];
const IMP={leder:[['spd',4]],helm:[['res',4]],mantel:[['regen',.5]],weste:[['res',7],['spd',-4]],feuer:[['res',5],['el',8]],bvg:[['spd',6]],spaeti:[['luck',2],['regen',.8]],panzer:[['res',12],['spd',-8]],herz:[['regen',1]]};
const SETS={kiez:{n:'Kiezwache',p:{w:['Brechstange der Kiezwache','blade','brech'],a:['Weste der Kiezwache','armor','weste'],t:['Abzeichen der Kiezwache','krit','abzeichen']},b2:'+15% Widerstand',b3:'+30% Schaden'},
  spree:{n:'Spreegeist',p:{w:['Zwille des Spreegeists','sling','zwille'],a:['Mantel des Spreegeists','armor','mantel'],t:['Kiesel des Spreegeists','tempo','kiesel']},b2:'+15% Angriffstempo',b3:'Strom-Element und +40% Elementarschaden'},
  zit:{n:'Zitadelle',p:{w:['Morgenstern der Zitadelle','hammer','morgen'],a:['Kettenhemd der Zitadelle','armor','kette'],t:['Wappen der Zitadelle','krit','wappen']},b2:'+60 Leben',b3:'+25% Schaden und +10% Widerstand'}};
const stashMax=()=>40+(S.camp&&S.camp.halle?20:0);
const CAMP=[{k:'turm',n:'Wachturm',d:'+8% Widerstand, dauerhaft',p:150},{k:'sani',n:'Sanitätszelt',d:'Jede Expedition startet mit mindestens 2 Verbänden',p:140},{k:'garten',n:'Gemüsegarten',d:'Du startest jede Expedition satt (+10% Schaden für 60 Sekunden)',p:120},
  {k:'halle',n:'Lagerhalle',d:'+20 Plätze im Lager',p:180},{k:'funk',n:'Funkmast',d:'Ein zusätzliches Ereignis pro Expedition',p:200},{k:'presse',n:'Schrottpresse',d:'+15% Schrott von Gegnern',p:250}];
const ACH=[{k:'k100',n:'Aufräumer',d:'Besiege 100 Gegner',r:50,c:()=>S.rec.kills>=100},{k:'k1000',n:'Kiezlegende',d:'Besiege 1.000 Gegner',r:200,c:()=>S.rec.kills>=1000},
  {k:'leg1',n:'Ein Fund fürs Leben',d:'Finde ein legendäres Teil',r:100,c:()=>S.rec.legs>=1},{k:'win1',n:'Befreier',d:'Befreie einen Bezirk',r:100,c:()=>S.rec.wins>=1},
  {k:'win5',n:'Berlin atmet',d:'Befreie Neukölln',r:400,c:()=>S.best[4]>=10},{k:'th3',n:'Gegen die Übermacht',d:'Schalte Bedrohung 3 frei',r:300,c:()=>S.tmax>=3},
  {k:'set3',n:'Komplett',d:'Trage ein vollständiges Set',r:250,c:()=>['kiez','spree','zit'].some(k=>setCount(S.eq,k)>=3)},{k:'camp',n:'Zuhause',d:'Baue das Lager komplett aus',r:300,c:()=>CAMP.every(x=>S.camp[x.k])},
  {k:'m5',n:'Meisterhand',d:'Erreiche Meisterschaft 5 mit einer Waffe',r:150,c:()=>['blade','hammer','sling'].some(k=>mLvl(k)>=5)},{k:'chest5',n:'Kellerkind',d:'Öffne 5 Kellertruhen',r:150,c:()=>S.rec.chests>=5},
  {k:'win8',n:'Ganz Berlin',d:'Befreie Marzahn',r:800,c:()=>S.best[7]>=10},{k:'boss10',n:'Bezwinger',d:'Besiege 10 Endgegner',r:250,c:()=>S.rec.bosses>=10}];
let tipQ=[],tipT=0;function tip(k,txt){if(!S.tips||S.tips[k])return;S.tips[k]=1;tipQ.push(txt);}
function checkAch(){for(const a of ACH)if(!S.ach[a.k]&&a.c()){S.ach[a.k]=1;S.scrap+=a.r;toast(`Erfolg: <span style="color:var(--ember)">${a.n}</span> · +${a.r} Schrott`);sfx('win');}}
const SETC='#8fd16a',rc=it=>it.set?SETC:RAR[it.r].c,setCount=(eq,k)=>['w','a','t'].filter(s=>eq[s]&&eq[s].set===k).length;
const rfCost=it=>Math.round((20+it.ilvl*4+it.r*20)*Math.pow(1.4,it.rr||0));
const LOCK='<svg class="lk" width="10" height="11" viewBox="0 0 10 11" aria-hidden="true"><rect x="1" y="5" width="8" height="6" fill="#a8957d"/><path d="M3 5V3a2 2 0 0 1 4 0v2" stroke="#a8957d" fill="none" stroke-width="1.4"/></svg>';
const LEGP={turm:'Krits lösen eine Feuerexplosion aus',mauer:'Jeder vierte Treffer erzeugt eine Säurewelle',ring:'Geschosse springen auf einen weiteren Gegner über',
  spaeti:'Gegner und Kisten lassen doppelt so oft Döner und Vorräte fallen',panzer:'20% Chance, einen Treffer komplett abzublocken',herz:'Einmal pro Expedition überlebst du einen tödlichen Treffer mit 40% Leben',
  zitklinge:'Jeder Kill lädt deine Kraft um 1 Sekunde auf',pbrecher:'Krit-Kills lösen ein betäubendes Beben aus',kraehe:'Geschosse verlangsamen Gegner 2 Sekunden lang',rattenmantel:'Wirst du getroffen, schwappt eine Säurewelle um dich (alle 1,5 s)',ritter:'Am Ende jedes Sprints bebt der Boden',auge:'Elite-Gegner und Endgegner nehmen 25% mehr Schaden'};
const hasL=k=>baseOf(S.eq.w)===k||(S.eq.a&&baseOf(S.eq.a)===k)||(S.eq.t&&baseOf(S.eq.t)===k);
const LEGEL={turm:'fire',mauer:'acid',ring:'shock',zitklinge:'shock',pbrecher:'fire',kraehe:'acid'},TM={krit:'crit',tempo:'spd',heil:'regen'};
const EMC={schnell:'#7dd3ff',brennend:'#ff6a2a',spaltend:'#97C459',gepanzert:'#d6cfc0'},EMN={schnell:'Flink',brennend:'Brennend',spaltend:'Spaltend',gepanzert:'Gepanzert'};
const ENAME={ghoul:'Ghul',brute:'Brocken',spitter:'Speier',raser:'Raser',rat:'Ratte',bomb:'Zünder',shield:'Schildträger',crow:'Krähe',howl:'Heuler'};
const EDESC={schnell:'Deutlich schneller als normal.',brennend:'Hinterlässt eine Feuerspur.',spaltend:'Zerfällt beim Tod in kleinere Gegner.',gepanzert:'Nimmt nur halben Schaden.'};
const SHRN={as:['Adrenalin','+30% Angriffstempo'],res:['Eisenhaut','+25% Widerstand'],gold:['Goldrausch','doppelter Schrott von Gegnern'],spd:['Rückenwind','+25% Lauftempo'],zap:['Funkenflug','Treffer lösen oft Blitze aus']};
const MATS={stoff:['Stoff','#d6cfc0'],metall:['Metall','#9aa4b0'],chemie:['Chemie','#97C459'],kabel:['Kabel','#f2a04b']};
const EMAT={ghoul:'stoff',rat:'stoff',brute:'metall',shield:'metall',spitter:'chemie',bomb:'chemie',raser:'kabel',crow:'kabel',howl:'kabel'};
// weapon mods (Aufsätze): recipe in materials + Schrott, effect applied in gear()/stats()
const MODS=[{k:'nagel',n:'Nagelband',d:'+12% Schaden',c:{metall:3,stoff:1},p:30,a:[['dmg',12]]},{k:'griff',n:'Griffband',d:'+10% Angriffstempo',c:{stoff:4},p:25,a:[['as',10]]},
 {k:'gewicht',n:'Gegengewicht',d:'+6% Krit-Chance',c:{metall:4},p:30,a:[['crit',6]]},{k:'batt',n:'Autobatterie',d:'Strom-Element, sonst +20% Elementarschaden',c:{kabel:3,metall:1},p:40,el:'shock'},
 {k:'tank',n:'Benzintank',d:'Feuer-Element, sonst +20% Elementarschaden',c:{chemie:2,metall:2},p:40,el:'fire'},{k:'phiole',n:'Säurephiole',d:'Säure-Element, sonst +20% Elementarschaden',c:{chemie:3,stoff:1},p:40,el:'acid'},
 {k:'dorn',n:'Stacheldraht',d:'+2 Leben pro Kill',c:{metall:2,kabel:2},p:35,a:[['leech',2]]}];
const modSlots=it=>it&&it.slot==='w'?(it.r>=2||it.set?2:1):0;
const SURV=[{k:'doktor',n:'Dr. Ahmet',d:'Jede Expedition startet mit einem Verband mehr',c:'#d6cfc0'},{k:'schmied',n:'Mira, Schmiedin',d:'Aufsätze kosten 30% weniger Schrott',c:'#8a4a32'},
 {k:'kurier',n:'Kurier Jonas',d:'Händler bieten ein viertes Teil an',c:'#3a6a8a'},{k:'koechin',n:'Oma Gerda',d:'Döner fallen doppelt so oft',c:'#7a3a6a'},
 {k:'spaeher',n:'Späherin Lin',d:'+1 Beuteglück',c:'#3B6D11'},{k:'mechaniker',n:'Kalle, Mechaniker',d:'-10% Sprint-Abklingzeit',c:'#c9a227'}];
const hasS=k=>S.surv&&S.surv[k];
const MAST_N={blade:'Klingen',hammer:'Hammer',sling:'Schleuder'};
const mLvl=k=>Math.min(10,Math.floor(Math.sqrt(((S.mast&&S.mast[k])||0)/40))),mNext=k=>{const l=mLvl(k);return l>=10?0:40*(l+1)*(l+1);};
const JOBT=[
 {k:'ghoul',n:t=>`Besiege ${t} Ghule`,t:()=>pick([30,40,50])},{k:'brute',n:t=>`Besiege ${t} Brocken`,t:()=>pick([8,12])},{k:'spitter',n:t=>`Besiege ${t} Speier`,t:()=>pick([10,15])},
 {k:'elite',n:t=>`Besiege ${t} Elite-Gegner`,t:()=>pick([2,3,4])},{k:'props',n:t=>`Zerschlage ${t} Kisten oder Tonnen`,t:()=>pick([12,18])},{k:'spati',n:t=>`Plündere ${t} Kisten in einem Späti`,t:()=>3},
 {k:'fire',n:t=>`Besiege ${t} brennende Gegner`,t:()=>pick([15,25])},{k:'acid',n:t=>`Besiege ${t} verätzte Gegner`,t:()=>pick([15,25])},{k:'shock',n:t=>`Triff ${t} Gegner mit Blitzen`,t:()=>pick([30,50])},
 {k:'chest',n:t=>t>1?`Öffne ${t} Kellertruhen`:'Öffne eine Kellertruhe',t:()=>pick([1,2])},{k:'zone',n:t=>t>1?`Halte ${t} Funksignale`:'Halte ein Funksignal',t:()=>pick([1,2])},{k:'trade',n:t=>`Kaufe ${t} Teile beim Händler`,t:()=>pick([1,2])},
 {k:'boss',n:t=>t>1?`Besiege ${t} Endgegner`:'Besiege einen Endgegner',t:()=>pick([1,2])},{k:'rescue',n:t=>'Befreie eine gefangene Person',t:()=>1},{k:'shrine',n:t=>t>1?`Nutze ${t} Litfaßsäulen`:'Nutze eine Litfaßsäule',t:()=>pick([1,2])},{k:'rat',n:t=>`Besiege ${t} Ratten`,t:()=>pick([30,50])},{k:'bomb',n:t=>`Besiege ${t} Zünder`,t:()=>pick([6,10])},{k:'shield',n:t=>`Besiege ${t} Schildträger`,t:()=>pick([5,8])},{k:'wave',n:t=>`Erreiche Welle ${t} in einem Bezirk`,t:()=>pick([6,8,10])}];
const CONS=[{k:'verband',n:'Verband',d:'Heilt 40% Leben über 3 Sekunden',p:15},{k:'molotow',n:'Molotow',d:'Wirft ein Feuerfeld, das Gegner in Brand setzt',p:25}],RZ=[0,.06,.1,.14,.25,.15,.18,.2];
const DIFF=[{n:'Leicht',hp:.7,dmg:.6,luck:0,sc:1},{n:'Normal',hp:1,dmg:1,luck:0,sc:1},{n:'Schwer',hp:1.4,dmg:1.35,luck:4,sc:1.3}];
const DF=()=>DIFF[S.diff==null?1:S.diff];
const KIND={blade:{n:'Klinge',k:1,rate:.3,reach:60,arc:1.1,knock:240,sk:'Wirbel'},hammer:{n:'Hammer',k:2.3,rate:.68,reach:74,arc:1.6,knock:430,stun:.6,sk:'Stoß'},sling:{n:'Schleuder',k:.85,rate:.42,knock:120,sk:'Salve'}};
const NW={blade:['Rostiges Rohr','Bewehrungsstahl','Machete','Brechstange'],hammer:['Vorschlaghammer','Pflasterhammer','Rohrzange'],sling:['Zwille','Nagelschleuder','Steinschleuder']};
const LEGW={blade:['Fernsehturm-Splitter','Klinge der Zitadelle'],hammer:['Mauerbrecher','Plattenbrecher'],sling:['Zorn der Ringbahn','Krähenschleuder']},LEGT=['Herz der Spree','Auge des Fernsehturms'];
const NA=['Lederjacke','Bauhelm','Arbeitsmantel','Schutzweste','Feuerwehrjacke','BVG-Uniform'],LEGA=['Mantel des letzten Späti','Panzer vom Tempelhofer Feld','Mantel der Rattenmutter','Rüstung des Zitadellenritters'];
const NT={krit:['Spreekiesel','Mauerstück'],tempo:['Rabenfeder','Fahrradkette'],heil:['Kräuterbeutel','Currywurst-Abzeichen']};
const SUF=[[],['der Glut','des Schutts','der Asche','des Rauchs'],['des Spreewächters','der letzten Ruine','des Brandes'],[]];
const BASES={'Holzlatte':'latte','Rostiges Rohr':'rohr','Bewehrungsstahl':'stahl','Machete':'machete','Brechstange':'brech','Vorschlaghammer':'vorschlag','Pflasterhammer':'pflaster','Rohrzange':'zange',
 'Zwille':'zwille','Nagelschleuder':'nagel','Steinschleuder':'stein','Fernsehturm-Splitter':'turm','Mauerbrecher':'mauer','Zorn der Ringbahn':'ring',
 'Lederjacke':'leder','Bauhelm':'helm','Arbeitsmantel':'mantel','Schutzweste':'weste','Feuerwehrjacke':'feuer','BVG-Uniform':'bvg','Mantel des letzten Späti':'spaeti','Panzer vom Tempelhofer Feld':'panzer',
 'Spreekiesel':'kiesel','Mauerstück':'stueck','Rabenfeder':'feder','Fahrradkette':'kette','Kräuterbeutel':'beutel','Currywurst-Abzeichen':'abzeichen','Herz der Spree':'herz',
 'Klinge der Zitadelle':'zitklinge','Plattenbrecher':'pbrecher','Krähenschleuder':'kraehe','Mantel der Rattenmutter':'rattenmantel','Rüstung des Zitadellenritters':'ritter','Auge des Fernsehturms':'auge','Morgenstern der Zitadelle':'morgen','Kettenhemd der Zitadelle':'kette','Wappen der Zitadelle':'wappen'};
function baseOf(it){if(!it)return'none';if(it.base)return it.base;for(const n in BASES)if(it.name.startsWith(n))return(it.base=BASES[n]);return({blade:'rohr',hammer:'vorschlag',sling:'zwille',armor:'leder'}[it.kind])||'kiesel';}
const LOOK={none:{j:'#3d3a36',hood:'#2c2926'},leder:{j:'#4a2a1a',collar:'#2a160d',hair:1},helm:{j:'#45413b',helmet:'hard',hc:'#d9a520'},mantel:{j:'#5a5040',coat:1,hair:1},
 weste:{j:'#33302c',vest:'#4a5536',hair:1},feuer:{j:'#7a2416',stripes:'#e8d36a',helmet:'fire',hc:'#2a2522'},bvg:{j:'#26304a',helmet:'cap',hc:'#f2c230'},
 spaeti:{j:'#3a1a40',coat:1,scarf:'#f2d14b',hair:1},rattenmantel:{j:'#4a3e36',coat:1,scarf:'#97C459',hair:1},ritter:{j:'#383e48',vest:'#8a8f96',plates:1,helmet:'steel',hc:'#8a8f96'},kette:{j:'#4a4e54',vest:'#6a6e76',plates:1,hair:1},panzer:{j:'#3d3a36',vest:'#7a766c',plates:1,helmet:'steel',hc:'#8a8478'}};
const DIST=[
 {i:0,n:'Köpenick',lvl:0,ground:'#2a211b',road:'#231c17',walls:['#5a3f2e','#4e3a2c','#634634'],roof:['#3a2a22','#45302a','#33261f'],dark:.66,spit:.16,brute:.1,sw:3,bw:4,trees:16,spati:'Späti an der Altstadt'},
 {i:1,n:'Kreuzberg',lvl:8,ground:'#262020',road:'#1f1a1a',walls:['#584540','#4b3c3a','#61493d'],roof:['#2f2826','#3a302b','#2a2321'],dark:.7,spit:.28,brute:.12,sw:1,bw:3,trees:10,spati:'Späti am Wrangelkiez'},
 {i:2,n:'Mitte',lvl:18,ground:'#2b1f1a',road:'#241915',walls:['#6a4a38','#5a3d2f','#704d36'],roof:['#3d2a20','#4a3226','#36251d'],dark:.74,spit:.22,brute:.22,sw:1,bw:2,trees:8,spati:'Späti Torstraße'},
 {i:3,n:'Tempelhof',lvl:30,ground:'#2a2418',road:'#241f17',walls:['#5e5040','#504436','#665642'],roof:['#3a3226','#463a2c','#30291f'],dark:.78,spit:.3,brute:.26,sw:1,bw:1,trees:12,spati:'Späti am Feld'},
 {i:4,n:'Neukölln',lvl:42,ground:'#2a2220',road:'#221b19',walls:['#5e4a3e','#54423a','#6a5242'],roof:['#3a2e28','#45362e','#30261f'],dark:.8,spit:.22,brute:.24,sw:1,bw:1,trees:9,spati:'Späti Sonnenallee'},
 {i:5,n:'Prenzlauer Berg',lvl:54,ground:'#29221d',road:'#211b17',walls:['#6a5444','#5e4a3c','#735a48'],roof:['#3d2e26','#47362c','#33271f'],dark:.8,spit:.2,brute:.22,sw:1,bw:1,trees:14,spati:'Späti Kastanienallee'},
 {i:6,n:'Spandau',lvl:66,ground:'#25231b',road:'#1f1c16',walls:['#5a4a38','#4e4032','#66523e'],roof:['#35291f','#3f3126','#2d231b'],dark:.82,spit:.24,brute:.26,sw:1,bw:1,trees:16,spati:'Späti an der Havel'},
 {i:7,n:'Marzahn',lvl:78,ground:'#26231f',road:'#1f1c19',walls:['#5e5a52','#54504a','#66625a'],roof:['#35322e','#3d3a35','#2e2b28'],dark:.84,spit:.26,brute:.28,sw:1,bw:1,trees:8,spati:'Späti Helle Mitte'}];
// extra enemy mix per district: [rat, bomb, shield, crow, howl]
const MIX=[[0,0,0,.06,0],[.14,.05,0,0,0],[0,.07,.1,0,0],[0,.08,0,.12,0],[.1,0,.08,0,.04],[.22,.05,.06,0,.05],[0,.06,.14,.1,.05],[.08,.12,.1,.06,.07]];
const UPG=[{k:'dmg',n:'Schärfen',d:l=>`+${l*10}% Schaden`,max:10,base:15},{k:'hp',n:'Panzerung',d:l=>`+${l*15} Leben`,max:10,base:15},{k:'dash',n:'Ausdauer',d:l=>`-${l*8}% Sprint-Abklingzeit`,max:5,base:25},{k:'luck',n:'Spürnase',d:l=>`+${l} Beuteglück`,max:5,base:30}];
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
 {k:'elp',n:'Urgewalt',d:'+25% Elementarschaden',max:3,req:'any'},{k:'res',n:'Abgehärtet',d:'+6% Widerstand',max:4}];
let run=null;const pk=k=>(run&&run.perks[k])||0;
