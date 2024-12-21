from fastapi import APIRouter, HTTPException
from typing import List, Dict
from models import GPUResource

router = APIRouter()

# Bellek içi GPU kaynak deposu
gpu_resources: Dict[str, GPUResource] = {}

# GPU kaynağı ekleme
@router.post("/", response_model=GPUResource)
def add_gpu_resource(resource: GPUResource):
    if resource.id in gpu_resources:
        raise HTTPException(status_code=400, detail="GPU Resource ID already exists.")
    gpu_resources[resource.id] = resource
    return resource

# GPU kaynaklarını listeleme
@router.get("/", response_model=List[GPUResource])
def list_gpu_resources():
    return list(gpu_resources.values())

# Belirli bir GPU kaynağını getirme
@router.get("/{resource_id}", response_model=GPUResource)
def get_gpu_resource(resource_id: str):
    if resource_id not in gpu_resources:
        raise HTTPException(status_code=404, detail="GPU Resource not found.")
    return gpu_resources[resource_id]
