import { useState, useRef, useCallback } from 'react';

export interface UseStreamingTextOptions {
  /** Delay between characters in milliseconds (default: 30) */
  typingSpeed?: number;
  /** Whether to start typing immediately when text is set */
  autoStart?: boolean;
  /** Callback when streaming starts */
  onStreamingStart?: () => void;
  /** Callback when streaming completes */
  onStreamingComplete?: () => void;
}

export function useStreamingText(options: UseStreamingTextOptions = {}) {
  const {
    typingSpeed = 30,
    autoStart = true,
    onStreamingStart,
    onStreamingComplete
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const queuedTextRef = useRef('');
  const currentIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startStreaming = useCallback(() => {
    if (isStreaming || queuedTextRef.current.length === 0) return;
    
    setIsStreaming(true);
    setIsComplete(false);
    onStreamingStart?.();
    
    intervalRef.current = setInterval(() => {
      const fullText = queuedTextRef.current;
      const currentIndex = currentIndexRef.current;
      
      if (currentIndex >= fullText.length) {
        // Streaming complete
        setIsStreaming(false);
        setIsComplete(true);
        onStreamingComplete?.();
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      
      // Add next character
      setDisplayedText(fullText.slice(0, currentIndex + 1));
      currentIndexRef.current++;
    }, typingSpeed);
  }, [isStreaming, typingSpeed, onStreamingStart, onStreamingComplete]);

  const stopStreaming = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsStreaming(false);
    // Show full text immediately
    setDisplayedText(queuedTextRef.current);
    currentIndexRef.current = queuedTextRef.current.length;
    setIsComplete(true);
  }, []);

  const appendText = useCallback((chunk: string) => {
    queuedTextRef.current += chunk;
    
    // If not currently streaming and autoStart is enabled, start streaming
    if (!isStreaming && autoStart) {
      startStreaming();
    }
  }, [isStreaming, autoStart, startStreaming]);

  const setText = useCallback((text: string) => {
    // Reset everything
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    queuedTextRef.current = text;
    currentIndexRef.current = 0;
    setDisplayedText('');
    setIsStreaming(false);
    setIsComplete(false);
    
    if (autoStart && text.length > 0) {
      startStreaming();
    }
  }, [autoStart, startStreaming]);

  const clearText = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    queuedTextRef.current = '';
    currentIndexRef.current = 0;
    setDisplayedText('');
    setIsStreaming(false);
    setIsComplete(false);
  }, []);

  const skipToEnd = useCallback(() => {
    stopStreaming();
  }, [stopStreaming]);

  return {
    /** The currently displayed text */
    displayedText,
    /** Whether text is currently being streamed */
    isStreaming,
    /** Whether streaming is complete */
    isComplete,
    /** The full text that will be displayed when streaming completes */
    fullText: queuedTextRef.current,
    /** Start streaming the current text */
    startStreaming,
    /** Stop streaming and show full text */
    stopStreaming,
    /** Set new text to stream (replaces current text) */
    setText,
    /** Append text to the end of current text */
    appendText,
    /** Clear all text */
    clearText,
    /** Skip to the end (show full text immediately) */
    skipToEnd
  };
}
