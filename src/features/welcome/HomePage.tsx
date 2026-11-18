import { useState } from 'preact/hooks';
import { routeTo } from '../../app/router';
import { Button, Icon, Mascot } from '../../shared/ui/primitives';
import { tracks, trackStyles } from '../learning/constants/learning.constants';
import type { RouteTrack } from '../learning/types/learning.types';

export type TrackPercentages = Record<'basic' | 'intermediate' | 'advanced' | 'senior', number>;

const LIVE_FLOW_SCENARIOS = [
  {
    id: 'rag',
    label: 'Multi-Tenant RAG',
    metrics: 'p95: 138ms · Recall@K: 98% · Leak: 0%',
    steps: ['JWT tenant_id', 'pgvector WHERE ACL', 'Cross-Encoder Rerank', 'Citations + Zod'],
  },
  {
    id: 'shield',
    label: 'Prompt Shield',
    metrics: 'Blocked: 100% · MCP Allowlist · HITL: Ready',
    steps: ['System Policy', '<untrusted_context>', 'Zod Tool Gate', 'Idempotent Commit'],
  },
  {
    id: 'finops',
    label: 'FinOps Budget',
    metrics: 'Cost: $0.0014/req · OTel: No PII · Gate: PASS',
    steps: ['Reserve Tokens', 'Semantic Cache', 'Bounded Retry', 'OTel Span Redacted'],
  },
] as const;

const AI_PRODUCTION_STACKS = [
  { category: 'Vector DB', name: 'pgvector + HNSW', summary: 'Pre-filter ACL + Hybrid FTS/RRF' },
  { category: 'Orchestration', name: 'LangGraph + State', summary: 'Bounded loops & typed checkpoints' },
  { category: 'Tools & Auth', name: 'MCP + Zod Allowlist', summary: 'Sandboxed tool calling & HITL' },
  { category: 'Security', name: 'Prompt Shield', summary: 'Untrusted delimiters & zero-leak' },
  { category: 'Evals', name: 'Ragas + Golden Set', summary: 'Recall@K, nDCG & Faithfulness' },
  { category: 'Observability', name: 'OTel + Langfuse', summary: 'Traces & tokens without PII' },
  { category: 'Backend', name: 'NestJS / FastAPI', summary: 'Idempotent ingestion & contracts' },
  { category: 'FinOps', name: 'Atomic Budget', summary: 'Token caps & 32 Release Gates' },
];

export function HomePage({ t, trackPcts }: { t: (k: string) => string; trackPcts: TrackPercentages }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(3);
  const scenario = LIVE_FLOW_SCENARIOS[scenarioIdx] || LIVE_FLOW_SCENARIOS[0];

  return (
    <>
      <section class="hero hero-senior">
        <div class="hero-glow" aria-hidden="true" />
        <div class="hero-copy">
          <div class="hero-pill">
            <span class="live-dot" />
            <span>{t('heroEyebrow')}</span>
          </div>
          <h1>
            AI<span>Pixel</span>
            <br />
            Academy
          </h1>
          <p class="hero-title">{t('heroTitle')}</p>
          <p class="hero-subtitle">{t('heroSubtitle')}</p>
          <div class="hero-ctas">
            <Button onClick={() => routeTo('lesson/B01')}>
              <Icon name="play" size={20} />
              {t('start')}
            </Button>
            <Button kind="outline" onClick={() => routeTo('learn')}>
              {t('explore')} →
            </Button>
            <Button kind="quiet" onClick={() => routeTo('games/arena3d')}>
              <Icon name="network" size={17} />
              3D Arena
            </Button>
          </div>
          <div class="hero-proof">
            <div class="avatar-stack" aria-hidden="true">
              <span>⚡</span>
              <span>🛡</span>
              <span>⌘</span>
            </div>
            <span>
              <b>54</b> AI Modules · <b>18</b> Senior · <b>8</b> Frameworks · <b>6</b> 🌐
            </span>
          </div>
        </div>

        <section class="hero-art" aria-label="Axon AI Mascot y arquitectura de producción">
          <div class="art-ring ring-one" aria-hidden="true" />
          <div class="art-ring ring-two" aria-hidden="true" />
          <span class="orbit-chip chip-top hero-orbit-a">
            <Icon name="search" size={14} /> RAG + pgvector
          </span>
          <span class="orbit-chip chip-left hero-orbit-b">
            <Icon name="network" size={14} /> LangGraph + MCP
          </span>
          <span class="orbit-chip chip-right hero-orbit-c">
            <Icon name="shield" size={14} /> ACL + Evals
          </span>
          <span class="orbit-chip chip-bottom hero-orbit-d">
            <Icon name="terminal" size={14} /> OTel + FinOps
          </span>
          <Mascot name="coding" className="hero-gopher" />
          <div class="mascot-floor" aria-hidden="true" />
          <div class="code-float">
            <span>● ● ● &nbsp; rag-pipeline.ts</span>
            <code>
              await budget.reserve(tenantId);
              <br />
              const hits = await hybridRag({'{'} acl {'}'});
              <br />
              return agentGraph.invoke(hits);
            </code>
          </div>
        </section>
      </section>

      <section class="stats-strip" aria-label="Indicadores del programa">
        <div class="stat-cell">
          <span class="stat-symbol">
            <Icon name="book" size={18} />
          </span>
          <strong class="tabular-nums">54</strong>
          <small>AI MODULES</small>
        </div>
        <div class="stat-cell">
          <span class="stat-symbol">
            <Icon name="crown" size={18} />
          </span>
          <strong class="tabular-nums">18</strong>
          <small>SENIOR LABS</small>
        </div>
        <div class="stat-cell">
          <span class="stat-symbol">
            <Icon name="network" size={18} />
          </span>
          <strong class="tabular-nums">8</strong>
          <small>FRAMEWORKS AI</small>
        </div>
        <div class="stat-cell">
          <span class="stat-symbol">
            <Icon name="puzzle" size={18} />
          </span>
          <strong class="tabular-nums">50 + 3D</strong>
          <small>MINIJUEGOS &amp; ARENA</small>
        </div>
      </section>

      <section class="home-live-flow" aria-label="Simulador interactivo de arquitectura">
        <div class="home-live-head">
          <div>
            <span class="eyebrow small">LIVE ARCHITECTURE TELEMETRY</span>
            <h3>Explora un flujo de producción en vivo</h3>
          </div>
          <div class="home-live-tabs">
            {LIVE_FLOW_SCENARIOS.map((sc, idx) => (
              <Button
                key={sc.id}
                kind={idx === scenarioIdx ? 'primary' : 'outline'}
                onClick={() => {
                  setScenarioIdx(idx);
                  setActiveStep(0);
                }}
              >
                {sc.label}
              </Button>
            ))}
          </div>
        </div>
        <div class="arch-flow-track">
          {scenario.steps.map((step, idx) => (
            <div class="arch-flow-step" key={step}>
              <button
                type="button"
                class={`arch-node ${idx <= activeStep ? 'active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <span class="arch-node-badge">STAGE 0{idx + 1}</span>
                <strong>{step}</strong>
              </button>
              {idx < scenario.steps.length - 1 && (
                <span class={`arch-connector ${idx < activeStep ? 'passed' : ''}`} aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <div class="home-live-foot tabular-nums">
          <span>{scenario.metrics}</span>
          <a href="#/games/arena3d" class="text-link">
            Probar en 3D Arena →
          </a>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <span class="eyebrow small">AI ARCHITECTURE MAP</span>
            <h2>{t('featured')}</h2>
          </div>
          <a href="#/learn" class="text-link">
            {t('showAll')} →
          </a>
        </div>
        <div class="track-grid">
          {tracks.map((track, idx) => (
            <TrackCard
              track={track}
              index={idx}
              t={t}
              pct={track === 'frameworks' ? 0 : trackPcts[track]}
              key={track}
            />
          ))}
        </div>
      </section>

      <section class="home-stack-strip" aria-label="Stack de Arquitectura AI en Producción">
        <div class="home-stack-head">
          <div>
            <span class="eyebrow small">CANON VIGILIO · AI-RAG-LLMOPS-FINOPS</span>
            <h3>Stack de Producción que dominarás</h3>
          </div>
          <a href="#/frameworks" class="text-link">
            Explorar Frameworks →
          </a>
        </div>
        <div class="home-stack-pills">
          {AI_PRODUCTION_STACKS.map((item) => (
            <a class="home-stack-pill" href="#/frameworks" key={item.name}>
              <small>{item.category}</small>
              <strong>{item.name}</strong>
              <span>{item.summary}</span>
            </a>
          ))}
        </div>
      </section>

      <section class="feature-banner">
        <div>
          <span class="eyebrow">SENIOR MODE · PRODUCTION AI</span>
          <h2>Design resilient RAG, Agents &amp; FinOps.</h2>
          <p>{t('briefHint')}</p>
          <div class="hero-ctas">
            <Button kind="senior" onClick={() => routeTo('senior')}>
              <Icon name="crown" size={18} />
              {t('senior')}
            </Button>
            <Button kind="outline" onClick={() => routeTo('games/arena3d')}>
              <Icon name="network" size={18} />
              3D Vector Arena
            </Button>
          </div>
        </div>
        <Mascot name="senior" />
      </section>
    </>
  );
}

function TrackCard({
  track,
  index,
  t,
  pct,
}: {
  track: RouteTrack;
  index: number;
  t: (k: string) => string;
  pct: number;
}) {
  const style = trackStyles[track];
  const count = track === 'senior' ? 18 : 12;
  const labelKey =
    track === 'basic'
      ? 'basic'
      : track === 'intermediate'
        ? 'intermediate'
        : track === 'advanced'
          ? 'advanced'
          : 'senior';
  const desc =
    track === 'senior'
      ? 'Production AI incidents · ACL · FinOps'
      : track === 'advanced'
        ? 'Agentic RAG · MCP · HNSW · Model Ops'
        : track === 'intermediate'
          ? 'Hybrid Search · LangGraph · Evals · OTel'
          : 'Tokens · Zod Schemas · Embeddings · pgvector';

  return (
    <a class={`track-card ${style.className}`} href={`#/${track === 'senior' ? 'senior' : `learn/${track}`}`}>
      <div class="track-top">
        <span class="track-icon">
          <Icon name={style.icon} size={27} />
        </span>
        <span class="track-count tabular-nums">{count} MODULES</span>
      </div>
      <div class="level-ghost-num" aria-hidden="true">
        0{index + 1}
      </div>
      <span class="level-step">{track === 'senior' ? 'SENIOR MODE' : `NIVEL 0${index + 1}`}</span>
      <h3>{t(labelKey)}</h3>
      <p>{desc}</p>
      <div class="track-bottom">
        <div class="progress-bar">
          <i style={{ width: `${pct}%` }} />
        </div>
        <span class="round-arrow">↗</span>
      </div>
    </a>
  );
}
