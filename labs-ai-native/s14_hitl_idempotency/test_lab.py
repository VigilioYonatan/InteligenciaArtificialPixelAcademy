import unittest
from s14_hitl_idempotency.lab import IdempotentToolExecutor

class TestS14Idempotency(unittest.TestCase):
    def test_executes_side_effect_exactly_once_for_same_key(self):
        ex = IdempotentToolExecutor()
        calls = 0
        def refund():
            nonlocal calls
            calls += 1
            return {"refund_id": "r1"}
        r1 = ex.run_once("step-991", refund)
        r2 = ex.run_once("step-991", refund)
        self.assertEqual(calls, 1)
        self.assertEqual(r1, r2)
