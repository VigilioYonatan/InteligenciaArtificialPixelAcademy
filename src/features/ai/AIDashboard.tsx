import { useState } from 'preact/hooks';
import { Card, PageHeading } from '../../shared/ui/primitives';
import type {
  AICurriculumItem,
  AII18nBundle,
  AILevel,
  AILevelFilter,
  AISeniorCase,
  AIStatusFilter,
} from './types/ai.types';

const LEVELS: AILevelFilter[] = [
  'all',
  'fundamentos',
  'machine-learning',
  'deep-learning',
  'generative-ai',
  'senior',
];

const STATUSES: AIStatusFilter[] = ['all', 'completed', 'idle'];

export function AIDashboard({
  copy,
  curriculum,
  cases,
  completedLessons,
  seniorProgress,
}: {
  copy: AII18nBundle;
  curriculum: AICurriculumItem[];
  cases: AISeniorCase[];
  completedLessons: string[];
  seniorProgress: Record<string, { passed: boolean; score: number }>;
}) {
  const [levelFilter, setLevelFilter] = useState<AILevelFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AIStatusFilter>('all');

  const verifiedSeniorCount = Object.values(seniorProgress).filter((r) => r.passed).length;
  const completedLessonsCount = curriculum.filter((m) => completedLessons.includes(m.id)).length;

  const filteredModules = curriculum.filter((m) => {
    const levelOk = levelFilter === 'all' || m.level === levelFilter;
    const isDone = completedLessons.includes(m.id);
    const statusOk =
      statusFilter === 'all' || (statusFilter === 'completed' ? isDone : !isDone);
    return levelOk && statusOk;
  });

  const filteredCases = cases.filter((c) => {
    const mod = curriculum.find((m) => m.id === c.moduleId);
    const levelOk = levelFilter === 'all' || mod?.level === levelFilter;
    const isDone = seniorProgress[c.id]?.passed === true;
    const statusOk =
      statusFilter === 'all' || (statusFilter === 'completed' ? isDone : !isDone);
    return levelOk && statusOk;
  });

  return (
    <>
      <PageHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />

      <div class="ai-summary">
        <strong>
          {copy.modulesCount} ({completedLessonsCount}/18)
        </strong>
        <strong>{copy.seniorCount}</strong>
        <strong>
          {verifiedSeniorCount}/18 {copy.verifiedCount}
        </strong>
        <span>{copy.disclaimer}</span>
        <div class="editor-actions">
          <a class="btn btn-outline" href="#/ai/simulators">Simulators</a>
          <a class="btn btn-outline" href="#/ai/readiness">Readiness Matrix</a>
          <a class="btn btn-senior" href="#/ai/capstone">Capstone Python ZIP</a>
        </div>
      </div>

      <Card className="ai-filter-card">
        <div class="ai-filters">
          <div class="ai-filter-group">
            <span class="ai-filter-label">{copy.filterLevel}:</span>
            {LEVELS.map((lvl) => (
              <button
                type="button"
                key={lvl}
                class={`btn ${levelFilter === lvl ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setLevelFilter(lvl)}
              >
                {lvl === 'all' ? copy.allLevels : copy.levelLabels[lvl as AILevel]}
              </button>
            ))}
          </div>
          <div class="ai-filter-group">
            <span class="ai-filter-label">{copy.filterStatus}:</span>
            {STATUSES.map((st) => (
              <button
                type="button"
                key={st}
                class={`btn ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'all'
                  ? copy.allStatuses
                  : st === 'completed'
                    ? copy.completedStatus
                    : copy.idleStatus}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <section class="ai-path">
        <h2>{copy.lessonsSection}</h2>
        <p>{copy.lessonsSubtitle}</p>
        <div class="ai-grid">
          {filteredModules.map((m) => {
            const loc = copy.modules[m.id];
            const isDone = completedLessons.includes(m.id);
            return (
              <a class="ai-module ai-link" key={m.id} href={`#/ai/learn/${m.id}`}>
                <span class="ai-id">
                  {m.id} · {copy.levelLabels[m.level]} {isDone ? copy.completedBadge : ''}
                </span>
                <h3>{loc?.title || m.title}</h3>
                <p>{loc?.summary || m.summary}</p>
                <p>
                  <b>Stack:</b> {m.stack}
                </p>
                <small>{loc?.project || m.project}</small>
                <strong>{copy.openLesson}</strong>
              </a>
            );
          })}
        </div>
      </section>

      <section class="ai-path">
        <h2>{copy.seniorSection}</h2>
        <p>{copy.seniorSubtitle}</p>
        <div class="ai-grid">
          {filteredCases.map((item) => {
            const loc = copy.modules[item.moduleId];
            const isPassed = seniorProgress[item.id]?.passed === true;
            return (
              <a class="ai-module ai-link" key={item.id} href={`#/ai/senior/${item.id}`}>
                <span class="ai-id">
                  {item.id} {isPassed ? copy.verifiedBadge : ''}
                </span>
                <h3>{loc?.title || item.title}</h3>
                <p>{item.scenario}</p>
                <strong>{copy.openChallenge}</strong>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
