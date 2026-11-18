import type { Locale, Theme } from '../../learning/types/learning.types';
import type { ReviewRecord } from '../../senior/engine/code-review.mjs';
import type { OperationsRecord } from '../../senior/engine/operations.mjs';

export type SeniorResultRecord = {
  moduleId: string;
  challengeId: 'decision-lab';
  version: number;
  correct: number;
  score: number;
  answers: number[];
  completedAt: string;
  passed: boolean;
};

export type EvidenceResultRecord = {
  moduleId: string;
  challengeId: 'evidence-lab';
  version: number;
  correct: number;
  score: number;
  selections: number[];
  completedAt: string;
  passed: boolean;
};

export type InvestigationResultRecord = {
  moduleId: string;
  challengeId: 'investigation-lab';
  version: number;
  correct: number;
  score: number;
  answers: number[];
  completedAt: string;
  passed: boolean;
};

export type AISeniorRecord = {
  version: number;
  passed: boolean;
  score: number;
};

export type AILabRecord = {
  version: number;
  passed: boolean;
  score: number;
  answers?: number[];
  selections?: number[];
  choices?: number[];
};

export type DecisionChallenge = {
  moduleId: string;
  challengeId: string;
  version: number;
  questions: {
    id: string;
    prompt: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
  learningPoints: string[];
  type: string;
  verification: string;
};

export type Prefs = {
  theme: Theme;
  locale: Locale;
  seniorEnabled: boolean;
  reducedMotion: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  completed: string[];
  xp: number;
  notes: Record<string, string>;
  drafts: Record<string, string>;
  gameWins: string[];
  seniorResults: Record<string, SeniorResultRecord>;
  evidenceResults: Record<string, EvidenceResultRecord>;
  investigationResults: Record<string, InvestigationResultRecord>;
  operationsResults: Record<string, OperationsRecord>;
  reviewResults: Record<string, ReviewRecord>;
  aiSeniorResults: Record<string, AISeniorRecord>;
  aiDecisionResults: Record<string, AILabRecord>;
  aiEvidenceResults: Record<string, AILabRecord>;
  aiReviewResults: Record<string, AILabRecord>;
  aiOperationsResults: Record<string, AILabRecord>;
};
