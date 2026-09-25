import os

class Settings:
    PROJECT_NAME: str = "Vertexon LMS AI Service"
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://lms:lms123@localhost:5432/lms_ai")

settings = Settings()
