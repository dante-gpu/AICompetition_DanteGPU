from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from solana.rpc.api import Client

# Initialize FastAPI app
app = FastAPI(
    title="DANTE-GPU AI Task Market API",
    description="A decentralized AI task market with GPU resource management and Solana integration.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Gerekirse yalnızca frontend URL'sine izin verin (ör: ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],  # Tüm HTTP metotlarına izin ver
    allow_headers=["*"],  # Tüm başlıklara izin ver
)

# Solana configuration
SOLANA_DEVNET_URL = "https://api.devnet.solana.com"
solana_client = Client(SOLANA_DEVNET_URL)

# Kuzco.xyz and AI16Z placeholders
KUZCO_API_BASE_URL = "https://api.kuzco.xyz"
AI16Z_AGENT_TOOLKIT_URL = "https://api.ai16z.org"

# Models for tasks and resources
class Task(BaseModel):
    id: str
    description: str
    required_gpu: int
    status: str
    owner: str

class GPUResource(BaseModel):
    id: str
    total_gpu: int
    available_gpu: int
    provider: str

# In-memory storage (for demonstration purposes)
tasks: Dict[str, Task] = {}
gpu_resources: Dict[str, GPUResource] = {}

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the DANTE-GPU AI Task Market API!"}

# Routes for managing tasks
@app.post("/tasks/", response_model=Task)
def create_task(task: Task):
    if task.id in tasks:
        raise HTTPException(status_code=400, detail="Task ID already exists.")
    tasks[task.id] = task
    return task

@app.get("/tasks/", response_model=List[Task])
def list_tasks():
    return list(tasks.values())

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found.")
    return tasks[task_id]

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, updated_task: Task):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found.")
    tasks[task_id] = updated_task
    return updated_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found.")
    del tasks[task_id]
    return {"detail": "Task deleted successfully."}

# Routes for GPU resource management
@app.post("/gpu-resources/", response_model=GPUResource)
def add_gpu_resource(resource: GPUResource):
    if resource.id in gpu_resources:
        raise HTTPException(status_code=400, detail="GPU Resource ID already exists.")
    gpu_resources[resource.id] = resource
    return resource

@app.get("/gpu-resources/", response_model=List[GPUResource])
def list_gpu_resources():
    return list(gpu_resources.values())

@app.get("/gpu-resources/{resource_id}", response_model=GPUResource)
def get_gpu_resource(resource_id: str):
    if resource_id not in gpu_resources:
        raise HTTPException(status_code=404, detail="GPU Resource not found.")
    return gpu_resources[resource_id]

# Solana transaction endpoint (placeholder for payment flows)
@app.post("/solana/transactions/")
def create_solana_transaction(sender: str, receiver: str, amount: float):
    try:
        response = solana_client.request_airdrop(sender, int(amount * 1e9))
        return {"transaction": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Solana transaction failed: {str(e)}")

# Placeholder for Kuzco.xyz integration
@app.get("/gpu-availability/")
def check_gpu_availability():
    # TODO: Implement Kuzco.xyz API calls for GPU resource checking
    return {"detail": "Kuzco.xyz integration pending."}

# Placeholder for AI16Z integration
@app.get("/agents/")
def list_agents():
    # TODO: Implement AI16Z toolkit API calls
    return {"detail": "AI16Z integration pending."}

# Application health check
@app.get("/health/")
def health_check():
    return {"status": "healthy"}
