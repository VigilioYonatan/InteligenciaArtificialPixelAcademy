export type AiRuleCheck = {
  id: string;
  label: string;
  test: RegExp | ((cleanCode: string, rawCode: string) => boolean);
};

export type AiExerciseEvaluation = {
  passed: boolean;
  score: number;
  failedRules: Array<{ id: string; label: string }>;
};

export function stripCodeComments(source: string): string;
export function evaluateAiExercise(
  spec: { rules?: AiRuleCheck[] } | undefined,
  userCode: string,
): AiExerciseEvaluation;
