import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
try {
  await page.goto('http://localhost:5173');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => {
      image.loading = 'eager';
      return image.decode().catch(() => {});
    }));
  });
  for (const [width, height] of [[1920,960], [2560,1080], [1220,620], [901,620], [768,1024], [650,620], [589,936], [390,844], [320,568]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => {
      const section = document.querySelector('.projects');
      const pin = document.querySelector('.projects-pin');
      scrollTo({ top: scrollY + section.getBoundingClientRect().top - document.querySelector('.site-header').offsetHeight + (section.offsetHeight - pin.offsetHeight) * .85, behavior: 'instant' });
    });
    await page.waitForFunction(() => !document.querySelector('.carousel').inert);
    for (const [name, slide] of [['finster', 0], ['sole', 2]]) {
      await page.locator(`[data-slide="${slide}"]`).click();
      await page.waitForTimeout(800);
      const geometry = await page.locator(`.${name}`).evaluate(el => {
        const rect = node => {
          const {left, right, top, bottom, width, height} = node.getBoundingClientRect();
          return {left, right, top, bottom, width, height};
        };
        return {
          stage: rect(el), scene: rect(el.querySelector('.slide-scene')),
          copy: rect(el.querySelector('.project-copy')),
          phones: [...el.querySelectorAll('.phone')].map(rect),
          banks: [...el.querySelectorAll('.sole-phone-bank')].map(rect),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert.ok(!geometry.overflow, `${name}: no page overflow at ${width}`);
      assert.ok(Math.abs(geometry.scene.width - width) < 2, `${name}: artwork fills width at ${width}`);
      assert.ok(geometry.copy.top >= geometry.stage.top && geometry.copy.bottom <= geometry.stage.bottom, `${name}: readable copy fits at ${width}`);
      if (name === 'finster' && width > 900) {
        for (const phone of geometry.phones) {
          assert.ok(phone.left >= geometry.copy.right, `Finster phones clear text at ${width}`);
          assert.ok(phone.left < geometry.stage.right && phone.bottom > geometry.stage.top && phone.top < geometry.stage.bottom, `Every Finster screen is represented at ${width}`);
        }
        const artworkLeft = Math.min(...geometry.phones.map(phone => phone.left));
        const artworkRight = Math.max(...geometry.phones.map(phone => phone.right));
        const artworkTop = Math.min(...geometry.phones.map(phone => phone.top));
        const artworkBottom = Math.max(...geometry.phones.map(phone => phone.bottom));
        assert.ok(artworkRight >= geometry.stage.right - 24, `Finster artwork reaches the right edge at ${width}`);
        assert.ok(geometry.stage.right - artworkLeft >= width * .48, `Finster artwork fills the right half at ${width}`);
        assert.ok(artworkTop <= geometry.stage.top + 24 && artworkBottom >= geometry.stage.bottom - 24, `Finster artwork fills the stage height at ${width}`);
      } else if (name === 'finster') {
        assert.ok(geometry.phones.every(phone => Math.abs(phone.top - geometry.phones[0].top) < 1), `Finster row is aligned at ${width}`);
        assert.ok(geometry.phones[0].top > geometry.copy.bottom, `Finster row is below copy at ${width}`);
      } else if (width <= 900) {
        assert.ok(geometry.banks[0].bottom <= geometry.copy.top && geometry.banks[1].top >= geometry.copy.bottom, `Sole rows surround copy at ${width}`);
        assert.ok(geometry.banks.every(bank => bank.height >= 50), `Sole rows remain visible at ${width}`);
      } else {
        assert.ok(Math.min(...geometry.phones.map(phone => phone.left)) < width * .03, `Sole artwork reaches left edge at ${width}`);
        assert.ok(Math.max(...geometry.phones.map(phone => phone.right)) > width * .97, `Sole artwork reaches right edge at ${width}`);
      }
      await page.screenshot({ path: `test-results/${name}-responsive-${width}.png` });
    }
  }
  console.log('Passed on localhost:5173: responsive phone layouts, full-size desktop Finster composition, full-width Sole, and mobile phone rows at 9 viewport sizes.');
} finally {
  await browser.close();
}
