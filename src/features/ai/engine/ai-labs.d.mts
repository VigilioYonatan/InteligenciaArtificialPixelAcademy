export const AI_LAB_VERSION: number;

export function gradeAiDecisionLab(
  lab: { questions: { prompt: string; options: string[]; correct: number; explanation: string }[] },
  answers: number[],
): { passed: boolean; correct: number; total: number; score: number; details: boolean[] };

export function gradeAiEvidenceLab(
  lab: { findings: string[]; correctIndices: number[] },
  selections: number[],
): { passed: boolean; correct: number; total: number; score: number };

export function gradeAiTwoStepLab(
  lab: Record<string, unknown>,
  firstChoice: number,
  secondChoice: number,
  firstKey: string,
  secondKey: string,
): { passed: boolean; correct: number; total: number; score: number; details: boolean[] };

export function sanitizeAiLabMap(
  rawMap: unknown,
  bank: Record<string, unknown>[],
  kind: 'decision' | 'evidence' | 'review' | 'operations',
): Record<string, { version: number; score: number; passed: boolean; answers?: number[]; selections?: number[]; choices?: number[] }>;
