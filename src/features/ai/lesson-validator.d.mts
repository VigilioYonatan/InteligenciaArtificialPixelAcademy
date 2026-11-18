export type AILessonValidationResult = {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  failedChecks: string[];
};

export function validateAILessonCode(
  lesson: { checks: { pattern: string; flags?: string; label: string }[] },
  code: string,
): AILessonValidationResult;
