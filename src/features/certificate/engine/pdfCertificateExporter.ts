import type { CertificateStatus } from './certificate';
import { buildPdfFromJpeg } from './pdfBinaryWriter';
import {
  CERT_CANVAS_HEIGHT,
  CERT_CANVAS_WIDTH,
  renderCertificateCanvas,
} from './pdfCanvasArtwork';

async function canvasToJpegBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.95);
  });
  if (blob) {
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
  }
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const base64 = dataUrl.split(',')[1] || '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function generateCertificatePdfBytes(status: CertificateStatus): Promise<Uint8Array | null> {
  if (!status.isUnlocked) return null;
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  const canvas = renderCertificateCanvas(status);
  const jpegBytes = await canvasToJpegBytes(canvas);
  return buildPdfFromJpeg(jpegBytes, CERT_CANVAS_WIDTH, CERT_CANVAS_HEIGHT);
}

export async function downloadCertificatePdf(status: CertificateStatus): Promise<boolean | null> {
  if (!status.isUnlocked) return null;
  const pdfBytes = await generateCertificatePdfBytes(status);
  if (!pdfBytes) return null;
  const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfBuffer).set(pdfBytes);
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `certificado-aipixel-${status.track.id}.pdf`;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  return true;
}

export async function printCertificatePdf(status: CertificateStatus): Promise<boolean | null> {
  if (!status.isUnlocked) return null;
  const pdfBytes = await generateCertificatePdfBytes(status);
  if (!pdfBytes) return null;
  const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfBuffer).set(pdfBytes);
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '1px';
  iframe.style.height = '1px';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.title = 'Imprimir certificado PDF';
  iframe.src = url;
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      window.setTimeout(() => {
        iframe.remove();
        URL.revokeObjectURL(url);
      }, 4000);
    }
  };
  document.body.appendChild(iframe);
  return true;
}
