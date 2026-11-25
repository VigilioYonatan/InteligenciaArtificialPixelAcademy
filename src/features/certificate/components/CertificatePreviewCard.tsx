import type { CertificateStatus } from '../engine/certificate';
import {
  AntiCaptureWatermark,
  PixelCornerMarks,
  SealRosetteIcon,
  SpecialtyWatermarkSvg,
  VigilioSignatureSvg,
} from './CertificateCardParts';

interface CertificatePreviewCardProps {
  readonly status: CertificateStatus;
}

export function CertificatePreviewCard({ status }: CertificatePreviewCardProps) {
  const { track } = status;

  return (
    <article
      class={`cert-diploma-card${status.isUnlocked ? ' is-unlocked' : ' is-preview'}`}
      data-cert-unlocked={String(status.isUnlocked)}
      data-cert-track={track.id}
      aria-label={`Vista previa del certificado para ${status.holderName}`}
      onContextMenu={!status.isUnlocked ? (e) => e.preventDefault() : undefined}
    >
      <div class="cert-diploma-inner">
        <PixelCornerMarks />
        <SpecialtyWatermarkSvg trackId={track.id} />
        {!status.isUnlocked && <AntiCaptureWatermark />}

        <header class="cert-diploma-top">
          <div class="cert-brand-lockup">
            <span class="cert-brand-badge" aria-hidden="true">
              AI
            </span>
            <div>
              <div class="cert-brand-title">AIPIXEL ARCHITECTURE</div>
              <div class="cert-brand-sub">ACADEMY · RAG · AGENTS · FINOPS</div>
            </div>
          </div>
          <div class="cert-top-pills">
            <span class="cert-track-pill">{track.code}</span>
            <span class={`cert-status-pill${status.isUnlocked ? ' is-verified' : ''}`}>
              {status.badgeText}
            </span>
          </div>
        </header>

        <div class="cert-diploma-body">
          <p class="cert-kicker">
            CERTIFICADO DE FINALIZACIÓN PROFESIONAL · {track.code}
          </p>
          <p class="cert-lead">Se otorga la presente acreditación académica a</p>
          <p
            class={`cert-holder-name${status.isPlaceholderName ? ' is-placeholder' : ''}`}
            data-testid="cert-holder-name"
          >
            {status.holderName}
          </p>
          <p class="cert-accreditation">
            Por completar satisfactoriamente el 100% de la ruta{' '}
            <strong>{track.title}</strong>. {track.summary}
          </p>
        </div>

        <footer class="cert-diploma-footer">
          <div class="cert-metrics">
            <div class="cert-metric-box">
              <strong>{track.hours}</strong>
              <span>HORAS</span>
            </div>
            <div class="cert-metric-box">
              <strong>{status.totalUnits}</strong>
              <span>{track.unitLabel.toUpperCase()}</span>
            </div>
            <div class="cert-metric-box">
              <strong>{status.totalLabs}</strong>
              <span>{track.labLabel.toUpperCase()}</span>
            </div>
          </div>

          <div class="cert-folio-wrap">
            <SealRosetteIcon />
            <div>
              <div class="cert-folio-code" data-testid="cert-folio">
                FOLIO {status.folio}
              </div>
              <div class="cert-folio-date">EMISIÓN {status.issuedDate}</div>
            </div>
          </div>

          <VigilioSignatureSvg />
        </footer>
      </div>
    </article>
  );
}
