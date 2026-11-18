import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { AIAcademy } from './AIAcademy';
import lessons from './lessons.json';

afterEach(() => {
  cleanup();
});

describe('AIAcademy component integration', () => {
  it('renders localized dashboard in English and filters modules by level', () => {
    render(<AIAcademy locale="en" />);
    expect(screen.getByRole('heading', { name: 'AI Engineering Academy' })).toBeTruthy();
    expect(screen.getByText('Full Path · 18 Interactive Modules')).toBeTruthy();

    const genAiBtn = screen.getByRole('button', { name: 'Generative AI & RAG' });
    fireEvent.click(genAiBtn);
    expect(screen.getAllByText(/Verifiable RAG/).length).toBe(2);
    expect(screen.queryByText(/Python & Algorithmic Thinking/)).toBeNull();
  });

  it('validates AI01 lesson code deterministically in UI', () => {
    render(<AIAcademy activeId="learn" subId="AI01" locale="es" />);
    const checkBtn = screen.getByRole('button', { name: /Validar invariantes/i });
    fireEvent.click(checkBtn);
    expect(screen.getByText(/Revisa los requisitos pendientes/i)).toBeTruthy();

    const editor = screen.getByRole('textbox', { name: 'AI01' });
    const ai01 = lessons.find((l) => l.id === 'AI01');
    fireEvent.input(editor, { target: { value: ai01?.solutionCode || '' } });
    fireEvent.click(checkBtn);
    expect(screen.getByText(/Todas las invariantes técnicas se cumplen/i)).toBeTruthy();
  });

  it('rejects spam justification on SAI01 and passes with valid decision + rationale', () => {
    render(<AIAcademy activeId="senior" subId="SAI01" locale="es" />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);

    const textarea = screen.getByLabelText(/Justificación técnica/i);
    fireEvent.input(textarea, { target: { value: 'a'.repeat(80) } });
    fireEvent.click(screen.getByRole('button', { name: /Evaluar decisión/i }));
    expect(screen.getByText(/70\/100/)).toBeTruthy();

    fireEvent.input(textarea, {
      target: {
        value: 'Validar esquema Pydantic en sandbox sin secretos ni red evita RCE por pickle.',
      },
    });
    fireEvent.click(screen.getByRole('button', { name: /Evaluar decisión/i }));
    expect(screen.getByText(/100\/100/)).toBeTruthy();
  });
});
