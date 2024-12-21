import { useState, useEffect } from 'react';
import { GPU } from '../types/gpu';
import { localDB } from '../services/localDB';

export const useGPUs = () => {
  const [gpus, setGPUs] = useState<GPU[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGPUs(localDB.getGPUs());
    setLoading(false);

    const unsubscribe = localDB.subscribe(setGPUs);
    return () => {
      unsubscribe();
    };
  }, []);

  const addGPU = async (gpu: Omit<GPU, 'id'>) => {
    try {
      localDB.addGPU(gpu);
    } catch (error) {
      console.error('Error adding GPU:', error);
      throw error;
    }
  };

  const updateGPU = async (id: string, updates: Partial<GPU>) => {
    try {
      const gpus = localDB.getGPUs();
      const index = gpus.findIndex(gpu => gpu.id === id);
      if (index !== -1) {
        gpus[index] = { ...gpus[index], ...updates };
        localDB.saveGPUs(gpus);
      }
    } catch (error) {
      console.error('Error updating GPU:', error);
      throw error;
    }
  };

  const deleteGPU = async (gpu: GPU) => {
    try {
      localDB.deleteGPU(gpu.id);
    } catch (error) {
      console.error('Error deleting GPU:', error);
      throw error;
    }
  };

  return { 
    gpus, 
    addGPU, 
    updateGPU, 
    deleteGPU, 
    loading 
  };
}; 