import unittest
from s17_gdpr_vector_erasure.lab import erase_document_artifacts

class TestS17GdprErasure(unittest.TestCase):
    def test_purges_all_chunks_and_cached_references(self):
        chunks = [{"id": "1", "document_id": "d44"}, {"id": "2", "document_id": "d99"}]
        cache = {"k1": "cite:d44", "k2": "cite:d99"}
        c_left, cache_left = erase_document_artifacts("d44", chunks, cache)
        self.assertEqual(len(c_left), 1)
        self.assertNotIn("k1", cache_left)
