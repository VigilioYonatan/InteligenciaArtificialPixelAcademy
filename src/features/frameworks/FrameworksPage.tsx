import { useEffect, useState } from 'preact/hooks';
import { routeTo } from '../../app/router';
import curriculum from '../../data/curriculum.json';
import { frameworkCurriculum } from '../../data/frameworks-curriculum';
import { CodeEditorShell } from '../../shared/ui/CodeEditorShell';
import { Button, Card, Icon, Mascot, PageHeading } from '../../shared/ui/primitives';
import { AxonPlayer } from '../cinema/AxonPlayer';
import { getCinemaDeck } from '../cinema/data/storyboards';
import { AiArchitectureDiagram } from '../learning/AiArchitectureDiagram';
import type { Locale, Module } from '../learning/types/learning.types';
import { markModuleCompleted, prefsSignal, updateDraft } from '../progress/model/progress.signal';
import { frameworkSnippets } from './constants/framework-snippets';
import { frameworkUnits } from './data/framework-units';

const modules = curriculum as Module[];

export function FrameworksPage({
  t,
  locale,
  id,
  unitId,
}: {
  t: (k: string) => string;
  locale: Locale;
  id?: string;
  unitId?: string;
}) {
  const prefs = prefsSignal.value;
  const frameworks = modules.filter((m) => m.track === 'frameworks');
  const m = frameworks.find((item) => item.id === id);
  const curr = m ? frameworkCurriculum[m.id] : undefined;
  const unitNum = unitId ? Number.parseInt(unitId, 10) : Number.NaN;
  const unitList = m ? frameworkUnits[m.id] || [] : [];
  const activeUnit = Number.isInteger(unitNum) ? unitList.find((u) => u.unit === unitNum) : undefined;
  const storageId = m && activeUnit ? `${m.id}-${activeUnit.unit}` : '';

  const [code, setCode] = useState(
    (storageId && prefs.drafts[storageId]) || activeUnit?.starterCode || '',
  );
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    setCode((storageId && prefs.drafts[storageId]) || activeUnit?.starterCode || '');
    setShowHint(false);
    setFeedback(null);
  }, [storageId]);

  if (m && activeUnit) {
    const unitTitle = curr?.units[locale]?.[activeUnit.unit - 1] || `Unit ${activeUnit.unit}`;
    return (
      <div class="content-page">
        <div class="breadcrumbs">
          <a href="#/frameworks">{t('frameworks')}</a>
          <span>/</span>
          <a href={`#/frameworks/${m.id}`}>{m.id}</a>
          <span>/</span>
          <b>{activeUnit.unit}/5</b>
        </div>
        <PageHeading
          eyebrow={`${m.id} · UNIT ${activeUnit.unit}`}
          title={unitTitle}
          subtitle={m.title[locale]}
        />
        <div class="framework-detail">
          <AiArchitectureDiagram
            moduleId={`${m.id}-${activeUnit.unit}`}
            stack={`${m.id} ${unitTitle}`}
            locale={locale}
            reducedMotion={prefs.reducedMotion}
          />
          <Card>
            <h2>⚠️ Production Pitfall</h2>
            <p class="notice">{activeUnit.pitfall}</p>
            <CodeEditorShell
              fileName={`unit_${activeUnit.unit}.ts`}
              badge={prefs.completed.includes(storageId) ? `✓ ${t('completed')}` : m.id}
              ariaLabel={unitTitle}
              value={code}
              fontSize={prefs.fontSize || 'md'}
              onChange={(v) => {
                setCode(v);
                updateDraft(storageId, v);
                setFeedback(null);
              }}
            />
            <div class="editor-actions">
              <Button
                onClick={() => {
                  const ok = activeUnit.test(code);
                  setFeedback(ok ? 'correct' : 'incorrect');
                  if (ok) markModuleCompleted(storageId);
                }}
              >
                <Icon name="check" size={18} />
                {t('validate')}
              </Button>
              <Button
                kind="outline"
                onClick={() => {
                  setCode(activeUnit.starterCode);
                  updateDraft(storageId, activeUnit.starterCode);
                  setFeedback(null);
                }}
              >
                {t('reset')}
              </Button>
              <Button kind="quiet" onClick={() => setShowHint(!showHint)}>
                {t('hint')}
              </Button>
            </div>
            {showHint && (
              <div class="hint-box">
                <Icon name="question" size={18} />
                <code>{activeUnit.hint}</code>
              </div>
            )}
            {feedback && (
              <div class={`feedback ${feedback}`}>
                {feedback === 'correct' ? '✓ ' : '○ '}
                {t(feedback)}
              </div>
            )}
          </Card>
          <Card>
            <Mascot name="building" />
            <h3>{m.title[locale]}</h3>
            <ol class="framework-units-list">
              {(curr?.units[locale] || []).map((label, idx) => (
                <li key={idx}>
                  <a href={`#/frameworks/${m.id}/${idx + 1}`}>{label}</a>
                </li>
              ))}
            </ol>
            <Button kind="outline" onClick={() => routeTo(`frameworks/${m.id}`)}>
              {t('back')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (m) {
    const fwDeck = getCinemaDeck(m.id);
    return (
      <div class="content-page">
        <div class="breadcrumbs">
          <a href="#/frameworks">{t('frameworks')}</a>
          <span>/</span>
          <b>{m.id}</b>
        </div>
        <PageHeading
          eyebrow={`FRAMEWORKS ACADEMY · ${m.id}`}
          title={m.title[locale]}
          subtitle={m.summary[locale]}
        />
        {fwDeck && <AxonPlayer deck={fwDeck} locale={locale} compact />}
        <div class="framework-detail">
          <AiArchitectureDiagram
            moduleId={m.id}
            stack={m.title.en}
            locale={locale}
            reducedMotion={prefs.reducedMotion}
          />
          <Card>
            <h2>{t('objectives')}</h2>
            <div class="chip-line">
              {m.tools?.map((x) => (
                <span class="chip" key={x}>
                  {x}
                </span>
              ))}
            </div>
            <div class="notice">{t('frameworkHint')}</div>
            <h3>5 Unidades Interactivas</h3>
            <ol class="framework-units-list">
              {(curr?.units[locale] || []).map((unitText, uIdx) => {
                const done = prefs.completed.includes(`${m.id}-${uIdx + 1}`);
                return (
                  <li key={uIdx}>
                    <a href={`#/frameworks/${m.id}/${uIdx + 1}`}>
                      {unitText} {done ? '✓' : '→'}
                    </a>
                  </li>
                );
              })}
            </ol>
            <pre class="mini-code">{frameworkSnippets[m.id] || `// ${m.title.en}\n// AI architecture lab`}</pre>
          </Card>
          <Card>
            <Mascot name="building" />
            <h3>{t('challenge')}</h3>
            <p>{curr?.subtitle[locale] || m.summary[locale]}</p>
            <div class="editor-actions">
              <Button onClick={() => routeTo(`frameworks/${m.id}/1`)}>{t('start')}</Button>
              <Button kind="outline" onClick={() => routeTo('frameworks')}>
                {t('back')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div class="content-page">
      <PageHeading
        eyebrow={
          locale === 'es'
            ? 'ESPECIALIZACIÓN TECNOLÓGICA'
            : locale === 'en'
              ? 'BACKEND SPECIALIZATION'
              : locale === 'ja'
                ? '技術特化トラック'
                : locale === 'zh'
                  ? '专业技术方向'
                  : locale === 'pt'
                    ? 'ESPECIALIZAÇÃO TECNOLÓGICA'
                    : 'SPÉCIALISATION TECHNIQUE'
        }
        title={
          locale === 'es'
            ? 'Frameworks & Ecosistema AI'
            : locale === 'en'
              ? 'AI Frameworks & Ecosystem'
              : locale === 'ja'
                ? 'AI フレームワークとエコシステム'
                : locale === 'zh'
                  ? 'AI 框架与生态学院'
                  : locale === 'pt'
                    ? 'Frameworks e Ecossistema AI'
                    : 'Frameworks et écosystème AI'
        }
        subtitle={
          locale === 'es'
            ? 'Rutas técnicas independientes con cinco unidades de estudio cada una. Los proyectos de backend o microservicios se ejecutan en tu entorno de desarrollo local.'
            : locale === 'en'
              ? 'Independent specialization tracks with five study units each. Backend and microservice projects run in your local development environment.'
              : locale === 'ja'
                ? '各5つの学習ユニットで構成された専門トラック。バックエンドやマイクロサービスのプロジェクトはローカル開発環境で実行します。'
                : locale === 'zh'
                  ? '独立专业技术方向，每个方向包含 5 个核心学习单元。后端与微服务项目在本地开发环境中运行。'
                  : locale === 'pt'
                    ? 'Trilhas técnicas independentes com cinco unidades de estudo cada. Projetos de backend rodam no seu ambiente local.'
                    : "Parcours techniques indépendants de 5 unités chacun. Les projets backend s'exécutent dans votre environnement local."
        }
      />
      <div class="framework-grid framework-grid-v2">
        {frameworks.map((fm) => {
          const curr = frameworkCurriculum[fm.id];
          return (
            <a href={`#/frameworks/${fm.id}`} class="framework-card framework-card-v2" key={fm.id}>
              <div class="framework-card-head">
                <div class="framework-card-title-row">
                  <h3>
                    {fm.id} · {fm.title[locale]}
                  </h3>
                  <span class="framework-arrow">↗</span>
                </div>
                <p class="framework-card-subtitle">{curr?.subtitle[locale] || fm.summary[locale]}</p>
              </div>
              <ol class="framework-units-list">
                {(
                  curr?.units[locale] || [
                    `1. Introducción a ${fm.title[locale]}`,
                    '2. Flujo básico y enrutamiento',
                    '3. Testing y benchmarks',
                    '4. Errores y seguridad',
                    `5. Proyecto de ${fm.title[locale]}`,
                  ]
                ).map((unitText, uIdx) => (
                  <li key={uIdx}>{unitText}</li>
                ))}
              </ol>
              <div class="framework-card-footer">
                <span class="framework-status-badge">
                  {locale === 'es'
                    ? 'Temario publicado · laboratorios interactivos'
                    : locale === 'en'
                      ? 'Syllabus published · interactive labs'
                      : locale === 'ja'
                        ? 'シラバス公開中 · インタラクティブラボ'
                        : locale === 'zh'
                          ? '课程大纲已发布 · 交互式实验'
                          : locale === 'pt'
                            ? 'Ementa publicada · laboratórios interativos'
                            : 'Programme publié · laboratoires interactifs'}
                </span>
              </div>
            </a>
          );
        })}
      </div>
      <Card className="framework-benchmarks">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span class="eyebrow small">
              {locale === 'es'
                ? 'MATRIZ DE PRODUCCIÓN AI'
                : locale === 'en'
                  ? 'AI PRODUCTION MATRIX'
                  : locale === 'ja'
                    ? 'AI 本番アーキテクチャ比較'
                    : locale === 'zh'
                      ? 'AI 生产架构矩阵'
                      : locale === 'pt'
                        ? 'MATRIZ DE PRODUÇÃO AI'
                        : 'MATRICE DE PRODUCTION IA'}
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: '20px' }}>
              {locale === 'es'
                ? 'SLO de Latencia, Seguridad & Rol en el Stack AI'
                : locale === 'en'
                  ? 'Latency SLO, Security & Role in the AI Stack'
                  : locale === 'ja'
                    ? 'AI スタックのレイテンシ SLO と役割'
                    : locale === 'zh'
                      ? 'AI 技术栈延迟 SLO 与安全职责对比'
                      : locale === 'pt'
                        ? 'SLO de Latência, Segurança & Papel no Stack AI'
                        : 'SLO de latence, sécurité et rôle dans le stack IA'}
            </h2>
          </div>
          <span class="tag gold">Canon Vigilio 2026</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table class="benchmark-table">
            <thead>
              <tr>
                <th>Stack / Framework</th>
                <th>Capa Principal</th>
                <th>Target P95</th>
                <th>Control Crítico</th>
                <th>{locale === 'es' ? 'Caso de uso en Producción' : 'Production Use Case'}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><b>F01 · LangGraph</b></td><td>StateGraph + Checkpoints</td><td>&lt; 1.8 s (TTFT)</td><td>recursionLimit + HITL</td><td>Agentes multi-paso acotados con aprobación humana e idempotencia</td></tr>
              <tr><td><b>F02 · pgvector + FTS</b></td><td>Hybrid Retrieval (RRF)</td><td>&lt; 45 ms</td><td>WHERE tenant_id + ACL</td><td>Búsqueda híbrida léxica + densa con iterative_scan multi-tenant</td></tr>
              <tr><td><b>F03 · NestJS + Zod</b></td><td>AI API Gateway</td><td>&lt; 25 ms</td><td>AuthGuard + BudgetPort</td><td>Contratos tipados, SSE streaming y reserva atómica de presupuesto</td></tr>
              <tr><td><b>F04 · FastAPI + Rerank</b></td><td>Ingestion &amp; Cross-Encoder</td><td>&lt; 120 ms</td><td>SHA-256 Idempotency</td><td>Workers de ingesta documental y reranking acotado sin bloquear event loop</td></tr>
              <tr><td><b>F05 · MCP Server</b></td><td>Tool Calling Protocol</td><td>&lt; 60 ms</td><td>Allowlist + Path Sandbox</td><td>Exposición segura de herramientas internas sin SSRF ni path traversal</td></tr>
              <tr><td><b>F06 · Ragas &amp; Evals</b></td><td>CI/CD Quality Gate</td><td>Pre-Release</td><td>Recall@K + Faithfulness</td><td>Detección de regresiones con Golden Sets sin fuga temporal</td></tr>
              <tr><td><b>F07 · OpenTelemetry</b></td><td>GenAI Observability</td><td>&lt; 2 ms</td><td>PII &amp; Secret Redaction</td><td>Trazas de latencia, modelo y costo por tenant en Langfuse/Phoenix sin PII</td></tr>
              <tr><td><b>F08 · vLLM &amp; FinOps</b></td><td>Serving &amp; Release Gate</td><td>&lt; 35 ms/tok</td><td>Auth + Hard Budget Cap</td><td>Inferencia GPU aislada con límite de concurrencia y matriz Go/No-Go (32)</td></tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
