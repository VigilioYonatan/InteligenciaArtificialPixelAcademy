import type { CinemaDeck, CinemaScene, SpeakerRole, StudioAudioMeta } from '../types/cinema.types';
import rawManifest from './audio-manifest.json';
import rawBatch1Scripts from './batch1-scripts.json';
import rawBatch2Scripts from './batch2-scripts.json';
import rawBatch3Scripts from './batch3-scripts.json';

type RawManifestMap = Record<
  string,
  {
    src: string;
    totalSec: number;
    cues: number[];
    speakers: string[];
  }
>;

interface RawDeckSpec {
  id: string;
  aliases?: string[];
  kicker: string;
  heading: string;
  ctaLabel?: string;
  ctaHref?: string;
  scenes: CinemaScene[];
}

const manifest = rawManifest as RawManifestMap;
const scriptSpecs = [
  ...(rawBatch1Scripts as RawDeckSpec[]),
  ...(rawBatch2Scripts as RawDeckSpec[]),
  ...(rawBatch3Scripts as RawDeckSpec[]),
];

function studioAudio(id: string): StudioAudioMeta | undefined {
  const item = manifest[id];
  if (!item) return undefined;
  return {
    src: item.src,
    totalSec: item.totalSec,
    cues: item.cues,
    speakers: item.speakers as SpeakerRole[],
  };
}

export const STUDIO_DECKS: Record<string, CinemaDeck> = {};

for (const spec of scriptSpecs) {
  const deck: CinemaDeck = {
    id: spec.id,
    kicker: spec.kicker,
    heading: spec.heading,
    ctaLabel: spec.ctaLabel,
    ctaHref: spec.ctaHref,
    audio: studioAudio(spec.id),
    scenes: spec.scenes,
  };
  STUDIO_DECKS[spec.id] = deck;
  for (const alias of spec.aliases ?? []) {
    STUDIO_DECKS[alias] = deck;
  }
}

export const HOME_INTRO_DECK = STUDIO_DECKS['home-intro'];
export const SENIOR_OVERVIEW_DECK = STUDIO_DECKS['senior-overview'];
export const ARENA3D_INTRO_DECK = STUDIO_DECKS['arena3d-intro'];
export const LESSON_B01_DECK = STUDIO_DECKS.b01;

export function getCinemaDeck(key: string): CinemaDeck | undefined {
  return STUDIO_DECKS[key] ?? STUDIO_DECKS[key.toLowerCase()];
}
