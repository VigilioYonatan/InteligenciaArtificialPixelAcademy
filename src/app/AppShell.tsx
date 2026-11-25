import type { ComponentChildren } from 'preact';
import { locales } from '../features/learning/constants/learning.constants';
import type { Locale } from '../features/learning/types/learning.types';
import type { Prefs } from '../features/progress/types/progress.types';
import { asset, Icon } from '../shared/ui/primitives';

type AppShellProps = {
  page: string;
  prefs: Prefs;
  t: (key: string) => string;
  onUpdatePrefs: (patch: Partial<Prefs>) => void;
  children: ComponentChildren;
};

const navItems = [
  { key: 'home', icon: 'home', href: '#/' },
  { key: 'learn', icon: 'book', href: '#/learn' },
  { key: 'playground', icon: 'terminal', href: '#/playground' },
  { key: 'games', icon: 'quiz', href: '#/games' },
  { key: 'frameworks', icon: 'framework', href: '#/frameworks' },
  { key: 'senior', icon: 'crown', href: '#/senior' },
] as const;

export function AppShell({ page, prefs, t, onUpdatePrefs, children }: AppShellProps) {
  const hasRoute = (name: string) => page === name || (name === 'senior' && page === 'ai');

  return (
    <div class="app-shell">
      <a class="skip-link" href="#main">
        Skip to content
      </a>
      <header class="site-header">
        <a class="brand" href="#/" aria-label="AIPixel Architecture Academy">
          <img src={asset('mascot/favicon.png')} alt="" width="40" height="40" class="brand-axon" />
          <span class="brand-text">
            <span class="brand-name">AI<span class="brand-cyan">Pixel</span></span>
            <small class="brand-arch">ARCHITECTURE ACADEMY</small>
            <small class="brand-byline">Por Vigilio Services</small>
          </span>
        </a>
        <nav class="primary-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href={item.href} class={hasRoute(item.key) ? 'active' : ''} key={item.key}>
              <Icon name={item.icon} size={18} />
              <span>{item.key === 'playground' ? 'Playground' : t(item.key)}</span>
            </a>
          ))}
        </nav>
        <div class="header-actions">
          <label class="lang-wrap">
            <span class="visually-hidden">{t('language')}</span>
            <select
              aria-label={t('language')}
              value={prefs.locale}
              onChange={(e) =>
                onUpdatePrefs({ locale: (e.currentTarget as HTMLSelectElement).value as Locale })
              }
            >
              {locales.map((l) => (
                <option value={l.id} key={l.id}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            class="circle-action"
            title={t('theme')}
            aria-label={t('theme')}
            onClick={() => onUpdatePrefs({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })}
          >
            <Icon name={prefs.theme === 'dark' ? 'sun' : 'moon'} size={19} />
          </button>
          <button
            type="button"
            class={`senior-toggle ${prefs.seniorEnabled ? 'on' : ''}`}
            aria-pressed={prefs.seniorEnabled}
            onClick={() => onUpdatePrefs({ seniorEnabled: !prefs.seniorEnabled })}
          >
            <Icon name="crown" size={18} />
            <span>{t('senior')}</span>
            <span class="toggle-knob" />
          </button>
          <a
            class="circle-action settings-action"
            href="#/settings"
            title={t('settings')}
            aria-label={t('settings')}
          >
            <Icon name="settings" size={18} />
          </a>
        </div>
      </header>
      <main id="main" class="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer class="site-footer">
        <div class="footer-inner">
          <span>© EngineerAI Pixel Academy · Axon AI Mascot (Original Pixel Art)</span>
          <span>100% AI Architecture & Software Engineering</span>
          <div class="footer-links">
            <a href="#/progress">{t('progress')}</a>
            <a href="#/about">About</a>
            <a href="#/credits">Credits</a>
            <a href="#/settings">{t('settings')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
