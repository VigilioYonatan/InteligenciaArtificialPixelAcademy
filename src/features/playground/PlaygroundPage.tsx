import { useEffect, useRef, useState } from 'preact/hooks';
import { Button, Card, Icon, Mascot, PageHeading } from '../../shared/ui/primitives';
import {
  analyzeSnippet,
  type PlaygroundAnalysis,
  type PlaygroundLanguage,
} from './analyzer.mjs';

const TEMPLATES: Record<PlaygroundLanguage, { label: string; code: string }> = {
  nestjs: {
    label: 'NestJS + Zod RAG Controller',
    code: "export async function askController(actor: { tenantId: string }, question: string, url: string) {\n  const signal = AbortSignal.timeout(8000);\n  return fetch(url, {\n    method: 'POST',\n    body: JSON.stringify({ tenantId: actor.tenantId, question }),\n    signal,\n  });\n}\n",
  },
  langgraph: {
    label: 'LangGraph Agent State & Budget',
    code: "async def run_agent(graph, query: str, thread_id: str):\n    return await graph.ainvoke(\n        {\"query\": query, \"max_steps\": 4},\n        config={\"recursion_limit\": 6, \"configurable\": {\"thread_id\": thread_id}},\n    )\n",
  },
  sql: {
    label: 'PostgreSQL pgvector + ACL Query',
    code: 'SELECT c.id, c.document_id, 1 - (c.embedding <=> $3) AS score\nFROM document_chunks c\nJOIN documents d ON d.id = c.document_id\nWHERE c.tenant_id = $1\n  AND d.deleted_at IS NULL\n  AND $2 = ANY(d.allowed_principals)\nORDER BY c.embedding <=> $3\nLIMIT 8;\n',
  },
  mcp: {
    label: 'MCP Tool Server & FinOps Guard',
    code: "import { resolve, sep } from 'node:path';\n\nexport function readAuthorizedDoc(rootDir: string, reqPath: string, ledger: { reserve: (t: string) => boolean }, tenantId: string) {\n  if (!ledger.reserve(tenantId)) throw new Error('BUDGET_EXCEEDED');\n  const root = resolve(rootDir);\n  const target = resolve(root, reqPath);\n  if (target !== root && !target.startsWith(root + sep)) throw new Error('MCP_PATH_BLOCKED');\n  return target;\n}\n",
  },
};

export function PlaygroundPage({ t }: { t: (k: string) => string }) {
  const [lang, setLang] = useState<PlaygroundLanguage>('nestjs');
  const [code, setCode] = useState(TEMPLATES.nestjs.code);
  const [analysis, setAnalysis] = useState<PlaygroundAnalysis | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    try {
      const worker = new Worker(new URL('./playground.worker.ts', import.meta.url), {
        type: 'module',
      });
      worker.onmessage = (ev: MessageEvent<{ id: number; result: PlaygroundAnalysis }>) => {
        if (ev.data.id === reqIdRef.current) {
          setAnalysis(ev.data.result);
        }
      };
      workerRef.current = worker;
      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch {
      return undefined;
    }
  }, []);

  const runAnalysis = () => {
    reqIdRef.current += 1;
    const id = reqIdRef.current;
    if (workerRef.current) {
      workerRef.current.postMessage({ id, language: lang, code });
    } else {
      setAnalysis(analyzeSnippet(lang, code));
    }
  };

  return (
    <div class="content-page">
      <PageHeading
        eyebrow="AI ARCHITECTURE SANDBOX"
        title="Static AI Production Analyzer (Web Worker)"
        subtitle="Audita antipatrones de NestJS+Zod, LangGraph, PostgreSQL pgvector ACL, MCP y FinOps en un Web Worker aislado. No ejecuta código arbitrario ni simula inferencia LLM."
      />
      <div class="lesson-layout">
        <div class="lesson-main">
          <Card className="editor-card">
            <div class="ai-filter-group">
              {(['nestjs', 'langgraph', 'sql', 'mcp'] as const).map((k) => (
                <button
                  type="button"
                  key={k}
                  class={`btn ${lang === k ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    setLang(k);
                    setCode(TEMPLATES[k].code);
                    setAnalysis(null);
                  }}
                >
                  {TEMPLATES[k].label}
                </button>
              ))}
            </div>
            <textarea
              aria-label="Sandbox code editor"
              spellcheck={false}
              maxLength={30000}
              class="code-editor font-md"
              value={code}
              onInput={(e) => {
                setCode((e.currentTarget as HTMLTextAreaElement).value);
                setAnalysis(null);
              }}
            />
            <div class="editor-actions">
              <Button onClick={runAnalysis}>
                <Icon name="check" size={18} />
                Analizar en Web Worker
              </Button>
              <Button
                kind="outline"
                onClick={() => {
                  setCode(TEMPLATES[lang].code);
                  setAnalysis(null);
                }}
              >
                {t('reset')}
              </Button>
            </div>
            <p class="small-disclaimer">
              Static AI/SQL/MCP antipattern analyzer running in an isolated browser Web Worker (zero eval, zero remote LLM calls).
            </p>
            {analysis && (
              <output class={analysis.status === 'clean' ? 'ai-pass' : 'ai-fail'}>
                <b>
                  {analysis.language.toUpperCase()} · {analysis.lineCount} líneas ·{' '}
                  {analysis.findings.length === 0
                    ? '✓ Sin antipatrones detectados'
                    : `${analysis.findings.length} hallazgo(s)`}
                </b>
                {analysis.findings.length > 0 && (
                  <ul>
                    {analysis.findings.map((f) => (
                      <li key={f.rule}>
                        <b>[{f.severity.toUpperCase()}] {f.rule}:</b> {f.message}
                      </li>
                    ))}
                  </ul>
                )}
              </output>
            )}
          </Card>
        </div>
        <aside class="lesson-side">
          <Card className="side-gopher">
            <Mascot name={analysis?.status === 'warning' ? 'debug' : analysis?.status === 'clean' ? 'celebrate' : 'coding'} />
            <p>
              Contrato honesto: este sandbox inspecciona reglas estáticas de Arquitectura IA en un Web Worker aislado sin fingir ejecución remota.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
