import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from . import models  # noqa: F401 - registered before create_all
from .config import settings
from .db import Base, engine
from .routers import chat, payments, recommend, subscribe

# Make dev-mode emails and lore fallbacks visible in `docker compose logs backend`.
g13_log = logging.getLogger("g13")
g13_log.setLevel(logging.INFO)
if not g13_log.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
    g13_log.addHandler(handler)
g13_log.propagate = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="G13 Promo API",
    description="MVP backend: signup, mock Stripe checkout, OpenRouter lore chat, ML recommendations.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",")],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subscribe.router)
app.include_router(payments.router)
app.include_router(chat.router)
app.include_router(recommend.router)


@app.get("/api/health")
def health() -> dict:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "database": "connected",
        "ai_model": settings.OPENROUTER_MODEL,
        "ai_key_present": bool(settings.OPENROUTER_API_KEY),
        "mail_mode": "dev-log" if settings.MAIL_DEV_MODE else "smtp",
    }
