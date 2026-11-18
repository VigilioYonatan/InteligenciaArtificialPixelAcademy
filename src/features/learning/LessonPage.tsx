import { useEffect, useState } from 'preact/hooks';
import { routeTo } from '../../app/router';
import curriculum from '../../data/curriculum.json';
import { aiExamples, lessonGuides } from '../../data/learning-exercises';
import { CodeEditorShell } from '../../shared/ui/CodeEditorShell';
import { Button, Card, Icon, Mascot, PageHeading } from '../../shared/ui/primitives';
import { AxonPlayer } from '../cinema/AxonPlayer';
import { getCinemaDeck } from '../cinema/data/storyboards';
import { evaluateAiExercise } from '../editor/ai-code-checker.mjs';
import type { Prefs } from '../progress/types/progress.types';
import { AiArchitectureDiagram } from './AiArchitectureDiagram';
import type { Locale, Module } from './types/learning.types';

const modules = curriculum as Module[];

const missionHeading: Record<Locale, string> = {
  es: '🎯 Tu Misión',
  en: '🎯 Your Mission',
  ja: '🎯 ミッション',
  zh: '🎯 当前任务',
  pt: '🎯 Sua Missão',
  fr: '🎯 Votre Mission',
};

const stepHeading: Record<Locale, string> = {
  es: 'Paso a paso',
  en: 'Step by Step',
  ja: '学習ステップ',
  zh: '学习步骤',
  pt: 'Passo a Passo',
  fr: 'Étape par étape',
};

const xpTip: Record<Locale, string> = {
  es: 'Completa el código sin placeholders y pulsa "Comprobar solución" para ganar XP.',
  en: 'Complete the code without placeholders and click "Check solution" to earn XP.',
  ja: 'プレースホルダを置換し「解答を確認」をクリックしてXPを獲得。',
  zh: '补全真实代码并点击“检查答案”即可获得经验值。',
  pt: 'Complete o código sem placeholders e clique em "Verificar solução" para ganhar XP.',
  fr: 'Complétez le code sans placeholders et cliquez sur « Vérifier la solution » pour gagner des XP.',
};

export function LessonPage({
  t,
  locale,
  id,
  prefs,
  updateDraft,
  mark,
}: {
  t: (k: string) => string;
  locale: Locale;
  id: string;
  prefs: Prefs;
  updateDraft: (id: string, v: string) => void;
  mark: (id: string) => void;
}) {
  const m = modules.find((item) => item.id === id && item.track !== 'senior');
  const spec = aiExamples[id];
  const guide = lessonGuides[id];
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [failedRules, setFailedRules] = useState<Array<{ id: string; label: string }>>([]);
  const [showHint, setShowHint] = useState(false);
  const [localCode, setLocalCode] = useState<string>(prefs.drafts[id] ?? spec?.code ?? '');

  useEffect(() => {
    setLocalCode(prefs.drafts[id] ?? aiExamples[id]?.code ?? '');
    setFeedback(null);
    setFailedRules([]);
    setShowHint(false);
  }, [id]);

  if (!m) {
    return (
      <div class="content-page">
        <PageHeading eyebrow="404" title="Module not found" />
        <Button onClick={() => routeTo('learn')}>{t('back')}</Button>
      </div>
    );
  }

  const seniorId = `S${String(((Number.parseInt(m.id.slice(1), 10) - 1) % 18) + 1).padStart(2, '0')}`;
  const cinemaDeck = getCinemaDeck(m.id);
  const mascotPose =
    feedback === 'correct'
      ? 'celebrate'
      : feedback === 'incorrect'
        ? 'debug'
        : spec
          ? 'reading'
          : 'architecture';

  return (
    <div class="content-page lesson-page">
      <div class="breadcrumbs">
        <a href="#/learn">{t('learn')}</a>
        <span>/</span>
        <a href={`#/learn/${m.track}`}>{t(m.track)}</a>
        <span>/</span>
        <b>{m.id}</b>
      </div>
      <PageHeading eyebrow={`${t('lesson')} ${m.id} · ${spec?.stack || 'AI Architecture'}`} title={m.title[locale]} subtitle={m.summary[locale]} />
      <div class="lesson-layout">
        <div class="lesson-main">
          {cinemaDeck && <AxonPlayer deck={cinemaDeck} locale={locale} compact />}
          <Card className="lesson-intro">
            <div class="lesson-intro-head">
              <div>
                <h2>{t('objectives')}</h2>
                <p>{m.summary[locale]}</p>
              </div>
              <div class="lesson-intro-art">
                <Mascot name={mascotPose} />
              </div>
            </div>
            {guide?.concepts[locale] && (
              <div class="concept-grid">
                {guide.concepts[locale].map((c) => (
                  <div class="concept-item" key={c.term}>
                    <code>{c.term}</code>
                    <p>{c.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {spec?.doDont && (
              <div class="ai-dodont-grid" style={{ marginTop: '14px' }}>
                <div class="ai-do">
                  <strong>✅ Correcto</strong>
                  <p>{spec.doDont.do}</p>
                </div>
                <div class="ai-dont">
                  <strong>❌ Incorrecto</strong>
                  <p>{spec.doDont.dont}</p>
                </div>
              </div>
            )}
            {!spec && <p class="notice">{t('contentPlan')}</p>}
          </Card>

          <AiArchitectureDiagram
            moduleId={m.id}
            stack={spec?.stack}
            locale={locale}
            reducedMotion={prefs.reducedMotion}
          />

          {guide?.mission[locale] && (
            <div class="lesson-mission">
              <div class="lesson-mission-title">
                <Icon name="check" size={18} />
                <span>{missionHeading[locale]}</span>
              </div>
              <p>{guide.mission[locale]}</p>
            </div>
          )}

          {prefs.seniorEnabled && (
            <Card className="feature-banner">
              <div>
                <span class="eyebrow small">SENIOR MODE · PRODUCTION BRIDGE</span>
                <h3>
                  {m.id} → {seniorId}
                </h3>
                <p>{spec?.seniorNote || t('briefHint')}</p>
                <a class="btn btn-senior" href={`#/senior/${seniorId}`}>
                  <Icon name="crown" size={18} />
                  {t('senior')} →
                </a>
              </div>
              <Mascot name="senior" />
            </Card>
          )}

          <Card className="editor-card">
            {spec ? (
              <>
                <CodeEditorShell
                  fileName={spec.fileName || 'architecture.ts'}
                  badge={spec.stack || t('planned')}
                  ariaLabel={t('code')}
                  value={localCode}
                  fontSize={prefs.fontSize || 'md'}
                  onChange={(v) => {
                    setLocalCode(v);
                    updateDraft(id, v);
                    setFeedback(null);
                    setFailedRules([]);
                  }}
                />
                <div class="editor-actions">
                  <Button
                    onClick={() => {
                      const evaluation = evaluateAiExercise(spec, localCode);
                      setFeedback(evaluation.passed ? 'correct' : 'incorrect');
                      setFailedRules(evaluation.failedRules);
                      if (evaluation.passed) mark(id);
                    }}
                  >
                    <Icon name="check" size={18} />
                    {t('validate')}
                  </Button>
                  <Button
                    kind="outline"
                    onClick={() => {
                      setLocalCode(spec.code);
                      updateDraft(id, spec.code);
                      setFeedback(null);
                      setFailedRules([]);
                    }}
                  >
                    {t('reset')}
                  </Button>
                  <Button kind="quiet" onClick={() => setShowHint(!showHint)}>
                    {t('hint')}
                  </Button>
                </div>
                {showHint && (
                  <div class="hint-box">
                    <Icon name="question" size={18} />
                    <code>{spec.hint}</code>
                  </div>
                )}
                {feedback && (
                  <div class={`feedback ${feedback}`}>
                    <div>
                      {feedback === 'correct' ? '✓ ' : '○ '}
                      {t(feedback)}
                    </div>
                    {failedRules.length > 0 && (
                      <ul style={{ margin: '8px 0 0 18px' }}>
                        {failedRules.map((rule) => (
                          <li key={rule.id}>{rule.label}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <p class="small-disclaimer">{t('runUnavailable')}</p>
              </>
            ) : (
              <div class="empty-editor">
                <Icon name="book" size={34} />
                {t('contentPlan')}
              </div>
            )}
          </Card>
        </div>
        <aside class="lesson-side">
          <Card className="side-panel">
            <h3>{stepHeading[locale]}</h3>
            <ul class="steps-list">
              {(
                guide?.steps[locale] || [
                  '01 · Lee la lección',
                  '02 · Completa el código',
                  '03 · Comprueba tu solución',
                ]
              ).map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </Card>
          <Card className="side-gopher">
            <Mascot name={feedback === 'correct' ? 'celebrate' : feedback === 'incorrect' ? 'debug' : 'idea'} />
            <p>{xpTip[locale]}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
