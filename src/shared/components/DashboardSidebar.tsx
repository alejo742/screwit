"use client"

import Image from "next/image";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  isActive?: boolean;
}

interface DashboardSidebarProps {
  chatSessions?: ChatSession[];
  activeChatId?: string;
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
}

// Mock data for development
const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Pizza Party for 50 People",
    lastMessage: "Great! I've found some amazing pizza deals...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2", 
    title: "Study Group Snacks",
    lastMessage: "Let me help you plan healthy snacks...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    title: "Winter Formal Planning",
    lastMessage: "I've compiled a list of venues...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  }
];

export default function DashboardSidebar({ 
  chatSessions = mockChatSessions, 
  activeChatId,
  onChatSelect,
  onNewChat 
}: DashboardSidebarProps) {
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="w-80 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Image src="/brand/logo.svg" alt="Logo" width={32} height={32} />
          <h1 className="text-xl font-semibold">
            screw<strong className="text-accent-300 font-bold">it</strong>
          </h1>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full gap-2 bg-accent-700 hover:bg-accent-700/90 text-white cursor-pointer transition-all duration-200 hover:shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Event Chat
        </Button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
          Recent Chats
        </h3>
        
        {chatSessions.map((chat) => (
          <Card
            key={chat.id}
            className={cn(
              "p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 border-border/60",
              activeChatId === chat.id && "bg-primary/10 border-primary/30"
            )}
            onClick={() => onChatSelect?.(chat.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center mt-0.5">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate mb-1">
                  {chat.title}
                </h4>
                {chat.lastMessage && (
                  <p className="text-xs text-muted-foreground mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {chat.lastMessage}
                  </p>
                )}
                <span className="text-xs text-muted-foreground/80">
                  {formatTimestamp(chat.timestamp)}
                </span>
              </div>
            </div>
          </Card>
        ))}
        
        {chatSessions.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No chats yet. Start your first event planning session!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
