import guides from '../../content/senior/guides.json';
import curriculum from '../../data/curriculum.json';
import type { Locale } from '../learning/types/learning.types';

const i18n: Record<
  Locale,
  {
    home: string;
    heading: string;
    intro: string;
    source: string;
    tests: string;
    run: string;
    disclaimer: string;
    fallback: string;
    practice: string;
  }
> = {
  es: {
    home: 'Volver al módulo',
    heading: 'Guía de ingeniería Senior AI',
    intro: 'Lectura técnica, invariantes, implementación Python y pruebas unitarias oficiales del laboratorio descargable.',
    source: 'Implementación de referencia',
    tests: 'Pruebas de referencia',
    run: 'Comando de ejecución local',
    disclaimer: 'Requiere Python 3.10+ instalado en tu equipo. El navegador no ejecuta este código.',
    fallback: '',
    practice: 'Ir al laboratorio descargable',
  },
  en: {
    home: 'Back to module',
    heading: 'Senior AI engineering guide',
    intro: 'Technical reading, invariants, Python reference source, and unit tests from our downloadable lab.',
    source: 'Reference implementation',
    tests: 'Reference tests',
    run: 'Local execution command',
    disclaimer: 'Requires Python 3.10+ installed locally. This website does not run this code.',
    fallback: 'The technical lesson is available in Spanish. Interface labels are translated.',
    practice: 'Get the downloadable lab',
  },
  ja: {
    home: 'モジュールに戻る',
    heading: 'Senior AI 技術ガイド',
    intro: '技術解説、設計上の不変条件、Python 実装コード、実際のテスト。',
    source: '参考実装',
    tests: '参考テスト',
    run: 'ローカル実行',
    disclaimer: 'ローカル環境に Python 3.10+ が必要です。ブラウザ上では実行されません。',
    fallback: '本文はスペイン語です。画面ラベルは日本語です。',
    practice: 'ラボをダウンロード',
  },
  zh: {
    home: '返回模块',
    heading: 'Senior AI 工程指南',
    intro: '技术解析、架构不变量、Python 参考实现与自动化单元测试。',
    source: '参考实现',
    tests: '参考测试',
    run: '本地执行命令',
    disclaimer: '需要在本机安装 Python 3.10+。本网站不在浏览器中执行该代码。',
    fallback: '技术正文为西班牙语，界面标签已翻译。',
    practice: '下载实验室',
  },
  pt: {
    home: 'Voltar ao módulo',
    heading: 'Guia de engenharia Senior AI',
    intro: 'Leitura técnica, invariantes, código Python e testes unitários do laboratório para download.',
    source: 'Implementação de referência',
    tests: 'Testes de referência',
    run: 'Comando local',
    disclaimer: 'Requer Python 3.10+ instalado no computador. O site não executa este código.',
    fallback: 'O conteúdo técnico está em espanhol; os rótulos da interface estão traduzidos.',
    practice: 'Baixar laboratório',
  },
  fr: {
    home: 'Retour au module',
    heading: 'Guide d’ingénierie Senior IA',
    intro: 'Lecture technique, invariants, code Python de référence et tests unitaires du laboratoire téléchargeable.',
    source: 'Implémentation de référence',
    tests: 'Tests de référence',
    run: 'Commande locale',
    disclaimer: 'Requiert Python 3.10+ installé localement. Le site n’exécute pas ce code.',
    fallback: 'Le texte technique est en espagnol ; les libellés sont traduits.',
    practice: 'Télécharger le laboratoire',
  },
};

export function SeniorGuide({ moduleId, locale }: { moduleId: string; locale: Locale }) {
  const guide = guides.find((g) => g.id === moduleId);
  const copy = i18n[locale] ?? i18n.es;
  if (!guide) {
    return (
      <section class="content-page">
        <h1>404 · Guide not found</h1>
        <a href="#/senior">Senior Mode</a>
      </section>
    );
  }
  const module = curriculum.find((m) => m.id === moduleId);
  return (
    <main class="content-page senior-guide" aria-labelledby="guide-heading">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/senior">Senior Mode</a>
        <span>/</span>
        <a href={`#/senior/${moduleId}`}>{copy.home}</a>
        <span>/</span>
        <b>{copy.heading}</b>
      </nav>
      <div class="page-heading">
        <span class="eyebrow small">{moduleId} · AI ARCHITECTURE</span>
        <h1 id="guide-heading">{module?.title[locale] ?? guide.title}</h1>
        <p>{copy.intro}</p>
      </div>
      {copy.fallback && (
        <p class="notice" role="note" lang={locale}>
          {copy.fallback}
        </p>
      )}
      <div class="senior-guide-grid">
        <article class="card senior-guide-prose" lang="es">
          <h2>{guide.title}</h2>
          {guide.sections.map((s, i) => (
            <section key={i}>
              <h3>
                {i + 1}. {s.title}
              </h3>
              <p>{s.body}</p>
            </section>
          ))}
        </article>
        <aside class="card">
          <h3>{copy.run}</h3>
          <pre class="mini-code">
            <code>{guide.command}</code>
          </pre>
          <p class="small-disclaimer">{copy.disclaimer}</p>
          <a class="btn btn-senior" href={`#/senior/${moduleId}/native`}>
            {copy.practice} →
          </a>
        </aside>
      </div>
      <details class="card senior-guide-code">
        <summary>
          <strong>{copy.source}</strong> · lab.py
        </summary>
        <pre class="mini-code">
          <code>{guide.referenceSource}</code>
        </pre>
      </details>
      <details class="card senior-guide-code">
        <summary>
          <strong>{copy.tests}</strong> · test_lab.py
        </summary>
        <pre class="mini-code">
          <code>{guide.referenceTest}</code>
        </pre>
      </details>
    </main>
  );
}
