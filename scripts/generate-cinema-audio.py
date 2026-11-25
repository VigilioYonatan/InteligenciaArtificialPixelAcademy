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
SCRIPTS_PATHS = [
    ROOT / "src" / "features" / "cinema" / "data" / "batch1-scripts.json",
    ROOT / "src" / "features" / "cinema" / "data" / "batch2-scripts.json",
    ROOT / "src" / "features" / "cinema" / "data" / "batch3-scripts.json",
]
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
        ("Agentic RAG", "Ayéntic RAG"),
        ("GraphRAG", "Graf RAG"),
        ("Blue-Green", "Blu Grin"),
        ("Cross-Encoder", "Cros Encóuder"),
        ("PagedAttention", "Péicht Aténshon"),
        ("Markdown", "Márkdaun"),
        ("JSON.parse", "Jéison punto pars"),
        ("safeParse", "séif pars"),
        ("chunk_id", "chánk ai di"),
        ("chunkId", "chánk ai di"),
        ("doc_id", "dok ai di"),
        ("pipeline_version", "páip-lain vérshon"),
        ("acl_scope_hash", "hash del escóup A C L"),
        ("acl_epoch", "época A C L"),
        ("ef_construction", "e efe constrákshon"),
        ("ef_search", "e efe sérch"),
        ("max_model_len", "longitud máxima de modelo"),
        ("max_num_seqs", "máximo de secuencias"),
        ("TOCTOU", "tóctu"),
        ("RBAC", "erre be a ce"),
        ("JWT", "jota doble ve te"),
        ("GIN", "índice G I N"),
        ("LCEL", "L C E L"),
        ("Ragas", "Rágas"),
        ("MRR", "eme erre erre"),
        ("SQL", "ese cu ele"),
        ("RLS", "erre ele ese"),
        ("ACL", "A C L"),
        ("LLM", "ele ele eme"),
        ("PII", "datos personales"),
        ("np.linalg.norm", "ene pe punto linalg punto norm"),
        ("np.random.default_rng", "ene pe punto random punto default ar en yi"),
        ("np.random.seed", "ene pe punto random punto sid"),
        ("default_rng", "default ar en yi"),
        ("train_test_split", "trein test split"),
        ("Out-of-time", "aut of taim"),
        ("out-of-time", "aut of taim"),
        ("uv sync --frozen", "iu vi sinc fróuzen"),
        ("uv sync", "iu vi sinc"),
        ("uv.lock", "iu vi punto lock"),
        ("safe_mean", "séif min"),
        ("bootstrap_ci", "bútstrap ci"),
        ("cosine_similarity", "cósain similáriti"),
        ("temporal_split", "témporal split"),
        ("ValueError", "Valiu Érror"),
        ("NumPy", "Nám Pai"),
        ("pandas", "pándas"),
        ("SciPy", "Sái Pai"),
        ("cutoff", "kát of"),
        ("NaN", "not a námber"),
        ("scikit-learn", "saikit lern"),
        ("PyTorch", "PaiTorch"),
        ("LogisticRegression", "Loyístic Regréshon"),
        ("class_weight='balanced'", "clas weit balanced"),
        ("class_weight", "clas weit"),
        ("PR-AUC", "pe erre A U C"),
        ("ROC-AUC", "roc A U C"),
        ("average_precision_score", "áverage presíshon scor"),
        ("Population Stability Index", "Populéishon Stabíliti Índex"),
        ("PSI", "pe ese i"),
        ("np.clip", "ene pe punto clip"),
        ("ColumnTransformer", "Cólumn Transfórmer"),
        ("SimpleImputer", "Símpol Impiúter"),
        ("OneHotEncoder", "Guan Jot Encóuder"),
        ("handle_unknown", "jándol annóun"),
        ("one-hot", "guan jot"),
        ("train_imbalanced", "trein imbálansd"),
        ("compute_psi", "compiút pe ese i"),
        ("train_step", "trein step"),
        ("enforce_token_budget", "enfórs tóken bádyet"),
        ("optimizer.zero_grad", "optimáiser síro grad"),
        ("loss.backward", "los bácward"),
        ("clip_grad_norm_", "clip grad norm"),
        ("optimizer.step", "optimáiser step"),
        ("torch.no_grad", "torch nou grad"),
        ("zero_grad", "síro grad"),
        ("backward", "bácward"),
        ("model.eval", "módel ivál"),
        ("max_output", "máx áutput"),
        ("holdout", "joldaut"),
        ("accuracy", "áciuraci"),
        ("batchnorm", "bach norm"),
        ("autograd", "autógrad"),
        ("BPE", "be pe e"),
        ("HTTP", "ache te te pe"),
        ("YAML", "yámel"),
        ("FastAPI", "Fast E I Pi Ai"),
        ("MLflow", "eme ele flóu"),
        ("asyncio.wait_for", "asinc i o punto wéit for"),
        ("asyncio.Semaphore", "asinc i o punto Semáfór"),
        ("asyncio", "asinc i o"),
        ("TimeoutError", "Taimaut Érror"),
        ("HTTPException", "ache te te pe Ecsépshon"),
        ("BYPASSRLS", "báipas erre ele ese"),
        ("ALLOWED_TOOLS", "aloud túls"),
        ("MUTATING_TOOLS", "miuteting túls"),
        ("verify_rag_citations", "verifái rag saitéishons"),
        ("authorize_tool_call", "ósorais tul col"),
        ("eval_release_gate", "ivál rilís guéit"),
        ("infer_handler", "ínfer jándler"),
        ("search_docs", "sérch docs"),
        ("create_ticket", "criéit tíket"),
        ("run_inference", "ran ínferens"),
        ("recall_at_5", "rícol at cinco"),
        ("faithfulness", "féizfulnes"),
        ("injection_leak_rate", "tasa de fuga por inyección"),
        ("min_score", "mínimo escor"),
        ("max_steps", "máximo de pasos"),
        ("tool_name", "nombre de la herramienta"),
        ("event loop", "ívent lup"),
        ("healthchecks", "jélz cheks"),
        ("healthcheck", "jélz chek"),
        ("backpressure", "bák preshur"),
        ("timeout", "taimáut"),
        ("LIMIT", "límit"),
        ("raw_prompt", "ró prompt"),
        ("build_safe_span_attrs", "bild séif span átrs"),
        ("gen_ai.request.model", "yen ei ai punto request punto módel"),
        ("hmac.compare_digest", "eich mac punto compér dáyest"),
        ("compare_digest", "compér dáyest"),
        ("verify_artifact_sha256", "verifái ártifact sha dos cincuenta y seis"),
        ("payload_bytes", "péiloud báits"),
        ("expected_sha256", "ekspécted sha dos cincuenta y seis"),
        ("hexdigest", "jéks dáyest"),
        ("Safetensors", "Séif ténsors"),
        ("pickle", "píkol"),
        ("reserve_budget", "risérv bádyet"),
        ("with lock:", "güiz lok"),
        ("stepReducer", "step rediúser"),
        ("in-place", "in pléis"),
        ("state.steps", "stéit punto steps"),
        ("state.chunks.length", "stéit punto chanks punto lenz"),
        ("estimated_cost", "costo estimado"),
        ("user_id", "yúser ai di"),
        ("request_id", "ricuést ai di"),
        ("DevSecOps", "Dev Sec Ops"),
        ("OWASP", "O guasp"),
        ("SLOs", "ese ele os"),
        ("SLO", "ese ele o"),
        ("Prometheus", "Promízius"),
        ("abstain", "abstéin"),
        ("generate", "yénereit"),
        ("retriever", "ritríver"),
        ("inmutable", "inmutable"),
        ("plainto_tsquery", "pléin tu ti es cuéri"),
        ("to_tsquery", "tu ti es cuéri"),
        ("search_tsv", "sérch te ese uve"),
        ("requiresApproval", "ricuáiers aprúval"),
        ("state.approved", "stéit punto aprúvd"),
        ("interrupt", "interrápt"),
        ("configurable", "configuiurabol"),
        ("graph.invoke", "graf punto invóuk"),
        ("GraphRecursionError", "Graf Ricórshon Érror"),
        ("SKUs", "ese ka us"),
        ("SKU", "ese ka u"),
        ("POL-88412", "pe o ele guion ochenta y ocho cuatro doce"),
        ("K8S-409", "ca ocho ese guion cuatrocientos nueve"),
        ("SQLi", "ese cu ele inyécshon"),
        ("SQL injection", "ese cu ele inyécshon"),
        ("t_acme", "te ácme"),
        ("AbortController", "Abórt Contróler"),
        ("controller.abort", "contróler punto abórt"),
        ("req.on close", "rec punto on clóus"),
        ("this.budget.reserve", "dis punto bádyet punto risérv"),
        ("this.service.answer", "dis punto sérvis punto ánser"),
        ("actor.tenantId", "áctor punto ténant ai di"),
        ("body.tenantId", "bódi punto ténant ai di"),
        ("PgBouncer", "Pi Yi Báuncer"),
        ("ef_search", "e efe sérch"),
        ("controller", "contróler"),
        ("hashlib.sha256", "jáshlib punto sha dos cincuenta y seis"),
        ("existing_hash", "hash existente"),
        ("time.sleep", "taim punto eslíp"),
        ("asyncio.sleep", "asinc i o punto eslíp"),
        ("asyncio.to_thread", "asinc i o punto tu zréd"),
        ("to_thread", "tu zréd"),
        ("async def", "éinsinc def"),
        ("Uvicorn", "Iúvicorn"),
        ("torch.load", "torch punto loud"),
        ("weights_only", "wéits óunli"),
        ("read_doc", "rid doc"),
        ("reqPath", "rec paz"),
        ("startsWith", "starts güiz"),
        ("httpx", "ache te te pe equis"),
        ("top_pool", "top pul"),
        ("slice", "esláis"),
        ("mcp:docs:read", "m c p docs read"),
        ("mcp:tickets:write", "m c p tickets write"),
        ("mcp:admin", "m c p admin"),
        ("ToolArgsSchema.parse", "Tul Args Esquíma punto pars"),
        ("rawArgs", "ró args"),
        ("actor.scopes", "áctor punto escóups"),
        ("actorId", "áctor ai di"),
        ("auditLog", "ódit log"),
        ("hashId", "jash ai di"),
        ("Authorization", "Ozorizéishon"),
        ("Bearer", "Bérer"),
        ("authorizedRetrieved.has", "ózoraizd ritrívd punto jas"),
        ("authorizedRetrieved", "ózoraizd ritrívd"),
        ("noEvidenceCases", "nou évidens kéises"),
        ("abstained", "abstéind"),
        ("FORBIDDEN", "forbíden"),
        ("denied", "dináid"),
        ("status ok", "estátus okéi"),
        ("Confused Deputy", "Confiúzd Dépiuti"),
        ("`", ""),
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
    for prefix, spoken in (("B", "be"), ("I", "i"), ("A", "a")):
        for n in range(1, 13):
            code = f"{prefix}{n:02d}"
            replacements.append((code, f"{spoken} {n:02d}" if n < 10 else f"{spoken} {n}"))
    for n in range(1, 19):
        code = f"AI{n:02d}"
        replacements.append((code, f"a i cero {n}" if n < 10 else f"a i {n}"))

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

    decks = []
    for sp in SCRIPTS_PATHS:
        if sp.exists():
            decks.extend(json.loads(sp.read_text(encoding="utf-8")))
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
