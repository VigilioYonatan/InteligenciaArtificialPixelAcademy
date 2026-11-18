import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const uiFiles = ['AIAcademy.tsx', 'AIDashboard.tsx', 'AILessonPage.tsx', 'AISeniorHub.tsx'].map((f) =>
  readFileSync(new URL(`../src/features/ai/${f}`, import.meta.url), 'utf8'),
);
const seniorHub = uiFiles[3];
const logic = readFileSync(new URL('../src/features/ai/assessment.mjs', import.meta.url), 'utf8');
const validator = readFileSync(
  new URL('../src/features/ai/lesson-validator.mjs', import.meta.url),
  'utf8',
);

test('AI extension does not execute browser-evaluated user code', () => {
  for (const source of [...uiFiles, logic, validator]) {
    for (const forbidden of [
      /\beval\s*\(/,
      /\bnew\s+Function\s*\(/,
      /\bdangerouslySetInnerHTML\b/,
      /\binnerHTML\s*=/,
    ]) {
      assert.doesNotMatch(source, forbidden);
    }
  }
});

test('Senior evidence input is bounded and has no remote execution', () => {
  assert.match(seniorHub, /maxLength=\{3000\}/);
  for (const source of uiFiles) {
    assert.doesNotMatch(source, /fetch\s*\(/);
    assert.doesNotMatch(source, /WebSocket\s*\(/);
  }
  assert.match(logic, /slice\(0, 3000\)/);
});
