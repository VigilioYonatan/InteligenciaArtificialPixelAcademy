export const ASSESSMENT_VERSION: number;

export function gradeCase(
  item: { options: string[]; correctIndex: number },
  selection: number,
  evidence: string,
): { passed: boolean; score: number; reason: string };

export function sanitizeProgress(
  data: unknown,
): Record<string, { version: number; passed: boolean; score: number }>;
