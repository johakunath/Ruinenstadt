// Balance runner: node tools/balance.mjs [runs] [difficulty 0-2] [seedSave.json]
// Two baselines (v0.99): no seed = fresh campaign from zero; a seed save (plain save JSON, e.g. Johannes' cloud save) = continue at that level.
// Needs `python3 -m http.server 8765` in the repo root and Playwright (pre-installed in Claude Code cloud).
// A bot plays a fresh campaign and prints one line per run plus a summary per district.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const fs = require('fs');
import { extra } from './tlfmt.mjs';
const N = +(process.argv[2] || 40), diff = +(process.argv[3] ?? 1);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:8765/'); await p.waitForTimeout(800);
await p.addScriptTag({ content: fs.readFileSync(new URL('./sim.js', import.meta.url), 'utf8') });
const seed = process.argv[4] ? fs.readFileSync(process.argv[4], 'utf8') : null;// v0.99: start from a given save (e.g. Johannes' level) instead of a fresh campaign
await p.evaluate(([d, seed]) => { localStorage.clear(); S = fix(seed ? JSON.parse(seed) : defSave()); S.diff = d; fillJobs(); SIM.setup(); }, [diff, seed]);
const rows = []; let fails = 0;
for (let i = 0; i < N; i++) {
  const r = await p.evaluate(f => { let di = S.unlocked - 1; const tun = lineOpen(di) && !lineFree(di);/* v0.57: liberated district with a closed line: the bot plays the tunnel next */ if (f >= 3 && !tun) di = Math.max(0, di - 1); const r = SIM.run(di, { tun }); SIM.camp(); r.unl = S.unlocked; r.scrapBank = S.scrap; return r; }, fails);
  rows.push(r); if (r.d === r.unl - 1 || r.won) fails = r.won ? 0 : (fails >= 3 ? 0 : fails + 1);
  console.log(`${String(i + 1).padStart(3)} ${(r.tun ? 'Tunnel ' + DN(r.d).slice(0, 8) : DN(r.d)).padEnd(16)} ${r.won ? 'WIN ' : 'dead'} w${String(r.wave).padStart(2)} ${String(r.t).padStart(4)}s lvl${String(r.lvl).padStart(3)} pw ${String(r.pw0).padStart(5)}→${String(r.pw).padStart(5)} kills ${String(r.kills).padStart(4)} dmg ${String(r.dmg).padStart(6)} ${r.boss} | slowest wave ${r.slow}`);
  { const x = extra(r.tl); if (x) console.log(x); }
  if (r.unl >= 7 && r.won && r.d === 6 && !r.tun) break;
}
function DN(i) { return ['Köpenick', 'Xhain', 'Alexanderplatz', 'Mitte', 'Tempelhof', 'Spandau', 'Marzahn'][i] || '?'; }
console.log('\nper district: runs, wins, avg wave, avg minutes');
for (const tu of [false, true]) for (let d = 0; d < 7; d++) { const R = rows.filter(r => r.d === d && !!r.tun === tu); if (!R.length) continue; const av = k => (R.reduce((a, r) => a + r[k], 0) / R.length);
  console.log(`${((tu ? 'Tunnel ' : '') + DN(d)).padEnd(22)} ${String(R.length).padStart(3)} ${String(R.filter(r => r.won).length).padStart(3)}  w${av('wave').toFixed(1)}  ${(av('t') / 60).toFixed(1)} min`); }
// bot telemetry (v0.54): same entries the game logs for Johannes, saved for comparison with tools/telemetry.mjs
fs.mkdirSync(new URL('./runs/', import.meta.url), { recursive: true }); const out = new URL(`./runs/bot-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}-d${diff}.json`, import.meta.url);
fs.writeFileSync(out, JSON.stringify(rows.map(r => r.tl).filter(Boolean), null, 0)); console.log('bot telemetry saved to', out.pathname);
console.log('errors', errs.slice(0, 5)); await b.close();
