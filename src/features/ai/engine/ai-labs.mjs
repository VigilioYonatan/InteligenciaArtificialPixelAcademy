// Deterministic pure ESM evaluators for Senior AI specialized labs.
// Zero DOM, zero Preact, zero localStorage, zero eval.

export const AI_LAB_VERSION = 1;

export function gradeAiDecisionLab(lab, answers) {
  if (!lab || !Array.isArray(lab.questions) || lab.questions.length === 0) {
    throw new TypeError('Invalid AI decision lab');
  }
  if (!Array.isArray(answers) || answers.length !== lab.questions.length) {
    return { passed: false, correct: 0, total: lab.questions.length, score: 0, details: [] };
  }
  const details = lab.questions.map((q, idx) => answers[idx] === q.correct);
  const correct = details.filter(Boolean).length;
  const total = lab.questions.length;
  const score = Math.round((100 * correct) / total);
  return { passed: correct === total, correct, total, score, details };
}

export function gradeAiEvidenceLab(lab, selections) {
  if (!lab || !Array.isArray(lab.correctIndices) || lab.correctIndices.length === 0) {
    throw new TypeError('Invalid AI evidence lab');
  }
  if (!Array.isArray(selections)) {
    return { passed: false, correct: 0, total: lab.correctIndices.length, score: 0 };
  }
  const unique = [...new Set(selections)].filter(
    (n) => Number.isInteger(n) && n >= 0 && n < lab.findings.length,
  );
  if (unique.length !== selections.length || unique.length === 0) {
    return { passed: false, correct: 0, total: lab.correctIndices.length, score: 0 };
  }
  const expected = new Set(lab.correctIndices);
  const hits = unique.filter((idx) => expected.has(idx)).length;
  const falsePositives = unique.filter((idx) => !expected.has(idx)).length;
  const passed = hits === expected.size && falsePositives === 0;
  const score = passed
    ? 100
    : Math.max(0, Math.round((100 * Math.max(0, hits - falsePositives)) / expected.size));
  return { passed, correct: hits, total: expected.size, score };
}

export function gradeAiTwoStepLab(lab, firstChoice, secondChoice, firstKey, secondKey) {
  if (!lab || !Number.isInteger(lab[firstKey]) || !Number.isInteger(lab[secondKey])) {
    throw new TypeError('Invalid two-step AI lab');
  }
  const d0 = firstChoice === lab[firstKey];
  const d1 = secondChoice === lab[secondKey];
  const correct = (d0 ? 1 : 0) + (d1 ? 1 : 0);
  const score = correct * 50;
  return { passed: correct === 2, correct, total: 2, score, details: [d0, d1] };
}

export function sanitizeAiLabMap(rawMap, bank, kind) {
  if (!rawMap || typeof rawMap !== 'object' || Array.isArray(rawMap)) return {};
  const valid = {};
  for (const [id, rec] of Object.entries(rawMap).slice(0, 18)) {
    if (!/^SAI(0[1-9]|1[0-8])$/.test(id)) continue;
    if (!rec || typeof rec !== 'object' || Array.isArray(rec)) continue;
    if (rec.version !== AI_LAB_VERSION) continue;
    const spec = bank.find((item) => item.id === id);
    if (!spec) continue;
    try {
      if (kind === 'decision' && Array.isArray(rec.answers)) {
        const res = gradeAiDecisionLab(spec, rec.answers);
        if (res.score === rec.score && res.passed === rec.passed) valid[id] = rec;
      } else if (kind === 'evidence' && Array.isArray(rec.selections)) {
        const res = gradeAiEvidenceLab(spec, rec.selections);
        if (res.score === rec.score && res.passed === rec.passed) valid[id] = rec;
      } else if (kind === 'review' && Array.isArray(rec.choices) && rec.choices.length === 2) {
        const res = gradeAiTwoStepLab(spec, rec.choices[0], rec.choices[1], 'riskCorrect', 'fixCorrect');
        if (res.score === rec.score && res.passed === rec.passed) valid[id] = rec;
      } else if (kind === 'operations' && Array.isArray(rec.choices) && rec.choices.length === 2) {
        const res = gradeAiTwoStepLab(
          spec,
          rec.choices[0],
          rec.choices[1],
          'causeCorrect',
          'mitigationCorrect',
        );
        if (res.score === rec.score && res.passed === rec.passed) valid[id] = rec;
      }
    } catch {
      // Reject malformed record
    }
  }
  return valid;
}
