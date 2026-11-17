from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="G13 Events API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CombatEvent(BaseModel):
    event_type: Literal["combat_configured"] = "combat_configured"
    mechanic: Literal["finishing", "limbs", "environment"]
    target_zone: str = Field(min_length=2, max_length=30)
    intensity: int = Field(ge=1, le=3)
    weapon: str = Field(min_length=2, max_length=30)
    timestamp: datetime

@app.get("/health")
async def health():
    return {"status": "ok", "service": "g13-events"}

@app.post("/events", status_code=201)
async def create_event(event: CombatEvent):
    # Milestone 2 demo: acknowledge and log the event.
    # Persistent storage/analytics can be connected in a later milestone.
    event_id = str(uuid4())
    print({"id": event_id, **event.model_dump(mode="json")})
    return {
        "accepted": True,
        "event_id": event_id,
        "message": "Combat event accepted by G13 API."
    }
