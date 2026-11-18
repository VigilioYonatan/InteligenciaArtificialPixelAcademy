import { signal } from '@preact/signals';
import aiDecisions from '../../../content/ai/decision-labs.json';
import aiEvidence from '../../../content/ai/evidence-labs.json';
import aiOperations from '../../../content/ai/operations-labs.json';
import aiReviews from '../../../content/ai/review-labs.json';
import seniorChallenges from '../../../content/senior/challenges.json';
import reviewCases from '../../../content/senior/code-reviews.json';
import evidenceLabs from '../../../content/senior/evidence-labs.json';
import investigations from '../../../content/senior/investigations.json';
import operationsLabs from '../../../content/senior/operations-labs.json';
import {
  initialPrefs,
  XP_PER_AI_SENIOR,
  XP_PER_GAME_WIN,
  XP_PER_GO_LESSON,
} from '../constants/progress.constants';
import {
  clearPersistedPrefs,
  loadPrefs,
  parseBackupPayload,
  savePrefs,
  type SeniorValidationBanks,
} from '../persistence/progress.repository';
import type {
  AISeniorRecord,
  DecisionChallenge,
  EvidenceResultRecord,
  InvestigationResultRecord,
  Prefs,
  SeniorResultRecord,
} from '../types/progress.types';
import type { ReviewCase, ReviewRecord } from '../../senior/engine/code-review.mjs';
import type { EvidenceLab as EvidenceLabType } from '../../senior/engine/evidence.mjs';
import type { Investigation } from '../../senior/engine/investigation.mjs';
import type { OperationsLab as OperationsLabType, OperationsRecord } from '../../senior/engine/operations.mjs';

export const seniorValidationBanks: SeniorValidationBanks = {
  challenges: seniorChallenges as DecisionChallenge[],
  evidence: evidenceLabs as unknown as EvidenceLabType[],
  operations: operationsLabs as unknown as OperationsLabType[],
  reviews: reviewCases as unknown as ReviewCase[],
  investigations: investigations as unknown as Investigation[],
  aiDecisions: aiDecisions as unknown as Record<string, unknown>[],
  aiEvidence: aiEvidence as unknown as Record<string, unknown>[],
  aiReviews: aiReviews as unknown as Record<string, unknown>[],
  aiOperations: aiOperations as unknown as Record<string, unknown>[],
};

export const prefsSignal = signal<Prefs>(loadPrefs(seniorValidationBanks));

function commit(next: Prefs): void {
  prefsSignal.value = next;
  savePrefs(next);
}

export function importBackupJson(rawJson: string): void {
  commit(parseBackupPayload(rawJson, seniorValidationBanks));
}

export function updatePrefs(patch: Partial<Prefs>): void {
  commit({ ...prefsSignal.value, ...patch });
}

export function replacePrefs(next: Prefs): void {
  commit(next);
}

export function resetPrefs(): void {
  clearPersistedPrefs();
  prefsSignal.value = { ...initialPrefs };
}

export function persistCurrentPrefs(): boolean {
  return savePrefs(prefsSignal.value);
}

export function markModuleCompleted(id: string): void {
  const current = prefsSignal.value;
  if (current.completed.includes(id)) return;
  commit({
    ...current,
    completed: [...current.completed, id],
    xp: current.xp + XP_PER_GO_LESSON,
  });
}

export function updateDraft(id: string, code: string): void {
  const current = prefsSignal.value;
  commit({
    ...current,
    drafts: { ...current.drafts, [id]: code },
  });
}

export function updateNote(id: string, note: string): void {
  const current = prefsSignal.value;
  commit({
    ...current,
    notes: { ...current.notes, [id]: note },
  });
}

export function recordGameWin(mode: string): void {
  const current = prefsSignal.value;
  if (current.gameWins.includes(mode)) return;
  commit({
    ...current,
    gameWins: [...current.gameWins, mode],
    xp: current.xp + XP_PER_GAME_WIN,
  });
}

export function saveSeniorDecision(rec: SeniorResultRecord): void {
  const current = prefsSignal.value;
  commit({
    ...current,
    seniorResults: { ...current.seniorResults, [rec.moduleId]: rec },
  });
}

export function saveEvidenceResult(rec: EvidenceResultRecord): void {
  const current = prefsSignal.value;
  commit({
    ...current,
    evidenceResults: { ...current.evidenceResults, [rec.moduleId]: rec },
  });
}

export function saveInvestigationResult(rec: InvestigationResultRecord): void {
  const current = prefsSignal.value;
  commit({
    ...current,
    investigationResults: { ...current.investigationResults, [rec.moduleId]: rec },
  });
}

export function saveOperationsResult(rec: OperationsRecord): void {
  const current = prefsSignal.value;
  commit({
    ...current,
    operationsResults: { ...current.operationsResults, [rec.moduleId]: rec },
  });
}

export function saveReviewResult(rec: ReviewRecord): void {
  const current = prefsSignal.value;
  commit({
    ...current,
    reviewResults: { ...current.reviewResults, [rec.moduleId]: rec },
  });
}

export function saveAiSeniorResult(caseId: string, rec: AISeniorRecord): void {
  const current = prefsSignal.value;
  const alreadyPassed = current.aiSeniorResults[caseId]?.passed === true;
  commit({
    ...current,
    aiSeniorResults: { ...current.aiSeniorResults, [caseId]: rec },
    xp: !alreadyPassed && rec.passed ? current.xp + XP_PER_AI_SENIOR : current.xp,
  });
}

export function saveAiLabResult(
  kind: 'decision' | 'evidence' | 'review' | 'operations',
  caseId: string,
  rec: import('../types/progress.types').AILabRecord,
): void {
  const current = prefsSignal.value;
  const mapKey =
    kind === 'decision'
      ? 'aiDecisionResults'
      : kind === 'evidence'
        ? 'aiEvidenceResults'
        : kind === 'review'
          ? 'aiReviewResults'
          : 'aiOperationsResults';
  const prevMap = current[mapKey];
  const alreadyPassed = prevMap[caseId]?.passed === true;
  commit({
    ...current,
    [mapKey]: { ...prevMap, [caseId]: rec },
    xp: !alreadyPassed && rec.passed ? current.xp + XP_PER_AI_SENIOR : current.xp,
  });
}
