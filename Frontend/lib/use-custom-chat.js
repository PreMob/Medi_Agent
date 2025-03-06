import { useState, useEffect, useCallback } from 'react';

export function useCustomChat({ initialMessages = [], onFinish } = {}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
  };

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    
    // Save to localStorage
    localStorage.setItem('medical-chat', JSON.stringify(newMessages));
    
    // Simulate AI response with a delay
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: `This is a simulated response to: "${input}". In a real implementation, this would be replaced with an actual API call to your AI backend.` 
      };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      setIsLoading(false);
      localStorage.setItem('medical-chat', JSON.stringify(updatedMessages));
      if (onFinish) onFinish(aiMessage);
    }, 1000);
  }, [input, messages, onFinish]);

  const stop = useCallback(() => {
    setIsLoading(false);
    // In a real implementation, you would abort the API call here
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
    setMessages
  };
}