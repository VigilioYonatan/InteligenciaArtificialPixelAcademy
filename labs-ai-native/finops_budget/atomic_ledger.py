import threading


class AtomicBudgetLedger:
    """Thread-safe FinOps budget reservation and reconciliation."""

    def __init__(self, initial_balances: dict[str, int]) -> None:
        self._balances = dict(initial_balances)
        self._lock = threading.Lock()

    def reserve(self, tenant_id: str, estimated_tokens: int) -> bool:
        if estimated_tokens <= 0:
            raise ValueError("estimated_tokens must be positive")
        with self._lock:
            bal = self._balances.get(tenant_id, 0)
            if bal < estimated_tokens:
                return False
            self._balances[tenant_id] = bal - estimated_tokens
            return True

    def reconcile(self, tenant_id: str, reserved_tokens: int, actual_tokens: int) -> int:
        if actual_tokens < 0:
            raise ValueError("actual_tokens must be non-negative")
        refund = max(0, reserved_tokens - actual_tokens)
        with self._lock:
            self._balances[tenant_id] = self._balances.get(tenant_id, 0) + refund
            return self._balances[tenant_id]

    def balance_of(self, tenant_id: str) -> int:
        with self._lock:
            return self._balances.get(tenant_id, 0)
