"use client"

/**
 * ChatMessageBubble Component
 * Displays individual chat messages with role-based styling and metadata
 */

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Clock, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { ChatUtils } from '../utils/chat.utils';
import { cn } from '@/lib/utils';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  showMetadata?: boolean;
}

export default function ChatMessageBubble({ message, showMetadata = false }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-2xl w-full",
        isUser ? "ml-12" : "mr-12"
      )}>
        <Card className={cn(
          "shadow-sm border-border/60",
          isUser ? "bg-primary text-primary-foreground" : "bg-card",
          isAssistant && "border-l-4 border-l-accent-300"
        )}>
          <CardContent className="p-4">
            {/* Message Header */}
            <div className="flex items-center gap-2 mb-2">
              {isUser ? (
                <User className="w-4 h-4 opacity-70" />
              ) : (
                <Bot className="w-4 h-4 opacity-70" />
              )}
              <span className="text-xs font-medium opacity-70">
                {isUser ? 'You' : 'AI Assistant'}
              </span>
              <Clock className="w-3 h-3 opacity-50" />
              <span className="text-xs opacity-50">
                {ChatUtils.formatRelativeTime(message.timestamp)}
              </span>
            </div>

            {/* Message Content */}
            <div className="prose prose-sm max-w-none">
              <p className={cn(
                "text-sm leading-relaxed m-0",
                isUser ? "text-primary-foreground" : "text-foreground"
              )}>
                {message.content}
              </p>
            </div>

            {/* Metadata Section */}
            {showMetadata && message.metadata && (
              <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                {/* Agent Options Used */}
                {message.metadata.agentOptions && message.metadata.agentOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs opacity-70 mr-2">Capabilities used:</span>
                    {message.metadata.agentOptions
                      .filter(opt => opt.enabled)
                      .map(option => (
                        <Badge 
                          key={option.id}
                          variant="secondary" 
                          className="text-xs px-2 py-0.5"
                        >
                          {option.title}
                        </Badge>
                      ))
                    }
                  </div>
                )}

                {/* Processing Time */}
                {message.metadata.processingTime && (
                  <div className="text-xs opacity-60">
                    Processed in {Math.round(message.metadata.processingTime)}ms
                  </div>
                )}

                {/* Sources */}
                {message.metadata.sources && message.metadata.sources.length > 0 && (
                  <div className="text-xs opacity-60">
                    Sources: {message.metadata.sources.join(', ')}
                  </div>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs opacity-50 mt-2 text-right">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
