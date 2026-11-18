import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aiExamples, lessonGuides } from '../src/data/learning-exercises.ts';
import { evaluateAiExercise, stripCodeComments } from '../src/features/editor/ai-code-checker.mjs';

const LOCALES = ['es', 'en', 'ja', 'zh', 'pt', 'fr'];

test('BDD 2.1–2.4: all 36 AI Architecture exercises (B01-A12) are non-pre-solved, pass on solution, and have Senior notes', () => {
  const keys = Object.keys(aiExamples);
  assert.equal(keys.length, 36);

  for (const [id, spec] of Object.entries(aiExamples)) {
    assert.ok(spec.stack?.trim(), `${id} must declare stack`);
    assert.ok(spec.fileName?.trim() && !spec.fileName.endsWith('.go'), `${id} must use non-Go fileName`);
    assert.ok(spec.seniorNote?.trim().length >= 20, `${id} must include seniorNote`);
    assert.ok(spec.doDont?.do?.trim() && spec.doDont?.dont?.trim(), `${id} must include doDont`);
    assert.ok(!/fmt\.Println|package main/.test(spec.solution), `${id} must contain zero Go code`);

    const starterEval = evaluateAiExercise(spec, spec.code);
    assert.equal(starterEval.passed, false, `${id} starterCode must NOT pass`);

    const solutionEval = evaluateAiExercise(spec, spec.solution);
    assert.equal(
      solutionEval.passed,
      true,
      `${id} solution failed rules: ${JSON.stringify(solutionEval.failedRules)}`,
    );
    assert.equal(spec.test(spec.solution), true, `${id} test() must pass on solution`);

    // Guides must cover all 6 languages
    const guide = lessonGuides[id];
    assert.ok(guide, `${id} must have a lessonGuide`);
    for (const lang of LOCALES) {
      assert.ok(guide.mission[lang]?.trim(), `${id}:${lang} mission missing`);
      assert.ok(guide.concepts[lang]?.length >= 2, `${id}:${lang} concepts missing`);
      assert.ok(guide.steps[lang]?.length >= 3, `${id}:${lang} steps missing`);
    }
  }
});

test('Adversarial 2.1: ai-code-checker strips comments, rejects TODO/placeholders, and returns failed rule diagnostics', () => {
  const b01 = aiExamples.B01;

  // Spoofing answer inside comments must fail
  const commentSpoof = `
    export function buildContextBudget(maxContext: number, maxOutput: number, inputTokens: number) {
      // const availableInput = Math.max(0, maxContext - maxOutput);
      /* Math.max(0, maxContext - maxOutput) */
      return { availableInput: 0, maxOutput, truncated: false };
    }
  `;
  const spoofEval = evaluateAiExercise(b01, commentSpoof);
  assert.equal(spoofEval.passed, false);
  assert.ok(spoofEval.failedRules.length >= 1);

  // SQL -- and Python # comments must also be stripped
  const strippedSql = stripCodeComments("SELECT 1 -- deleted_at IS NULL\nFROM t WHERE x = 'a -- b';");
  assert.ok(!strippedSql.includes('deleted_at IS NULL'));
  assert.ok(strippedSql.includes("'a -- b'"));

  const strippedPy = stripCodeComments('def f():\n  # return dot / (norm_a * norm_b)\n  return 0');
  assert.ok(!strippedPy.includes('norm_a'));

  // Empty or placeholder submissions fail closed
  assert.equal(evaluateAiExercise(b01, '').passed, false);
  assert.equal(evaluateAiExercise(b01, 'TODO: fix later').passed, false);
  assert.equal(evaluateAiExercise(undefined, 'code').passed, false);
});
