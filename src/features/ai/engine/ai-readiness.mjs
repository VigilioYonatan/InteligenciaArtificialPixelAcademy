// Deterministic readiness radar calculation across 5 Senior AI competency axes.

export const AI_AXES = [
  { id: 'data_ml', modules: ['SAI01', 'SAI03', 'SAI04', 'SAI05', 'SAI06', 'SAI07', 'SAI08'] },
  { id: 'dl_nlp', modules: ['SAI09', 'SAI10'] },
  { id: 'rag_grounding', modules: ['SAI11', 'SAI12', 'SAI14'] },
  { id: 'agents_sec', modules: ['SAI13', 'SAI17'] },
  { id: 'serving_finops', modules: ['SAI02', 'SAI15', 'SAI16', 'SAI18'] },
];

export function computeAiReadiness(records) {
  const caseRes = records?.aiSeniorResults || {};
  const decisionRes = records?.aiDecisionResults || {};
  const evidenceRes = records?.aiEvidenceResults || {};
  const reviewRes = records?.aiReviewResults || {};
  const opsRes = records?.aiOperationsResults || {};

  const axes = AI_AXES.map((axis) => {
    const maxPoints = axis.modules.length * 5;
    let earned = 0;
    for (const id of axis.modules) {
      if (caseRes[id]?.passed) earned += 1;
      if (decisionRes[id]?.passed) earned += 1;
      if (evidenceRes[id]?.passed) earned += 1;
      if (reviewRes[id]?.passed) earned += 1;
      if (opsRes[id]?.passed) earned += 1;
    }
    const pct = maxPoints > 0 ? Math.round((100 * earned) / maxPoints) : 0;
    return { id: axis.id, earned, maxPoints, pct };
  });

  const totalEarned = axes.reduce((acc, a) => acc + a.earned, 0);
  const totalMax = axes.reduce((acc, a) => acc + a.maxPoints, 0);
  const overallPct = totalMax > 0 ? Math.round((100 * totalEarned) / totalMax) : 0;
  return { overallPct, totalEarned, totalMax, axes };
}
