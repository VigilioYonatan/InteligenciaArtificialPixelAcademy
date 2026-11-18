/**
 * Explicit capability contract: deterministic static rule checking in browser.
 * Real native code execution runs locally via Python unittest in labs-ai-native/.
 */
export const AI_STATIC_CAPABILITY = {
  mode: 'deterministic-static-validator',
  remoteExecution: false,
  disclaimer:
    'Evaluación estática determinista en navegador sin inferencia remota ni ejecución arbitraria.',
} as const;
