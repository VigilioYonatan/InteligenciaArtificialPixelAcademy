import unittest
from s16_vllm_serving_oom.lab import admit_inference_request

class TestS16VllmServing(unittest.TestCase):
    def test_requires_auth_and_caps_concurrency(self):
        self.assertEqual(admit_inference_request(0, 16, False), (False, 401))
        self.assertEqual(admit_inference_request(16, 16, True), (False, 429))
        self.assertEqual(admit_inference_request(4, 16, True), (True, 200))
