from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL:str
    SECRET_KEY:str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 
    ALGORITHM:str="HS256"
    DB_NAME:str="task_manager_db"

    class Config:
        env_file=".env"

settings=Settings()