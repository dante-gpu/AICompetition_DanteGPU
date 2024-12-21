import fetch from 'node-fetch';
import { config } from '../config';

export class LLMService {
  private readonly API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
  
  async generateResponse(message: string): Promise<string> {
    try {
      console.log('Sending request to Hugging Face API:', message);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputs: message,
          options: {
            wait_for_model: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Hugging Face API response:', data);

      return data[0]?.generated_text || 'I apologize, but I am unable to respond at the moment.';
    } catch (error) {
      console.error('LLM error:', error);
      throw error;
    }
  }
}

export const llmService = new LLMService(); 