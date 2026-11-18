---
name: axon-pixel-cinema
version: 0.8.0
description: Reproductor minimalista de cuadro único (AxonPlayer) con 5 pizarras HTML/CSS de Arquitectura de IA y pistas de audio neuronal HD conversacional a 2 voces masterizadas en estudio para AIPixel Architecture Academy.
---

# Axon Pixel Cinema — Arquitectura y Operación en AIPixel Academy

## Propiedad y archivos del módulo

- `src/features/cinema/types/cinema.types.ts` — contratos `CinemaDeck`, `CinemaScene`, `StageVisual`, `SpeakerRole` y `StudioAudioMeta`.
- `src/features/cinema/engine/clock.mjs` (`.d.mts`) — cálculo puro de timeline, resolución de escena activa por `cues[]` y generación `WebVTT` (`0` DOM/Preact).
- `src/features/cinema/data/audio-manifest.json` — tiempos exactos (`totalSec`, `cues[]`, `speakers[]`) medidos sobre las pistas `.mp3` masterizadas.
- `src/features/cinema/data/storyboards.ts` — decks declarativos (`home-intro`, `senior-overview`, `b01`, `senior-s01`, `f01` y siguientes lotes).
- `src/features/cinema/AxonPlayer.tsx` — reproductor de pantalla única (`.cinema-screen`) con póster limpio `▶`, badge de locutor con ecualizador, 5 pizarras IA (`rag-acl`, `prompt-shield`, `agent-lanes`, `code-diff`, `finops-terminal`), subtítulos `CC`, `<track kind="captions">` (`WebVTT`), `scrubber` continuo y reloj dual resiliente.
- `scripts/generate-cinema-audio.py` — generador y masterizador DSP (`edge-tts` `es-CO-SalomeNeural` + `es-ES-AlvaroNeural` + pad armónico estéreo `24 kHz` + `ffmpeg` → `public/audio/*.mp3` + `audio-manifest.json`).

## Gates obligatorios
- Regenerar audio de estudio cuando cambien guiones: `python scripts/generate-cinema-audio.py`
- Integridad de manifiesto y pistas: `node --test tests/cinema-integrity.test.mjs`
- Lint, tipos y UI: `npm run lint:ci`, `npm run typecheck`, `npm run test:ui`
- E2E y viewport móvil `390×844` sin overflow horizontal + `python scripts/verify-preservation.py`
