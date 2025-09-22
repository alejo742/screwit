# Firebase Chat Integration Plan

## Overview
This document outlines the comprehensive Firebase integration for the screwit event planning chat system, following best practices established in the existing authentication architecture.

## Architecture Overview

### 🏗️ Structure
```
src/features/chat/
├── components/           # React components for chat UI
│   ├── ChatMessageBubble.tsx    # Enhanced message display with metadata
│   └── ChatSessionItem.tsx     # Sidebar session items with actions
├── hooks/               # React hooks for state management
│   └── useChat.ts       # Comprehensive chat state management
├── services/            # Firebase service layer
│   └── chat.service.ts  # All Firebase operations
├── types/               # TypeScript interfaces
│   └── chat.ts         # Enhanced type definitions
└── utils/               # Utility functions
    └── chat.utils.ts    # Helper functions and validation
```

## 🔥 Firebase Collections

### Chat Sessions (`chatSessions`)
```typescript
{
  id: string;                    // Document ID
  title: string;                 // Generated from first message
  userId: string;               // Owner reference
  lastActivity: Timestamp;      // For sorting and cleanup
  createdAt: Timestamp;
  updatedAt: Timestamp;
  agentOptions: {               // AI capabilities used
    amazon: boolean;
    instacart: boolean;
    restaurants: boolean;
    events: boolean;
  };
  lastMessage?: string;         // Preview text (first 100 chars)
  messageCount: number;         // For pagination
  status: 'active' | 'archived' | 'deleted';
}
```

### Messages (`messages`)
```typescript
{
  id: string;                   // Document ID
  role: 'user' | 'assistant';
  content: string;              // Message text
  timestamp: Timestamp;
  chatSessionId: string;        // Parent session reference
  metadata?: {                  // Optional AI processing info
    agentOptions?: AgentOption[];
    processingTime?: number;
    sources?: string[];
  };
}
```

## 📊 Firebase Rules

### Security Rules (to be implemented)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chat sessions - users can only access their own
    match /chatSessions/{sessionId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
    }
    
    // Messages - users can only access messages from their sessions
    match /messages/{messageId} {
      allow read, write: if request.auth != null 
        && exists(/databases/$(database)/documents/chatSessions/$(resource.data.chatSessionId))
        && get(/databases/$(database)/documents/chatSessions/$(resource.data.chatSessionId)).data.userId == request.auth.uid;
    }
  }
}
```

## 🔄 Real-time Features

### 1. **Session Synchronization**
- `ChatService.subscribeToUserSessions()` - Real-time session list updates
- Automatic sorting by last activity
- Live status updates (active/archived/deleted)

### 2. **Message Synchronization**
- `ChatService.subscribeToSessionMessages()` - Real-time message updates
- Automatic message ordering
- Live typing indicators (future enhancement)

### 3. **Optimistic Updates**
- Messages appear immediately in UI
- Background Firebase sync
- Error handling with rollback

## 🛠️ Service Layer

### ChatService Methods
- **Session Management**: `createChatSession()`, `updateChatSession()`, `deleteChatSession()`
- **Message Operations**: `createMessage()`, `getSessionMessages()`
- **Real-time Subscriptions**: `subscribeToUserSessions()`, `subscribeToSessionMessages()`
- **Utilities**: `getMessageCount()`, `archiveChatSession()`

### Error Handling Pattern
Following the established auth service pattern:
```typescript
try {
  // Firebase operation
  const result = await firebaseOperation();
  return result;
} catch (error) {
  console.error('Error description:', error);
  throw error; // Re-throw for upper layer handling
}
```

## 🎯 Integration Points

### 1. **Authentication Integration**
- Leverages existing `useAuth()` hook
- User ID validation for all operations
- Automatic session cleanup on logout

### 2. **UI Component Integration**
- Enhanced `PromptBox` with agent options metadata
- Real-time `DashboardSidebar` updates
- Message bubbles with processing metadata

### 3. **Agent Options Pipeline**
- Conversion utilities: `ChatUtils.convertAgentOptionsToSessionFormat()`
- Metadata preservation in messages
- Real-time capability tracking

## 🔧 Utility Functions

### ChatUtils Class
- **Title Generation**: `generateChatTitle()` - Smart truncation from first message
- **Time Formatting**: `formatRelativeTime()` - Consistent timestamp display
- **Validation**: `validateChatSessionData()` - Input validation
- **Agent Conversion**: `convertAgentOptionsToSessionFormat()` - Type conversion
- **Content Sanitization**: `sanitizeMessageContent()` - Security cleanup

## 🎨 Enhanced UI Components

### ChatMessageBubble
- Role-based styling (user vs assistant)
- Metadata display (processing time, sources, capabilities used)
- Responsive design with proper truncation
- Accessibility features

### ChatSessionItem
- Action menu (archive, delete)
- Status indicators (active, stale, archived)
- Message count and agent count display
- Optimistic UI updates

## 🔄 State Management

### useChat Hook
- **Centralized State**: Sessions, messages, loading, errors
- **Action Methods**: CRUD operations with proper error handling
- **Real-time Updates**: Automatic subscription management
- **Optimistic UI**: Immediate feedback with background sync

### State Flow
1. User authentication triggers session subscription
2. Session selection triggers message subscription
3. Message send creates optimistic UI update
4. Background Firebase sync confirms/reverts changes
5. Real-time listeners update all connected clients

## 🚀 Implementation Status

### ✅ Completed
- Enhanced type definitions with metadata support
- Comprehensive ChatService with all CRUD operations
- Real-time subscription system
- Utility functions with validation
- Enhanced UI components with actions
- Integrated useChat hook with error handling

### 🔄 Next Steps
1. **Dashboard Integration**: Update existing dashboard to use new chat system
2. **Firebase Rules**: Implement security rules
3. **AI Integration**: Connect real AI services to replace mock responses
4. **Performance**: Add pagination for large message lists
5. **Offline Support**: Implement offline-first with sync

## 📈 Performance Considerations

### Pagination Strategy
- Limit initial message load to 100 messages
- Implement "load more" functionality
- Use Firestore cursor-based pagination

### Real-time Optimization
- Unsubscribe listeners on component unmount
- Debounce rapid updates
- Local state caching for better UX

### Memory Management
- Clear inactive session data
- Implement message cleanup for old sessions
- Optimize re-renders with React.memo

## 🔒 Security Best Practices

### Data Validation
- Server-side validation via Firebase Functions (future)
- Client-side input sanitization
- Type-safe operations throughout

### Access Control
- User-scoped data access only
- Session ownership verification
- Message access through session ownership

This integration follows the established patterns in the auth system while providing a robust, real-time chat experience with proper error handling, type safety, and scalable architecture.
