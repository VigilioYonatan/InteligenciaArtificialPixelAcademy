// Deterministic mathematical models for AI Engineering Senior Mode.
// Explicit disclaimer: models invariants & trade-offs, never runs live GPUs or LLMs.

function assertIntRange(value, min, max, name) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer in [${min}, ${max}]`);
  }
}

export function simulateHybridRagAcl({ topK, tenantSharePct, aclMode, useHybridRrf }) {
  assertIntRange(topK, 1, 50, 'topK');
  assertIntRange(tenantSharePct, 5, 100, 'tenantSharePct');
  if (aclMode !== 'pre-sql' && aclMode !== 'post-filter') {
    throw new RangeError('Invalid aclMode');
  }
  const share = tenantSharePct / 100;
  const rrfBonus = useHybridRrf ? 0.12 : 0;
  if (aclMode === 'post-filter') {
    const authorizedInTopK = Math.max(0, Math.round(topK * share));
    const leakedChunks = topK - authorizedInTopK;
    const effectiveRecall = Number(Math.min(0.96, share * 0.78 + rrfBonus).toFixed(2));
    return {
      aclMode,
      authorizedReturned: authorizedInTopK,
      leakedChunks,
      effectiveRecall,
      safe: leakedChunks === 0,
    };
  }
  const effectiveRecall = Number(Math.min(0.98, 0.8 + rrfBonus + (topK >= 8 ? 0.04 : 0)).toFixed(2));
  return {
    aclMode,
    authorizedReturned: topK,
    leakedChunks: 0,
    effectiveRecall,
    safe: true,
  };
}

export function simulateAtomicFinOps({ concurrency, budgetTokens, avgTokensPerReq, mode }) {
  assertIntRange(concurrency, 1, 200, 'concurrency');
  assertIntRange(budgetTokens, 100, 1000000, 'budgetTokens');
  assertIntRange(avgTokensPerReq, 50, 20000, 'avgTokensPerReq');
  if (mode !== 'atomic-reserve' && mode !== 'post-check') {
    throw new RangeError('Invalid mode');
  }
  const maxAffordable = Math.floor(budgetTokens / avgTokensPerReq);
  if (mode === 'atomic-reserve') {
    const accepted = Math.min(concurrency, maxAffordable);
    const rejected = concurrency - accepted;
    const spentTokens = accepted * avgTokensPerReq;
    return {
      mode,
      accepted,
      rejected,
      spentTokens,
      overspendTokens: 0,
    };
  }
  // Post-check race condition: concurrent in-flight requests pass balance check simultaneously
  const accepted = concurrency;
  const spentTokens = accepted * avgTokensPerReq;
  const overspendTokens = Math.max(0, spentTokens - budgetTokens);
  return {
    mode,
    accepted,
    rejected: 0,
    spentTokens,
    overspendTokens,
  };
}

export function simulateDataLeakageThreshold({ thresholdPct, leakedFeature }) {
  assertIntRange(thresholdPct, 10, 90, 'thresholdPct');
  const t = thresholdPct / 100;
  const realPrecision = Number(Math.min(0.97, 0.42 + t * 0.55).toFixed(2));
  const realRecall = Number(Math.max(0.15, 0.96 - t * 0.75).toFixed(2));
  const realF1 = Number(
    ((2 * realPrecision * realRecall) / Math.max(0.01, realPrecision + realRecall)).toFixed(2),
  );
  const offlineReportedF1 = leakedFeature ? 0.96 : realF1;
  const prodDrop = Number((offlineReportedF1 - realF1).toFixed(2));
  return {
    thresholdPct,
    offlineReportedF1,
    realHoldoutF1: realF1,
    realPrecision,
    realRecall,
    prodDrop,
  };
}

export function simulateLlmServing({ arrivals, batchSize, kvCacheHitPct, queueCap }) {
  assertIntRange(arrivals, 0, 500, 'arrivals');
  assertIntRange(batchSize, 1, 64, 'batchSize');
  assertIntRange(kvCacheHitPct, 0, 90, 'kvCacheHitPct');
  assertIntRange(queueCap, 1, 200, 'queueCap');

  const maxStepCapacity = batchSize * 4;
  const accepted = Math.min(arrivals, maxStepCapacity + queueCap);
  const rejected = arrivals - accepted;
  const processed = Math.min(accepted, maxStepCapacity);
  const queued = accepted - processed;
  const cacheFactor = 1 - (kvCacheHitPct / 100) * 0.45;
  const modeledP99Ms = Math.round((180 + queued * 14 + batchSize * 6) * cacheFactor);
  return {
    arrivals,
    accepted,
    processed,
    queued,
    rejected,
    modeledP99Ms,
  };
}
