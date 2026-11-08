// Balance runner: node tools/balance.mjs [runs] [difficulty 0-2] [seedSave.json]
// Needs `python3 -m http.server 8765` in the repo root and Playwright (pre-installed in Claude Code cloud).
// A bot plays a fresh campaign and prints one line per run plus a summary per district.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const fs = require('fs');
const N = +(process.argv[2] || 40), diff = +(process.argv[3] ?? 1);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:8765/'); await p.waitForTimeout(800);
await p.addScriptTag({ content: fs.readFileSync(new URL('./sim.js', import.meta.url), 'utf8') });
await p.evaluate(d => { localStorage.clear(); S = fix(defSave()); S.diff = d; fillJobs(); SIM.setup(); }, diff);
const rows = []; let fails = 0;
for (let i = 0; i < N; i++) {
  const r = await p.evaluate(f => { let di = S.unlocked - 1; if (f >= 3) di = Math.max(0, di - 1); const r = SIM.run(di); SIM.camp(); r.unl = S.unlocked; r.scrapBank = S.scrap; return r; }, fails);
  rows.push(r); if (r.d === r.unl - 1 || r.won) fails = r.won ? 0 : (fails >= 3 ? 0 : fails + 1);
  console.log(`${String(i + 1).padStart(3)} ${DN(r.d).padEnd(16)} ${r.won ? 'WIN ' : 'dead'} w${String(r.wave).padStart(2)} ${String(r.t).padStart(4)}s lvl${String(r.lvl).padStart(3)} pw ${String(r.pw0).padStart(5)}→${String(r.pw).padStart(5)} kills ${String(r.kills).padStart(4)} dmg ${String(r.dmg).padStart(6)} ${r.boss} | slowest wave ${r.slow}`);
  if (r.unl >= 7 && r.won && r.d === 6) break;
}
function DN(i) { return ['Köpenick', 'Xhain', 'Mitte', 'Tempelhof', 'Prenzlauer Berg', 'Spandau', 'Marzahn'][i] || '?'; }
console.log('\nper district: runs, wins, avg wave, avg minutes');
for (let d = 0; d < 7; d++) { const R = rows.filter(r => r.d === d); if (!R.length) continue; const av = k => (R.reduce((a, r) => a + r[k], 0) / R.length);
  console.log(`${DN(d).padEnd(16)} ${String(R.length).padStart(3)} ${String(R.filter(r => r.won).length).padStart(3)}  w${av('wave').toFixed(1)}  ${(av('t') / 60).toFixed(1)} min`); }
console.log('errors', errs.slice(0, 5)); await b.close();
