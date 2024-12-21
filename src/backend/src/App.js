import React, { useState, useEffect } from "react";
import { createTask, listTasks } from "./services/api";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        id: "",
        description: "",
        required_gpu: 0,
        status: "pending",
        owner: "",
    });

    // Tüm görevleri listeleme
    useEffect(() => {
        async function fetchTasks() {
            try {
                const taskList = await listTasks();
                setTasks(taskList);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }
        fetchTasks();
    }, []);

    // Yeni görev oluşturma
    const handleCreateTask = async () => {
        try {
            const createdTask = await createTask(newTask);
            setTasks([...tasks, createdTask]); // Yeni görevi listeye ekle
            setNewTask({ id: "", description: "", required_gpu: 0, status: "pending", owner: "" }); // Formu temizle
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div>
            <h1>Task Management</h1>
            <h2>Create a New Task</h2>
            <input
                type="text"
                placeholder="Task ID"
                value={newTask.id}
                onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
                type="number"
                placeholder="Required GPU"
                value={newTask.required_gpu}
                onChange={(e) => setNewTask({ ...newTask, required_gpu: parseInt(e.target.value) })}
            />
            <input
                type="text"
                placeholder="Owner"
                value={newTask.owner}
                onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })}
            />
            <button onClick={handleCreateTask}>Create Task</button>

            <h2>Task List</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.id} - {task.description} (Owner: {task.owner}, GPU: {task.required_gpu})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
