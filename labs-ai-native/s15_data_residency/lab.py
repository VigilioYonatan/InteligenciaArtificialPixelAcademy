def select_compliant_endpoint(endpoints: list[dict], required_region: str) -> dict | None:
    """Selects healthy failover endpoints only within approved region and zero-retention policy."""
    for ep in endpoints:
        if ep.get("healthy") and ep.get("region") == required_region and not ep.get("trains_on_data", True):
            return ep
    return None
