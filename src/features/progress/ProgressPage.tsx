import curriculum from '../../data/curriculum.json';
import { asset, Card, Mascot, PageHeading } from '../../shared/ui/primitives';
import type { Locale, Module } from '../learning/types/learning.types';
import type { Prefs } from './types/progress.types';

const modules = curriculum as Module[];

export function computeBadges(prefs: Prefs) {
  const goDone = prefs.completed.filter((id) => /^[BIA]\d\d$/.test(id)).length;
  const aiLessonsDone = prefs.completed.filter((id) => /^AI\d\d$/.test(id)).length;
  const seniorEvidenceOrInv =
    Object.values(prefs.evidenceResults).filter((r) => r.passed).length +
    Object.values(prefs.investigationResults).filter((r) => r.passed).length +
    Object.values(prefs.aiEvidenceResults).filter((r) => r.passed).length;
  const seniorReviewOrCase =
    Object.values(prefs.reviewResults).filter((r) => r.passed).length +
    Object.values(prefs.aiSeniorResults).filter((r) => r.passed).length;
  const totalSeniorPassed =
    Object.values(prefs.seniorResults).filter((r) => r.passed).length +
    Object.values(prefs.operationsResults).filter((r) => r.passed).length +
    Object.values(prefs.aiDecisionResults).filter((r) => r.passed).length +
    Object.values(prefs.aiOperationsResults).filter((r) => r.passed).length;

  return [
    { id: 'starter', label: 'Starter', unlocked: goDone + aiLessonsDone + prefs.gameWins.length >= 1 },
    { id: 'coder', label: 'Coder', unlocked: goDone + aiLessonsDone >= 6 },
    { id: 'detective', label: 'Detective', unlocked: seniorEvidenceOrInv >= 1 },
    { id: 'architect', label: 'Architect', unlocked: seniorReviewOrCase >= 1 },
    { id: 'senior', label: 'Senior Lab', unlocked: totalSeniorPassed >= 6 },
    { id: 'graduate', label: 'Graduate', unlocked: prefs.xp >= 500 || goDone + aiLessonsDone >= 18 },
  ];
}

export function ProgressPage({
  t,
  prefs,
  locale,
}: {
  t: (k: string) => string;
  prefs: Prefs;
  locale: Locale;
}) {
  const achieved = modules.filter((m) => prefs.completed.includes(m.id));
  const aiPassedCount = Object.values(prefs.aiSeniorResults).filter((r) => r.passed).length;
  const badges = computeBadges(prefs);

  return (
    <div class="content-page">
      <PageHeading eyebrow="YOUR JOURNEY" title={t('progress')} subtitle={t('savedAutomatic')} />
      <div class="progress-layout">
        <Card className="progress-summary">
          <Mascot name="graduate" />
          <div>
            <span class="eyebrow small">AI PIXEL ARCHITECT</span>
            <h2>{prefs.xp} XP</h2>
            <p>
              {prefs.completed.length} {t('completed')} · {prefs.gameWins.length} {t('games')} ·{' '}
              {Object.keys(prefs.investigationResults).length} investigaciones Senior ·{' '}
              {Object.keys(prefs.operationsResults).length} laboratorios operativos ·{' '}
              {aiPassedCount}/18 AI Senior
            </p>
          </div>
        </Card>
        <Card>
          <h3>{t('achievements')}</h3>
          <div class="badge-grid">
            {badges.map((b) => (
              <div class={`badge-card ${b.unlocked ? 'unlocked' : 'locked'}`} key={b.id}>
                <img src={asset(`badges/${b.id}.svg`)} width={36} height={36} alt={b.label} />
                <span>{b.label}</span>
                <small>{b.unlocked ? '✓' : '🔒'}</small>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <h2>{t('completed')}</h2>
      <div class="module-grid">
        {achieved.length ? (
          achieved.map((m) => (
            <div class="module-card" key={m.id}>
              <span class="mono">{m.id}</span>
              <h3>{m.title[locale]}</h3>
            </div>
          ))
        ) : (
          <p class="muted">
            {t('start')} → <a href="#/lesson/B01">B01</a>
          </p>
        )}
      </div>
    </div>
  );
}
