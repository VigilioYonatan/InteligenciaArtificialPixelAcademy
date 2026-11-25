import type { Prefs } from '../types/progress.types';

export const STORAGE_SCHEMA_VERSION = 3;
export const STORAGE_KEY = 'aipixel:v1';
export const LEGACY_STORAGE_KEY_V2 = 'gopixel:v2';
export const LEGACY_STORAGE_KEY_V1 = 'gopixel:v1';
export const LEGACY_AI_STORAGE_KEY = 'vigilio:ai-academy:senior:v1';

export const MAX_BACKUP_BYTES = 1024 * 1024;
export const MAX_XP = 100000;
export const MAX_STRING_MAP_ENTRIES = 150;
export const MAX_STRING_ENTRY_LENGTH = 30000;
export const XP_PER_AI_LESSON = 20;
export const XP_PER_GO_LESSON = XP_PER_AI_LESSON;
export const XP_PER_GAME_WIN = 15;
export const XP_PER_AI_SENIOR = 25;

export const initialPrefs: Prefs = {
  theme: 'dark',
  locale: 'es',
  seniorEnabled: false,
  reducedMotion: false,
  fontSize: 'md',
  completed: [],
  xp: 0,
  notes: {},
  drafts: {},
  gameWins: [],
  seniorResults: {},
  evidenceResults: {},
  investigationResults: {},
  operationsResults: {},
  reviewResults: {},
  aiSeniorResults: {},
  aiDecisionResults: {},
  aiEvidenceResults: {},
  aiReviewResults: {},
  aiOperationsResults: {},
  certificateName: '',
  certificateTrack: 'core',
};
