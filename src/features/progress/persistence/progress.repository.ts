import { sanitizeProgress as sanitizeAiProgress } from '../../ai/assessment.mjs';
import { sanitizeAiLabMap } from '../../ai/engine/ai-labs.mjs';
import type { Locale } from '../../learning/types/learning.types.ts';
import { verifyReviewRecord } from '../../senior/engine/code-review.mjs';
import type { ReviewCase, ReviewRecord } from '../../senior/engine/code-review.mjs';
import { validSeniorRecord } from '../../senior/engine/evaluate.mjs';
import { verifiedEvidenceRecord } from '../../senior/engine/evidence.mjs';
import type { EvidenceLab as EvidenceLabType } from '../../senior/engine/evidence.mjs';
import { verifiedInvestigationRecord } from '../../senior/engine/investigation.mjs';
import type { Investigation } from '../../senior/engine/investigation.mjs';
import { verifiedOperationsRecord } from '../../senior/engine/operations.mjs';
import type { OperationsLab as OperationsLabType, OperationsRecord } from '../../senior/engine/operations.mjs';
import {
  initialPrefs,
  LEGACY_AI_STORAGE_KEY,
  LEGACY_STORAGE_KEY_V1,
  LEGACY_STORAGE_KEY_V2,
  MAX_STRING_ENTRY_LENGTH,
  MAX_STRING_MAP_ENTRIES,
  MAX_XP,
  STORAGE_KEY,
  STORAGE_SCHEMA_VERSION,
} from '../constants/progress.constants.ts';
import type {
  DecisionChallenge,
  EvidenceResultRecord,
  InvestigationResultRecord,
  Prefs,
  SeniorResultRecord,
} from '../types/progress.types.ts';

export type SeniorValidationBanks = {
  challenges: DecisionChallenge[];
  evidence: EvidenceLabType[];
  operations: OperationsLabType[];
  reviews: ReviewCase[];
  investigations: Investigation[];
  aiDecisions?: Record<string, unknown>[];
  aiEvidence?: Record<string, unknown>[];
  aiReviews?: Record<string, unknown>[];
  aiOperations?: Record<string, unknown>[];
};

const EMPTY_BANKS: SeniorValidationBanks = {
  challenges: [],
  evidence: [],
  operations: [],
  reviews: [],
  investigations: [],
};

const isLocale = (x: unknown): x is Locale =>
  typeof x === 'string' && ['es', 'en', 'ja', 'zh', 'pt', 'fr'].includes(x);

const isMap = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === 'object' && !Array.isArray(x);

const boundedStrings = (x: unknown): Record<string, string> =>
  Object.fromEntries(
    Object.entries(isMap(x) ? x : {})
      .filter(
        ([k, v]) =>
          k.length <= 100 &&
          !['__proto__', 'constructor', 'prototype'].includes(k) &&
          typeof v === 'string',
      )
      .slice(0, MAX_STRING_MAP_ENTRIES)
      .map(([k, v]) => [k, (v as string).slice(0, MAX_STRING_ENTRY_LENGTH)]),
  );

const uniqueIDs = (x: unknown): string[] =>
  Array.isArray(x)
    ? ([
        ...new Set(
          x.filter((v): v is string => typeof v === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(v)),
        ),
      ].slice(0, 300) as string[])
    : [];

/** Strict storage boundary: never trust imported or browser-stored JSON. */
export function sanitizePrefs(v: unknown, banks: SeniorValidationBanks = EMPTY_BANKS): Prefs {
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    return { ...initialPrefs };
  }
  const a = v as Record<string, unknown>;
  const fontSize = a.fontSize === 'sm' || a.fontSize === 'lg' || a.fontSize === 'md' ? a.fontSize : 'md';
  return {
    theme: a.theme === 'light' ? 'light' : 'dark',
    locale: isLocale(a.locale) ? a.locale : 'es',
    seniorEnabled: a.seniorEnabled === true,
    reducedMotion: a.reducedMotion === true,
    fontSize,
    completed: uniqueIDs(a.completed),
    xp: typeof a.xp === 'number' && Number.isFinite(a.xp) ? Math.max(0, Math.min(MAX_XP, a.xp)) : 0,
    notes: boundedStrings(a.notes),
    drafts: boundedStrings(a.drafts),
    gameWins: uniqueIDs(a.gameWins),
    seniorResults: Object.fromEntries(
      Object.entries(isMap(a.seniorResults) ? a.seniorResults : {})
        .filter(
          ([id, r]) =>
            /^S(0[1-9]|1[0-8])$/.test(id) &&
            validSeniorRecord(r, id, banks.challenges.find((c) => c.moduleId === id)),
        )
        .map(([id, r]) => [id, r])
        .slice(0, 18),
    ) as Record<string, SeniorResultRecord>,
    evidenceResults: Object.fromEntries(
      Object.entries(isMap(a.evidenceResults) ? a.evidenceResults : {})
        .filter(
          ([id, r]) =>
            /^S(0[1-9]|1[0-8])$/.test(id) &&
            verifiedEvidenceRecord(r, banks.evidence.find((c) => c.moduleId === id)),
        )
        .slice(0, 18),
    ) as Record<string, EvidenceResultRecord>,
    investigationResults: Object.fromEntries(
      Object.entries(isMap(a.investigationResults) ? a.investigationResults : {})
        .filter(
          ([id, r]) =>
            /^S(0[1-9]|1[0-8])$/.test(id) &&
            verifiedInvestigationRecord(r, banks.investigations.find((item) => item.moduleId === id)),
        )
        .slice(0, 18),
    ) as Record<string, InvestigationResultRecord>,
    operationsResults: Object.fromEntries(
      Object.entries(isMap(a.operationsResults) ? a.operationsResults : {})
        .filter(
          ([id, r]) =>
            /^S(0[1-9]|1[0-8])$/.test(id) &&
            verifiedOperationsRecord(r, banks.operations.find((item) => item.moduleId === id)),
        )
        .slice(0, 18),
    ) as Record<string, OperationsRecord>,
    reviewResults: Object.fromEntries(
      Object.entries(isMap(a.reviewResults) ? a.reviewResults : {})
        .filter(
          ([id, r]) =>
            /^S(0[1-9]|1[0-8])$/.test(id) &&
            verifyReviewRecord(r, banks.reviews.find((item) => item.moduleId === id)),
        )
        .slice(0, 18),
    ) as Record<string, ReviewRecord>,
    aiSeniorResults: sanitizeAiProgress(a.aiSeniorResults),
    aiDecisionResults: sanitizeAiLabMap(a.aiDecisionResults, banks.aiDecisions || [], 'decision'),
    aiEvidenceResults: sanitizeAiLabMap(a.aiEvidenceResults, banks.aiEvidence || [], 'evidence'),
    aiReviewResults: sanitizeAiLabMap(a.aiReviewResults, banks.aiReviews || [], 'review'),
    aiOperationsResults: sanitizeAiLabMap(a.aiOperationsResults, banks.aiOperations || [], 'operations'),
    certificateName:
      typeof a.certificateName === 'string'
        ? Array.from(a.certificateName)
            .filter((ch) => {
              const code = ch.charCodeAt(0);
              return code >= 32 && code !== 127;
            })
            .slice(0, 64)
            .join('')
        : '',
    certificateTrack:
      typeof a.certificateTrack === 'string' &&
      ['core', 'rag', 'agents', 'llmops', 'ai'].includes(a.certificateTrack)
        ? a.certificateTrack
        : 'core',
  };
}

function safeGetItem(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

export function loadPrefs(banks: SeniorValidationBanks = EMPTY_BANKS): Prefs {
  try {
    const rawCurrent = safeGetItem(STORAGE_KEY);
    if (rawCurrent) {
      const parsed = JSON.parse(rawCurrent) as unknown;
      if (isMap(parsed) && typeof parsed.version === 'number' && isMap(parsed.prefs)) {
        return sanitizePrefs(parsed.prefs, banks);
      }
      return sanitizePrefs(parsed, banks);
    }

    const rawV2 = safeGetItem(LEGACY_STORAGE_KEY_V2);
    if (rawV2) {
      const parsedV2 = JSON.parse(rawV2) as unknown;
      const payloadV2 = isMap(parsedV2) && isMap(parsedV2.prefs) ? parsedV2.prefs : parsedV2;
      const sanitizedV2 = sanitizePrefs(payloadV2, banks);
      savePrefs(sanitizedV2);
      return sanitizedV2;
    }

    const rawV1 = safeGetItem(LEGACY_STORAGE_KEY_V1);
    const rawAi = safeGetItem(LEGACY_AI_STORAGE_KEY);
    if (rawV1 || rawAi) {
      const baseV1 = rawV1 ? (JSON.parse(rawV1) as unknown) : {};
      const aiLegacy = rawAi ? (JSON.parse(rawAi) as unknown) : {};
      const merged = {
        ...(isMap(baseV1) ? baseV1 : {}),
        aiSeniorResults: isMap(baseV1) && isMap(baseV1.aiSeniorResults) ? baseV1.aiSeniorResults : aiLegacy,
      };
      const sanitized = sanitizePrefs(merged, banks);
      savePrefs(sanitized);
      return sanitized;
    }
  } catch {
    // Corrupted browser storage falls back safely to defaults.
  }
  return { ...initialPrefs };
}

export function savePrefs(prefs: Prefs): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_SCHEMA_VERSION, prefs }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearPersistedPrefs(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY_V2);
    localStorage.removeItem(LEGACY_STORAGE_KEY_V1);
    localStorage.removeItem(LEGACY_AI_STORAGE_KEY);
  } catch {
    // Storage access can fail in restricted browser contexts.
  }
}

export function parseBackupPayload(
  rawJson: string,
  banks: SeniorValidationBanks = EMPTY_BANKS,
): Prefs {
  const v = JSON.parse(rawJson) as unknown;
  if (
    !isMap(v) ||
    (v.version !== 1 && v.version !== 2 && v.version !== STORAGE_SCHEMA_VERSION) ||
    !isMap(v.prefs)
  ) {
    throw new Error('Invalid AIPixel backup');
  }
  return sanitizePrefs(v.prefs, banks);
}

export function serializeBackupPayload(prefs: Prefs): string {
  return JSON.stringify({ version: STORAGE_SCHEMA_VERSION, prefs }, null, 2);
}
