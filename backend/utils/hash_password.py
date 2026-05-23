from passlib.context import CryptContext

pwd_context=CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_pass(password:str):
    return pwd_context.hash(password)

def verify_pass(original_password:str,hashed_password:str):
    return pwd_context.verify(original_password,hashed_password)