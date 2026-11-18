import { fireEvent, render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { initialPrefs } from '../progress/constants/progress.constants';
import { LessonPage } from './LessonPage';

describe('LessonPage UI (AI Architecture Multi-Stack)', () => {
  const t = (k: string) => k;

  it('renders AI stack badge, Vigilio Do/Dont card, Senior Mode bridge, and deterministic diagnostics', () => {
    const updateDraft = vi.fn();
    const mark = vi.fn();
    const prefs = { ...initialPrefs, seniorEnabled: true };

    const { container } = render(
      <LessonPage
        t={t}
        locale="es"
        id="B01"
        prefs={prefs}
        updateDraft={updateDraft}
        mark={mark}
      />,
    );

    expect(screen.getByText('tokens-budget.ts')).toBeTruthy();
    expect(screen.getByText('TypeScript / FinOps')).toBeTruthy();
    expect(screen.getByText('ARCHITECTURE DIAGRAM · B01')).toBeTruthy();
    expect(screen.getByText('✅ Correcto')).toBeTruthy();
    expect(screen.getByText('❌ Incorrecto')).toBeTruthy();
    expect(screen.getByText('SENIOR MODE · PRODUCTION BRIDGE')).toBeTruthy();

    // Interactive diagram stage inspection
    const secondStage = screen.getByRole('tab', { name: /2\. Structured Output/i });
    fireEvent.click(secondStage);
    expect(screen.getByText(/Texto libre rompe consumidores downstream/i)).toBeTruthy();

    // Clicking validate on starter code shows incorrect + diagnostic
    const validateBtn = screen.getByRole('button', { name: 'validate' });
    fireEvent.click(validateBtn);
    expect(container.querySelector('.feedback.incorrect')).toBeTruthy();
    expect(mark).not.toHaveBeenCalled();

    // Entering valid solution passes and marks B01 completed
    const textarea = screen.getByLabelText('code') as HTMLTextAreaElement;
    fireEvent.input(textarea, {
      target: {
        value:
          'export function buildContextBudget(maxContext: number, maxOutput: number, inputTokens: number) {\n  const availableInput = Math.max(0, maxContext - maxOutput);\n  const truncated = inputTokens > availableInput;\n  return { availableInput, maxOutput, truncated };\n}',
      },
    });
    fireEvent.click(validateBtn);
    expect(container.querySelector('.feedback.correct')).toBeTruthy();
    expect(mark).toHaveBeenCalledWith('B01');
  });
});
