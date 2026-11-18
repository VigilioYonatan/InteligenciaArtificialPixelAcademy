def verify_resolvable_citations(cited_ids: list[str], retrieved_ids: set[str]) -> bool:
    """Requires non-empty citations all present in the authorized retrieved set."""
    return len(cited_ids) > 0 and all(cid in retrieved_ids for cid in cited_ids)
