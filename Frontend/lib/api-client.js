const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async createNewChat(message) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-user-key'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    }
  }

  async sendMessage(sessionId, message, sources = []) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-user-key'
        },
        body: JSON.stringify({ message })  // Remove sources from request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getChatHistory(sessionId) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${sessionId}`, {
        headers: {
          'X-API-Key': 'test-user-key'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  }

  async getAllChats() {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        headers: {
          'X-API-Key': 'test-user-key'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting all chats:', error);
      throw error;
    }
  }

  async deleteChat(sessionId) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': 'test-user-key'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/chat/upload`, {
        method: 'POST',
        headers: {
          'X-API-Key': 'test-user-key'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async processFile(file, sessionId) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/chat/process-file/${sessionId}`, {
        method: 'POST',
        headers: {
          'X-API-Key': 'test-user-key'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();