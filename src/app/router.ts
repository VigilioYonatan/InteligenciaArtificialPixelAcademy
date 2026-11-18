import { useEffect, useState } from 'preact/hooks';

export function useHash(): string {
  const [value, setValue] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const fn = () => setValue(window.location.hash || '#/');
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return value;
}

export function routeTo(path: string): void {
  window.location.hash = `#/${path}`;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

export function getRoute(hash: string): string[] {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}
