export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
  error?: string;
  rental?: RentalHistory;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}