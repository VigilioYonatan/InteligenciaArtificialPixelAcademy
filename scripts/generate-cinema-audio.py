#!/usr/bin/env python3
"""
Studio-grade 2-voice neural audio & DSP mastering pipeline for AIPixel Architecture Academy.
Reads single source of truth from src/features/cinema/data/batch1-scripts.json.
Follows Vigilio canonical standard: interactive-cinema-and-studio-audio.md
"""

import argparse
import asyncio
import json
import math
import struct
import subprocess
import sys
import tempfile
import wave
from pathlib import Path
import edge_tts

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
AUDIO_OUT_DIR = ROOT / "public" / "audio"
SCRIPTS_PATH = ROOT / "src" / "features" / "cinema" / "data" / "batch1-scripts.json"
MANIFEST_PATH = ROOT / "src" / "features" / "cinema" / "data" / "audio-manifest.json"


def find_ffmpeg() -> str:
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


FFMPEG = find_ffmpeg()

VOICE_HOST = "es-CO-SalomeNeural"
VOICE_AXON = "es-ES-AlvaroNeural"


def clean_for_speech(text: str) -> str:
    """Translates AI & Software technical symbols into natural spoken Spanish prosody before neural TTS."""
    replacements = [
        ("AIPixel Academy", "A I Píxel Academy"),
        ("AIPixel", "A I Píxel"),
        ("pgvector", "pí yi véctor"),
        ("PostgreSQL", "Póstgres"),
        ("Hybrid RAG", "Háibrid RAG"),
        ("Multi-Tenant", "multi ténant"),
        ("multi-tenant", "multi ténant"),
        ("cross-tenant", "cros ténant"),
        ("Cross-Tenant", "cros ténant"),
        ("cross-user", "cros yúser"),
        ("tenant_id", "ténant ai di"),
        ("allowed_principals", "principales autorizados"),
        ("<untrusted_context>", "etiqueta untrusted context"),
        ("untrusted_context", "untrusted context"),
        ("recursionLimit", "límite de recursión"),
        ("StateGraph", "Stéit Graf"),
        ("LangGraph", "Láng Graf"),
        ("LangChain", "Láng Chein"),
        ("Langfuse", "Láng fiús"),
        ("Arize Phoenix", "Aráiz Fínix"),
        ("AnswerGeneratorPort", "puerto Answer Generator"),
        ("KnowledgeRetriever", "Knowledge Retriever"),
        ("BudgetAuthorizer", "Budget Authorizer"),
        ("ZodValidationPipe", "Zod Validation Pipe"),
        ("AuthGuard", "Auth Guard"),
        ("AbortSignal", "Abort Signal"),
        ("SpanProcessor", "Span Processor"),
        ("trace_id", "tréis ai di"),
        ("thread_id", "zréd ai di"),
        ("acl_epoch", "época A C L"),
        ("embedding_model", "modelo de embedding"),
        ("document_chunks", "document chunks"),
        ("deleted_at", "borrado lógico"),
        ("maxContext", "máx cóntext"),
        ("maxOutput", "máx áutput"),
        ("availableInput", "avéilabol ínput"),
        ("inputTokens", "ínput tókens"),
        ("Math.max(0, maxContext - maxOutput)", "Math punto max de cero y máx cóntext menos máx áutput"),
        ("createRefund", "create refund"),
        ("idempotency_key", "clave de idempotencia"),
        ("Promise.all", "prómis ol"),
        ("max_connections", "máximo de conexiones"),
        ("max_model_len", "longitud máxima de modelo"),
        ("max_num_seqs", "máximo de secuencias"),
        ("Retry-After", "rétrai áfter"),
        ("vLLM", "uve ele ele eme"),
        ("VRAM", "uve RAM"),
        ("KV Cache", "caché clave valor"),
        ("OOM", "agotamiento de memoria"),
        ("CUDA OOM", "agotamiento de memoria CUDA"),
        ("SSRF", "petición falsificada del lado del servidor"),
        ("IDOR", "acceso directo inseguro a objetos"),
        ("GDPR", "G D P R"),
        ("TTFT", "tiempo al primer token"),
        ("SDKs", "es de kás"),
        ("SDK", "ese de ka"),
        ("HNSW", "índice H N S W"),
        ("iterative_scan", "escaneo iterativo"),
        ("hnsw.iterative_scan", "escaneo iterativo H N S W"),
        ("relaxed_order", "modo orden relajado"),
        ("Recall@K", "rícol at K"),
        ("Recall@5", "rícol at cinco"),
        ("nDCG", "ene de ce ge"),
        ("RRF", "fusión por rango recíproco"),
        ("FTS", "búsqueda de texto completo"),
        ("tsvector", "te ese véctor"),
        ("HITL", "aprobación humana"),
        ("MCP", "protocolo M C P"),
        ("OpenTelemetry", "Ópen Telémetri"),
        ("OTel", "Ópen Telémetri"),
        ("FinOps", "Fin Ops"),
        ("PII", "datos personales"),
        ("Pydantic v2", "Paidántic versión dos"),
        ("extra='forbid'", "modo estricto sin campos extra"),
        ("SHA-256", "sha dos cincuenta y seis"),
        ("Go/No-Go", "go o nou go"),
        ("resolve()", "resólv"),
        ("P95", "percentil noventa y cinco"),
        ("P99", "percentil noventa y nueve"),
        ("p95", "percentil noventa y cinco"),
        ("p99", "percentil noventa y nueve"),
        ("SSE", "eventos S S E"),
        ("JSON", "jéison"),
        ("SQL", "ese cu ele"),
        ("ACID", "ácid"),
        ("WHERE", "cláusula güer"),
        ("Top-K", "top K"),
        ("top-K", "top K"),
        ("3D", "tres de"),
        ("B01", "be cero uno"),
    ]
    for n in range(1, 19):
        code = f"S{n:02d}"
        replacements.append((code, f"ese {n:02d}" if n < 10 else f"ese {n}"))
    for n in range(1, 9):
        code = f"F{n:02d}"
        replacements.append((code, f"efe cero {n}"))

    out = text
    for old, new in replacements:
        out = out.replace(old, new)
    return out


def synthesize_ambient_bed(wav_path: Path, duration_sec: float, cue_times: list[float]) -> None:
    """Generates a warm 24kHz stereo harmonic ambient bed with intro swell, ducking & crystal cue chimes."""
    sample_rate = 24000
    total_samples = int((duration_sec + 0.6) * sample_rate)
    chord_freqs = [73.42, 110.00, 174.61, 220.00, 261.63, 329.63]
    cue_set = [t for t in cue_times if t > 0.2]

    buf = bytearray()
    two_pi = 2.0 * math.pi

    for n in range(total_samples):
        t = n / sample_rate
        if t < 0.35:
            env = (t / 0.35) * 0.11
        elif t < 1.1:
            env = 0.11 - ((t - 0.35) / 0.75) * 0.065
        elif t > duration_sec - 0.8:
            rem = max(0.0, (duration_sec + 0.55) - t) / 1.35
            env = 0.055 * (rem ** 1.4)
        else:
            env = 0.040 + 0.006 * math.sin(two_pi * 0.18 * t)

        pad_l = 0.0
        pad_r = 0.0
        for idx, f in enumerate(chord_freqs):
            detune = 1.0 + (0.0018 if idx % 2 == 0 else -0.0018)
            weight = 0.34 / (1.0 + idx * 0.35)
            s1 = math.sin(two_pi * f * t)
            s2 = math.sin(two_pi * f * detune * t + idx * 0.7)
            pad_l += weight * (0.65 * s1 + 0.35 * s2)
            pad_r += weight * (0.35 * s1 + 0.65 * s2)

        chime = 0.0
        if t < 0.9:
            chime += 0.05 * math.exp(-t * 4.2) * math.sin(two_pi * 587.33 * t)
            chime += 0.035 * math.exp(-t * 3.4) * math.sin(two_pi * 880.0 * t)
        for ct in cue_set:
            dt = t - ct
            if 0.0 <= dt < 0.55:
                chime += 0.032 * math.exp(-dt * 7.5) * math.sin(two_pi * 659.25 * dt)
                chime += 0.022 * math.exp(-dt * 6.0) * math.sin(two_pi * 987.77 * dt)

        left = max(-0.95, min(0.95, pad_l * env + chime))
        right = max(-0.95, min(0.95, pad_r * env + chime))
        buf += struct.pack("<hh", int(left * 32767), int(right * 32767))

    with wave.open(str(wav_path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(bytes(buf))


def probe_duration(media_path: Path) -> float:
    proc = subprocess.run(
        [FFMPEG, "-hide_banner", "-i", str(media_path)],
        capture_output=True,
        text=True,
    )
    out = proc.stderr or proc.stdout
    for line in out.splitlines():
        if "Duration:" in line:
            raw = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = raw.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    return 6.0


async def synth_turn(text: str, voice: str, rate: str, out_mp3: Path) -> float:
    comm = edge_tts.Communicate(clean_for_speech(text), voice=voice, rate=rate)
    await comm.save(str(out_mp3))
    return probe_duration(out_mp3)


async def build_deck_audio(
    deck_id: str,
    filename: str,
    scenes: list[dict],
    sem: asyncio.Semaphore,
) -> tuple[str, dict]:
    async with sem:
        out_file = AUDIO_OUT_DIR / filename
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            scene_wavs: list[Path] = []
            cues: list[float] = []
            cursor = 0.45

            for idx, sc in enumerate(scenes):
                cues.append(round(cursor, 2))
                raw_mp3 = tmp / f"s_{idx}.mp3"
                voice = VOICE_HOST if sc["speaker"] == "host" else VOICE_AXON
                rate = sc.get("rate", "+4%")
                await synth_turn(sc["speech"], voice, rate, raw_mp3)

                turn_wav = tmp / f"s_{idx}.wav"
                subprocess.run(
                    [
                        FFMPEG,
                        "-y",
                        "-hide_banner",
                        "-loglevel",
                        "error",
                        "-i",
                        str(raw_mp3),
                        "-af",
                        "silenceremove=start_periods=1:start_threshold=-48dB:stop_periods=-1:stop_duration=0.22:stop_threshold=-48dB,apad=pad_dur=0.28",
                        "-ar",
                        "24000",
                        "-ac",
                        "2",
                        str(turn_wav),
                    ],
                    check=True,
                )
                dur = probe_duration(turn_wav)
                scene_wavs.append(turn_wav)
                cursor += dur

            total_voice_dur = round(cursor + 0.35, 2)

            lead_wav = tmp / "lead.wav"
            subprocess.run(
                [
                    FFMPEG,
                    "-y",
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-f",
                    "lavfi",
                    "-i",
                    "anullsrc=r=24000:cl=stereo:d=0.45",
                    str(lead_wav),
                ],
                check=True,
            )

            concat_list = tmp / "concat.txt"
            lines = [f"file '{lead_wav.as_posix()}'"] + [
                f"file '{w.as_posix()}'" for w in scene_wavs
            ]
            concat_list.write_text("\n".join(lines), encoding="utf-8")

            voice_track = tmp / "voice_full.wav"
            subprocess.run(
                [
                    FFMPEG,
                    "-y",
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-f",
                    "concat",
                    "-safe",
                    "0",
                    "-i",
                    str(concat_list),
                    "-c",
                    "copy",
                    str(voice_track),
                ],
                check=True,
            )

            bed_wav = tmp / "bed.wav"
            synthesize_ambient_bed(bed_wav, total_voice_dur, cues)

            subprocess.run(
                [
                    FFMPEG,
                    "-y",
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-i",
                    str(voice_track),
                    "-i",
                    str(bed_wav),
                    "-filter_complex",
                    "[0:a]highpass=f=85,acompressor=threshold=-18dB:ratio=2.6:attack=10:release=140:makeup=3dB[v];"
                    "[v][1:a]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0:weights='1.0 0.65',alimiter=limit=0.95[out]",
                    "-map",
                    "[out]",
                    "-codec:a",
                    "libmp3lame",
                    "-b:a",
                    "80k",
                    "-ar",
                    "24000",
                    "-ac",
                    "2",
                    str(out_file),
                ],
                check=True,
            )

            final_dur = round(probe_duration(out_file), 2)
            speakers = [sc["speaker"] for sc in scenes]
            size_kb = round(out_file.stat().st_size / 1024, 1)
            print(f"  ✓ {filename} ({final_dur}s, {size_kb} KB)")
            return deck_id, {
                "src": f"audio/{filename}",
                "totalSec": final_dur,
                "cues": cues,
                "speakers": speakers,
            }


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only-missing", action="store_true", help="Skip decks whose MP3 and manifest entry already exist")
    args = parser.parse_args()

    AUDIO_OUT_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

    decks = json.loads(SCRIPTS_PATH.read_text(encoding="utf-8"))
    existing_manifest: dict[str, dict] = {}
    if MANIFEST_PATH.exists():
        existing_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    to_generate = []
    manifest: dict[str, dict] = {}
    for d in decks:
        did = d["id"]
        mp3_path = AUDIO_OUT_DIR / d["filename"]
        if (
            args.only_missing
            and did in existing_manifest
            and mp3_path.exists()
            and mp3_path.stat().st_size > 10_000
        ):
            manifest[did] = existing_manifest[did]
        else:
            to_generate.append(d)

    if to_generate:
        print(f"🎙 Generando {len(to_generate)} cápsulas de estudio con {FFMPEG}...")
        sem = asyncio.Semaphore(3)
        results = await asyncio.gather(
            *(build_deck_audio(d["id"], d["filename"], d["scenes"], sem) for d in to_generate)
        )
        for did, meta in results:
            manifest[did] = meta

    ordered = {d["id"]: manifest[d["id"]] for d in decks if d["id"] in manifest}
    MANIFEST_PATH.write_bytes((json.dumps(ordered, indent=2) + "\n").encode("utf-8"))
    total_kb = round(sum((AUDIO_OUT_DIR / d["filename"]).stat().st_size for d in decks) / 1024, 1)
    print(f"✅ Manifiesto escrito en {MANIFEST_PATH} ({len(ordered)} pistas, {total_kb} KB total)")


if __name__ == "__main__":
    asyncio.run(main())
