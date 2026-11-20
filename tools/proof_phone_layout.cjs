// Serve the repository on port 8765 and run with Playwright (see browser-setup.md).
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const url = process.env.PHONE_PROOF_URL || 'http://127.0.0.1:8765/';
const sizes = [[320, 568], [390, 844], [640, 294], [568, 320], [667, 375], [844, 390], [915, 412], [1280, 588]];

async function checkPanel(page, selector) {
  const panel = await page.locator(selector).evaluate(element => {
    element.scrollTop = 0;
    const box = element.querySelector('.box').getBoundingClientRect();
    return { overflow: element.scrollWidth - element.clientWidth, left: box.left, top: box.top };
  });
  assert(panel.overflow <= 1 && panel.left >= 0 && panel.top >= 0, selector + ' ' + JSON.stringify(panel));
}

async function checkInventoryHeader(page) {
  const hidden = await page.locator('#inv .ihead button').evaluateAll(buttons => buttons.filter(button => {
    const { left, right, top, bottom } = button.getBoundingClientRect();
    const x = (left + right) / 2, y = (top + bottom) / 2;
    return !button.contains(document.elementFromPoint(x, y));
  }).map(button => button.textContent));
  assert.deepEqual(hidden, [], 'Inventory buttons must remain tappable');
}

async function checkHud(page) {
  const overlaps = await page.locator('#mini, #pause, #fsb, .cbtn').evaluateAll(elements => {
    const bounds = elements.map(element => ({ id: element.id, box: element.getBoundingClientRect() }));
    return bounds.flatMap(({ id, box }, index) => bounds.slice(index + 1).filter(({ box: other }) =>
      box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top
    ).map(other => [id, other.id]));
  });
  assert.deepEqual(overlaps, [], 'Combat controls and minimap must have separate hit areas');
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
  try {
    for (const [width, height] of sizes) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
      const page = await context.newPage();
      page.setDefaultTimeout(8000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        await page.addInitScript(() => { requestAnimationFrame = () => 0; });
        await page.route('https://fonts.googleapis.com/**', route => route.abort());
        await page.goto(url);
        await page.waitForFunction(() => typeof P !== 'undefined' && P, null, { polling: 100 });
        assert.deepEqual(await page.evaluate(() => [S.eco, S.fps, $('fps').hidden]), [true, false, true]);
        await checkPanel(page, '#intro');
        await page.tap('#intro .iskip');
        await page.evaluate(() => { S.fs = 0; });
        await page.tap('#go');
        assert.equal(await page.evaluate(() => state), 'play');
        await page.evaluate(() => {
          S.unlocked = 4;
          S.best[1] = WAVES;
          S.ln[0] = 1;
          S.bag = Array.from({ length: BAG }, () => makeItem(12, 2, 'w'));
          S.bag[BAG - 1].testTag = 'last';
          document.body.classList.add('inrun');
          $('mini').hidden = false;
          hud();
          $('fsb').hidden = false;
        });
        await checkHud(page);
        await page.tap('#pause');
        await checkPanel(page, '#inv');
        await checkInventoryHeader(page);
        await page.locator('#inv .ibag button.cell').last().tap();
        const comparisonVisible = await page.locator('#inv .csel .chead').evaluate(element => {
          const { top, bottom } = element.getBoundingClientRect();
          const headerBottom = document.querySelector('#inv .ihead').getBoundingClientRect().bottom;
          const tabs = document.querySelector('#inv .tabs');
          const end = getComputedStyle(tabs).position === 'fixed' ? tabs.getBoundingClientRect().top : innerHeight;
          return top >= headerBottom && bottom <= end;
        });
        assert(comparisonVisible, 'Touch selection must reveal the comparison');
        await page.tap('#inv [data-a="equip"]');
        assert.equal(await page.evaluate(() => S.eq.w.testTag), 'last');
        await page.locator('#inv .stab').evaluate(element => element.scrollIntoView({ block: 'end' }));
        await checkInventoryHeader(page);
        for (const tab of ['map', 'segen', 'jobs', 'kodex']) {
          await page.tap('#inv [data-t="' + tab + '"]');
          assert.equal(await page.locator('#inv').evaluate(element => element.scrollTop), 0);
          await checkPanel(page, '#inv');
        }
        await page.tap('#inv [data-a="opts"]');
        await checkPanel(page, '#optv');
        assert.equal(await page.locator('[data-o="eco"]').getAttribute('aria-checked'), 'true');
        assert.equal(await page.locator('[data-o="fps"]').getAttribute('aria-checked'), 'false');
        if (width === 390) {
          await page.tap('[data-o="eco"]');
          await page.tap('[data-o="fps"]');
        }
        await page.tap('#optv [data-o="close"]');
        await page.tap('#inv [data-a="close"]');

        await page.evaluate(() => {
          npc = { offers: [{ it: makeItem(24, 2, 'w'), price: 24 }] };
          openTrade();
        });
        await checkPanel(page, '#trade');
        await page.tap('#trade [data-tc]');
        await page.evaluate(() => {
          drops = [{ x: P.x, y: P.y, item: makeItem(24, 2, 'w') }];
          warnLootExit('run');
        });
        await checkPanel(page, '#lootwarn');
        await page.tap('#lootfind');
        await page.evaluate(() => offerPerks(true));
        await checkPanel(page, '#perk');
        await page.locator('#perk .pcard').last().tap();
        await page.evaluate(() => { showEnd(false); });
        await checkPanel(page, '#end');
        await page.evaluate(() => {
          $('end').hidden = true;
          S.dist = 3;
          renderMenu();
          $('menu').hidden = false;
        });
        await checkPanel(page, '#menu');
        await page.evaluate(() => { $('menu').hidden = true; openStn('imbiss'); });
        await checkPanel(page, '#stw');
        if (width === 390) {
          await page.reload();
          await page.waitForFunction(() => typeof P !== 'undefined' && P, null, { polling: 100 });
          assert.deepEqual(await page.evaluate(() => [S.eco, Boolean(S.fps)]), [false, true]);
        }
        assert.deepEqual(errors, []);
        console.log(width + '×' + height + ' passed');
      } catch (error) {
        throw new Error(width + '×' + height + ' ' + error.message, { cause: error });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
