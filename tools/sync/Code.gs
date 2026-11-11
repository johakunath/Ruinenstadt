/* Ruinenstadt online save + telemetry backend (v0.76). Container-bound Apps Script of a Google Sheet, deployed as web app:
   Execute as: Me, Who has access: Anyone. Setup: tools/sync/README.md. The game calls it with POST text/plain JSON:
   {a:'get',c}            -> {ok,s,t}       s = save JSON string or null
   {a:'put',c,s,t,b}      -> {ok,t} | {ok:false,newer:true,t}   b = server t the client last saw (optimistic concurrency)
   {a:'tl',p,r:[runs]}    -> {ok,n}          appends one row per run to the sheet "Telemetrie" */
const CH = 45000, CODE = /^[A-Z2-9]{8}$/, PID = /^[a-z0-9]{8,16}$/;
function doPost(e) { let r; try { r = handle(JSON.parse(e.postData.contents)); } catch (x) { r = { ok: false, err: String(x) }; }
  return ContentService.createTextOutput(JSON.stringify(r)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return ContentService.createTextOutput('Ruinenstadt sync ok'); }
function tab(n, head) { const ss = SpreadsheetApp.getActiveSpreadsheet(); let s = ss.getSheetByName(n); if (!s) { s = ss.insertSheet(n); s.appendRow(head); s.setFrozenRows(1); } return s; }
const safe = v => typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
function handle(q) {
  if (q.a === 'tl') { if (!PID.test(q.p || '') || !Array.isArray(q.r) || q.r.length > 100) return { ok: false, err: 'bad' };
    const now = new Date(), rows = q.r.filter(x => x && typeof x === 'object').map(x => { const j = JSON.stringify(x).slice(0, 8000);
      return [now, q.p, x.at ? new Date(x.at) : '', x.v, x.day, x.d, x.dn || '', x.df, x.m || '', x.end, x.wave, x.t, x.lvl, x.dev || '', x.inp || '', x.fps || '', j].map(safe); });
    if (!rows.length) return { ok: true, n: 0 };
    const lk = LockService.getScriptLock(); lk.waitLock(20000);
    try { const s = tab('Telemetrie', ['empfangen', 'spieler', 'gespielt', 'v', 'tag', 'd', 'dn', 'df', 'm', 'end', 'welle', 'sek', 'lvl', 'dev', 'inp', 'fps', 'json']);
      s.getRange(s.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows); } finally { lk.releaseLock(); }
    return { ok: true, n: rows.length }; }
  if (!CODE.test(q.c || '')) return { ok: false, err: 'code' };
  const lk = LockService.getScriptLock(); lk.waitLock(20000);
  try { const s = tab('Saves', ['code', 't', 'aktualisiert', 'teile', 'daten…']), f = s.getRange('A:A').createTextFinder(q.c).matchEntireCell(true).findNext(), row = f ? f.getRow() : 0;
    const cur = row ? s.getRange(row, 1, 1, 4).getValues()[0] : null, t0 = cur ? +cur[1] : 0;
    if (q.a === 'get') { if (!row) return { ok: true, s: null, t: 0 }; return { ok: true, s: s.getRange(row, 5, 1, +cur[3]).getValues()[0].map(x => String(x).slice(1)).join(''), t: t0 }; }
    if (q.a === 'put') { const d = String(q.s || ''), t = +q.t || Date.now(); if (!d || d.length > 2e6) return { ok: false, err: 'size' };
      if (row && t0 && +q.b !== t0) return { ok: false, newer: true, t: t0 };
      const parts = []; for (let i = 0; i < d.length; i += CH) parts.push('~' + d.slice(i, i + CH));// ~ prefix: a chunk never starts with = (formula)
      const r = row || s.getLastRow() + 1; if (row && +cur[3] > parts.length) s.getRange(r, 5 + parts.length, 1, +cur[3] - parts.length).clearContent();
      s.getRange(r, 1, 1, 4 + parts.length).setNumberFormat('@').setValues([[q.c, String(t), new Date().toISOString(), String(parts.length)].concat(parts)]);
      return { ok: true, t }; }
    return { ok: false, err: 'a' }; } finally { lk.releaseLock(); } }
