export const PDF_A4_LANDSCAPE_WIDTH = 841.89;
export const PDF_A4_LANDSCAPE_HEIGHT = 595.28;

export function buildPdfFromJpeg(
  jpegBytes: Uint8Array,
  imageWidth: number,
  imageHeight: number,
): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  const pushBytes = (bytes: Uint8Array): void => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const pushText = (text: string): void => {
    pushBytes(encoder.encode(text));
  };

  const beginObject = (index: number): void => {
    offsets[index] = byteLength;
    pushText(`${index} 0 obj\n`);
  };

  pushBytes(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  beginObject(1);
  pushText('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  beginObject(2);
  pushText('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  beginObject(3);
  pushText(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_A4_LANDSCAPE_WIDTH.toFixed(2)} ${PDF_A4_LANDSCAPE_HEIGHT.toFixed(2)}] ` +
      '/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
  );

  beginObject(4);
  pushText(
    `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
  );
  pushBytes(jpegBytes);
  pushText('\nendstream\nendobj\n');

  const contentStream = `q\n${PDF_A4_LANDSCAPE_WIDTH.toFixed(2)} 0 0 ${PDF_A4_LANDSCAPE_HEIGHT.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
  beginObject(5);
  pushText(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`);

  const xrefOffset = byteLength;
  pushText('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i += 1) {
    pushText(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }
  pushText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const output = new Uint8Array(byteLength);
  let cursor = 0;
  for (const chunk of chunks) {
    output.set(chunk, cursor);
    cursor += chunk.length;
  }
  return output;
}
