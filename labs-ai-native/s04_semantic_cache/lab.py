import hashlib

def build_cache_key(pipeline_ver: str, tenant_id: str, acl_roles: list[str], query: str) -> str:
    acl_sig = hashlib.sha256(",".join(sorted(acl_roles)).encode()).hexdigest()[:12]
    q_sig = hashlib.sha256(query.strip().lower().encode()).hexdigest()[:16]
    return f"rag:{pipeline_ver}:{tenant_id}:{acl_sig}:{q_sig}"
