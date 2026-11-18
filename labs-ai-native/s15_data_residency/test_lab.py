import unittest
from s15_data_residency.lab import select_compliant_endpoint

class TestS15DataResidency(unittest.TestCase):
    def test_never_falls_back_to_non_compliant_region_or_training_tier(self):
        eps = [
            {"id": "us-free", "region": "us", "healthy": True, "trains_on_data": True},
            {"id": "eu-2", "region": "eu", "healthy": True, "trains_on_data": False},
        ]
        chosen = select_compliant_endpoint(eps, "eu")
        self.assertEqual(chosen["id"], "eu-2")
