import React, { useEffect } from 'react';
import { useStreamingText } from '@/hooks/useStreamingText';

interface StreamingMessageProps {
  /** The message content to stream */
  content?: string;
  /** Whether this message is currently receiving streaming content */
  isReceivingStream?: boolean;
  /** Callback when streaming completes */
  onStreamingComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function StreamingMessage({ 
  content = '', 
  isReceivingStream = false,
  onStreamingComplete,
  className = ''
}: StreamingMessageProps) {
  const {
    displayedText,
    isStreaming,
    isComplete,
    setText,
    appendText,
    skipToEnd
  } = useStreamingText({
    typingSpeed: 20, // Adjust speed as needed
    onStreamingComplete
  });

  // Update text when content changes
  useEffect(() => {
    if (content && !isReceivingStream) {
      // Set complete text for non-streaming messages
      setText(content);
    }
  }, [content, isReceivingStream, setText]);

  // Handler for receiving streaming chunks
  const handleStreamingChunk = React.useCallback((chunk: string) => {
    appendText(chunk);
  }, [appendText]);

  return (
    <div className={`streaming-message ${className}`}>
      <div className="message-content">
        {displayedText}
        {isStreaming && (
          <span className="cursor animate-pulse">▋</span>
        )}
      </div>
      
      {/* Skip button for long messages */}
      {isStreaming && displayedText.length > 100 && (
        <button
          onClick={skipToEnd}
          className="skip-button text-xs text-gray-500 hover:text-gray-700 mt-1"
        >
          Skip animation
        </button>
      )}
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-1">
          Status: {isStreaming ? 'Streaming' : isComplete ? 'Complete' : 'Ready'}
          | Displayed: {displayedText.length} chars
        </div>
      )}
    </div>
  );
}

// Hook to integrate with SignalR streaming
export function useStreamingMessage() {
  const {
    displayedText,
    isStreaming,
    isComplete,
    setText,
    appendText,
    clearText,
    skipToEnd
  } = useStreamingText();

  // Reset for new message
  const startNewMessage = React.useCallback(() => {
    clearText();
  }, [clearText]);

  // Handle streaming chunk from SignalR
  const handleStreamingChunk = React.useCallback((chunk: string) => {
    appendText(chunk);
  }, [appendText]);

  // Handle streaming started
  const handleStreamingStarted = React.useCallback(() => {
    clearText(); // Clear previous content
  }, [clearText]);

  // Handle streaming completed
  const handleStreamingCompleted = React.useCallback(() => {
    // Streaming is complete, no additional action needed
    // The useStreamingText hook will handle the completion state
  }, []);

  return {
    displayedText,
    isStreaming,
    isComplete,
    startNewMessage,
    handleStreamingChunk,
    handleStreamingStarted,
    handleStreamingCompleted,
    skipToEnd
  };
}
