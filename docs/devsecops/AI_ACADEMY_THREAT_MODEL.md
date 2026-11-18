# Threat model — AI Engineering Academy extension

## Trust boundaries

- Browser stored answers are untrusted: sanitize on read and never accept them as authenticated credentials.
- Senior case content is shipped with the frontend: scores are educational self-assessments, **not** tamper-proof certifications.
- Assessment never executes arbitrary Python, shell, model tools, remote requests or uploaded files.
- Markdown / user justification must be rendered as text, never as trusted HTML.
- No external API keys or privileged model endpoints are bundled in this static frontend.

## Future server-side runner (not implemented)

Require separate per-run containers/microVMs, unprivileged UID, immutable base image, isolated network, no host mounts, seccomp/AppArmor, CPU/memory/wallclock/process/IO limits, secrets outside containers, signed image digest, execution audit, authorization, rate limits, abuse detection and egress deny by default. Do not put a public arbitrary-code execution endpoint online without independent review.

## Supply chain

Use locked versions, `npm ci`, dependency review, SAST, secret scanning, least-privilege CI and artifact integrity verification. Treat ZIP uploads, datasets and retrieval documents as untrusted. Do not publish credentials or private Vigilio documentation from supplied archives.

## Current known limitations

No hardened Python execution, authentication, grading verification, server persistence, E2E attestations or ML pipeline yet. No claim of full AI Engineering curriculum implementation; the 18 modules are a structured syllabus and 18 Senior cases are interactive but simplified.
