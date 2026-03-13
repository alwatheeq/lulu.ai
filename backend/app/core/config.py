from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Lulu AI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_123"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200 # 30 days
    
    # AI Integration
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    # Auth
    GOOGLE_CLIENT_ID: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = 'ignore' # Allow extra env vars from Vercel without crashing

settings = Settings()
