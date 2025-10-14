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
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export a singleton instance
export const api = new ApiClient();

// Example usage functions
export const getCats = () => api.get<{ cats: Array<{ id: number; name: string; breed: string }> }>('/api/cats');
export const getChannels = () => api.get<{ channels: Array<{ id: number; name: string }> }>('/api/channels');
export const getHealth = () => api.get<{ status: string; timestamp: string }>('/api/health');
