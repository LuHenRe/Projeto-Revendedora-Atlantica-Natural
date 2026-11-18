from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str
    ATLANTICA_REVENDEDORA_URL: str = "https://loja.atlanticanatural.com.br/valescareis"
    ATLANTICA_USERNAME: Optional[str] = None
    ATLANTICA_PASSWORD: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        extra="ignore",
    )


settings = Settings()
