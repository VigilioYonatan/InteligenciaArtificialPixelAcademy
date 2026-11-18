import concurrent.futures
import unittest
from finops_budget.atomic_ledger import AtomicBudgetLedger


class TestAtomicBudgetLedger(unittest.TestCase):
    def test_concurrent_reservations_never_overspend(self) -> None:
        ledger = AtomicBudgetLedger({"t1": 1000})
        with concurrent.futures.ThreadPoolExecutor(max_workers=16) as pool:
            results = list(pool.map(lambda _: ledger.reserve("t1", 300), range(20)))
        approved = sum(1 for ok in results if ok)
        self.assertEqual(approved, 3)
        self.assertEqual(ledger.balance_of("t1"), 100)

    def test_reconciliation_refunds_unused_tokens(self) -> None:
        ledger = AtomicBudgetLedger({"t1": 500})
        self.assertTrue(ledger.reserve("t1", 300))
        remaining = ledger.reconcile("t1", 300, 120)
        self.assertEqual(remaining, 380)


if __name__ == "__main__":
    unittest.main()
