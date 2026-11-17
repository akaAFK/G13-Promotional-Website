from typing import Any

from fastapi import APIRouter

from ..schemas import RecommendIn, RecommendOut
from ..services.recommender import CHARACTERS, recommend

router = APIRouter(prefix="/api", tags=["ml"])


@router.get("/characters")
def characters() -> list[dict[str, Any]]:
    return CHARACTERS


@router.post("/recommend", response_model=RecommendOut)
def get_recommendations(payload: RecommendIn) -> RecommendOut:
    return RecommendOut(results=recommend(payload.interests, payload.top_k))
