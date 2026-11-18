export type SeniorCategory =
  | 'all'
  | 'concurrency'
  | 'resilience'
  | 'performance'
  | 'architecture'
  | 'operations';

export type StatusFilter = 'all' | 'completed' | 'progress' | 'idle';

export type SeniorResultSummary = {
  score: number;
  passed: boolean;
};

export type SeniorDashboardProps = {
  locale: import('../../learning/types/learning.types').Locale;
  seniorResults: Record<string, SeniorResultSummary>;
  evidenceResults: Record<string, SeniorResultSummary>;
  investigationResults: Record<string, SeniorResultSummary>;
  operationsResults: Record<string, SeniorResultSummary>;
  reviewResults: Record<string, SeniorResultSummary>;
};
