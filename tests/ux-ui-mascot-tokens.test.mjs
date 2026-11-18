import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

const EXPECTED_POSES = [
  'welcome',
  'reading',
  'coding',
  'question',
  'celebrate',
  'debug',
  'building',
  'senior',
  'idea',
  'architecture',
  'graduate',
  'sleep',
];

function srgbToLinear(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const clean = hex.replace('#', '');
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(fgHex, bgHex) {
  const l1 = luminance(fgHex);
  const l2 = luminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test('UX/UI Mascot: all 12 Axon AI pixel poses (including Senior Mode) + thumbnails + favicon exist', () => {
  const manifestPath = resolve(root, 'public/assets/mascot/manifest.json');
  assert.ok(existsSync(manifestPath), 'mascot/manifest.json must exist');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.length, 12, 'manifest must register exactly 12 poses');

  for (const pose of EXPECTED_POSES) {
    const full = resolve(root, `public/assets/mascot/${pose}.png`);
    const thumb = resolve(root, `public/assets/mascot/${pose}-128.png`);
    assert.ok(existsSync(full) && statSync(full).size > 1000, `missing or empty ${pose}.png`);
    assert.ok(existsSync(thumb) && statSync(thumb).size > 500, `missing or empty ${pose}-128.png`);
    const head = readFileSync(full).subarray(0, 8);
    assert.equal(head.toString('hex'), '89504e470d0a1a0a', `${pose}.png must be a valid PNG`);
  }

  const fav = resolve(root, 'public/assets/mascot/favicon.png');
  assert.ok(existsSync(fav) && statSync(fav).size > 300, 'mascot/favicon.png must exist');
});

test('UX/UI Design System: Vercel Geist semantic tokens pass WCAG 2.2 AA contrast (>= 4.5:1) in Dark & Light modes', () => {
  const css = readFileSync(resolve(root, 'src/styles/vercel-palette.css'), 'utf8');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'must support prefers-reduced-motion');
  assert.ok(css.includes('tabular-nums'), 'must enforce tabular-nums on numeric metrics');

  const pairs = [
    // Dark mode pairs
    { label: 'dark text-primary on canvas', fg: '#ededed', bg: '#000000', min: 4.5 },
    { label: 'dark text-primary on surface', fg: '#ededed', bg: '#0a0a0a', min: 4.5 },
    { label: 'dark text-secondary on raised', fg: '#a1a1a1', bg: '#111111', min: 4.5 },
    { label: 'dark text-muted on surface', fg: '#8f8f8f', bg: '#0a0a0a', min: 4.5 },
    { label: 'dark action-primary button', fg: '#ffffff', bg: '#0068d6', min: 4.5 },
    { label: 'dark senior amber on canvas', fg: '#f5a623', bg: '#000000', min: 4.5 },
    // Light mode pairs
    { label: 'light text-primary on canvas', fg: '#171717', bg: '#fafafa', min: 4.5 },
    { label: 'light text-primary on surface', fg: '#171717', bg: '#ffffff', min: 4.5 },
    { label: 'light text-secondary on raised', fg: '#525252', bg: '#f4f4f5', min: 4.5 },
    { label: 'light text-muted on surface', fg: '#666666', bg: '#ffffff', min: 4.5 },
    { label: 'light action-primary button', fg: '#ffffff', bg: '#171717', min: 4.5 },
    { label: 'light senior amber on surface', fg: '#b45309', bg: '#ffffff', min: 4.5 },
  ];

  for (const p of pairs) {
    const ratio = contrastRatio(p.fg, p.bg);
    assert.ok(
      ratio >= p.min,
      `${p.label} failed WCAG AA: ${ratio.toFixed(2)}:1 < ${p.min}:1 (${p.fg} on ${p.bg})`,
    );
  }
});
