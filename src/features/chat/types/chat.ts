import { AgentOption } from '@/shared/types/ai-agent';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chatSessionId: string;
  metadata?: {
    agentOptions?: AgentOption[];
    processingTime?: number;
    sources?: string[];
  };
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  lastMessage?: string;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
  agentOptions: {
    amazon: boolean;
    instacart: boolean;
    restaurants: boolean;
    events: boolean;
  };
  messageCount: number;
  status: 'active' | 'archived' | 'deleted';
}

export interface CreateChatSessionData {
  title: string;
  userId: string;
  agentOptions: {
    amazon: boolean;
    instacart: boolean;
    restaurants: boolean;
    events: boolean;
  };
}

export interface CreateMessageData {
  role: 'user' | 'assistant';
  content: string;
  chatSessionId: string;
  metadata?: {
    agentOptions?: AgentOption[];
    processingTime?: number;
    sources?: string[];
  };
}
