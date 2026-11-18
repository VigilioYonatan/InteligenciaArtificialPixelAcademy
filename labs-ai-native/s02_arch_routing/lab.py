def choose_execution_path(query_type: str) -> str:
    """Routes exact transactional lookups to SQL/API and documentary queries to Hybrid RAG."""
    if query_type == "transactional_state":
        return "authorized_sql_api"
    if query_type == "document_policy":
        return "hybrid_rag_with_citations"
    return "abstain_or_clarify"
