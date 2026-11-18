import hashlib

class CapstoneRagPlatform:
    """Combines multi-tenant ACL retrieval, citation verification, idempotency, and atomic FinOps."""
    def __init__(self, balances_usd: dict[str, float]) -> None:
        self.balances = dict(balances_usd)
        self.idempotency: dict[str, dict] = {}

    def answer_question(
        self,
        tenant_id: str,
        user_roles: set[str],
        request_id: str,
        est_cost_usd: float,
        chunks: list[dict],
        cited_ids: list[str],
    ) -> dict:
        if request_id in self.idempotency:
            return self.idempotency[request_id]
        if self.balances.get(tenant_id, 0.0) < est_cost_usd:
            return {"status": "budget_exceeded", "citations": []}
        self.balances[tenant_id] = round(self.balances[tenant_id] - est_cost_usd, 6)

        allowed = [
            c for c in chunks
            if not c.get("deleted_at")
            and c.get("tenant_id") == tenant_id
            and (c.get("visibility") == "tenant_public" or bool(set(c.get("allowed_roles", [])) & user_roles))
        ]
        allowed_ids = {c["id"] for c in allowed}
        if not allowed_ids or not cited_ids or not all(cid in allowed_ids for cid in cited_ids):
            res = {"status": "abstained", "citations": []}
        else:
            res = {"status": "answered", "citations": list(cited_ids)}
        self.idempotency[request_id] = res
        return res
