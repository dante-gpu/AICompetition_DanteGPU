const BASE_URL = "http://127.0.0.1:8000"; // Backend URL'sini burada tanımlayın

// Tüm görevleri listeleme (GET /tasks/)
export async function listTasks() {
    try {
        const response = await fetch(`${BASE_URL}/tasks/`);
        if (!response.ok) {
            throw new Error(`Error fetching tasks: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in listTasks API call:", error);
        throw error;
    }
}

// Yeni görev oluşturma (POST /tasks/)
export async function createTask(task) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error(`Error creating task: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in createTask API call:", error);
        throw error;
    }
}

// Belirli bir görevi alma (GET /tasks/{task_id})
export async function getTask(taskId) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error(`Error fetching task: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in getTask API call:", error);
        throw error;
    }
}

// Belirli bir görevi silme (DELETE /tasks/{task_id})
export async function deleteTask(taskId) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Error deleting task: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in deleteTask API call:", error);
        throw error;
    }
}
