import nativeLabs from '../../content/senior/native-labs.json';
import curriculum from '../../data/curriculum.json';
import { evaluateReadiness } from './engine/readiness.mjs';

import type { Locale } from '../learning/types/learning.types';
const labels:Record<Locale,{heading:string;sub:string;download:string;command:string;offline:string;back:string;practice:string;readiness:string;verified:string;missing:string;notCertification:string}> = {
 es:{heading:'Laboratorios AI nativos (Python)',sub:'18 ejercicios de Arquitectura IA con código Python estándar y pruebas unittest reales. Se ejecutan en tu equipo.',download:'Descargar los 18 laboratorios AI (.zip)',command:'Ejecutar localmente',offline:'No es ejecución Python en el navegador. Requiere Python 3.10 o superior.',back:'Volver a Senior Mode',practice:'Laboratorio',readiness:'Mapa de competencias AI',verified:'Actividades comprobadas',missing:'Pendientes',notCertification:'Este mapa refleja resultados de ejercicios educativos, no una certificación profesional.'},
 en:{heading:'Native AI labs (Python)',sub:'18 AI Architecture exercises with standard Python source and real unittest suites. Run locally on your machine.',download:'Download all 18 AI labs (.zip)',command:'Run locally',offline:'This is not browser Python execution. Requires Python 3.10 or newer.',back:'Back to Senior Mode',practice:'Lab',readiness:'AI competency map',verified:'Checked activities',missing:'Not completed',notCertification:'This map shows educational assessments, not a professional certification.'},
 ja:{heading:'AIネイティブラボ（Python）',sub:'標準Pythonとunittestによる18個のAIアーキテクチャ演習。ローカル環境で実行します。',download:'18個のAIラボをダウンロード (.zip)',command:'ローカルで実行',offline:'ブラウザ内実行ではありません。Python 3.10以降が必要です。',back:'Senior Mode に戻る',practice:'ラボ',readiness:'AIスキルマップ',verified:'確認済みの活動',missing:'未完了',notCertification:'これは教育上の評価であり、専門資格の証明ではありません。'},
 zh:{heading:'AI 原生实验（Python）',sub:'18 个基于标准 Python 与 unittest 的 AI 架构实战，在本地终端执行。',download:'下载 18 个 AI 实验 (.zip)',command:'本地运行',offline:'非浏览器内执行，需本地安装 Python 3.10+。',back:'返回 Senior Mode',practice:'实验',readiness:'AI 能力地图',verified:'已验证活动',missing:'未完成',notCertification:'此地图仅反映教学测评结果，不代表职业认证。'},
 pt:{heading:'Laboratórios AI nativos (Python)',sub:'18 exercícios de Arquitetura de IA com código Python padrão e testes unittest reais.',download:'Baixar os 18 laboratórios AI (.zip)',command:'Executar localmente',offline:'Não executa Python no navegador. Requer Python 3.10 ou superior.',back:'Voltar ao Senior Mode',practice:'Laboratório',readiness:'Mapa de competências AI',verified:'Atividades verificadas',missing:'Pendentes',notCertification:'Este mapa reflete avaliações educacionais, não uma certificação profissional.'},
 fr:{heading:'Laboratoires IA natifs (Python)',sub:'18 exercices d’architecture IA en Python standard avec suites unittest exécutées localement.',download:'Télécharger les 18 labs IA (.zip)',command:'Exécuter localement',offline:'Python ne s’exécute pas dans le navigateur. Nécessite Python 3.10+.',back:'Retour à Senior Mode',practice:'Laboratoire',readiness:'Carte des compétences',verified:'Activités évaluées',missing:'À faire',notCertification:'Ce tableau reflète des évaluations pédagogiques, pas une certification professionnelle.'}
};
const base=import.meta.env.BASE_URL;
export function NativeLabCatalog({locale,activeModule}:{locale:Locale;activeModule?:string}){
 const t=labels[locale]||labels.es;
 const labs=activeModule?nativeLabs.filter(l=>l.id===activeModule):nativeLabs;
 return <section class="content-page native-lab-page">
  <div class="breadcrumbs"><a href="#/senior">{t.back}</a><span>/</span><b>{t.heading}</b></div>
  <div class="page-heading"><span class="eyebrow small">PYTHON · REAL UNITTEST</span><h1>{t.heading}</h1><p>{t.sub}</p></div>
  <output class="notice">{t.offline}</output>
  <a class="btn btn-senior native-download" href={`${base}downloads/ai-native-senior-labs.zip`} download>{t.download} ↓</a>
  <section class="card"><h2>{t.command}</h2><pre class="mini-code">python -m unittest discover -s labs-ai-native -t labs-ai-native -v
python -m unittest discover -s labs-ai-native/s01_rag_acl -t labs-ai-native -v</pre></section>
  <div class="senior-grid">{labs.map(l=><article class="senior-card" key={l.id}><div class="senior-card-top"><span>{l.id}</span><span class="senior-kind">PYTHON AI</span></div><h3>{curriculum.find(m=>m.id===l.id)?.title[locale]||l.title}</h3><p><code>{l.slug}</code></p><p>{t.practice} · {l.directory}</p><a class="text-link" href={`#/senior/${l.id}`}>{t.back} ↗</a></article>)}</div>
 </section>
}
type Records={seniorResults:Record<string,{score:number;passed:boolean}>;evidenceResults:Record<string,{score:number;passed:boolean}>;investigationResults:Record<string,{score:number;passed:boolean}>;operationsResults:Record<string,{score:number;passed:boolean}>;reviewResults:Record<string,{score:number;passed:boolean}>};

const radarAxes = [
  { name: 'RAG & ACL', modules: ['S01', 'S02', 'S03'] },
  { name: 'Cache & FinOps', modules: ['S04', 'S05', 'S06'] },
  { name: 'Models & PII', modules: ['S07', 'S08', 'S09'] },
  { name: 'Infra & MCP', modules: ['S10', 'S11', 'S12'] },
  { name: 'Latency & HITL', modules: ['S13', 'S14', 'S15'] },
  { name: 'Serving & Release', modules: ['S16', 'S17', 'S18'] }
];

export function SeniorReadiness({locale,records}:{locale:Locale;records:Records}){
 const t=labels[locale]||labels.es;
 const results=evaluateReadiness(nativeLabs.map(l=>l.id),records);

 const cx=200, cy=170, maxR=115;
 const axisData = radarAxes.map((axis, i) => {
   const angle = (-90 + i * 60) * (Math.PI / 180);
   const passedCount = axis.modules.reduce((acc, id) => {
     const mod = results.modules.find(m => m.moduleId === id);
     return acc + (mod ? mod.passed : 0);
   }, 0);
   const pct = Math.round((passedCount / 15) * 100);
   const r = Math.max(12, (maxR * pct) / 100);
   const x = cx + r * Math.cos(angle);
   const y = cy + r * Math.sin(angle);
   const labelX = cx + (maxR + 32) * Math.cos(angle);
   const labelY = cy + (maxR + 24) * Math.sin(angle);
   return { ...axis, pct, x, y, angle, labelX, labelY };
 });

 const polygonPoints = axisData.map(a => `${a.x.toFixed(1)},${a.y.toFixed(1)}`).join(' ');

 return <section class="content-page">
  <div class="breadcrumbs"><a href="#/senior">{t.back}</a><span>/</span><b>{t.readiness}</b></div>
  <div class="page-heading"><span class="eyebrow small">LEARNING PROGRESS · NOT CERTIFICATION</span><h1>{t.readiness}</h1><p>{t.notCertification}</p></div>

  <div class="readiness-overview">
    <div class="radar-card">
      <span class="eyebrow small" style={{ marginBottom: '10px' }}>RADAR DE COMPETENCIAS (6 EJES)</span>
      <svg class="radar-svg" viewBox="0 0 400 340" aria-label="Radar de competencias Senior">
        <title>Radar de competencias Senior</title>
        {[0.25, 0.5, 0.75, 1].map(scale => {
          const webPoints = [0, 1, 2, 3, 4, 5].map(i => {
            const rad = (-90 + i * 60) * (Math.PI / 180);
            return `${(cx + maxR * scale * Math.cos(rad)).toFixed(1)},${(cy + maxR * scale * Math.sin(rad)).toFixed(1)}`;
          }).join(' ');
          return <polygon key={scale} points={webPoints} fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray={scale < 1 ? '2 2' : 'none'} />;
        })}
        {axisData.map((a, i) => {
          const endX = cx + maxR * Math.cos(a.angle);
          const endY = cy + maxR * Math.sin(a.angle);
          return <g key={i}>
            <line x1={cx} y1={cy} x2={endX} y2={endY} stroke="var(--border)" stroke-width="1" />
            <text x={a.labelX} y={a.labelY} text-anchor="middle" dominant-baseline="middle" class="radar-axis-text">
              {a.name}
            </text>
            <text x={a.labelX} y={a.labelY + 12} text-anchor="middle" dominant-baseline="middle" class="radar-pct-text">
              {a.pct}%
            </text>
          </g>;
        })}
        <polygon points={polygonPoints} fill="rgba(0, 173, 216, 0.28)" stroke="var(--go, #00add8)" stroke-width="2.5" />
        {axisData.map((a, i) => (
          <circle key={i} cx={a.x} cy={a.y} r={4} fill="var(--gold, #f7c55c)" stroke="var(--surface, #102236)" stroke-width="2" />
        ))}
      </svg>
    </div>

    <section class="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <span class="eyebrow small">PROGRESO TOTAL</span>
      <h2 style={{ fontSize: '32px', margin: '8px 0' }}>{results.checked} / {results.possible} · {t.verified}</h2>
      <div class="progress-track" style={{ height: '14px', borderRadius: '7px' }}>
        <div class="progress-fill" style={{ width: `${results.percent}%`, background: 'var(--go, #00add8)', height: '100%', borderRadius: '7px' }} />
      </div>
      <p style={{ fontWeight: 800, fontSize: '18px', color: 'var(--go-light)', margin: '10px 0 16px' }}>{results.percent}% del programa Senior completado</p>
      <div class="domain-scores">
        {axisData.map(a => (
          <div class="domain-score-chip" key={a.name}>
            <span>{a.name}</span>
            <b>{a.pct}%</b>
          </div>
        ))}
      </div>
    </section>
  </div>

  <div class="senior-grid">
    {results.modules.map(m => {
      const isDec = !!records.seniorResults[m.moduleId]?.passed;
      const isEvd = !!records.evidenceResults[m.moduleId]?.passed;
      const isInv = !!records.investigationResults[m.moduleId]?.passed;
      const isOps = !!records.operationsResults[m.moduleId]?.passed;
      const isRev = !!records.reviewResults[m.moduleId]?.passed;

      return (
        <a class="senior-card" key={m.moduleId} href={`#/senior/${m.moduleId}`}>
          <div class="senior-card-top">
            <span>{m.moduleId}</span>
            <span class="senior-kind">{m.passed}/5</span>
          </div>
          <h3>{curriculum.find(l=>l.id===m.moduleId)?.title[locale]||nativeLabs.find(l=>l.id===m.moduleId)?.title}</h3>
          <div class="module-badges-row">
            <span class={`mini-badge ${isDec ? 'done' : ''}`} title="Decision Lab">DEC {isDec ? '✓' : '○'}</span>
            <span class={`mini-badge ${isEvd ? 'done' : ''}`} title="Evidence Lab">EVD {isEvd ? '✓' : '○'}</span>
            <span class={`mini-badge ${isInv ? 'done' : ''}`} title="Investigation Lab">INV {isInv ? '✓' : '○'}</span>
            <span class={`mini-badge ${isOps ? 'done' : ''}`} title="Operations Lab">OPS {isOps ? '✓' : '○'}</span>
            <span class={`mini-badge ${isRev ? 'done' : ''}`} title="Code Review">REV {isRev ? '✓' : '○'}</span>
          </div>
          <p>{m.passed===5?t.verified:t.missing}: {5-m.passed}/5</p>
          <span class="text-link">→</span>
        </a>
      );
    })}
  </div>
 </section>;
}
