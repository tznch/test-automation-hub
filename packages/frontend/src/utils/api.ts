// Simplified API client for open-source platform (no auth required)

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { mockItems, mockUsers, mockFeatureFlags } from '../data/mockData';

class ApiClient {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || error.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      console.warn(`API request failed: ${endpoint}. Falling back to mock data.`);
      return this.getMockData(endpoint, options);
    }
  }

  private getMockData(endpoint: string, _options: RequestInit = {}): any {
    // Simulate network delay
    // await new Promise(resolve => setTimeout(resolve, 500));

    if (endpoint.startsWith('/items')) {
      const url = new URL(`http://localhost${endpoint}`);
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = Number(url.searchParams.get('limit')) || 10;
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search')?.toLowerCase();

      let items = [...mockItems];

      if (category && category !== 'all') {
        items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        items = items.filter(i => i.name.toLowerCase().includes(search));
      }

      const total = items.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        items: items.slice(start, end),
        total,
        page,
        totalPages
      };
    }

    if (endpoint.startsWith('/users')) {
      return mockUsers;
    }

    if (endpoint.startsWith('/flags')) {
      return mockFeatureFlags;
    }

    if (endpoint === '/auth/me') {
      return mockUsers[0]; // Return admin user
    }

    if (endpoint === '/auth/login') {
      return { user: mockUsers[0], token: 'mock-jwt-token' };
    }

    throw new Error(`No mock data for endpoint: ${endpoint}`);
  }

  // Convenience methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
