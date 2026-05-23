from fastapi import APIRouter
from models.user import UserCreate,UserLogin
from services.auth_service import create_user,login_user

router=APIRouter(prefix="/auth",tags=["Auth"])

@router.post("/register",status_code=201)
async def register_user(user: UserCreate):
    return await create_user(user)

@router.post("/login")
async def login(user: UserLogin):
    return await login_user(user.email,user.password)