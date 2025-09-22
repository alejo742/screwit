/**
 * Chat Service
 * This service handles chat-related operations such as creating chat sessions, 
 * managing messages, and real-time chat synchronization.
 */

import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  onSnapshot,
  Timestamp,
  QuerySnapshot
} from 'firebase/firestore';
import { ChatSession, ChatMessage, CreateChatSessionData, CreateMessageData } from '../types/chat';

export default class ChatService {
  /****** CHAT SESSION OPERATIONS ******/

  /**
   * Creates a new chat session in Firestore
   * @param data The chat session data containing title, userId, and agent options
   * @returns Promise that resolves to the created chat session
   */
  static async createChatSession(data: CreateChatSessionData): Promise<ChatSession> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User must be authenticated to create a chat session');

      const sessionRef = doc(collection(db, 'chatSessions'));
      const now = new Date();
      
      const chatSession: ChatSession = {
        id: sessionRef.id,
        title: data.title,
        userId: data.userId,
        lastActivity: now,
        createdAt: now,
        updatedAt: now,
        agentOptions: data.agentOptions,
        messageCount: 0,
        status: 'active'
      };

      await setDoc(sessionRef, {
        ...chatSession,
        createdAt: Timestamp.fromDate(chatSession.createdAt),
        updatedAt: Timestamp.fromDate(chatSession.updatedAt),
        lastActivity: Timestamp.fromDate(chatSession.lastActivity)
      });

      return chatSession;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Retrieves all chat sessions for the current user
   * @param userId The user ID to fetch sessions for
   * @param limitCount Optional limit for number of sessions to fetch
   * @returns Promise that resolves to an array of chat sessions
   */
  static async getUserChatSessions(userId: string, limitCount: number = 50): Promise<ChatSession[]> {
    try {
      const sessionsRef = collection(db, 'chatSessions');
      const q = query(
        sessionsRef,
        where('userId', '==', userId),
        where('status', '==', 'active'),
        orderBy('lastActivity', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const sessions: ChatSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          lastActivity: data.lastActivity.toDate()
        } as ChatSession);
      });

      return sessions;
    } catch (error) {
      console.error('Error fetching user chat sessions:', error);
      throw error;
    }
  }

  /**
   * Gets a specific chat session by ID
   * @param sessionId The chat session ID
   * @returns Promise that resolves to the chat session or null if not found
   */
  static async getChatSessionById(sessionId: string): Promise<ChatSession | null> {
    try {
      const sessionDoc = await getDoc(doc(db, 'chatSessions', sessionId));
      
      if (!sessionDoc.exists()) return null;

      const data = sessionDoc.data();
      return {
        ...data,
        id: sessionDoc.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        lastActivity: data.lastActivity.toDate()
      } as ChatSession;
    } catch (error) {
      console.error('Error getting chat session by ID:', error);
      throw error;
    }
  }

  /**
   * Updates a chat session's metadata
   * @param sessionId The chat session ID
   * @param updates Partial chat session data to update
   * @returns Promise that resolves when the update is complete
   */
  static async updateChatSession(sessionId: string, updates: Partial<ChatSession>): Promise<void> {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      const updateData: Record<string, unknown> = { ...updates };
      
      if (updates.lastActivity) {
        updateData.lastActivity = Timestamp.fromDate(updates.lastActivity);
      }
      if (updates.updatedAt) {
        updateData.updatedAt = Timestamp.fromDate(updates.updatedAt);
      }

      await updateDoc(sessionRef, updateData);
    } catch (error) {
      console.error('Error updating chat session:', error);
      throw error;
    }
  }

  /**
   * Soft deletes a chat session by marking it as deleted
   * @param sessionId The chat session ID to delete
   * @returns Promise that resolves when the deletion is complete
   */
  static async deleteChatSession(sessionId: string): Promise<void> {
    try {
      await this.updateChatSession(sessionId, {
        status: 'deleted',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw error;
    }
  }

  /**
   * Archives a chat session
   * @param sessionId The chat session ID to archive
   * @returns Promise that resolves when the archiving is complete
   */
  static async archiveChatSession(sessionId: string): Promise<void> {
    try {
      await this.updateChatSession(sessionId, {
        status: 'archived',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error archiving chat session:', error);
      throw error;
    }
  }

  /****** MESSAGE OPERATIONS ******/

  /**
   * Creates a new message in a chat session
   * @param data The message data containing role, content, and chat session ID
   * @returns Promise that resolves to the created message
   */
  static async createMessage(data: CreateMessageData): Promise<ChatMessage> {
    try {
      const messageRef = doc(collection(db, 'messages'));
      const now = new Date();

      const message: ChatMessage = {
        id: messageRef.id,
        role: data.role,
        content: data.content,
        timestamp: now,
        chatSessionId: data.chatSessionId,
        metadata: data.metadata
      };

      await setDoc(messageRef, {
        ...message,
        timestamp: Timestamp.fromDate(message.timestamp)
      });

      // Update the chat session's last activity and message count
      await this.updateChatSession(data.chatSessionId, {
        lastActivity: now,
        updatedAt: now,
        lastMessage: data.content.substring(0, 100),
        messageCount: await this.getMessageCount(data.chatSessionId)
      });

      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  /**
   * Retrieves all messages for a specific chat session
   * @param sessionId The chat session ID
   * @param limitCount Optional limit for number of messages to fetch
   * @returns Promise that resolves to an array of messages
   */
  static async getSessionMessages(sessionId: string, limitCount: number = 100): Promise<ChatMessage[]> {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('chatSessionId', '==', sessionId),
        orderBy('timestamp', 'asc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const messages: ChatMessage[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          ...data,
          id: doc.id,
          timestamp: data.timestamp.toDate()
        } as ChatMessage);
      });

      return messages;
    } catch (error) {
      console.error('Error fetching session messages:', error);
      throw error;
    }
  }

  /**
   * Gets the message count for a chat session
   * @param sessionId The chat session ID
   * @returns Promise that resolves to the message count
   */
  static async getMessageCount(sessionId: string): Promise<number> {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, where('chatSessionId', '==', sessionId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting message count:', error);
      throw error;
    }
  }

  /****** REAL-TIME OPERATIONS ******/

  /**
   * Sets up real-time listener for chat sessions
   * @param userId The user ID to listen for sessions
   * @param callback Function to call when sessions update
   * @returns Unsubscribe function to stop listening
   */
  static subscribeToUserSessions(
    userId: string, 
    callback: (sessions: ChatSession[]) => void
  ): () => void {
    const sessionsRef = collection(db, 'chatSessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('lastActivity', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const sessions: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          lastActivity: data.lastActivity.toDate()
        } as ChatSession);
      });
      callback(sessions);
    });
  }

  /**
   * Sets up real-time listener for messages in a chat session
   * @param sessionId The chat session ID to listen for messages
   * @param callback Function to call when messages update
   * @returns Unsubscribe function to stop listening
   */
  static subscribeToSessionMessages(
    sessionId: string, 
    callback: (messages: ChatMessage[]) => void
  ): () => void {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatSessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          ...data,
          id: doc.id,
          timestamp: data.timestamp.toDate()
        } as ChatMessage);
      });
      callback(messages);
    });
  }
}
