import type { CertificateTrackId } from '../engine/certificate';
import { SPECIALTY_WATERMARKS, VIGILIO_SIGNATURE_PATHS } from './specialtyWatermarks';

export function PixelCornerMarks() {
  return (
    <>
      <span class="cert-corner cert-corner-tl" aria-hidden="true" />
      <span class="cert-corner cert-corner-tr" aria-hidden="true" />
      <span class="cert-corner cert-corner-bl" aria-hidden="true" />
      <span class="cert-corner cert-corner-br" aria-hidden="true" />
    </>
  );
}

export function SealRosetteIcon() {
  const outerPoints: string[] = [];
  const innerPoints: string[] = [];
  for (let i = 0; i < 32; i += 1) {
    const angle = (i * Math.PI) / 16;
    const r = i % 2 === 0 ? 22 : 17.5;
    const x = 24 + r * Math.cos(angle);
    const y = 24 + r * Math.sin(angle);
    outerPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  for (let i = 0; i < 16; i += 1) {
    const angle = (i * Math.PI) / 8;
    const x = 24 + 13 * Math.cos(angle);
    const y = 24 + 13 * Math.sin(angle);
    innerPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <svg class="cert-rosette-svg" viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <polygon points={outerPoints.join(' ')} fill="var(--gold)" fill-opacity="0.92" />
      <polygon
        points={innerPoints.join(' ')}
        fill="var(--surface-canvas)"
        stroke="var(--gold)"
        stroke-width="1.2"
      />
      <path
        d="M18 24.5 L22 28.5 L30.5 19.5"
        fill="none"
        stroke="var(--gold)"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function SpecialtyWatermarkSvg({ trackId }: { trackId: CertificateTrackId }) {
  const spec = SPECIALTY_WATERMARKS[trackId];
  return (
    <div class="cert-specialty-watermark" aria-hidden="true">
      <svg viewBox={spec.viewBox} width="124" height="124" fill="none" aria-hidden="true">
        {spec.paths.map((item, idx) => (
          <path
            key={`${trackId}-${idx}`}
            d={item.d}
            fill={item.fill ? 'currentColor' : 'none'}
            stroke={item.fill ? 'none' : 'currentColor'}
            stroke-width={item.strokeWidth ?? 3}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}

export function VigilioSignatureSvg() {
  const sig = VIGILIO_SIGNATURE_PATHS;
  return (
    <div class="cert-signature-block">
      <svg
        class="cert-signature-svg"
        viewBox={sig.viewBox}
        width="180"
        height="48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={sig.mainStroke}
          stroke="var(--text-primary)"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx={sig.dotA[0]} cy={sig.dotA[1]} r="2.2" fill="var(--brand)" />
        <circle cx={sig.dotB[0]} cy={sig.dotB[1]} r="2.2" fill="var(--brand)" />
        <path
          d={sig.flourishStroke}
          stroke="var(--gold)"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <div class="cert-signature-name">Yonatan Vigilio · Dirección Académica</div>
      <div class="cert-signature-org">AIPIXEL ARCHITECTURE ACADEMY</div>
    </div>
  );
}

export function AntiCaptureWatermark() {
  return (
    <div class="cert-anti-capture" aria-hidden="true">
      <svg viewBox="0 0 460 170" width="460" height="170" aria-hidden="true">
        <g transform="translate(230 85) rotate(-16)">
          <rect
            x="-172"
            y="-30"
            width="344"
            height="60"
            rx="6"
            fill="none"
            stroke="var(--text-primary)"
            stroke-opacity="0.22"
            stroke-width="2"
            stroke-dasharray="8 6"
          />
          <text
            x="0"
            y="6"
            text-anchor="middle"
            font-family="var(--font-mono, monospace)"
            font-size="16"
            font-weight="700"
            letter-spacing="2.8"
            fill="var(--text-primary)"
            fill-opacity="0.14"
          >
            VISTA PREVIA · SIN VALIDEZ
          </text>
        </g>
      </svg>
    </div>
  );
}
