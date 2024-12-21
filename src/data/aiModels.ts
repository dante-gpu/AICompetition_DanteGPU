import { AIModel } from '../types/ai';
import { gpus } from './gpus';

export const aiModels: AIModel[] = [
  {
    id: '1',
    name: 'StableDiffusion XL',
    description: 'High-performance image generation model with exceptional quality',
    imageUrl: '/ai-models/sdxl.jpg',
    performance: 95,
    vram: 24,
    pricePerHour: 0.5,
    type: 'inference',
    features: ['Image Generation', '4K Resolution', 'Fast Inference', 'LoRA Support'],
    gpu: gpus[0]
  },
  {
    id: '2',
    name: 'LLaMA 2 70B',
    description: 'Large language model for text generation and chat applications',
    imageUrl: '/ai-models/llama2.jpg',
    performance: 90,
    vram: 80,
    pricePerHour: 0.8,
    type: 'inference',
    features: ['Text Generation', 'Chat', 'Code Generation', 'Multi-lingual'],
    gpu: gpus[1]
  },
  {
    id: '3',
    name: 'YOLOv8',
    description: 'Real-time object detection and image segmentation model',
    imageUrl: '/ai-models/yolo.jpg',
    performance: 85,
    vram: 16,
    pricePerHour: 0.3,
    type: 'inference',
    features: ['Object Detection', 'Segmentation', 'Real-time', 'Pre-trained'],
    gpu: gpus[2]
  }
];