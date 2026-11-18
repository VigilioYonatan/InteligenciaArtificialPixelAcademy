import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
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
import { computeAiReadiness } from '../src/features/ai/engine/ai-readiness.mjs';

const decisions = JSON.parse(
  readFileSync(new URL('../src/content/ai/decision-labs.json', import.meta.url), 'utf8'),
);
const evidence = JSON.parse(
  readFileSync(new URL('../src/content/ai/evidence-labs.json', import.meta.url), 'utf8'),
);
const reviews = JSON.parse(
  readFileSync(new URL('../src/content/ai/review-labs.json', import.meta.url), 'utf8'),
);
const operations = JSON.parse(
  readFileSync(new URL('../src/content/ai/operations-labs.json', import.meta.url), 'utf8'),
);
const guides = JSON.parse(
  readFileSync(new URL('../src/content/ai/guides.json', import.meta.url), 'utf8'),
);

test('BDD: all 18 Senior AI labs (54 decisions, 18 evidence, 18 reviews, 18 ops, 18 guides) grade deterministically', () => {
  assert.equal(decisions.length, 18);
  assert.equal(evidence.length, 18);
  assert.equal(reviews.length, 18);
  assert.equal(operations.length, 18);
  assert.equal(guides.length, 18);

  let totalQuestions = 0;
  for (const d of decisions) {
    totalQuestions += d.questions.length;
    const perfect = d.questions.map((q) => q.correct);
    const wrong = d.questions.map((q) => (q.correct + 1) % q.options.length);
    assert.equal(gradeAiDecisionLab(d, perfect).score, 100);
    assert.equal(gradeAiDecisionLab(d, wrong).passed, false);
  }
  assert.equal(totalQuestions, 54);

  for (const e of evidence) {
    assert.equal(gradeAiEvidenceLab(e, e.correctIndices).score, 100);
    assert.equal(gradeAiEvidenceLab(e, [e.correctIndices[0], e.correctIndices[0]]).passed, false);
  }

  for (const r of reviews) {
    assert.equal(gradeAiTwoStepLab(r, r.riskCorrect, r.fixCorrect, 'riskCorrect', 'fixCorrect').score, 100);
    assert.equal(gradeAiTwoStepLab(r, (r.riskCorrect + 1) % 3, r.fixCorrect, 'riskCorrect', 'fixCorrect').passed, false);
  }

  for (const o of operations) {
    assert.equal(gradeAiTwoStepLab(o, o.causeCorrect, o.mitigationCorrect, 'causeCorrect', 'mitigationCorrect').score, 100);
  }
});

test('BDD: AI lab sanitizer rejects tampered scores and invalid IDs', () => {
  const sample = decisions[0];
  const perfect = sample.questions.map((q) => q.correct);
  const forged = sample.questions.map((q) => (q.correct + 1) % q.options.length);
  const out = sanitizeAiLabMap(
    {
      SAI01: { version: AI_LAB_VERSION, score: 100, passed: true, answers: perfect },
      SAI02: { version: AI_LAB_VERSION, score: 100, passed: true, answers: forged },
      __proto__: { version: AI_LAB_VERSION, score: 100, passed: true, answers: perfect },
    },
    decisions,
    'decision',
  );
  assert.deepEqual(Object.keys(out), ['SAI01']);
});

test('BDD: AI simulators enforce conservation, ACL isolation and atomic FinOps invariants', () => {
  const unsafeRag = simulateHybridRagAcl({ topK: 10, tenantSharePct: 20, aclMode: 'post-filter', useHybridRrf: true });
  assert.equal(unsafeRag.safe, false);
  assert.ok(unsafeRag.leakedChunks > 0);

  const safeRag = simulateHybridRagAcl({ topK: 10, tenantSharePct: 20, aclMode: 'pre-sql', useHybridRrf: true });
  assert.equal(safeRag.safe, true);
  assert.equal(safeRag.leakedChunks, 0);

  const unsafeFin = simulateAtomicFinOps({ concurrency: 30, budgetTokens: 5000, avgTokensPerReq: 500, mode: 'post-check' });
  assert.ok(unsafeFin.overspendTokens > 0);

  const safeFin = simulateAtomicFinOps({ concurrency: 30, budgetTokens: 5000, avgTokensPerReq: 500, mode: 'atomic-reserve' });
  assert.equal(safeFin.overspendTokens, 0);
  assert.equal(safeFin.accepted, 10);

  const leak = simulateDataLeakageThreshold({ thresholdPct: 50, leakedFeature: true });
  assert.ok(leak.prodDrop > 0);

  const srv = simulateLlmServing({ arrivals: 150, batchSize: 16, kvCacheHitPct: 40, queueCap: 40 });
  assert.equal(srv.accepted + srv.rejected, srv.arrivals);
  assert.equal(srv.processed + srv.queued, srv.accepted);
});

test('BDD: AI readiness radar and native Python labs ZIP exist and are valid', () => {
  const empty = computeAiReadiness({});
  assert.equal(empty.overallPct, 0);
  assert.equal(empty.axes.length, 5);

  const oneModule = computeAiReadiness({
    aiSeniorResults: { SAI01: { passed: true } },
    aiDecisionResults: { SAI01: { passed: true } },
    aiEvidenceResults: { SAI01: { passed: true } },
    aiReviewResults: { SAI01: { passed: true } },
    aiOperationsResults: { SAI01: { passed: true } },
  });
  assert.equal(oneModule.totalEarned, 5);

  const zipUrl = new URL('../public/downloads/ai-native-senior-labs.zip', import.meta.url);
  assert.ok(existsSync(zipUrl));
  assert.ok(statSync(zipUrl).size > 1000);
});
