import unittest
from s07_embedding_mismatch.lab import validate_vector_compatibility

class TestS07EmbeddingMismatch(unittest.TestCase):
    def test_rejects_model_mismatch_even_with_same_dimension(self):
        with self.assertRaises(ValueError):
            validate_vector_compatibility("embed-v1", "embed-v2", 1024, 1024)
