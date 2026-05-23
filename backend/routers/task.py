from fastapi import APIRouter,Depends,Query
from services.task_service import create_task,get_all_task,delete_a_task,update_task
from models.task import TaskUpdate,TaskCreate
from dependencies import get_current_user

router=APIRouter(prefix="/tasks",tags=["Tasks"])

@router.post("/")
async def create(task:TaskCreate,user_id:str=Depends(get_current_user)):
    return await create_task(task,user_id)

@router.get("/")
async def get_all(page: int = Query(1 , ge=1),limit: int = Query(10 , le=100),user_id: str = Depends(get_current_user)):
    return await get_all_task(page,limit,user_id)

@router.patch("/{task_id}")
async def update(task_id:str,updated_task:TaskUpdate,user_id:str=Depends(get_current_user)):
    return await update_task(task_id,user_id,updated_task)

@router.delete("/{task_id}")
async def delete_task(task_id:str,user_id:str=Depends(get_current_user)):
    return await delete_a_task(task_id,user_id)


