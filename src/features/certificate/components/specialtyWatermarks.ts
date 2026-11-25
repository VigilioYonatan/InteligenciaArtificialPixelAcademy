import type { CertificateTrackId } from '../engine/certificate';

export interface VectorPathSpec {
  readonly d: string;
  readonly fill?: boolean;
  readonly strokeWidth?: number;
  readonly role?: 'primary' | 'accent' | 'gold' | 'soft';
}

export interface SpecialtyWatermarkSpec {
  readonly viewBox: string;
  readonly width: number;
  readonly height: number;
  readonly paths: readonly VectorPathSpec[];
}

export const SPECIALTY_WATERMARKS: Readonly<Record<CertificateTrackId, SpecialtyWatermarkSpec>> = {
  ai: {
    viewBox: '0 0 120 120',
    width: 120,
    height: 120,
    paths: [
      {
        d: 'M60 12 L102 36 L102 84 L60 108 L18 84 L18 36 Z',
        strokeWidth: 4.2,
        role: 'primary',
      },
      {
        d: 'M60 28 L88 44 L88 76 L60 92 L32 76 L32 44 Z',
        strokeWidth: 2.6,
        role: 'accent',
      },
      {
        d: 'M60 40 L76 74 L68 74 L64 65 L56 65 L52 74 L44 74 Z M60 50 L57.5 58 L62.5 58 Z',
        fill: true,
        role: 'gold',
      },
    ],
  },
  core: {
    viewBox: '0 0 120 120',
    width: 120,
    height: 120,
    paths: [
      {
        d: 'M42 26 C30 26 28 36 28 48 C28 56 22 60 16 60 C22 60 28 64 28 72 C28 84 30 94 42 94',
        strokeWidth: 5,
        role: 'primary',
      },
      {
        d: 'M78 26 C90 26 92 36 92 48 C92 56 98 60 104 60 C98 60 92 64 92 72 C92 84 90 94 78 94',
        strokeWidth: 5,
        role: 'primary',
      },
      {
        d: 'M48 48 H72 V72 H48 Z M54 55 H66 M54 62 H63',
        strokeWidth: 3.5,
        role: 'gold',
      },
    ],
  },
  rag: {
    viewBox: '0 0 120 120',
    width: 120,
    height: 120,
    paths: [
      {
        d: 'M24 30 C24 20 96 20 96 30 C96 40 24 40 24 30 Z M24 30 V84 C24 94 96 94 96 84 V30',
        strokeWidth: 4.2,
        role: 'primary',
      },
      {
        d: 'M24 50 C24 60 96 60 96 50 M24 68 C24 78 96 78 96 68',
        strokeWidth: 3.2,
        role: 'accent',
      },
      {
        d: 'M78 78 A12 12 0 1 0 78 54 A12 12 0 1 0 78 78 M86 74 L98 86',
        strokeWidth: 4,
        role: 'gold',
      },
    ],
  },
  agents: {
    viewBox: '0 0 120 120',
    width: 120,
    height: 120,
    paths: [
      {
        d: 'M60 22 A9 9 0 1 0 59.9 22 Z M30 82 A9 9 0 1 0 29.9 82 Z M90 82 A9 9 0 1 0 89.9 82 Z',
        fill: true,
        role: 'primary',
      },
      {
        d: 'M60 32 L34 74 M60 32 L86 74 M40 82 H80 M60 12 V22 M60 90 V102',
        strokeWidth: 4,
        role: 'accent',
      },
      {
        d: 'M46 52 H74 V66 H46 Z',
        strokeWidth: 3.2,
        role: 'gold',
      },
    ],
  },
  llmops: {
    viewBox: '0 0 120 120',
    width: 120,
    height: 120,
    paths: [
      {
        d: 'M60 14 L96 28 V58 C96 80 78 96 60 104 C42 96 24 80 24 58 V28 Z',
        strokeWidth: 4.5,
        role: 'primary',
      },
      {
        d: 'M36 62 H48 L54 46 L64 76 L71 56 L77 62 H86',
        strokeWidth: 4,
        role: 'gold',
      },
    ],
  },
};

export interface SignaturePathsSpec {
  readonly viewBox: string;
  readonly mainStroke: string;
  readonly dotA: readonly [number, number];
  readonly dotB: readonly [number, number];
  readonly flourishStroke: string;
}

export const VIGILIO_SIGNATURE_PATHS: SignaturePathsSpec = {
  viewBox: '0 0 260 72',
  mainStroke:
    'M18 18 C24 44 30 56 36 58 C42 58 50 32 62 12 ' +
    'C59 29 56 46 60 50 C64 52 69 40 74 34 ' +
    'C74 44 77 52 84 48 C90 44 92 34 86 33 C79 33 77 45 83 56 C86 64 81 69 75 64 ' +
    'C84 54 96 42 103 34 C103 44 106 50 112 46 ' +
    'C118 40 124 22 127 12 C123 28 122 48 129 49 C136 49 142 38 147 34 ' +
    'C147 44 150 50 156 46 ' +
    'C162 41 168 35 174 37 C180 40 179 49 172 50 C165 50 162 42 167 37 C174 34 185 38 196 36',
  dotA: [64, 22],
  dotB: [106, 22],
  flourishStroke: 'M24 62 C88 54 164 52 242 58',
};
