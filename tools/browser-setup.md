# Local browser proof setup (Windows)

Existing `tools/proof_*.cjs` scripts import `playwright` and accept `CHROMIUM_PATH`. This setup keeps the Node dependency local and uses the installed Chrome executable, so no Playwright browser download is needed.

## Setup

From the repository root in PowerShell:

```powershell
npm install --prefix .tools-browser --no-audit --no-fund playwright@1.65.0
$env:NODE_PATH = (Resolve-Path .tools-browser/node_modules).Path
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
```

The command creates the ignored local package directory and selects Playwright
1.65.0. `NODE_PATH` lets scripts under `tools/` resolve that package without
adding dependencies to the application.

## Run

In one PowerShell window, serve the repository:

```powershell
python -m http.server 8765
```

In another PowerShell window, from the repository root, set the same environment variables and run the desired proof script, for example:

```powershell
$env:NODE_PATH = (Resolve-Path .tools-browser/node_modules).Path
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
node tools/proof_hero.cjs
```

The proof scripts may write reports and images under `pipeline/proof/`; inspect each script's `out` path before running. Browser setup itself does not run proof scripts.

Microsoft Edge is also installed at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`; set `CHROMIUM_PATH` to that executable if preferred.
