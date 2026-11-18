import { useEffect, useState } from 'preact/hooks';
import { CodeEditorShell } from '../../shared/ui/CodeEditorShell';
import { Button, Card, Icon } from '../../shared/ui/primitives';
import { AiArchitectureDiagram } from '../learning/AiArchitectureDiagram';
import { markModuleCompleted, updateDraft } from '../progress/model/progress.signal';
import { validateAILessonCode, type AILessonValidationResult } from './lesson-validator.mjs';
import type { AICurriculumItem, AII18nBundle, AILessonSpec } from './types/ai.types';

export function AILessonPage({
  copy,
  moduleItem,
  lesson,
  draftCode,
  fontSize,
  isCompleted,
  seniorEnabled = false,
}: {
  copy: AII18nBundle;
  moduleItem?: AICurriculumItem;
  lesson?: AILessonSpec;
  draftCode?: string;
  fontSize: 'sm' | 'md' | 'lg';
  isCompleted: boolean;
  seniorEnabled?: boolean;
}) {
  const [code, setCode] = useState<string>(draftCode ?? lesson?.starterCode ?? '');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<AILessonValidationResult | null>(null);

  useEffect(() => {
    setCode(draftCode ?? lesson?.starterCode ?? '');
    setShowHint(false);
    setResult(null);
  }, [lesson?.id]);

  if (!moduleItem || !lesson) {
    return (
      <Card>
        <p>
          <a href="#/ai">{copy.backCatalog}</a>
        </p>
        <h2>{copy.notFound}</h2>
      </Card>
    );
  }

  const loc = copy.modules[moduleItem.id];
  const seniorId = `S${moduleItem.id}`;

  const onCheck = () => {
    const res = validateAILessonCode(lesson, code);
    setResult(res);
    if (res.passed) {
      markModuleCompleted(moduleItem.id);
    }
  };

  const onReset = () => {
    setCode(lesson.starterCode);
    updateDraft(moduleItem.id, lesson.starterCode);
    setResult(null);
  };

  return (
    <section class="ai-case">
      <div class="breadcrumbs">
        <a href="#/ai">{copy.backCatalog}</a>
        <span>/</span>
        <b>{moduleItem.id}</b>
        {isCompleted && <span class="tag info">{copy.completedBadge}</span>}
      </div>

      <h2>
        {moduleItem.id} · {loc?.title || moduleItem.title}
      </h2>
      <p class="ai-scenario">{loc?.summary || moduleItem.summary}</p>
      <p>
        <b>Stack:</b> {moduleItem.stack} · <b>{copy.levelLabels[moduleItem.level]}</b>
      </p>

      <AiArchitectureDiagram
        moduleId={moduleItem.id}
        stack={moduleItem.stack}
        locale="es"
      />

      <Card>
        <h3>{copy.conceptsTitle}</h3>
        <div class="concept-grid">
          {lesson.concepts.map((c) => (
            <div class="concept-item" key={c.term}>
              <code>{c.term}</code>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div class="ai-dodont-grid">
          <div class="ai-pass">
            <b>{copy.doLabel}</b>
            <p>{lesson.doDont.good}</p>
          </div>
          <div class="ai-fail">
            <b>{copy.dontLabel}</b>
            <p>{lesson.doDont.bad}</p>
          </div>
        </div>
      </Card>

      <div class="lesson-mission">
        <div class="lesson-mission-title">
          <Icon name="check" size={18} />
          <span>{copy.missionTitle}</span>
        </div>
        <p>{lesson.mission}</p>
      </div>

      {seniorEnabled && (
        <Card className="feature-banner">
          <div>
            <span class="eyebrow small">SENIOR MODE · PRODUCCIÓN</span>
            <h3>{seniorId} · {loc?.title || moduleItem.title}</h3>
            <p>{lesson.doDont.good}</p>
            <a class="btn btn-senior" href={`#/ai/senior/${seniorId}`}>
              {copy.relatedSenior} ({seniorId}) →
            </a>
          </div>
        </Card>
      )}

      <Card className="editor-card">
        <CodeEditorShell
          fileName={`${moduleItem.id.toLowerCase()}.${lesson.language}`}
          badge={lesson.language.toUpperCase()}
          ariaLabel={moduleItem.id}
          value={code}
          fontSize={fontSize}
          onChange={(val) => {
            setCode(val);
            updateDraft(moduleItem.id, val);
            setResult(null);
          }}
        />
        <div class="editor-actions">
          <Button onClick={onCheck}>
            <Icon name="check" size={18} />
            {copy.editorCheck}
          </Button>
          <Button kind="outline" onClick={onReset}>
            {copy.editorReset}
          </Button>
          <Button kind="quiet" onClick={() => setShowHint(!showHint)}>
            {copy.editorHint}
          </Button>
          <a class="text-link" href={`#/ai/senior/${seniorId}`}>
            {copy.relatedSenior} ({seniorId}) →
          </a>
        </div>
        {showHint && (
          <div class="hint-box">
            <Icon name="question" size={18} />
            <code>{lesson.hint}</code>
          </div>
        )}
        {result && (
          <output class={result.passed ? 'ai-pass' : 'ai-fail'}>
            <b>
              {result.passed ? copy.editorPass : copy.editorFail} ({result.passedCount}/
              {result.totalCount})
            </b>
            {result.failedChecks.length > 0 && (
              <ul>
                {result.failedChecks.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}
          </output>
        )}
        <p class="small-disclaimer">{copy.editorDisclaimer}</p>
      </Card>
    </section>
  );
}
