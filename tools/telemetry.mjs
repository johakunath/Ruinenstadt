// Run telemetry reader: node tools/telemetry.mjs <file with save code, or the code itself>
// Prints Johannes' logged runs in the same format as tools/balance.mjs, so human and bot results can be compared per district.
import fs from 'fs';
const a = process.argv[2] || ''; const code = (fs.existsSync(a) ? fs.readFileSync(a, 'utf8') : a).trim().replace(/^RS1:/, '');
const S = JSON.parse(Buffer.from(code, 'base64').toString('utf8')), L = S.tlog || [];
const DN = i => ['Köpenick', 'Xhain', 'Alexanderplatz', 'Mitte', 'Tempelhof', 'Spandau', 'Marzahn'][i] || '?', DF = ['Leicht', 'Normal', 'Schwer'];
if (!L.length) { console.log('No runs logged yet (telemetry exists since v0.39).'); process.exit(0); }
L.forEach((r, i) => { const sw = r.ws.reduce((b, s, j) => s > b[1] ? [j + 1, s] : b, [0, 0]);
  console.log(`${String(i + 1).padStart(3)} v${r.v} ${r.day} ${DF[r.df] || '?'} ${(r.dn || DN(r.d)).padEnd(16)} ${{ win: 'WIN ', dead: 'dead', quit: 'quit' }[r.end]}${r.m === 'e' ? ' endless' : r.m === 't' ? ' daily' : ''}${r.th ? ' th' + r.th : ''} w${String(r.wave).padStart(2)} ${String(r.t).padStart(4)}s lvl${String(r.lvl).padStart(3)} pw ${String(r.pw0).padStart(5)}→${String(r.pw).padStart(5)} kills ${String(r.kills).padStart(4)} dmg ${String(r.dmg).padStart(6)} ${r.boss} | slowest wave ${sw[0]}:${sw[1]}s`);
  if (r.lo) console.log(`      loot w/b/y/L ${r.lo.join('/')} · lowest life ${Math.round(r.hm * 100)}% · consumables ${r.cu} · boss fights ${r.bt.join(', ') || '-'} s · Schrott +${r.sg} · ${r.wk} · ${r.dev}${r.au ? ' auto' : ''}${r.tk != null ? ' tunnel ' + r.tk : ''} · blessings ${r.pk.join(' ')}`); });
console.log('\nper difficulty and district (normal runs only): runs, wins, deaths, avg wave, avg minutes');
for (let df = 0; df < 3; df++) for (let d = 0; d < 7; d++) { const R = L.filter(r => r.df === df && r.d === d && !r.m); if (!R.length) continue; const av = k => R.reduce((s, r) => s + r[k], 0) / R.length;
  console.log(`${DF[df].padEnd(7)} ${DN(d).padEnd(16)} ${String(R.length).padStart(3)} ${String(R.filter(r => r.end === 'win').length).padStart(3)} ${String(R.filter(r => r.end === 'dead').length).padStart(3)}  w${av('wave').toFixed(1)}  ${(av('t') / 60).toFixed(1)} min`); }
