import type { Locale } from '../learning/types/learning.types';
import { prefsSignal } from '../progress/model/progress.signal';
import { AICapstone } from './AICapstone';
import { AIDashboard } from './AIDashboard';
import { AILessonPage } from './AILessonPage';
import { AIReadiness } from './AIReadiness';
import { AISeniorHub } from './AISeniorHub';
import { AISeniorLabs, type AISeniorLabKind } from './AISeniorLabs';
import { AISimulationLab } from './AISimulationLab';
import { aiI18n } from './constants/ai-i18n';
import curriculum from './curriculum.json';
import lessons from './lessons.json';
import cases from './senior-cases.json';
import type { AICurriculumItem, AILessonSpec, AISeniorCase } from './types/ai.types';

const curriculumList = curriculum as AICurriculumItem[];
const lessonList = lessons as AILessonSpec[];
const caseList = cases as AISeniorCase[];

const VALID_LAB_KINDS = new Set<AISeniorLabKind>([
  'decision-lab',
  'evidence-lab',
  'review-lab',
  'operations-lab',
  'guide',
]);

export function AIAcademy({
  activeId,
  subId,
  labKind,
  locale = 'es',
}: {
  activeId?: string;
  subId?: string;
  labKind?: string;
  locale?: Locale;
}) {
  const prefs = prefsSignal.value;
  const copy = aiI18n[locale] || aiI18n.es;

  const isLearnRoute = activeId === 'learn' && !!subId;
  const isSeniorSubRoute = activeId === 'senior' && !!subId;
  const isDirectSeniorRoute = !!activeId && /^SAI(0[1-9]|1[0-8])$/.test(activeId);

  const seniorTargetId = isSeniorSubRoute ? subId : isDirectSeniorRoute ? activeId : undefined;
  const activeSenior = seniorTargetId ? caseList.find((x) => x.id === seniorTargetId) : undefined;
  const activeModule = isLearnRoute ? curriculumList.find((m) => m.id === subId) : undefined;
  const activeLesson = isLearnRoute ? lessonList.find((l) => l.id === subId) : undefined;
  const validLabKind =
    labKind && VALID_LAB_KINDS.has(labKind as AISeniorLabKind)
      ? (labKind as AISeniorLabKind)
      : undefined;

  return (
    <div class="content-page ai-page">
      {activeId === 'simulators' ? (
        <AISimulationLab />
      ) : activeId === 'readiness' ? (
        <AIReadiness prefs={prefs} />
      ) : activeId === 'capstone' ? (
        <AICapstone />
      ) : isLearnRoute ? (
        <AILessonPage
          copy={copy}
          moduleItem={activeModule}
          lesson={activeLesson}
          draftCode={subId ? prefs.drafts[subId] : undefined}
          fontSize={prefs.fontSize || 'md'}
          isCompleted={!!subId && prefs.completed.includes(subId)}
          seniorEnabled={prefs.seniorEnabled}
          locale={locale}
        />
      ) : seniorTargetId && validLabKind ? (
        <AISeniorLabs caseId={seniorTargetId} labKind={validLabKind} backLabel={copy.backCatalog} />
      ) : seniorTargetId ? (
        <AISeniorHub
          copy={copy}
          active={activeSenior}
          adrNote={prefs.notes[seniorTargetId] || ''}
          isPassed={prefs.aiSeniorResults[seniorTargetId]?.passed === true}
        />
      ) : (
        <AIDashboard
          copy={copy}
          curriculum={curriculumList}
          cases={caseList}
          completedLessons={prefs.completed}
          seniorProgress={prefs.aiSeniorResults}
        />
      )}
    </div>
  );
}
