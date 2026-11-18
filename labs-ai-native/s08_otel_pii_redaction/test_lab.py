import unittest
from s08_otel_pii_redaction.lab import redact_span_attributes

class TestS08OtelPii(unittest.TestCase):
    def test_strips_raw_prompt_and_redacts_tokens(self):
        out = redact_span_attributes({"gen_ai.prompt": "secret", "note": "Bearer abc.123 user@corp.com"})
        self.assertNotIn("gen_ai.prompt", out)
        self.assertNotIn("Bearer abc.123", out["note"])
        self.assertNotIn("user@corp.com", out["note"])
