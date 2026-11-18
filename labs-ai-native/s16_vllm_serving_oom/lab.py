def admit_inference_request(active_reqs: int, max_concurrency: int, auth_valid: bool) -> tuple[bool, int]:
    """Enforces authentication and bounded concurrency to prevent GPU OOM."""
    if not auth_valid:
        return False, 401
    if active_reqs >= max_concurrency:
        return False, 429
    return True, 200
