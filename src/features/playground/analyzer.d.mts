export type PlaygroundLanguage = 'nestjs' | 'langgraph' | 'sql' | 'mcp';

export type PlaygroundFinding = {
  severity: 'high' | 'medium';
  rule: string;
  message: string;
};

export type PlaygroundAnalysis = {
  language: PlaygroundLanguage;
  lineCount: number;
  findings: PlaygroundFinding[];
  status: 'clean' | 'warning';
  executedInWorker: boolean;
};

export function analyzeSnippet(language: PlaygroundLanguage, source: string): PlaygroundAnalysis;
