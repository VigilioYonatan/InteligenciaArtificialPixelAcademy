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

  // 5. Verify Senior Overview + ALL 36 Curriculum Lessons (B01..B12, I01..I12, A01..A12)
  await page.goto(`${baseUrl}#/senior`, { waitUntil: 'networkidle0' });
  assert.ok(await page.$('.cinema-poster'), 'Expected AxonPlayer poster on #/senior');

  const lessonIds = [
    ...Array.from({ length: 12 }, (_, i) => `B${String(i + 1).padStart(2, '0')}`),
    ...Array.from({ length: 12 }, (_, i) => `I${String(i + 1).padStart(2, '0')}`),
    ...Array.from({ length: 12 }, (_, i) => `A${String(i + 1).padStart(2, '0')}`),
  ];
  const captureLessons = new Map([
    ['I02', '08-lesson-i02.png'],
    ['A06', '09-lesson-a06.png'],
    ['A12', '10-lesson-a12.png'],
  ]);
  for (const lid of lessonIds) {
    await page.goto(`${baseUrl}#/lesson/${lid}`, { waitUntil: 'networkidle0' });
    const hasCinema = await page.$('.cinema-poster');
    assert.ok(hasCinema, `Expected AxonPlayer poster on #/lesson/${lid}`);
    const snap = captureLessons.get(lid);
    if (snap) {
      await page.click('.cinema-poster');
      await page.waitForSelector('button[aria-label="Pausar video"]');
      const el = await page.$('.axon-cinema');
      await el.screenshot({ path: `${outDir}/${snap}` });
    }
  }

  // 6. Verify AI Academy Fase-3 full track (AI01..AI18) + F01 unit sub-pages (2, 3)
  const aiIds = Array.from({ length: 18 }, (_, i) => `AI${String(i + 1).padStart(2, '0')}`);
  const captureAi = new Map([
    ['AI03', '11-ai-ai03.png'],
    ['AI05', '12-ai-ai05.png'],
    ['AI06', '13-ai-ai06.png'],
    ['AI09', '14-ai-ai09.png'],
    ['AI11', '15-ai-ai11.png'],
    ['AI15', '16-ai-ai15.png'],
    ['AI18', '17-ai-ai18.png'],
  ]);
  for (const aid of aiIds) {
    await page.goto(`${baseUrl}#/ai/learn/${aid}`, { waitUntil: 'networkidle0' });
    const hasCinema = await page.waitForSelector('.cinema-poster', { timeout: 5000 });
    assert.ok(hasCinema, `Expected AxonPlayer poster on #/ai/learn/${aid}`);
    const snap = captureAi.get(aid);
    if (snap) {
      await page.click('.cinema-poster');
      await page.waitForSelector('button[aria-label="Pausar video"]');
      const el = await page.$('.axon-cinema');
      await el.screenshot({ path: `${outDir}/${snap}` });
    }
  }

  const fwUnits = [
    ...['F01', 'F02', 'F03', 'F04', 'F05'].flatMap((fw) =>
      [2, 3, 4, 5].map((u) => `#/frameworks/${fw}/${u}`),
    ),
    '#/frameworks/F06/2',
    '#/frameworks/F06/3',
  ];
  const captureFw = new Map([
    ['#/frameworks/F01/2', '18-fw-f01-2.png'],
    ['#/frameworks/F01/5', '19-fw-f01-5.png'],
    ['#/frameworks/F02/3', '20-fw-f02-3.png'],
    ['#/frameworks/F02/5', '21-fw-f02-5.png'],
    ['#/frameworks/F03/5', '22-fw-f03-5.png'],
    ['#/frameworks/F04/5', '23-fw-f04-5.png'],
    ['#/frameworks/F05/2', '24-fw-f05-2.png'],
    ['#/frameworks/F05/5', '25-fw-f05-5.png'],
    ['#/frameworks/F06/3', '26-fw-f06-3.png'],
  ]);
  for (const unitRoute of fwUnits) {
    await page.goto(`${baseUrl}${unitRoute}`, { waitUntil: 'networkidle0' });
    const hasCinema = await page.waitForSelector('.cinema-poster', { timeout: 5000 });
    assert.ok(hasCinema, `Expected AxonPlayer poster on ${unitRoute}`);
    const snap = captureFw.get(unitRoute);
    if (snap) {
      await page.click('.cinema-poster');
      await page.waitForSelector('button[aria-label="Pausar video"]');
      const el = await page.$('.axon-cinema');
      await el.screenshot({ path: `${outDir}/${snap}` });
    }
  }

  // 7. Mobile 390x844 zero horizontal overflow check (#/games/arena3d, #/lesson/A06, #/ai/learn/AI18, #/frameworks/F06/3)
  await page.setViewport({ width: 390, height: 844 });
  for (const route of ['#/games/arena3d', '#/lesson/A06', '#/ai/learn/AI18', '#/frameworks/F06/3']) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.cinema-poster', { timeout: 5000 });
    await page.click('.cinema-poster');
    await new Promise((r) => setTimeout(r, 250));
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    assert.ok(
      overflow.scrollW <= overflow.clientW + 1,
      `Horizontal overflow detected on 390x844 (${route}): scrollWidth=${overflow.scrollW} > clientWidth=${overflow.clientW}`,
    );
  }

  console.log('✓ CINEMA E2E (ALL 105 VIDEOS + MOBILE 390x844 ZERO OVERFLOW) PASSED');
} finally {
  await browser.close();
}
