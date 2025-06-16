
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatProvider } from "@/contexts/ChatContext";

const Index = () => {
  return (
    <ChatProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <ChatSidebar />
          <ChatInterface />
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
};

export default Index;
