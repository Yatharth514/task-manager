from jose import JWTError,jwt
from fastapi import HTTPException
from datetime import datetime,timezone,timedelta
from config import settings

def create_access_token(data:dict):
    to_encode=data.copy()

    expire=datetime.now(timezone.utc)+timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp":expire})

    jwt_token=jwt.encode(to_encode,settings.SECRET_KEY,algorithm=settings.ALGORITHM)

    return jwt_token

def verify_access_token(token:str):
    try:
        payload=jwt.decode(token,settings.SECRET_KEY,algorithms=[settings.ALGORITHM])
        user_id=payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401,detail="Invalid token")
        
        return user_id
    except JWTError:
        raise HTTPException(status_code=401,detail="Expired or Invalid")
    

