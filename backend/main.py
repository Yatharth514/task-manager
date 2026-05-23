from fastapi import FastAPI
from database import client,task_collection,user_collection
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.task import router as task_router

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,prefix="/api")
app.include_router(task_router,prefix="/api")

@app.on_event("startup")
async def check_connection():

    try:
        await client.admin.command("ping")
        print("Database connected")
        await task_collection.create_index("user_id")
        await user_collection.create_index("email",unique=True)
    except Exception as e:
        print(f"MongoDB is having error of :{e}")


        

