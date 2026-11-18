# AGENTS.md — AIPixel Architecture Academy (100% AI Engineering + Software)

Reglas vinculantes de arquitectura, dominio, UX/UI, ownership y calidad para cualquier agente o desarrollador que trabaje en este repositorio.

## 1. Dominio del Producto (100% Arquitectura de IA con Software — CERO Go)

- **Alcance exclusivo:** La plataforma enseña **Arquitectura de IA aplicada a Ingeniería de Software** en **4 niveles progresivos** (`Básico` 12 + `Intermedio` 12 + `Avanzado` 12 + `Senior Mode` 18) + **8 rutas de Frameworks AI** (`40` unidades) + **Minijuegos AI** (`50` rondas) + **Playground Estático AI**.
- **Temas troncales (Canon Vigilio `ai-rag-llmops-finops`):** Tokens & Context Budget, Structured Outputs (Zod/JSON Schema), Embeddings & Ingesta idempotente, PostgreSQL + `pgvector` + Hybrid Search (FTS + RRF), Reranking, ACL Multi-tenant (tenant + usuario + documento), Defensa contra Prompt Injection, LangChain & LangGraph, MCP (Model Context Protocol) & Tool Calling autorizado, Integración Backend (NestJS + Zod / Python FastAPI), Evals (Ragas / Golden Sets / Recall@K / nDCG / Faithfulness), Observabilidad GenAI (OpenTelemetry / Langfuse / Arize Phoenix sin PII), FinOps atómico y Release Gates (32 controles).
- **Prohibición explícita:** **Nada de Go (Golang)** en nuevas pantallas, currículum, ejercicios, frameworks, juegos, playground, mascota ni documentación de usuario.
- **Identidad Visual:** Estética **Pixel Art** original con mascota oficial **Axon** (`public/assets/mascot/*`, 12 poses incluyendo `senior`) + sistema de diseño **Vercel / Geist** (`src/styles/vercel-palette.css`, alto contraste validado WCAG 2.2 AA en modos `dark`, `light` y `senior`).

## 2. Stack y Límites Arquitectónicos (No Negociables)

- **SPA estática única:** Preact (`^10.27.0`) + `@preact/signals` (`^2.2.1`) + TypeScript (`strict: true`) + Vite 7.
- **Despliegue:** GitHub Pages con Hash Router (`#/...`). Todas las rutas de assets deben usar `import.meta.env.BASE_URL`.
- **Sin backend propio en la SPA:** No introducir servidores remotos, BFF, bases de datos remotas, autenticación remota, TanStack Query ni microfrontends.
- **Honestidad de ejecución y seguridad:** Nunca usar `eval()`, `new Function()`, `dangerouslySetInnerHTML`, `innerHTML = ...` con datos de usuario ni fingir inferencia LLM remota/GPU real en el navegador cuando la evaluación es determinista o matemática. La ejecución nativa real vive en `labs-ai-native/` (Python `unittest`).

## 3. Ownership por Capas y Features

- `src/app/`: Únicamente composición raíz (`App.tsx`), `AppShell.tsx`, `router.ts`, `ErrorBoundary.tsx` y páginas informativas estáticas.
- `src/shared/ui/`: Solo primitivas UI agnósticas con **>= 2 consumidores reales** (`Button`, `Card`, `Icon`, `Mascot`, `PageHeading`).
- `src/features/<feature>/`: Cada feature es dueña de sus páginas, componentes, `types/`, `constants/`, `persistence/` y `engine/`.
  - `engine/*.mjs` (con `.d.mts`): Lógica determinista pura en ESM sin importar Preact, DOM ni `localStorage`.
- `src/content/` y `src/data/`: Datos curriculares versionados separados de la UI.
- **Prohibido:** Crear carpetas globales `contracts/`, `packages/contracts/` o `shared/utils` sin dueño.

## 4. Persistencia Local Unificada

- El único dueño de `localStorage` es `src/features/progress/`.
- Clave de almacenamiento con migración automática no destructiva desde versiones previas (`gopixel:v1`, `gopixel:v2`, `vigilio:ai-academy:senior:v1`).
- Todo dato leído desde `localStorage` o importado por archivo JSON se considera **no confiable** y debe pasar por sanitización estricta (`sanitizePrefs`), protegiendo contra prototype pollution (`__proto__`, `constructor`, `prototype`), IDs inválidos, límites de tamaño y `QuotaExceededError`.

## 5. Gobernanza de Integridad y Verificación Obligatoria

- Mientras exista `ORIGINAL_INTEGRITY.json`, registrar cambios autorizados con `node scripts/update-integrity.mjs <ruta-relativa>` o actualizar el manifiesto cuando una tarea autorizada retire activos legacy de Go, verificando siempre `python scripts/verify-preservation.py`.
- Nunca reportar `PASS` sin ejecución real. Clasificar cada gate honestamente como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`:

```bash
npm run check:content
npm run typecheck
npm run test
npm run test:ai
npm run test:security
npm run test:ui
npm run build
python -m unittest discover -s labs-ai-native -t labs-ai-native -v
python scripts/verify-preservation.py
```
