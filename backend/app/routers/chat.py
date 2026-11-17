from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from .. import models
from ..db import get_db
from ..schemas import ChatIn
from ..services.lore_bot import stream_answer

router = APIRouter(prefix="/api", tags=["ai"])


@router.post("/chat")
async def chat(payload: ChatIn, db: Session = Depends(get_db)) -> StreamingResponse:
    accumulated: list[str] = []

    async def generate():
        async for piece in stream_answer(payload.history, payload.message):
            accumulated.append(piece)
            yield piece
        answer = "".join(accumulated)[:4000]
        db.add_all(
            [
                models.ChatMessage(session_id=payload.session_id, role="user", content=payload.message[:4000]),
                models.ChatMessage(session_id=payload.session_id, role="assistant", content=answer),
            ]
        )
        db.commit()

    return StreamingResponse(
        generate(),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
