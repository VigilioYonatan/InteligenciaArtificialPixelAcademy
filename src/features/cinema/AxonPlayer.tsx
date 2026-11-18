import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { asset } from '../../shared/ui/primitives';
import {
  buildDeckTimeline,
  buildWebVttDataUri,
  formatCinemaTime,
  resolveActiveSceneIndex,
} from './engine/clock.mjs';
import type { CinemaDeck, StageVisual } from './types/cinema.types';

function StageCanvas({
  visual,
  progress,
}: {
  visual: StageVisual;
  progress: number;
}) {
  if (visual.kind === 'finops-terminal') {
    const visibleCount = Math.max(1, Math.ceil(progress * visual.lines.length + 0.25));
    return (
      <div class="cinema-board cinema-terminal">
        <div class="cinema-board-top">
          <span class="cinema-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span class="cinema-board-title">{visual.title}</span>
          <span class="cinema-chip">{visual.badge}</span>
        </div>
        <div class="cinema-term-body">
          {visual.lines.map((ln, idx) => {
            const shown = idx < visibleCount;
            return (
              <div
                key={`${ln.text}-${idx}`}
                class={`cinema-term-line ${ln.tone ?? 'cmd'} ${shown ? 'is-visible' : 'is-pending'}`}
              >
                {ln.prompt && <span class="term-prompt">{ln.prompt}</span>}
                <code>{ln.text}</code>
                {idx === visibleCount - 1 && (
                  <span class="cinema-pixel-cursor" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (visual.kind === 'rag-acl') {
    return (
      <div class="cinema-board cinema-rag-grid">
        <div class="cinema-mem-col">
          <div class="cinema-mem-head">
            <span>{visual.identityLabel}</span>
          </div>
          {visual.claims.map((cl) => (
            <div
              key={cl.key}
              class={`cinema-mem-row ${cl.valid ? 'state-ok' : 'state-leak'}`}
            >
              <strong>{cl.key}</strong>
              <code>{cl.value}</code>
            </div>
          ))}
        </div>
        <div class="cinema-mem-arrow" aria-hidden="true">
          <span>{visual.mode === 'shielded' ? 'SQL ACL ──▶' : 'NO ACL ──▶'}</span>
        </div>
        <div class="cinema-mem-col">
          <div class="cinema-mem-head heap">
            <span>{visual.indexLabel}</span>
          </div>
          {visual.chunks.map((ch) => (
            <div
              key={ch.id}
              class={`cinema-heap-box ${ch.blocked ? 'is-alert' : 'is-safe'}`}
            >
              <div class="cinema-heap-top">
                <span class="cinema-addr">{ch.id}</span>
                <code>{ch.text}</code>
              </div>
              <small>{ch.note}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.kind === 'agent-lanes') {
    const activeStep = Math.min(2, Math.floor(progress * 3));
    return (
      <div class="cinema-board cinema-lanes">
        <div class="cinema-lanes-head">
          <span class={`cinema-chip ${visual.mode === 'bounded' ? 'ok' : 'hot'}`}>
            {visual.statusBadge}
          </span>
        </div>
        {[visual.laneA, visual.laneB].map((lane) => (
          <div class="cinema-lane-row" key={lane.name}>
            <div class="cinema-lane-label">{lane.name}</div>
            <div class="cinema-lane-steps">
              {lane.steps.map((st, idx) => (
                <span
                  key={st}
                  class={`cinema-step-pill ${idx <= activeStep ? 'active' : ''}`}
                >
                  {st}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (visual.kind === 'code-diff') {
    const showAfter = progress >= 0.25;
    return (
      <div class="cinema-board cinema-diff">
        <div class="cinema-board-top">
          <span class="cinema-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span class="cinema-board-title">{visual.file}</span>
          <span class="cinema-chip ok">AI DIFF</span>
        </div>
        <div class="cinema-diff-lines">
          {visual.before.map((b) => (
            <div key={b} class="cinema-diff-del">
              <code>- {b}</code>
            </div>
          ))}
          {visual.after.map((a) => (
            <div key={a} class={`cinema-diff-add ${showAfter ? 'is-lit' : ''}`}>
              <code>+ {a}</code>
            </div>
          ))}
        </div>
        <div class="cinema-callout">
          <span>✦ {visual.callout}</span>
        </div>
      </div>
    );
  }

  return (
    <div class="cinema-board cinema-arch">
      <div class="cinema-arch-nodes">
        {visual.nodes.map((nd, idx) => (
          <div key={nd.label} class="cinema-arch-step">
            <div class={`cinema-arch-box state-${nd.state ?? 'normal'}`}>
              <strong>{nd.label}</strong>
              <small>{nd.sub}</small>
            </div>
            {idx < visual.nodes.length - 1 && (
              <span class="cinema-flow-arrow" aria-hidden="true">
                ══▶
              </span>
            )}
          </div>
        ))}
      </div>
      <div class="cinema-metric-strip">
        <span class="cinema-metric-label">{visual.metricLabel}</span>
        <div class="cinema-metric-values">
          <span class="before">{visual.metricBefore}</span>
          <span aria-hidden="true">→</span>
          <strong class={visual.mode === 'incident' ? 'hot' : 'ok'}>
            {visual.metricAfter}
          </strong>
        </div>
      </div>
    </div>
  );
}

export interface AxonPlayerProps {
  deck: CinemaDeck;
  locale?: string;
  compact?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export function AxonPlayer({
  deck,
  locale = 'es',
  compact = false,
  onAction,
  actionLabel,
}: AxonPlayerProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'ended'>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [fallbackClock, setFallbackClock] = useState(!deck.audio);

  const studioUrl = deck.audio
    ? `${import.meta.env.BASE_URL}${deck.audio.src}`
    : undefined;

  const timeline = useMemo(() => buildDeckTimeline(deck), [deck]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setStatus('idle');
    setCurrentTime(0);
    setFallbackClock(!deck.audio);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [deck.id, deck.audio]);

  const sceneIdx = useMemo(
    () => resolveActiveSceneIndex(timeline.starts, currentTime),
    [timeline.starts, currentTime],
  );

  const currentScene = deck.scenes[sceneIdx] ?? deck.scenes[0];
  const sceneStart = timeline.starts[sceneIdx] ?? 0;
  const sceneEnd = timeline.ends[sceneIdx] ?? timeline.total;
  const sceneSpan = Math.max(0.5, sceneEnd - sceneStart);
  const sceneProgress =
    status === 'idle'
      ? 0.72
      : status === 'ended'
        ? 1
        : Math.min(1, Math.max(0, (currentTime - sceneStart) / sceneSpan));

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = speed;
    el.muted = muted;
  }, [speed, muted]);

  useEffect(() => {
    if (status !== 'playing') return;
    let lastAudioTime = audioRef.current?.currentTime ?? 0;
    let stalledTicks = 0;

    const timer = window.setInterval(() => {
      const el = audioRef.current;
      if (studioUrl && el && !fallbackClock && !el.error) {
        const t = el.currentTime;
        if (Math.abs(t - lastAudioTime) < 0.001) {
          stalledTicks += 1;
          if (stalledTicks >= 6) {
            setFallbackClock(true);
          }
        } else {
          stalledTicks = 0;
          lastAudioTime = t;
          setCurrentTime(t);
          if (el.ended || t >= timeline.total - 0.05) {
            setStatus('ended');
            setCurrentTime(timeline.total);
          }
          return;
        }
      }

      setCurrentTime((prev) => {
        const next = prev + 0.1 * speed;
        if (next >= timeline.total) {
          setStatus('ended');
          return timeline.total;
        }
        return next;
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [status, studioUrl, fallbackClock, speed, timeline.total]);

  function startOrTogglePlay() {
    const el = audioRef.current;
    if (status === 'playing') {
      el?.pause();
      setStatus('paused');
      return;
    }

    const restart = status === 'ended' || currentTime >= timeline.total - 0.08;
    const nextTime = restart ? 0 : currentTime;
    if (restart) {
      setCurrentTime(0);
    }

    if (studioUrl && el) {
      try {
        el.currentTime = nextTime;
        el.playbackRate = speed;
        el.muted = muted;
        const p = el.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => setFallbackClock(true));
        }
      } catch {
        setFallbackClock(true);
      }
    }
    setStatus('playing');
  }

  function seekTo(targetSec: number) {
    const clamped = Math.max(0, Math.min(timeline.total, targetSec));
    setCurrentTime(clamped);
    const el = audioRef.current;
    if (studioUrl && el) {
      try {
        el.currentTime = clamped;
      } catch {
        /* ignore seek before metadata */
      }
    }
    if (status === 'idle' || status === 'ended') {
      if (studioUrl && el) {
        try {
          el.playbackRate = speed;
          el.muted = muted;
          const p = el.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => setFallbackClock(true));
          }
        } catch {
          setFallbackClock(true);
        }
      }
      setStatus('playing');
    }
  }

  function jumpToScene(idx: number) {
    const clampedIdx = Math.max(0, Math.min(deck.scenes.length - 1, idx));
    const cueSec = clampedIdx === 0 ? 0 : (timeline.starts[clampedIdx] ?? 0) + 0.03;
    seekTo(cueSec);
  }

  function handleScrubberClick(e: MouseEvent) {
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(ratio * timeline.total);
  }

  function handleScrubberKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      seekTo(currentTime + 4);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      seekTo(currentTime - 4);
    }
  }

  function cycleSpeed() {
    setSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1));
  }

  function toggleFullscreen() {
    const node = screenRef.current;
    if (!node || typeof document === 'undefined') return;
    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      void node.requestFullscreen?.();
    }
  }

  const vttTrackSrc = useMemo(
    () => buildWebVttDataUri(deck.scenes, timeline.starts, timeline.ends),
    [deck.scenes, timeline.starts, timeline.ends],
  );

  const progressPct =
    timeline.total > 0
      ? Math.min(100, Math.max(0, (currentTime / timeline.total) * 100))
      : 0;
  const finalCtaLabel = actionLabel ?? deck.ctaLabel;
  const speakerRole = currentScene.speaker ?? 'axon';
  const isAxonTalking = status === 'playing' && !muted && speakerRole === 'axon';

  return (
    <section
      class={`axon-cinema aura-${currentScene.aura} ${compact ? 'is-compact' : ''} is-${status}`}
      aria-label={`Video: ${deck.heading}`}
    >
      {studioUrl && (
        <audio
          ref={audioRef}
          src={studioUrl}
          preload="metadata"
          onTimeUpdate={(e) => {
            if (!fallbackClock && status === 'playing') {
              setCurrentTime(e.currentTarget.currentTime);
            }
          }}
          onEnded={() => {
            setCurrentTime(timeline.total);
            setStatus('ended');
          }}
        >
          <track
            kind="captions"
            src={vttTrackSrc}
            srcLang={locale}
            label="Subtítulos"
            default
          />
        </audio>
      )}

      <div class="cinema-screen" ref={screenRef}>
        {status === 'idle' ? (
          <button
            type="button"
            class="cinema-poster"
            onClick={startOrTogglePlay}
            aria-label={`Reproducir video: ${deck.heading}`}
          >
            <div class="cinema-poster-backdrop" aria-hidden="true">
              <StageCanvas visual={currentScene.visual} progress={0.75} />
            </div>

            <div class="cinema-poster-top">
              <span class="cinema-pill-hd">
                <i class="cinema-live-dot" /> {deck.kicker}
              </span>
              <span class="cinema-pill-dur tabular-nums">
                {formatCinemaTime(timeline.total)}
              </span>
            </div>

            <div class="cinema-poster-center">
              <span class="cinema-play-orb" aria-hidden="true">
                ▶
              </span>
              <strong class="cinema-poster-heading">{deck.heading}</strong>
              <span class="cinema-poster-sub">
                {deck.audio
                  ? 'Audio Estudio HD · Sofía & Axon Senior'
                  : 'Explicación guiada con Axon'}{' '}
                · {deck.scenes.length}{' '}
                {deck.scenes.length === 1 ? 'escena' : 'escenas'}
              </span>
            </div>

            <img
              src={asset(`mascot/${currentScene.mascot}.png`)}
              alt=""
              aria-hidden="true"
              class="mascot cinema-poster-mascot"
            />
          </button>
        ) : (
          <>
            <div class="cinema-top-overlay">
              <div
                class={`cinema-speaker-badge role-${speakerRole} ${status === 'playing' && !muted ? 'is-live' : ''}`}
              >
                <span class="cinema-eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  {speakerRole === 'host'
                    ? 'Sofía · Host'
                    : 'Axon · Mentor Senior'}
                </span>
              </div>

              <nav class="cinema-scene-dots" aria-label="Capítulos del video">
                {deck.scenes.map((sc, idx) => (
                  <button
                    key={sc.chapter}
                    type="button"
                    class={`cinema-dot-btn ${idx === sceneIdx ? 'active' : ''}`}
                    onClick={() => jumpToScene(idx)}
                    title={sc.chapter}
                    aria-label={`Ir a ${sc.chapter}`}
                  >
                    {sc.chapter}
                  </button>
                ))}
              </nav>
            </div>

            <div class="cinema-stage-body">
              <div class="cinema-stage-left">
                <h4 class="cinema-live-title">{currentScene.title}</h4>
                <StageCanvas visual={currentScene.visual} progress={sceneProgress} />
              </div>

              <div class="cinema-stage-mascot">
                <div
                  class={`axon-aura-stage aura-${currentScene.aura} ${isAxonTalking ? 'is-speaking' : ''}`}
                >
                  <img
                    src={asset(`mascot/${currentScene.mascot}.png`)}
                    alt=""
                    aria-hidden="true"
                    class="mascot cinema-axon-img"
                  />
                </div>
              </div>
            </div>

            {captionsOn && status !== 'ended' && (
              <output class="cinema-subtitles" aria-live="polite">
                <p>{currentScene.speech}</p>
              </output>
            )}

            {status === 'ended' && (
              <div class="cinema-ended-overlay">
                <div class="cinema-ended-card">
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={startOrTogglePlay}
                  >
                    ↺ Volver a ver
                  </button>
                  {finalCtaLabel &&
                    (onAction || deck.ctaHref) &&
                    (onAction ? (
                      <button
                        type="button"
                        class="btn btn-senior"
                        onClick={onAction}
                      >
                        {finalCtaLabel} →
                      </button>
                    ) : (
                      <a class="btn btn-senior" href={deck.ctaHref}>
                        {finalCtaLabel} →
                      </a>
                    ))}
                </div>
              </div>
            )}

            <div class="cinema-bottom-bar">
              <div
                class="cinema-scrubber"
                role="slider"
                tabIndex={0}
                aria-label="Línea de tiempo del video"
                aria-valuemin={0}
                aria-valuemax={Math.round(timeline.total)}
                aria-valuenow={Math.round(currentTime)}
                onClick={handleScrubberClick}
                onKeyDown={handleScrubberKeyDown}
              >
                <div class="cinema-scrubber-track">
                  <div
                    class="cinema-scrubber-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                  {timeline.starts.slice(1).map((cue) => {
                    const leftPct = (cue / Math.max(1, timeline.total)) * 100;
                    return (
                      <i
                        key={cue}
                        class="cinema-cue-tick"
                        style={{ left: `${leftPct}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              <div class="cinema-controls-strip">
                <div class="cinema-ctrl-group">
                  <button
                    type="button"
                    class="cinema-icon-btn is-primary"
                    onClick={startOrTogglePlay}
                    aria-label={
                      status === 'playing'
                        ? 'Pausar video'
                        : status === 'ended'
                          ? 'Repetir video'
                          : 'Reproducir video'
                    }
                  >
                    {status === 'playing' ? '⏸' : status === 'ended' ? '↺' : '▶'}
                  </button>

                  <span class="cinema-time-readout tabular-nums">
                    {formatCinemaTime(currentTime)} / {formatCinemaTime(timeline.total)}
                  </span>

                  <span class="cinema-chapter-inline">{currentScene.chapter}</span>
                </div>

                <div class="cinema-ctrl-group">
                  <button
                    type="button"
                    class={`cinema-icon-btn ${captionsOn ? 'is-active' : ''}`}
                    onClick={() => setCaptionsOn((c) => !c)}
                    aria-pressed={captionsOn}
                    aria-label={
                      captionsOn ? 'Ocultar subtítulos' : 'Mostrar subtítulos'
                    }
                    title="Subtítulos (CC)"
                  >
                    CC
                  </button>

                  <button
                    type="button"
                    class="cinema-icon-btn cinema-speed-pill tabular-nums"
                    onClick={cycleSpeed}
                    aria-label={`Velocidad de reproducción ${speed}x`}
                  >
                    {speed}x
                  </button>

                  <button
                    type="button"
                    class={`cinema-icon-btn ${!muted ? 'is-active' : ''}`}
                    onClick={() => setMuted((m) => !m)}
                    aria-pressed={!muted}
                    aria-label={muted ? 'Activar audio' : 'Silenciar audio'}
                  >
                    {muted ? '🔇' : '🔊'}
                  </button>

                  <button
                    type="button"
                    class="cinema-icon-btn"
                    onClick={toggleFullscreen}
                    aria-label="Pantalla completa"
                    title="Pantalla completa"
                  >
                    ⛶
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
