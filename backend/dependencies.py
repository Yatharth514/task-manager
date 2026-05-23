from fastapi import Depends,HTTPException 
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from utils.jwt_handler import verify_access_token

security=HTTPBearer()

def get_current_user(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials

    user_id=verify_access_token(token)

    return user_id