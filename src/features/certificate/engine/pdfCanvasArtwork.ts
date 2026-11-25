import type { CertificateStatus } from './certificate';
import { SPECIALTY_WATERMARKS, VIGILIO_SIGNATURE_PATHS } from '../components/specialtyWatermarks';

export const CERT_CANVAS_WIDTH = 2200;
export const CERT_CANVAS_HEIGHT = 1555;

interface ThemeTokens {
  readonly bgCanvas: string;
  readonly bgSurface: string;
  readonly bgRaised: string;
  readonly border: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly brand: string;
  readonly gold: string;
  readonly green: string;
}

function readLiveThemeTokens(): ThemeTokens {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  return {
    bgCanvas: read('--surface-canvas', '#050810'),
    bgSurface: read('--surface-default', '#0a0a0a'),
    bgRaised: read('--surface-raised', '#111622'),
    border: read('--border-subtle', '#263042'),
    textPrimary: read('--text-primary', '#ededed'),
    textSecondary: read('--text-secondary', '#b8c3d4'),
    textMuted: read('--text-muted', '#8894a8'),
    brand: read('--brand-accent', '#52a8ff'),
    gold: read('--gold', '#f5a623'),
    green: read('--green', '#45d483'),
  };
}

function roundBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill?: string,
  stroke?: string,
  lw = 2,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = 'left',
): void {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function drawCorners(ctx: CanvasRenderingContext2D, color: string): void {
  const pad = 42;
  const arm = 48;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  for (const [cx, cy, dx, dy] of [
    [pad, pad, 1, 1],
    [CERT_CANVAS_WIDTH - pad, pad, -1, 1],
    [pad, CERT_CANVAS_HEIGHT - pad, 1, -1],
    [CERT_CANVAS_WIDTH - pad, CERT_CANVAS_HEIGHT - pad, -1, -1],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * arm);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * arm, cy);
    ctx.stroke();
  }
}

function drawWatermark(ctx: CanvasRenderingContext2D, status: CertificateStatus, color: string): void {
  if (typeof Path2D === 'undefined') return;
  ctx.save();
  ctx.translate(150, CERT_CANVAS_HEIGHT / 2 - 220);
  ctx.scale(2.8, 2.8);
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const item of SPECIALTY_WATERMARKS[status.track.id].paths) {
    const p = new Path2D(item.d);
    if (item.fill) ctx.fill(p);
    else {
      ctx.lineWidth = item.strokeWidth ?? 3;
      ctx.stroke(p);
    }
  }
  ctx.restore();
}

function drawRosette(ctx: CanvasRenderingContext2D, cx: number, cy: number, tokens: ThemeTokens): void {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 32; i += 1) {
    const angle = (i * Math.PI) / 16;
    const r = i % 2 === 0 ? 54 : 43;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = tokens.gold;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fillStyle = tokens.bgCanvas;
  ctx.fill();
  ctx.strokeStyle = tokens.gold;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy + 1);
  ctx.lineTo(cx - 4, cy + 11);
  ctx.lineTo(cx + 16, cy - 10);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
}

function drawSignature(ctx: CanvasRenderingContext2D, tokens: ThemeTokens): void {
  if (typeof Path2D === 'undefined') return;
  const sig = VIGILIO_SIGNATURE_PATHS;
  ctx.save();
  ctx.translate(1540, 1210);
  ctx.scale(2.05, 2.05);
  ctx.strokeStyle = tokens.textPrimary;
  ctx.lineWidth = 2.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(sig.mainStroke));
  ctx.fillStyle = tokens.brand;
  for (const [dx, dy] of [sig.dotA, sig.dotB]) {
    ctx.beginPath();
    ctx.arc(dx, dy, 2.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = tokens.gold;
  ctx.lineWidth = 2.1;
  ctx.stroke(new Path2D(sig.flourishStroke));
  ctx.restore();
}

export function renderCertificateCanvas(status: CertificateStatus): HTMLCanvasElement {
  const tokens = readLiveThemeTokens();
  const canvas = document.createElement('canvas');
  canvas.width = CERT_CANVAS_WIDTH;
  canvas.height = CERT_CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = tokens.bgCanvas;
  ctx.fillRect(0, 0, CERT_CANVAS_WIDTH, CERT_CANVAS_HEIGHT);

  roundBox(ctx, 58, 58, CERT_CANVAS_WIDTH - 116, CERT_CANVAS_HEIGHT - 116, 18, tokens.bgSurface, tokens.gold, 4);
  roundBox(ctx, 84, 84, CERT_CANVAS_WIDTH - 168, CERT_CANVAS_HEIGHT - 168, 10, undefined, tokens.border, 2);
  drawCorners(ctx, tokens.gold);
  drawWatermark(ctx, status, tokens.textPrimary);

  roundBox(ctx, 134, 134, 92, 92, 16, tokens.brand);
  drawText(ctx, 'AI', 158, 194, '700 42px "Space Grotesk", "DM Sans", sans-serif', tokens.bgCanvas);
  drawText(ctx, 'AIPIXEL ARCHITECTURE', 252, 174, '700 28px "JetBrains Mono", monospace', tokens.gold);
  drawText(ctx, 'ACADEMY · RAG · AGENTS · FINOPS', 252, 212, '500 22px "JetBrains Mono", monospace', tokens.textMuted);

  roundBox(ctx, 1730, 146, 336, 62, 31, tokens.bgRaised, tokens.green, 2.5);
  drawText(ctx, `VERIFICADO 100% · ${status.track.code}`, 1898, 185, '700 22px "JetBrains Mono", monospace', tokens.green, 'center');

  const cx = CERT_CANVAS_WIDTH / 2;
  drawText(ctx, `CERTIFICADO DE FINALIZACIÓN PROFESIONAL · ${status.track.code}`, cx, 390, '700 26px "JetBrains Mono", monospace', tokens.gold, 'center');
  drawText(ctx, 'Se otorga la presente acreditación académica a', cx, 468, '400 34px "DM Sans", sans-serif', tokens.textSecondary, 'center');

  let fontSize = 104;
  ctx.font = `700 ${fontSize}px "Space Grotesk", "DM Sans", sans-serif`;
  while (fontSize > 58 && ctx.measureText(status.holderName).width > 1680) {
    fontSize -= 4;
    ctx.font = `700 ${fontSize}px "Space Grotesk", "DM Sans", sans-serif`;
  }
  drawText(ctx, status.holderName, cx, 610, ctx.font, tokens.textPrimary, 'center');

  ctx.strokeStyle = tokens.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(460, 668);
  ctx.lineTo(1740, 668);
  ctx.stroke();

  drawText(ctx, `Por completar satisfactoriamente el 100% de la ruta ${status.track.title},`, cx, 760, '400 32px "DM Sans", sans-serif', tokens.textSecondary, 'center');
  drawText(ctx, status.track.summary.slice(0, 86), cx, 814, '400 28px "DM Sans", sans-serif', tokens.textSecondary, 'center');

  const metrics: readonly [string, string][] = [
    [`${status.track.hours}`, 'HORAS'],
    [`${status.totalUnits}`, status.track.unitLabel.toUpperCase()],
    [`${status.totalLabs}`, status.track.labLabel.toUpperCase()],
  ];
  metrics.forEach(([val, lbl], idx) => {
    const mx = 148 + idx * 176;
    roundBox(ctx, mx, 1218, 152, 134, 14, tokens.bgRaised, tokens.border, 2);
    drawText(ctx, val, mx + 76, 1280, '700 42px "JetBrains Mono", monospace', tokens.gold, 'center');
    drawText(ctx, lbl, mx + 76, 1322, '600 18px "JetBrains Mono", monospace', tokens.textMuted, 'center');
  });

  drawRosette(ctx, 880, 1285, tokens);
  drawText(ctx, `FOLIO ${status.folio}`, 960, 1274, '700 24px "JetBrains Mono", monospace', tokens.textPrimary);
  drawText(ctx, `EMISIÓN ${status.issuedDate}`, 960, 1312, '500 20px "JetBrains Mono", monospace', tokens.textMuted);

  drawSignature(ctx, tokens);
  drawText(ctx, 'Yonatan Vigilio · Dirección Académica', 1805, 1372, '700 24px "DM Sans", sans-serif', tokens.textPrimary, 'center');
  drawText(ctx, 'AIPIXEL ARCHITECTURE ACADEMY', 1805, 1404, '600 18px "JetBrains Mono", monospace', tokens.textMuted, 'center');
  return canvas;
}
