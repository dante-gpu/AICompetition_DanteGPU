import { GPU } from '../types/gpu';

// Local storage key
const GPU_STORAGE_KEY = 'gpu_database';

// Event emitter for real-time updates
const subscribers = new Set<(gpus: GPU[]) => void>();

// Helper to emit changes
const emitChange = (gpus: GPU[]) => {
  subscribers.forEach(callback => callback(gpus));
};

// Load initial data
const loadGPUs = (): GPU[] => {
  const stored = localStorage.getItem(GPU_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save data
const saveGPUs = (gpus: GPU[]) => {
  localStorage.setItem(GPU_STORAGE_KEY, JSON.stringify(gpus));
  emitChange(gpus);
};

export const localDB = {
  // Subscribe to changes
  subscribe: (callback: (gpus: GPU[]) => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  // Get all GPUs
  getGPUs: () => {
    return loadGPUs();
  },

  // Save GPUs
  saveGPUs: (gpus: GPU[]) => {
    saveGPUs(gpus);
  },

  // Add new GPU
  addGPU: (gpu: Omit<GPU, 'id'>) => {
    const gpus = loadGPUs();
    const newGPU: GPU = {
      ...gpu,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    gpus.push(newGPU);
    saveGPUs(gpus);
    return newGPU;
  },

  // Delete GPU
  deleteGPU: (id: string) => {
    const gpus = loadGPUs();
    const filtered = gpus.filter(gpu => gpu.id !== id);
    saveGPUs(filtered);
  }
}; 