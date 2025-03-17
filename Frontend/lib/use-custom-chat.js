import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './api-client';

export function useCustomChat({ initialMessages = [], onFinish, sessionId } = {}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = { id: Date.now(), role: 'user', content: input };
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

      // Add AI response
      const aiMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response.message,
        sources: response.sources || []
      };
      
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      localStorage.setItem('medical-chat', JSON.stringify(updatedMessages));
      
      if (onFinish) onFinish(aiMessage);
    } catch (error) {
      console.error('Error in chat:', error);
      setError(error.message || 'An error occurred while processing your message');
      
      // Remove the user message if the API call failed
      setMessages(messages);
      setInput(input);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, onFinish, sessionId]);

  const stop = useCallback(() => {
    setIsLoading(false);
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
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    setMessages,
    error
  };
}