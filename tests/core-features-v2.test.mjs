import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { frameworkUnits } from '../src/features/frameworks/data/framework-units.ts';
import {
  bugBank,
  completeBank,
  orderBank,
  predictBank,
  quizBank,
} from '../src/features/games/data/game-bank.ts';
import { analyzeSnippet } from '../src/features/playground/analyzer.mjs';

test('BDD: all 40 Framework units (F01-F08 x 5) are not pre-solved and have passing solutions', () => {
  const keys = Object.keys(frameworkUnits);
  assert.equal(keys.length, 8);
  let total = 0;
  for (const [fw, units] of Object.entries(frameworkUnits)) {
    assert.equal(units.length, 5, `${fw} must have 5 units`);
    for (const u of units) {
      total += 1;
      assert.equal(u.test(u.starterCode), false, `${fw}-${u.unit} starterCode must fail`);
      assert.equal(u.test(u.solutionCode), true, `${fw}-${u.unit} solutionCode must pass`);
    }
  }
  assert.equal(total, 40);
});

test('BDD: all 5 minigames have 10 rounds each (5 RAG & ACL + 5 Agents & FinOps = 50 rounds total AI)', () => {
  for (const [name, bank] of [
    ['quiz', quizBank],
    ['complete', completeBank],
    ['predict', predictBank],
    ['bug', bugBank],
    ['order', orderBank],
  ]) {
    assert.equal(bank.length, 10, `${name} must have 10 rounds`);
    assert.equal(bank.filter((r) => r.domain === 'rag').length, 5, `${name} needs 5 RAG & ACL rounds`);
    assert.equal(bank.filter((r) => r.domain === 'agents').length, 5, `${name} needs 5 Agents & FinOps rounds`);
  }
});

test('BDD: all 6 official badge SVGs exist in public/assets/badges/', () => {
  for (const id of ['starter', 'coder', 'detective', 'architect', 'senior', 'graduate']) {
    const p = new URL(`../public/assets/badges/${id}.svg`, import.meta.url);
    assert.ok(existsSync(p), `Missing badge asset: ${id}.svg`);
  }
});

test('BDD: Playground static analyzer detects NestJS, LangGraph, pgvector ACL and MCP antipatterns', () => {
  const nestBad = analyzeSnippet('nestjs', 'return rag.ask(body.tenantId, body.q);');
  assert.equal(nestBad.status, 'warning');
  assert.ok(nestBad.findings.some((f) => f.rule === 'AI-TENANT-FROM-BODY'));

  const graphBad = analyzeSnippet('langgraph', 'await graph.invoke({ query });');
  assert.ok(graphBad.findings.some((f) => f.rule === 'AI-GRAPH-NO-LIMIT'));

  const sqlBad = analyzeSnippet('sql', 'SELECT id FROM chunks ORDER BY emb <=> $1');
  assert.ok(sqlBad.findings.some((f) => f.rule === 'RAG-SQL-ACL'));

  const mcpBad = analyzeSnippet('mcp', 'return fs.readFileSync(path.join(root, reqPath));');
  assert.ok(mcpBad.findings.some((f) => f.rule === 'MCP-PATH-TRAVERSAL'));

  const sqlGood = analyzeSnippet(
    'sql',
    'SELECT id FROM chunks WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY emb <=> $2 LIMIT 8',
  );
  assert.equal(sqlGood.status, 'clean');
});

test('BDD: SeniorModuleHub no longer leaks Spanish review/guide labels in en/ja/zh/fr', () => {
  const src = readFileSync(
    new URL('../src/features/senior/SeniorModuleHub.tsx', import.meta.url),
    'utf8',
  );
  const reviewMatches = [...src.matchAll(/btnReview:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.equal(reviewMatches.length, 6);
  assert.equal(
    reviewMatches.filter((s) => s.includes('Revisar código AI')).length,
    2,
    'Only es and pt should use Revisar código AI',
  );
});
