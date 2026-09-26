import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
await mkdir('test-results', {recursive:true});
const browser = await chromium.launch({channel:'msedge',headless:true});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
try {
  await page.goto('http://127.0.0.1:5173');
  await page.waitForFunction(() => document.querySelector('.hero').dataset.intro === 'complete');
  await page.evaluate(async () => { await Promise.all([...document.images].map(img => {img.loading='eager';return img.decode().catch(()=>{});})); });
  for (const [width,height] of [[1920,960],[1280,720],[768,1024],[390,844],[320,568]]) {
    await page.setViewportSize({width,height});
    await page.waitForTimeout(150);
    for (const id of ['home','about','skills','contact']) {
      await page.locator(`#${id}`).evaluate(el => el.scrollIntoView({block:'start',behavior:'instant'}));
      await page.waitForTimeout(950);
      const geometry = await page.locator(`#${id}`).evaluate(el => {
        const box = el.getBoundingClientRect();
        const header = document.querySelector('.site-header').offsetHeight;
        return {height:box.height, available:innerHeight - (el.id === 'home' ? 0 : header),overflow:document.documentElement.scrollWidth > innerWidth};
      });
      assert.ok(!geometry.overflow, `No horizontal overflow: ${id} ${width}`);
      assert.ok(geometry.height <= geometry.available + 2, `Section ${id} fits ${width}x${height}: ${JSON.stringify(geometry)}`);
      if (width === 1920 || width === 390) await page.screenshot({path:`test-results/${id}-${width}.png`});
    }
    for (const progress of [0,.4,.85]) {
      await page.evaluate(p => {
        const section = document.querySelector('.projects');
        const pin = document.querySelector('.projects-pin');
        window.scrollTo({top:scrollY+section.getBoundingClientRect().top-document.querySelector('.site-header').offsetHeight+(section.offsetHeight-pin.offsetHeight)*p,behavior:'instant'});
      }, progress);
      await page.waitForTimeout(200);
      const state = await page.evaluate(() => ({
        titleOpacity:+getComputedStyle(document.querySelector('#projects-title')).opacity,
        titleScale:+getComputedStyle(document.querySelector('#projects-title')).scale,
        galleryOpacity:+getComputedStyle(document.querySelector('.carousel')).opacity,
        pinTop:document.querySelector('.projects-pin').getBoundingClientRect().top,
        header:document.querySelector('.site-header').offsetHeight,
        bottom:document.querySelector('.carousel').getBoundingClientRect().bottom,
      }));
      assert.ok(Math.abs(state.pinTop-state.header) < 2, `Projects stay pinned at ${width}`);
      if (progress === 0) assert.ok(state.titleOpacity > .99 && state.galleryOpacity < .01, 'Title-only initial state');
      if (progress === .4) assert.ok(state.titleScale < .8 && state.titleOpacity < .9, 'Scroll shrinks and fades title');
      if (progress === .85) assert.ok(state.titleOpacity < .01 && state.galleryOpacity > .99 && state.bottom <= height + 2, 'Entire carousel is revealed inside viewport');
      if (width === 1920 || width === 390) await page.screenshot({path:`test-results/projects-${width}-${progress}.png`});
    }
    for (let slide = 0; slide < 3; slide++) {
      await page.locator(`[data-slide="${slide}"]`).click();
      await page.waitForTimeout(800);
      const fits = await page.locator('.project-slide:not([inert]) .project-copy').evaluate(el => {
        const copy = el.getBoundingClientRect();
        const stage = document.querySelector('.carousel-stage').getBoundingClientRect();
        return copy.top >= stage.top - 1 && copy.bottom <= stage.bottom + 1;
      });
      assert.ok(fits, `Project ${slide + 1} copy fits ${width}x${height}`);
    }
  }
  assert.deepEqual(errors, []);
  console.log('Passed: all sections fit 5 viewport sizes; Projects pins, shrinks its title, reveals its gallery, and keeps controls inside the viewport.');
} finally {await browser.close();}
