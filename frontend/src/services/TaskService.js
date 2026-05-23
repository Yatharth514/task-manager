import api from "./api";

const TaskService={
    postTask:async(taskData)=>{
        const response=await api.post('/tasks/',taskData);
        return response.data;
    },
    getTask: async(page=1,limit=10)=>{
        const response=await api.get('/tasks/',{params:{page,limit}});
        return response.data;
    },
    updateTask:async(task_id,taskData)=>{
        const response=await api.patch(`/tasks/${task_id}`,taskData);
        return response.data;
    },
    deleteTask:async(task_id)=>{
        const response=await api.delete(`/tasks/${task_id}`);
        return response.data;
    }
};

export default TaskService;
