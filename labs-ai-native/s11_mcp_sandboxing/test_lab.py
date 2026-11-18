import tempfile, unittest
from pathlib import Path
from s11_mcp_sandboxing.lab import safe_mcp_resolve

class TestS11McpSandbox(unittest.TestCase):
    def test_blocks_parent_traversal(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(PermissionError):
                safe_mcp_resolve(d, "../.env")
            ok = safe_mcp_resolve(d, "docs/spec.md")
            self.assertEqual(ok, Path(d).resolve() / "docs" / "spec.md")
