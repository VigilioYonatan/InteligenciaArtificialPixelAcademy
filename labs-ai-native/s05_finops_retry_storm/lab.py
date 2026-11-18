def next_attempt_allowed(attempt: int, max_retries: int, budget_remaining_usd: float, est_usd: float) -> bool:
    """Bounds retry storms and enforces positive remaining budget."""
    return attempt <= max_retries and est_usd > 0 and budget_remaining_usd >= est_usd
