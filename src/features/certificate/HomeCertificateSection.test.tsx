import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { initialPrefs } from '../progress/constants/progress.constants';
import { HomeCertificateSection } from './components/HomeCertificateSection';
import { buildPdfFromJpeg } from './engine/pdfBinaryWriter';
import {
  downloadCertificatePdf,
  generateCertificatePdfBytes,
  printCertificatePdf,
} from './engine/pdfCertificateExporter';
import { computeCertificateStatus } from './engine/certificate';

afterEach(() => cleanup());

describe('HomeCertificateSection (Dynamic Executive PDF Certificate)', () => {
  it('renders John Doe fallback, single anti-capture seal, zero <pattern>, and disabled PDF at <100%', () => {
    const { container } = render(<HomeCertificateSection prefsOverride={initialPrefs} />);

    expect(screen.getByTestId('cert-holder-name').textContent).toBe('John Doe');
    expect(screen.getByTestId('cert-folio').textContent).toContain('PREVIEW-CORE-0240');
    expect(container.querySelectorAll('.cert-anti-capture').length).toBe(1);
    expect(container.querySelectorAll('pattern').length).toBe(0);

    const downloadBtn = screen.getByRole('button', { name: /Descargar PDF/i }) as HTMLButtonElement;
    expect(downloadBtn.disabled).toBe(true);

    const decorativeSvgs = container.querySelectorAll('.cert-diploma-card svg');
    expect(decorativeSvgs.length).toBeGreaterThanOrEqual(4);
    for (const svg of decorativeSvgs) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('updates live name and route watermark reactively while guarding PDF generation below 100%', async () => {
    const customPrefs = {
      ...initialPrefs,
      certificateTrack: 'rag',
      certificateName: 'Ada Lovelace',
    };
    const { container } = render(<HomeCertificateSection prefsOverride={customPrefs} />);

    expect(screen.getByTestId('cert-holder-name').textContent).toBe('Ada Lovelace');
    expect(screen.getByTestId('cert-folio').textContent).toContain('PREVIEW-RAG-0240');
    expect(container.querySelector('.cert-diploma-card')?.getAttribute('data-cert-track')).toBe('rag');

    const input = screen.getByLabelText(/Nombre que aparecerá/i) as HTMLInputElement;
    expect(input.value).toBe('Ada Lovelace');
    fireEvent.input(input, { target: { value: 'Grace Hopper' } });

    const lockedStatus = computeCertificateStatus(customPrefs);
    expect(await generateCertificatePdfBytes(lockedStatus)).toBeNull();
    expect(await downloadCertificatePdf(lockedStatus)).toBeNull();
    expect(await printCertificatePdf(lockedStatus)).toBeNull();
  });

  it('unlocks at 100%, removes anti-capture, enables PDF + Print, and writes valid %PDF-1.4 bytes', () => {
    const coreCompleted = [
      ...Array.from({ length: 12 }, (_, i) => `B${String(i + 1).padStart(2, '0')}`),
      ...Array.from({ length: 12 }, (_, i) => `I${String(i + 1).padStart(2, '0')}`),
    ];
    const unlockedPrefs = {
      ...initialPrefs,
      certificateTrack: 'core',
      certificateName: 'Yonatan Vigilio',
      completed: coreCompleted,
      updatedAt: '2026-11-25T10:00:00.000Z',
    };

    const { container } = render(<HomeCertificateSection prefsOverride={unlockedPrefs} />);

    expect(container.querySelectorAll('.cert-anti-capture').length).toBe(0);
    expect(screen.getByText('VERIFICADO 100%')).toBeTruthy();
    expect(screen.getByTestId('cert-folio').textContent).toMatch(/^FOLIO CEA-CORE-[0-9A-F]{4}-[0-9A-F]{4}$/);

    const downloadBtn = screen.getByRole('button', { name: /Descargar certificado PDF/i }) as HTMLButtonElement;
    const printBtn = screen.getByRole('button', { name: /Imprimir PDF/i }) as HTMLButtonElement;
    expect(downloadBtn.disabled).toBe(false);
    expect(printBtn.disabled).toBe(false);

    const fakeJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0xff, 0xd9]);
    const pdfBytes = buildPdfFromJpeg(fakeJpeg, 2200, 1555);
    const pdfHeader = new TextDecoder().decode(pdfBytes.slice(0, 8));
    const pdfText = new TextDecoder('latin1').decode(pdfBytes);

    expect(pdfHeader).toBe('%PDF-1.4');
    expect(pdfText).toContain('/MediaBox [0 0 841.89 595.28]');
    expect(pdfText).toContain('/Filter /DCTDecode');
    expect(pdfText).toContain('xref');
    expect(pdfText.endsWith('%%EOF\n')).toBe(true);
  });
});
