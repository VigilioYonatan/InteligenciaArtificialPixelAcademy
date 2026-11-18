import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialPrefs } from '../progress/constants/progress.constants';
import { GamesPage } from './GamesPage';

afterEach(() => {
  cleanup();
});

const t = (k: string) => k;

describe('GamesPage multi-round integration (100% AI Architecture)', () => {
  it('filters RAG & ACL rounds and validates a quiz answer', () => {
    const onWinGame = vi.fn();
    render(<GamesPage t={t} prefs={initialPrefs} onWinGame={onWinGame} />);

    fireEvent.click(screen.getByRole('button', { name: 'RAG & ACL' }));
    const correctOption = screen.getByRole('button', {
      name: /En el WHERE SQL antes de entregar chunks/i,
    });
    fireEvent.click(correctOption);
    fireEvent.click(screen.getByRole('button', { name: 'validate' }));

    expect(onWinGame).toHaveBeenCalledWith('quiz');
    expect(screen.getByText(/correct/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /3D Vector Arena/i }));
    fireEvent.click(screen.getByRole('button', { name: /Activar Filtro tenant_id \+ ACL/i }));
    fireEvent.click(screen.getByRole('button', { name: /Activar Iterative Scan/i }));
    fireEvent.click(screen.getByRole('button', { name: /Filtrar tenant_id \+ allowed_principals/i }));
    fireEvent.click(screen.getByRole('button', { name: /Comprobar Misión 3D/i }));
    expect(onWinGame).toHaveBeenCalledWith('arena3d');

    // Interactive Wave 2 switch + node quarantine
    fireEvent.click(screen.getByRole('button', { name: /Wave 2: Prompt Injection Firewall/i }));
    expect(screen.getByText(/PDF-TRAP/i)).toBeTruthy();
  });
});
