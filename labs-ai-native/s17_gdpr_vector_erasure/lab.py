def erase_document_artifacts(doc_id: str, chunks_store: list[dict], cache: dict[str, str]) -> tuple[list[dict], dict[str, str]]:
    """Atomically purges chunks and cache references linked to an erased document."""
    remaining_chunks = [c for c in chunks_store if c.get("document_id") != doc_id]
    remaining_cache = {k: v for k, v in cache.items() if doc_id not in v}
    return remaining_chunks, remaining_cache
