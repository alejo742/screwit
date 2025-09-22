/**
 * useChat hook
 * Manages chat state, real-time updates, and chat operations for the dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { AgentOption } from '@/shared/types/ai-agent';
import { ChatMessage, ChatSession } from '../types/chat';
import ChatService from '../services/chat.service';
import { ChatUtils } from '../utils/chat.utils';
import useAuth from '@/features/users/hooks/useAuth';

interface UseChatState {
  sessions: ChatSession[];
  activeChatId: string | null;
  activeMessages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

interface UseChatActions {
  createNewChat: (title: string, agentOptions: AgentOption[]) => Promise<ChatSession>;
  sendMessage: (content: string, agentOptions?: AgentOption[]) => Promise<void>;
  switchToChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  archiveChat: (chatId: string) => Promise<void>;
  clearError: () => void;
}

export default function useChat(): UseChatState & UseChatActions {
  const { user } = useAuth();
  const [state, setState] = useState<UseChatState>({
    sessions: [],
    activeChatId: null,
    activeMessages: [],
    loading: true,
    error: null
  });

  /**
   * Sets error state with message
   */
  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Sets loading state
   */
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  /**
   * Creates a new chat session
   */
  const createNewChat = useCallback(async (title: string, agentOptions: AgentOption[]): Promise<ChatSession> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      clearError();

      const sessionData = {
        title: ChatUtils.generateChatTitle(title),
        userId: user.id,
        agentOptions: ChatUtils.convertAgentOptionsToSessionFormat(agentOptions)
      };

      const validation = ChatUtils.validateChatSessionData(sessionData);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const newSession = await ChatService.createChatSession(sessionData);
      
      setState(prev => ({
        ...prev,
        sessions: [newSession, ...prev.sessions],
        activeChatId: newSession.id,
        activeMessages: [],
        loading: false
      }));

      return newSession;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat';
      setError(errorMessage);
      throw error;
    }
  }, [user, setLoading, clearError, setError]);

  /**
   * Sends a message to the active chat
   */
  const sendMessage = useCallback(async (content: string, agentOptions?: AgentOption[]): Promise<void> => {
    if (!user || !state.activeChatId) {
      throw new Error('No active chat session');
    }

    try {
      setLoading(true);
      clearError();

      const sanitizedContent = ChatUtils.sanitizeMessageContent(content);
      
      await ChatService.createMessage({
        role: 'user',
        content: sanitizedContent,
        chatSessionId: state.activeChatId,
        metadata: agentOptions ? { agentOptions } : undefined
      });

      // Simulate AI response (replace with actual AI service integration)
      setTimeout(async () => {
        try {
          const enabledOptions = agentOptions?.filter(opt => opt.enabled) || [];
          const aiContent = `I'll help you plan "${sanitizedContent}". Let me analyze your requirements and gather information using the enabled capabilities: ${enabledOptions.map(opt => opt.title).join(', ')}.`;
          
          await ChatService.createMessage({
            role: 'assistant',
            content: aiContent,
            chatSessionId: state.activeChatId!,
            metadata: {
              agentOptions: enabledOptions,
              processingTime: Math.random() * 2000 + 1000,
              sources: ['Amazon API', 'Instacart API', 'Restaurant Database']
            }
          });
        } catch (error) {
          console.error('Error sending AI response:', error);
        }
      }, 1000);

      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      throw error;
    }
  }, [user, state.activeChatId, setLoading, clearError, setError]);

  /**
   * Switches to a different chat session
   */
  const switchToChat = useCallback(async (chatId: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const messages = await ChatService.getSessionMessages(chatId);
      
      setState(prev => ({
        ...prev,
        activeChatId: chatId,
        activeMessages: messages,
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load chat';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, clearError, setError]);

  /**
   * Deletes a chat session
   */
  const deleteChat = useCallback(async (chatId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      clearError();

      await ChatService.deleteChatSession(chatId);
      
      setState(prev => ({
        ...prev,
        sessions: prev.sessions.filter(session => session.id !== chatId),
        activeChatId: prev.activeChatId === chatId ? null : prev.activeChatId,
        activeMessages: prev.activeChatId === chatId ? [] : prev.activeMessages,
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete chat';
      setError(errorMessage);
      throw error;
    }
  }, [user, setLoading, clearError, setError]);

  /**
   * Archives a chat session
   */
  const archiveChat = useCallback(async (chatId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      clearError();

      await ChatService.archiveChatSession(chatId);
      
      setState(prev => ({
        ...prev,
        sessions: prev.sessions.filter(session => session.id !== chatId),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive chat';
      setError(errorMessage);
      throw error;
    }
  }, [user, setLoading, clearError, setError]);

  /**
   * Set up real-time listeners for user sessions
   */
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = ChatService.subscribeToUserSessions(user.id, (sessions) => {
      setState(prev => ({
        ...prev,
        sessions,
        loading: false
      }));
    });

    return unsubscribe;
  }, [user, setLoading]);

  /**
   * Set up real-time listener for active chat messages
   */
  useEffect(() => {
    if (!state.activeChatId) return;

    const unsubscribe = ChatService.subscribeToSessionMessages(state.activeChatId, (messages) => {
      setState(prev => ({
        ...prev,
        activeMessages: messages
      }));
    });

    return unsubscribe;
  }, [state.activeChatId]);

  return {
    ...state,
    createNewChat,
    sendMessage,
    switchToChat,
    deleteChat,
    archiveChat,
    clearError
  };
}
