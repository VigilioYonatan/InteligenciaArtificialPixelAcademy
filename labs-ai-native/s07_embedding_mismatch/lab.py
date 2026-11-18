def validate_vector_compatibility(index_model: str, query_model: str, index_dim: int, query_dim: int) -> None:
    if index_model != query_model or index_dim != query_dim:
        raise ValueError(f"Incompatible vector space: {index_model}({index_dim}) vs {query_model}({query_dim})")
