import type { Locale } from '../features/learning/types/learning.types';
import { Card, Mascot, PageHeading } from '../shared/ui/primitives';

const aboutText: Record<Locale, { title: string; sub: string; p1: string; p2: string }> = {
  es: {
    title: 'Acerca de AIPixel Academy',
    sub: 'Plataforma estática e independiente de Arquitectura de IA con Software',
    p1: 'Domina Embeddings, Hybrid RAG con PostgreSQL/pgvector, ACL Multi-tenant, LangChain, LangGraph, MCP, Evals y FinOps con ejercicios deterministas y Senior Mode.',
    p2: 'Tu código y tu progreso permanecen en tu navegador (aipixel:v1). Sin servidores remotos ni cuentas.',
  },
  en: {
    title: 'About AIPixel Academy',
    sub: 'Independent static platform for AI Architecture & Software Engineering',
    p1: 'Master Embeddings, Hybrid RAG with PostgreSQL/pgvector, Multi-tenant ACL, LangChain, LangGraph, MCP, Evals, and FinOps with deterministic labs and Senior Mode.',
    p2: 'Your code and progress stay locally in your browser (aipixel:v1). No backend or accounts required.',
  },
  ja: {
    title: 'AIPixel Academy について',
    sub: 'AIアーキテクチャとソフトウェア工学の独立した静的学習プラットフォーム',
    p1: 'Embeddings、PostgreSQL/pgvectorによるHybrid RAG、マルチテナントACL、LangChain、LangGraph、MCP、Evals、FinOpsを決定論的ラボとシニアモードで学べます。',
    p2: 'コードと進捗はブラウザ内（aipixel:v1）にのみ保存され、外部サーバーへ送信されません。',
  },
  zh: {
    title: '关于 AIPixel Academy',
    sub: '独立的静态 AI 架构与软件工程学习平台',
    p1: '通过确定性练习与 Senior 模式掌握 Embeddings、PostgreSQL/pgvector 混合 RAG、多租户 ACL、LangChain、LangGraph、MCP、评测与 FinOps。',
    p2: '代码与进度仅保存在本地浏览器（aipixel:v1），无需登录或远程后端。',
  },
  pt: {
    title: 'Sobre a AIPixel Academy',
    sub: 'Plataforma estática e independente de Arquitetura de IA com Software',
    p1: 'Domine Embeddings, Hybrid RAG com PostgreSQL/pgvector, ACL Multi-tenant, LangChain, LangGraph, MCP, Evals e FinOps com laboratórios determinísticos e Modo Senior.',
    p2: 'Seu código e progresso ficam apenas no navegador (aipixel:v1), sem servidor nem cadastro.',
  },
  fr: {
    title: 'À propos d’AIPixel Academy',
    sub: 'Plateforme statique indépendante d’Architecture IA et Génie Logiciel',
    p1: 'Maîtrisez Embeddings, Hybrid RAG avec PostgreSQL/pgvector, ACL multi-tenant, LangChain, LangGraph, MCP, Evals et FinOps avec des labs déterministes et le Mode Senior.',
    p2: 'Votre code et progression restent dans votre navigateur (aipixel:v1), sans serveur ni compte.',
  },
};

const creditsCopy: Record<Locale, { title: string; p1: string; p2: string }> = {
  es: {
    title: 'Créditos y licencias',
    p1: 'Mascota original Axon (12 poses Pixel Art incluyendo Senior Mode), iconografía pixel y sistema de tokens inspirado en estética Vercel / Geist bajo licencia MIT del proyecto.',
    p2: 'Construido con Preact, @preact/signals, TypeScript estricto y Vite. Sin telemetría ni rastreo externo.',
  },
  en: {
    title: 'Credits & Licenses',
    p1: 'Original Axon AI Mascot (12 Pixel Art poses including Senior Mode), pixel iconography, and Vercel / Geist-inspired semantic token system under the project MIT License.',
    p2: 'Built with Preact, @preact/signals, strict TypeScript, and Vite. Zero telemetry or external tracking.',
  },
  ja: {
    title: 'クレジットとライセンス',
    p1: 'オリジナルのAxon AIマスコット（シニアモードを含む12種類のピクセルアートポーズ）とセマンティックトークンはMITライセンスで提供されています。',
    p2: 'Preact、@preact/signals、TypeScript（strict）、Viteで構築。外部トラッキングは一切ありません。',
  },
  zh: {
    title: '致谢与开源许可',
    p1: '原创 Axon AI 像素吉祥物（含 Senior 模式共 12 种姿态）及语义设计令牌遵循本项目 MIT 许可证。',
    p2: '基于 Preact、@preact/signals、严格模式 TypeScript 与 Vite 构建，零遥测与外部追踪。',
  },
  pt: {
    title: 'Créditos e Licenças',
    p1: 'Mascote original Axon (12 poses em Pixel Art incluindo Modo Senior), ícones pixel e sistema semântico de tokens sob licença MIT do projeto.',
    p2: 'Construído com Preact, @preact/signals, TypeScript estrito e Vite. Zero telemetria externa.',
  },
  fr: {
    title: 'Crédits et licences',
    p1: 'Mascotte originale Axon (12 poses Pixel Art incluant le Mode Senior), icônes pixel et système de tokens sémantiques sous licence MIT du projet.',
    p2: 'Construit avec Preact, @preact/signals, TypeScript strict et Vite. Aucune télémétrie externe.',
  },
};

const missingText: Record<Locale, { title: string; sub: string }> = {
  es: { title: 'Página no encontrada', sub: 'La ruta no existe en este catálogo local' },
  en: { title: 'Page not found', sub: 'This route does not exist in the local catalog' },
  ja: { title: 'ページが見つかりません', sub: 'このルートはローカルカタログに存在しません' },
  zh: { title: '页面未找到', sub: '该路由不存在于本地目录中' },
  pt: { title: 'Página não encontrada', sub: 'Esta rota não existe no catálogo local' },
  fr: { title: 'Page introuvable', sub: 'Cette route n’existe pas dans le catalogue local' },
};

export function AboutPage({ t, locale = 'es' }: { t: (k: string) => string; locale?: Locale }) {
  const copy = aboutText[locale] || aboutText.es;
  return (
    <div class="content-page">
      <PageHeading eyebrow="OPEN AI ARCHITECTURE" title={copy.title} subtitle={copy.sub} />
      <Card>
        <Mascot name="reading" />
        <p>{copy.p1}</p>
        <p>{copy.p2}</p>
        <a href="#/learn" class="text-link">
          {t('learn')} ↗
        </a>
      </Card>
    </div>
  );
}

export function CreditsPage({ t, locale = 'es' }: { t: (k: string) => string; locale?: Locale }) {
  const copy = creditsCopy[locale] || creditsCopy.es;
  return (
    <div class="content-page">
      <PageHeading eyebrow="ATTRIBUTION & STACK" title={copy.title} subtitle={t('notOfficial')} />
      <Card>
        <Mascot name="welcome" />
        <p>{copy.p1}</p>
        <p>{copy.p2}</p>
        <a href="#/about" class="text-link">
          {t('back')} ↗
        </a>
      </Card>
    </div>
  );
}

export function MissingPage({ t, locale = 'es' }: { t: (k: string) => string; locale?: Locale }) {
  const copy = missingText[locale] || missingText.es;
  return (
    <div class="content-page">
      <PageHeading eyebrow="404" title={copy.title} subtitle={copy.sub} />
      <Card>
        <Mascot name="question" />
        <a class="text-link" href="#/">
          {t('back')} ↗
        </a>
      </Card>
    </div>
  );
}
