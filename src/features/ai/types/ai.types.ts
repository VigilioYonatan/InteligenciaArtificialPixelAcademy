import type { Locale } from '../../learning/types/learning.types';

export type AILevel =
  | 'fundamentos'
  | 'machine-learning'
  | 'deep-learning'
  | 'generative-ai'
  | 'senior';

export type AILevelFilter = 'all' | AILevel;
export type AIStatusFilter = 'all' | 'completed' | 'idle';

export type AICurriculumItem = {
  id: string;
  title: string;
  summary: string;
  stack: string;
  project: string;
  level: AILevel;
};

export type AILessonCheck = {
  pattern: string;
  flags?: string;
  label: string;
};

export type AILessonSpec = {
  id: string;
  language: 'python' | 'sql' | 'yaml' | 'json';
  concepts: { term: string; desc: string }[];
  doDont: { good: string; bad: string };
  mission: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
  checks: AILessonCheck[];
};

export type AISeniorCase = {
  id: string;
  moduleId: string;
  title: string;
  level: 'senior';
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  evidence: string[];
  category: string;
  keywords?: string[];
};

export type AII18nBundle = {
  eyebrow: string;
  title: string;
  subtitle: string;
  modulesCount: string;
  seniorCount: string;
  verifiedCount: string;
  disclaimer: string;
  filterLevel: string;
  filterStatus: string;
  allLevels: string;
  allStatuses: string;
  completedStatus: string;
  idleStatus: string;
  lessonsSection: string;
  lessonsSubtitle: string;
  seniorSection: string;
  seniorSubtitle: string;
  openLesson: string;
  openChallenge: string;
  backCatalog: string;
  verifiedBadge: string;
  completedBadge: string;
  conceptsTitle: string;
  doLabel: string;
  dontLabel: string;
  missionTitle: string;
  editorCheck: string;
  editorReset: string;
  editorHint: string;
  editorPass: string;
  editorFail: string;
  editorDisclaimer: string;
  chooseDecision: string;
  justificationLabel: string;
  justificationPlaceholder: string;
  evalNote: string;
  evalBtn: string;
  recommendedEvidence: string;
  adrTitle: string;
  adrPlaceholder: string;
  adrHint: string;
  relatedLesson: string;
  relatedSenior: string;
  notFound: string;
  levelLabels: Record<AILevel, string>;
  modules: Record<string, { title: string; summary: string; project: string }>;
};

export type AILocalesMap = Record<Locale, AII18nBundle>;
