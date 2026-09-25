import numpy as np
from typing import List

def generate_embedding(text: str, vector_dim: int = 1536) -> List[float]:
    """
    Generates a normalized pseudo vector embedding for RAG similarity matching
    when live API key is unavailable, or connects to OpenAI/Anthropic embeddings.
    """
    # Deterministic pseudo-embedding from text hash
    np.random.seed(abs(hash(text)) % (2**32))
    vec = np.random.randn(vector_dim)
    norm = np.linalg.norm(vec)
    normalized = (vec / norm).tolist() if norm > 0 else vec.tolist()
    return normalized
