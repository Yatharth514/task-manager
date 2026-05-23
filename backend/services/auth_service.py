from fastapi import HTTPException 
from utils.hash_password import hash_pass,verify_pass
from utils.jwt_handler import create_access_token
from database import user_collection
from models.user import UserCreate
# from models.user import UserInDB

from datetime import datetime,timezone

async def create_user(user: UserCreate):

    existing_user=await user_collection.find_one({"email":user.email})

    if existing_user:
        raise HTTPException(status_code=409,detail="User already exist")
    
    hash_password=hash_pass(user.password)

    new_user={
        "email":user.email,
        "hashed_password":hash_password,
        "created_at":datetime.now(timezone.utc),
        "name":user.name
    }
    # my intention were to validate the new_user
    #validated_user=UserInDB(**new_user)
    #result=await user_collection.insert_one(validated_user)

    result=await user_collection.insert_one(new_user)

    token=create_access_token({"sub":str(result.inserted_id)}) #sub is used in the making of the token 

    return {
        "message":"User has been successfully registered",
        "access_token":token,
        "token_type":"bearer"
    }



async def get_user_by_email(email:str):

    existing_user=await user_collection.find_one({"email": email})
    return existing_user

async def login_user(email:str,password:str):
    existing_user=await user_collection.find_one({"email": email})

    if not existing_user:
        raise HTTPException(status_code=404,detail="User Not Found")
    if not verify_pass(password,existing_user["hashed_password"]):
         raise HTTPException(status_code=401,detail="Wrong Credential")
    
    token=create_access_token({"sub":str(existing_user["_id"])})

    return {
        "access_token":token,
        "token_type":"bearer"
    }







