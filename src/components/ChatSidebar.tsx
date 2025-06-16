import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit3, X, Check } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
  const { chats, activeChat, createChat, deleteChat, renameChat, setActiveChat } = useChat();
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
    <Sidebar collapsible="icon" className="bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 group-data-[collapsible=icon]:hidden">Chats</h2>
        <SidebarTrigger className="ml-auto" />
      </div>
      
      <SidebarContent className="p-4">
        {/* New Chat Button */}
        <div className="mb-4">
          <Button 
            onClick={createChat} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
          >
            <Plus className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
            <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
          </Button>
        </div>

        {/* Chat List */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-sm font-medium mb-2">
            Recent Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <div className={cn(
                    "flex items-center w-full transition-colors group",
                    activeChat?.id === chat.id 
                      ? "bg-blue-50" 
                      : "hover:bg-gray-100"
                  )}>
                    {editingChatId === chat.id ? (
                      <div className="flex items-center flex-1 min-w-0 p-2 rounded-lg group-data-[collapsible=icon]:hidden">
                        <MessageSquare className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0" />
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-6 text-sm border-0 p-0 focus:ring-0 bg-transparent flex-1"
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
                      <SidebarMenuButton
                        asChild
                        isActive={activeChat?.id === chat.id}
                        tooltip={chat.name}
                        className="w-full justify-start"
                      >
                        <button onClick={() => setActiveChat(chat)} className="flex items-center w-full">
                          <MessageSquare className="h-4 w-4 flex-shrink-0" />
                          <span className="ml-3 truncate group-data-[collapsible=icon]:hidden">{chat.name}</span>
                          <div className="opacity-0 group-hover:opacity-100 flex ml-auto space-x-1 transition-opacity group-data-[collapsible=icon]:hidden">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(chat.id, chat.name);
                              }}
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </button>
                      </SidebarMenuButton>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
