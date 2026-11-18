#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const baseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:4183/';
const outDir =
  process.env.CINEMA_QA_DIR ||
  'C:/Users/Admin/.gemini/antigravity/brain/8bc684fa-2828-4a45-b7db-3c9d58c2337c/scratch/cinema-qa';
fs.mkdirSync(outDir, { recursive: true });

function findBrowser() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No Chromium browser found for Cinema E2E');
}

const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  headless: 'new',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();

  // 1. Desktop (1440x960): Home Poster -> Play -> Scene 2 Jump
  await page.setViewport({ width: 1440, height: 960 });
  await page.goto(`${baseUrl}#/`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.cinema-poster');
  await page.click('.cinema-poster');
  await page.waitForSelector('button[aria-label="Pausar video"]');
  const dotBtns = await page.$$('.cinema-dot-btn');
  assert.equal(dotBtns.length, 4, 'Expected 4 chapter pills in Home Intro');
  await dotBtns[1].click();

  // 2. Arena 3D intro cinema + Three.js arena
  await page.goto(`${baseUrl}#/games/arena3d`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.cinema-poster');
  await page.click('.cinema-poster');
  await page.waitForSelector('button[aria-label="Pausar video"]');
  const arenaEl = await page.$('.axon-cinema');
  await arenaEl.screenshot({ path: `${outDir}/05-arena3d-cinema.png` });

  // 3. Verify all 18 Senior briefings (S01..S18) + play S18
  for (let i = 1; i <= 18; i += 1) {
    const id = `S${String(i).padStart(2, '0')}`;
    await page.goto(`${baseUrl}#/senior/${id}`, { waitUntil: 'networkidle0' });
    const poster = await page.$('.cinema-poster');
    assert.ok(poster, `Expected AxonPlayer poster on #/senior/${id}`);
  }
  await page.click('.cinema-poster');
  await page.waitForSelector('button[aria-label="Pausar video"]');
  const s18El = await page.$('.axon-cinema');
  await s18El.screenshot({ path: `${outDir}/06-senior-s18.png` });

  // 4. Verify all 8 Framework briefings (F01..F08) + play F08
  for (let i = 1; i <= 8; i += 1) {
    const id = `F0${i}`;
    await page.goto(`${baseUrl}#/frameworks/${id}`, { waitUntil: 'networkidle0' });
    const poster = await page.$('.cinema-poster');
    assert.ok(poster, `Expected AxonPlayer poster on #/frameworks/${id}`);
  }
  await page.click('.cinema-poster');
  await page.waitForSelector('button[aria-label="Pausar video"]');
  const f08El = await page.$('.axon-cinema');
  await f08El.screenshot({ path: `${outDir}/07-framework-f08.png` });

  // 5. Senior Overview & Lesson B01 presence check
  for (const route of ['#/senior', '#/lesson/B01']) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' });
    const hasCinema = await page.$('.cinema-poster');
    assert.ok(hasCinema, `Expected AxonPlayer poster on ${route}`);
  }

  // 6. Mobile 390x844 zero horizontal overflow check (playing state on #/games/arena3d)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${baseUrl}#/games/arena3d`, { waitUntil: 'networkidle0' });
  await page.click('.cinema-poster');
  await new Promise((r) => setTimeout(r, 250));
  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  assert.ok(
    overflow.scrollW <= overflow.clientW + 1,
    `Horizontal overflow detected on 390x844: scrollWidth=${overflow.scrollW} > clientWidth=${overflow.clientW}`,
  );

  console.log('✓ CINEMA E2E (ALL 30 BATCH-1 VIDEOS + MOBILE 390x844 ZERO OVERFLOW) PASSED');
} finally {
  await browser.close();
}
