import { Card } from '../../shared/ui/primitives';
import type { Prefs } from '../progress/types/progress.types';
import { computeAiReadiness } from './engine/ai-readiness.mjs';

const AXIS_NAMES: Record<string, string> = {
  data_ml: 'Datos, Estadística & ML Clásico',
  dl_nlp: 'Deep Learning & Transformers',
  rag_grounding: 'Hybrid RAG, Citas & Evals',
  agents_sec: 'Agentes, MCP & Supply Chain',
  serving_finops: 'Serving, OTel & FinOps Atómico',
};

export function AIReadiness({ prefs }: { prefs: Prefs }) {
  const report = computeAiReadiness(prefs);

  return (
    <section class="ai-case">
      <p><a href="#/ai">← AI Engineering Academy</a></p>
      <h2>Senior AI Readiness Matrix · {report.overallPct}%</h2>
      <p>
        Evaluación agregada de evidencias verificadas localmente ({report.totalEarned}/
        {report.totalMax} actividades aprobadas entre casos Senior, Decision, Evidence, Code Review y
        Operations).
      </p>
      <div class="ai-grid">
        {report.axes.map((axis) => (
          <Card key={axis.id}>
            <h3>{AXIS_NAMES[axis.id] || axis.id}</h3>
            <p>
              <b>{axis.pct}%</b> ({axis.earned}/{axis.maxPoints})
            </p>
            <div class="progress-bar">
              <i style={{ width: `${axis.pct}%` }} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
