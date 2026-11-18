import unittest
from s02_arch_routing.lab import choose_execution_path

class TestS02Routing(unittest.TestCase):
    def test_routes_transactional_queries_to_sql(self):
        self.assertEqual(choose_execution_path("transactional_state"), "authorized_sql_api")
        self.assertEqual(choose_execution_path("document_policy"), "hybrid_rag_with_citations")
