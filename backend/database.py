# import os we can remove this as we are using the config
from motor.motor_asyncio import AsyncIOMotorClient
# import certifi
# from dotenv import load_dotenv
from config import settings

# load_dotenv()

# MONGO_URL=os.getenv("MONGO_URL") we can avoid this line as we are using config

client=AsyncIOMotorClient(settings.MONGO_URL)

db=client[settings.DB_NAME]

user_collection=db["users"]
task_collection=db["tasks"]

