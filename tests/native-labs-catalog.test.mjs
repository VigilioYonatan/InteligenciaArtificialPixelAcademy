import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';

const labs = JSON.parse(readFileSync(new URL('../src/content/senior/native-labs.json', import.meta.url), 'utf8'));
const root = new URL('../', import.meta.url);

test('18 unique native AI labs with Python implementation, tests and local notes', () => {
  assert.equal(labs.length, 18);
  assert.equal(new Set(labs.map((l) => l.id)).size, 18);
  for (const lab of labs) {
    assert.match(lab.id, /^S(0[1-9]|1[0-8])$/);
    for (const file of ['lab.py', 'test_lab.py', 'README.md']) {
      assert.equal(existsSync(new URL(`${lab.directory}/${file}`, root)), true, `${lab.id}: ${file}`);
    }
  }
});

test('actual static AI download is populated', () => {
  assert.ok(statSync(new URL('../public/downloads/ai-native-senior-labs.zip', import.meta.url)).size > 5000);
});

test('browser pages expose native routes and AI download', () => {
  const app = readFileSync(new URL('../src/app/App.tsx', import.meta.url), 'utf8');
  const view = readFileSync(new URL('../src/features/senior/NativeLabCatalog.tsx', import.meta.url), 'utf8');
  assert.match(app, /parts\[1\]==='native'/);
  assert.match(app, /parts\[1\]==='readiness'/);
  assert.match(view, /ai-native-senior-labs\.zip/);
});
