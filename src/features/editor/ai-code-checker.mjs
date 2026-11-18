/**
 * Pure ESM deterministic validator for AI Architecture & Software exercises.
 * Zero eval(), zero new Function(), zero DOM/storage dependencies.
 */

/**
 * Strips //, /* * /, #, and -- comments outside string literals so comments
 * cannot spoof required architectural patterns.
 * @param {string} source
 * @returns {string}
 */
export function stripCodeComments(source) {
  if (typeof source !== 'string') return '';
  let out = '';
  let i = 0;
  const n = source.length;

  while (i < n) {
    const ch = source[i];
    const next = source[i + 1];

    // String literals ("...", '...', `...`)
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      out += ch;
      i += 1;
      while (i < n) {
        const c = source[i];
        out += c;
        if (c === '\\' && i + 1 < n) {
          out += source[i + 1];
          i += 2;
          continue;
        }
        i += 1;
        if (c === quote) break;
      }
      continue;
    }

    // Block comment /* ... */
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) {
        i += 1;
      }
      i += 2;
      out += ' ';
      continue;
    }

    // Line comments: //, --, or #
    if ((ch === '/' && next === '/') || (ch === '-' && next === '-') || ch === '#') {
      while (i < n && source[i] !== '\n') {
        i += 1;
      }
      continue;
    }

    out += ch;
    i += 1;
  }

  return out;
}

/**
 * Evaluates a user's code submission against deterministic architectural rules.
 * @param {{ rules?: Array<{ id: string; label: string; test: RegExp | ((clean: string, raw: string) => boolean) }> }} spec
 * @param {string} userCode
 */
export function evaluateAiExercise(spec, userCode) {
  if (!spec || !Array.isArray(spec.rules) || spec.rules.length === 0) {
    return {
      passed: false,
      score: 0,
      failedRules: [{ id: 'invalid-spec', label: 'Exercise rules not configured' }],
    };
  }
  if (typeof userCode !== 'string' || userCode.trim().length < 12) {
    return {
      passed: false,
      score: 0,
      failedRules: [{ id: 'empty', label: 'Code submission is too short' }],
    };
  }

  const clean = stripCodeComments(userCode);
  if (clean.includes('_____') || /\bTODO\b/.test(userCode)) {
    return {
      passed: false,
      score: 0,
      failedRules: [{ id: 'placeholder', label: 'Replace all _____ / TODO placeholders with real code' }],
    };
  }

  const failedRules = [];
  for (const rule of spec.rules) {
    const ok =
      typeof rule.test === 'function'
        ? Boolean(rule.test(clean, userCode))
        : rule.test instanceof RegExp
          ? rule.test.test(clean)
          : false;
    if (!ok) {
      failedRules.push({ id: rule.id, label: rule.label });
    }
  }

  const total = spec.rules.length;
  const passedCount = total - failedRules.length;
  return {
    passed: failedRules.length === 0,
    score: Math.round((passedCount / total) * 100),
    failedRules,
  };
}
