import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { goExamples } from '../src/data/learning-exercises.ts';
import { frameworkUnits } from '../src/features/frameworks/data/framework-units.ts';
import { aiI18n } from '../src/features/ai/constants/ai-i18n.ts';
import { validateAILessonCode } from '../src/features/ai/lesson-validator.mjs';

const LOCALES = ['es', 'en', 'ja', 'zh', 'pt', 'fr'];

const aiLessons = JSON.parse(
  readFileSync(new URL('../src/features/ai/lessons.json', import.meta.url), 'utf8'),
);
const aiCases = JSON.parse(
  readFileSync(new URL('../src/features/ai/senior-cases.json', import.meta.url), 'utf8'),
);
const aiDecisions = JSON.parse(
  readFileSync(new URL('../src/content/ai/decision-labs.json', import.meta.url), 'utf8'),
);

test('Curriculum Integrity: zero pre-solved exercises across Go (36), AI (18) and Frameworks (40)', () => {
  for (const [id, spec] of Object.entries(goExamples)) {
    assert.equal(spec.test(spec.code), false, `Go ${id} starterCode is pre-solved`);
    assert.equal(spec.test(spec.solution), true, `Go ${id} solution failed`);
  }
  for (const l of aiLessons) {
    assert.equal(validateAILessonCode(l, l.starterCode).passed, false, `AI ${l.id} pre-solved`);
    assert.equal(validateAILessonCode(l, l.solutionCode).passed, true, `AI ${l.id} solution failed`);
  }
  for (const [fw, units] of Object.entries(frameworkUnits)) {
    for (const u of units) {
      assert.equal(u.test(u.starterCode), false, `${fw}-${u.unit} pre-solved`);
      assert.equal(u.test(u.solutionCode), true, `${fw}-${u.unit} solution failed`);
    }
  }
});

test('Curriculum Integrity: balanced answer index distribution (<=45% in any index) in AI Senior', () => {
  const caseCounts = [0, 0, 0];
  for (const c of aiCases) caseCounts[c.correctIndex] += 1;
  for (const count of caseCounts) {
    assert.ok(count / aiCases.length <= 0.45, `AI cases imbalanced: ${caseCounts.join(',')}`);
  }

  let totalQ = 0;
  const decCounts = [0, 0, 0];
  for (const d of aiDecisions) {
    for (const q of d.questions) {
      totalQ += 1;
      decCounts[q.correct] += 1;
    }
  }
  assert.equal(totalQ, 54);
});

test('Curriculum Integrity: 6-language key parity across UI dictionaries and AI Academy', () => {
  const baseKeys = Object.keys(
    JSON.parse(readFileSync(new URL('../src/i18n/es.json', import.meta.url), 'utf8')),
  ).sort();

  for (const loc of LOCALES) {
    const dict = JSON.parse(
      readFileSync(new URL(`../src/i18n/${loc}.json`, import.meta.url), 'utf8'),
    );
    assert.deepEqual(Object.keys(dict).sort(), baseKeys, `UI dict key mismatch in ${loc}`);
    assert.ok(aiI18n[loc], `Missing aiI18n for ${loc}`);
    for (const [k, v] of Object.entries(aiI18n[loc])) {
      if (typeof v === 'string') assert.ok(v.trim().length > 0, `Empty aiI18n.${loc}.${k}`);
    }
  }
});
