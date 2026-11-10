#!/usr/bin/env python3
"""Copy proof inputs into scratch. Does not normalize or modify repository art."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT=Path(__file__).resolve().parent
SOURCE=Path('/workspace/generated_images')
FILES={
    'facades.png':'exec-5923e51b-2834-4d7c-b906-68c3d2957f34.png',
    'kit.png':'exec-23a10f98-faa6-4f62-91ba-960e8520ad35.png',
    'full-b.png':'exec-5edf7226-7e2d-4011-a4dd-c665c1c16b73.png',
}

def main():
    destination=ROOT/'assets'
    destination.mkdir(exist_ok=True)
    manifest={}
    for name,source in FILES.items():
        path=SOURCE/source
        shutil.copyfile(path,destination/name)
        manifest[name]={'source':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    (ROOT/'sources.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Prepared three unmodified inputs in '+str(destination))

if __name__=='__main__':
    main()
