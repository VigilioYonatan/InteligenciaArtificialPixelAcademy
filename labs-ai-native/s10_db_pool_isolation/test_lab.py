import unittest
from s10_db_pool_isolation.lab import allocate_worker_concurrency

class TestS10DbIsolation(unittest.TestCase):
    def test_reserves_capacity_for_online_rag(self):
        self.assertEqual(allocate_worker_concurrency(40, 35), 5)
        self.assertEqual(allocate_worker_concurrency(100, 70), 8)
