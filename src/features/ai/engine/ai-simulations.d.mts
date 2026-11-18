export function simulateHybridRagAcl(input: {
  topK: number;
  tenantSharePct: number;
  aclMode: 'pre-sql' | 'post-filter';
  useHybridRrf: boolean;
}): {
  aclMode: 'pre-sql' | 'post-filter';
  authorizedReturned: number;
  leakedChunks: number;
  effectiveRecall: number;
  safe: boolean;
};

export function simulateAtomicFinOps(input: {
  concurrency: number;
  budgetTokens: number;
  avgTokensPerReq: number;
  mode: 'atomic-reserve' | 'post-check';
}): {
  mode: 'atomic-reserve' | 'post-check';
  accepted: number;
  rejected: number;
  spentTokens: number;
  overspendTokens: number;
};

export function simulateDataLeakageThreshold(input: {
  thresholdPct: number;
  leakedFeature: boolean;
}): {
  thresholdPct: number;
  offlineReportedF1: number;
  realHoldoutF1: number;
  realPrecision: number;
  realRecall: number;
  prodDrop: number;
};

export function simulateLlmServing(input: {
  arrivals: number;
  batchSize: number;
  kvCacheHitPct: number;
  queueCap: number;
}): {
  arrivals: number;
  accepted: number;
  processed: number;
  queued: number;
  rejected: number;
  modeledP99Ms: number;
};
