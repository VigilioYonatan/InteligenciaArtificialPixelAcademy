import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { initialPrefs } from '../progress/constants/progress.constants';
import { ProgressPage } from './ProgressPage';

afterEach(() => {
  cleanup();
});

const t = (k: string) => k;

describe('ProgressPage badges and XP integration', () => {
  it('shows all 6 badges locked at 0 XP and unlocks them as progress grows', () => {
    const { rerender } = render(<ProgressPage t={t} prefs={initialPrefs} locale="es" />);
    expect(screen.getByText('0 XP')).toBeTruthy();
    expect(screen.getAllByText('🔒').length).toBe(6);

    rerender(
      <ProgressPage
        t={t}
        locale="es"
        prefs={{
          ...initialPrefs,
          xp: 520,
          completed: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06'],
          aiSeniorResults: { SAI01: { version: 1, passed: true, score: 100 } },
        }}
      />,
    );
    expect(screen.getByText('520 XP')).toBeTruthy();
    expect(screen.getAllByText('✓').length).toBeGreaterThanOrEqual(4);
  });
});
