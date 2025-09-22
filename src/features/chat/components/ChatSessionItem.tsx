/**
 * ChatSessionItem Component
 * Displays individual chat sessions in the sidebar with actions and metadata
 */

"use client"

import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/shared/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  MoreVertical, 
  Archive, 
  Trash2, 
  Clock,
  MessageCircle
} from 'lucide-react';
import { ChatSession } from '../types/chat';
import { ChatUtils } from '../utils/chat.utils';
import { cn } from '@/lib/utils';

interface ChatSessionItemProps {
  session: ChatSession;
  isActive?: boolean;
  onSelect: (sessionId: string) => void;
  onDelete?: (sessionId: string) => void;
  onArchive?: (sessionId: string) => void;
  className?: string;
}

export default function ChatSessionItem({ 
  session, 
  isActive = false, 
  onSelect, 
  onDelete, 
  onArchive,
  className 
}: ChatSessionItemProps) {
  const enabledAgentsCount = ChatUtils.getEnabledAgentCount(session.agentOptions);
  const isStale = ChatUtils.isSessionStale(session, 7); // Consider stale after 7 days

  const handleSelect = () => {
    onSelect(session.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(session.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive?.(session.id);
  };

  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 border-border/60 group",
        isActive && "bg-primary/10 border-primary/30 shadow-sm",
        isStale && "opacity-60",
        className
      )}
      onClick={handleSelect}
    >
      <div className="flex items-start gap-3">
        {/* Chat Icon */}
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 shrink-0",
          isActive ? "bg-primary/20 text-primary" : "bg-primary/15 text-primary"
        )}>
          <MessageSquare className="w-4 h-4" />
        </div>
        
        {/* Chat Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Actions */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={cn(
              "text-sm font-medium truncate",
              isActive ? "text-primary" : "text-foreground"
            )}>
              {session.title}
            </h4>
            
            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {onArchive && (
                  <DropdownMenuItem onClick={handleArchive} className="gap-2">
                    <Archive className="w-3 h-3" />
                    Archive
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Last Message Preview */}
          {session.lastMessage && (
            <p className="text-xs text-muted-foreground mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {session.lastMessage}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground/80">
            {/* Left side - Time and message count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{ChatUtils.formatRelativeTime(session.lastActivity)}</span>
              </div>
              
              {session.messageCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{session.messageCount}</span>
                </div>
              )}
            </div>

            {/* Right side - Agent count */}
            <div className="flex items-center gap-1">
              <span className="text-xs">{enabledAgentsCount} AI tools</span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2 mt-2">
            {isStale && (
              <span className="text-xs px-2 py-0.5 bg-muted/60 rounded text-muted-foreground">
                Inactive
              </span>
            )}
            {session.status === 'archived' && (
              <span className="text-xs px-2 py-0.5 bg-secondary/60 rounded text-secondary-foreground">
                Archived
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
