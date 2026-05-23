from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class StatusEnum(str,Enum):
    pending="pending"
    completed="completed"

class PriorityEnum(str,Enum):
    low="low"
    medium="medium"
    high="high"

class TaskCreate(BaseModel):   #this would be control by the user 
    title:str
    description:str
    status:StatusEnum=StatusEnum.pending
    priority:PriorityEnum=PriorityEnum.medium
    due_date:Optional[datetime]=None
   

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id:str
    user_id:str
    title:str
    description:str
    status:StatusEnum
    priority:PriorityEnum
    due_date:Optional[datetime]=None
    created_at:datetime
    updated_at:datetime