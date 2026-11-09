// Run telemetry reader: node tools/telemetry.mjs <file with save code, the code itself, or a bot file tools/runs/bot-*.json>
// Prints Johannes' logged runs in the same format as tools/balance.mjs, so human and bot results can be compared per district.
import fs from 'fs';
import { extra } from './tlfmt.mjs';
const a = process.argv[2] || ''; const raw = (fs.existsSync(a) ? fs.readFileSync(a, 'utf8') : a).trim();// a save code, or a bot file from tools/runs/
const L = raw.startsWith('[') ? JSON.parse(raw) : JSON.parse(Buffer.from(raw.replace(/^RS1:/, ''), 'base64').toString('utf8')).tlog || [];
const DN = i => ['Köpenick', 'Xhain', 'Alexanderplatz', 'Mitte', 'Tempelhof', 'Spandau', 'Marzahn'][i] || '?', DF = ['Leicht', 'Normal', 'Schwer'];
if (!L.length) { console.log('No runs logged yet (telemetry exists since v0.39).'); process.exit(0); }
L.forEach((r, i) => { const sw = r.ws.reduce((b, s, j) => s > b[1] ? [j + 1, s] : b, [0, 0]);
  console.log(`${String(i + 1).padStart(3)} v${r.v} ${r.day} ${DF[r.df] || '?'} ${(r.dn || DN(r.d)).padEnd(16)} ${{ win: 'WIN ', dead: 'dead', quit: 'quit' }[r.end]}${r.m === 'e' ? ' endless' : r.m === 't' ? ' daily' : ''}${r.th ? ' th' + r.th : ''} w${String(r.wave).padStart(2)} ${String(r.t).padStart(4)}s lvl${String(r.lvl).padStart(3)} pw ${String(r.pw0).padStart(5)}→${String(r.pw).padStart(5)} kills ${String(r.kills).padStart(4)} dmg ${String(r.dmg).padStart(6)} ${r.boss} | slowest wave ${sw[0]}:${sw[1]}s`);
  const x = extra(r); if (x) console.log(x); });
console.log('\nper difficulty and district (normal runs only): runs, wins, deaths, avg wave, avg minutes');
for (let df = 0; df < 3; df++) for (let d = 0; d < 7; d++) { const R = L.filter(r => r.df === df && r.d === d && !r.m); if (!R.length) continue; const av = k => R.reduce((s, r) => s + r[k], 0) / R.length;
  console.log(`${DF[df].padEnd(7)} ${DN(d).padEnd(16)} ${String(R.length).padStart(3)} ${String(R.filter(r => r.end === 'win').length).padStart(3)} ${String(R.filter(r => r.end === 'dead').length).padStart(3)}  w${av('wave').toFixed(1)}  ${(av('t') / 60).toFixed(1)} min`); }
