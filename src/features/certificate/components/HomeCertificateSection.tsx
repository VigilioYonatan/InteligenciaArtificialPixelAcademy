import { useState } from 'preact/hooks';
import { routeTo } from '../../../app/router';
import { Button, Icon } from '../../../shared/ui/primitives';
import { prefsSignal, updatePrefs } from '../../progress/model/progress.signal';
import type { Prefs } from '../../progress/types/progress.types';
import {
  CERTIFICATE_MAX_NAME_LENGTH,
  CERTIFICATE_TRACKS,
  type CertificateTrackId,
  computeCertificateStatus,
} from '../engine/certificate';
import { CertificatePreviewCard } from './CertificatePreviewCard';

interface HomeCertificateSectionProps {
  readonly prefsOverride?: Prefs;
  readonly onNavigate?: (href: string) => void;
}

export function HomeCertificateSection({ prefsOverride, onNavigate }: HomeCertificateSectionProps) {
  const prefs = prefsOverride ?? prefsSignal.value;
  const status = computeCertificateStatus(prefs);
  const [busyMode, setBusyMode] = useState<'download' | 'print' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleTrackSelect = (trackId: CertificateTrackId) => {
    setFeedback(null);
    updatePrefs({ certificateTrack: trackId });
  };

  const handleNameInput = (value: string) => {
    setFeedback(null);
    updatePrefs({ certificateName: value.slice(0, CERTIFICATE_MAX_NAME_LENGTH) });
  };

  const handleDownloadPdf = async () => {
    if (!status.isUnlocked || busyMode) return;
    setBusyMode('download');
    setFeedback(null);
    try {
      const mod = await import('../engine/pdfCertificateExporter');
      await mod.downloadCertificatePdf(status);
      setFeedback(`Descargado: certificado-aipixel-${status.track.id}.pdf`);
    } finally {
      setBusyMode(null);
    }
  };

  const handlePrintPdf = async () => {
    if (!status.isUnlocked || busyMode) return;
    setBusyMode('print');
    setFeedback(null);
    try {
      const mod = await import('../engine/pdfCertificateExporter');
      await mod.printCertificatePdf(status);
      setFeedback('Documento A4 horizontal preparado para impresión nativa.');
    } finally {
      setBusyMode(null);
    }
  };

  const navigate = (href: string) => {
    if (onNavigate) onNavigate(href);
    else routeTo(href);
  };

  return (
    <section class="cert-section" aria-labelledby="cert-section-title">
      <div class="cert-controls-col">
        <span class="cert-eyebrow">RECONOCIMIENTO ACADÉMICO · {status.track.hours}H</span>
        <h2 id="cert-section-title">
          Termina el curso y <span class="cert-title-accent">obtén tu certificado.</span>
        </h2>
        <p class="cert-subtitle">
          Completa el 100% de la ruta <strong>{status.track.title}</strong> ({status.totalUnits}{' '}
          {status.track.unitLabel} y {status.totalLabs} {status.track.labLabel}) para desbloquear y
          descargar tu certificado en <strong>PDF A4 horizontal</strong> con folio verificable.
        </p>

        <fieldset class="cert-track-tabs" aria-label="Especialidad del certificado">
          {CERTIFICATE_TRACKS.map((item) => {
            const active = item.id === status.track.id;
            return (
              <button
                key={item.id}
                type="button"
                class={`cert-track-tab${active ? ' active' : ''}`}
                aria-pressed={active}
                onClick={() => handleTrackSelect(item.id)}
              >
                <span class="cert-tab-code">{item.code}</span>
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </fieldset>

        <div class="cert-control-panel">
          <label class="cert-field-label" htmlFor="certificate-name-input">
            Nombre que aparecerá en tu certificado (vista previa en vivo)
          </label>
          <input
            id="certificate-name-input"
            type="text"
            class="cert-name-input"
            maxLength={CERTIFICATE_MAX_NAME_LENGTH}
            value={status.rawName}
            placeholder="John Doe"
            autoComplete="name"
            onInput={(e) => handleNameInput(e.currentTarget.value)}
          />

          <div class="cert-progress-row">
            <span>Avance en {status.track.shortLabel}</span>
            <strong>
              {status.completedTotal} / {status.grandTotal} actividades ({status.percent}%)
            </strong>
          </div>
          <div
            class="cert-progress-track"
            role="progressbar"
            aria-label={`Progreso de certificación en ${status.track.shortLabel}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={status.percent}
          >
            <div class="cert-progress-fill" style={{ width: `${status.percent}%` }} />
          </div>

          <div class="cert-actions">
            <Button
              kind={status.isUnlocked ? 'senior' : 'primary'}
              disabled={!status.isUnlocked || busyMode !== null}
              onClick={handleDownloadPdf}
            >
              <Icon name={status.isUnlocked ? 'check' : 'shield'} size={15} />
              <span>
                {status.isUnlocked
                  ? busyMode === 'download'
                    ? 'Generando PDF...'
                    : 'Descargar certificado PDF'
                  : `Descargar PDF (Requiere 100% · llevas ${status.percent}%)`}
              </span>
            </Button>

            {status.isUnlocked && (
              <Button kind="outline" disabled={busyMode !== null} onClick={handlePrintPdf}>
                <Icon name="check" size={15} />
                <span>{busyMode === 'print' ? 'Preparando...' : 'Imprimir PDF'}</span>
              </Button>
            )}

            <Button kind="outline" onClick={() => navigate(status.track.nextHref)}>
              <span>Continuar curso →</span>
            </Button>
          </div>

          <p class="cert-helper-note">
            {status.isUnlocked ? (
              <>
                Certificado oficial desbloqueado para <strong>{status.holderName}</strong>.
                Exportación nativa A4 horizontal sin librerías externas.
              </>
            ) : (
              <>
                Así se verá tu diploma (ejemplo: <strong>{status.holderName}</strong>). Al llegar al{' '}
                <strong>100%</strong> se habilita la descarga e impresión en PDF.
              </>
            )}
          </p>
          {feedback && <output class="cert-feedback">{feedback}</output>}
        </div>
      </div>

      <div class="cert-preview-col">
        <CertificatePreviewCard status={status} />
      </div>
    </section>
  );
}
