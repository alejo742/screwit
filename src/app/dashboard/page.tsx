"use client"

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, FileText } from "lucide-react";
import DashboardSidebar from "@/shared/components/DashboardSidebar";
import UserProfileDropdown from "@/shared/components/UserProfileDropdown";
import PromptBox from "@/shared/components/PromptBox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import useAuth from "@/features/users/hooks/useAuth";
import { AgentOption } from "@/shared/types/ai-agent";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  // const enabledOptions = searchParams.get('options'); // TODO: Use for initial agent configuration
  const { user } = useAuth();
  
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'result'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);

  // Handle initial prompt from home page
  React.useEffect(() => {
    if (prompt && !activeChatId) {
      // Create a new chat with the initial prompt
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: prompt,
        timestamp: new Date()
      };
      setMessages([newMessage]);
      setActiveChatId('new-chat');
    }
  }, [prompt, activeChatId]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setActiveTab('chat');
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    // In a real app, you'd load the chat history here
    setActiveTab('chat');
  };

  const handlePromptSubmit = (newPrompt: string, agentOptions: AgentOption[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newPrompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you plan "${newPrompt}". Let me analyze your requirements and gather information using the enabled capabilities: ${agentOptions.filter(opt => opt.enabled).map(opt => opt.title).join(', ')}.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    if (!activeChatId) {
      setActiveChatId('new-chat');
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("User logged out");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar 
        activeChatId={activeChatId || undefined}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chat' | 'result')}>
              <TabsList>
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="result" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Result
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <UserProfileDropdown 
                user={user} 
                onLogout={handleLogout}
                showDashboardLink={false}
              />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100vh-64px)] overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="chat" className="h-full mt-0">
              <div className="h-full flex flex-col">
                {messages.length > 0 ? (
                  <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <Card className={`max-w-2xl ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-card'
                          }`}>
                            <CardContent className="p-4">
                              <p className="text-sm">{message.content}</p>
                              <span className="text-xs opacity-70 mt-2 block">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-6 border-t border-border">
                      <PromptBox 
                        onSubmit={handlePromptSubmit}
                        placeholder="Continue the conversation..."
                        className="max-w-none"
                      />
                    </div>
                  </>
                ) : (
                  /* Empty State */
                  <div className="h-full flex items-center justify-center p-6 overflow-y-auto">
                    <div className="max-w-2xl w-full">
                      <div className="text-center mb-8">
                        <MessageSquare className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                          Start Planning Your Event
                        </h2>
                        <p className="text-muted-foreground">
                          Describe your event idea and let our AI agent help you plan every detail.
                        </p>
                      </div>
                      
                      <PromptBox 
                        onSubmit={handlePromptSubmit}
                        placeholder="Describe your event idea... (e.g., 'I want to host a study break with snacks for 30 people')"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="result" className="h-full mt-0">
              <div className="h-full p-6 overflow-y-auto">
                <Card className="h-full">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Event Plan Results
                      </h3>
                      <p className="text-muted-foreground">
                        {messages.length > 0 
                          ? "AI-generated event plan and infographic will appear here after processing your conversation."
                          : "Start a conversation in the Chat tab to generate your event plan."
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}