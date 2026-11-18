# ROADMAP 100% SENIOR VIGILIO — AIPixel Architecture Academy (100% Arquitectura de IA + Software · CERO GO)

> **Directiva vinculante de producto:** Transformar por completo el repositorio en una academia interactiva estilo **Pixel Art + Paleta Vercel Geist**, dedicada **100% a Arquitectura de IA integrada con Ingeniería de Software** (RAG, Embeddings, `pgvector`, Hybrid Search + RRF, Reranking, ACL Multi-tenant, LangChain, LangGraph, MCP, NestJS + Zod, Python/FastAPI, Evals/Ragas, OpenTelemetry/Langfuse, FinOps y Multi-Agent) desde **Básico → Intermedio → Avanzado → Senior Mode**, eliminando **todo rastro de Go (Golang) y Gopher**.

---

## 1. Fuentes Canónicas Vigilio Leídas y Aplicadas

- **IA, RAG, LLMOps y FinOps:**
  - `platform-actions/skills/ai-rag-llmops-finops/SKILL.md`
  - `vigilio-docs/foundations/ai/seleccion-arquitectura-2026.md`
  - `platform-actions/skills/token-context-compression` & `adaptive-context-budget`
- **UX/UI, Dirección de Arte, Design System y Accesibilidad:**
  - `platform-actions/skills/ui-art-direction/SKILL.md` + `vigilio-docs/standards/experience/visual-art-direction-and-originality.md`
  - `platform-actions/skills/ui-design-system/SKILL.md` + `vigilio-docs/standards/experience/design-tokens-modes-and-theming.md`
  - `vigilio-docs/standards/experience/product-originality-and-platform-blueprints.md`
  - `platform-actions/skills/ux-web-experience/SKILL.md`, `ux-information-architecture/SKILL.md`, `ux-game-experience/SKILL.md`, `ux-accessibility/SKILL.md`, `ui-quality-review/SKILL.md`
- **Arquitectura Frontend, Testing, Seguridad y Cierre:**
  - `web-mfe-build-feature`, `symbol-ownership-architecture`, `web-mfe-testing`, `software-supply-chain-security`, `repository-readme-architecture`, `review-code-change`, `complete-work-no-shortcuts`.

---

## 2. Ficha de Dirección de Arte & Design System (`ui-art-direction` + `ui-design-system`)

### 2.1 Evaluación de 3 Hipótesis Visuales (Requisito Vigilio de Originalidad)

| Hipótesis | Identidad / Geometría / Color | Evaluación Senior | Decisión |
| :--- | :--- | :--- | :---: |
| **A. Geist Pixel Neural-Core ("Axon")** | Superficies monocromáticas Vercel (`#000000` / `#0a0a0a` / `#111111`), bordes hairline `#262626`, tipografía técnica `Inter` + `JetBrains Mono` (`tabular-nums`), mascota Pixel Art 32-bit **Axon** con prisma triangular cyan `#3291ff` y **Senior Mode** en ámbar `#f5a623` + capa violeta `#7928ca`. | Une credibilidad de herramienta de ingeniería con carisma pedagógico Pixel Art sin copiar plantillas SaaS genéricas; cumple WCAG 2.2 AA (`>= 4.5:1`) en Dark, Light y Senior. | **ELEGIDA (IMPLEMENTADA)** |
| **B. SaaS AI Genérico con Glassmorphism Violeta** | Tarjetas difuminadas con gradientes neón púrpura/rosa en todas las vistas y avatares 3D genéricos. | Viola explícitamente el anti-patrón #01/#05 de `visual-art-direction-and-originality.md`; fatiga visual en lectura de código y baja legibilidad en tablas/métricas. | **RECHAZADA** |
| **C. Terminal Retro CRT Monocromo Verde** | Estética fósforo `#00ff00` sobre negro y fuente pixelada en párrafos largos. | Penaliza lectura prolongada de arquitectura/SQL, dificulta semántica de severidades (éxito/alerta/peligro) y falla ergonomía en modo claro. | **RECHAZADA** |

### 2.2 Mascota Oficial AI ("Axon") y Tokens Semánticos Verificados (`[x]`)

- [x] **Mascota Pixel Art 100% AI ("Axon") en 12 Poses incluyendo `Senior Mode` (`public/assets/mascot/*`)**
  - `12` poses `512×512` PNG con canal alfa transparente + `12` miniaturas `-128.png` + `favicon.png` + `manifest.json`: `welcome`, `reading`, `coding`, `question`, `celebrate`, `debug`, `building`, **`senior` (corona dorada + gafas oscuras + capa de arquitecto)**, `idea`, `architecture`, `graduate`, `sleep`.
  - Conectada en `src/shared/ui/primitives.tsx` (`<Mascot />`), `src/app/AppShell.tsx` y `index.html`.
- [x] **Sistema de Tokens Semánticos Vercel / Geist (`src/styles/vercel-palette.css`)**
  - Arquitectura en 3 capas sin ciclos (`Primitivos --geist-*` → `Semánticos --surface-*, --text-*, --action-*, --status-*` → `Aliases`), `tabular-nums` para métricas FinOps/latencia y soporte `@media (prefers-reduced-motion: reduce)`.
  - Verificado matemáticamente con `tests/ux-ui-mascot-tokens.test.mjs` (`WCAG 2.2 AA >= 4.5:1` en los `12` pares críticos Dark/Light/Senior).

---

## 3. Auditoría Honesta del Repositorio Hoy (Sin Mentiras)

| Componente / Área | Estado Real Hoy | ¿Tiene restos de Go hoy? | Meta 100% AI-Only |
| :--- | :---: | :---: | :--- |
| **Paleta Vercel Geist + Mascota Axon (12 poses + Senior)** | `PASS` | **No** (`mascot/*` activo en UI) | Mantener y retirar carpeta legacy `public/assets/gophers/*` en fase de limpieza. |
| **Shell, Persistencia y Sanitización (`src/features/progress/`)** | `PASS` | Clave interna `gopixel:v2` | Migrar clave canónica a `aipixel:v1` (migrando sin pérdida desde `gopixel:v2`/`v1`). |
| **Catálogo Principal (`src/data/curriculum.json` — 62 módulos)** | `PENDIENTE` | **SÍ (`100%` Go en `B01–A12`, `S01–S18`, `F01–F08`)** | Reescribir los `62` módulos en `6` idiomas a **100% Arquitectura de IA + Software**. |
| **Ruta Aprender (`src/data/learning-exercises.ts` — 36 lecciones)** | `PENDIENTE` | **SÍ (`36/36` ejercicios son código Go)** | `36` lecciones interactivas no pre-resueltas de IA + Software (`B01–B12` Básico, `I01–I12` Intermedio, `A01–A12` Avanzado). |
| **Ruta Senior Principal (`#/senior` vs `#/ai`)** | `PENDIENTE` | **SÍ (`#/senior` es Go; IA está aparte en `#/ai`)** | Unificar `#/senior` como **Senior Mode 100% Arquitectura de IA (`S01–S18`)** con sus 6 labs + 4 simuladores + Readiness + Capstone, y redirigir `#/ai` → `#/senior` o `#/learn`. |
| **Frameworks Academy (`#/frameworks` — 8 rutas × 5 = 40 unidades)** | `PENDIENTE` | **SÍ (`Gin`, `Chi`, `Echo`, `GORM`, `gRPC` Go)** | `8` Frameworks de IA + Software (`LangChain/LangGraph`, `pgvector`, `NestJS+Zod AI`, `FastAPI AI`, `MCP`, `Ragas`, `OTel+Langfuse`, `vLLM+FinOps`) = `40` unidades interactivas. |
| **Juegos (`#/games` — 5 modos × 10 = 50 rondas)** | `PENDIENTE` | **SÍ (`25` Go + `25` IA)** | `50/50` rondas **100% Arquitectura de IA + Software**. |
| **Playground Worker (`#/playground`)** | `PENDIENTE` | **SÍ (plantilla inicial y reglas Go + IA)** | Analizador estático Web Worker **100% IA + Software** (TS/NestJS, Python, SQL `pgvector` ACL, LangGraph, MCP, FinOps). |
| **Textos UI 6 Idiomas (`learning.constants.ts`, `HomePage`, `StaticPages`)** | `PENDIENTE` | **SÍ ("Aprende Go", "GoPixel", "Gopher")** | `6` idiomas (`es/en/ja/zh/pt/fr`) 100% Arquitectura de IA, cero menciones a Go. |
| **Labs Nativos (`labs-native/` Go vs `labs-ai-native/` Python)** | `PENDIENTE` | **SÍ (`labs-native/` tiene 20 tests Go)** | Eliminar `labs-native/` (Go), expandir `labs-ai-native/` a **18 paquetes AI + Capstone** verificados con `unittest` y ZIP descargable. |

---

## 4. Plan de Ejecución `[ ]` para Estar al 100% AI-Only (20 Tareas en 4 Bloques de 5)

### Bloque 1 — Arquitectura de Información, i18n, Rebranding Total y Catálogo Curricular 62 Módulos AI (`1.1` – `1.5`)

- [x] **1.1 Arquitectura de Navegación Unificada 100% AI-Only y Eliminación de Pestaña Duplicada**
  - **Qué falta:** Hoy existen dos mundos separados en el header (`Aprender`/`Senior` con Go, y `AI Academy` aparte en `#/ai`).
  - **Skills a usar:** `ux-information-architecture` + `ux-web-experience` + `symbol-ownership-architecture`.
  - **Tarea + Resultado:** Unificar la navegación principal en `Inicio (#/)`, `Aprender (#/learn)`, `Playground (#/playground)`, `Juegos (#/games)`, `Frameworks (#/frameworks)` y `Senior Mode (#/senior)` — todos **100% Arquitectura de IA** (manteniendo `#/ai` como alias/redirect limpio hacia `#/senior` para no romper enlaces previos) y reemplazar `<Gopher />` por `<Mascot />` en todos los componentes.

- [x] **1.2 Diccionarios i18n en 6 Idiomas (`es`, `en`, `ja`, `zh`, `pt`, `fr`) + Páginas Estáticas 100% AI**
  - **Qué falta:** Las `84` claves de `learning.constants.ts`, `HomePage.tsx` (`code-float` con `package main`), `About` y `Credits` (`StaticPages.tsx`) aún hablan de Golang y GoPixel.
  - **Skills a usar:** `ux-web-experience` + `ui-art-direction` + `ux-accessibility`.
  - **Tarea + Resultado:** Reescribir las `84` claves en los `6` idiomas para **AIPixel Architecture Academy**, actualizar el snippet flotante del Hero a un pipeline real `HybridRAG + LangGraph + BudgetAuthorizer`, actualizar `About`/`Credits` (créditos originales de Axon + stack Preact/Vite/Vercel Geist) y paisajes SVG sin banderas `"GO"`.

- [x] **1.3 Persistencia Canónica `aipixel:v1` con Migración No Destructiva y Sanitización Estricta**
  - **Qué falta:** El repositorio de progreso usa `gopixel:v2` y campos acoplados al naming anterior.
  - **Skills a usar:** `web-mfe-security-delivery` + `improve-codebase-architecture`.
  - **Tarea + Resultado:** Promover `aipixel:v1` como clave canónica en `src/features/progress/` con migración automática transparente desde `gopixel:v2`, `gopixel:v1` y `vigilio:ai-academy:senior:v1`, manteniendo protección anti-prototype-pollution (`__proto__`, `constructor`, `prototype`), recomputación de scores e import/export JSON.

- [x] **1.4 Nuevo Catálogo Curricular Maestro `src/data/curriculum.json` (`Básico 12 + Intermedio 12 + Avanzado 12`) en 6 Idiomas**
  - **Qué falta:** Los `36` módulos de aprendizaje (`B01–B12`, `I01–I12`, `A01–A12`) en `curriculum.json` siguen siendo de sintaxis Go.
  - **Skills a usar:** `ai-rag-llmops-finops` + `token-context-compression` + `adaptive-context-budget`.
  - **Tarea + Resultado:** Diseñar y localizar en los `6` idiomas los **36 módulos progresivos de Arquitectura de IA con Software**:
    - **Básico (`B01–B12`):** Tokens & Context Windows, Prompts Defensivos, Structured Outputs (Zod/JSON Schema), Embeddings & Similitud, Chunking Semántico, Ingesta Idempotente, PostgreSQL + `pgvector` Base, Primer RAG End-to-End, Citas Verificables y Abstención, Contratos Backend (`answerQuestion`/`ingestDocument`), Timeouts/Retries/`AbortSignal`, Testing Determinista con Fixtures.
    - **Intermedio (`I01–I12`):** Matriz SQL vs Hybrid RAG vs Contexto Largo, Hybrid Search (FTS + `pgvector` + RRF), Reranking Cross-Encoder y Gates, Seguridad Multi-Tenant (RLS + ACL por Documento/Usuario), Defensa Prompt Injection Indirecta, Caché Aislado por ACL, Tool Calling Autorizado, LangChain Runnables & Ports DDD (NestJS/Python), Grafos de Estado con LangGraph & Checkpoints, Streaming SSE y Backpressure, Evals Offline con Ragas/Golden Sets (`Recall@K`, `MRR`, `nDCG`, `Faithfulness`), Observabilidad OpenTelemetry GenAI + Langfuse/Phoenix sin PII.
    - **Avanzado (`A01–A12`):** Agentic RAG con Límites de Pasos/Presupuesto, Human-in-the-Loop e Idempotencia en Tools, Servidores y Permisos MCP (Model Context Protocol), Tuning HNSW (`m`, `ef_search`) vs Exact Search, Lifecycle de Modelos y Migración de Dimensiones sin Downtime, FinOps Atómico por Tenant y Conciliación, Compresión de Contexto y Presupuesto Adaptativo, Routing Multi-Modelo y Circuit Breakers, Inferencia con Ollama/vLLM y KV-Cache, Multimodal RAG (Tablas/PDFs con Cita a Página), GraphRAG vs SQL Joins Autorizados, Release Gates Go/No-Go (Matriz de 32 Controles + Borrado GDPR).

- [x] **1.5 Catálogo `Senior Mode (S01–S18)` y `Frameworks (F01–F08)` en `src/data/curriculum.json` (6 Idiomas)**
  - **Qué falta:** Las entradas `S01–S18` y `F01–F08` de `curriculum.json` aún listan concurrencia Go y routers HTTP Go.
  - **Skills a usar:** `ai-rag-llmops-finops` + `rust-agent-runtime-security` + `platform-finops`.
  - **Tarea + Resultado:** Localizar en `6` idiomas los `18` módulos Senior de Arquitectura de IA (`S01–S18`: fugas cross-tenant en RAG, envenenamiento de caché semántico, tormenta de reintentos LLM, agotamiento de presupuesto concurrente, drift de embeddings en HNSW, prompt injection vía tools MCP, etc.) y las `8` rutas de Frameworks AI (`F01–F08`: LangChain/LangGraph, PostgreSQL+`pgvector`, NestJS+Zod AI, Python/FastAPI AI, MCP, Ragas Evals, OTel+Langfuse, Ollama/vLLM+FinOps).

---

### Bloque 2 — Los 36 Ejercicios Interactivos (`B01–A12`) y Validador Determinista de Arquitectura de IA (`2.1` – `2.5`)

- [x] **2.1 Motor Validador Determinista de Ejercicios AI + Software (`src/features/editor/ai-code-checker.mjs`)**
  - **Qué falta:** El editor actual valida `package main` y `func` de Go.
  - **Skills a usar:** `web-mfe-build-feature` + `web-mfe-security-delivery` + `complete-work-no-shortcuts`.
  - **Tarea + Resultado:** Crear un motor ESM puro (`ai-code-checker.mjs` + `.d.mts`, cero `eval`/`new Function`) que ignore comentarios (`//`, `/* */`, `#`, `--`), valide invariantes estructurales, contratos Zod/TypeScript, pipelines Python/LangGraph, queries SQL `pgvector` + ACL y políticas JSON/YAML, devolviendo diagnósticos pedagógicos claros por regla fallida.

- [x] **2.2 Banco Interactivo Nivel Básico (`B01–B12` — 12 Lecciones Completas con Código + Notas Senior)**
  - **Qué falta:** Crear los `12` laboratorios de código del track Básico en `src/data/learning-exercises.ts`.
  - **Skills a usar:** `ai-rag-llmops-finops` + `node-nest-build-feature`.
  - **Tarea + Resultado:** `12/12` ejercicios prácticos (Zod Structured Outputs, separación system/untrusted context, chunker con overlap e `idempotency_key`, query `pgvector` parametrizada, validador de citas y abstención, cliente LLM con `AbortSignal.timeout`, etc.) donde **ningún `starterCode` viene pre-resuelto** y cada `solution` pasa al 100% por test BDD.

- [x] **2.3 Banco Intermedio (`I01–I12` — Hybrid RAG, LangChain/LangGraph, Backend DDD & Evals)**
  - **Qué falta:** Crear los `12` laboratorios de código del track Intermedio en `src/data/learning-exercises.ts`.
  - **Skills a usar:** `ai-rag-llmops-finops` + `node-nest-persistence` + `node-nest-security`.
  - **Tarea + Resultado:** `12/12` ejercicios reales de ingeniería de software + IA (fusión RRF entre PostgreSQL `tsvector` y `pgvector`, filtro obligatorio `tenant_id + user_acl` antes del top-K, clave de caché que incluye `acl_hash`, definición de `StateGraph` en LangGraph con límite de ciclos, controller delgado NestJS + puerto `KnowledgeRetriever`, span OpenTelemetry sin PII, cálculo de `Recall@K` y `Faithfulness`), todos verificados por test BDD.

- [x] **2.4 Banco Avanzado (`A01–A12` — Multi-Agent, MCP, HNSW, Model Lifecycle & FinOps Atómico)**
  - **Qué falta:** Crear los `12` laboratorios de código del track Avanzado en `src/data/learning-exercises.ts`.
  - **Skills a usar:** `ai-rag-llmops-finops` + `token-context-compression` + `adaptive-context-budget` + `rust-agent-runtime-security`.
  - **Tarea + Resultado:** `12/12` ejercicios avanzados (presupuesto de pasos en Agentic RAG, aprobación humana + idempotencia en tool mutable, servidor MCP con scopes de menor privilegio, migración dual-read/dual-write de índice HNSW, reserva atómica de tokens por tenant con conciliación, compresor de contexto con presupuesto adaptativo, circuit breaker multi-modelo, gate CI de 32 controles RAG), `0/12` pre-resueltos.

- [x] **2.5 Adaptación de `LessonPage.tsx` y `LearningPathsPage.tsx` al Flujo Multi-Lenguaje de Arquitectura de IA**
  - **Qué falta:** `LessonPage.tsx` etiqueta el editor como Go y usa textos de compilación Go.
  - **Skills a usar:** `ux-web-experience` + `ux-accessibility` + `ui-design-system`.
  - **Tarea + Resultado:** Mostrar badge del stack del ejercicio (`TypeScript / NestJS`, `Python / LangGraph`, `PostgreSQL / pgvector`, `MCP / Eval Config`), guía paso a paso ✅ Correcto vs ❌ Incorrecto Vigilio, notas de arquitectura al activar **Senior Mode** y mascota **Axon** reaccionando (`reading` → `debug` → `celebrate`).

---

### Bloque 3 — Unificación de `Senior Mode (S01–S18)`, `Frameworks (40 Unidades)`, `Games (50 Rondas)` y `Playground` (`3.1` – `3.5`)

- [x] **3.1 Unificar `#/senior` (`S01–S18`) como el Senior Mode Oficial 100% Arquitectura de IA (6 Labs Completos)**
  - **Qué falta:** `#/senior` aún consume los JSON de Go en `src/content/senior/*`, y a IA le faltaba el `Investigation Lab` por etapas unificado con Decision, Evidence, Operations, Code Review y Guides.
  - **Skills a usar:** `ai-rag-llmops-finops` + `diagnosing-bugs` + `platform-observability-sre`.
  - **Tarea + Resultado:** Reemplazar `src/content/senior/*` por los **18 módulos Senior de Arquitectura de IA (`S01–S18`)** completos: `54` Decisiones balanceadas, `18` Evidence Labs (trazas Langfuse/OTel, `EXPLAIN ANALYZE` de `pgvector`, logs de fugas ACL), `18` **Investigation Labs multi-etapa** de incidentes IA en producción, `18` Operations Labs LLMOps/FinOps, `18` Code Reviews con 2 decisiones defensibles, **4 Simuladores deterministas**, **Readiness Matrix** y **Capstone AI**, retirando código duplicado.

- [x] **3.2 Expansión de `labs-ai-native/` a 18 Paquetes Ejecutables + Capstone y Alineación Byte-a-Byte con `Teaching Guides`**
  - **Qué falta:** Hoy `labs-ai-native/` tiene `3` paquetes Python mientras que el sistema de `Teaching Guides` exige `18` laboratorios nativos verificables byte-a-byte más el Capstone, y `labs-native/` sigue teniendo `20` tests de Go.
  - **Skills a usar:** `ai-rag-llmops-finops` + `platform-validation-evidence` + `complete-work-no-shortcuts`.
  - **Tarea + Resultado:** Expandir `labs-ai-native/` a **18 módulos Python estándar sin dependencias pesadas externas + `capstone_ai/`** (`25/25` tests en `python -m unittest`), regenerar `public/downloads/ai-native-senior-labs.zip` y alinear `guides.json` byte-a-byte con `lab.py`/`test_lab.py` (retiro físico de `labs-native/` junto a `ORIGINAL_INTEGRITY.json` en `4.1`).

- [x] **3.3 Frameworks Academy (`#/frameworks`): 8 Rutas × 5 Unidades = 40 Ejercicios Interactivos 100% IA + Software**
  - **Qué falta:** `src/data/frameworks-curriculum.ts` y `src/features/frameworks/data/framework-units.ts` aún contienen Gin, Chi, Echo, Fiber, gRPC, GORM y sqlc de Go.
  - **Skills a usar:** `ai-rag-llmops-finops` + `node-nest-technologies` + `shared-technologies`.
  - **Tarea + Resultado:** Implementar las **40 unidades prácticas no pre-resueltas** para `F01 LangChain & LangGraph`, `F02 PostgreSQL + pgvector + FTS`, `F03 NestJS + Zod AI`, `F04 Python FastAPI AI`, `F05 MCP Protocol`, `F06 Ragas & Eval CI`, `F07 OpenTelemetry + Langfuse` y `F08 Ollama / vLLM & FinOps`.

- [x] **3.4 Juegos de Aprendizaje (`#/games`): 5 Modos × 10 Rondas = 50 Retos 100% Arquitectura de IA**
  - **Qué falta:** `25` de las `50` rondas en `src/features/games/data/game-bank.ts` todavía preguntan sobre goroutines, slices y canales de Go.
  - **Skills a usar:** `ux-game-experience` + `ai-rag-llmops-finops` + `ux-accessibility`.
  - **Tarea + Resultado:** Convertir las **50/50 rondas** (`Quiz Battle`, `Bug Hunt`, `Architecture Match`, `Code Order`, `Incident Triage`) a escenarios puros de RAG, Embeddings, `pgvector` ACL, LangGraph, MCP, Evals y FinOps, con navegación por teclado accesible y feedback con mascota **Axon**.

- [x] **3.5 Playground Estático en Web Worker (`#/playground`) 100% Arquitectura de IA + Software**
  - **Qué falta:** `src/features/playground/analyzer.mjs` y `PlaygroundPage.tsx` incluyen plantillas y reglas de Go.
  - **Skills a usar:** `rust-agent-runtime-security` + `ai-rag-llmops-finops` + `web-mfe-security-delivery`.
  - **Tarea + Resultado:** Reenfocar el Web Worker al análisis estático determinista de **4 plantillas seleccionables de Arquitectura de IA** (`NestJS + Zod RAG Controller`, `LangGraph Agent State`, `PostgreSQL pgvector + ACL Query`, `MCP Tool Server & FinOps Guard`), detectando `>= 12` antipatrones reales Vigilio (`SELECT` vectorial sin filtro ACL, `tenant_id` leído del body sin auth, concatenación cruda de chunks en system prompt, grafo sin `recursionLimit`, llamada LLM sin reserva de presupuesto ni `AbortSignal`, log de prompts con PII).

---

### Bloque 4 — Limpieza Total de Activos Go, Gobernanza de Integridad, Suite BDD/UI/E2E, CI/CD y `REVIEW` (`4.1` – `4.5`)

- [x] **4.1 Limpieza Definitiva de Archivos Legacy Go + Paisajes Pixel Art Vercel AI**
  - **Qué falta:** Eliminar `public/assets/gophers/*`, `labs-native/` (Go), `public/downloads/*go*` si existiera, y actualizar los paisajes `public/assets/backgrounds/landscape-*.svg` a estética Vercel Geist + nodos neuronales (sin banderas `"GO"`).
  - **Skills a usar:** `ui-art-direction` + `refactor-existing-code`.
  - **Tarea + Resultado:** Eliminados `public/assets/gophers/`, `labs-native/` y `go-native-senior-labs.zip`; actualizados `landscape-dark.svg`, `landscape-light.svg` y `landscape-senior.svg` a paleta Vercel Geist, y actualizado `ORIGINAL_INTEGRITY.json` al snapshot canónico 100% AI-Only.

- [x] **4.2 Gate Automatizado Cero-Go (`tests/zero-go-leakage.test.mjs`) + Actualización Completa de Suites Node y Vitest**
  - **Qué falta:** Varios tests antiguos en `tests/` verificaban paquetes Go en `labs-native/` y `gophers/`.
  - **Skills a usar:** `web-mfe-testing` + `complete-work-no-shortcuts`.
  - **Tarea + Resultado:** Actualizadas `tests/content.test.mjs`, `src/features/games/GamesPage.test.tsx` (incluyendo **Three.js 3D Vector Arena**) y añadido `tests/zero-go-leakage.test.mjs` verificando **0 archivos `.go`** y **0 fugas** de `GoPixel`/`Golang`/`package main`/`gophers/`/`go.dev`.

- [x] **4.3 Limpieza de Linter Global (`npm run lint:ci` con `0` Errores Reales en Todo el Repo)**
  - **Qué falta:** Quedaban `17` warnings/errores preexistentes de Biome en scripts/componentes heredados.
  - **Skills a usar:** `web-mfe-quality` + `coderabbit-compliance`.
  - **Tarea + Resultado:** Corregidos todos los errores semánticos y de accesibilidad (`<output>` en lugar de `role="status"` y `<title>` en SVG radar) en `src/features/senior/*.tsx`; `npm run lint:ci` pasa con **`0` errores** y queda habilitado como gate bloqueante en `.github/workflows/quality.yml`.

- [x] **4.4 Suite Master E2E en Navegador Real (`scripts/test-master-e2e.mjs`) + Workflows CI/CD AI-Only**
  - **Qué falta:** Actualizar los 8 Gates de `test-master-e2e.mjs` a `aipixel:v1` y flujos 100% IA, y retirar el job `native-go` de `.github/workflows/quality.yml` dejando `frontend` + `native-ai-python` + E2E con Actions fijadas por SHA.
  - **Skills a usar:** `software-supply-chain-security` + `platform-cicd-factory` + `ui-quality-review`.
  - **Tarea + Resultado:** Retirado `native-go` de `.github/workflows/quality.yml` manteniendo SHA pinning y `persist-credentials: false`; `8/8` Gates E2E aprobados en Brave headless con persistencia en `localStorage['aipixel:v1']`.

- [x] **4.5 `README.md` Maestro 15 Secciones (AIPixel Architecture Academy) + Auditoría Independiente `REVIEW` Solo Lectura**
  - **Qué falta:** Actualizar `README.md` eliminando menciones a Go 1.26 y Gopher, documentando la arquitectura 100% AI + Software, la mascota Axon, los tokens Vercel Geist y los 18 labs Python nativos.
  - **Skills a usar:** `repository-readme-architecture` + `review-code-change` + `ui-quality-review`.
  - **Tarea + Resultado:** `README.md` unificado reproducible en `<10 min` y fase final `CODE REVIEW` en solo lectura con **todos los gates ejecutables en `PASS` real (`0` fallos, `0` bloqueos locales)**.
