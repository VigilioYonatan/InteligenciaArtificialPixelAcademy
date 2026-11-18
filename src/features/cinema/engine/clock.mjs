/**
 * Pure deterministic timeline & WebVTT engine for Axon Interactive Cinema.
 * Zero Preact, zero DOM, zero localStorage (AGENTS.md Section 3).
 */

export function formatCinemaTime(sec) {
  const s = Math.max(0, Math.floor(Number.isFinite(sec) ? sec : 0));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function estimateSceneDuration(speech, baseSec) {
  const words = String(speech || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(baseSec || 6, Math.ceil(words / 2.65));
}

export function buildDeckTimeline(deck) {
  const scenes = Array.isArray(deck?.scenes) ? deck.scenes : [];
  if (
    deck?.audio &&
    Array.isArray(deck.audio.cues) &&
    deck.audio.cues.length === scenes.length &&
    deck.audio.totalSec > 0
  ) {
    const starts = deck.audio.cues.map((c, idx) => (idx === 0 ? 0 : Number(c)));
    const total = Number(deck.audio.totalSec);
    const ends = starts.map((_, idx) => (idx < starts.length - 1 ? starts[idx + 1] : total));
    return { starts, ends, total };
  }

  const durs = scenes.map((sc) => estimateSceneDuration(sc.speech, sc.durationSec));
  const starts = [];
  let acc = 0;
  for (const d of durs) {
    starts.push(acc);
    acc += d;
  }
  const ends = starts.map((s, idx) => s + durs[idx]);
  return { starts, ends, total: acc };
}

export function resolveActiveSceneIndex(starts, currentTime) {
  if (!Array.isArray(starts) || starts.length === 0) return 0;
  let idx = 0;
  for (let i = 0; i < starts.length; i += 1) {
    if (currentTime >= starts[i] - 0.02) {
      idx = i;
    }
  }
  return idx;
}

function formatVttTimestamp(sec) {
  const clamped = Math.max(0, Number.isFinite(sec) ? sec : 0);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = Math.floor(clamped % 60);
  const ms = Math.round((clamped - Math.floor(clamped)) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export function buildWebVttDataUri(scenes, starts, ends) {
  const blocks = (scenes || []).map((sc, i) => {
    const st = starts[i] ?? 0;
    const en = ends[i] ?? st + (sc.durationSec || 6);
    const speakerPrefix = sc.speaker === 'host' ? '[Sofía] ' : '[Axon] ';
    return `${formatVttTimestamp(st)} --> ${formatVttTimestamp(en)}\n${speakerPrefix}${sc.speech}`;
  });
  return `data:text/vtt;charset=utf-8,${encodeURIComponent(`WEBVTT\n\n${blocks.join('\n\n')}\n`)}`;
}
