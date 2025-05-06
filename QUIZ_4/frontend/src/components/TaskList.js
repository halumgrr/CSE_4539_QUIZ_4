import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, deleteTask, completeTask } from '../services/api';
import TaskForm from './TaskForm';
import '../styles/TaskList.css';

function TaskList({ onLogout }) {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({
        priority: '',
        category: '',
        status: '',
        search: '',
        sortBy: ''
    });
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    
    useEffect(() => {
        loadTasks();
    }, [filters, showTaskForm]);

    const loadTasks = async () => {
        try {
            const response = await getTasks(filters);
            setTasks(response.data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleComplete = async (id) => {
        try {
            await completeTask(id);
            loadTasks();
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleTaskSubmit = async () => {
        setShowTaskForm(false);
        setEditingTask(null);
        await loadTasks();
    };

    const handleLogout = () => {
        onLogout(); // Call the parent's logout handler
        navigate('/login');
    };

    return (
        <div className="task-list-container">
            <div className="task-header">
                <h1>My Tasks</h1>
                <div className="header-actions">
                    <button onClick={() => setShowTaskForm(true)} className="add-task-btn">
                        Add New Task
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
                <select onChange={(e) => setFilters({...filters, priority: e.target.value})}>
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select onChange={(e) => setFilters({...filters, status: e.target.value})}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="tasks">
                {tasks.map((task) => (
                    <div key={task._id} className={`task-card ${task.status}`}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <div className="task-meta">
                            <span className={`priority ${task.priority}`}>
                                {task.priority}
                            </span>
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="task-actions">
                            <button onClick={() => handleComplete(task._id)}>
                                {task.status === 'completed' ? 'Completed' : 'Complete'}
                            </button>
                            <button onClick={() => handleEdit(task)}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(task._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showTaskForm && (
                <TaskForm
                    task={editingTask}
                    onSubmit={handleTaskSubmit}
                    onCancel={() => {
                        setShowTaskForm(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </div>
    );
}

export default TaskList;