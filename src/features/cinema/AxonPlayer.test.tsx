import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { AxonPlayer } from './AxonPlayer';
import { HOME_INTRO_DECK, LESSON_B01_DECK } from './data/storyboards';

afterEach(() => {
  cleanup();
});

describe('AxonPlayer (Single-Frame 16:9 Interactive Cinema + WebVTT A11y)', () => {
  it('renders minimalist poster in idle, transitions to playing, jumps chapters, toggles CC and seeks via keyboard', () => {
    const { container } = render(<AxonPlayer deck={HOME_INTRO_DECK} locale="es" />);

    // 1. Single-frame idle poster
    const posterBtn = screen.getByRole('button', {
      name: /Reproducir video: De un chat de juguete a Arquitectura de IA en Producción/i,
    });
    expect(posterBtn).toBeTruthy();
    expect(screen.getByText(/Audio Estudio HD · Sofía & Axon Senior/i)).toBeTruthy();

    // Verify native <track kind="captions"> is mounted
    const trackEl = container.querySelector('audio track[kind="captions"]');
    expect(trackEl).toBeTruthy();

    // 2. Click poster -> enters playing mode inside .cinema-screen
    fireEvent.click(posterBtn);
    expect(screen.getByRole('button', { name: 'Pausar video' })).toBeTruthy();
    expect(screen.getByText(/Sofía · Host/i)).toBeTruthy();

    // 3. Jump to Scene 2 via chapter pill
    fireEvent.click(screen.getByRole('button', { name: /Ir a 02 · Hybrid RAG \+ ACL/i }));
    expect(screen.getByText(/Axon · Mentor Senior/i)).toBeTruthy();
    expect(screen.getByText(/PostgreSQL \+ pgvector con Permisos Antes de Top-K/i)).toBeTruthy();

    // 4. Toggle CC button (aria-pressed)
    const ccBtn = screen.getByRole('button', { name: 'Ocultar subtítulos' });
    expect(ccBtn.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(ccBtn);
    expect(
      screen.getByRole('button', { name: 'Mostrar subtítulos' }).getAttribute('aria-pressed'),
    ).toBe('false');

    // 5. Keyboard ArrowRight seek on role="slider"
    const slider = screen.getByRole('slider', { name: 'Línea de tiempo del video' });
    const beforeNow = Number(slider.getAttribute('aria-valuenow') || '0');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    const afterNow = Number(slider.getAttribute('aria-valuenow') || '0');
    expect(afterNow).toBeGreaterThanOrEqual(beforeNow + 3);
  });

  it('supports compact lesson mode for B01 with code-diff board', () => {
    render(<AxonPlayer deck={LESSON_B01_DECK} locale="es" compact />);
    fireEvent.click(
      screen.getByRole('button', {
        name: /Reproducir video: Ventanas de Contexto y Reserva Determinista de Salida/i,
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Ir a 04 · Tu Código/i }));
    expect(screen.getByText('tokens-budget.ts')).toBeTruthy();
  });
});
