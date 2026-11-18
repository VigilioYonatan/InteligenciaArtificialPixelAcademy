import unittest
from s06_hnsw_acl_recall.lab import should_enable_iterative_scan

class TestS06HnswRecall(unittest.TestCase):
    def test_detects_small_tenant_recall_collapse(self):
        self.assertTrue(should_enable_iterative_scan(0.003, 6, 0))
        self.assertFalse(should_enable_iterative_scan(0.40, 6, 6))
