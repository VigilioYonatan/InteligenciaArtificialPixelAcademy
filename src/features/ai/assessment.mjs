// Deterministic, versioned evidence evaluation: no arbitrary code execution.
export const ASSESSMENT_VERSION = 1;

function hasMeaningfulJustification(text) {
  if (text.length < 60) return false;
  const words = text
    .toLowerCase()
    .split(/[^a-záéíóúüñ0-9_]+/i)
    .filter((w) => w.length >= 2);
  const uniqueWords = new Set(words);
  return uniqueWords.size >= 6;
}

export function gradeCase(item, selection, evidence) {
  if (!item || !Array.isArray(item.options) || !Number.isInteger(item.correctIndex)) {
    throw new TypeError('Caso inválido');
  }
  if (!Number.isInteger(selection) || selection < 0 || selection >= item.options.length) {
    return { passed: false, score: 0, reason: 'Elige una opción válida' };
  }
  const safe = typeof evidence === 'string' ? evidence.trim().slice(0, 3000) : '';
  const justified = hasMeaningfulJustification(safe);
  const correct = selection === item.correctIndex;
  return {
    passed: correct && justified,
    score: (correct ? 70 : 0) + (justified ? 30 : 0),
    reason: !correct
      ? 'Decisión incorrecta'
      : !justified
        ? 'Justifica con al menos 60 caracteres y 6 palabras técnicas distintas'
        : 'Decisión correcta y justificación registrada',
  };
}

export function sanitizeProgress(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  return Object.fromEntries(
    Object.entries(data)
      .filter(
        ([id, value]) =>
          /^SAI(0[1-9]|1[0-8])$/.test(id) &&
          value &&
          typeof value === 'object' &&
          value.version === ASSESSMENT_VERSION &&
          value.passed === true &&
          value.score === 100,
      )
      .slice(0, 18),
  );
}
