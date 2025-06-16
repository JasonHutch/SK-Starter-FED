import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit3, X, Check, Menu } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
  const { chats, activeChat, createChat, deleteChat, renameChat, setActiveChat } = useChat();
  const { state } = useSidebar();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartEdit = (chatId: string, currentName: string) => {
    setEditingChatId(chatId);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingChatId && editingName.trim()) {
      renameChat(editingChatId, editingName.trim());
    }
    setEditingChatId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditingName('');
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {state === "expanded" ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900">AI Chat</h2>
            <SidebarTrigger className="h-6 w-6" />
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <SidebarTrigger className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>
        )}
      </div>
      
      <SidebarContent className="p-4">
        {state === "expanded" && (
          <>
            <div className="mb-4">
              <Button 
                onClick={createChat} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600 text-sm font-medium mb-2">
                Recent Chats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <div className={cn(
                        "flex items-center w-full p-2 rounded-lg transition-colors group",
                        activeChat?.id === chat.id 
                          ? "bg-blue-50 border border-blue-200" 
                          : "hover:bg-gray-100"
                      )}>
                        <MessageSquare className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0" />
                        
                        {editingChatId === chat.id ? (
                          <div className="flex items-center flex-1 min-w-0">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-6 text-sm border-0 p-0 focus:ring-0 bg-transparent"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              autoFocus
                            />
                            <div className="flex ml-2 space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSaveEdit}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setActiveChat(chat)}
                              className="flex-1 text-left text-sm text-gray-900 truncate min-w-0"
                            >
                              {chat.name}
                            </button>
                            <div className="opacity-0 group-hover:opacity-100 flex ml-2 space-x-1 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStartEdit(chat.id, chat.name)}
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteChat(chat.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {state === "collapsed" && (
          <div className="flex flex-col items-center space-y-4">
            <Button 
              onClick={createChat} 
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col space-y-2">
              {chats.slice(0, 5).map((chat) => (
                <Button
                  key={chat.id}
                  size="icon"
                  variant={activeChat?.id === chat.id ? "default" : "ghost"}
                  onClick={() => setActiveChat(chat)}
                  className={cn(
                    "h-8 w-8",
                    activeChat?.id === chat.id && "bg-blue-600 text-white"
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
