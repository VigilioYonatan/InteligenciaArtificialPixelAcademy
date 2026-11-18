// Deterministic static invariant checker for AI Academy lessons.
// Never executes user code (no eval, no new Function, no network).

export function validateAILessonCode(lesson, code) {
  if (!lesson || !Array.isArray(lesson.checks) || lesson.checks.length === 0) {
    return { passed: false, passedCount: 0, totalCount: 0, failedChecks: ['Invalid lesson spec'] };
  }
  const raw = typeof code === 'string' ? code.slice(0, 30000) : '';
  const source = raw
    .replace(/(^|\s)#[^\n]*/g, '$1')
    .replace(/(^|\s)--(?:\s|$)[^\n]*/g, '$1');
  const failedChecks = [];
  for (const check of lesson.checks) {
    const regex = new RegExp(check.pattern, check.flags || '');
    if (!regex.test(source)) {
      failedChecks.push(check.label);
    }
  }
  const totalCount = lesson.checks.length;
  const passedCount = totalCount - failedChecks.length;
  return {
    passed: failedChecks.length === 0,
    passedCount,
    totalCount,
    failedChecks,
  };
}
