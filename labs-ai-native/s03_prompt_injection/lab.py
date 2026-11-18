ALLOWED_TOOLS = {"search_policies", "get_claim_status"}

def authorize_tool_call(tool_name: str, user_roles: set[str], source_is_untrusted: bool) -> bool:
    """Never allows untrusted document text to unlock privileged or unlisted tools."""
    if source_is_untrusted and tool_name not in ALLOWED_TOOLS:
        return False
    return tool_name in ALLOWED_TOOLS and ("reader" in user_roles or "admin" in user_roles)
