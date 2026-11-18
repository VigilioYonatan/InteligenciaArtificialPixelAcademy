import re

PII_RX = re.compile(r"(Bearer\s+[A-Za-z0-9._-]+|\b\d{8}\b|[\w.+-]+@[\w-]+\.[\w.-]+)")

def redact_span_attributes(attrs: dict) -> dict:
    """Strips raw prompts and redacts PII/tokens before exporting OTel spans."""
    safe = {k: v for k, v in attrs.items() if k not in {"gen_ai.prompt", "gen_ai.completion"}}
    for k, v in list(safe.items()):
        if isinstance(v, str):
            safe[k] = PII_RX.sub("[REDACTED]", v)
    return safe
