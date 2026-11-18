export type AxonPose =
  | 'welcome'
  | 'coding'
  | 'reading'
  | 'idea'
  | 'debug'
  | 'architecture'
  | 'building'
  | 'graduate'
  | 'question'
  | 'senior'
  | 'sleep'
  | 'celebrate';

export type CinemaAura = 'blue' | 'gold' | 'emerald' | 'violet';

export type SpeakerRole = 'host' | 'axon';

export type StageVisual =
  | {
      kind: 'finops-terminal';
      title: string;
      badge: string;
      lines: Array<{
        prompt?: string;
        text: string;
        tone?: 'cmd' | 'ok' | 'warn' | 'muted';
      }>;
    }
  | {
      kind: 'rag-acl';
      mode: 'leak' | 'shielded';
      identityLabel: string;
      claims: Array<{ key: string; value: string; valid: boolean }>;
      indexLabel: string;
      chunks: Array<{ id: string; text: string; note: string; blocked?: boolean }>;
    }
  | {
      kind: 'agent-lanes';
      mode: 'storm' | 'bounded';
      statusBadge: string;
      laneA: { name: string; steps: string[] };
      laneB: { name: string; steps: string[] };
    }
  | {
      kind: 'code-diff';
      file: string;
      before: string[];
      after: string[];
      callout: string;
    }
  | {
      kind: 'prompt-shield';
      mode: 'incident' | 'mitigated';
      nodes: Array<{
        label: string;
        sub: string;
        state?: 'normal' | 'hot' | 'ok';
      }>;
      metricLabel: string;
      metricBefore: string;
      metricAfter: string;
    };

export interface StudioAudioMeta {
  src: string;
  totalSec: number;
  cues: number[];
  speakers: SpeakerRole[];
}

export interface CinemaScene {
  chapter: string;
  title: string;
  speaker: SpeakerRole;
  mascot: AxonPose;
  aura: CinemaAura;
  speech: string;
  durationSec: number;
  visual: StageVisual;
}

export interface CinemaDeck {
  id: string;
  kicker: string;
  heading: string;
  ctaLabel?: string;
  ctaHref?: string;
  audio?: StudioAudioMeta;
  scenes: CinemaScene[];
}
