import unittest
from s03_prompt_injection.lab import authorize_tool_call

class TestS03PromptInjection(unittest.TestCase):
    def test_blocks_unlisted_outbound_tool_from_pdf(self):
        self.assertFalse(authorize_tool_call("send_webhook", {"admin"}, True))
        self.assertTrue(authorize_tool_call("search_policies", {"reader"}, True))
