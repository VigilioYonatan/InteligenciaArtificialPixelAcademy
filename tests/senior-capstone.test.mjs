import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const cap = JSON.parse(read('../src/content/senior/capstone.json'));

test('capstone defines six distinct real AI Architecture skills with Python tests and limits', () => {
  assert.equal(cap.steps.length, 6);
  assert.equal(new Set(cap.steps.map((s) => s.id)).size, 6);
  assert.equal(cap.boundaries.length, 5);
  for (const s of cap.steps) {
    assert.ok(s.detail.length > 80, s.id);
    assert.ok(s.test.length > 5, s.id);
  }
});

test('Python AI capstone package and tests are checked into the repository', () => {
  for (const path of ['capstone_ai/pipeline.py', 'capstone_ai/test_pipeline.py', 'rag_acl/evaluator.py', 'finops_budget/atomic_ledger.py', 'ml_splits/temporal_guard.py']) {
    assert.equal(existsSync(new URL(`../labs-ai-native/${path}`, import.meta.url)), true, path);
  }
});

test('capstone route, UI and downloadable archive are referenced', () => {
  assert.match(read('../src/app/App.tsx'), /SeniorCapstone/);
  assert.match(read('../src/app/App.tsx'), /parts\[1\]==='capstone'/);
  assert.match(read('../src/features/senior/SeniorCapstone.tsx'), /ai-native-senior-labs\.zip/);
  assert.match(read('../src/features/senior/NativeLabCatalog.tsx'), /ai-native-senior-labs\.zip/);
});
