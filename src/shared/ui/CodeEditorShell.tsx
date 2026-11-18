import { useState } from 'preact/hooks';
import { Icon } from './primitives';

export function CodeEditorShell({
  fileName,
  badge,
  ariaLabel,
  value,
  fontSize = 'md',
  onChange,
}: {
  fileName: string;
  badge?: string;
  ariaLabel: string;
  value: string;
  fontSize?: 'sm' | 'md' | 'lg';
  onChange: (nextValue: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const lines = value.split('\n');
  const hasPlaceholder = value.includes('_____');

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div class="ide-shell">
      <div class="ide-header">
        <div class="ide-dots" aria-hidden="true">
          <span class="dot-red" />
          <span class="dot-amber" />
          <span class="dot-green" />
        </div>
        <div class="ide-file">
          <Icon name="terminal" size={14} />
          <span>{fileName}</span>
        </div>
        <div class="ide-meta">
          <span class={`ide-status ${hasPlaceholder ? 'pending' : 'ready'}`}>
            {hasPlaceholder ? '● Completa _____' : '✓ Listo para validar'}
          </span>
          {badge && <span class="tag info">{badge}</span>}
          <button
            type="button"
            class="ide-copy-btn"
            onClick={copyCode}
            aria-label="Copiar código"
            title="Copiar código"
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      <div class="ide-body">
        <div class="ide-gutter tabular-nums" aria-hidden="true">
          {lines.map((_, idx) => (
            <span key={idx}>{idx + 1}</span>
          ))}
        </div>
        <textarea
          aria-label={ariaLabel}
          spellcheck={false}
          rows={Math.max(6, Math.min(18, lines.length + 1))}
          class={`code-editor ide-textarea font-${fontSize}`}
          value={value}
          onInput={(e) => onChange((e.currentTarget as HTMLTextAreaElement).value)}
        />
      </div>

      <div class="ide-footer tabular-nums">
        <span>{lines.length} líneas · {value.length} chars</span>
        <span>TypeScript / AI Static Engine · UTF-8</span>
      </div>
    </div>
  );
}
