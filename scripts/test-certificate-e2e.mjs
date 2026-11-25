#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const baseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:4195/';
const outDir =
  process.env.CERT_QA_DIR ||
  'C:/Users/Admin/.gemini/antigravity/brain/8bc684fa-2828-4a45-b7db-3c9d58c2337c/scratch/cert-qa';
const downloadDir = path.join(outDir, 'downloads');
fs.mkdirSync(downloadDir, { recursive: true });

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
  throw new Error('No Chromium browser found for Certificate E2E');
}

const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  headless: 'new',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();
  await cdp.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir,
  });

  // 1. Desktop Dark Mode (<100% preview)
  await page.setViewport({ width: 1440, height: 960 });
  await page.goto(`${baseUrl}#/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('.cert-section');

  const previewCheck = await page.evaluate(() => {
    const nameEl = document.querySelector('[data-testid="cert-holder-name"]');
    const antiCount = document.querySelectorAll('.cert-anti-capture').length;
    const patternCount = document.querySelectorAll('.cert-diploma-card pattern').length;
    const downloadBtn = document.querySelector('.cert-actions button');
    const svgsWithoutHidden = Array.from(document.querySelectorAll('.cert-diploma-card svg')).filter(
      (el) => el.getAttribute('aria-hidden') !== 'true',
    ).length;
    return {
      name: nameEl?.textContent?.trim(),
      antiCount,
      patternCount,
      disabled: downloadBtn?.hasAttribute('disabled'),
      svgsWithoutHidden,
    };
  });
  assert.equal(previewCheck.name, 'John Doe');
  assert.equal(previewCheck.antiCount, 1);
  assert.equal(previewCheck.patternCount, 0);
  assert.equal(previewCheck.disabled, true);
  assert.equal(previewCheck.svgsWithoutHidden, 0);

  const certEl = await page.$('.cert-section');
  await certEl.screenshot({ path: path.join(outDir, 'cert-dark-preview.png') });

  // 2. Switch specialty route to RAG & verify live input + watermark switch + Light Mode
  const ragTab = await page.evaluateHandle(() =>
    Array.from(document.querySelectorAll('.cert-track-tab')).find((el) =>
      el.textContent?.includes('RAG & pgvector'),
    ),
  );
  await ragTab.asElement().click();
  await page.type('#certificate-name-input', 'Elena Vance');
  await page.click('button.circle-action');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'light');
  const lightCheck = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute('data-theme'),
    track: document.querySelector('.cert-diploma-card')?.getAttribute('data-cert-track'),
    folio: document.querySelector('[data-testid="cert-folio"]')?.textContent?.trim(),
    holder: document.querySelector('[data-testid="cert-holder-name"]')?.textContent?.trim(),
  }));
  assert.equal(lightCheck.theme, 'light');
  assert.equal(lightCheck.track, 'rag');
  assert.equal(lightCheck.holder, 'Elena Vance');
  assert.ok(lightCheck.folio?.includes('PREVIEW-RAG-0240'));
  await certEl.screenshot({ path: path.join(outDir, 'cert-light-preview.png') });

  // 3. Mobile 320x640 responsive check (scrollWidth <= innerWidth)
  await page.setViewport({ width: 320, height: 640 });
  await page.click('button.circle-action');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark');
  const mobileOverflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  assert.ok(
    mobileOverflow.scrollWidth <= mobileOverflow.innerWidth,
    `320x640 overflow: ${mobileOverflow.scrollWidth} > ${mobileOverflow.innerWidth}`,
  );
  const mobileCert = await page.$('.cert-section');
  await mobileCert.screenshot({ path: path.join(outDir, 'cert-mobile-320.png') });

  // 4. Unlock 100% in Core track and test real native PDF export
  await page.setViewport({ width: 1440, height: 960 });
  await page.evaluate(() => {
    const done = [
      ...Array.from({ length: 12 }, (_, i) => `B${String(i + 1).padStart(2, '0')}`),
      ...Array.from({ length: 12 }, (_, i) => `I${String(i + 1).padStart(2, '0')}`),
    ];
    const current = JSON.parse(localStorage.getItem('aipixel:v1') || '{}');
    const target = current && typeof current.prefs === 'object' ? current : { version: 3, prefs: {} };
    target.prefs.completed = done;
    target.prefs.certificateTrack = 'core';
    target.prefs.certificateName = 'Yonatan Vigilio';
    localStorage.setItem('aipixel:v1', JSON.stringify(target));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-cert-unlocked="true"]');

  const unlockedCheck = await page.evaluate(() => ({
    antiCount: document.querySelectorAll('.cert-anti-capture').length,
    badge: document.querySelector('.cert-status-pill')?.textContent?.trim(),
    folio: document.querySelector('[data-testid="cert-folio"]')?.textContent?.trim(),
    buttons: Array.from(document.querySelectorAll('.cert-actions button')).map((b) => ({
      text: b.textContent?.trim(),
      disabled: b.hasAttribute('disabled'),
    })),
  }));
  assert.equal(unlockedCheck.antiCount, 0);
  assert.equal(unlockedCheck.badge, 'VERIFICADO 100%');
  assert.match(unlockedCheck.folio || '', /^FOLIO CEA-CORE-[0-9A-F]{4}-[0-9A-F]{4}$/);
  assert.ok(unlockedCheck.buttons.some((b) => b.text?.includes('Descargar certificado PDF') && !b.disabled));
  assert.ok(unlockedCheck.buttons.some((b) => b.text?.includes('Imprimir PDF') && !b.disabled));

  const unlockedEl = await page.$('.cert-section');
  await unlockedEl.screenshot({ path: path.join(outDir, 'cert-unlocked-100.png') });

  // Click download button and inspect real generated .pdf file bytes
  for (const old of fs.readdirSync(downloadDir)) fs.rmSync(path.join(downloadDir, old));
  const dlHandle = await page.evaluateHandle(() =>
    Array.from(document.querySelectorAll('.cert-actions button')).find((b) =>
      b.textContent?.includes('Descargar certificado PDF'),
    ),
  );
  await dlHandle.asElement().click();

  let downloadedFile = null;
  for (let i = 0; i < 40; i += 1) {
    const files = fs.readdirSync(downloadDir).filter((f) => f.endsWith('.pdf'));
    if (files.length > 0) {
      downloadedFile = path.join(downloadDir, files[0]);
      break;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  assert.ok(downloadedFile, 'Expected downloaded PDF file on disk');
  const bytes = fs.readFileSync(downloadedFile);
  assert.equal(bytes.slice(0, 8).toString('ascii'), '%PDF-1.4');
  assert.ok(bytes.toString('latin1').includes('/MediaBox [0 0 841.89 595.28]'));
  assert.ok(bytes.length > 15000, `Expected substantial HD canvas PDF (>15KB), got ${bytes.length}`);

  console.log(
    `PASS certificate E2E: preview=John Doe, rag=OK, mobile=320x640(scroll=${mobileOverflow.scrollWidth}), unlocked=${unlockedCheck.folio}, pdf=${path.basename(downloadedFile)} (${bytes.length} bytes)`,
  );
} finally {
  await browser.close();
}
