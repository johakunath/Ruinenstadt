"""Pipeline regression checks: python3 -m unittest discover -s tools -p 'test_*.py'."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np
from PIL import Image, ImageDraw

import sprites


class SpritesTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.raw = self.root / 'assets/raw/codex/test'
        self.raw.mkdir(parents=True)
        self.recipe = self.raw / 'picks.json'
        im = Image.new('RGBA', (80, 100), '#ff00ff')
        d = ImageDraw.Draw(im)
        d.rectangle((20, 20, 59, 89), fill='#0044cc')
        # Enclosed matching colour is artwork, not connected background.
        d.rectangle((30, 30, 35, 35), fill='#ff00ff')
        im.save(self.raw / 'source.png')
        self.spec = {'source': 'source.png', 'height': 40, 'anchor': [40, 88],
                     'background': [255, 0, 255], 'crop': [10, 10, 70, 95],
                     'pivots': {'head': [40, 30]}, 'for': 'fixture', 'footprint': [10, 8]}

    def build_fixture(self):
        self.recipe.write_text(json.dumps({'enemies/test': self.spec}))
        with patch.object(sprites, 'ROOT', self.root), patch.object(sprites, 'RAW', self.raw.parent), \
                patch.object(sprites, 'MANIFEST', self.root / 'assets/manifest.json'):
            return sprites.build()

    def test_crop_scale_anchor_and_enclosed_colour(self):
        im, entry = sprites.normalise('enemies/test', self.spec, self.recipe)
        self.assertEqual(im.height, 122)
        self.assertAlmostEqual(entry['anchor'][0], 20 * (im.width - 2) / 40 + 1, places=3)
        self.assertAlmostEqual(entry['anchor'][1], 68 * 120 / 70 + 1, places=3)
        self.assertEqual(entry['units'], 3)
        self.assertEqual(entry['footprint'], [10, 8])
        self.assertGreater(entry['anchor'][1], entry['pivots']['head'][1])
        self.assertEqual(im.getpixel((0, 0))[3], 0)
        self.assertEqual(im.getpixel((22, 22))[3], 255)

    def test_existing_alpha_preserved(self):
        im = Image.new('RGBA', (20, 30))
        ImageDraw.Draw(im).rectangle((5, 5, 14, 24), fill=(30, 80, 90, 128))
        im.save(self.raw / 'alpha.png')
        spec = {'source': 'alpha.png', 'height': 20, 'for': 'fixture'}
        out, _ = sprites.normalise('props/test', spec, self.recipe)
        self.assertLessEqual(np.asarray(out)[:, :, 3].max(), 150)

    def test_deterministic_and_preserves_unrelated_entries(self):
        manifest = self.build_fixture()
        paths = [self.root / 'assets/manifest.json', self.root / 'assets/enemies/test.webp']
        hashes = [hashlib.sha256(p.read_bytes()).hexdigest() for p in paths]
        self.assertEqual(sprites.check(manifest, self.root), [])
        self.build_fixture()
        self.assertEqual(hashes, [hashlib.sha256(p.read_bytes()).hexdigest() for p in paths])
        manifest['props/old'] = manifest['enemies/test']
        paths[0].write_text(json.dumps(manifest))
        self.assertIn('props/old', self.build_fixture())

    def test_checker_rejects_missing_and_mismatched_files(self):
        manifest = self.build_fixture()
        manifest['enemies/test']['w'] += 1
        self.assertTrue(any('size' in e for e in sprites.check(manifest, self.root)))
        (self.root / 'assets/enemies/test.webp').unlink()
        self.assertTrue(any('missing file' in e for e in sprites.check(manifest, self.root)))

    def test_checker_rejects_bad_anchor_opaque_and_large_file(self):
        manifest = self.build_fixture()
        entry = manifest['enemies/test']
        entry['anchor'] = [-1, 0]
        im = Image.new('RGB', (entry['w'], entry['h']), 'white')
        im.save(self.root / 'assets/enemies/test.webp', 'WEBP')
        errors = sprites.check(manifest, self.root)
        self.assertTrue(any('anchor' in e for e in errors))
        self.assertTrue(any('transparency' in e for e in errors))
        with (self.root / 'assets/enemies/test.webp').open('ab') as f:
            f.write(b'\0' * sprites.LIMIT)
        self.assertTrue(any('400 KB' in e for e in sprites.check(manifest, self.root)))

    def test_invalid_inputs_and_duplicates(self):
        for spec in [dict(self.spec, height=0), dict(self.spec, source='../outside.png'),
                     dict(self.spec, anchor=[999, 999]), dict(self.spec, crop=[0, 0, 999, 999])]:
            with self.assertRaises(ValueError):
                sprites.normalise('enemies/test', spec, self.recipe)
        with self.assertRaises(ValueError):
            sprites.normalise('../outside', self.spec, self.recipe)
        self.recipe.write_text('{"same": {}, "same": {}}')
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            sprites.read_object(self.recipe)


if __name__ == '__main__':
    unittest.main()
