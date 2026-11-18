import type { Locale } from '../../learning/types/learning.types';
import type { SeniorCategory, StatusFilter } from '../types/senior.types';

export const statusLabels: Record<StatusFilter, Record<Locale, string>> = {
  all: { es: 'Todos', en: 'All', ja: 'すべて', zh: '全部', pt: 'Todos', fr: 'Tous' },
  completed: {
    es: 'Completados',
    en: 'Completed',
    ja: '完了',
    zh: '已完成',
    pt: 'Concluídos',
    fr: 'Complétés',
  },
  progress: {
    es: 'En progreso',
    en: 'In progress',
    ja: '進行中',
    zh: '进行中',
    pt: 'Em progresso',
    fr: 'En cours',
  },
  idle: {
    es: 'Sin iniciar',
    en: 'Not started',
    ja: '未着手',
    zh: '未开始',
    pt: 'Não iniciado',
    fr: 'Non commencé',
  },
};

export const moduleCategories: Record<string, SeniorCategory> = {
  S01: 'concurrency',
  S02: 'resilience',
  S03: 'resilience',
  S04: 'concurrency',
  S05: 'performance',
  S06: 'concurrency',
  S07: 'concurrency',
  S08: 'architecture',
  S09: 'architecture',
  S10: 'performance',
  S11: 'resilience',
  S12: 'architecture',
  S13: 'performance',
  S14: 'resilience',
  S15: 'operations',
  S16: 'operations',
  S17: 'operations',
  S18: 'operations',
};

export const categoryLabels: Record<SeniorCategory, Record<Locale, string>> = {
  all: { es: 'Todos', en: 'All', ja: 'すべて', zh: '全部', pt: 'Todos', fr: 'Tous' },
  concurrency: {
    es: 'RAG & ACL Multi-Tenant',
    en: 'Multi-Tenant RAG & ACL',
    ja: 'マルチテナント RAG & ACL',
    zh: '多租户 RAG 与 ACL',
    pt: 'RAG & ACL Multi-Tenant',
    fr: 'RAG & ACL Multi-Tenant',
  },
  resilience: {
    es: 'Agentes, MCP & Seguridad',
    en: 'Agents, MCP & Security',
    ja: 'エージェント・MCP・セキュリティ',
    zh: '智能体、MCP 与安全',
    pt: 'Agentes, MCP & Segurança',
    fr: 'Agents, MCP & Sécurité',
  },
  performance: {
    es: 'Latencia, DB & FinOps',
    en: 'Latency, DB & FinOps',
    ja: 'レイテンシ・DB・FinOps',
    zh: '延迟、数据库与 FinOps',
    pt: 'Latência, DB & FinOps',
    fr: 'Latence, DB & FinOps',
  },
  architecture: {
    es: 'Evals, Grounding & OTel',
    en: 'Evals, Grounding & OTel',
    ja: '評価・グラウンディング・OTel',
    zh: '评估、溯源与可观测性',
    pt: 'Evals, Grounding & OTel',
    fr: 'Evals, Grounding & OTel',
  },
  operations: {
    es: 'GDPR, Serving & Release',
    en: 'GDPR, Serving & Release',
    ja: 'GDPR・推論基盤・リリース',
    zh: 'GDPR、推理服务与发布门禁',
    pt: 'GDPR, Serving & Release',
    fr: 'GDPR, Serving & Release',
  },
};
