import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clearPersistedPrefs,
  loadPrefs,
  parseBackupPayload,
  sanitizePrefs,
  serializeBackupPayload,
} from '../src/features/progress/persistence/progress.repository.ts';

function createMemoryStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => {
      store.set(k, String(v));
    },
    removeItem: (k) => {
      store.delete(k);
    },
    has: (k) => store.has(k),
  };
}

test('BDD: sanitizePrefs rejects prototype pollution, oversized strings and forged AI scores', () => {
  const dirty = {
    theme: 'light',
    locale: 'ja',
    xp: 9999999,
    notes: {
      __proto__: 'evil',
      S01: 'ok',
    },
    aiSeniorResults: {
      SAI01: { version: 1, passed: true, score: 100 },
      SAI02: { version: 1, passed: true, score: 70 },
      __proto__: { version: 1, passed: true, score: 100 },
    },
  };
  const clean = sanitizePrefs(dirty);
  assert.equal(clean.theme, 'light');
  assert.equal(clean.locale, 'ja');
  assert.equal(clean.xp, 100000);
  assert.deepEqual(Object.keys(clean.notes), ['S01']);
  assert.deepEqual(Object.keys(clean.aiSeniorResults), ['SAI01']);
});

test('BDD: loadPrefs migrates legacy gopixel:v2 into canonical aipixel:v1 without data loss', () => {
  const prevStorage = globalThis.localStorage;
  const mem = createMemoryStorage({
    'gopixel:v2': JSON.stringify({
      version: 2,
      prefs: {
        theme: 'light',
        locale: 'pt',
        xp: 80,
        completed: ['B01', 'I03'],
        aiSeniorResults: {
          SAI01: { version: 1, passed: true, score: 100 },
        },
      },
    }),
  });
  globalThis.localStorage = mem;
  try {
    const loaded = loadPrefs();
    assert.equal(loaded.theme, 'light');
    assert.equal(loaded.locale, 'pt');
    assert.equal(loaded.xp, 80);
    assert.deepEqual(loaded.completed, ['B01', 'I03']);
    assert.deepEqual(Object.keys(loaded.aiSeniorResults), ['SAI01']);
    assert.ok(mem.getItem('aipixel:v1'), 'aipixel:v1 must be persisted after v2 migration');
    clearPersistedPrefs();
    assert.equal(mem.getItem('aipixel:v1'), null);
    assert.equal(mem.getItem('gopixel:v2'), null);
  } finally {
    globalThis.localStorage = prevStorage;
  }
});

test('BDD: loadPrefs migrates legacy gopixel:v1 and vigilio:ai-academy:senior:v1 into aipixel:v1', () => {
  const prevStorage = globalThis.localStorage;
  const mem = createMemoryStorage({
    'gopixel:v1': JSON.stringify({
      theme: 'light',
      locale: 'en',
      xp: 40,
      completed: ['B01', 'B02'],
    }),
    'vigilio:ai-academy:senior:v1': JSON.stringify({
      SAI01: { version: 1, passed: true, score: 100 },
      SAI02: { version: 1, passed: false, score: 0 },
    }),
  });
  globalThis.localStorage = mem;
  try {
    const loaded = loadPrefs();
    assert.equal(loaded.theme, 'light');
    assert.equal(loaded.locale, 'en');
    assert.equal(loaded.xp, 40);
    assert.deepEqual(loaded.completed, ['B01', 'B02']);
    assert.deepEqual(Object.keys(loaded.aiSeniorResults), ['SAI01']);
    assert.ok(mem.getItem('aipixel:v1'), 'aipixel:v1 must be persisted after v1 migration');
  } finally {
    globalThis.localStorage = prevStorage;
  }
});

test('BDD: backup export/import supports v1, v2 and v3 payloads and preserves AI Senior results', () => {
  const base = sanitizePrefs({
    theme: 'dark',
    xp: 120,
    aiSeniorResults: { SAI03: { version: 1, passed: true, score: 100 } },
  });
  const json = serializeBackupPayload(base);
  const restored = parseBackupPayload(json);
  assert.equal(restored.xp, 120);
  assert.deepEqual(restored.aiSeniorResults, base.aiSeniorResults);

  for (const ver of [1, 2]) {
    const legacyBackup = JSON.stringify({
      version: ver,
      prefs: { theme: 'light', xp: 20, completed: ['B01'] },
    });
    const restoredLegacy = parseBackupPayload(legacyBackup);
    assert.equal(restoredLegacy.theme, 'light');
    assert.deepEqual(restoredLegacy.completed, ['B01']);
  }
  assert.throws(() => parseBackupPayload('{"version":99,"prefs":{}}'));
});
