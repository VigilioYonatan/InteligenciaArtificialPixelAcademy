def is_chronological_split(train_dates: list[str], eval_dates: list[str]) -> bool:
    """Ensures every evaluation sample occurs strictly after all training/index cutoff dates."""
    if not train_dates or not eval_dates:
        return False
    return max(train_dates) < min(eval_dates)
