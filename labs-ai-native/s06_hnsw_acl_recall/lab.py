def should_enable_iterative_scan(tenant_corpus_ratio: float, exact_hits: int, hnsw_hits: int) -> bool:
    """Detects post-filter HNSW recall collapse on small tenants."""
    return tenant_corpus_ratio < 0.05 and exact_hits > 0 and hnsw_hits == 0
