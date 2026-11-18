import unittest
from ml_splits.temporal_guard import compute_psi, temporal_entity_split


class TestTemporalGuard(unittest.TestCase):
    def test_temporal_split_ordering(self) -> None:
        rows = [
            {"id": 1, "ts": "2026-01-01"},
            {"id": 2, "ts": "2026-02-01"},
            {"id": 3, "ts": "2026-03-01"},
        ]
        train, test = temporal_entity_split(rows, "2026-02-01")
        self.assertEqual(len(train), 1)
        self.assertEqual(len(test), 2)
        self.assertLess(max(r["ts"] for r in train), min(r["ts"] for r in test))

    def test_psi_handles_zeros_without_nan(self) -> None:
        val = compute_psi([0.5, 0.5], [0.5, 0.5])
        self.assertEqual(val, 0.0)
        drift = compute_psi([0.8, 0.2, 0.0], [0.2, 0.7, 0.1])
        self.assertGreater(drift, 0.25)


if __name__ == "__main__":
    unittest.main()
