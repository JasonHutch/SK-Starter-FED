import React, { useState, useCallback } from 'react';
import { useSignalR } from '@/hooks/useSignalR';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  toolCalls?: Array<{
    tool: string;
    input: string;
    output: string;
  }>;
}

export function ChatWithStreaming() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => `session-${Date.now()}`);
  
  // SignalR connection with streaming handlers
  const { isConnected, sendMessage, joinSession, error } = useSignalR({
    onToolCall: useCallback((data) => {
      console.log('Tool call received:', data);
      // Add tool call to current assistant message
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          return prev.map((msg, index) => 
            index === prev.length - 1 
              ? { 
                  ...msg, 
                  toolCalls: [...(msg.toolCalls || []), data] 
                }
              : msg
          );
        }
        return prev;
      });
    }, []),

    onStreamingStarted: useCallback(() => {
      console.log('Streaming started');
      
      // Add new assistant message for streaming
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, []),

    onStreamingChunk: useCallback((chunk: string) => {
      console.log('Streaming chunk:', chunk);
      
      // Update the last message content
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
          return prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, content: msg.content + chunk }
              : msg
          );
        }
        return prev;
      });
    }, []),

    onStreamingCompleted: useCallback(() => {
      console.log('Streaming completed');
      
      // Mark streaming as complete
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
          return prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, isStreaming: false }
              : msg
          );
        }
        return prev;
      });
    }, []),

    onFinalResponse: useCallback((response: string) => {
      console.log('Final response received:', response);
      // Handle fallback for non-streaming responses
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || !lastMessage.isStreaming) {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          content: response,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    }, [messages])
  });

  // Join session when connected
  React.useEffect(() => {
    if (isConnected) {
      joinSession(sessionId);
    }
  }, [isConnected, joinSession, sessionId]);

  const handleSendMessage = async () => {
    if (!input.trim() || !isConnected) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    try {
      await sendMessage(input, sessionId);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-container flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Connection Status */}
      <div className="connection-status mb-4 p-2 rounded-lg bg-gray-100">
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
        {isConnected ? 'Connected' : 'Disconnected'}
        {error && <span className="text-red-600 ml-2">Error: {error}</span>}
      </div>

      {/* Messages */}
      <div className="messages flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-8' 
                : 'bg-gray-100 mr-8'
            }`}
          >
            <div className="message-header flex justify-between items-center mb-2">
              <span className="font-semibold">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            {/* Tool calls */}
            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="tool-calls mb-2 space-y-1">
                {message.toolCalls.map((toolCall, index) => (
                  <div key={index} className="tool-call text-sm bg-white p-2 rounded border">
                    <span className="text-blue-600">🔧 {toolCall.tool}</span>
                    <div className="text-gray-600 mt-1">{toolCall.input}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Message content with streaming support */}
            <div className="message-content text-gray-800">
              {message.content}
              {message.isStreaming && (
                <span className="cursor animate-pulse ml-1">▋</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="input-section flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
