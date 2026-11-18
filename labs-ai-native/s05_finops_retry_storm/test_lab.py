import unittest
from s05_finops_retry_storm.lab import next_attempt_allowed

class TestS05RetryStorm(unittest.TestCase):
    def test_stops_retries_at_cap_and_zero_budget(self):
        self.assertTrue(next_attempt_allowed(1, 2, 1.0, 0.25))
        self.assertFalse(next_attempt_allowed(3, 2, 1.0, 0.25))
        self.assertFalse(next_attempt_allowed(1, 2, 0.1, 0.25))
