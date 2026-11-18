export type Locale = 'es' | 'en' | 'ja' | 'zh' | 'pt' | 'fr';

export type Theme = 'dark' | 'light';

export type RouteTrack = 'basic' | 'intermediate' | 'advanced' | 'senior' | 'frameworks';

export type Localized = Record<Locale, string>;

export type Module = {
  id: string;
  slug: string;
  track: RouteTrack;
  title: Localized;
  summary: Localized;
  status: string;
  tools?: string[];
  challenge?: {
    kind: string;
    scenario: Localized;
    criteria: string[];
  };
};
