import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chat';
import { chatService } from '../services/chat';
import { useToast } from './useToast';

const MAX_MESSAGES = 50; // Maksimum mesaj sayısı

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Otomatik kaydırma
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mesaj geçmişini localStorage'a kaydet
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages.slice(-MAX_MESSAGES)));
    }
  }, [messages]);

  // Sayfa yüklendiğinde mesaj geçmişini yükle
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  const handleUserMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'sending',
      animated: true
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Yapay yazma gecikmesi
      await new Promise(resolve => setTimeout(resolve, 500));
      const assistantMessage = await chatService.sendMessage(content);
      
      setMessages(prev => [
        ...prev.map(m => m.id === userMessage.id ? { ...m, status: 'sent' } : m),
        { ...assistantMessage, animated: true }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      showToast('Mesaj gönderilemedi. Lütfen tekrar deneyin.', 'error');
      
      setMessages(prev => 
        prev.map(m => m.id === userMessage.id ? { 
          ...m, 
          status: 'error', 
          error: 'Mesaj gönderilemedi' 
        } : m)
      );
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [showToast]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    showToast('Sohbet geçmişi temizlendi', 'success');
  }, [showToast]);

  const retryMessage = useCallback(async (messageId: string) => {
    const messageToRetry = messages.find(m => m.id === messageId);
    if (!messageToRetry) return;

    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, status: 'sending' } : m)
    );

    await handleUserMessage(messageToRetry.content);
  }, [messages, handleUserMessage]);

  return {
    messages,
    isLoading,
    isTyping,
    handleUserMessage,
    clearHistory,
    retryMessage,
    messagesEndRef
  };
};