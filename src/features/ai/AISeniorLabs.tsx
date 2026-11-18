import { useEffect, useState } from 'preact/hooks';
import decisionLabs from '../../content/ai/decision-labs.json';
import evidenceLabs from '../../content/ai/evidence-labs.json';
import guides from '../../content/ai/guides.json';
import operationsLabs from '../../content/ai/operations-labs.json';
import reviewLabs from '../../content/ai/review-labs.json';
import { Button, Card } from '../../shared/ui/primitives';
import { saveAiLabResult } from '../progress/model/progress.signal';
import {
  AI_LAB_VERSION,
  gradeAiDecisionLab,
  gradeAiEvidenceLab,
  gradeAiTwoStepLab,
} from './engine/ai-labs.mjs';

export type AISeniorLabKind = 'decision-lab' | 'evidence-lab' | 'review-lab' | 'operations-lab' | 'guide';

export function AISeniorLabs({
  caseId,
  labKind,
  backLabel,
}: {
  caseId: string;
  labKind: AISeniorLabKind;
  backLabel: string;
}) {
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);
  const [selections, setSelections] = useState<number[]>([]);
  const [step0, setStep0] = useState<number>(-1);
  const [step1, setStep1] = useState<number>(-1);
  const [feedback, setFeedback] = useState<{ passed: boolean; score: number; text: string } | null>(null);

  useEffect(() => {
    setAnswers([-1, -1, -1]);
    setSelections([]);
    setStep0(-1);
    setStep1(-1);
    setFeedback(null);
  }, [caseId, labKind]);

  if (labKind === 'guide') {
    const guide = guides.find((g) => g.id === caseId);
    if (!guide) return <Card><a href={`#/ai/senior/${caseId}`}>{backLabel}</a><p>Guide not found</p></Card>;
    return (
      <section class="ai-case">
        <p><a href={`#/ai/senior/${caseId}`}>← {caseId}</a></p>
        <h2>{caseId} · {guide.controlRef}</h2>
        <Card>
          <p>{guide.rationale}</p>
          <h3>Riesgos de producción</h3>
          <ul>{guide.risks.map((r) => <li key={r}>{r}</li>)}</ul>
          <h3>Pruebas verificables</h3>
          <ul>{guide.tests.map((t) => <li key={t}>{t}</li>)}</ul>
          <div class="ai-dodont-grid">
            <div class="ai-pass"><b>✅ Correcto</b><p>{guide.good}</p></div>
            <div class="ai-fail"><b>❌ Incorrecto</b><p>{guide.bad}</p></div>
          </div>
        </Card>
      </section>
    );
  }

  if (labKind === 'decision-lab') {
    const lab = decisionLabs.find((d) => d.id === caseId);
    if (!lab) return <Card><p>Decision lab not found</p></Card>;
    return (
      <section class="ai-case">
        <p><a href={`#/ai/senior/${caseId}`}>← {caseId}</a></p>
        <h2>{caseId} · Decision Lab (3/3)</h2>
        {lab.questions.map((q, qIdx) => (
          <fieldset key={q.prompt}>
            <legend>{qIdx + 1}. {q.prompt}</legend>
            {q.options.map((opt, optIdx) => (
              <label class="ai-option" key={opt}>
                <input
                  type="radio"
                  name={`ai-dec-${qIdx}`}
                  checked={answers[qIdx] === optIdx}
                  onChange={() => {
                    setAnswers((prev) => prev.map((v, i) => (i === qIdx ? optIdx : v)));
                    setFeedback(null);
                  }}
                />
                {opt}
              </label>
            ))}
          </fieldset>
        ))}
        <Button
          disabled={answers.some((v) => v < 0)}
          onClick={() => {
            const res = gradeAiDecisionLab(lab, answers);
            setFeedback({
              passed: res.passed,
              score: res.score,
              text: `${res.correct}/${res.total} · ${lab.questions.map((q) => q.explanation).join(' | ')}`,
            });
            if (res.passed) {
              saveAiLabResult('decision', caseId, {
                version: AI_LAB_VERSION,
                passed: true,
                score: res.score,
                answers,
              });
            }
          }}
        >
          Evaluar Decision Lab
        </Button>
        {feedback && (
          <output class={feedback.passed ? 'ai-pass' : 'ai-fail'}>
            <b>{feedback.score}/100</b>
            <p>{feedback.text}</p>
          </output>
        )}
      </section>
    );
  }

  if (labKind === 'evidence-lab') {
    const lab = evidenceLabs.find((e) => e.id === caseId);
    if (!lab) return <Card><p>Evidence lab not found</p></Card>;
    const toggle = (idx: number) => {
      setSelections((prev) => (prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]));
      setFeedback(null);
    };
    return (
      <section class="ai-case">
        <p><a href={`#/ai/senior/${caseId}`}>← {caseId}</a></p>
        <h2>{caseId} · Evidence Lab</h2>
        <pre class="mini-code">{lab.telemetry}</pre>
        <fieldset>
          <legend>Selecciona los hallazgos respaldados por la evidencia (2)</legend>
          {lab.findings.map((f, idx) => (
            <label class="ai-option" key={f}>
              <input type="checkbox" checked={selections.includes(idx)} onChange={() => toggle(idx)} />
              {f}
            </label>
          ))}
        </fieldset>
        <Button
          disabled={selections.length === 0}
          onClick={() => {
            const res = gradeAiEvidenceLab(lab, selections);
            setFeedback({ passed: res.passed, score: res.score, text: lab.explanation });
            if (res.passed) {
              saveAiLabResult('evidence', caseId, {
                version: AI_LAB_VERSION,
                passed: true,
                score: res.score,
                selections,
              });
            }
          }}
        >
          Verificar Evidencias
        </Button>
        {feedback && (
          <output class={feedback.passed ? 'ai-pass' : 'ai-fail'}>
            <b>{feedback.score}/100</b>
            <p>{feedback.text}</p>
          </output>
        )}
      </section>
    );
  }

  if (labKind === 'review-lab') {
    const lab = reviewLabs.find((r) => r.id === caseId);
    if (!lab) return <Card><p>Review lab not found</p></Card>;
    return (
      <section class="ai-case">
        <p><a href={`#/ai/senior/${caseId}`}>← {caseId}</a></p>
        <h2>{caseId} · AI Code & SQL Review Lab</h2>
        <pre class="mini-code">{lab.diff}</pre>
        <fieldset>
          <legend>1. Riesgo principal del diff</legend>
          {lab.risks.map((r, idx) => (
            <label class="ai-option" key={r}>
              <input type="radio" name="ai-rev-0" checked={step0 === idx} onChange={() => { setStep0(idx); setFeedback(null); }} />
              {r}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>2. Corrección segura recomendada</legend>
          {lab.fixes.map((fx, idx) => (
            <label class="ai-option" key={fx}>
              <input type="radio" name="ai-rev-1" checked={step1 === idx} onChange={() => { setStep1(idx); setFeedback(null); }} />
              {fx}
            </label>
          ))}
        </fieldset>
        <Button
          disabled={step0 < 0 || step1 < 0}
          onClick={() => {
            const res = gradeAiTwoStepLab(lab, step0, step1, 'riskCorrect', 'fixCorrect');
            setFeedback({ passed: res.passed, score: res.score, text: lab.explanation });
            if (res.passed) {
              saveAiLabResult('review', caseId, {
                version: AI_LAB_VERSION,
                passed: true,
                score: res.score,
                choices: [step0, step1],
              });
            }
          }}
        >
          Aprobar / Rechazar PR
        </Button>
        {feedback && (
          <output class={feedback.passed ? 'ai-pass' : 'ai-fail'}>
            <b>{feedback.score}/100</b>
            <p>{feedback.text}</p>
          </output>
        )}
      </section>
    );
  }

  const ops = operationsLabs.find((o) => o.id === caseId);
  if (!ops) return <Card><p>Operations lab not found</p></Card>;
  return (
    <section class="ai-case">
      <p><a href={`#/ai/senior/${caseId}`}>← {caseId}</a></p>
      <h2>{caseId} · LLMOps & FinOps Operations Lab</h2>
      <pre class="mini-code">{ops.incident}</pre>
      <fieldset>
        <legend>1. Causa raíz probable</legend>
        {ops.causes.map((c, idx) => (
          <label class="ai-option" key={c}>
            <input type="radio" name="ai-ops-0" checked={step0 === idx} onChange={() => { setStep0(idx); setFeedback(null); }} />
            {c}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>2. Mitigación operativa</legend>
        {ops.mitigations.map((m, idx) => (
          <label class="ai-option" key={m}>
            <input type="radio" name="ai-ops-1" checked={step1 === idx} onChange={() => { setStep1(idx); setFeedback(null); }} />
            {m}
          </label>
        ))}
      </fieldset>
      <Button
        disabled={step0 < 0 || step1 < 0}
        onClick={() => {
          const res = gradeAiTwoStepLab(ops, step0, step1, 'causeCorrect', 'mitigationCorrect');
          setFeedback({ passed: res.passed, score: res.score, text: ops.explanation });
          if (res.passed) {
            saveAiLabResult('operations', caseId, {
              version: AI_LAB_VERSION,
              passed: true,
              score: res.score,
              choices: [step0, step1],
            });
          }
        }}
      >
        Ejecutar Mitigación
      </Button>
      {feedback && (
        <output class={feedback.passed ? 'ai-pass' : 'ai-fail'}>
          <b>{feedback.score}/100</b>
          <p>{feedback.text}</p>
        </output>
      )}
    </section>
  );
}
