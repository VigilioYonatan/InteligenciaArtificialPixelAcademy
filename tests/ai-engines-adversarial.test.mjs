import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  AI_LAB_VERSION,
  gradeAiDecisionLab,
  gradeAiEvidenceLab,
  gradeAiTwoStepLab,
  sanitizeAiLabMap,
} from '../src/features/ai/engine/ai-labs.mjs';
import {
  simulateAtomicFinOps,
  simulateDataLeakageThreshold,
  simulateHybridRagAcl,
  simulateLlmServing,
} from '../src/features/ai/engine/ai-simulations.mjs';
import { validateAILessonCode } from '../src/features/ai/lesson-validator.mjs';
import { gradeCase, sanitizeProgress } from '../src/features/ai/assessment.mjs';

const decisions = JSON.parse(
  readFileSync(new URL('../src/content/ai/decision-labs.json', import.meta.url), 'utf8'),
);

test('Adversarial AI: gradeCase rejects invalid types, out-of-range selections and repeated word spam', () => {
  assert.throws(() => gradeCase(null, 0, 'test'), TypeError);
  const sample = { options: ['a', 'b', 'c'], correctIndex: 1 };
  assert.equal(gradeCase(sample, 99, 'valid long text with enough words here').passed, false);
  assert.equal(gradeCase(sample, 1, 'word '.repeat(20)).passed, false);
});

test('Adversarial AI: sanitizeProgress and sanitizeAiLabMap reject prototype pollution & version mismatch', () => {
  const polluted = JSON.parse('{"__proto__":{"version":1,"passed":true,"score":100},"SAI01":{"version":2,"passed":true,"score":100}}');
  assert.deepEqual(sanitizeProgress(polluted), {});
  assert.deepEqual(sanitizeAiLabMap(null, decisions, 'decision'), {});
  assert.deepEqual(
    sanitizeAiLabMap({ SAI01: { version: AI_LAB_VERSION + 1, score: 100, passed: true, answers: [1, 0, 2] } }, decisions, 'decision'),
    {},
  );
});

test('Adversarial AI: simulators reject out-of-range inputs fail-closed', () => {
  assert.throws(() => simulateHybridRagAcl({ topK: 0, tenantSharePct: 20, aclMode: 'pre-sql', useHybridRrf: true }), RangeError);
  assert.throws(() => simulateAtomicFinOps({ concurrency: 500, budgetTokens: 1000, avgTokensPerReq: 100, mode: 'atomic-reserve' }), RangeError);
  assert.throws(() => simulateDataLeakageThreshold({ thresholdPct: 5, leakedFeature: false }), RangeError);
  assert.throws(() => simulateLlmServing({ arrivals: -1, batchSize: 4, kvCacheHitPct: 0, queueCap: 10 }), RangeError);
});

test('Adversarial AI: lesson validator strips Python # and SQL -- comments and rejects invalid specs', () => {
  assert.equal(validateAILessonCode(null, 'code').passed, false);
  const spec = { checks: [{ pattern: 'raise\\s+ValueError', label: 'ValueError' }] };
  assert.equal(validateAILessonCode(spec, '# raise ValueError\nreturn 0').passed, false);
  assert.equal(validateAILessonCode(spec, '-- raise ValueError\nSELECT 1;').passed, false);
  assert.equal(validateAILessonCode(spec, 'raise ValueError("bad")').passed, true);
});

test('Adversarial AI: lab graders reject malformed answers/selections', () => {
  assert.throws(() => gradeAiDecisionLab(null, [0]), TypeError);
  assert.throws(() => gradeAiEvidenceLab(null, [0]), TypeError);
  assert.throws(() => gradeAiTwoStepLab(null, 0, 0, 'a', 'b'), TypeError);
  assert.equal(gradeAiDecisionLab(decisions[0], [0]).passed, false);
});
