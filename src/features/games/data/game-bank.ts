export type GameMode = 'quiz' | 'complete' | 'order' | 'predict' | 'bug';
export type GameDomain = 'rag' | 'agents';

export type QuizRound = {
  domain: GameDomain;
  prompt: string;
  options: string[];
  answer: string;
  explain: string;
};

export type CompleteRound = {
  domain: GameDomain;
  prompt: string;
  snippet: string;
  placeholder: string;
  answer: string;
  explain: string;
};

export type PredictRound = {
  domain: GameDomain;
  snippet: string;
  options: string[];
  answer: string;
  explain: string;
};

export type BugRound = {
  domain: GameDomain;
  prompt: string;
  snippet: string;
  options: { id: string; text: string }[];
  answer: string;
  explain: string;
};

export type OrderRound = {
  domain: GameDomain;
  prompt: string;
  initial: string[];
  expected: string[];
  explain: string;
};

export const quizBank: QuizRound[] = [
  {
    domain: 'rag',
    prompt: '¿Dónde debe aplicarse el filtro multi-tenant + ACL documental en un pipeline RAG?',
    options: [
      'En el WHERE SQL antes de entregar chunks al modelo',
      'En un prompt pidiendo al modelo que oculte secretos',
      'Solo en el frontend antes de renderizar la respuesta',
    ],
    answer: 'En el WHERE SQL antes de entregar chunks al modelo',
    explain: 'Los chunks prohibidos nunca deben entrar en la ventana de contexto del LLM.',
  },
  {
    domain: 'rag',
    prompt: '¿Qué combina Reciprocal Rank Fusion (RRF) en PostgreSQL Hybrid RAG?',
    options: [
      'Búsqueda léxica (tsvector/GIN) y búsqueda vectorial (pgvector)',
      'Dos bases MongoDB sin índices',
      'Embeddings de distinto tamaño sumados directo',
    ],
    answer: 'Búsqueda léxica (tsvector/GIN) y búsqueda vectorial (pgvector)',
    explain: 'RRF fusiona rankings de texto exacto y similitud semántica sin requerir escalas iguales.',
  },
  {
    domain: 'rag',
    prompt: '¿Por qué es insuficiente activar RLS únicamente por tenant_id?',
    options: [
      'Porque distintos roles dentro del mismo tenant pueden tener distintos permisos por documento',
      'Porque PostgreSQL no soporta WHERE con RLS',
      'Porque RLS borra índices HNSW',
    ],
    answer: 'Porque distintos roles dentro del mismo tenant pueden tener distintos permisos por documento',
    explain: 'La autorización real en RAG exige tenant + usuario/rol + documento.',
  },
  {
    domain: 'rag',
    prompt: '¿Qué parámetro de pgvector ayuda cuando HNSW devuelve 0 filas por filtros ACL muy selectivos?',
    options: [
      'SET LOCAL hnsw.iterative_scan = relaxed_order',
      'Desactivar el filtro WHERE tenant_id',
      'Cambiar vector(1024) por text',
    ],
    answer: 'SET LOCAL hnsw.iterative_scan = relaxed_order',
    explain: 'Iterative scan continúa explorando vecinos del grafo HNSW tras filtrar por ACL.',
  },
  {
    domain: 'rag',
    prompt: '¿Qué debe incluir obligatoriamente la clave de un caché semántico multi-tenant?',
    options: [
      'tenant_id + acl_scope_hash + pipeline_version',
      'Únicamente el embedding de la pregunta',
      'Solo el nombre del modelo LLM',
    ],
    answer: 'tenant_id + acl_scope_hash + pipeline_version',
    explain: 'Sin scope ACL y versión, un usuario sin permisos recibiría respuestas cacheadas ajenas.',
  },
  {
    domain: 'agents',
    prompt: '¿Cómo debe responder el sistema ante "¿Cuál es el saldo exacto de mi póliza 48392?"?',
    options: [
      'API o SQL parametrizado con autorización del actor',
      'Embeddings vectoriales del historial de chat',
      'Un enjambre autónomo de 5 agentes',
    ],
    answer: 'API o SQL parametrizado con autorización del actor',
    explain: 'Los estados transaccionales exactos se consultan en SQL/API, no por similitud semántica.',
  },
  {
    domain: 'agents',
    prompt: '¿Qué control evita que un grafo cíclico de LangGraph consuma presupuesto infinito?',
    options: [
      'recursionLimit y tope de pasos + presupuesto atómico',
      'Aumentar max_tokens a 128000',
      'Usar temperature = 0.0',
    ],
    answer: 'recursionLimit y tope de pasos + presupuesto atómico',
    explain: 'Todo grafo cíclico requiere límite estricto de iteraciones y presupuesto.',
  },
  {
    domain: 'agents',
    prompt: '¿Qué exige una herramienta con efecto lateral irreversible (reembolso, borrado, envío)?',
    options: [
      'Autorización en servidor + aprobación humana (HITL) + idempotency_key',
      'Ejecutarla automáticamente tras leer un PDF',
      'Reintentar en bucle infinito si hay timeout',
    ],
    answer: 'Autorización en servidor + aprobación humana (HITL) + idempotency_key',
    explain: 'Evita doble ejecución y acciones no autorizadas por prompt injection.',
  },
  {
    domain: 'agents',
    prompt: '¿Cuál es el orden seguro en FinOps LLM para evitar sobregiros concurrentes?',
    options: [
      'Reservar presupuesto atómicamente antes de llamar al LLM y conciliar después',
      'Confiar en un archivo YAML estático sin código de bloqueo',
      'Consultar el saldo solo al final del mes',
    ],
    answer: 'Reservar presupuesto atómicamente antes de llamar al LLM y conciliar después',
    explain: 'Solo la reserva atómica previa impide race conditions de gasto.',
  },
  {
    domain: 'agents',
    prompt: 'Si en un Release Gate de 32 controles `cross_tenant_acl` está `NOT_RUN`, ¿cuál es el dictamen?',
    options: [
      'NO-GO hasta ejecutar y aprobar la evidencia crítica',
      'GO si pasaron 3 demos manuales en chat',
      'GO condicional sin pruebas',
    ],
    answer: 'NO-GO hasta ejecutar y aprobar la evidencia crítica',
    explain: 'Regla Vigilio: NOT_RUN en controles bloqueantes equivale a NO-GO.',
  },
];

export const completeBank: CompleteRound[] = [
  {
    domain: 'rag',
    prompt: 'Completa el cálculo de distancia coseno en PostgreSQL pgvector:',
    snippet: 'SELECT id, 1 - (embedding ___ $1) AS score FROM document_chunks;',
    placeholder: '<=>',
    answer: '<=>',
    explain: '<=> es el operador de distancia coseno en pgvector.',
  },
  {
    domain: 'rag',
    prompt: 'Completa la exclusión obligatoria de documentos borrados lógicamente:',
    snippet: 'WHERE tenant_id = $1 AND deleted_at ___ NULL',
    placeholder: 'IS',
    answer: 'IS',
    explain: 'En SQL la comparación contra NULL requiere IS NULL, no = NULL.',
  },
  {
    domain: 'rag',
    prompt: 'Completa el delimitador explícito para aislar texto recuperado no confiable:',
    snippet: 'const msg = `<___>\\n${chunk}\\n</untrusted_context>`;',
    placeholder: 'untrusted_context',
    answer: 'untrusted_context',
    explain: 'Delimitar datos externos ayuda a separar instrucciones del sistema de contenido RAG.',
  },
  {
    domain: 'rag',
    prompt: 'Completa el estado estricto de salida cuando no hay evidencia suficiente:',
    snippet: "status: z.enum(['answered', '___'])",
    placeholder: 'abstained',
    answer: 'abstained',
    explain: 'Representar explícitamente la abstención evita alucinaciones forzadas.',
  },
  {
    domain: 'rag',
    prompt: 'Completa el avance de ventana en el chunker con solapamiento:',
    snippet: 'step = chunk_size - ___',
    placeholder: 'overlap',
    answer: 'overlap',
    explain: 'step = chunk_size - overlap preserva contexto entre cortes consecutivos.',
  },
  {
    domain: 'agents',
    prompt: 'Completa el límite obligatorio de ciclos al invocar LangGraph:',
    snippet: 'await graph.invoke(input, { ___: 6 });',
    placeholder: 'recursionLimit',
    answer: 'recursionLimit',
    explain: 'recursionLimit corta grafos que superen el máximo de iteraciones permitidas.',
  },
  {
    domain: 'agents',
    prompt: 'Completa el timeout estándar en una llamada HTTP hacia proveedor LLM:',
    snippet: 'const signal = AbortSignal.___(8000);',
    placeholder: 'timeout',
    answer: 'timeout',
    explain: 'AbortSignal.timeout(ms) evita peticiones colgadas indefinidamente.',
  },
  {
    domain: 'agents',
    prompt: 'Completa la carga segura de pesos en PyTorch sin ejecución arbitraria:',
    snippet: 'torch.load(path, map_location="cpu", ___=True)',
    placeholder: 'weights_only',
    answer: 'weights_only',
    explain: 'weights_only=True mitiga vulnerabilidades de deserialización tipo pickle.',
  },
  {
    domain: 'agents',
    prompt: 'Completa el modo estricto en Pydantic v2 para rechazar campos inesperados:',
    snippet: 'model_config = ConfigDict(extra="___")',
    placeholder: 'forbid',
    answer: 'forbid',
    explain: 'extra="forbid" bloquea campos no declarados en el contrato de entrada.',
  },
  {
    domain: 'agents',
    prompt: 'Completa la configuración de pgvector para mantener recall en HNSW con filtros:',
    snippet: 'SET LOCAL hnsw.___ = relaxed_order;',
    placeholder: 'iterative_scan',
    answer: 'iterative_scan',
    explain: 'hnsw.iterative_scan permite continuar buscando vecinos que cumplan el WHERE ACL.',
  },
];

export const predictBank: PredictRound[] = [
  {
    domain: 'rag',
    snippet: 'chunks = []\nif len(chunks) == 0:\n    print("abstained")\nelse:\n    print("answered")',
    options: ['abstained', 'answered', 'Error de sintaxis'],
    answer: 'abstained',
    explain: 'Sin evidencia recuperada, el pipeline debe abstenerse antes de invocar al generador.',
  },
  {
    domain: 'rag',
    snippet: 'retrieved = {"DOC-1", "DOC-2"}\ncited = ["DOC-1", "NORM-99"]\nprint(all(c in retrieved for c in cited))',
    options: ['False', 'True', 'None'],
    answer: 'False',
    explain: 'NORM-99 no existe en retrieved; el verificador rechaza citas inventadas.',
  },
  {
    domain: 'rag',
    snippet: 'index_dim = 1024; query_dim = 1024\nindex_model = "v1"; query_model = "v2"\nprint(index_model == query_model)',
    options: ['False', 'True', '1024'],
    answer: 'False',
    explain: 'Misma dimensión no garantiza compatibilidad si el modelo de embedding cambió.',
  },
  {
    domain: 'rag',
    snippet: 'total_input = 1000\ncached = 400\nuncached = max(0, total_input - cached)\nprint(uncached)',
    options: ['600', '1400', '400'],
    answer: '600',
    explain: 'Algunos proveedores incluyen cached dentro de total_input; restarlo evita doble conteo.',
  },
  {
    domain: 'rag',
    snippet: 'k1 = "rag:v2:t1:hr:q1"\nk2 = "rag:v2:t1:intern:q1"\nprint(k1 == k2)',
    options: ['False', 'True', 'rag:v2'],
    answer: 'False',
    explain: 'Incluir el hash de roles/ACL en la clave evita fugas de caché entre roles.',
  },
  {
    domain: 'agents',
    snippet: 'hops = 4; max_hops = 4; spent = 0.05; budget = 1.00\nprint(hops < max_hops and spent < budget)',
    options: ['False', 'True', '0.95'],
    answer: 'False',
    explain: 'Al alcanzar max_hops el agente debe detenerse aunque quede presupuesto.',
  },
  {
    domain: 'agents',
    snippet: 'balance = 0.30\ncost = 0.50\nprint(balance >= cost)',
    options: ['False', 'True', '-0.20'],
    answer: 'False',
    explain: 'La reserva atómica previa rechaza llamadas cuando el saldo no alcanza.',
  },
  {
    domain: 'agents',
    snippet: 'train_max = "2026-02-01"\neval_min = "2026-01-15"\nprint(train_max < eval_min)',
    options: ['False', 'True', '2026'],
    answer: 'False',
    explain: 'Hay solapamiento temporal (data leakage) porque eval precede a train.',
  },
  {
    domain: 'agents',
    snippet: 'gates = {"acl": "PASS", "finops": "NOT_RUN"}\nprint("GO" if all(v == "PASS" for v in gates.values()) else "NO-GO")',
    options: ['NO-GO', 'GO', 'PARTIAL'],
    answer: 'NO-GO',
    explain: 'Cualquier control crítico en NOT_RUN obliga a dictamen NO-GO.',
  },
  {
    domain: 'agents',
    snippet: 'applied = {"req-1": "ok"}\nprint("cached" if "req-1" in applied else "execute")',
    options: ['cached', 'execute', 'error'],
    answer: 'cached',
    explain: 'La clave de idempotencia evita ejecutar efectos laterales duplicados tras un reintento.',
  },
];

export const bugBank: BugRound[] = [
  {
    domain: 'rag',
    prompt: 'Encuentra la vulnerabilidad multi-tenant en esta consulta pgvector:',
    snippet: '1: SELECT c.content FROM document_chunks c\n2: WHERE c.embedding <=> $1 < 0.3\n3: ORDER BY c.embedding <=> $1 LIMIT 8;',
    options: [
      { id: '1', text: 'Línea 1: falta SELECT *' },
      { id: '2', text: 'Línea 2: faltan tenant_id, ACL documental y deleted_at IS NULL' },
      { id: '3', text: 'Línea 3: LIMIT 8 es inválido' },
    ],
    answer: '2',
    explain: 'Sin filtros de tenant, ACL de usuario/documento ni deleted_at se exponen datos ajenos.',
  },
  {
    domain: 'rag',
    prompt: 'Encuentra el bug que permite prompt injection indirecta en el prompt:',
    snippet: '1: const sys = `${POLICY}\\n${retrievedPdfChunk}`;\n2: const messages = [{ role: "system", content: sys }, { role: "user", content: q }];',
    options: [
      { id: '1', text: 'Línea 1: inyecta texto no confiable del PDF dentro del system prompt' },
      { id: '2', text: 'Línea 2: usa un array de mensajes' },
      { id: '3', text: 'Línea 2: el rol user es demasiado corto' },
    ],
    answer: '1',
    explain: 'Chunks externos son datos no confiables y jamás deben mezclarse en system.',
  },
  {
    domain: 'rag',
    prompt: 'Encuentra el antipatrón de invalidación de caché en Redis/Valkey:',
    snippet: '1: async function revokeDoc(tenantId: string) {\n2:   await redis.del(`rag:${tenantId}:*`);\n3: }',
    options: [
      { id: '1', text: 'Línea 1: función async' },
      { id: '2', text: 'Línea 2: redis.del con wildcard "*" no borra claves en Redis' },
      { id: '3', text: 'Línea 3: falta return' },
    ],
    answer: '2',
    explain: 'DEL no expande globs; usa rotación de epoch/versión por tenant.',
  },
  {
    domain: 'rag',
    prompt: 'Encuentra el bug en la validación de citas RAG:',
    snippet: '1: const parsed = AnswerSchema.parse(llmJson);\n2: return parsed; // parsed.citations = ["ART-999"]',
    options: [
      { id: '1', text: 'Línea 1: Zod no debe usarse en backend' },
      { id: '2', text: 'Línea 2: devuelve citas sin verificar si existen en retrieved_ids' },
      { id: '3', text: 'Línea 1: parse es síncrono' },
    ],
    answer: '2',
    explain: 'Zod valida estructura, no la existencia real de los IDs citados.',
  },
  {
    domain: 'rag',
    prompt: 'Encuentra el fallo de seguridad en el controller HTTP:',
    snippet: '1: @Post("ask")\n2: ask(@Body() body: { tenantId: string; q: string }) {\n3:   return this.rag.run(body.tenantId, body.q);\n4: }',
    options: [
      { id: '1', text: 'Línea 1: usa @Post' },
      { id: '2', text: 'Línea 3: confía en body.tenantId enviado por el cliente en vez del token/Guard' },
      { id: '3', text: 'Línea 2: usa TypeScript' },
    ],
    answer: '2',
    explain: 'Confiar en tenantId del body permite suplantación cross-tenant.',
  },
  {
    domain: 'agents',
    prompt: 'Encuentra el bug de doble cobro en el nodo del agente:',
    snippet: '1: async function refundNode(state) {\n2:   return await payments.refund(state.orderId, { key: crypto.randomUUID() });\n3: }',
    options: [
      { id: '1', text: 'Línea 1: es async' },
      { id: '2', text: 'Línea 2: randomUUID() genera distinta clave en cada retry rompiendo idempotencia' },
      { id: '3', text: 'Línea 3: falta punto y coma' },
    ],
    answer: '2',
    explain: 'La clave de idempotencia debe ser determinista por run_id + step_id.',
  },
  {
    domain: 'agents',
    prompt: 'Encuentra el bug de privacidad en telemetría OpenTelemetry:',
    snippet: '1: span.setAttribute("gen_ai.prompt", req.rawMedicalNote);\n2: metrics.inc("rag_req", { user_email: req.email });',
    options: [
      { id: '1', text: 'Líneas 1-2: expone PII cruda en spans y alta cardinalidad en Prometheus' },
      { id: '2', text: 'Línea 1: setAttribute espera boolean' },
      { id: '3', text: 'Línea 2: metrics.inc no existe' },
    ],
    answer: '1',
    explain: 'Redacta PII/prompts en spans y mantén baja cardinalidad en Prometheus.',
  },
  {
    domain: 'agents',
    prompt: 'Encuentra el bug de concurrencia en ingesta masiva:',
    snippet: '1: docs.forEach(async (doc) => {\n2:   await embedAndInsert(doc);\n3: });\n4: return { done: true };',
    options: [
      { id: '1', text: 'Línea 1: forEach(async) no espera promesas y dispara concurrencia sin cota' },
      { id: '2', text: 'Línea 4: devuelve objeto literal' },
      { id: '3', text: 'Línea 2: falta try' },
    ],
    answer: '1',
    explain: 'forEach ignora la promesa devuelta por async; usa cola o concurrencia acotada.',
  },
  {
    domain: 'agents',
    prompt: 'Encuentra la vulnerabilidad en el servidor MCP de archivos:',
    snippet: '1: function readMcpFile(userPath: string) {\n2:   return fs.readFileSync(path.join(WORKSPACE, userPath), "utf8");\n3: }',
    options: [
      { id: '1', text: 'Línea 2: path.join permite escapar del WORKSPACE con "../.env"' },
      { id: '2', text: 'Línea 2: "utf8" es lento' },
      { id: '3', text: 'Línea 1: falta async' },
    ],
    answer: '1',
    explain: 'Debe canonicalizarse la ruta y validar startsWith(root + sep).',
  },
  {
    domain: 'agents',
    prompt: 'Encuentra el fallo de FinOps en el gateway LLM:',
    snippet: '1: const res = await callLlm(prompt);\n2: await budgetRepo.deductAfter(tenantId, res.costUsd);',
    options: [
      { id: '1', text: 'Línea 1: falta async' },
      { id: '2', text: 'Línea 2: deduce después de llamar al LLM, permitiendo sobregiros concurrentes' },
      { id: '3', text: 'Línea 2: costUsd es número' },
    ],
    answer: '2',
    explain: 'El presupuesto debe reservarse atómicamente antes de invocar al modelo.',
  },
];

export const orderBank: OrderRound[] = [
  {
    domain: 'rag',
    prompt: 'Ordena las fases de una consulta Hybrid RAG segura en producción:',
    initial: ['Verificar citas y responder', 'Autenticar actor y ACL', 'Fusión RRF (FTS + pgvector)', 'Generar con contexto delimitado'],
    expected: ['Autenticar actor y ACL', 'Fusión RRF (FTS + pgvector)', 'Generar con contexto delimitado', 'Verificar citas y responder'],
    explain: 'La autorización precede siempre al retrieval y las citas se validan tras generar.',
  },
  {
    domain: 'rag',
    prompt: 'Ordena el pipeline de ingesta idempotente:',
    initial: ['Upsert atómico de chunks', 'Calcular SHA-256 del documento', 'Extraer y particionar con linaje', 'Generar embeddings batch'],
    expected: ['Calcular SHA-256 del documento', 'Extraer y particionar con linaje', 'Generar embeddings batch', 'Upsert atómico de chunks'],
    explain: 'Verificar el hash primero evita re-embedear documentos sin cambios.',
  },
  {
    domain: 'rag',
    prompt: 'Ordena la migración Blue-Green de un modelo de embedding sin downtime:',
    initial: ['Conmutar puntero y conservar rollback', 'Reindexar en tabla/columna sombra', 'Validar Recall@K y nDCG en golden set', 'Versionar modelo y dimensiones'],
    expected: ['Versionar modelo y dimensiones', 'Reindexar en tabla/columna sombra', 'Validar Recall@K y nDCG en golden set', 'Conmutar puntero y conservar rollback'],
    explain: 'Nunca sobrescribas vectores en caliente sin validar en sombra.',
  },
  {
    domain: 'rag',
    prompt: 'Ordena la secuencia de borrado GDPR / Derecho al Olvido en RAG:',
    initial: ['Test negativo confirmando 0 hits', 'Invalidar caché ACL por versión', 'Eliminar documento origen y document_chunks', 'Auditar evento sin PII'],
    expected: ['Eliminar documento origen y document_chunks', 'Invalidar caché ACL por versión', 'Test negativo confirmando 0 hits', 'Auditar evento sin PII'],
    explain: 'El borrado debe limpiar tabla, vectores y cachés verificando 0 residuos.',
  },
  {
    domain: 'rag',
    prompt: 'Ordena el cálculo seguro de presupuesto de contexto antes de invocar al LLM:',
    initial: ['Empaquetar chunks ordenados por score', 'Reservar tokens de system + max_output', 'Calcular cupo disponible para contexto', 'Truncar o abstenerse si excede'],
    expected: ['Reservar tokens de system + max_output', 'Calcular cupo disponible para contexto', 'Empaquetar chunks ordenados por score', 'Truncar o abstenerse si excede'],
    explain: 'Siempre se reservan instrucciones y salida antes de llenar chunks.',
  },
  {
    domain: 'agents',
    prompt: 'Ordena el flujo seguro para una tool con efectos laterales:',
    initial: ['Ejecutar adaptador con idempotency_key', 'Validar schema Zod/Pydantic', 'Autenticar actor y autorizar recurso', 'Solicitar aprobación humana (HITL)'],
    expected: ['Validar schema Zod/Pydantic', 'Autenticar actor y autorizar recurso', 'Solicitar aprobación humana (HITL)', 'Ejecutar adaptador con idempotency_key'],
    explain: 'Validación -> Autorización -> HITL -> Ejecución idempotente.',
  },
  {
    domain: 'agents',
    prompt: 'Ordena el ciclo FinOps atómico por petición LLM:',
    initial: ['Conciliar costo real vs estimado', 'Reservar presupuesto máximo atómicamente', 'Invocar LLM con timeout y retry acotado', 'Registrar métrica sin PII'],
    expected: ['Reservar presupuesto máximo atómicamente', 'Invocar LLM con timeout y retry acotado', 'Conciliar costo real vs estimado', 'Registrar métrica sin PII'],
    explain: 'Reserva previa, ejecución acotada, conciliación y telemetría limpia.',
  },
  {
    domain: 'agents',
    prompt: 'Ordena el flujo de decisión arquitectónica (Seleccionar patrón IA):',
    initial: ['Evaluar Hybrid RAG + RRF si es documental', 'Clasificar si la consulta es estado transaccional exacto', 'Resolver con SQL/API autorizada si es exacto', 'Escalar a Agentic/LangGraph solo con evidencia'],
    expected: ['Clasificar si la consulta es estado transaccional exacto', 'Resolver con SQL/API autorizada si es exacto', 'Evaluar Hybrid RAG + RRF si es documental', 'Escalar a Agentic/LangGraph solo con evidencia'],
    explain: 'Empieza por lo más simple y determinista antes de añadir agentes.',
  },
  {
    domain: 'agents',
    prompt: 'Ordena el manejo seguro de un endpoint MCP de archivos:',
    initial: ['Verificar scope del actor', 'Resolver ruta real y validar prefijo root', 'Leer archivo dentro del límite de tamaño', 'Emitir log de auditoría sin secretos'],
    expected: ['Verificar scope del actor', 'Resolver ruta real y validar prefijo root', 'Leer archivo dentro del límite de tamaño', 'Emitir log de auditoría sin secretos'],
    explain: 'Autorización y sandbox de ruta ocurren antes de tocar el sistema de archivos.',
  },
  {
    domain: 'agents',
    prompt: 'Ordena el flujo de Release Gate Go/No-Go Vigilio:',
    initial: ['Decidir GO solo si todo crítico está PASS', 'Ejecutar tests cross-tenant ACL y citas', 'Validar presupuesto concurrente y borrado', 'Medir golden set (Recall@K + Faithfulness)'],
    expected: ['Ejecutar tests cross-tenant ACL y citas', 'Validar presupuesto concurrente y borrado', 'Medir golden set (Recall@K + Faithfulness)', 'Decidir GO solo si todo crítico está PASS'],
    explain: 'Sin evidencia ejecutada de seguridad, FinOps y evals, el dictamen es NO-GO.',
  },
];
