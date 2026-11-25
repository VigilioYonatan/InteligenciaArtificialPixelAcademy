export type CertificateTrackId = 'core' | 'rag' | 'agents' | 'llmops' | 'ai';

export interface CertificateTrackSpec {
  readonly id: CertificateTrackId;
  readonly code: string;
  readonly shortLabel: string;
  readonly title: string;
  readonly hours: number;
  readonly unitIds: readonly string[];
  readonly labIds: readonly string[];
  readonly unitLabel: string;
  readonly labLabel: string;
  readonly summary: string;
  readonly nextHref: string;
}

export interface CertificateSnapshot {
  readonly completed?: readonly string[];
  readonly updatedAt?: string;
  readonly certificateName?: string;
  readonly certificateTrack?: string;
  readonly seniorResults?: Readonly<Record<string, { readonly passed?: boolean }>>;
  readonly reviewResults?: Readonly<Record<string, { readonly passed?: boolean }>>;
  readonly operationsResults?: Readonly<Record<string, { readonly passed?: boolean }>>;
  readonly evidenceResults?: Readonly<Record<string, { readonly passed?: boolean }>>;
  readonly investigationResults?: Readonly<Record<string, { readonly passed?: boolean }>>;
  readonly aiSeniorResults?: Readonly<Record<string, { readonly passed?: boolean }>>;
}

export interface CertificateStatus {
  readonly track: CertificateTrackSpec;
  readonly holderName: string;
  readonly rawName: string;
  readonly isPlaceholderName: boolean;
  readonly completedUnits: number;
  readonly totalUnits: number;
  readonly completedLabs: number;
  readonly totalLabs: number;
  readonly completedTotal: number;
  readonly grandTotal: number;
  readonly percent: number;
  readonly isUnlocked: boolean;
  readonly folio: string;
  readonly issuedDate: string;
  readonly badgeText: string;
}

const rangeIds = (prefix: string, count: number): readonly string[] =>
  Array.from({ length: count }, (_, i) => `${prefix}${String(i + 1).padStart(2, '0')}`);

const B_IDS = rangeIds('B', 12);
const I_IDS = rangeIds('I', 12);
const A_IDS = rangeIds('A', 12);
const F_IDS = rangeIds('F', 8);
const S_IDS = rangeIds('S', 18);

export const CERTIFICATE_MAX_NAME_LENGTH = 64;
export const DEFAULT_HOLDER_NAME = 'John Doe';

export const CERTIFICATE_TRACKS: readonly CertificateTrackSpec[] = [
  {
    id: 'ai',
    code: 'AI',
    shortLabel: 'AI Full Stack',
    title: 'Arquitectura de IA Full Stack · Canon Completo',
    hours: 240,
    unitIds: [...B_IDS, ...I_IDS, ...A_IDS, ...F_IDS],
    labIds: S_IDS,
    unitLabel: 'clases',
    labLabel: 'labs senior',
    summary:
      'Tokens, Structured Outputs con Zod, Multi-Tenant RAG en pgvector, LangGraph, MCP Tool Calling, Evals Ragas, OTel sin PII y FinOps.',
    nextHref: 'learn/basic',
  },
  {
    id: 'core',
    code: 'CORE',
    shortLabel: 'Core & Zod',
    title: 'Fundamentos de Ingeniería IA & Structured Outputs',
    hours: 96,
    unitIds: B_IDS,
    labIds: I_IDS,
    unitLabel: 'clases',
    labLabel: 'prácticas',
    summary:
      'Presupuesto de tokens, contratos deterministas con Zod/JSON Schema, embeddings e ingesta idempotente en backend.',
    nextHref: 'learn/basic',
  },
  {
    id: 'rag',
    code: 'RAG',
    shortLabel: 'RAG & pgvector',
    title: 'Multi-Tenant RAG, Hybrid Search & Reranking',
    hours: 120,
    unitIds: I_IDS,
    labIds: A_IDS,
    unitLabel: 'clases',
    labLabel: 'arquitecturas',
    summary:
      'PostgreSQL pgvector HNSW, búsqueda híbrida FTS + RRF, cross-encoder reranking y aislamiento estricto ACL multi-tenant.',
    nextHref: 'learn/intermediate',
  },
  {
    id: 'agents',
    code: 'MCP',
    shortLabel: 'Agents & MCP',
    title: 'Orquestación LangGraph, MCP & Prompt Shield',
    hours: 144,
    unitIds: A_IDS,
    labIds: F_IDS,
    unitLabel: 'clases',
    labLabel: 'frameworks',
    summary:
      'Grafos de estado acotados, servidores MCP con allowlist Zod, aprobaciones HITL y defensa contra Prompt Injection.',
    nextHref: 'learn/frameworks',
  },
  {
    id: 'llmops',
    code: 'OPS',
    shortLabel: 'Senior LLMOps',
    title: 'Senior Mode · Evals, OTel & FinOps en Producción',
    hours: 180,
    unitIds: A_IDS,
    labIds: S_IDS,
    unitLabel: 'clases',
    labLabel: 'labs senior',
    summary:
      'Golden Sets con Recall@K y nDCG, trazas OpenTelemetry/Langfuse sin PII, presupuesto atómico y 32 Release Gates.',
    nextHref: 'senior',
  },
];

const TRACK_MAP = new Map<CertificateTrackId, CertificateTrackSpec>(
  CERTIFICATE_TRACKS.map((track) => [track.id, track]),
);

export function resolveCertificateTrack(trackId?: string): CertificateTrackSpec {
  if (trackId && TRACK_MAP.has(trackId as CertificateTrackId)) {
    return TRACK_MAP.get(trackId as CertificateTrackId) ?? CERTIFICATE_TRACKS[0];
  }
  return CERTIFICATE_TRACKS[0];
}

export function sanitizeHolderName(raw?: string): string {
  if (typeof raw !== 'string') return '';
  let clean = '';
  for (let i = 0; i < raw.length; i += 1) {
    const code = raw.charCodeAt(i);
    if (code >= 32 && code !== 127) clean += raw[i];
  }
  return clean.slice(0, CERTIFICATE_MAX_NAME_LENGTH);
}

export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function collectPassedKeys(snapshot: CertificateSnapshot): Set<string> {
  const done = new Set<string>(Array.isArray(snapshot.completed) ? snapshot.completed : []);
  const tables = [
    snapshot.seniorResults,
    snapshot.reviewResults,
    snapshot.operationsResults,
    snapshot.evidenceResults,
    snapshot.investigationResults,
    snapshot.aiSeniorResults,
  ];
  for (const table of tables) {
    if (!table || typeof table !== 'object') continue;
    for (const key of Object.keys(table)) {
      if (table[key]?.passed) done.add(key);
    }
  }
  return done;
}

function resolveIssuedDate(updatedAt?: string): string {
  if (typeof updatedAt === 'string' && /^\d{4}-\d{2}-\d{2}/.test(updatedAt)) {
    return updatedAt.slice(0, 10);
  }
  return '2026-11-25';
}

export function computeCertificateStatus(
  snapshot: CertificateSnapshot,
  trackOverride?: CertificateTrackId,
): CertificateStatus {
  const track = resolveCertificateTrack(trackOverride ?? snapshot.certificateTrack);
  const doneKeys = collectPassedKeys(snapshot);

  let completedUnits = 0;
  for (const id of track.unitIds) {
    if (doneKeys.has(id)) completedUnits += 1;
  }

  let completedLabs = 0;
  for (const id of track.labIds) {
    if (doneKeys.has(id)) completedLabs += 1;
  }

  const totalUnits = track.unitIds.length;
  const totalLabs = track.labIds.length;
  const completedTotal = completedUnits + completedLabs;
  const grandTotal = totalUnits + totalLabs;
  const percent = grandTotal > 0 ? Math.min(100, Math.floor((completedTotal * 100) / grandTotal)) : 0;
  const isUnlocked = completedUnits >= totalUnits && completedLabs >= totalLabs && grandTotal > 0;

  const rawName = sanitizeHolderName(snapshot.certificateName);
  const trimmedName = rawName.trim();
  const isPlaceholderName = trimmedName.length === 0;
  const holderName = isPlaceholderName ? DEFAULT_HOLDER_NAME : trimmedName;
  const issuedDate = resolveIssuedDate(snapshot.updatedAt);

  let folio = `PREVIEW-${track.code}-0240`;
  if (isUnlocked) {
    const h1 = fnv1a32(`${holderName}|${track.id}|${completedTotal}|${issuedDate}`)
      .toString(16)
      .toUpperCase()
      .padStart(8, '0');
    folio = `CEA-${track.code}-${h1.slice(0, 4)}-${h1.slice(4, 8)}`;
  }

  return {
    track,
    holderName,
    rawName,
    isPlaceholderName,
    completedUnits,
    totalUnits,
    completedLabs,
    totalLabs,
    completedTotal,
    grandTotal,
    percent,
    isUnlocked,
    folio,
    issuedDate,
    badgeText: isUnlocked ? 'VERIFICADO 100%' : 'VISTA PREVIA',
  };
}
