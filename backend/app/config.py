from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    POSTGRES_USER: str = "g13"
    POSTGRES_PASSWORD: str = "g13"
    POSTGRES_DB: str = "g13"
    DATABASE_URL: str | None = None

    # OpenRouter key. Both names are accepted: OPENROUTER (used in this repo) and OPENROUTER_API_KEY.
    OPENROUTER_API_KEY: str = Field(
        default="",
        validation_alias=AliasChoices("OPENROUTER_API_KEY", "OPENROUTER"),
    )
    OPENROUTER_MODEL: str = "openrouter/free"

    # Gmail via fastapi-mail. Dev mode logs messages instead of sending them.
    MAIL_DEV_MODE: bool = True
    GMAIL_USER: str = ""
    GMAIL_APP_PASSWORD: str = ""
    MAIL_FROM_NAME: str = "G13 Project"

    CORS_ORIGINS: str = "*"

    @property
    def sqlalchemy_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@postgres:5432/{self.POSTGRES_DB}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
