# Online save + telemetry backend

Google Sheet with a bound Apps Script web app. Free, no server. Players need no Google account.

## Setup (once, about 5 minutes)

1. Create a new Google Sheet, name it `Ruinenstadt Sync`.
2. Extensions → Apps Script. Replace the editor content with `tools/sync/Code.gs`, save.
3. Deploy → New deployment → type **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, allow the permissions (Google warns "unverified app": Advanced → continue, it is your own script).
4. Copy the web app URL (`https://script.google.com/macros/s/…/exec`) into `SYNC_URL` in `js/sync.js`, release.

Code changes later: Deploy → Manage deployments → edit → Version: New version. The URL stays the same.

## Data

| Tab | Content |
|---|---|
| `Saves` | One row per sync code: code, save time, update time, chunk count, save JSON in 45k chunks (each prefixed `~`) |
| `Telemetrie` | One row per run: received, anonymous player id, played at, key fields, full entry as JSON in the last column |

Claude reads `Telemetrie` through the Google Sheets connector. Rows as a JSON array (last column) work with `node tools/telemetry.mjs <file>`.

## Limits

Sync codes are the only key: whoever knows a code can load and overwrite that save. Fine for friends, not for strangers. Apps Script allows 30 simultaneous executions; the game pushes at most every 3 s per player.
