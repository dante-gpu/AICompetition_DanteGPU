import { GPU } from '../types/gpu';

export const gpus: GPU[] = [
  {
    id: '1',
    name: 'RTX 4090',
    vram: 24,
    performance: 100,
    pricePerHour: 0.05,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=2940'
  },
  {
    id: '2',
    name: 'RTX 4080',
    vram: 16,
    performance: 85,
    pricePerHour: 0.035,
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=2940'
  },
  {
    id: '3',
    name: 'RTX 3080',
    vram: 10,
    performance: 70,
    pricePerHour: 0.025,
    imageUrl: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2f?auto=format&fit=crop&q=80&w=2940'
  }
];