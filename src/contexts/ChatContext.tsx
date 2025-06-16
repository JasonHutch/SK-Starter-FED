
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  createChat: () => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newName: string) => void;
  setActiveChat: (chat: Chat) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const createChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(chats.length > 1 ? chats.find(chat => chat.id !== chatId) || null : null);
    }
  };

  const renameChat = (chatId: string, newName: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, name: newName } : chat
    ));
    if (activeChat?.id === chatId) {
      setActiveChat(prev => prev ? { ...prev, name: newName } : null);
    }
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!activeChat) return;
    
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    };

    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
    
    setActiveChat(prev => prev ? { 
      ...prev, 
      messages: [...prev.messages, newMessage] 
    } : null);
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      createChat,
      deleteChat,
      renameChat,
      setActiveChat,
      addMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
