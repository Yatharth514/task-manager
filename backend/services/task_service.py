from fastapi import HTTPException 
from models.task import TaskCreate,TaskUpdate
from database import task_collection
from datetime import datetime,timezone
from bson import ObjectId

async def create_task(task :TaskCreate,user_id:str):

    new_task={
        "user_id":user_id,
        "title":task.title,
        "description":task.description,
        "status":task.status,
        "priority":task.priority, 
        "due_date":task.due_date,
        "created_at":datetime.now(timezone.utc),
        "updated_at":datetime.now(timezone.utc)
    }
    # validated_task=TaskResponse(**new_task)
    # result=await task_collection.insert_one(validated_task) again my intention to check them 


    result=await task_collection.insert_one(new_task)
    created = await task_collection.find_one({"_id": result.inserted_id})
    created["id"] = str(created["_id"])
    del created["_id"]
    del created["user_id"]  

    return created
    
async def get_all_task(page:int,limit:int,user_id:str):
    skip=(page-1)*limit
    cursor = task_collection.find({"user_id": user_id}).skip(skip).limit(limit)
    existing_tasks = await cursor.to_list(length=limit)
    all_tasks=[]
    for task in existing_tasks:
        task["id"]=str(task["_id"])
        del task["_id"]
        all_tasks.append(task)
    
    return {
        "page":page,
        "limit":limit,
        "data":all_tasks
    }

async def update_task(task_id:str,user_id:str,updated_task:TaskUpdate):

    updated_dict=updated_task.model_dump(exclude_unset=True)

    if not updated_dict:
        raise HTTPException(status_code=400,detail="No field to update")
    
    updated_dict["updated_at"]=datetime.now(timezone.utc)

    result= await task_collection.update_one({
        "user_id":user_id,
        "_id":ObjectId(task_id)
    },
    {"$set":updated_dict}
    )

    if result.matched_count==0:
        raise HTTPException(status_code=404,detail="Not found the task")
    
    updated = await task_collection.find_one({"_id": ObjectId(task_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    del updated["user_id"]

    return updated
    
async def delete_a_task(task_id:str,user_id:str):

    result=await task_collection.delete_one({
        "_id":ObjectId(task_id),
        "user_id":user_id
    })
    if result.deleted_count==0:
        raise HTTPException(status_code=404,detail="Not found the task ")
    return {
        "message":"The task has been deleted."
    }

    

    


