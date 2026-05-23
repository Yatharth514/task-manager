import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskService from "../services/TaskService";


const DashboardPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: ''
    });


    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //handling all the tasks
    useEffect(() => {
        const fetchMyTasks = async () => {
            try {
                const response = await TaskService.getTask();
                setTasks(response.data || []);
            }
            catch (err) {
                setError(err.response?.data?.detail || "Error in fetching the tasks")
            }
            finally {
                setLoading(false);
            }
        }
        fetchMyTasks();
    }, []);

    //logout 
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }

    //creating the tasks
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await TaskService.postTask(formData);

            const newTask = response;
            setTasks([newTask, ...tasks]);
            setFormData({ ...formData, title: '', description: '', due_date: '' });

        }
        catch (err) {
            setError(err.response?.data?.detail || "Error in creating the task");
        }

    }

    //deleting a task 
    const handleDelete = async (id) => {
        setError(null);
        try {
            await TaskService.deleteTask(id);
            setTasks(tasks.filter((task) => task.id !== id))
        }
        catch (err) {
            setError(err.response?.data?.detail || "Error in deleting  the task");
        }
    };
    //for edit form 
    const startEdit = (task) => {
        setEditingId(task.id);
        setEditFormData({
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'pending',
            priority: task.priority || 'medium',
            due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ''

        });
    }

    //handle update 
    const handleUpdate = async (e, id) => {
        e.preventDefault();
        setError(null);
        try {

            const dataToSubmit = { ...editFormData };
            if (!dataToSubmit.due_date) dataToSubmit.due_date = null;


            const updatedTask = await TaskService.updateTask(id, dataToSubmit);
            setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
            setEditFormData({
                title: '',
                description: '',
                status: '',
                priority: '',
                due_date: ''
            });
            setEditingId(null);
        } catch (err) {
            setError(err.response?.data?.detail || "Error in updating the task");
        }
    };

    if (loading) return <h2>Loading your tasks...</h2>;


    return (
        <div>
            <h1>My Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLogout}>Logout</button>

            <form onSubmit={handleCreate}>
                <input type="text"
                    name="title"
                    placeholder="Enter the title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    placeholder="Task Description" />

                <select name="priority" value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <input type="datetime-local"
                    name="due_date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />

                <button type="submit">Add Task</button>


            </form>

            {tasks.length === 0 && <p>No tasks yet. Create one!</p>}

            {tasks.map((task) =>

                <div key={task.id}>
                    {editingId === task.id ?
                        (
                            <form onSubmit={(e) => handleUpdate(e, task.id)}>
                                <input type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })} />

                                <textarea
                                    name="description" value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                                />
                                <select
                                    name="status" value={editFormData.status}
                                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <select
                                    name="priority" value={editFormData.priority}
                                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <input
                                    type="datetime-local" name="due_date" value={editFormData.due_date}
                                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                                />

                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <p>Priority: {task.priority}</p>
                                <p>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</p>
                                <button onClick={() => startEdit(task)}>Edit</button>
                                <button onClick={() => handleDelete(task.id)}>Delete it!</button>
                            </>
                        )}

                </div>
            )}
        </div>

    )

}
export default DashboardPage;