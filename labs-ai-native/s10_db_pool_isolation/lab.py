def allocate_worker_concurrency(max_db_conns: int, reserved_online_conns: int) -> int:
    """Caps ingestion worker concurrency so live RAG traffic keeps reserved DB connections."""
    available = max(1, max_db_conns - reserved_online_conns)
    return min(8, available)
