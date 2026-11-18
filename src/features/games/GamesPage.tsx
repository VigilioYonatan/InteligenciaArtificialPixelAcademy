import { useEffect, useState } from 'preact/hooks';
import { routeTo } from '../../app/router';
import { Button, Card, Icon, Mascot, PageHeading } from '../../shared/ui/primitives';
import { AxonPlayer } from '../cinema/AxonPlayer';
import { ARENA3D_INTRO_DECK } from '../cinema/data/storyboards';
import type { Prefs } from '../progress/types/progress.types';
import {
  bugBank,
  completeBank,
  type GameDomain,
  type GameMode,
  orderBank,
  predictBank,
  quizBank,
} from './data/game-bank';
import { RagVectorArena3D } from './RagVectorArena3D';

type ExtendedGameMode = GameMode | 'arena3d';

const gameModes: { id: ExtendedGameMode; icon: string; label?: string }[] = [
  { id: 'quiz', icon: 'question' },
  { id: 'complete', icon: 'code' },
  { id: 'order', icon: 'puzzle' },
  { id: 'predict', icon: 'terminal' },
  { id: 'bug', icon: 'bug' },
  { id: 'arena3d', icon: 'network', label: '3D Vector Arena' },
];

export function GamesPage({
  t,
  prefs,
  onWinGame,
  initialMode,
}: {
  t: (k: string) => string;
  locale?: string;
  prefs: Prefs;
  onWinGame: (mode: string) => void;
  initialMode?: string;
}) {
  const [mode, setMode] = useState<ExtendedGameMode>(() =>
    gameModes.some((g) => g.id === initialMode) ? (initialMode as ExtendedGameMode) : 'quiz',
  );
  const [domainFilter, setDomainFilter] = useState<'all' | GameDomain>('all');
  const [roundIdx, setRoundIdx] = useState(0);
  const [choice, setChoice] = useState('');
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [solvedRounds, setSolvedRounds] = useState<string[]>([]);
  const [showClue, setShowClue] = useState(false);

  useEffect(() => {
    if (initialMode && gameModes.some((g) => g.id === initialMode)) {
      setMode(initialMode as GameMode);
      setRoundIdx(0);
    }
  }, [initialMode]);

  const rawList =
    mode === 'quiz'
      ? quizBank
      : mode === 'complete'
        ? completeBank
        : mode === 'predict'
          ? predictBank
          : mode === 'bug'
            ? bugBank
            : orderBank;

  const filtered =
    domainFilter === 'all' ? rawList : rawList.filter((item) => item.domain === domainFilter);
  const safeIdx = roundIdx < filtered.length ? roundIdx : 0;
  const current = filtered[safeIdx];

  const [items, setItems] = useState<string[]>(() => [...orderBank[0].initial]);

  useEffect(() => {
    if (mode === 'order') {
      const round = filtered[safeIdx] as (typeof orderBank)[number] | undefined;
      setItems(round ? [...round.initial] : []);
    }
    setChoice('');
    setText('');
    setAnswer(null);
    setShowClue(false);
  }, [mode, safeIdx, domainFilter]);

  const selectMode = (key: ExtendedGameMode) => {
    setMode(key);
    setRoundIdx(0);
    setAnswer(null);
    setChoice('');
    setText('');
    setShowClue(false);
  };

  const comboMultiplier = streak >= 4 ? 3 : streak >= 2 ? 2 : 1;

  const validate = () => {
    if (!current) return;
    let good = false;
    if (mode === 'quiz') {
      good = choice === (current as (typeof quizBank)[number]).answer;
    } else if (mode === 'complete') {
      good = text.trim() === (current as (typeof completeBank)[number]).answer;
    } else if (mode === 'predict') {
      good = choice === (current as (typeof predictBank)[number]).answer;
    } else if (mode === 'bug') {
      good = choice === (current as (typeof bugBank)[number]).answer;
    } else {
      good = items.join('|') === (current as (typeof orderBank)[number]).expected.join('|');
    }

    if (good) {
      setAnswer('correct');
      const nextStreak = streak + 1;
      const mult = nextStreak >= 4 ? 3 : nextStreak >= 2 ? 2 : 1;
      const roundKey = `${mode}-${safeIdx}`;
      setStreak(nextStreak);
      setScore((s) => s + 100 * mult);
      setSolvedRounds((prev) => (prev.includes(roundKey) ? prev : [...prev, roundKey]));
      onWinGame(mode);
    } else {
      setAnswer('incorrect');
      setStreak(0);
    }
  };

  const resetRound = () => {
    setAnswer(null);
    setChoice('');
    setText('');
    setShowClue(false);
    if (mode === 'order' && current) {
      setItems([...(current as (typeof orderBank)[number]).initial]);
    }
  };

  const mascotPose =
    answer === 'correct' ? 'celebrate' : answer === 'incorrect' ? 'debug' : 'senior';

  return (
    <div class="content-page">
      <PageHeading eyebrow="PLAY & LEARN · SENIOR MODE" title={t('games')} subtitle={t('gameDesc')} />

      <section class="games-hud" aria-label="Telemetría de juego">
        <div class="games-hud-stats">
          <div class="hud-chip">
            <small>SCORE</small>
            <strong class="tabular-nums">{score}</strong>
          </div>
          <div class="hud-chip">
            <small>COMBO</small>
            <strong class="tabular-nums">x{comboMultiplier}</strong>
          </div>
          <div class="hud-chip">
            <small>STREAK</small>
            <strong class="tabular-nums">🔥 {streak}</strong>
          </div>
          <div class="hud-chip">
            <small>RESUELTAS</small>
            <strong class="tabular-nums">{solvedRounds.length}/50</strong>
          </div>
        </div>
        <div class="games-hud-mascot">
          <Mascot name={mascotPose} />
        </div>
      </section>

      <div class="games-grid">
        {gameModes.map((g) => (
          <button
            type="button"
            class={`game-tile ${mode === g.id ? 'chosen' : ''}`}
            key={g.id}
            onClick={() => {
              selectMode(g.id);
              routeTo(`games/${g.id}`);
            }}
          >
            <span>
              <Icon name={g.icon} size={28} />
            </span>
            <b>{g.label || t(g.id)}</b>
            <small>{prefs.gameWins.includes(g.id) ? '✓' : g.id === 'arena3d' ? 'THREE.JS 3D' : '10 ROUNDS'}</small>
          </button>
        ))}
      </div>

      {mode === 'arena3d' ? (
        <>
          <AxonPlayer deck={ARENA3D_INTRO_DECK} compact />
          <RagVectorArena3D
            reducedMotion={prefs.reducedMotion}
            onCompleteArena={() => onWinGame('arena3d')}
          />
        </>
      ) : (
      <Card className="game-arena">
        <div class="game-arena-head">
          <div>
            <span class="eyebrow small">
              {current?.domain === 'rag' ? 'AI RAG & ACL LAB' : 'AGENTS & FINOPS LAB'} ·{' '}
              {safeIdx + 1}/{filtered.length} · 🔥 {streak}
            </span>
            <div class="game-progress-track" aria-hidden="true">
              <i style={{ width: `${Math.round(((safeIdx + 1) / Math.max(1, filtered.length)) * 100)}%` }} />
            </div>
          </div>
          <div class="ai-filter-group">
            {(['all', 'rag', 'agents'] as const).map((dom) => (
              <button
                type="button"
                key={dom}
                class={`btn ${domainFilter === dom ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setDomainFilter(dom);
                  setRoundIdx(0);
                }}
              >
                {dom === 'all' ? 'All AI' : dom === 'rag' ? 'RAG & ACL' : 'Agents & FinOps'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'quiz' && current && (
          <>
            <h2>{(current as (typeof quizBank)[number]).prompt}</h2>
            <div class="option-grid">
              {(current as (typeof quizBank)[number]).options.map((x) => (
                <button
                  type="button"
                  class={`choice ${choice === x ? 'chosen' : ''}`}
                  key={x}
                  onClick={() => setChoice(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'complete' && current && (
          <>
            <h2>{(current as (typeof completeBank)[number]).prompt}</h2>
            <pre class="mini-code">{(current as (typeof completeBank)[number]).snippet}</pre>
            <label>
              {t('answer')}
              <input
                value={text}
                onInput={(e) => setText((e.currentTarget as HTMLInputElement).value)}
                placeholder={(current as (typeof completeBank)[number]).placeholder}
              />
            </label>
          </>
        )}

        {mode === 'predict' && current && (
          <>
            <h2>{t('predict')}</h2>
            <pre class="mini-code">{(current as (typeof predictBank)[number]).snippet}</pre>
            <div class="option-grid">
              {(current as (typeof predictBank)[number]).options.map((x) => (
                <button
                  type="button"
                  class={`choice ${choice === x ? 'chosen' : ''}`}
                  key={x}
                  onClick={() => setChoice(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'bug' && current && (
          <>
            <h2>{(current as (typeof bugBank)[number]).prompt}</h2>
            <pre class="mini-code">{(current as (typeof bugBank)[number]).snippet}</pre>
            <div class="option-grid">
              {(current as (typeof bugBank)[number]).options.map((x) => (
                <button
                  type="button"
                  class={`choice ${choice === x.id ? 'chosen' : ''}`}
                  key={x.id}
                  onClick={() => setChoice(x.id)}
                >
                  {x.text}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'order' && current && (
          <>
            <h2>{(current as (typeof orderBank)[number]).prompt}</h2>
            <div class="order-list">
              {items.map((x, i) => (
                <div class="order-item" key={`${x}-${i}`}>
                  <code>{x}</code>
                  <div>
                    <button
                      type="button"
                      disabled={i === 0}
                      aria-label="Move up"
                      onClick={() =>
                        setItems((a) => {
                          const n = [...a];
                          [n[i - 1], n[i]] = [n[i], n[i - 1]];
                          return n;
                        })
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={i === items.length - 1}
                      aria-label="Move down"
                      onClick={() =>
                        setItems((a) => {
                          const n = [...a];
                          [n[i + 1], n[i]] = [n[i], n[i + 1]];
                          return n;
                        })
                      }
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div class="game-actions">
          <Button onClick={validate}>{t('validate')}</Button>
          {answer === 'correct' && safeIdx < filtered.length - 1 && (
            <Button
              kind="senior"
              onClick={() => setRoundIdx((i) => Math.min(filtered.length - 1, i + 1))}
            >
              Siguiente Reto →
            </Button>
          )}
          <Button kind="outline" onClick={resetRound}>
            {t('reset')}
          </Button>
          <Button kind="quiet" onClick={() => setShowClue((v) => !v)}>
            {t('hint')}
          </Button>
          <Button
            kind="quiet"
            disabled={safeIdx === 0}
            onClick={() => setRoundIdx((i) => Math.max(0, i - 1))}
          >
            ←
          </Button>
          <Button
            kind="quiet"
            disabled={safeIdx >= filtered.length - 1}
            onClick={() => setRoundIdx((i) => Math.min(filtered.length - 1, i + 1))}
          >
            →
          </Button>
        </div>

        {showClue && current && (
          <div class="hint-box">
            <Icon name="question" size={18} />
            <span>{current.explain}</span>
          </div>
        )}

        {answer && (
          <output class={`feedback ${answer}`}>
            {t(answer)} {answer === 'correct' && current ? `(+${100 * comboMultiplier} pts) · ${current.explain}` : ''}
          </output>
        )}
      </Card>
      )}
    </div>
  );
}
