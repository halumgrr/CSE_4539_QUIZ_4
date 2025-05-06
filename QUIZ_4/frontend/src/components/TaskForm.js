import React, { useState } from 'react';
import { createTask, updateTask } from '../services/api';
import '../styles/TaskForm.css';

function TaskForm({ task, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task?.priority || 'medium',
        category: task?.category || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (task?._id) {
                await updateTask(task._id, formData);
            } else {
                await createTask(formData);
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <div className="task-form-container">
            <form onSubmit={handleSubmit} className="task-form">
                <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                />
                <textarea
                    placeholder="Task Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                />
                <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                />
                <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
                <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                />
                <div className="form-actions">
                    <button type="submit">{task ? 'Update Task' : 'Add Task'}</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;