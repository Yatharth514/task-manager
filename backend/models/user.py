from pydantic import BaseModel,EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email:EmailStr
    name:str
    password:str

class UserResponse(BaseModel):
    id:str
    email:EmailStr
    name:str
    created_at:datetime

class UserInDB(BaseModel):
    name:str
    email:EmailStr
    created_at:datetime
    hashed_password:str

class UserLogin(BaseModel):
    email:EmailStr
    password:str



