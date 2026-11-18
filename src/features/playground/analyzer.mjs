// Pure deterministic static antipattern analyzer for AI Architecture & Software.
// Never compiles or executes user code.

export function analyzeSnippet(language, source) {
  const code = typeof source === 'string' ? source.slice(0, 30000) : '';
  const findings = [];

  if (language === 'nestjs') {
    if (/body\.tenantId|req\.body\.tenant_id/i.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'AI-TENANT-FROM-BODY',
        message: 'Nunca confíes en tenant_id enviado en el body; extráelo del Guard/JWT verificado.',
      });
    }
    if (/fetch\s*\(/.test(code) && !/AbortSignal|signal\s*:/.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'AI-MISSING-ABORT',
        message: 'Llamada LLM sin AbortSignal.timeout/signal expone a peticiones colgadas y costos ociosos.',
      });
    }
    if (/setAttribute\s*\(\s*['"]gen_ai\.prompt['"]|console\.log\([^)]*prompt/i.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'AI-LOG-RAW-PROMPT',
        message: 'No exportes prompts crudos ni PII por defecto en trazas OpenTelemetry o logs.',
      });
    }
    if (/forEach\s*\(\s*async\s+/.test(code)) {
      findings.push({
        severity: 'medium',
        rule: 'AI-FOREACH-ASYNC',
        message: 'forEach(async ...) no espera promesas y dispara concurrencia sin cota hacia DB/LLM.',
      });
    }
  } else if (language === 'langgraph') {
    if (/StateGraph|graph\.invoke/.test(code) && !/recursionLimit|recursion_limit|max_steps/.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'AI-GRAPH-NO-LIMIT',
        message: 'Grafo LangGraph sin recursionLimit/max_steps permite bucles infinitos de gasto.',
      });
    }
    if (/while\s+.*429|retry/i.test(code) && !/max_retries|maxRetries|attempt\s*</.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'AI-RETRY-UNBOUNDED',
        message: 'Reintentos sin tope máximo ni jitter multiplican factura durante degradaciones 429/5xx.',
      });
    }
    if (/\beval\s*\(|\bexec\s*\(|pickle\.loads?\s*\(|weights_only\s*=\s*False/.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'AI-UNSAFE-EXEC-PICKLE',
        message: 'Evita eval(), exec(), pickle o torch.load(weights_only=False) sobre datos o modelos.',
      });
    }
    if (/async\s+def\b/.test(code) && /time\.sleep\s*\(/.test(code)) {
      findings.push({
        severity: 'medium',
        rule: 'AI-BLOCKING-LOOP',
        message: 'time.sleep() bloquea el event loop async; usa await asyncio.sleep() o worker.',
      });
    }
  } else if (language === 'sql') {
    if (/<=>/.test(code) && !/tenant_id|acl|allowed_principals|owner_id/i.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'RAG-SQL-ACL',
        message: 'Consulta vectorial (<=>) sin filtro tenant_id/ACL pre-retrieval en WHERE.',
      });
    }
    if (/<=>/.test(code) && !/deleted_at\s+IS\s+NULL/i.test(code)) {
      findings.push({
        severity: 'medium',
        rule: 'RAG-DELETED-NOT-FILTERED',
        message: 'Consulta pgvector sin deleted_at IS NULL puede resucitar documentos borrados.',
      });
    }
    if (/SELECT\s+/i.test(code) && !/LIMIT\s+\d+/i.test(code)) {
      findings.push({
        severity: 'medium',
        rule: 'SQL-UNBOUNDED-SELECT',
        message: 'Consulta SELECT sin cláusula LIMIT acotada.',
      });
    }
  } else if (language === 'mcp') {
    if (/path\.join\s*\(/.test(code) && !/startsWith\s*\([^)]*\+\s*sep|realpath/i.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'MCP-PATH-TRAVERSAL',
        message: 'path.join sin canonicalización y validación startsWith(root + sep) permite escape ../ .',
      });
    }
    if (/executeSql|runShell|execSync\s*\(/.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'MCP-UNSCOPED-SHELL',
        message: 'Evita exponer executeSql o shell arbitrario como tool MCP; usa tools tipadas y allowlist.',
      });
    }
    if (/deductAfter|chargeAfter/i.test(code) && !/reserve/i.test(code)) {
      findings.push({
        severity: 'high',
        rule: 'FINOPS-POST-CHECK',
        message: 'El presupuesto FinOps debe reservarse atómicamente antes de invocar al LLM, no después.',
      });
    }
  }

  return {
    language,
    lineCount: code.split(/\r?\n/).length,
    findings,
    status: findings.length === 0 ? 'clean' : 'warning',
    executedInWorker: true,
  };
}
