import unittest
from s13_rerank_p99_latency.lab import cap_rerank_and_context

class TestS13RerankLatency(unittest.TestCase):
    def test_caps_candidates_and_final_context(self):
        selected, pool_len = cap_rerank_and_context([f"c{i}" for i in range(200)])
        self.assertEqual(pool_len, 20)
        self.assertEqual(len(selected), 6)
