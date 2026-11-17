from typing import Any

from pydantic import BaseModel, EmailStr, Field


class SubscribeIn(BaseModel):
    email: EmailStr
    source: str = Field(default="landing", max_length=50)


class SubscribeOut(BaseModel):
    ok: bool
    already_subscribed: bool = False
    delivery: str = "dev"


class CheckoutIn(BaseModel):
    email: EmailStr
    edition: str = Field(default="STANDARD", max_length=30)


class CheckoutOut(BaseModel):
    order_id: str
    status: str
    amount_cents: int
    checkout_url: str


class ConfirmIn(BaseModel):
    order_id: str
    card_number: str = Field(default="4242 4242 4242 4242", max_length=32)


class OrderOut(BaseModel):
    id: str
    email: str
    edition: str
    amount_cents: int
    status: str
    paid_at: str | None = None


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: list[dict[str, str]] = Field(default_factory=list, max_length=12)
    session_id: str = Field(default="anon", max_length=64)


class RecommendIn(BaseModel):
    interests: str = Field(default="", max_length=1000)
    top_k: int = Field(default=2, ge=1, le=6)


class RecommendOut(BaseModel):
    results: list[dict[str, Any]]
