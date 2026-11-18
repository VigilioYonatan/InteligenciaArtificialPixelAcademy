// Frameworks Academy curriculum for AIPixel Academy (F01-F08)
// 5 structured AI Architecture & Software units per framework in 6 languages.

export type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

export const frameworkCurriculum: Record<string, {
  subtitle: Record<Locale, string>;
  units: Record<Locale, string[]>;
}> = {
  F01: {
    subtitle: {
    "es": "LangChain Runnables, StateGraph, Checkpoints e HITL",
    "en": "LangChain Runnables, StateGraph, Checkpoints & HITL",
    "ja": "LangChain Runnables・StateGraph・Checkpoints・HITL",
    "zh": "LangChain Runnables、StateGraph、检查点与人机协同",
    "pt": "LangChain Runnables, StateGraph, Checkpoints e HITL",
    "fr": "LangChain Runnables, StateGraph, Checkpoints et HITL"
},
    units: {
    "es": [
        "1. Encapsular Runnables detrás de AnswerGeneratorPort",
        "2. Estado tipado inmutable en LangGraph StateGraph",
        "3. Aristas condicionales con salida a abstención",
        "4. Límite obligatorio recursionLimit contra bucles",
        "5. Pausa interrupt/checkpoint para aprobación HITL"
    ],
    "en": [
        "1. Encapsular Runnables detrás de AnswerGeneratorPort",
        "2. Estado tipado inmutable en LangGraph StateGraph",
        "3. Aristas condicionales con salida a abstención",
        "4. Límite obligatorio recursionLimit contra bucles",
        "5. Pausa interrupt/checkpoint para aprobación HITL"
    ],
    "ja": [
        "1. Encapsular Runnables detrás de AnswerGeneratorPort",
        "2. Estado tipado inmutable en LangGraph StateGraph",
        "3. Aristas condicionales con salida a abstención",
        "4. Límite obligatorio recursionLimit contra bucles",
        "5. Pausa interrupt/checkpoint para aprobación HITL"
    ],
    "zh": [
        "1. Encapsular Runnables detrás de AnswerGeneratorPort",
        "2. Estado tipado inmutable en LangGraph StateGraph",
        "3. Aristas condicionales con salida a abstención",
        "4. Límite obligatorio recursionLimit contra bucles",
        "5. Pausa interrupt/checkpoint para aprobación HITL"
    ],
    "pt": [
        "1. Encapsular Runnables detrás de AnswerGeneratorPort",
        "2. Estado tipado inmutable en LangGraph StateGraph",
        "3. Aristas condicionales con salida a abstención",
        "4. Límite obligatorio recursionLimit contra bucles",
        "5. Pausa interrupt/checkpoint para aprobación HITL"
    ],
    "fr": [
        "1. Encapsular Runnables detrás de AnswerGeneratorPort",
        "2. Estado tipado inmutable en LangGraph StateGraph",
        "3. Aristas condicionales con salida a abstención",
        "4. Límite obligatorio recursionLimit contra bucles",
        "5. Pausa interrupt/checkpoint para aprobación HITL"
    ]
},
  },
  F02: {
    subtitle: {
    "es": "PostgreSQL + pgvector + FTS + RRF + ACL Documental",
    "en": "PostgreSQL + pgvector + FTS + RRF + Document ACL",
    "ja": "PostgreSQL + pgvector + FTS + RRF + 文書単位ACL",
    "zh": "PostgreSQL + pgvector + 全文检索 + RRF + 文档 ACL",
    "pt": "PostgreSQL + pgvector + FTS + RRF + ACL Documental",
    "fr": "PostgreSQL + pgvector + FTS + RRF + ACL Documentaire"
},
    units: {
    "es": [
        "1. Esquema versionado con embedding_model y deleted_at",
        "2. Búsqueda vectorial parametrizada con <=>",
        "3. Filtro multi-tenant + ACL por usuario/documento",
        "4. Fusión híbrida FTS (tsvector) + vector con RRF",
        "5. Ajuste HNSW iterative_scan bajo filtros selectivos"
    ],
    "en": [
        "1. Esquema versionado con embedding_model y deleted_at",
        "2. Búsqueda vectorial parametrizada con <=>",
        "3. Filtro multi-tenant + ACL por usuario/documento",
        "4. Fusión híbrida FTS (tsvector) + vector con RRF",
        "5. Ajuste HNSW iterative_scan bajo filtros selectivos"
    ],
    "ja": [
        "1. Esquema versionado con embedding_model y deleted_at",
        "2. Búsqueda vectorial parametrizada con <=>",
        "3. Filtro multi-tenant + ACL por usuario/documento",
        "4. Fusión híbrida FTS (tsvector) + vector con RRF",
        "5. Ajuste HNSW iterative_scan bajo filtros selectivos"
    ],
    "zh": [
        "1. Esquema versionado con embedding_model y deleted_at",
        "2. Búsqueda vectorial parametrizada con <=>",
        "3. Filtro multi-tenant + ACL por usuario/documento",
        "4. Fusión híbrida FTS (tsvector) + vector con RRF",
        "5. Ajuste HNSW iterative_scan bajo filtros selectivos"
    ],
    "pt": [
        "1. Esquema versionado con embedding_model y deleted_at",
        "2. Búsqueda vectorial parametrizada con <=>",
        "3. Filtro multi-tenant + ACL por usuario/documento",
        "4. Fusión híbrida FTS (tsvector) + vector con RRF",
        "5. Ajuste HNSW iterative_scan bajo filtros selectivos"
    ],
    "fr": [
        "1. Esquema versionado con embedding_model y deleted_at",
        "2. Búsqueda vectorial parametrizada con <=>",
        "3. Filtro multi-tenant + ACL por usuario/documento",
        "4. Fusión híbrida FTS (tsvector) + vector con RRF",
        "5. Ajuste HNSW iterative_scan bajo filtros selectivos"
    ]
},
  },
  F03: {
    subtitle: {
    "es": "NestJS + Zod 4, Guards de Identidad, Puertos DDD y SSE",
    "en": "NestJS + Zod 4, Identity Guards, DDD Ports & SSE",
    "ja": "NestJS + Zod 4・認証Guard・DDDポート・SSE",
    "zh": "NestJS + Zod 4、鉴权 Guard、DDD 端口与 SSE 流式接口",
    "pt": "NestJS + Zod 4, Guards de Identidade, Portas DDD e SSE",
    "fr": "NestJS + Zod 4, Guards d’Identité, Ports DDD et SSE"
},
    units: {
    "es": [
        "1. Schema Zod estricto de entrada con límites de longitud",
        "2. Extraer tenant_id del AuthGuard, jamás del body",
        "3. Controller delgado delegando a KnowledgeRetriever",
        "4. Reserva previa mediante BudgetAuthorizer port",
        "5. Streaming SSE cancelable con AbortSignal"
    ],
    "en": [
        "1. Schema Zod estricto de entrada con límites de longitud",
        "2. Extraer tenant_id del AuthGuard, jamás del body",
        "3. Controller delgado delegando a KnowledgeRetriever",
        "4. Reserva previa mediante BudgetAuthorizer port",
        "5. Streaming SSE cancelable con AbortSignal"
    ],
    "ja": [
        "1. Schema Zod estricto de entrada con límites de longitud",
        "2. Extraer tenant_id del AuthGuard, jamás del body",
        "3. Controller delgado delegando a KnowledgeRetriever",
        "4. Reserva previa mediante BudgetAuthorizer port",
        "5. Streaming SSE cancelable con AbortSignal"
    ],
    "zh": [
        "1. Schema Zod estricto de entrada con límites de longitud",
        "2. Extraer tenant_id del AuthGuard, jamás del body",
        "3. Controller delgado delegando a KnowledgeRetriever",
        "4. Reserva previa mediante BudgetAuthorizer port",
        "5. Streaming SSE cancelable con AbortSignal"
    ],
    "pt": [
        "1. Schema Zod estricto de entrada con límites de longitud",
        "2. Extraer tenant_id del AuthGuard, jamás del body",
        "3. Controller delgado delegando a KnowledgeRetriever",
        "4. Reserva previa mediante BudgetAuthorizer port",
        "5. Streaming SSE cancelable con AbortSignal"
    ],
    "fr": [
        "1. Schema Zod estricto de entrada con límites de longitud",
        "2. Extraer tenant_id del AuthGuard, jamás del body",
        "3. Controller delgado delegando a KnowledgeRetriever",
        "4. Reserva previa mediante BudgetAuthorizer port",
        "5. Streaming SSE cancelable con AbortSignal"
    ]
},
  },
  F04: {
    subtitle: {
    "es": "FastAPI, Pydantic v2, Ingesta Idempotente y Reranking",
    "en": "FastAPI, Pydantic v2, Idempotent Ingestion & Reranking",
    "ja": "FastAPI・Pydantic v2・冪等取り込み・リランキング",
    "zh": "FastAPI、Pydantic v2、幂等摄取与重排序微服务",
    "pt": "FastAPI, Pydantic v2, Ingestão Idempotente e Reranking",
    "fr": "FastAPI, Pydantic v2, Ingestion Idempotente et Reranking"
},
    units: {
    "es": [
        "1. Modelo Pydantic v2 con extra=\"forbid\" y validación",
        "2. Ingesta idempotente por hash SHA-256",
        "3. Evitar bloqueo del event loop usando asyncio/workers",
        "4. Reranking acotado sobre top-N candidatos",
        "5. Deserialización segura sin pickle ni weights_only=False"
    ],
    "en": [
        "1. Modelo Pydantic v2 con extra=\"forbid\" y validación",
        "2. Ingesta idempotente por hash SHA-256",
        "3. Evitar bloqueo del event loop usando asyncio/workers",
        "4. Reranking acotado sobre top-N candidatos",
        "5. Deserialización segura sin pickle ni weights_only=False"
    ],
    "ja": [
        "1. Modelo Pydantic v2 con extra=\"forbid\" y validación",
        "2. Ingesta idempotente por hash SHA-256",
        "3. Evitar bloqueo del event loop usando asyncio/workers",
        "4. Reranking acotado sobre top-N candidatos",
        "5. Deserialización segura sin pickle ni weights_only=False"
    ],
    "zh": [
        "1. Modelo Pydantic v2 con extra=\"forbid\" y validación",
        "2. Ingesta idempotente por hash SHA-256",
        "3. Evitar bloqueo del event loop usando asyncio/workers",
        "4. Reranking acotado sobre top-N candidatos",
        "5. Deserialización segura sin pickle ni weights_only=False"
    ],
    "pt": [
        "1. Modelo Pydantic v2 con extra=\"forbid\" y validación",
        "2. Ingesta idempotente por hash SHA-256",
        "3. Evitar bloqueo del event loop usando asyncio/workers",
        "4. Reranking acotado sobre top-N candidatos",
        "5. Deserialización segura sin pickle ni weights_only=False"
    ],
    "fr": [
        "1. Modelo Pydantic v2 con extra=\"forbid\" y validación",
        "2. Ingesta idempotente por hash SHA-256",
        "3. Evitar bloqueo del event loop usando asyncio/workers",
        "4. Reranking acotado sobre top-N candidatos",
        "5. Deserialización segura sin pickle ni weights_only=False"
    ]
},
  },
  F05: {
    subtitle: {
    "es": "MCP Servers, Scopes Mínimos, Sandboxing y Auditoría",
    "en": "MCP Servers, Least-Privilege Scopes, Sandboxing & Audit",
    "ja": "MCPサーバー・最小権限スコープ・サンドボックス・監査",
    "zh": "MCP 服务端、最小权限范围、沙箱隔离与安全审计",
    "pt": "Servidores MCP, Escopos Mínimos, Sandboxing e Auditoria",
    "fr": "Serveurs MCP, Scopes Minimaux, Sandboxing et Audit"
},
    units: {
    "es": [
        "1. Allowlist explícita de herramientas MCP",
        "2. Canonicalización de rutas contra path traversal",
        "3. Autorización por invocación y scope del actor",
        "4. Validación de argumentos antes de ejecutar tool",
        "5. Registro de auditoría sin secretos ni PII"
    ],
    "en": [
        "1. Allowlist explícita de herramientas MCP",
        "2. Canonicalización de rutas contra path traversal",
        "3. Autorización por invocación y scope del actor",
        "4. Validación de argumentos antes de ejecutar tool",
        "5. Registro de auditoría sin secretos ni PII"
    ],
    "ja": [
        "1. Allowlist explícita de herramientas MCP",
        "2. Canonicalización de rutas contra path traversal",
        "3. Autorización por invocación y scope del actor",
        "4. Validación de argumentos antes de ejecutar tool",
        "5. Registro de auditoría sin secretos ni PII"
    ],
    "zh": [
        "1. Allowlist explícita de herramientas MCP",
        "2. Canonicalización de rutas contra path traversal",
        "3. Autorización por invocación y scope del actor",
        "4. Validación de argumentos antes de ejecutar tool",
        "5. Registro de auditoría sin secretos ni PII"
    ],
    "pt": [
        "1. Allowlist explícita de herramientas MCP",
        "2. Canonicalización de rutas contra path traversal",
        "3. Autorización por invocación y scope del actor",
        "4. Validación de argumentos antes de ejecutar tool",
        "5. Registro de auditoría sin secretos ni PII"
    ],
    "fr": [
        "1. Allowlist explícita de herramientas MCP",
        "2. Canonicalización de rutas contra path traversal",
        "3. Autorización por invocación y scope del actor",
        "4. Validación de argumentos antes de ejecutar tool",
        "5. Registro de auditoría sin secretos ni PII"
    ]
},
  },
  F06: {
    subtitle: {
    "es": "Ragas, Golden Sets, Recall@K, Faithfulness y Gates CI",
    "en": "Ragas, Golden Sets, Recall@K, Faithfulness & CI Gates",
    "ja": "Ragas・Golden Set・Recall@K・忠実度・CIゲート",
    "zh": "Ragas、黄金数据集、Recall@K、忠实度与 CI 门禁",
    "pt": "Ragas, Golden Sets, Recall@K, Faithfulness e Gates CI",
    "fr": "Ragas, Golden Sets, Recall@K, Fidélité et Gates CI"
},
    units: {
    "es": [
        "1. Cálculo determinista de Recall@K en retrieval",
        "2. Cálculo de precisión en citas verificables",
        "3. Tasa de abstención ante preguntas sin evidencia",
        "4. Split temporal estricto para evitar data leakage",
        "5. Gate CI que falla si cae debajo del threshold"
    ],
    "en": [
        "1. Cálculo determinista de Recall@K en retrieval",
        "2. Cálculo de precisión en citas verificables",
        "3. Tasa de abstención ante preguntas sin evidencia",
        "4. Split temporal estricto para evitar data leakage",
        "5. Gate CI que falla si cae debajo del threshold"
    ],
    "ja": [
        "1. Cálculo determinista de Recall@K en retrieval",
        "2. Cálculo de precisión en citas verificables",
        "3. Tasa de abstención ante preguntas sin evidencia",
        "4. Split temporal estricto para evitar data leakage",
        "5. Gate CI que falla si cae debajo del threshold"
    ],
    "zh": [
        "1. Cálculo determinista de Recall@K en retrieval",
        "2. Cálculo de precisión en citas verificables",
        "3. Tasa de abstención ante preguntas sin evidencia",
        "4. Split temporal estricto para evitar data leakage",
        "5. Gate CI que falla si cae debajo del threshold"
    ],
    "pt": [
        "1. Cálculo determinista de Recall@K en retrieval",
        "2. Cálculo de precisión en citas verificables",
        "3. Tasa de abstención ante preguntas sin evidencia",
        "4. Split temporal estricto para evitar data leakage",
        "5. Gate CI que falla si cae debajo del threshold"
    ],
    "fr": [
        "1. Cálculo determinista de Recall@K en retrieval",
        "2. Cálculo de precisión en citas verificables",
        "3. Tasa de abstención ante preguntas sin evidencia",
        "4. Split temporal estricto para evitar data leakage",
        "5. Gate CI que falla si cae debajo del threshold"
    ]
},
  },
  F07: {
    subtitle: {
    "es": "OpenTelemetry GenAI, Langfuse & Arize Phoenix sin PII",
    "en": "OpenTelemetry GenAI, Langfuse & Arize Phoenix (Zero PII)",
    "ja": "OpenTelemetry GenAI・Langfuse・Phoenix（PII除外）",
    "zh": "OpenTelemetry GenAI、Langfuse 与 Arize Phoenix（零 PII）",
    "pt": "OpenTelemetry GenAI, Langfuse e Arize Phoenix sem PII",
    "fr": "OpenTelemetry GenAI, Langfuse et Arize Phoenix sans PII"
},
    units: {
    "es": [
        "1. Atributos estándar gen_ai.* sin prompts crudos",
        "2. Redacción de PII/tokens en SpanProcessor",
        "3. Etiquetas Prometheus de baja cardinalidad",
        "4. Correlación de prompt_version y model_version",
        "5. Registro de latencia p95 TTFT y errores por proveedor"
    ],
    "en": [
        "1. Atributos estándar gen_ai.* sin prompts crudos",
        "2. Redacción de PII/tokens en SpanProcessor",
        "3. Etiquetas Prometheus de baja cardinalidad",
        "4. Correlación de prompt_version y model_version",
        "5. Registro de latencia p95 TTFT y errores por proveedor"
    ],
    "ja": [
        "1. Atributos estándar gen_ai.* sin prompts crudos",
        "2. Redacción de PII/tokens en SpanProcessor",
        "3. Etiquetas Prometheus de baja cardinalidad",
        "4. Correlación de prompt_version y model_version",
        "5. Registro de latencia p95 TTFT y errores por proveedor"
    ],
    "zh": [
        "1. Atributos estándar gen_ai.* sin prompts crudos",
        "2. Redacción de PII/tokens en SpanProcessor",
        "3. Etiquetas Prometheus de baja cardinalidad",
        "4. Correlación de prompt_version y model_version",
        "5. Registro de latencia p95 TTFT y errores por proveedor"
    ],
    "pt": [
        "1. Atributos estándar gen_ai.* sin prompts crudos",
        "2. Redacción de PII/tokens en SpanProcessor",
        "3. Etiquetas Prometheus de baja cardinalidad",
        "4. Correlación de prompt_version y model_version",
        "5. Registro de latencia p95 TTFT y errores por proveedor"
    ],
    "fr": [
        "1. Atributos estándar gen_ai.* sin prompts crudos",
        "2. Redacción de PII/tokens en SpanProcessor",
        "3. Etiquetas Prometheus de baja cardinalidad",
        "4. Correlación de prompt_version y model_version",
        "5. Registro de latencia p95 TTFT y errores por proveedor"
    ]
},
  },
  F08: {
    subtitle: {
    "es": "Ollama / vLLM Serving, Caché ACL y FinOps Atómico",
    "en": "Ollama / vLLM Serving, ACL Cache & Atomic FinOps",
    "ja": "Ollama / vLLM推論・ACL分離キャッシュ・アトミックFinOps",
    "zh": "Ollama / vLLM 推理服务、ACL 缓存与原子级 FinOps",
    "pt": "Ollama / vLLM Serving, Cache ACL e FinOps Atômico",
    "fr": "Ollama / vLLM Serving, Cache ACL et FinOps Atomique"
},
    units: {
    "es": [
        "1. Reserva atómica de presupuesto antes de inferir",
        "2. Normalización de cached_tokens sin doble conteo",
        "3. Conciliación estimado vs facturado",
        "4. Control de admisión y max_model_len en vLLM",
        "5. Clave de caché segregada por tenant y ACL"
    ],
    "en": [
        "1. Reserva atómica de presupuesto antes de inferir",
        "2. Normalización de cached_tokens sin doble conteo",
        "3. Conciliación estimado vs facturado",
        "4. Control de admisión y max_model_len en vLLM",
        "5. Clave de caché segregada por tenant y ACL"
    ],
    "ja": [
        "1. Reserva atómica de presupuesto antes de inferir",
        "2. Normalización de cached_tokens sin doble conteo",
        "3. Conciliación estimado vs facturado",
        "4. Control de admisión y max_model_len en vLLM",
        "5. Clave de caché segregada por tenant y ACL"
    ],
    "zh": [
        "1. Reserva atómica de presupuesto antes de inferir",
        "2. Normalización de cached_tokens sin doble conteo",
        "3. Conciliación estimado vs facturado",
        "4. Control de admisión y max_model_len en vLLM",
        "5. Clave de caché segregada por tenant y ACL"
    ],
    "pt": [
        "1. Reserva atómica de presupuesto antes de inferir",
        "2. Normalización de cached_tokens sin doble conteo",
        "3. Conciliación estimado vs facturado",
        "4. Control de admisión y max_model_len en vLLM",
        "5. Clave de caché segregada por tenant y ACL"
    ],
    "fr": [
        "1. Reserva atómica de presupuesto antes de inferir",
        "2. Normalización de cached_tokens sin doble conteo",
        "3. Conciliación estimado vs facturado",
        "4. Control de admisión y max_model_len en vLLM",
        "5. Clave de caché segregada por tenant y ACL"
    ]
},
  },
};
