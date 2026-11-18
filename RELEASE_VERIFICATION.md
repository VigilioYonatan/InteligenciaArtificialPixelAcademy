# Release Verification — AIPixel Architecture Academy

Resumen reproducible de los controles de calidad de la plataforma **100% AI Architecture & Software Engineering**:

- **Lint & Accesibilidad:** `npm run lint:ci` (`@biomejs/biome` — `0` errores).
- **Contenido, Diccionarios y Cero Fuga Legacy:** `npm run check:content` (`100/100` pruebas deterministas, `62` módulos curriculares, `6` idiomas).
- **Tipado Estricto:** `npm run typecheck` (`tsc --noEmit` con `strict: true`).
- **Seguridad & AI Academy:** `npm run test:ai` y `npm run test:security`.
- **Componentes UI:** `npm run test:ui` (Vitest + Testing Library Preact).
- **Laboratorios Python Nativos (`S01`–`S18` + Capstone):** `python -m unittest discover -s labs-ai-native -t labs-ai-native -v` (`25/25` tests `OK`).
- **Build de Producción Estático:** `npm run build` (SPA estática con `three` separado en su propio chunk).
- **Integridad de Manifiesto:** `python scripts/verify-preservation.py` (`missing=0 unexpected_changes=0`).
- **Suite Master E2E Headless:** `node scripts/test-master-e2e.mjs` (`8/8` Quality Gates en navegador Chromium/Brave real con persistencia en `localStorage['aipixel:v1']`).
