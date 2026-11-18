import { useEffect, useState } from 'preact/hooks';
import { Button, Icon } from '../../shared/ui/primitives';
import type { Locale } from './types/learning.types';

type DiagramStage = {
  id: string;
  label: string;
  badge: string;
  tone: 'neutral' | 'accent' | 'success' | 'warning';
  detail: string;
  risk: string;
};

type DiagramFlow = {
  title: string;
  subtitle: string;
  stages: DiagramStage[];
};

function resolveFlow(moduleId: string, stack: string | undefined, locale: Locale): DiagramFlow {
  const s = `${moduleId} ${stack || ''}`.toLowerCase();
  const isEs = locale === 'es';

  if (s.includes('rag') || s.includes('acl') || s.includes('vector') || s.includes('hybrid') || s.includes('rerank') || s.includes('b04') || s.includes('b05') || s.includes('i01') || s.includes('i02')) {
    return {
      title: isEs ? 'Flujo Visual: RAG Multi-Tenant con ACL antes de Top-K' : 'Visual Flow: Multi-Tenant RAG with Pre-Filter ACL',
      subtitle: isEs
        ? 'Haz clic en cualquier bloque para entender qué controla y qué falla si se omite.'
        : 'Click any block to inspect its role and failure mode.',
      stages: [
        {
          id: 'query',
          label: '1. Query + Identity',
          badge: 'tenant_id + roles',
          tone: 'neutral',
          detail: isEs ? 'El backend firma tenant_id y principals desde JWT verificado (nunca desde el prompt).' : 'Backend extracts tenant_id and principals from verified JWT.',
          risk: isEs ? 'Si confías en el texto del usuario, un prompt puede pedir datos de otro tenant.' : 'Trusting user input enables cross-tenant spoofing.',
        },
        {
          id: 'acl',
          label: '2. Pre-Filter ACL + HNSW',
          badge: 'WHERE + Hybrid RRF',
          tone: 'accent',
          detail: isEs ? 'PostgreSQL/pgvector filtra ACL antes de calcular vecinos HNSW + FTS (RRF).' : 'pgvector enforces ACL before HNSW + FTS (RRF) ranking.',
          risk: isEs ? 'Filtrar después de Top-K provoca recall collapse (0 resultados válidos) o fuga.' : 'Post-filtering causes recall collapse or tenant data leak.',
        },
        {
          id: 'rerank',
          label: '3. Rerank + Delimiter',
          badge: '<untrusted_context>',
          tone: 'warning',
          detail: isEs ? 'Cross-encoder ordena top chunks y los envuelve en delimitadores no confiables.' : 'Cross-encoder reranks chunks and wraps them as untrusted.',
          risk: isEs ? 'Sin delimitador, un PDF malicioso puede ejecutar Prompt Injection.' : 'Without delimiters, poisoned PDFs hijack instructions.',
        },
        {
          id: 'grounded',
          label: '4. Grounded Output',
          badge: 'Citations + Zod',
          tone: 'success',
          detail: isEs ? 'El LLM responde solo con citas verificadas y esquema Zod válido.' : 'LLM emits verified citations validated with Zod schema.',
          risk: isEs ? 'Sin validación de citas, el modelo inventa cláusulas inexistentes.' : 'Unchecked citations allow silent hallucinations.',
        },
      ],
    };
  }

  if (s.includes('security') || s.includes('injection') || s.includes('mcp') || s.includes('tool') || s.includes('hitl') || s.includes('guard')) {
    return {
      title: isEs ? 'Flujo Visual: Defensa contra Prompt Injection & Tool Sandboxing' : 'Visual Flow: Prompt Injection Defense & Tool Sandboxing',
      subtitle: isEs
        ? 'Separa instrucciones del sistema, datos externos y ejecución autorizada.'
        : 'Separate system policy, untrusted data, and authorized tool execution.',
      stages: [
        {
          id: 'policy',
          label: '1. System Policy',
          badge: 'Trusted',
          tone: 'neutral',
          detail: isEs ? 'Reglas inmutables del sistema separadas de cualquier documento recuperado.' : 'Immutable system instructions isolated from retrieved text.',
          risk: isEs ? 'Concatenar strings planos permite sobrescribir reglas.' : 'Plain string concatenation allows instruction override.',
        },
        {
          id: 'sandbox',
          label: '2. Untrusted Data',
          badge: 'Quarantine',
          tone: 'warning',
          detail: isEs ? 'Documentos, emails o PDFs se etiquetan como datos pasivos, nunca órdenes.' : 'Docs/PDFs are tagged as passive data, never commands.',
          risk: isEs ? 'Un texto oculto en PDF puede intentar exfiltrar secretos.' : 'Hidden PDF text can trigger secret exfiltration.',
        },
        {
          id: 'allowlist',
          label: '3. Allowlist + Zod',
          badge: 'MCP Gate',
          tone: 'accent',
          detail: isEs ? 'Solo herramientas declaradas en allowlist con argumentos validados por esquema.' : 'Only allowlisted tools with schema-validated arguments run.',
          risk: isEs ? 'Tool calling abierto permite SSRF o path traversal.' : 'Unrestricted tool calling opens SSRF or path traversal.',
        },
        {
          id: 'hitl',
          label: '4. HITL + Idempotency',
          badge: 'Safe Commit',
          tone: 'success',
          detail: isEs ? 'Acciones destructivas piden aprobación humana y clave idempotente.' : 'Destructive actions require human approval and idempotency key.',
          risk: isEs ? 'Reintentos sin idempotency-key duplican cobros o borrados.' : 'Retries without idempotency keys duplicate side effects.',
        },
      ],
    };
  }

  if (s.includes('agent') || s.includes('langgraph') || s.includes('route') || s.includes('state')) {
    return {
      title: isEs ? 'Flujo Visual: Grafo de Estado Acotado (LangGraph / Routing)' : 'Visual Flow: Bounded State Graph (LangGraph / Routing)',
      subtitle: isEs
        ? 'Cada transición tiene presupuesto, estado tipado y condición de parada determinista.'
        : 'Every transition has a step budget, typed state, and deterministic stop.',
      stages: [
        {
          id: 'router',
          label: '1. Intent Router',
          badge: 'SQL / RAG / Direct',
          tone: 'neutral',
          detail: isEs ? 'Clasifica si la consulta requiere SQL exacto, RAG vectorial o respuesta directa.' : 'Routes query to deterministic SQL, RAG, or direct path.',
          risk: isEs ? 'Enviar conteos exactos al RAG vectorial produce números inventados.' : 'Routing exact aggregations to vector search hallucinates numbers.',
        },
        {
          id: 'state',
          label: '2. Typed State',
          badge: 'max_steps <= 5',
          tone: 'accent',
          detail: isEs ? 'El grafo guarda pasos, tokens gastados y errores en un estado inmutable.' : 'Graph tracks step count, token budget, and errors in state.',
          risk: isEs ? 'Loops sin max_steps disparan costos infinitos en producción.' : 'Unbounded agent loops burn budget in seconds.',
        },
        {
          id: 'tool',
          label: '3. Bounded Tool Node',
          badge: 'Timeout + Retry',
          tone: 'warning',
          detail: isEs ? 'Ejecuta herramienta con timeout estricto y retry budget acotado.' : 'Executes tool with strict timeout and bounded retry budget.',
          risk: isEs ? 'Sin retry budget, un fallo aguas abajo provoca retry storm.' : 'Missing retry budget triggers cascading retry storms.',
        },
        {
          id: 'exit',
          label: '4. Deterministic Exit',
          badge: 'Fallback Ready',
          tone: 'success',
          detail: isEs ? 'Si agota pasos o confianza, degrada con respuesta segura y trazabilidad.' : 'On budget exhaustion, degrades gracefully with trace ID.',
          risk: isEs ? 'Devolver error crudo rompe la UX y expone stack traces.' : 'Uncaught failures break UX and leak internals.',
        },
      ],
    };
  }

  return {
    title: isEs ? 'Flujo Visual: Contrato, Presupuesto FinOps & Observabilidad' : 'Visual Flow: Schema Contract, FinOps Budget & Observability',
    subtitle: isEs
      ? 'Haz clic en cada etapa para ver cómo se controla costo, latencia y calidad.'
      : 'Click each stage to inspect cost, latency, and quality controls.',
    stages: [
      {
        id: 'budget',
        label: '1. Context Budget',
        badge: 'max_input / output',
        tone: 'neutral',
        detail: isEs ? 'Reserva tokens de salida antes de truncar historial o chunks.' : 'Reserve output tokens before trimming history or chunks.',
        risk: isEs ? 'Exceder la ventana trunca el system prompt o corta el JSON.' : 'Overflowing context truncates JSON or system rules.',
      },
      {
        id: 'schema',
        label: '2. Structured Output',
        badge: 'Zod / JSON Schema',
        tone: 'accent',
        detail: isEs ? 'Valida tipos en tiempo de ejecución antes de persistir o responder.' : 'Validate runtime types before persisting or returning.',
        risk: isEs ? 'Texto libre rompe consumidores downstream y pipelines.' : 'Unvalidated text breaks downstream APIs.',
      },
      {
        id: 'otel',
        label: '3. OTel Without PII',
        badge: 'Redacted Spans',
        tone: 'warning',
        detail: isEs ? 'Emite latencia, modelo y tokens sin guardar prompts crudos ni secretos.' : 'Record latency, model, and tokens without raw PII.',
        risk: isEs ? 'Loguear prompts sin redactar viola GDPR/privacidad.' : 'Logging raw prompts leaks customer PII.',
      },
      {
        id: 'eval',
        label: '4. Evals & Gate',
        badge: 'Recall@K + Cost',
        tone: 'success',
        detail: isEs ? 'Mide Recall@K, Faithfulness y costo por request antes de liberar.' : 'Measure Recall@K, Faithfulness, and unit cost before release.',
        risk: isEs ? 'Desplegar sin Golden Set oculta regresiones silenciosas.' : 'Shipping without golden evals hides silent regressions.',
      },
    ],
  };
}

export function AiArchitectureDiagram({
  moduleId,
  stack,
  locale,
  reducedMotion = false,
}: {
  moduleId: string;
  stack?: string;
  locale: Locale;
  reducedMotion?: boolean;
}) {
  const flow = resolveFlow(moduleId, stack, locale);
  const [activeIdx, setActiveIdx] = useState(0);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    setActiveIdx(0);
    setSimulating(false);
  }, [moduleId]);

  useEffect(() => {
    if (!simulating) return;
    const stepMs = reducedMotion ? 350 : 900;
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => {
        if (prev >= flow.stages.length - 1) {
          setSimulating(false);
          return prev;
        }
        return prev + 1;
      });
    }, stepMs);
    return () => window.clearInterval(timer);
  }, [simulating, flow.stages.length, reducedMotion]);

  const activeStage = flow.stages[activeIdx] || flow.stages[0];

  return (
    <section class="arch-diagram-card" aria-label={flow.title}>
      <div class="arch-diagram-head">
        <div>
          <span class="eyebrow small">ARCHITECTURE DIAGRAM · {moduleId}</span>
          <h3>{flow.title}</h3>
          <p>{flow.subtitle}</p>
        </div>
        <Button
          kind="outline"
          onClick={() => {
            setActiveIdx(0);
            setSimulating(true);
          }}
        >
          <Icon name="play" size={14} />
          {locale === 'es' ? 'Simular flujo' : 'Simulate flow'}
        </Button>
      </div>

      <div class="arch-flow-track" role="tablist" aria-label={flow.title}>
        {flow.stages.map((stage, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div class="arch-flow-step" key={stage.id}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                class={`arch-node tone-${stage.tone} ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSimulating(false);
                  setActiveIdx(idx);
                }}
              >
                <span class="arch-node-badge">{stage.badge}</span>
                <strong>{stage.label}</strong>
              </button>
              {idx < flow.stages.length - 1 && (
                <span
                  class={`arch-connector ${idx < activeIdx ? 'passed' : ''}`}
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>

      <output class="arch-stage-detail" aria-live="polite">
        <div class="arch-detail-col">
          <span class="arch-detail-label">
            {locale === 'es' ? 'Qué ocurre en esta etapa' : 'What happens here'}
          </span>
          <p>{activeStage.detail}</p>
        </div>
        <div class="arch-detail-col risk">
          <span class="arch-detail-label">
            {locale === 'es' ? 'Qué falla si se omite' : 'Failure mode if skipped'}
          </span>
          <p>{activeStage.risk}</p>
        </div>
      </output>
    </section>
  );
}
