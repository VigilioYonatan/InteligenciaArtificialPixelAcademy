import unittest
from s12_evals_temporal_leakage.lab import is_chronological_split

class TestS12Temporal(unittest.TestCase):
    def test_rejects_overlapping_future_dates(self):
        self.assertTrue(is_chronological_split(["2026-01-01", "2026-02-01"], ["2026-03-01"]))
        self.assertFalse(is_chronological_split(["2026-01-01", "2026-04-01"], ["2026-03-01"]))
