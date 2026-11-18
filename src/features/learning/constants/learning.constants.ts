import es from '../../../i18n/es.json';
import en from '../../../i18n/en.json';
import ja from '../../../i18n/ja.json';
import zh from '../../../i18n/zh.json';
import pt from '../../../i18n/pt.json';
import fr from '../../../i18n/fr.json';
import type { Locale, RouteTrack } from '../types/learning.types';

export const dictionaries: Record<Locale, Record<string, string>> = {
  es,
  en,
  ja,
  zh,
  pt,
  fr,
};

export const locales: { id: Locale; flag: string; label: string }[] = [
  { id: 'es', flag: '🇪🇸', label: 'Español' },
  { id: 'en', flag: '🇬🇧', label: 'English' },
  { id: 'ja', flag: '🇯🇵', label: '日本語' },
  { id: 'zh', flag: '🇨🇳', label: '中文' },
  { id: 'pt', flag: '🇧🇷', label: 'Português' },
  { id: 'fr', flag: '🇫🇷', label: 'Français' },
];

export const trackStyles: Record<RouteTrack, { icon: string; className: string }> = {
  basic: { icon: 'book', className: 'green' },
  intermediate: { icon: 'layers', className: 'blue' },
  advanced: { icon: 'rocket', className: 'orange' },
  senior: { icon: 'crown', className: 'gold' },
  frameworks: { icon: 'framework', className: 'purple' },
};

export const tracks: RouteTrack[] = ['basic', 'intermediate', 'advanced', 'senior'];
