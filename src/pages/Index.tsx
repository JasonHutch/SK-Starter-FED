
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { TopNav } from "@/components/TopNav";
import { ChatProvider } from "@/contexts/ChatContext";

const Index = () => {
  return (
    <ChatProvider>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full bg-gray-50">
          <TopNav />
          <div className="flex flex-1">
            <ChatSidebar />
            <ChatInterface />
          </div>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
};

export default Index;
