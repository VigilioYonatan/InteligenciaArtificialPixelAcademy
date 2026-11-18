# AI Academy release gates

1. Verify no original source path was removed (`scripts/verify-preservation.py`).
2. `npm ci` on clean machine, then `npm run typecheck`, `npm run lint:ci`, `npm run build`.
3. `npm test`, `npm run test:ai`, `npm run test:security`.
4. `go test ./...` under `labs-native` (or project Go version).
5. Audit dependencies, run secret scanning and artifact hashes before release. Independently review findings, do not treat `npm audit` exit status as the whole risk assessment.
6. Smoke test live navigation `#/ai` and `#/ai/SAI01` with real browser.
7. Do not publish until authenticated production-grade lab execution has security sign-off.

Important: this ZIP is an additive project extension, not a production-ready AI compute platform.
