def cap_rerank_and_context(candidates: list[str], max_rerank: int = 20, max_context: int = 6) -> tuple[list[str], int]:
    """Bounds cross-encoder fan-out and final context chunks to protect p99 latency."""
    reranked_pool = candidates[:max_rerank]
    return reranked_pool[:max_context], len(reranked_pool)
