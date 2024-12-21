from pydantic import BaseModel

# Görev modeli
class Task(BaseModel):
    id: str
    description: str
    required_gpu: int
    status: str
    owner: str

# GPU kaynak modeli
class GPUResource(BaseModel):
    id: str
    total_gpu: int
    available_gpu: int
    provider: str
