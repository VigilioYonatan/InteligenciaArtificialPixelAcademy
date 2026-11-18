import { useEffect } from 'preact/hooks';
import { AIAcademy } from '../features/ai/AIAcademy';
import { FrameworksPage } from '../features/frameworks/FrameworksPage';
import { GamesPage } from '../features/games/GamesPage';
import { CatalogPage } from '../features/learning/CatalogPage';
import { dictionaries } from '../features/learning/constants/learning.constants';
import { LessonPage } from '../features/learning/LessonPage';
import type { RouteTrack } from '../features/learning/types/learning.types';
import {
  markModuleCompleted,
  persistCurrentPrefs,
  prefsSignal,
  recordGameWin,
  resetPrefs,
  saveEvidenceResult,
  saveInvestigationResult,
  saveOperationsResult,
  saveReviewResult,
  saveSeniorDecision,
  updateDraft,
  updateNote,
  updatePrefs,
} from '../features/progress/model/progress.signal';
import { ProgressPage } from '../features/progress/ProgressPage';
import { CodeReviewLab } from '../features/senior/CodeReviewLab';
import { DecisionLab } from '../features/senior/DecisionLab';
import { EvidenceLab } from '../features/senior/EvidenceLab';
import { InvestigationLab } from '../features/senior/InvestigationLab';
import { NativeLabCatalog, SeniorReadiness } from '../features/senior/NativeLabCatalog';
import { OperationsLab } from '../features/senior/OperationsLab';
import { SeniorCapstone } from '../features/senior/SeniorCapstone';
import { SeniorDashboard } from '../features/senior/SeniorDashboard';
import { SeniorGuide } from '../features/senior/SeniorGuide';
import { SeniorModuleHub } from '../features/senior/SeniorModuleHub';
import { SeniorResult } from '../features/senior/SeniorResult';
import { verifyReviewRecord } from '../features/senior/engine/code-review.mjs';
import { verifiedOperationsRecord } from '../features/senior/engine/operations.mjs';
import { PlaygroundPage } from '../features/playground/PlaygroundPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { HomePage, type TrackPercentages } from '../features/welcome/HomePage';
import { AppShell } from './AppShell';
import { ErrorBoundary } from './ErrorBoundary';
import { getRoute, useHash } from './router';
import { AboutPage, CreditsPage, MissingPage } from './StaticPages';

// Re-export repository boundary validators used by Senior route tests.
export { verifiedOperationsRecord, verifyReviewRecord };

const KNOWN_PAGES = new Set([
  'home',
  'learn',
  'lesson',
  'exercise',
  'games',
  'senior',
  'frameworks',
  'playground',
  'progress',
  'settings',
  'about',
  'credits',
  'ai',
]);

export function App() {
  const prefs = prefsSignal.value;
  const hash = useHash();
  const parts = getRoute(hash);
  const page = parts[0] || 'home';
  const t = (key: string) => dictionaries[prefs.locale][key] || key;

  useEffect(() => {
    for (const name of ['dark', 'light', 'senior']) {
      document.documentElement.style.setProperty(
        `--landscape-${name}`,
        `url("${import.meta.env.BASE_URL}assets/backgrounds/landscape-${name}.svg")`,
      );
    }
    document.documentElement.setAttribute('data-theme', prefs.theme);
    document.documentElement.setAttribute('data-senior', String(prefs.seniorEnabled));
    document.documentElement.lang = prefs.locale;
    document.documentElement.setAttribute('data-reduced-motion', String(prefs.reducedMotion));
    persistCurrentPrefs();
  }, [prefs]);

  const trackPcts: TrackPercentages = {
    basic: Math.min(100, Math.round((100 * prefs.completed.filter((id) => /^B\d\d$/.test(id)).length) / 12)),
    intermediate: Math.min(
      100,
      Math.round((100 * prefs.completed.filter((id) => /^I\d\d$/.test(id)).length) / 12),
    ),
    advanced: Math.min(100, Math.round((100 * prefs.completed.filter((id) => /^A\d\d$/.test(id)).length) / 12)),
    senior: Math.min(
      100,
      Math.round(
        (100 *
          new Set([
            ...Object.keys(prefs.seniorResults).filter((k) => prefs.seniorResults[k]?.passed),
            ...Object.keys(prefs.reviewResults).filter((k) => prefs.reviewResults[k]?.passed),
          ]).size) /
          18,
      ),
    ),
  };

  return (
    <ErrorBoundary>
      <AppShell page={page} prefs={prefs} t={t} onUpdatePrefs={updatePrefs}>
        {page === 'home' && <HomePage t={t} trackPcts={trackPcts} />}
        {page === 'ai' && (
          <AIAcademy
            activeId={parts[1]}
            subId={parts[2]}
            labKind={parts[3]}
            locale={prefs.locale}
          />
        )}
        {page === 'learn' && parts.length < 3 && (
          <CatalogPage
            t={t}
            locale={prefs.locale}
            completed={prefs.completed}
            track={parts[1] as RouteTrack | undefined}
          />
        )}
        {page === 'learn' && parts.length >= 3 && (
          <LessonPage
            t={t}
            locale={prefs.locale}
            id={parts[2]}
            prefs={prefs}
            updateDraft={updateDraft}
            mark={markModuleCompleted}
          />
        )}
        {page === 'lesson' && (
          <LessonPage
            t={t}
            locale={prefs.locale}
            id={parts[1] || 'B01'}
            prefs={prefs}
            updateDraft={updateDraft}
            mark={markModuleCompleted}
          />
        )}
        {page === 'exercise' && (
          <LessonPage
            t={t}
            locale={prefs.locale}
            id={(parts[1] || 'B01').split('-')[0]}
            prefs={prefs}
            updateDraft={updateDraft}
            mark={markModuleCompleted}
          />
        )}
        {page === 'games' && (
          <GamesPage
            t={t}
            locale={prefs.locale}
            prefs={prefs}
            onWinGame={recordGameWin}
            initialMode={parts[1]}
          />
        )}
        {page === 'senior' && parts[1]==='native' && parts.length === 2 && (
          <NativeLabCatalog locale={prefs.locale} />
        )}
        {page === 'senior' && parts[1]==='readiness' && parts.length === 2 && (
          <SeniorReadiness locale={prefs.locale} records={prefs} />
        )}
        {page === 'senior' && parts[1]==='capstone' && parts.length === 2 && (
          <SeniorCapstone locale={prefs.locale} />
        )}
        {page === 'senior' && parts.length === 3 && parts[2]==='guide' && (
          <SeniorGuide moduleId={parts[1]} locale={prefs.locale} />
        )}
        {page === 'senior' && parts.length === 3 && parts[2] === 'review-lab' && (
          <CodeReviewLab
            key={parts[1]}
            moduleId={parts[1]}
            locale={prefs.locale}
            previous={prefs.reviewResults[parts[1]]}
            save={saveReviewResult}
          />
        )}
        {page === 'senior' &&
          parts.length === 4 &&
          parts[2] === 'review-lab' &&
          parts[3] === 'result' && (
            <CodeReviewLab
              reportOnly
              key={parts[1]}
              moduleId={parts[1]}
              locale={prefs.locale}
              previous={prefs.reviewResults[parts[1]]}
              save={saveReviewResult}
            />
          )}
        {page === 'senior' && parts.length === 3 && parts[2] === 'native' && (
          <NativeLabCatalog locale={prefs.locale} activeModule={parts[1]} />
        )}
        {page === 'senior' && parts.length === 3 && parts[2] === 'operations-lab' && (
          <OperationsLab
            key={parts[1]}
            moduleId={parts[1]}
            locale={prefs.locale}
            previous={prefs.operationsResults[parts[1]]}
            save={saveOperationsResult}
          />
        )}
        {page === 'senior' &&
          parts.length === 4 &&
          parts[2] === 'operations-lab' &&
          parts[3] === 'result' && (
            <OperationsLab
              reportOnly
              key={parts[1]}
              moduleId={parts[1]}
              locale={prefs.locale}
              previous={prefs.operationsResults[parts[1]]}
              save={saveOperationsResult}
            />
          )}
        {page === 'senior' && parts.length === 3 && parts[2] === 'investigation-lab' && (
          <InvestigationLab
            key={parts[1]}
            moduleId={parts[1]}
            locale={prefs.locale}
            previous={prefs.investigationResults[parts[1]]}
            save={saveInvestigationResult}
          />
        )}
        {page === 'senior' &&
          parts.length === 4 &&
          parts[2] === 'investigation-lab' &&
          parts[3] === 'result' && (
            <InvestigationLab
              reportOnly
              key={parts[1]}
              moduleId={parts[1]}
              locale={prefs.locale}
              previous={prefs.investigationResults[parts[1]]}
              save={saveInvestigationResult}
            />
          )}
        {page === 'senior' && parts.length === 3 && parts[2] === 'decision-lab' && (
          <DecisionLab
            key={parts[1]}
            moduleId={parts[1]}
            locale={prefs.locale}
            previous={prefs.seniorResults[parts[1]]}
            save={saveSeniorDecision}
          />
        )}
        {page === 'senior' &&
          parts.length === 4 &&
          parts[2] === 'decision-lab' &&
          parts[3] === 'result' && (
            <SeniorResult
              moduleId={parts[1]}
              locale={prefs.locale}
              challengeType="decision-lab"
              seniorResults={prefs.seniorResults}
              evidenceResults={prefs.evidenceResults}
              notes={prefs.notes}
            />
          )}
        {page === 'senior' && parts.length === 3 && parts[2] === 'evidence-lab' && (
          <EvidenceLab
            key={parts[1]}
            moduleId={parts[1]}
            locale={prefs.locale}
            previous={prefs.evidenceResults[parts[1]]}
            save={saveEvidenceResult}
          />
        )}
        {page === 'senior' &&
          parts.length === 4 &&
          parts[2] === 'evidence-lab' &&
          parts[3] === 'result' && (
            <SeniorResult
              moduleId={parts[1]}
              locale={prefs.locale}
              challengeType="evidence-lab"
              seniorResults={prefs.seniorResults}
              evidenceResults={prefs.evidenceResults}
              notes={prefs.notes}
            />
          )}
        {page === 'senior' && parts.length === 2 && /^S(0[1-9]|1[0-8])$/.test(parts[1]) && (
          <SeniorModuleHub
            key={parts[1]}
            moduleId={parts[1]}
            locale={prefs.locale}
            notes={prefs.notes}
            updateNote={updateNote}
            seniorResults={prefs.seniorResults}
            evidenceResults={prefs.evidenceResults}
            investigationResults={prefs.investigationResults}
            operationsResults={prefs.operationsResults}
            reviewResults={prefs.reviewResults}
          />
        )}
        {page === 'senior' && parts.length === 1 && (
          <SeniorDashboard
            locale={prefs.locale}
            seniorResults={prefs.seniorResults}
            evidenceResults={prefs.evidenceResults}
            investigationResults={prefs.investigationResults}
            operationsResults={prefs.operationsResults}
            reviewResults={prefs.reviewResults}
          />
        )}
        {/* Senior activities: 'Revisar código AI' (#/senior/:id/review-lab) | 'Estudiar guía técnica' (#/senior/:id/guide) */}
        {page === 'senior' &&
          parts.length >= 4 &&
          !(
            parts[3] === 'result' &&
            ['decision-lab', 'evidence-lab', 'investigation-lab', 'operations-lab', 'review-lab'].includes(
              parts[2],
            )
          ) && <MissingPage t={t} />}
        {page === 'frameworks' && (
          <FrameworksPage t={t} locale={prefs.locale} id={parts[1]} unitId={parts[2]} />
        )}
        {page === 'playground' && <PlaygroundPage t={t} />}
        {page === 'progress' && <ProgressPage t={t} prefs={prefs} locale={prefs.locale} />}
        {page === 'settings' && (
          <SettingsPage
            t={t}
            prefs={prefs}
            update={updatePrefs}
            reset={resetPrefs}
          />
        )}
        {page === 'about' && <AboutPage t={t} locale={prefs.locale} />}
        {page === 'credits' && <CreditsPage t={t} locale={prefs.locale} />}
        {(page === '404' || !KNOWN_PAGES.has(page)) && <MissingPage t={t} locale={prefs.locale} />}
      </AppShell>
    </ErrorBoundary>
  );
}
