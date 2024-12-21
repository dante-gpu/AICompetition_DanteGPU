import { ChatMessage } from '../types/chat';
import { GPU } from '../types/gpu';
import { RentalHistory } from '../types/rental';

// Kullanılabilir GPU'ların tanımlanması
const AVAILABLE_GPUS: GPU[] = [
  {
    id: '1',
    name: 'NVIDIA RTX 4090',
    description: 'Highest performance GPU, ideal for AI and image processing',
    imageUrl: '../images/rtx4090.jpeg',
    performance: 100,
    vram: 24,
    pricePerHour: 0.5,
    manufacturer: 'NVIDIA',
    model: 'RTX 4090',
    status: 'available'
  },
  {
    id: '2',
    name: 'NVIDIA RTX 3090',
    description: 'High-performance GPU, suitable for large model training',
    imageUrl: 'src/images/rtx3090.jpeg',
    performance: 85,
    vram: 24,
    pricePerHour: 0.3,
    manufacturer: 'NVIDIA',
    model: 'RTX 3090',
    status: 'available'
  },
  {
    id: '3',
    name: 'NVIDIA RTX 4080',
    description: 'Balanced performance, sufficient for most AI tasks',
    imageUrl: 'src/images/rtx4080.jpeg',
    performance: 90,
    vram: 16,
    pricePerHour: 0.4,
    manufacturer: 'NVIDIA',
    model: 'RTX 4080',
    status: 'available'
  },
  {
    id: '4',
    name: 'NVIDIA RTX 3080',
    description: 'Cost-effective GPU, ideal for medium-sized jobs',
    imageUrl: 'src/images/rtx3080.jpg',
    performance: 75,
    vram: 12,
    pricePerHour: 0.25,
    manufacturer: 'NVIDIA',
    model: 'RTX 3080',
    status: 'available'
  }
];

// AI görev tiplerinin tanımlanması
type TaskType = 'image_generation' | 'training' | 'inference' | 'video_processing';

// Görev önerileri için geliştirilmiş arayüz
interface TaskRecommendation {
  description: string;
  recommended_gpus: string[];
  min_vram: number;
  performance_weight: number;
  price_weight: number;
  required_features?: string[];
}

// Her görev tipi için detaylı öneriler
const AI_TASK_RECOMMENDATIONS: Record<TaskType, TaskRecommendation> = {
  'image_generation': {
    description: 'Image generation (Stable Diffusion, DALL-E etc.)',
    recommended_gpus: ['RTX 4090', 'RTX 4080', 'RTX 3090'],
    min_vram: 16,
    performance_weight: 0.7,
    price_weight: 0.3,
    required_features: ['tensor cores', 'cuda']
  },
  'training': {
    description: 'Model eğitimi ve fine-tuning',
    recommended_gpus: ['RTX 4090', 'RTX 3090'],
    min_vram: 24,
    performance_weight: 0.8,
    price_weight: 0.2,
    required_features: ['high memory bandwidth', 'cuda']
  },
  'inference': {
    description: 'Model inference and prediction',
    recommended_gpus: ['RTX 4080', 'RTX 3080', 'RTX 3090'],
    min_vram: 8,
    performance_weight: 0.4,
    price_weight: 0.6,
    required_features: ['cuda']
  },
  'video_processing': {
    description: 'Video processing and AI upscaling',
    recommended_gpus: ['RTX 4080', 'RTX 3080', 'RTX 4090'],
    min_vram: 12,
    performance_weight: 0.6,
    price_weight: 0.4,
    required_features: ['nvenc', 'cuda']
  }
};

// Geliştirilmiş görev belirleme fonksiyonu
function determineAITask(message: string): TaskType {
  message = message.toLowerCase();
  
  const taskKeywords = {
    image_generation: [
      'picture', 'image', 'stable diffusion', 'dall-e', 'midjourney', 
      'drawing', 'art', 'graphic', 'illustration', 'design'

    ],
    training: [
      'education', 'training', 'fine-tune', 'model development', 'learning',
      'train', 'dataset', 'data set', 'model training', 'fine tuning',
    ],
    inference: [
      'prediction', 'inference', 'derivation', 'prediction', 'testing',
      'model execution', 'deploy', 'production', 'production', 'serving',
    ],
    video_processing: [
      'video', 'upscale', 'render', 'editing', 'processing',
      'encoding', 'transcoding', 'streaming', 'recording', 'post-production'
    ]
  };

  // En çok eşleşen görevi bul
  let maxMatches = 0;
  let selectedTask: TaskType = 'inference';

  for (const [task, keywords] of Object.entries(taskKeywords)) {
    const matches = keywords.filter(keyword => message.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      selectedTask = task as TaskType;
    }
  }

  return selectedTask;
}

// Kullanıcı tercihlerini analiz eden geliştirilmiş fonksiyon
function analyzeUserPreferences(message: string): {
  preferHighPerformance: boolean;
  preferLowCost: boolean;
  needsHighVram: boolean;
  isUrgent: boolean;
  requiresReliability: boolean;
} {
  message = message.toLowerCase();
  
  return {
    preferHighPerformance: message.includes('fast') || 
                          message.includes('high performance') || 
                          message.includes('powerful') ||
                          message.includes('best'),
    
    preferLowCost: message.includes('affordable') || 
                   message.includes('economic') || 
                   message.includes('cheap') ||
                   message.includes('budget'),
    
    needsHighVram: message.includes('large model') || 
                   message.includes('high resolution') || 
                   message.includes('24gb') ||
                   message.includes('large memory'),
    
    isUrgent: message.includes('urgent') || 
              message.includes('immediately') || 
              message.includes('rush'),
    
    requiresReliability: message.includes('reliable') || 
                        message.includes('stable') || 
                        message.includes('trustworthy')
  };
}

// Geliştirilmiş GPU seçim fonksiyonu
function findBestGPU(taskType: TaskType, message: string): GPU | null {
  const task = AI_TASK_RECOMMENDATIONS[taskType];
  if (!task) return null;

  const preferences = analyzeUserPreferences(message);
  
  // İlk filtreleme: Temel gereksinimlere göre
  let suitableGPUs = AVAILABLE_GPUS.filter(gpu => 
    gpu.vram >= task.min_vram && 
    task.recommended_gpus.includes(gpu.model) &&
    gpu.status === 'available'
  );

  // GPU'ları puanlandırma
  const scoredGPUs = suitableGPUs.map(gpu => {
    let score = 0;
    
    // Temel puanlama
    const performanceScore = (gpu.performance / 100) * task.performance_weight;
    const priceScore = (1 - (gpu.pricePerHour / 0.5)) * task.price_weight;
    score += performanceScore + priceScore;
    
    // Kullanıcı tercihlerine göre ek puanlar
    if (preferences.preferHighPerformance) {
      score += (gpu.performance >= 90) ? 0.3 : 0.1;
    }
    
    if (preferences.preferLowCost) {
      score += (gpu.pricePerHour <= 0.3) ? 0.3 : 0.1;
    }
    
    if (preferences.needsHighVram) {
      score += (gpu.vram >= 24) ? 0.3 : 0.1;
    }
    
    if (preferences.isUrgent) {
      score += (gpu.performance >= 85) ? 0.2 : 0;
    }
    
    if (preferences.requiresReliability) {
      score += (gpu.manufacturer === 'NVIDIA') ? 0.2 : 0;
    }

    return { gpu, score };
  });

  // Sıralama ve rastgele seçim
  scoredGPUs.sort((a, b) => b.score - a.score);
  
  // En yüksek puanlı 2 GPU arasından rastgele seçim
  const topGPUs = scoredGPUs.slice(0, 2);
  const randomIndex = Math.floor(Math.random() * topGPUs.length);
  
  return topGPUs[randomIndex]?.gpu || null;
}

// Geliştirilmiş yanıt şablonları
const RESPONSE_TEMPLATES = {
  image_generation: (gpu: GPU) => {
    const rental = createRentalHistory(gpu);
    return {
      text: `
${gpu.name} is a great choice for your image generation tasks!

Key features:
- Create high-resolution images with ${gpu.vram}GB VRAM capacity
- Achieve fast results with a performance score of ${gpu.performance}/100
- Budget-friendly option at an hourly rate of ${gpu.pricePerHour} SOL
`,
      rental: rental
    };
  },

  training: (gpu: GPU) => {
    const rental = createRentalHistory(gpu);
    return {
      text: `
${gpu.name} is an ideal choice for model training!

Technical specifications:
- Process large datasets comfortably with ${gpu.vram}GB VRAM
- Minimize training times with a performance score of ${gpu.performance}/100
- Cost-effective solution at an hourly rate of ${gpu.pricePerHour} SOL
`,
      rental: rental
    };
  },

  inference: (gpu: GPU) => {
    const rental = createRentalHistory(gpu);
    return {
      text: `
${gpu.name} is a very suitable choice for model inference!

Advantages:
- Run multiple models in parallel with ${gpu.vram}GB VRAM
- Ensure low latency with a performance score of ${gpu.performance}/100
- Economical option at an hourly rate of ${gpu.pricePerHour} SOL
`,
      rental: rental
    };
  },

  video_processing: (gpu: GPU) => {
    const rental = createRentalHistory(gpu);
    return {
      text: `
${gpu.name} is an excellent choice for video processing!

Features:
- 4K/8K video processing capability with ${gpu.vram}GB VRAM
- Real-time processing with a performance score of ${gpu.performance}/100
- Affordable pricing at an hourly rate of ${gpu.pricePerHour} SOL
`,
      rental: rental
    };
  }
};


// RentalHistory oluşturma fonksiyonu
function createRentalHistory(gpu: GPU): RentalHistory {
  return {
    id: crypto.randomUUID(),
    gpu: {
      ...gpu,
      imageUrl: `/images/gpus/${gpu.model.toLowerCase().replace(' ', '')}.png`
    },
    hours: 1,
    price: gpu.pricePerHour,
    timestamp: new Date(),
    status: 'active',
    renterAddress: '',
    usageStats: {
      cpuUsage: 0,
      memoryUsage: 0,
      powerUsage: 0,
      temperature: 0,
      gpuUsage: 0
    },
    performanceMetrics: {
      throughput: '0',
      latency: '0',
      successRate: 0
    }
  };
}

// Chat servisi
export const chatService = {
  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskType = determineAITask(message);
      const recommendedGPU = findBestGPU(taskType, message);
      
      if (!recommendedGPU) {
        throw new Error('No suitable GPU found!');
      }
      
      const response = RESPONSE_TEMPLATES[taskType](recommendedGPU);
      
      return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        status: 'sent',
        rental: response.rental
      };
      
    } catch (error) {
      console.error('Chat error:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred!');
      }
    }
  }
};