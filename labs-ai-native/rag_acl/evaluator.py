from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class Chunk:
    chunk_id: str
    tenant_id: str
    allowed_roles: tuple[str, ...]
    score: float
    text: str


def retrieve_authorized_chunks(
    corpus: Iterable[Chunk],
    tenant_id: str,
    user_roles: set[str],
    top_k: int = 5,
    min_score: float = 0.65,
) -> list[Chunk]:
    """Pre-retrieval ACL + relevance gate: never leaks cross-tenant chunks."""
    authorized = [
        c
        for c in corpus
        if c.tenant_id == tenant_id
        and any(role in user_roles for role in c.allowed_roles)
        and c.score >= min_score
    ]
    authorized.sort(key=lambda c: c.score, reverse=True)
    return authorized[:top_k]


def verify_citations(cited_ids: list[str], authorized_chunks: list[Chunk]) -> bool:
    """Requires abstention when no chunk passes gate and forbids fabricated IDs."""
    if not authorized_chunks or not cited_ids:
        return False
    valid_ids = {c.chunk_id for c in authorized_chunks}
    return set(cited_ids).issubset(valid_ids)
