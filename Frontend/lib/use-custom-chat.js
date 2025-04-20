import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './api-client';

// Helper function to detect and format bullet points if needed
const formatContentWithBullets = (content) => {
  if (!content) return '';
  
  // If content already contains markdown-style lists, return as is
  if (content.includes('- ') || content.includes('* ') || content.includes('1. ')) {
    return content;
  }
  
  // Look for bullet-like patterns that might need conversion
  // Pattern: • Item or · Item or any other bullet character
  // Apply a single comprehensive replacement for all bullet types
  // This will convert any line starting with a bullet character to a proper markdown bullet
  const formattedContent = content.replace(/^([•·○◦◘■□▪▫●○★☆➢➤➥➨])\s+(.+)$/gm, '- $2');
  
  // Check for numbered lists (already markdown compatible)
  const hasNumberedLists = /^\d+\.\s+/gm.test(formattedContent);
  
  if (hasNumberedLists) {
    return formattedContent;
  }
  
  return formattedContent;
};

// Helper to format current time for message timestamps
const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Helper to group messages by time
const groupMessagesByTime = (messages, timeWindowMinutes = 5) => {
  if (!messages || messages.length === 0) return [];
  
  const grouped = [];
  let currentGroup = [messages[0]];
  
  for (let i = 1; i < messages.length; i++) {
    const currentMsg = messages[i];
    const prevMsg = messages[i - 1];
    
    // Skip grouping if messages have different roles
    if (currentMsg.role !== prevMsg.role) {
      grouped.push(currentGroup);
      currentGroup = [currentMsg];
      continue;
    }
    
    // Group by time window if timestamps exist
    if (currentMsg.timestamp && prevMsg.timestamp) {
      const timeDiff = new Date(currentMsg.timestamp) - new Date(prevMsg.timestamp);
      const diffMinutes = timeDiff / (1000 * 60);
      
      if (diffMinutes <= timeWindowMinutes) {
        currentGroup.push(currentMsg);
      } else {
        grouped.push(currentGroup);
        currentGroup = [currentMsg];
      }
    } else {
      // No timestamps, just group consecutive messages with same role
      currentGroup.push(currentMsg);
    }
  }
  
  // Add the last group
  if (currentGroup.length > 0) {
    grouped.push(currentGroup);
  }
  
  return grouped;
};

export function useCustomChat({ initialMessages = [], onFinish, sessionId } = {}) {
  const [messages, setMessages] = useState(initialMessages);
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Update grouped messages whenever messages change
  useEffect(() => {
    const grouped = groupMessagesByTime(messages);
    setGroupedMessages(grouped);
  }, [messages]);
  
  // Load messages from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('medical-chat');
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        if (Array.isArray(parsedChat) && parsedChat.length > 0) {
          setMessages(parsedChat);
        }
      } catch (e) {
        console.error('Error loading chat from local storage', e);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError(null);
  };

  // Add typing simulation to make the AI response feel more natural
  const simulateTyping = useCallback((callback, minDelay = 500, maxDelay = 1500) => {
    setIsTyping(true);
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    
    const timer = setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message with metadata
      const userMessage = { 
        id: Date.now(), 
        role: 'user', 
        content: input,
        timestamp: getCurrentTimestamp(),
        status: 'sent'
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      
      // Save to localStorage
      localStorage.setItem('medical-chat', JSON.stringify(newMessages));
      
      // Send message to backend
      let response;
      if (sessionId) {
        response = await apiClient.sendMessage(sessionId, input);
      } else {
        response = await apiClient.createNewChat(input);
      }

      console.log('Backend response:', response); // Debug the response structure

      // Extract message content from response correctly based on backend structure
      let responseContent = '';
      let responseSources = [];

      // Handle different response structures
      if (response.response && response.response.content) {

        responseContent = response.response.content;
      } else if (response.message) {
        // Old structure: response.message
        responseContent = response.message;
      } else if (response.content) {
        // Alternative structure: response.content
        responseContent = response.content;
      } else {
        // Fallback if no recognized structure
        responseContent = 'Unable to display response. Please try again.';
        console.error('Unknown response format:', response);
      }

      // Format the content to properly handle bullet points and other structured data
      responseContent = formatContentWithBullets(responseContent);

      // Extract sources if available
      if (response.sources) {
        responseSources = response.sources;
      }
      
      // Simulate typing for a more natural feel
      simulateTyping(() => {
        // Add AI response with metadata
        const aiMessage = { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: responseContent,
          sources: responseSources,
          timestamp: getCurrentTimestamp(),
          status: 'delivered'
        };
        
        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);
        localStorage.setItem('medical-chat', JSON.stringify(updatedMessages));
        
        if (onFinish) onFinish(aiMessage);
      });
    } catch (error) {
      console.error('Error in chat:', error);
      setError(error.message || 'An error occurred while processing your message');
      
      // Remove the user message if the API call failed
      setMessages(messages);
      setInput(input);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, onFinish, sessionId, simulateTyping]);

  const stop = useCallback(() => {
    setIsLoading(false);
    setIsTyping(false);
  }, []);

  const reload = useCallback(() => {
    if (messages.length >= 2) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      if (lastUserMessage) {
        const newMessages = messages.slice(0, -1);
        setMessages(newMessages);
        setInput(lastUserMessage.content);
        handleSubmit({ preventDefault: () => {} });
      }
    }
  }, [messages, handleSubmit]);

  return {
    messages,
    groupedMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    isTyping,
    stop,
    reload,
    setMessages,
    error
  };
}