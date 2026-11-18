import unittest
from rag_acl.evaluator import Chunk, retrieve_authorized_chunks, verify_citations


class TestRagAclEvaluator(unittest.TestCase):
    def setUp(self) -> None:
        self.corpus = [
            Chunk("c1", "tenant_a", ("reader",), 0.92, "Public tenant A policy"),
            Chunk("c2", "tenant_b", ("reader",), 0.99, "Secret tenant B policy"),
            Chunk("c3", "tenant_a", ("admin",), 0.88, "Admin only tenant A"),
            Chunk("c4", "tenant_a", ("reader",), 0.40, "Low relevance noise"),
        ]

    def test_cross_tenant_and_role_isolation(self) -> None:
        hits = retrieve_authorized_chunks(self.corpus, "tenant_a", {"reader"}, min_score=0.65)
        self.assertEqual([h.chunk_id for h in hits], ["c1"])

    def test_fabricated_citation_rejected(self) -> None:
        hits = retrieve_authorized_chunks(self.corpus, "tenant_a", {"reader"})
        self.assertTrue(verify_citations(["c1"], hits))
        self.assertFalse(verify_citations(["c2"], hits))
        self.assertFalse(verify_citations(["c_fake"], hits))
        self.assertFalse(verify_citations([], hits))


if __name__ == "__main__":
    unittest.main()
