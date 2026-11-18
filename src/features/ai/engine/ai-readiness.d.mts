export function computeAiReadiness(records: {
  aiSeniorResults?: Record<string, { passed: boolean }>;
  aiDecisionResults?: Record<string, { passed: boolean }>;
  aiEvidenceResults?: Record<string, { passed: boolean }>;
  aiReviewResults?: Record<string, { passed: boolean }>;
  aiOperationsResults?: Record<string, { passed: boolean }>;
}): {
  overallPct: number;
  totalEarned: number;
  totalMax: number;
  axes: { id: string; earned: number; maxPoints: number; pct: number }[];
};
