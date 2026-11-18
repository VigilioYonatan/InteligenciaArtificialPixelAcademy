---
name: ux-interactive-cinema
description: Diseño e implementación de videos intro minimalistas de cuadro único, pizarras didácticas animadas en HTML/CSS sin gasto de tokens y audio neuronal HD conversacional a dos voces masterizado en estudio (estilo NotebookLM / trailers tech).
owner: governance-platform
lifecycle: stable
introduced_in: 0.8.0
routing_ecosystems: "any"
routing_keywords: "video intro,reproductor interactivo,cinema player,pizarra animada,notebooklm,voz neuronal,audio estudio,explicacion animada,onboarding video,tts profesional"
routing_files: "package.json"
routing_capabilities: "feature,ux,audio,onboarding"
---

# ux-interactive-cinema — Procedimiento Senior/Staff

1. **Regla de Cuadro Único Minimalista («Solo darle Play»):**
   - Prohibido apilar cajas periféricas fuera del reproductor (`.cinema-screen`).
   - En estado `idle`, renderizar un póster cinematográfico limpio con vista previa difuminada, duración en `Silkscreen` y un único botón circular central `▶`.
   - En `playing | paused`, integrar todo dentro de `.cinema-screen`: badge superior de locutor con ecualizador stepped + capítulos, pizarra semántica animada en el centro, subtítulos `CC` translúcidos y barra inferior con `scrubber` continuo y marcas `cues[]`.
2. **Ahorro total de tokens y megabytes:**
   - `CinemaDeck` deterministas (`0` llamadas a LLMs en runtime, `0 MB` de `.mp4` borrosos).
   - Pizarras DOM/CSS/SVG nítidas (`rag-acl`, `prompt-shield`, `agent-lanes`, `code-diff`, `finops-terminal`).
3. **Audio Neuronal HD a 2 Voces + Mastering DSP:**
   - Alternar `Sofía · Host` (`es-CO-SalomeNeural`) + `Axon · Mentor Senior` (`es-ES-AlvaroNeural`).
   - Aplicar limpieza fonética (`clean_for_speech`) antes del TTS manteniendo la sintaxis técnica exacta en pantalla y en `<track kind="captions" default>` (`WebVTT`).
   - Masterizar con `ffmpeg` (`silenceremove`, pad armónico `24 kHz` con *swell* y *ducking*, `highpass=85Hz`, `acompressor`, `alimiter` a `80 kbps` `.mp3`) y exportar `audio-manifest.json`.
   - Incluir adaptador de reloj dual resiliente (`stalledTicks >= 6` conmuta a reloj interno en entornos CI headless sin hardware de sonido).
