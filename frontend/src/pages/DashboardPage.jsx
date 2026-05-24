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
    <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">My Dashboard</h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-200"
                >
                    Logout
                </button>
            </div>

            {error && (
                <p className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6">
                    {error}
                </p>
            )}

            <form
                onSubmit={handleCreate}
                className="bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4 mb-8"
            >
                <input
                    type="text"
                    name="title"
                    placeholder="Enter the title"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    placeholder="Task Description"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    name="priority"
                    value={formData.priority}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <input
                    type="datetime-local"
                    name="due_date"
                    value={formData.due_date}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                        })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                    Add Task
                </button>
            </form>

            {tasks.length === 0 && (
                <p className="text-gray-400">No tasks yet. Create one!</p>
            )}

            <div className="grid gap-6">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800"
                    >
                        {editingId === task.id ? (
                            <form
                                onSubmit={(e) => handleUpdate(e, task.id)}
                                className="space-y-4"
                            >
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <select
                                    name="status"
                                    value={editFormData.status}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>

                                <select
                                    name="priority"
                                    value={editFormData.priority}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>

                                <input
                                    type="datetime-local"
                                    name="due_date"
                                    value={editFormData.due_date}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition duration-200"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3 className="text-2xl font-semibold mb-3">
                                    {task.title}
                                </h3>

                                <p className="text-gray-300 mb-4">
                                    {task.description}
                                </p>

                                <div className="space-y-2 text-sm text-gray-400 mb-5">
                                    <p>Status: {task.status}</p>
                                    <p>Priority: {task.priority}</p>
                                    <p>
                                        Due:{" "}
                                        {task.due_date
                                            ? new Date(
                                                  task.due_date
                                              ).toLocaleDateString()
                                            : "No due date"}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => startEdit(task)}
                                        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition duration-200"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(task.id)
                                        }
                                        className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition duration-200"
                                    >
                                        Delete it!
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
)

}
export default DashboardPage;