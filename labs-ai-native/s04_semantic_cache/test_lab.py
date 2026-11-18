import unittest
from s04_semantic_cache.lab import build_cache_key

class TestS04SemanticCache(unittest.TestCase):
    def test_cache_keys_isolate_tenants_and_roles(self):
        k1 = build_cache_key("v2", "t1", ["hr"], "Bonus policy")
        k2 = build_cache_key("v2", "t1", ["intern"], "Bonus policy")
        k3 = build_cache_key("v2", "t2", ["hr"], "Bonus policy")
        self.assertNotEqual(k1, k2)
        self.assertNotEqual(k1, k3)
