#!/usr/bin/env node
/**
 * Registra rutas autorizadas en intentional_changes de ORIGINAL_INTEGRITY.json
 * sin alterar hashes ni eliminar archivos originales.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'ORIGINAL_INTEGRITY.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const args = process.argv.slice(2).map((p) => p.replace(/\\/g, '/').replace(/^\.\//, ''));
if (args.length === 0) {
  console.error('Uso: node scripts/update-integrity.mjs <ruta-relativa> [...]');
  process.exit(1);
}

const current = new Set(manifest.intentional_changes || []);
let added = 0;

for (const rel of args) {
  if (!Object.hasOwn(manifest.original_sha256, rel)) {
    console.log(`skip (nuevo archivo, no está en original_sha256): ${rel}`);
    continue;
  }
  if (!current.has(rel)) {
    current.add(rel);
    added += 1;
    console.log(`registered intentional_change: ${rel}`);
  } else {
    console.log(`already registered: ${rel}`);
  }
}

manifest.intentional_changes = [...current];
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`OK: ${added} ruta(s) añadida(s). Total intentional_changes=${manifest.intentional_changes.length}`);
