import { useState } from 'preact/hooks';
import capstone from '../../content/senior/capstone.json';
import type { Locale } from '../learning/types/learning.types';

const messages: Record<
  Locale,
  {
    heading: string;
    summary: string;
    run: string;
    download: string;
    back: string;
    boundaries: string;
    what: string;
    note: string;
    copyCmd: string;
    copied: string;
  }
> = {
  es: {
    heading: 'Capstone de Arquitectura IA Senior',
    summary: 'Plataforma Python ejecutable que integra RAG con ACL multi-tenant, verificación de citas, idempotencia y presupuesto FinOps atómico.',
    run: 'Pruebas locales (Python unittest)',
    download: 'Descargar paquete Python y tests (.zip)',
    back: 'Volver a Senior',
    boundaries: 'Límites del ejemplo',
    what: 'Competencias y comprobaciones',
    note: 'La descripción técnica está en español. Este navegador no ejecuta Python; descárgalo para probar localmente.',
    copyCmd: 'Copiar comando',
    copied: '✓ Copiado',
  },
  en: {
    heading: 'Senior AI Architecture Capstone',
    summary: 'Executable Python suite combining multi-tenant RAG ACL, citation verification, idempotency, and atomic FinOps budgeting.',
    run: 'Local tests (Python unittest)',
    download: 'Download Python code & tests (.zip)',
    back: 'Back to Senior',
    boundaries: 'Example limitations',
    what: 'Skills and checks',
    note: 'Technical details are in Spanish. Python is not executed in your browser.',
    copyCmd: 'Copy command',
    copied: '✓ Copied',
  },
  ja: {
    heading: 'Senior AIアーキテクチャ総合課題',
    summary: 'マルチテナントACL付きRAG、引用検証、冪等性、アトミックFinOps予算管理を統合したPython実行スイート。',
    run: 'ローカルテスト（Python unittest）',
    download: 'Pythonコードとテストをダウンロード (.zip)',
    back: 'Senior に戻る',
    boundaries: 'サンプルの制限',
    what: 'スキルと確認',
    note: '技術説明はスペイン語です。ブラウザ内でPythonは実行されません。',
    copyCmd: 'コマンドをコピー',
    copied: '✓ コピー完了',
  },
  zh: {
    heading: 'Senior AI 架构综合项目',
    summary: '集成多租户 RAG ACL、引用核验、幂等性与原子级 FinOps 预算管理的本地可执行 Python 套件。',
    run: '本地测试（Python unittest）',
    download: '下载 Python 代码与测试 (.zip)',
    back: '返回 Senior',
    boundaries: '示例限制',
    what: '能力与检查',
    note: '技术说明为西班牙语，浏览器不运行 Python。',
    copyCmd: '复制测试命令',
    copied: '✓ 已复制',
  },
  pt: {
    heading: 'Capstone de Arquitetura IA Senior',
    summary: 'Plataforma Python executável com RAG ACL multi-tenant, verificação de citações, idempotência e FinOps atômico.',
    run: 'Testes locais (Python unittest)',
    download: 'Baixar código Python e testes (.zip)',
    back: 'Voltar ao Senior',
    boundaries: 'Limites do exemplo',
    what: 'Competências e verificações',
    note: 'Descrições técnicas em espanhol. Python não é executado no navegador.',
    copyCmd: 'Copiar comando',
    copied: '✓ Copiado',
  },
  fr: {
    heading: 'Projet intégrateur Architecture IA Senior',
    summary: 'Suite Python exécutable combinant RAG ACL multi-tenant, vérification des citations, idempotence et FinOps atomique.',
    run: 'Tests locaux (Python unittest)',
    download: 'Télécharger le code Python et les tests (.zip)',
    back: 'Retour à Senior',
    boundaries: 'Limites de l’exemple',
    what: 'Compétences et contrôles',
    note: 'Les descriptions techniques sont en espagnol. Python ne s’exécute pas dans le navigateur.',
    copyCmd: 'Copier la commande',
    copied: '✓ Copié',
  },
};

export function SeniorCapstone({ locale }: { locale: Locale }) {
  const t = messages[locale] ?? messages.es;
  const base = import.meta.env.BASE_URL;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(capstone.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section class="content-page senior-capstone" aria-labelledby="capstone-heading">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/senior">Senior Mode</a>
        <span>/</span>
        <b>Capstone</b>
      </nav>
      <header class="page-heading">
        <span class="eyebrow small">PYTHON AI · REAL UNITTEST · FINOPS &amp; ACL</span>
        <h1 id="capstone-heading">{t.heading}</h1>
        <p>{t.summary}</p>
      </header>
      {locale !== 'es' && (
        <p class="notice" role="note">
          {t.note}
        </p>
      )}
      <div class="capstone-flow">
        <span>Auth + ACL</span>
        <span>Hybrid RAG</span>
        <span>Citations</span>
        <span>Atomic FinOps</span>
      </div>
      <section class="card">
        <h2>{t.what}</h2>
        <div class="capstone-cards">
          {capstone.steps.map((s) => (
            <article class="capstone-step" key={s.id} lang="es">
              <span class="eyebrow small">{s.area}</span>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
              <code>{s.test}</code>
            </article>
          ))}
        </div>
      </section>
      <div class="senior-guide-grid">
        <section class="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>{t.run}</h2>
            <button
              type="button"
              class="btn btn-outline"
              style={{ minHeight: '34px', padding: '4px 12px', fontSize: '12px' }}
              onClick={copy}
            >
              {copied ? t.copied : t.copyCmd}
            </button>
          </div>
          <pre class="mini-code">
            <code>{capstone.command}</code>
          </pre>
          <a class="btn btn-senior native-download" href={`${base}downloads/ai-native-senior-labs.zip`} download>
            {t.download} ↓
          </a>
        </section>
        <aside class="card" lang="es">
          <h2>{t.boundaries}</h2>
          <ul>
            {capstone.boundaries.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </aside>
      </div>
      <a href="#/senior" class="text-link">
        {t.back} →
      </a>
    </section>
  );
}
