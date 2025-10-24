import { config } from '@/config';

/**
 * Base API client for making requests to the backend
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // Redirect to login on 401 Unauthorized
      if (response.status === 401) {
        window.location.href = '/authenticate/login';
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      // Redirect to login on 401 Unauthorized
      if (response.status === 401) {
        window.location.href = '/authenticate/login';
      }

      // Try to parse error message from response body
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed: ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    }

    return response.json();
  }
}

// Export a singleton instance
export const api = new ApiClient();

// Auth types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

// Auth functions
export const register = (data: RegisterRequest) =>
  api.post<AuthResponse>('/api/auth/register', data);

// Channel types
export interface Message {
  id: number;
  message: string;
  channelId: number;
  userId: string;
  username: string;
  avatarUrl?: string | null;
  createdAt: string;
}

// API functions
export const getCats = () => api.get<{ cats: Array<{ id: number; name: string; breed: string }> }>('/api/cats');
export const getChannels = () => api.get<{ channels: Array<{ id: number; name: string }> }>('/api/channels');
export const getChannelMessages = (channelId: number) => api.get<{ messages: Message[] }>(`/api/channels/${channelId}/messages`);
export const getHealth = () => api.get<{ status: string; timestamp: string }>('/api/health');
export const getCurrentUser = () => api.get<{ user: User }>('/api/users/profile');
