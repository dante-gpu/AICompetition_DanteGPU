from fastapi import APIRouter, HTTPException
from typing import List, Dict
from models import Task

router = APIRouter()

# Bellek içi görev deposu
tasks: Dict[str, Task] = {}

# Görev oluşturma
@router.post("/", response_model=Task)
def create_task(task: Task):
    if task.id in tasks:
        raise HTTPException(status_code=400, detail="Task ID already exists.")
    tasks[task.id] = task
    return task

# Görevleri listeleme
@router.get("/", response_model=List[Task])
def list_tasks():
    return list(tasks.values())

# Belirli bir görevi getirme
@router.get("/{task_id}", response_model=Task)
def get_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found.")
    return tasks[task_id]

# Görev güncelleme
@router.put("/{task_id}", response_model=Task)
def update_task(task_id: str, updated_task: Task):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found.")
    tasks[task_id] = updated_task
    return updated_task

# Görev silme
@router.delete("/{task_id}")
def delete_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found.")
    del tasks[task_id]
    return {"detail": "Task deleted successfully."}
