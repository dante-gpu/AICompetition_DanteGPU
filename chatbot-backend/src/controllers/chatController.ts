import { Request, Response } from 'express';
import { tokenService } from '../services/tokenService';
import { llmService } from '../services/llmService';
import { config } from '../config';

export class ChatController {
  async handleMessage(req: Request, res: Response) {
    try {
      const { message, walletAddress } = req.body;

      if (!message || !walletAddress) {
        return res.status(400).json({ error: 'Message and wallet address are required' });
      }

      // Token bakiyesi kontrolü - çok düşük bir miktar
      const hasEnoughTokens = await tokenService.checkBalance(walletAddress);
      if (!hasEnoughTokens) {
        return res.status(402).json({ 
          error: 'Insufficient balance',
          minRequired: config.solana.minTokensRequired // 0.001 SOL gibi düşük bir miktar
        });
      }

      // LLM yanıtı al
      const response = await llmService.generateResponse(message);

      res.json({
        response,
        timestamp: new Date().toISOString(),
        metadata: {
          model: 'blenderbot-400M-distill',
          tokens: message.split(' ').length
        }
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const chatController = new ChatController(); 