import { useEffect, useState } from 'preact/hooks';
import { Card } from '../../shared/ui/primitives';
import { saveAiSeniorResult, updateNote } from '../progress/model/progress.signal';
import { ASSESSMENT_VERSION, gradeCase } from './assessment.mjs';
import type { AII18nBundle, AISeniorCase } from './types/ai.types';

export function AISeniorHub({
  copy,
  active,
  adrNote,
  isPassed,
}: {
  copy: AII18nBundle;
  active?: AISeniorCase;
  adrNote: string;
  isPassed: boolean;
}) {
  const [answer, setAnswer] = useState<number>(-1);
  const [evidence, setEvidence] = useState('');
  const [report, setReport] = useState<{ passed: boolean; score: number; reason: string } | null>(null);

  useEffect(() => {
    setAnswer(-1);
    setEvidence('');
    setReport(null);
  }, [active?.id]);

  if (!active) {
    return (
      <Card>
        <p>
          <a href="#/ai">{copy.backCatalog}</a>
        </p>
        <h2>{copy.notFound}</h2>
      </Card>
    );
  }

  const loc = copy.modules[active.moduleId];

  function validate() {
    if (!active) return;
    const grade = gradeCase(active, answer, evidence);
    setReport(grade);
    if (grade.passed) {
      saveAiSeniorResult(active.id, {
        version: ASSESSMENT_VERSION,
        passed: true,
        score: grade.score,
      });
    }
  }

  return (
    <section class="ai-case">
      <div class="breadcrumbs">
        <a href="#/ai">{copy.backCatalog}</a>
        <span>/</span>
        <b>{active.id}</b>
        {isPassed && <span class="tag info">{copy.verifiedBadge}</span>}
        <a class="text-link" href={`#/ai/learn/${active.moduleId}`}>
          {copy.relatedLesson} ({active.moduleId}) ↗
        </a>
      </div>

      <h2>
        {active.id} · {loc?.title || active.title} · Senior Mode
      </h2>
      <div class="editor-actions">
        <a class="btn btn-outline" href={`#/ai/senior/${active.id}/decision-lab`}>Decision Lab (3/3)</a>
        <a class="btn btn-outline" href={`#/ai/senior/${active.id}/evidence-lab`}>Evidence Lab</a>
        <a class="btn btn-outline" href={`#/ai/senior/${active.id}/review-lab`}>Code/SQL Review</a>
        <a class="btn btn-outline" href={`#/ai/senior/${active.id}/operations-lab`}>Operations Lab</a>
        <a class="btn btn-outline" href={`#/ai/senior/${active.id}/guide`}>Guía Vigilio</a>
      </div>

      <p class="ai-scenario">{active.scenario}</p>
      <h3>{active.question}</h3>

      <fieldset>
        <legend>{copy.chooseDecision}</legend>
        {active.options.map((option, index) => (
          <label class="ai-option" key={index}>
            <input
              name="ai-choice"
              type="radio"
              checked={answer === index}
              onChange={() => {
                setAnswer(index);
                setReport(null);
              }}
            />
            {option}
          </label>
        ))}
      </fieldset>

      <label class="ai-evidence" for="ai-evidence">
        {copy.justificationLabel}
      </label>
      <textarea
        id="ai-evidence"
        value={evidence}
        maxLength={3000}
        rows={5}
        placeholder={copy.justificationPlaceholder}
        onInput={(e) => {
          setEvidence(e.currentTarget.value);
          setReport(null);
        }}
      />
      <p class="ai-note">{copy.evalNote}</p>
      <button type="button" class="ai-cta" onClick={validate}>
        {copy.evalBtn}
      </button>

      {report && (
        <output class={report.passed ? 'ai-pass' : 'ai-fail'}>
          <b>
            {report.score}/100 · {report.reason}
          </b>
          <p>{active.explanation}</p>
          <p>
            <b>{copy.recommendedEvidence}</b> {active.evidence.join(' · ')}
          </p>
        </output>
      )}

      <Card>
        <h3>{copy.adrTitle}</h3>
        <textarea
          aria-label={copy.adrTitle}
          maxLength={3000}
          rows={4}
          value={adrNote}
          placeholder={copy.adrPlaceholder}
          onInput={(e) => updateNote(active.id, (e.currentTarget as HTMLTextAreaElement).value)}
        />
        <p class="small-disclaimer">{copy.adrHint}</p>
      </Card>
    </section>
  );
}
