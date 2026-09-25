from typing import List, Dict
from app.rag.embeddings import generate_embedding

def retrieve_relevant_chunks(query: str, course_id: str, top_k: int = 3) -> List[Dict]:
    """
    Retrieves course-specific lecture chunks using embedding similarity search.
    """
    query_vector = generate_embedding(query)
    
    # Mock course knowledge base chunks for RAG demo
    sample_chunks = [
        {
            "chunk_id": "chk-1",
            "course_id": course_id,
            "lecture_id": "lec-dsa-101",
            "lecture_title": "Quicksort & Pivot Selection Strategies",
            "content": "Quicksort degrades to O(n^2) when array is already sorted and deterministic first-element pivot is picked. Using randomized pivot or median-of-three guarantees expected O(n log n).",
            "timestamp_seconds": 140
        },
        {
            "chunk_id": "chk-2",
            "course_id": course_id,
            "lecture_id": "lec-dsa-102",
            "lecture_title": "Merge Sort & Divide-and-Conquer Recurrences",
            "content": "Merge Sort maintains O(n log n) worst-case time complexity with O(n) auxiliary space requirements.",
            "timestamp_seconds": 210
        },
        {
            "chunk_id": "chk-3",
            "course_id": course_id,
            "lecture_id": "lec-ml-101",
            "lecture_title": "Vector Embeddings & Cosine Similarity in pgvector",
            "content": "Cosine similarity measures the angle between vector embeddings in high dimensional space, ignoring magnitude differences.",
            "timestamp_seconds": 90
        }
    ]

    return sample_chunks[:top_k]
