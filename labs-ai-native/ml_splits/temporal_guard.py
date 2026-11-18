import math
from typing import Iterable


def temporal_entity_split(records: list[dict], cutoff_iso: str) -> tuple[list[dict], list[dict]]:
    """Strict out-of-time split ensuring train timestamps precede test timestamps."""
    train = [r for r in records if r["ts"] < cutoff_iso]
    test = [r for r in records if r["ts"] >= cutoff_iso]
    if train and test:
        assert max(r["ts"] for r in train) < min(r["ts"] for r in test)
    return train, test


def compute_psi(expected: Iterable[float], actual: Iterable[float], eps: float = 1e-6) -> float:
    """Numerically stable Population Stability Index."""
    psi = 0.0
    for e_raw, a_raw in zip(expected, actual):
        e = min(1.0, max(eps, e_raw))
        a = min(1.0, max(eps, a_raw))
        psi += (a - e) * math.log(a / e)
    return round(psi, 6)
