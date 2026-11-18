import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gradeCase } from '../src/features/ai/assessment.mjs';
import { validateAILessonCode } from '../src/features/ai/lesson-validator.mjs';
import { aiI18n } from '../src/features/ai/constants/ai-i18n.ts';

const curriculum = JSON.parse(
  readFileSync(new URL('../src/features/ai/curriculum.json', import.meta.url), 'utf8'),
);
const lessons = JSON.parse(
  readFileSync(new URL('../src/features/ai/lessons.json', import.meta.url), 'utf8'),
);
const cases = JSON.parse(
  readFileSync(new URL('../src/features/ai/senior-cases.json', import.meta.url), 'utf8'),
);

test('BDD: all 18 AI lessons exist, starterCode is NOT pre-solved and solutionCode passes', () => {
  assert.equal(lessons.length, 18);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 18);
  for (const mod of curriculum) {
    const lesson = lessons.find((l) => l.id === mod.id);
    assert.ok(lesson, `Missing lesson for ${mod.id}`);
    assert.ok(lesson.concepts.length >= 3, `${mod.id} needs >=3 concepts`);
    assert.ok(lesson.doDont.good && lesson.doDont.bad, `${mod.id} needs Vigilio doDont`);

    const starterRes = validateAILessonCode(lesson, lesson.starterCode);
    assert.equal(
      starterRes.passed,
      false,
      `${mod.id} starterCode must NOT pass before user edits`,
    );

    const solutionRes = validateAILessonCode(lesson, lesson.solutionCode);
    assert.equal(
      solutionRes.passed,
      true,
      `${mod.id} solutionCode failed checks: ${solutionRes.failedChecks.join(', ')}`,
    );
  }
});

test('BDD: Senior AI cases have balanced answers, unique questions/evidence and reject spam', () => {
  assert.equal(cases.length, 18);
  assert.equal(new Set(cases.map((c) => c.question)).size, 18);
  assert.equal(new Set(cases.map((c) => JSON.stringify(c.evidence))).size, 18);

  const counts = [0, 0, 0];
  for (const c of cases) {
    counts[c.correctIndex] += 1;
    const spam = 'a'.repeat(75);
    assert.equal(gradeCase(c, c.correctIndex, spam).passed, false, `${c.id} must reject char spam`);
  }
  for (const count of counts) {
    assert.ok(count <= 8, `correctIndex distribution imbalanced: ${counts.join(',')}`);
  }
});

test('BDD: AI Academy i18n covers all 6 languages and all 18 modules', () => {
  const locales = ['es', 'en', 'ja', 'zh', 'pt', 'fr'];
  for (const loc of locales) {
    const bundle = aiI18n[loc];
    assert.ok(bundle, `Missing locale ${loc}`);
    for (const mod of curriculum) {
      const entry = bundle.modules[mod.id];
      assert.ok(entry?.title?.trim(), `Missing ${loc} title for ${mod.id}`);
      assert.ok(entry?.summary?.trim(), `Missing ${loc} summary for ${mod.id}`);
      assert.ok(entry?.project?.trim(), `Missing ${loc} project for ${mod.id}`);
    }
  }
});
