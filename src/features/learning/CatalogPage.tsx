import curriculum from '../../data/curriculum.json';
import { Icon, Mascot, PageHeading } from '../../shared/ui/primitives';
import { tracks, trackStyles } from './constants/learning.constants';
import type { Locale, Module, RouteTrack } from './types/learning.types';

const modules = curriculum as Module[];

export function CatalogPage({
  t,
  locale,
  completed,
  track,
}: {
  t: (k: string) => string;
  locale: Locale;
  completed: string[];
  track?: RouteTrack;
}) {
  const selected = track && tracks.includes(track) ? track : 'basic';
  const records = modules.filter((m) => m.track === selected);

  return (
    <div class="content-page">
      <PageHeading eyebrow="AI ARCHITECTURE" title={t('featured')} subtitle="54 modules · 4 tracks" />
      <div class="catalog-layout">
        <aside class="catalog-aside">
          <div class="aside-label">{t('learn')}</div>
          {tracks.map((k) => (
            <a class={`aside-link ${selected === k ? 'selected' : ''}`} href={`#/learn/${k}`} key={k}>
              <Icon name={trackStyles[k].icon} size={20} />
              {t(k)} <b>{k === 'senior' ? '18' : '12'}</b>
            </a>
          ))}
          <div class="aside-gopher">
            <Mascot name="reading" />
            <span>Evidence before complexity.</span>
          </div>
        </aside>
        <div class="catalog-main">
          <div class="catalog-head">
            <h2>{t(selected)}</h2>
            <p>{records[0]?.summary[locale]}</p>
          </div>
          <div class="module-grid">
            {records.map((m) => (
              <a
                class="module-card"
                href={selected === 'senior' ? `#/senior/${m.id}` : `#/lesson/${m.id}`}
                key={m.id}
              >
                <div class="module-card-top">
                  <span class="mono id">{m.id}</span>
                  {completed.includes(m.id) ? (
                    <span class="status done">✓ {t('completed')}</span>
                  ) : (
                    <span class="status">
                      {m.status === 'implemented' ? t('preview') : t('planned')}
                    </span>
                  )}
                </div>
                <h3>{m.title[locale]}</h3>
                <p>{m.summary[locale]}</p>
                <span class="module-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
