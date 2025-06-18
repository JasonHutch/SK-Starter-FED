import { useEffect, useState, useCallback, useRef } from 'react';
import { signalRService } from '@/services/signalRService';
import * as signalR from '@microsoft/signalr';

export interface UseSignalROptions {
  autoConnect?: boolean;
  onToolCall?: (data: { tool: string; input: string; output: string }) => void;
  onFinalResponse?: (response: string) => void;
  onStreamingChunk?: (chunk: string) => void;
  onStreamingStarted?: () => void;
  onStreamingCompleted?: () => void;
}

export function useSignalR(options: UseSignalROptions = {}) {
  const { 
    autoConnect = true, 
    onToolCall, 
    onFinalResponse, 
    onStreamingChunk, 
    onStreamingStarted, 
    onStreamingCompleted 
  } = options;
  
  // Use refs to store the latest callbacks without causing re-renders
  const onToolCallRef = useRef(onToolCall);
  const onFinalResponseRef = useRef(onFinalResponse);
  const onStreamingChunkRef = useRef(onStreamingChunk);
  const onStreamingStartedRef = useRef(onStreamingStarted);
  const onStreamingCompletedRef = useRef(onStreamingCompleted);
  
  // Update refs when callbacks change
  useEffect(() => {
    onToolCallRef.current = onToolCall;
  }, [onToolCall]);
  
  useEffect(() => {
    onFinalResponseRef.current = onFinalResponse;
  }, [onFinalResponse]);
  
  useEffect(() => {
    onStreamingChunkRef.current = onStreamingChunk;
  }, [onStreamingChunk]);
  
  useEffect(() => {
    onStreamingStartedRef.current = onStreamingStarted;
  }, [onStreamingStarted]);
  
  useEffect(() => {
    onStreamingCompletedRef.current = onStreamingCompleted;
  }, [onStreamingCompleted]);
  
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (isConnecting || signalRService.isConnectionActive()) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const success = await signalRService.connect();
      if (success) {
        setConnectionState(signalR.HubConnectionState.Connected);
      } else {
        setError('Failed to connect to SignalR hub');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const disconnect = useCallback(async () => {
    try {
      await signalRService.disconnect();
      setConnectionState(signalR.HubConnectionState.Disconnected);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    }
  }, []);

  const sendMessage = useCallback(async (message: string, chatId: string) => {
    try {
      await signalRService.sendMessage(message, chatId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, []);

  const joinSession = useCallback(async (chatId: string) => {
    try {
      await signalRService.joinSession(chatId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join session');
      throw err;
    }
  }, []);

  const leaveSession = useCallback(async (chatId: string) => {
    try {
      await signalRService.leaveSession(chatId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave session');
      throw err;
    }
  }, []);

  useEffect(() => {
    // Set up event handlers only once using stable wrapper functions
    const handleToolCall = (data: { tool: string; input: string; output: string }) => {
      console.log('🎯 handleToolCall wrapper called');
      onToolCallRef.current?.(data);
    };
    
    const handleFinalResponse = (response: string) => {
      console.log('🎯 handleFinalResponse wrapper called');
      onFinalResponseRef.current?.(response);
    };

    const handleStreamingChunk = (chunk: string) => {
      console.log('🎯 handleStreamingChunk wrapper called');
      onStreamingChunkRef.current?.(chunk);
    };

    const handleStreamingStarted = () => {
      console.log('🎯 handleStreamingStarted wrapper called');
      onStreamingStartedRef.current?.();
    };

    const handleStreamingCompleted = () => {
      console.log('🎯 handleStreamingCompleted wrapper called');
      onStreamingCompletedRef.current?.();
    };

    console.log('🔧 Registering SignalR event handlers');
    // Register event handlers (only the ones that exist in SignalRService)
    signalRService.onToolCall(handleToolCall);
    signalRService.onFinalResponse(handleFinalResponse);
    signalRService.onStreamingChunk(handleStreamingChunk);
    signalRService.onStreamingStarted(handleStreamingStarted);
    signalRService.onStreamingCompleted(handleStreamingCompleted);

    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }

    // Update connection state periodically
    const interval = setInterval(() => {
      const currentState = signalRService.getConnectionState();
      setConnectionState(currentState);
    }, 1000);

    return () => {
      console.log('🧹 Cleaning up SignalR useEffect');
      clearInterval(interval);
      signalRService.removeEventHandlers();
    };
  }, [autoConnect, connect]); // Remove callback dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, disconnect]);

  return {
    connectionState,
    isConnected: connectionState === signalR.HubConnectionState.Connected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
    joinSession,
    leaveSession,
    clearError: () => setError(null),
  };
}
