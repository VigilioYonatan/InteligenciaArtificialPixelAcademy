class IdempotentToolExecutor:
    def __init__(self) -> None:
        self._applied: dict[str, dict] = {}

    def run_once(self, idempotency_key: str, fn) -> dict:
        if idempotency_key in self._applied:
            return self._applied[idempotency_key]
        res = fn()
        self._applied[idempotency_key] = res
        return res
