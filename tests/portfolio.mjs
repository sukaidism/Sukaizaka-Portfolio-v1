import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
async function openGallery() {
  await page.evaluate(() => {
    const section = document.querySelector('.projects');
    const pin = document.querySelector('.projects-pin');
    window.scrollTo({top: scrollY + section.getBoundingClientRect().top - document.querySelector('.site-header').offsetHeight + (section.offsetHeight - pin.offsetHeight) * .85, behavior:'instant'});
  });
  await page.waitForFunction(() => !document.querySelector('.carousel').inert);
}
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded' });
  await page.locator('.hero-splash').waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.querySelector('.hero').dataset.intro === 'playing');
  assert.ok(await page.locator('.hero-portrait').evaluate(el => el.getAnimations().length > 0), 'Hero entrance should animate');
  await page.waitForFunction(() => document.querySelector('.hero').dataset.intro === 'complete');
  assert.equal(await page.locator('.hero-splash').count(), 0, 'Splash must finish and be removed');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(img => { img.loading='eager'; return img.decode().catch(() => {}); }));
  });
  assert.equal(await page.locator('.site-header').evaluate(el => getComputedStyle(el).position), 'fixed');
  assert.match(await page.locator('#contact-title').evaluate(el => getComputedStyle(el).fontFamily), /Nowduke/);
  assert.deepEqual(await page.locator('.skill-grid-languages .skill-content span').allTextContents(), ['JavaScript','PHP','Python']);
  assert.deepEqual(await page.locator('.skill-grid-tools .skill-content span').allTextContents(), ['AWS Management Console','Git','Laravel','Figma','Cisco Networking','Playwright']);
  await page.locator('#navigation a[href="#projects"]').click();
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('.site-header').evaluate(el => Math.round(el.getBoundingClientRect().top)), 0, 'Header stays at the top after scrolling');
  const projectTop = await page.locator('#projects-title').evaluate(el => el.getBoundingClientRect().top);
  assert.ok(projectTop > 72 && projectTop < 600, 'Projects intro is centered below the header');
  assert.equal(await page.locator('#navigation a[href="#projects"]').getAttribute('aria-current'), 'page');
  assert.equal(await page.locator('.carousel').evaluate(el => getComputedStyle(el).opacity), '0', 'Title appears before the gallery');
  await page.locator('.project-enter').click();
  await page.waitForFunction(() => !document.querySelector('.carousel').inert);
  await page.waitForTimeout(600);
  assert.equal(await page.locator('.carousel').evaluate(el => getComputedStyle(el).opacity), '1');
  // Visit each reveal target before taking the full-page visual reference.
  for (const target of await page.locator('.reveal').all()) {
    await target.evaluate(el => el.scrollIntoView({block:'center',behavior:'instant'}));
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  assert.equal(await page.locator('h1').textContent(), 'PORTFOLIO');
  const name = page.locator('#project-name');
  await openGallery();
  await page.locator('#next-project').click();
  assert.equal(await name.textContent(), 'PICKERKARMA');
  assert.ok(await page.locator('.pickerkarma').evaluate(el => el.getAnimations().length > 0), 'Next click should animate');
  await page.waitForTimeout(800);
  await page.locator('.carousel').screenshot({ path: 'test-results/pickerkarma.png' });
  await page.locator('#next-project').click();
  assert.equal(await name.textContent(), 'SOLE');
  await page.waitForTimeout(800);
  await page.locator('.carousel').screenshot({ path: 'test-results/sole.png' });
  await page.locator('#next-project').click();
  assert.equal(await name.textContent(), 'FINSTER', 'Next should wrap');
  await page.locator('#previous-project').click();
  assert.equal(await name.textContent(), 'SOLE', 'Previous should wrap');
  await page.locator('.carousel').focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await name.textContent(), 'PICKERKARMA');
  await page.keyboard.press('Home');
  assert.equal(await name.textContent(), 'FINSTER');
  await page.keyboard.press('End');
  assert.equal(await name.textContent(), 'SOLE');
  await page.locator('[data-slide="0"]').click();
  assert.equal(await name.textContent(), 'FINSTER');
  for (let i=0;i<8;i++) await page.locator('#next-project').click();
  assert.equal(await name.textContent(), 'SOLE', 'Rapid navigation should preserve the current index');
  await page.waitForTimeout(800);
  assert.equal(await page.locator('.project-slide:not([inert])').count(), 1);
  assert.equal(await page.locator('.project-slide').evaluateAll(slides => slides.filter(el => getComputedStyle(el).visibility === 'visible').length), 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#next-project').click();
  assert.equal(await page.locator('.finster').evaluate(el => el.getAnimations().length), 0);
  assert.equal(await page.locator('.skill-card').evaluateAll(cards => cards.every(el => getComputedStyle(el).animationName === 'none')), true);
  assert.equal(await page.locator('.reveal').evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === '1')), true);
  assert.equal(await page.locator('.skill-card').count(), 9, 'All skills appear once');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openGallery();
  for (const width of [320,390,768,1280,1600,1920,2560]) {
    await page.setViewportSize({width,height:900});
    await page.waitForTimeout(100);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width}px`);
    assert.ok(await page.locator('main').evaluate(el => Math.abs(el.getBoundingClientRect().width - document.documentElement.clientWidth) < 1), `Full page width at ${width}px`);
    const positions = await page.evaluate(() => {
      const stage = document.querySelector('.carousel-stage').getBoundingClientRect();
      const left = document.querySelector('#previous-project').getBoundingClientRect();
      const right = document.querySelector('#next-project').getBoundingClientRect();
      return {leftGap:left.left-stage.left,rightGap:stage.right-right.right,top:left.top-stage.top,bottom:stage.bottom-left.bottom};
    });
    assert.ok(positions.leftGap <= 12 && positions.rightGap <= 12 && positions.top > 0 && positions.bottom > 0, `Arrows flank artwork at ${width}px`);
    if (width === 1920) {
      await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
      await page.waitForTimeout(100);
      await page.screenshot({path:'test-results/wide-hero.png'});
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('a.wordmark').click();
  await page.waitForTimeout(600);
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.locator('#navigation a[href="#contact"]').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('.connect-button').getAttribute('href'), 'mailto:hello@example.com');
  await page.screenshot({path:'test-results/mobile.png',fullPage:true});
  for (const [index,label] of [[0,'finster'],[1,'pickerkarma'],[2,'sole']]) {
    await openGallery();
    await page.locator(`[data-slide="${index}"]`).click();
    await page.waitForTimeout(800);
    await page.locator('.carousel').screenshot({path:`test-results/mobile-${label}.png`});
  }
  await page.locator('.carousel-viewport').dispatchEvent('pointerdown',{pointerType:'touch',clientX:300,clientY:200});
  await page.locator('.carousel-viewport').dispatchEvent('pointerup',{pointerType:'touch',clientX:100,clientY:205});
  assert.equal(await name.textContent(), 'FINSTER', 'Swipe should wrap to next project');
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(img => { img.loading='eager'; return img.decode().catch(() => {}); }));
  });
  const broken = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src));
  assert.deepEqual(broken, [], 'All local assets should load');
  assert.deepEqual(errors, [], 'No browser errors');
  const reducedPage = await browser.newPage({reducedMotion:'reduce'});
  await reducedPage.goto('http://127.0.0.1:5173', {waitUntil:'networkidle'});
  assert.equal(await reducedPage.locator('.hero-splash').count(), 0, 'Reduced-motion visitors skip splash');
  assert.equal(await reducedPage.locator('.hero-portrait').evaluate(el => el.getAnimations().length), 0);
  await reducedPage.close();
  console.log('Passed: hero splash, scroll reveals, fixed navigation, anchor offsets, grouped skills, contact font, side arrows, full width at 7 sizes, carousel animation/wraparound/keyboard/rapid clicks/swipes, reduced motion, mobile navigation, and assets.');
} finally { await browser.close(); }
