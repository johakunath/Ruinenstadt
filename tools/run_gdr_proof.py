#!/usr/bin/env python3
"""Reproduce task 11 browser proof with temporary HTTP servers.

python3 tools/run_gdr_proof.py --phase visual
python3 tools/run_gdr_proof.py --phase perf

Performance always uses an exact git archive of main commit 60ec422, never a
mutable working checkout. Requires installed Node Playwright and Chromium.
GDR_PROOF_* environment settings are inherited; output defaults to task 11/final.
"""
import argparse
from functools import partial
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import io
import json
import os
from pathlib import Path
import subprocess
import tarfile
from tempfile import TemporaryDirectory
from threading import Thread

ROOT = Path(__file__).resolve().parents[1]
BASELINE = '60ec422ca0760fdffb9f914659b579cbb650520d'


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase', choices=['visual', 'perf', 'all'],
                        default=os.environ.get('GDR_PROOF_PHASE', 'all'))
    args = parser.parse_args()
    servers, threads = [], []
    with TemporaryDirectory(prefix='ruinenstadt-gdr-baseline-') as temp:
        directories = [ROOT]
        if args.phase != 'visual':
            archive = subprocess.check_output(['git', 'archive', BASELINE], cwd=ROOT)
            with tarfile.open(fileobj=io.BytesIO(archive)) as bundle:
                bundle.extractall(temp, filter='data')
            directories.append(Path(temp))
        try:
            for directory in directories:
                server = ThreadingHTTPServer(('127.0.0.1', 0),
                                            partial(QuietHandler, directory=str(directory)))
                thread = Thread(target=server.serve_forever, daemon=True)
                thread.start()
                servers.append(server)
                threads.append(thread)
            env = dict(os.environ, GDR_PROOF_PHASE=args.phase,
                       GDR_PROOF_PORT=str(servers[0].server_port),
                       GDR_BASELINE_COMMIT=BASELINE)
            source_paths = ['index.html', 'sw.js', 'assets/manifest.json']
            source_paths += sorted(str(p.relative_to(ROOT)) for p in (ROOT / 'js').glob('*.js'))
            source_paths += sorted(str(p.relative_to(ROOT)) for p in (ROOT / 'assets/buildings').glob('gdr-*.webp'))
            source_paths += ['tools/proof_gdr_buildings.cjs', 'tools/run_gdr_proof.py']
            env['GDR_PROOF_SOURCES'] = json.dumps({
                p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in source_paths})
            if len(servers) > 1:
                env['GDR_BASELINE_PORT'] = str(servers[1].server_port)
            return subprocess.run(['node', str(ROOT / 'tools/proof_gdr_buildings.cjs')],
                                  cwd=ROOT, env=env).returncode
        finally:
            for server in servers:
                server.shutdown()
                server.server_close()
            for thread in threads:
                thread.join()


if __name__ == '__main__':
    raise SystemExit(main())
