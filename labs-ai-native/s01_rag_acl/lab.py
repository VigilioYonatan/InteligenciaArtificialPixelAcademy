def filter_authorized_chunks(chunks: list[dict], tenant_id: str, user_roles: set[str]) -> list[dict]:
    """Enforces tenant + user/document ACL before any chunk enters LLM context."""
    return [
        c for c in chunks
        if not c.get("deleted_at")
        and c.get("tenant_id") == tenant_id
        and (c.get("visibility") == "tenant_public" or bool(set(c.get("allowed_roles", [])) & user_roles))
    ]
