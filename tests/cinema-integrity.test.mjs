import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  buildDeckTimeline,
  buildWebVttDataUri,
  formatCinemaTime,
  resolveActiveSceneIndex,
} from '../src/features/cinema/engine/clock.mjs';

const root = process.cwd();

test('Axon Cinema Batch 1 (30 decks): all studio-mastered MP3 files exist, are bounded (<500 KB), and match valid Axon poses', () => {
  const manifestPath = resolve(root, 'src/features/cinema/data/audio-manifest.json');
  const scriptsPath = resolve(root, 'src/features/cinema/data/batch1-scripts.json');
  assert.equal(existsSync(manifestPath), true, 'audio-manifest.json must exist');
  assert.equal(existsSync(scriptsPath), true, 'batch1-scripts.json must exist');

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const scripts = JSON.parse(readFileSync(scriptsPath, 'utf8'));

  const expectedIds = [
    'home-intro',
    'senior-overview',
    'arena3d-intro',
    'b01',
    ...Array.from({ length: 18 }, (_, i) => `senior-s${String(i + 1).padStart(2, '0')}`),
    ...Array.from({ length: 8 }, (_, i) => `f${String(i + 1).padStart(2, '0')}`),
  ];
  assert.equal(scripts.length, 30, 'Batch 1 must define exactly 30 decks');

  for (const id of expectedIds) {
    const entry = manifest[id];
    const spec = scripts.find((s) => s.id === id);
    assert.ok(spec, `Missing script spec for ${id}`);
    assert.ok(entry, `Missing audio manifest entry for ${id}`);
    assert.equal(entry.cues.length, spec.scenes.length, `${id} cues count must match scenes count`);
    assert.equal(entry.speakers.length, spec.scenes.length, `${id} speakers count must match scenes`);
    assert.ok(entry.totalSec > 20 && entry.totalSec < 60, `${id} duration out of studio range: ${entry.totalSec}`);

    for (let i = 1; i < entry.cues.length; i += 1) {
      assert.ok(entry.cues[i] > entry.cues[i - 1], `${id} cues must be strictly increasing`);
    }
    assert.ok(entry.cues[entry.cues.length - 1] < entry.totalSec, `${id} last cue must precede totalSec`);

    const mp3Path = resolve(root, 'public', entry.src);
    assert.equal(existsSync(mp3Path), true, `Missing MP3 file: ${entry.src}`);
    const sizeKb = statSync(mp3Path).size / 1024;
    assert.ok(sizeKb > 150 && sizeKb < 500, `${entry.src} unexpected size: ${sizeKb.toFixed(1)} KB`);

    for (const sc of spec.scenes) {
      const pngPath = resolve(root, 'public/assets/mascot', `${sc.mascot}.png`);
      assert.equal(existsSync(pngPath), true, `Broken mascot pose in ${id}: ${sc.mascot}.png does not exist`);
    }
  }
});

test('Axon Cinema pure engine: timeline, scene index resolver, and WebVTT captions work deterministically', () => {
  assert.equal(formatCinemaTime(0), '00:00');
  assert.equal(formatCinemaTime(38.07), '00:38');

  const mockDeck = {
    id: 'test-deck',
    kicker: 'TEST',
    heading: 'Test Heading',
    audio: {
      src: 'audio/b01.mp3',
      totalSec: 35.91,
      cues: [0.45, 9.59, 18.14, 22.93],
      speakers: ['host', 'axon', 'host', 'axon'],
    },
    scenes: [
      { chapter: '01', title: 'S1', speaker: 'host', mascot: 'debug', aura: 'blue', speech: 'Uno', durationSec: 9, visual: { kind: 'finops-terminal', title: 't', badge: 'b', lines: [] } },
      { chapter: '02', title: 'S2', speaker: 'axon', mascot: 'idea', aura: 'gold', speech: 'Dos', durationSec: 9, visual: { kind: 'finops-terminal', title: 't', badge: 'b', lines: [] } },
      { chapter: '03', title: 'S3', speaker: 'host', mascot: 'reading', aura: 'violet', speech: 'Tres', durationSec: 5, visual: { kind: 'finops-terminal', title: 't', badge: 'b', lines: [] } },
      { chapter: '04', title: 'S4', speaker: 'axon', mascot: 'coding', aura: 'emerald', speech: 'Cuatro', durationSec: 13, visual: { kind: 'finops-terminal', title: 't', badge: 'b', lines: [] } },
    ],
  };

  const tl = buildDeckTimeline(mockDeck);
  assert.deepEqual(tl.starts, [0, 9.59, 18.14, 22.93]);
  assert.equal(tl.total, 35.91);
  assert.equal(resolveActiveSceneIndex(tl.starts, 0), 0);
  assert.equal(resolveActiveSceneIndex(tl.starts, 10.0), 1);
  assert.equal(resolveActiveSceneIndex(tl.starts, 23.5), 3);

  const vttUri = buildWebVttDataUri(mockDeck.scenes, tl.starts, tl.ends);
  assert.ok(vttUri.startsWith('data:text/vtt;charset=utf-8,'));
  const decoded = decodeURIComponent(vttUri.split(',')[1]);
  assert.ok(decoded.includes('WEBVTT'));
  assert.ok(decoded.includes('[Sofía] Uno'));
  assert.ok(decoded.includes('[Axon] Cuatro'));
});
