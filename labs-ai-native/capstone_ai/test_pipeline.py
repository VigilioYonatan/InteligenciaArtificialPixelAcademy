import unittest
from capstone_ai.pipeline import CapstoneRagPlatform

class TestCapstoneAiPlatform(unittest.TestCase):
    def test_enforces_acl_citations_budget_and_idempotency(self):
        plat = CapstoneRagPlatform({"t1": 0.50})
        chunks = [
            {"id": "c1", "tenant_id": "t1", "visibility": "restricted", "allowed_roles": ["hr"]},
            {"id": "c2", "tenant_id": "t1", "visibility": "tenant_public", "allowed_roles": []},
            {"id": "c3", "tenant_id": "t2", "visibility": "tenant_public", "allowed_roles": []},
        ]
        # Unauthorized cite c1 -> abstains
        r1 = plat.answer_question("t1", {"dev"}, "req-1", 0.20, chunks, ["c1"])
        self.assertEqual(r1["status"], "abstained")
        # Authorized cite c2 -> answered, and repeat request_id is idempotent (does not double-charge)
        r2 = plat.answer_question("t1", {"dev"}, "req-2", 0.20, chunks, ["c2"])
        r3 = plat.answer_question("t1", {"dev"}, "req-2", 0.20, chunks, ["c2"])
        self.assertEqual(r2["status"], "answered")
        self.assertEqual(r2, r3)
        self.assertAlmostEqual(plat.balances["t1"], 0.10)
        # Budget exhausted -> blocked
        r4 = plat.answer_question("t1", {"dev"}, "req-3", 0.20, chunks, ["c2"])
        self.assertEqual(r4["status"], "budget_exceeded")
