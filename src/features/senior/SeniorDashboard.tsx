import { useState } from 'preact/hooks';
import curriculum from '../../data/curriculum.json';
import type { Locale } from '../learning/types/learning.types';
import {
  categoryLabels,
  moduleCategories,
  statusLabels,
} from './constants/senior.constants';
import type {
  SeniorCategory,
  SeniorDashboardProps,
  StatusFilter,
} from './types/senior.types';

const labels: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    statScenarios: string;
    statQuestions: string;
    statEvidence: string;
    statInvestigations: string;
    statOperations: string;
    statReviews: string;
    statSimulators: string;
    statNative: string;
    statCompleted: string;
    nativeBtn: string;
    readinessBtn: string;
    capstoneBtn: string;
    notice: string;
    viewModule: string;
    newBadge: string;
  }
> = {
  es: {
    eyebrow: '✦ SENIOR AI ARCHITECTURE LAB',
    title: 'Senior Mode',
    subtitle:
      'Incidentes reales de Arquitectura de IA en producción: RAG Multi-Tenant, LangGraph, MCP, Evals, Observabilidad sin PII y FinOps.',
    statScenarios: '18 INCIDENTES AI',
    statQuestions: '54 DECISIONES ADR',
    statEvidence: '18 LABS DE EVIDENCIAS',
    statInvestigations: '18 INVESTIGACIONES',
    statOperations: '18 LABS OPERATIVOS',
    statReviews: '18 CODE REVIEWS AI',
    statSimulators: '6 SIMULADORES',
    statNative: '18 LABS PYTHON AI',
    statCompleted: 'GATES SUPERADOS',
    nativeBtn: 'Labs Python AI reales (18) ↓',
    readinessBtn: 'Matriz de Readiness →',
    capstoneBtn: 'Capstone Plataforma AI →',
    notice:
      'Evaluación determinista de Arquitectura de IA. La ejecución nativa real vive en los paquetes Python reproducibles descargables.',
    viewModule: 'Abrir incidente',
    newBadge: 'PENDIENTE',
  },
  en: {
    eyebrow: '✦ SENIOR AI ARCHITECTURE LAB',
    title: 'Senior Mode',
    subtitle:
      'Production AI Architecture incidents: Multi-Tenant RAG, LangGraph, MCP, Evals, Zero-PII Observability, and FinOps.',
    statScenarios: '18 AI INCIDENTS',
    statQuestions: '54 ADR DECISIONS',
    statEvidence: '18 EVIDENCE LABS',
    statInvestigations: '18 INVESTIGATIONS',
    statOperations: '18 OPERATIONS LABS',
    statReviews: '18 AI CODE REVIEWS',
    statSimulators: '6 SIMULATORS',
    statNative: '18 NATIVE PYTHON LABS',
    statCompleted: 'PASSED GATES',
    nativeBtn: 'Native Python AI · 18 labs ↓',
    readinessBtn: 'Readiness matrix →',
    capstoneBtn: 'AI Platform Capstone →',
    notice:
      'Objective and deterministic AI architecture assessment. Real native execution runs locally via downloadable Python unittest suites.',
    viewModule: 'Open incident',
    newBadge: 'PENDING',
  },
  ja: {
    eyebrow: '✦ シニア AI アーキテクチャラボ',
    title: 'Senior Mode',
    subtitle:
      '本番 AI システムの障害と設計：マルチテナント RAG、LangGraph、MCP、評価、FinOps。',
    statScenarios: '18のAIシナリオ',
    statQuestions: '54のADR設問',
    statEvidence: '18の証拠ラボ',
    statInvestigations: '18の調査ラボ',
    statOperations: '18の運用ラボ',
    statReviews: '18のAIコードレビュー',
    statSimulators: '6のシミュレーター',
    statNative: '18のPython AIラボ',
    statCompleted: '完了ゲート',
    nativeBtn: 'Python AI · 18ラボ ↓',
    readinessBtn: 'スキルマトリクス →',
    capstoneBtn: 'AI キャップストーン →',
    notice:
      '客観的かつ決定論的な AI 設計評価です。実際のコード検証は同梱の Python unittest ラボで実行します。',
    viewModule: 'インシデントを開く',
    newBadge: '未着手',
  },
  zh: {
    eyebrow: '✦ 高级 AI 架构实验室',
    title: 'Senior Mode',
    subtitle: '生产级 AI 架构事故与决策：多租户 RAG、LangGraph、MCP、评估体系与 FinOps。',
    statScenarios: '18 个 AI 生产场景',
    statQuestions: '54 道架构决策题',
    statEvidence: '18 个证据实验室',
    statInvestigations: '18 个调查分析',
    statOperations: '18 个运维实验室',
    statReviews: '18 个 AI 代码审查',
    statSimulators: '6 个交互模拟器',
    statNative: '18 个 Python 原生实验',
    statCompleted: '已通过门禁',
    nativeBtn: 'Python AI · 18 原生实验 ↓',
    readinessBtn: '能力矩阵 →',
    capstoneBtn: 'AI 平台毕业项目 →',
    notice: '确定性 AI 架构评估。真实本地代码执行通过可下载的 Python unittest 实验包完成。',
    viewModule: '打开场景',
    newBadge: '待开始',
  },
  pt: {
    eyebrow: '✦ SENIOR AI ARCHITECTURE LAB',
    title: 'Senior Mode',
    subtitle:
      'Incidentes reais de Arquitetura de IA em produção: RAG Multi-Tenant, LangGraph, MCP, Evals, Observabilidade e FinOps.',
    statScenarios: '18 INCIDENTES AI',
    statQuestions: '54 DECISÕES ADR',
    statEvidence: '18 LABS DE EVIDÊNCIAS',
    statInvestigations: '18 INVESTIGAÇÕES',
    statOperations: '18 LABS OPERACIONAIS',
    statReviews: '18 CODE REVIEWS AI',
    statSimulators: '6 SIMULADORES',
    statNative: '18 LABS PYTHON AI',
    statCompleted: 'GATES CONCLUÍDOS',
    nativeBtn: 'Labs Python AI · 18 labs ↓',
    readinessBtn: 'Matriz de prontidão →',
    capstoneBtn: 'Capstone Plataforma AI →',
    notice:
      'Avaliação determinística de Arquitetura de IA. A execução nativa real roda nos pacotes Python unittest baixáveis.',
    viewModule: 'Abrir incidente',
    newBadge: 'PENDENTE',
  },
  fr: {
    eyebrow: '✦ LABORATOIRE ARCHITECTURE IA SENIOR',
    title: 'Senior Mode',
    subtitle:
      'Incidents réels d’architecture IA en production : RAG Multi-Tenant, LangGraph, MCP, Evals, Observabilité et FinOps.',
    statScenarios: '18 INCIDENTS IA',
    statQuestions: '54 DÉCISIONS ADR',
    statEvidence: '18 LABS DE PREUVES',
    statInvestigations: '18 INVESTIGATIONS',
    statOperations: '18 LABS OPÉRATIONNELS',
    statReviews: '18 REVUES DE CODE IA',
    statSimulators: '6 SIMULATEURS',
    statNative: '18 LABS PYTHON IA',
    statCompleted: 'GATES VALIDÉS',
    nativeBtn: 'Labs Python IA · 18 labs ↓',
    readinessBtn: 'Matrice de compétences →',
    capstoneBtn: 'Capstone Plateforme IA →',
    notice:
      'Évaluation déterministe d’architecture IA. L’exécution native réelle s’effectue via les paquets Python unittest téléchargeables.',
    viewModule: 'Ouvrir l’incident',
    newBadge: 'EN ATTENTE',
  },
};

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export function SeniorDashboard({
  locale,
  seniorResults,
  evidenceResults,
  investigationResults,
  operationsResults,
  reviewResults,
}: SeniorDashboardProps) {
  const t = labels[locale] || labels.es;
  const seniors = curriculum.filter((m) => m.track === 'senior');
  const [activeCategory, setActiveCategory] = useState<SeniorCategory>('all');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');

  const categories: SeniorCategory[] = [
    'all',
    'concurrency',
    'resilience',
    'performance',
    'architecture',
    'operations',
  ];
  const statusFilters: StatusFilter[] = ['all', 'completed', 'progress', 'idle'];

  const getPassCount = (id: string) =>
    [
      seniorResults[id]?.passed,
      evidenceResults[id]?.passed,
      investigationResults[id]?.passed,
      operationsResults[id]?.passed,
      reviewResults[id]?.passed,
    ].filter(Boolean).length;

  const filteredSeniors = seniors.filter((s) => {
    const categoryMatches = activeCategory === 'all' || moduleCategories[s.id] === activeCategory;
    const count = getPassCount(s.id);
    const statusMatches =
      activeStatus === 'all' ||
      (activeStatus === 'completed' && count === 5) ||
      (activeStatus === 'progress' && count > 0 && count < 5) ||
      (activeStatus === 'idle' && count === 0);
    return categoryMatches && statusMatches;
  });

  const totalFinished =
    Object.keys(seniorResults).length +
    Object.keys(evidenceResults).length +
    Object.keys(investigationResults).length +
    Object.keys(operationsResults).length +
    Object.keys(reviewResults).length;

  return (
    <div class="content-page senior-dashboard-view">
      <div class="senior-hero senior-hero-clean">
        <div>
          <span class="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div class="senior-stats">
            <span>{t.statScenarios}</span>
            <span>{t.statQuestions}</span>
            <span>{t.statEvidence}</span>
            <span>{t.statInvestigations}</span>
            <span>{t.statOperations}</span>
            <span>{t.statReviews}</span>
            <span>{t.statNative}</span>
            <span>
              {totalFinished}/90 {t.statCompleted}
            </span>
          </div>
        </div>
        <img class="mascot gopher" src={asset('mascot/senior.png')} alt="" aria-hidden="true" />
      </div>

      <div class="native-links">
        <a class="btn btn-senior" href="#/senior/native">
          {t.nativeBtn}
        </a>
        <a class="btn btn-outline" href="#/senior/readiness">
          {t.readinessBtn}
        </a>
        <a class="btn btn-senior" href="#/senior/capstone">
          {t.capstoneBtn}
        </a>
      </div>

      <output class="notice">{t.notice}</output>

      <div class="senior-filter-container">
        <div class="senior-status-tabs" role="tablist" aria-label="Filtro por estado">
          {statusFilters.map((st) => {
            const count =
              st === 'all'
                ? seniors.length
                : st === 'completed'
                  ? seniors.filter((s) => getPassCount(s.id) === 5).length
                  : st === 'progress'
                    ? seniors.filter((s) => {
                        const c = getPassCount(s.id);
                        return c > 0 && c < 5;
                      }).length
                    : seniors.filter((s) => getPassCount(s.id) === 0).length;
            const label = statusLabels[st][locale] || statusLabels[st].es;
            return (
              <button
                key={st}
                type="button"
                role="tab"
                aria-selected={activeStatus === st}
                class={`senior-status-tab ${activeStatus === st ? 'active' : ''}`}
                onClick={() => setActiveStatus(st)}
              >
                <span>{label}</span>
                <span class="filter-count">({count})</span>
              </button>
            );
          })}
        </div>

        <div class="category-filter-bar" role="tablist" aria-label="Categorías Senior">
          {categories.map((cat) => {
            const count =
              cat === 'all'
                ? seniors.length
                : seniors.filter((s) => moduleCategories[s.id] === cat).length;
            const label = categoryLabels[cat][locale] || categoryLabels[cat].es;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                class={`category-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{label}</span>
                <span class="filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div class="senior-grid senior-grid-v2">
        {filteredSeniors.map((x) => {
          const passCount = getPassCount(x.id);
          const cat = moduleCategories[x.id] || 'concurrency';
          const catLabel = categoryLabels[cat][locale] || categoryLabels[cat].es;

          return (
            <a
              class={`senior-card senior-card-v2 cat-${cat}`}
              key={x.id}
              href={`#/senior/${x.id}`}
            >
              <div class="senior-card-badge-row">
                <span class="senior-gate-badge">
                  <b class="gate-id">{x.id}</b>
                  <span class="gate-count tabular-nums">{passCount}/5 GATES</span>
                </span>
                <span class={`senior-domain-pill pill-${cat}`}>{catLabel}</span>
              </div>

              <div class="senior-gate-segments" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((seg) => (
                  <i key={seg} class={seg < passCount ? 'filled' : ''} />
                ))}
              </div>

              <h3 class="senior-card-title">{x.title[locale]}</h3>
              <p class="senior-card-scenario">{x.challenge?.scenario[locale]}</p>

              <div class="senior-card-action">
                <span
                  class={`status-link ${
                    passCount === 5 ? 'done' : passCount > 0 ? 'progress' : 'idle'
                  }`}
                >
                  {passCount === 5
                    ? `✓ ${locale === 'es' ? 'Completado' : 'Completed'}`
                    : passCount > 0
                      ? `⏳ ${locale === 'es' ? 'En progreso' : 'In progress'} (${passCount}/5)`
                      : t.viewModule}
                </span>
                <span class="round-arrow">↗</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
