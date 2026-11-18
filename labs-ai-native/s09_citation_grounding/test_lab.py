import unittest
from s09_citation_grounding.lab import verify_resolvable_citations

class TestS09Citations(unittest.TestCase):
    def test_rejects_fabricated_clause_ids(self):
        self.assertFalse(verify_resolvable_citations(["NORM-994"], {"DOC-12"}))
        self.assertTrue(verify_resolvable_citations(["DOC-12"], {"DOC-12", "DOC-13"}))
