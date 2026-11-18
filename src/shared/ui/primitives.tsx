import type { ComponentChildren } from 'preact';

export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

const PIXEL_PATHS: Record<string, string[]> = {
  home: ['M7 1h2v1h2v2h2v2h1v8H9V9H7v5H2V6h1V4h2V2h2V1z'],
  book: ['M2 2h5v11H2V2zm7 0h5v11H9V2zm-5 2v2h2V4H4zm7 0v2h2V4h-2z'],
  terminal: ['M2 3h12v10H2V3zm2 2v1h1v1h1v1H5v1H4v1h2V9h1V7H6V5H4zm4 4v1h4V9H8z'],
  quiz: ['M6 2h4v1h2v3h-2v2H8v2H6V7h2V6h2V4H6v2H4V3h2V2zm0 10h2v2H6v-2z'],
  framework: ['M2 2h4v4H2V2zm8 0h4v4h-4V2zM6 3h4v2H6V3zM2 10h4v4H2v-4zm8 0h4v4h-4v-4zM3 6h2v4H3V6zm8 0h2v4h-2V6z'],
  crown: ['M2 4h2v2h2V3h4v3h2V4h2v8H2V4zm2 9h8v1H4v-1z'],
  sun: ['M7 1h2v2H7V1zm0 12h2v2H7v-2zM1 7h2v2H1V7zm12 0h2v2h-2V7zM5 5h6v6H5V5zM3 3h2v2H3V3zm8 0h2v2h-2V3zM3 11h2v2H3v-2zm8 0h2v2h-2v-2z'],
  moon: ['M6 2h4v1H8v2H6v5h2v2h3v1H6v-1H4v-2H3V6h1V4h2V2z'],
  settings: ['M6 1h4v2h2l1 2 2 1v4l-2 1-1 2h-2v2H6v-2H4l-1-2-2-1V6l2-1 1-2h2V1zm1 5v4h2V6H7z'],
  play: ['M4 2h2v1h2v1h2v2h2v4h-2v2H8v1H6v1H4V2z'],
  check: ['M12 3h2v2h-2v2h-2v2H8v2H6v2H4v-2H2V9h2v2h2V9h2V7h2V5h2V3z'],
  shield: ['M3 2h10v6h-1v3h-2v2H8v1H6v-1H4v-2H3V2z'],
  search: ['M4 2h5v1h2v5h-1v1h2v2h2v2h-2v-2h-2v-1H9v1H4v-1H2V4h2V2zm1 2v5h4V4H5z'],
  network: ['M6 1h4v3H6V1zM1 11h4v3H1v-3zm10 0h4v3h-4v-3zM7 4h2v4H7V4zm-4 4h10v2H3V8z'],
  puzzle: ['M5 2h4v2h3v4h-2v2h2v4H4v-3H2V7h2V4h1V2z'],
  code: ['M5 4h2v2H5v2H3V6h2V4zm0 4h2v2H5V8zm6-4h2v2h2v2h-2v2h-2V8h2V6h-2V4z'],
  bug: ['M6 2h4v2h2v2h2v2h-2v3h-2v2H6v-2H4V8H2V6h2V4h2V2z'],
  question: ['M6 2h4v1h2v3h-2v2H8v2H6V7h2V6h2V4H6v2H4V3h2V2zm0 10h2v2H6v-2z'],
};

export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths = PIXEL_PATHS[name];
  if (paths) {
    return (
      <svg
        class={`pixel-icon pixel-svg ${name === 'crown' ? 'pixel-crown' : ''}`}
        viewBox="0 0 16 16"
        width={size}
        height={size}
        shape-rendering="crispEdges"
        fill="currentColor"
        aria-hidden="true"
      >
        {paths.map((d, idx) => (
          <path key={idx} d={d} />
        ))}
      </svg>
    );
  }
  return (
    <img
      class="pixel-icon"
      src={asset(`icons/${name}.svg`)}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}

export function Mascot({ name = 'welcome', className = '' }: { name?: string; className?: string }) {
  return (
    <img
      class={`mascot gopher ${className}`}
      src={asset(`mascot/${name}.png`)}
      alt=""
      aria-hidden="true"
    />
  );
}

export function Gopher({ name = 'welcome', className = '' }: { name?: string; className?: string }) {
  return <Mascot name={name} className={className} />;
}

export function Card({ children, className = '' }: { children: ComponentChildren; className?: string }) {
  return <section class={`card ${className}`}>{children}</section>;
}

export function Button({
  children,
  kind = 'primary',
  onClick,
  disabled = false,
}: {
  children: ComponentChildren;
  kind?: 'primary' | 'outline' | 'quiet' | 'senior';
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" class={`btn btn-${kind}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div class="page-heading">
      <span class="eyebrow small">{eyebrow}</span>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
