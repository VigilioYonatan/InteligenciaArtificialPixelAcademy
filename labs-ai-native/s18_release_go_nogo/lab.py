REQUIRED_CONTROLS = (
    "cross_tenant_acl",
    "citation_verification",
    "prompt_injection_tests",
    "finops_atomic_cap",
    "gdpr_erasure",
    "otel_no_pii",
)

def release_decision(gate_results: dict[str, str]) -> str:
    """Fails closed: every mandatory control must be explicitly PASS."""
    for ctrl in REQUIRED_CONTROLS:
        if gate_results.get(ctrl) != "PASS":
            return "NO-GO"
    return "GO"
