import { useMemo, useState } from 'preact/hooks';
import { Card } from '../../shared/ui/primitives';
import {
  simulateAtomicFinOps,
  simulateDataLeakageThreshold,
  simulateHybridRagAcl,
  simulateLlmServing,
} from './engine/ai-simulations.mjs';

export function AISimulationLab({ backHref = '#/ai' }: { backHref?: string }) {
  const [topK, setTopK] = useState(10);
  const [tenantSharePct, setTenantSharePct] = useState(20);
  const [aclMode, setAclMode] = useState<'pre-sql' | 'post-filter'>('post-filter');
  const [useHybridRrf, setUseHybridRrf] = useState(true);

  const [concurrency, setConcurrency] = useState(25);
  const [budgetTokens, setBudgetTokens] = useState(10000);
  const avgTokensPerReq = 800;
  const [finopsMode, setFinopsMode] = useState<'atomic-reserve' | 'post-check'>('post-check');

  const [thresholdPct, setThresholdPct] = useState(50);
  const [leakedFeature, setLeakedFeature] = useState(true);

  const [arrivals, setArrivals] = useState(120);
  const [batchSize, setBatchSize] = useState(16);
  const [kvCacheHitPct, setKvCacheHitPct] = useState(40);

  const ragOut = useMemo(
    () => simulateHybridRagAcl({ topK, tenantSharePct, aclMode, useHybridRrf }),
    [topK, tenantSharePct, aclMode, useHybridRrf],
  );
  const finopsOut = useMemo(
    () => simulateAtomicFinOps({ concurrency, budgetTokens, avgTokensPerReq, mode: finopsMode }),
    [concurrency, budgetTokens, avgTokensPerReq, finopsMode],
  );
  const leakOut = useMemo(
    () => simulateDataLeakageThreshold({ thresholdPct, leakedFeature }),
    [thresholdPct, leakedFeature],
  );
  const servingOut = useMemo(
    () => simulateLlmServing({ arrivals, batchSize, kvCacheHitPct, queueCap: 40 }),
    [arrivals, batchSize, kvCacheHitPct],
  );

  return (
    <section class="ai-case">
      <p><a href={backHref}>← AI Engineering Academy</a></p>
      <h2>AI Engineering · Simuladores Deterministas de Producción</h2>
      <p class="small-disclaimer">
        Modelos matemáticos deterministas de arquitectura (no ejecutan GPU ni LLMs reales).
      </p>

      <div class="ai-dodont-grid">
        <Card>
          <h3>1. Hybrid RAG &amp; ACL Isolation</h3>
          <label>Top-K: {topK}<input type="range" min="2" max="30" value={topK} onInput={(e) => setTopK(Number(e.currentTarget.value))} /></label>
          <label>Share tenant (%): {tenantSharePct}%<input type="range" min="5" max="100" step="5" value={tenantSharePct} onInput={(e) => setTenantSharePct(Number(e.currentTarget.value))} /></label>
          <label>
            <input type="checkbox" checked={aclMode === 'pre-sql'} onChange={(e) => setAclMode(e.currentTarget.checked ? 'pre-sql' : 'post-filter')} />
            Filtro ACL pre-retrieval en SQL
          </label>
          <label>
            <input type="checkbox" checked={useHybridRrf} onChange={(e) => setUseHybridRrf(e.currentTarget.checked)} />
            Hybrid FTS + pgvector (RRF)
          </label>
          <p class={ragOut.safe ? 'ai-pass' : 'ai-fail'}>
            Autorizados: <b>{ragOut.authorizedReturned}</b> · Fugas potenciales: <b>{ragOut.leakedChunks}</b> · Recall@K: <b>{ragOut.effectiveRecall}</b>
          </p>
        </Card>

        <Card>
          <h3>2. FinOps &amp; Reserva Atómica de Presupuesto</h3>
          <label>Peticiones concurrentes: {concurrency}<input type="range" min="1" max="80" value={concurrency} onInput={(e) => setConcurrency(Number(e.currentTarget.value))} /></label>
          <label>Presupuesto (tokens): {budgetTokens}<input type="range" min="2000" max="40000" step="2000" value={budgetTokens} onInput={(e) => setBudgetTokens(Number(e.currentTarget.value))} /></label>
          <label>
            <input type="checkbox" checked={finopsMode === 'atomic-reserve'} onChange={(e) => setFinopsMode(e.currentTarget.checked ? 'atomic-reserve' : 'post-check')} />
            Reserva atómica previa (lock)
          </label>
          <p class={finopsOut.overspendTokens === 0 ? 'ai-pass' : 'ai-fail'}>
            Aceptadas: <b>{finopsOut.accepted}</b> · Rechazadas: <b>{finopsOut.rejected}</b> · Sobregasto: <b>{finopsOut.overspendTokens} tokens</b>
          </p>
        </Card>

        <Card>
          <h3>3. Data Leakage &amp; Umbral Precision/Recall</h3>
          <label>Threshold: {thresholdPct}%<input type="range" min="10" max="90" step="5" value={thresholdPct} onInput={(e) => setThresholdPct(Number(e.currentTarget.value))} /></label>
          <label>
            <input type="checkbox" checked={leakedFeature} onChange={(e) => setLeakedFeature(e.currentTarget.checked)} />
            Simular feature con fuga temporal (leakage)
          </label>
          <p class={leakOut.prodDrop <= 0.05 ? 'ai-pass' : 'ai-fail'}>
            F1 Offline: <b>{leakOut.offlineReportedF1}</b> · F1 Holdout real: <b>{leakOut.realHoldoutF1}</b> · Caída prod: <b>-{leakOut.prodDrop}</b>
          </p>
        </Card>

        <Card>
          <h3>4. LLM Serving (Batching, KV-Cache &amp; P99)</h3>
          <label>Llegadas (req/step): {arrivals}<input type="range" min="10" max="200" step="10" value={arrivals} onInput={(e) => setArrivals(Number(e.currentTarget.value))} /></label>
          <label>Batch Size: {batchSize}<input type="range" min="1" max="32" value={batchSize} onInput={(e) => setBatchSize(Number(e.currentTarget.value))} /></label>
          <label>KV-Cache Hit (%): {kvCacheHitPct}%<input type="range" min="0" max="90" step="10" value={kvCacheHitPct} onInput={(e) => setKvCacheHitPct(Number(e.currentTarget.value))} /></label>
          <p class="ai-pass">
            Procesadas: <b>{servingOut.processed}</b> · En cola: <b>{servingOut.queued}</b> · Load-shed 429: <b>{servingOut.rejected}</b> · P99 modelado: <b>{servingOut.modeledP99Ms} ms</b>
          </p>
        </Card>
      </div>
    </section>
  );
}
