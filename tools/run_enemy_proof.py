#!/usr/bin/env python3
"""Run browser proof with local servers that live exactly as long as the check.

Example: python3 tools/run_enemy_proof.py --baseline /tmp/ruinenstadt-baseline67
ENEMY_PROOF_OUT, ENEMY_PERF_DISTRICTS and the other proof flags are inherited.
Requires the same Playwright/Chromium setup as proof_enemies.cjs.
"""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import subprocess
from threading import Thread

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', required=True, type=Path)
    args = parser.parse_args()
    baseline = args.baseline.resolve()
    if not (baseline / 'assets/manifest.json').is_file():
        parser.error('baseline must be an unchanged checkout/export with assets/manifest.json')
    servers, threads = [], []
    try:
        for directory in [ROOT, baseline]:
            server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(directory)))
            thread = Thread(target=server.serve_forever, daemon=True)
            thread.start()
            servers.append(server)
            threads.append(thread)
        env = dict(os.environ, ENEMY_PROOF_PORT=str(servers[0].server_port),
                   ENEMY_BASELINE_PORT=str(servers[1].server_port))
        return subprocess.run(['node', str(ROOT / 'tools/proof_enemies.cjs')], cwd=ROOT, env=env).returncode
    finally:
        for server in servers:
            server.shutdown()
            server.server_close()
        for thread in threads:
            thread.join()


if __name__ == '__main__':
    raise SystemExit(main())
