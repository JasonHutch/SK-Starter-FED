import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Wifi, WifiOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { useSignalR } from '@/hooks/useSignalR';
import { AgentSelector } from './AgentSelector';
import { AgentMode, AgentModeLabels } from '@/types/agentMode';

export function ChatInterface() {
  const { activeChat, addMessage, switchAgent } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SignalR integration
  const {
    isConnected,
    isConnecting,
    error: signalRError,
    sendMessage: sendSignalRMessage,
    joinSession,
    leaveSession,
  } = useSignalR({
    autoConnect: true,
    onStreamingStarted: () => {
      console.log('📧 Streaming started');
      setIsStreaming(true);
      setStreamingMessage('');
    },
    onStreamingChunk: (chunk) => {
      console.log('📧 Streaming chunk:', chunk);
      setStreamingMessage(prev => prev + chunk);
    },
    onStreamingCompleted: () => {
      console.log('📧 Streaming completed');
      setIsStreaming(false);
      // Add the final streaming message to chat history
      if (streamingMessage) {
        addMessage({
          content: streamingMessage,
          role: 'assistant'
        });
        setStreamingMessage('');
      }
      setIsLoading(false);
    },
    onToolCall: (data) => {
      // Handle tool call - show intermediate step
      console.log('📧 onToolCall received:', data);
      addMessage({
        content: `🔧 Using ${data.tool}: ${data.input}`,
        role: 'assistant'
      });
    },
    onFinalResponse: (response) => {
      // Handle final response from the AI (fallback for non-streaming)
      console.log('📧 onFinalResponse received:', response);
      if (!isStreaming) {
        addMessage({
          content: response,
          role: 'assistant'
        });
      }
      setIsLoading(false);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Join/leave session when activeChat changes
  useEffect(() => {
    if (activeChat && isConnected) {
      joinSession(activeChat.id).catch(console.error);
      
      return () => {
        leaveSession(activeChat.id).catch(console.error);
      };
    }
  }, [activeChat, isConnected, joinSession, leaveSession]);

  const handleSend = async () => {
    if (!input.trim() || !activeChat || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    addMessage({ content: userMessage, role: 'user' });

    try {
      if (isConnected) {
        // Send message via SignalR with the selected agent mode
        await sendSignalRMessage(userMessage, activeChat.id, activeChat.selectedAgent);
      } else {
        // Fallback: Show connection error and simulate response
        console.warn('SignalR not connected, using fallback');
        setTimeout(() => {
          addMessage({ 
            content: "⚠️ SignalR connection not available. Please check your connection to the C# backend server.", 
            role: 'assistant' 
          });
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage({ 
        content: "❌ Failed to send message. Please try again.", 
        role: 'assistant' 
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to AI Chat
          </h2>
          <p className="text-gray-600">
            Create a new chat to start testing your Semantic Kernel agents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-800">{activeChat.name}</h2>
          <div className="flex items-center space-x-2">
            <AgentSelector
              selectedAgent={activeChat.selectedAgent}
              onAgentChange={switchAgent}
              disabled={isLoading || isStreaming}
            />
            <div className="text-xs text-gray-500">
              • {AgentModeLabels[activeChat.selectedAgent]}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center space-x-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-xs">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChat.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-3",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            )}
            
            <div className={cn(
              "max-w-[80%] rounded-lg px-4 py-2 text-sm",
              message.role === 'user' 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-900"
            )}>
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    components={{
                      code: ({ className, children, ...props }) => (
                        <code
                          className={cn(
                            "bg-gray-200 px-1 py-0.5 rounded text-xs font-mono",
                            className
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                      pre: ({ className, children, ...props }) => (
                        <pre
                          className={cn(
                            "bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto text-xs",
                            className
                          )}
                          {...props}
                        >
                          {children}
                        </pre>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              <p className={cn(
                "text-xs mt-1 opacity-70",
                message.role === 'user' ? "text-blue-100" : "text-gray-500"
              )}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {isStreaming && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown 
                  components={{
                    code: ({ className, children, ...props }) => (
                      <code
                        className={cn(
                          "bg-gray-200 px-1 py-0.5 rounded text-xs font-mono",
                          className
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                    pre: ({ className, children, ...props }) => (
                      <pre
                        className={cn(
                          "bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto text-xs",
                          className
                        )}
                        {...props}
                      >
                        {children}
                      </pre>
                    )
                  }}
                >
                  {streamingMessage}
                </ReactMarkdown>
                {streamingMessage && (
                  <span className="animate-pulse ml-1 text-blue-600">▋</span>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 min-h-[44px] max-h-32 resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-[44px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
