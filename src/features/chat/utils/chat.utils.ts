/**
 * Chat Utilities
 * This utility provides helper functions for chat operations such as generating titles,
 * formatting timestamps, and handling agent options.
 */

import { AgentOption } from '@/shared/types/ai-agent';
import { ChatSession, CreateChatSessionData } from '../types/chat';

export class ChatUtils {
  /**
   * Generates a chat title from the first user message
   * @param content The content of the first message
   * @param maxLength Maximum length of the generated title
   * @returns Generated title string
   */
  static generateChatTitle(content: string, maxLength: number = 50): string {
    const cleanContent = content.trim();
    
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    
    const truncated = cleanContent.substring(0, maxLength - 3);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.7) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  }

  /**
   * Converts AgentOption array to chat session agent options format
   * @param agentOptions Array of agent options from the prompt box
   * @returns Chat session compatible agent options object
   */
  static convertAgentOptionsToSessionFormat(agentOptions: AgentOption[]): CreateChatSessionData['agentOptions'] {
    const sessionOptions = {
      amazon: false,
      instacart: false,
      restaurants: false,
      events: false
    };

    agentOptions.forEach(option => {
      if (option.id in sessionOptions) {
        sessionOptions[option.id as keyof typeof sessionOptions] = option.enabled;
      }
    });

    return sessionOptions;
  }

  /**
   * Formats a relative timestamp for chat display
   * @param date The date to format
   * @returns Formatted relative time string
   */
  static formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Validates chat session data before creation
   * @param data Chat session creation data to validate
   * @returns Validation result with success status and error message
   */
  static validateChatSessionData(data: CreateChatSessionData): { isValid: boolean; error?: string } {
    if (!data.title || data.title.trim().length === 0) {
      return { isValid: false, error: 'Chat title is required' };
    }

    if (data.title.length > 100) {
      return { isValid: false, error: 'Chat title must be 100 characters or less' };
    }

    if (!data.userId || data.userId.trim().length === 0) {
      return { isValid: false, error: 'User ID is required' };
    }

    if (!data.agentOptions) {
      return { isValid: false, error: 'Agent options are required' };
    }

    return { isValid: true };
  }

  /**
   * Checks if a chat session belongs to the current user
   * @param session The chat session to check
   * @param userId The current user ID
   * @returns Boolean indicating ownership
   */
  static isSessionOwnedByUser(session: ChatSession, userId: string): boolean {
    return session.userId === userId;
  }

  /**
   * Gets the count of enabled agent options
   * @param agentOptions Agent options object
   * @returns Number of enabled options
   */
  static getEnabledAgentCount(agentOptions: ChatSession['agentOptions']): number {
    return Object.values(agentOptions).filter(Boolean).length;
  }

  /**
   * Sanitizes message content for storage
   * @param content Raw message content
   * @returns Sanitized content string
   */
  static sanitizeMessageContent(content: string): string {
    return content.trim().replace(/\s+/g, ' ');
  }

  /**
   * Determines if a chat session is considered stale
   * @param session The chat session to check
   * @param staleDays Number of days to consider stale (default: 30)
   * @returns Boolean indicating if session is stale
   */
  static isSessionStale(session: ChatSession, staleDays: number = 30): boolean {
    const now = new Date();
    const staleDate = new Date(now.getTime() - (staleDays * 24 * 60 * 60 * 1000));
    return session.lastActivity < staleDate;
  }
}
