import unittest
from s01_rag_acl.lab import filter_authorized_chunks

class TestS01RagAcl(unittest.TestCase):
    def test_blocks_cross_tenant_and_unauthorized_roles(self):
        chunks = [
            {"id": "c1", "tenant_id": "t1", "visibility": "restricted", "allowed_roles": ["hr_exec"]},
            {"id": "c2", "tenant_id": "t1", "visibility": "tenant_public", "allowed_roles": []},
            {"id": "c3", "tenant_id": "t2", "visibility": "tenant_public", "allowed_roles": []},
        ]
        res = filter_authorized_chunks(chunks, "t1", {"employee"})
        self.assertEqual([c["id"] for c in res], ["c2"])
