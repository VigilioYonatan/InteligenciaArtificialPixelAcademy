import { analyzeSnippet, type PlaygroundLanguage } from './analyzer.mjs';

self.onmessage = (event: MessageEvent<{ id: number; language: PlaygroundLanguage; code: string }>) => {
  const { id, language, code } = event.data;
  const result = analyzeSnippet(language, code);
  self.postMessage({ id, result });
};
