import unittest
from s18_release_go_nogo.lab import REQUIRED_CONTROLS, release_decision

class TestS18GoNoGo(unittest.TestCase):
    def test_blocks_release_when_any_control_is_not_run_or_fail(self):
        partial = {k: "PASS" for k in REQUIRED_CONTROLS}
        partial["cross_tenant_acl"] = "NOT_RUN"
        self.assertEqual(release_decision(partial), "NO-GO")
        all_pass = {k: "PASS" for k in REQUIRED_CONTROLS}
        self.assertEqual(release_decision(all_pass), "GO")
