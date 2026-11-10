#!/usr/bin/env python3
"""Contact sheets of actual captured screenshots; no illustration edits."""
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parent/'proof'
for zoom in (1,2):
    for rotation in ('zero','plus060','minus060'):
        inputs=[ROOT/f'{mode}-zoom{zoom}-rot{rotation}.png' for mode in ('old','A','B')]
        frames=[Image.open(p).convert('RGB') for p in inputs]
        assert len({i.size for i in frames})==1, 'Screenshots must have matching dimensions'
        w,h=frames[0].size
        sheet=Image.new('RGB',(w*3,h),'#14282b')
        for index,frame in enumerate(frames):
            sheet.paste(frame,(index*w,0))
        output=ROOT/f'comparison-zoom{zoom}-rot{rotation}.png'
        sheet.save(output)
        print(output)
