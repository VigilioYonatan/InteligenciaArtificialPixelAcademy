import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { STORAGE_KEY } from '../src/features/progress/constants/progress.constants.ts';

const root = process.cwd();
const LOCALES = ['es', 'en', 'ja', 'zh', 'pt', 'fr'];
const readText = (rel) => readFileSync(resolve(root, rel), 'utf8');
const readJson = (rel) => JSON.parse(readText(rel));

test('BDD 1.1: unified navigation in AppShell and zero Gopher references across migrated UI surfaces', () => {
  const shell = readText('src/app/AppShell.tsx');
  assert.ok(shell.includes("href: '#/playground'"), 'AppShell must include #/playground in primary nav');
  assert.ok(!shell.includes('<span>AI Academy</span>'), 'Duplicate AI Academy tab must be removed from header');
  assert.ok(!shell.includes('go.dev/brand'), 'Go brand link must not appear in AppShell footer');

  const uiFiles = [
    'src/app/AppShell.tsx',
    'src/app/StaticPages.tsx',
    'src/features/welcome/HomePage.tsx',
    'src/features/learning/CatalogPage.tsx',
    'src/features/learning/LessonPage.tsx',
    'src/features/frameworks/FrameworksPage.tsx',
    'src/features/playground/PlaygroundPage.tsx',
    'src/features/progress/ProgressPage.tsx',
    'src/features/senior/DecisionLab.tsx',
    'src/features/senior/EvidenceLab.tsx',
    'src/features/senior/SeniorDashboard.tsx',
    'src/features/senior/SeniorModuleHub.tsx',
  ];
  for (const rel of uiFiles) {
    const content = readText(rel);
    assert.ok(!content.includes('<Gopher'), `${rel} must use <Mascot /> instead of <Gopher />`);
    assert.ok(!content.includes('gophers/'), `${rel} must not reference legacy gophers/ assets`);
  }
});

test('BDD 1.2: all 6 i18n dictionaries (84 keys), HomePage & StaticPages are 100% AI Architecture (zero Go)', () => {
  const bannedPatterns = [
    /\bGoPixel\b/i,
    /\bGolang\b/i,
    /\bGopher\b/i,
    /\bLearn Go\b/i,
    /\bAprende Go\b/i,
    /\bAprender Go\b/i,
    /\bApprendre Go\b/i,
    /Goを学ぶ/,
    /学习 Go/,
    /\bWASM\b/,
  ];

  for (const lang of LOCALES) {
    const dict = readJson(`src/i18n/${lang}.json`);
    assert.equal(Object.keys(dict).length, 84, `${lang}.json must preserve 84 keys`);
    assert.equal(dict.brand, 'AIPixel Academy', `${lang}.json brand must be AIPixel Academy`);
    const dump = JSON.stringify(dict);
    for (const rx of bannedPatterns) {
      assert.ok(!rx.test(dump), `${lang}.json leaked legacy Go copy matching ${rx}`);
    }
  }

  const home = readText('src/features/welcome/HomePage.tsx');
  assert.ok(home.includes('rag-pipeline.ts'), 'HomePage hero snippet must showcase AI RAG pipeline');
  assert.ok(!home.includes('main.go') && !home.includes('fmt.Println'), 'HomePage must not show Go code');

  const staticPages = readText('src/app/StaticPages.tsx');
  assert.ok(staticPages.includes('aipixel:v1'), 'StaticPages must document canonical aipixel:v1 key');
  assert.ok(!staticPages.includes('GoPixel') && !staticPages.includes('Renee French'), 'StaticPages must be AI-only');
});

test('BDD 1.3: canonical storage key is aipixel:v1', () => {
  assert.equal(STORAGE_KEY, 'aipixel:v1');
});

test('BDD 1.4 & 1.5: all 62 curriculum modules across 6 languages are 100% AI Architecture & Software (zero Go)', () => {
  const curriculum = readJson('src/data/curriculum.json');
  assert.equal(curriculum.length, 62, 'curriculum must contain 62 modules (12+12+12+18+8)');

  const bannedGoCurriculum = [
    /\bGolang\b/i,
    /\bGo\s+1\./i,
    /\bgoroutine/i,
    /\bGOMAXPROCS\b/,
    /\bgcflags\b/,
    /\biota\b/,
    /\bfmt\b/,
    /\bGin\b/,
    /\bFiber\b/,
    /\bGORM\b/,
    /\bsqlc\b/,
    /\bfasthttp\b/,
    /Go入門/,
    /慣用的なGo/,
    /Go 入门/,
    /惯用 Go/,
  ];

  const dump = JSON.stringify(curriculum);
  for (const rx of bannedGoCurriculum) {
    assert.ok(!rx.test(dump), `curriculum.json leaked legacy Go topic matching ${rx}`);
  }

  // Verify core Vigilio AI Architecture pillars exist in curriculum
  for (const keyword of [
    'pgvector',
    'Hybrid',
    'RRF',
    'Reranking',
    'ACL',
    'Prompt Injection',
    'LangChain',
    'LangGraph',
    'MCP',
    'Ragas',
    'OpenTelemetry',
    'FinOps',
    'NestJS',
    'FastAPI',
  ]) {
    assert.ok(dump.includes(keyword), `curriculum.json must cover canonical AI topic: ${keyword}`);
  }

  // Verify uniqueness of titles in Spanish & English across all 62 modules
  const esTitles = new Set(curriculum.map((m) => m.title.es));
  const enTitles = new Set(curriculum.map((m) => m.title.en));
  assert.equal(esTitles.size, 62, 'all 62 Spanish module titles must be unique');
  assert.equal(enTitles.size, 62, 'all 62 English module titles must be unique');

  // Verify Senior S01-S18 scenarios are unique per language (no cloned placeholder text)
  const seniors = curriculum.filter((m) => m.track === 'senior');
  assert.equal(seniors.length, 18);
  for (const lang of LOCALES) {
    const scenarios = new Set(seniors.map((s) => s.challenge.scenario[lang]));
    assert.equal(scenarios.size, 18, `all 18 Senior scenarios in ${lang} must be unique`);
  }
});
