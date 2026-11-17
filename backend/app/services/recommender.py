"""Content-based recommender built with scikit-learn TF-IDF + cosine similarity."""

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "characters.json"
CHARACTERS: list[dict[str, Any]] = json.loads(DATA_PATH.read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def _vectorizer_and_matrix():
    corpus = [
        " ".join(
            [c["name"], c["role"], c["style"], c["bio"], *c["tags"]]
        )
        for c in CHARACTERS
    ]
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    return vectorizer, vectorizer.fit_transform(corpus)


def recommend(interests: str, top_k: int = 2) -> list[dict[str, Any]]:
    vectorizer, matrix = _vectorizer_and_matrix()
    query = vectorizer.transform([interests or "brutal combat survival"])
    scores = cosine_similarity(query, matrix).ravel()
    order = sorted(range(len(CHARACTERS)), key=lambda i: scores[i], reverse=True)[:top_k]
    return [
        {"character": CHARACTERS[i], "match": round(float(scores[i]), 3)}
        for i in order
    ]
