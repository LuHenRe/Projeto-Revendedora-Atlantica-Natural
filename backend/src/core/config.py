from typing import Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str
    FRONTEND_URL: Optional[str] = None
    CORS_ORIGINS: Optional[str] = None
    ATLANTICA_REVENDEDORA_URL: str = "https://loja.atlanticanatural.com.br/valescareis"
    ATLANTICA_USERNAME: Optional[str] = None
    ATLANTICA_PASSWORD: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        """Garante compatibilidade com SQLAlchemy 2.0 + psycopg2-binary."""
        if isinstance(value, str):
            if value.startswith("postgres://"):
                return value.replace("postgres://", "postgresql://", 1)
            if value.startswith("postgresql+psycopg://"):
                return value.replace("postgresql+psycopg://", "postgresql://", 1)
        return value

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        extra="ignore",
    )


settings = Settings()
