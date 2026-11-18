import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

function walkFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '__pycache__' || entry.name === '.git') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

const BANNED_PATTERNS = [
  /\bGoPixel\b/i,
  /\bGolang\b/i,
  /Ecosistema Go/i,
  /Go Frameworks/i,
  /GO ENGINEERING/i,
  /solution\.go/i,
  /ServeMux/i,
  /gRPC Go/i,
  /\bpackage main\b/,
  /gophers\//i,
  /go\.dev\/brand/i,
  /go\.dev\/play/i,
  /go-native-senior-labs\.zip/i,
];

test('Gate 4.2: zero legacy Go assets, directories, or .go files remain in the repository', () => {
  assert.equal(existsSync(resolve(root, 'labs-native')), false, 'labs-native/ must be removed');
  assert.equal(existsSync(resolve(root, 'public/assets/gophers')), false, 'public/assets/gophers/ must be removed');
  assert.equal(existsSync(resolve(root, 'public/downloads/go-native-senior-labs.zip')), false, 'go-native-senior-labs.zip must be removed');

  const allRepoFiles = [
    ...walkFiles(resolve(root, 'src')),
    ...walkFiles(resolve(root, 'public')),
    ...walkFiles(resolve(root, 'labs-ai-native')),
  ];
  for (const file of allRepoFiles) {
    assert.ok(!file.endsWith('.go'), `Unexpected .go file found: ${relative(root, file)}`);
  }
});

test('Gate 4.2: zero GoPixel / Golang / package main / gophers leakage across src/, labs-ai-native/ and index.html', () => {
  const scanFiles = [
    resolve(root, 'index.html'),
    ...walkFiles(resolve(root, 'src')).filter((f) => /\.(tsx?|mjs|json|css)$/.test(f)),
    ...walkFiles(resolve(root, 'labs-ai-native')).filter((f) => /\.(py|md|toml)$/.test(f)),
  ];

  // Progress constants intentionally retain legacy localStorage key names ('gopixel:v1', 'gopixel:v2')
  // for non-destructive user migration into canonical 'aipixel:v1'.
  const excludedRel = new Set(['src/features/progress/constants/progress.constants.ts']);

  for (const full of scanFiles) {
    const rel = relative(root, full).replace(/\\/g, '/');
    if (excludedRel.has(rel) || statSync(full).size > 512_000) continue;
    const text = readFileSync(full, 'utf8');
    for (const rx of BANNED_PATTERNS) {
      assert.ok(!rx.test(text), `Legacy Go reference (${rx}) leaked in ${rel}`);
    }
  }
});
