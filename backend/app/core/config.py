from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./cybervault.db"
    redis_url: str = "redis://localhost:6379/0"

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    smtp_from_name: str = "CyberVault"

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    otp_expire_minutes: int = 5
    otp_rate_limit_max: int = 3
    otp_rate_limit_window_seconds: int = 900

    frontend_url: str = "http://localhost:5173"
    cookie_secure: bool = False


settings = Settings()
