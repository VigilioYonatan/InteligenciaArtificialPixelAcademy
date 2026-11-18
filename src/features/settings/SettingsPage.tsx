import { Button, Card, Icon, PageHeading } from '../../shared/ui/primitives';
import { MAX_BACKUP_BYTES } from '../progress/constants/progress.constants';
import { importBackupJson } from '../progress/model/progress.signal';
import { serializeBackupPayload } from '../progress/persistence/progress.repository';
import type { Prefs } from '../progress/types/progress.types';

export function SettingsPage({
  t,
  prefs,
  update,
  reset,
}: {
  t: (k: string) => string;
  prefs: Prefs;
  update: (v: Partial<Prefs>) => void;
  reset: () => void;
}) {
  const exportData = () => {
    const a = document.createElement('a');
    const blob = new Blob([serializeBackupPayload(prefs)], { type: 'application/json' });
    a.href = URL.createObjectURL(blob);
    a.download = 'aipixel-progress.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const importData = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      alert('Backup too large (1 MB maximum)');
      return;
    }
    file.text().then((s) => {
      try {
        importBackupJson(s);
      } catch {
        alert('Invalid AIPixel backup');
      }
    });
  };

  return (
    <div class="content-page">
      <PageHeading eyebrow="PERSONALIZE" title={t('settings')} subtitle={t('savedAutomatic')} />
      <div class="settings-grid">
        <Card>
          <h2>{t('theme')}</h2>
          <div class="choice-row">
            <Button
              kind={prefs.theme === 'light' ? 'primary' : 'outline'}
              onClick={() => update({ theme: 'light' })}
            >
              <Icon name="sun" size={18} />
              {t('light')}
            </Button>
            <Button
              kind={prefs.theme === 'dark' ? 'primary' : 'outline'}
              onClick={() => update({ theme: 'dark' })}
            >
              <Icon name="moon" size={18} />
              {t('dark')}
            </Button>
          </div>
          <h3>{t('reducedMotion')}</h3>
          <label class="setting-control">
            <input
              type="checkbox"
              checked={prefs.reducedMotion}
              onInput={(e) => update({ reducedMotion: (e.currentTarget as HTMLInputElement).checked })}
              onChange={(e) => update({ reducedMotion: (e.currentTarget as HTMLInputElement).checked })}
            />
            {t('reducedMotion')}
          </label>
          <h3>
            {prefs.locale === 'es'
              ? 'Tamaño de fuente del editor'
              : prefs.locale === 'en'
                ? 'Editor font size'
                : prefs.locale === 'ja'
                  ? 'エディタのフォントサイズ'
                  : prefs.locale === 'zh'
                    ? '编辑器字号'
                    : prefs.locale === 'pt'
                      ? 'Tamanho da fonte'
                      : 'Taille de police'}
          </h3>
          <div class="choice-row">
            <Button
              kind={prefs.fontSize === 'sm' ? 'primary' : 'outline'}
              onClick={() => update({ fontSize: 'sm' })}
            >
              12px · S
            </Button>
            <Button
              kind={prefs.fontSize === 'md' || !prefs.fontSize ? 'primary' : 'outline'}
              onClick={() => update({ fontSize: 'md' })}
            >
              14px · M
            </Button>
            <Button
              kind={prefs.fontSize === 'lg' ? 'primary' : 'outline'}
              onClick={() => update({ fontSize: 'lg' })}
            >
              16px · L
            </Button>
          </div>
        </Card>
        <Card>
          <h2>{t('privacy')}</h2>
          <p>{t('noServer')}</p>
          <p class="muted">{t('savedAutomatic')}</p>
          <div class="settings-actions">
            <Button kind="outline" onClick={exportData}>
              {t('export')}
            </Button>
            <label class="file-import">
              {t('import')}
              <input
                type="file"
                accept="application/json,.json"
                onChange={(e) => importData((e.currentTarget as HTMLInputElement).files?.[0] || null)}
              />
            </label>
            <button
              type="button"
              class="btn btn-danger"
              onClick={() => {
                if (confirm(t('confirmClear'))) reset();
              }}
            >
              {t('clear')}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
