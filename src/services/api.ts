/**
 * Central API Service for 360CRM Enterprise
 * Handles authentication headers, URL parameter serialization, JSON parsing, and error formatting.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('360crm_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('360crm_token', token);
    } else {
      localStorage.removeItem('360crm_token');
    }
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('360crm_token');
    }
    return this.token;
  }

  private normalizeUrl(endpoint: string, params?: Record<string, any>): string {
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (cleanEndpoint.startsWith('/api/')) {
      cleanEndpoint = cleanEndpoint.replace('/api', '');
    } else if (cleanEndpoint === '/api') {
      cleanEndpoint = '';
    }

    let url = `${API_BASE_URL}${cleanEndpoint}`;

    if (params && typeof params === 'object') {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return url;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  public async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = this.normalizeUrl(endpoint, params);
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(`API GET ${endpoint} Error:`, err);
      return { success: false, message: err.message || 'Network request failed' };
    }
  }

  public async post<T = any>(endpoint: string, payload?: any): Promise<ApiResponse<T>> {
    try {
      const url = this.normalizeUrl(endpoint);
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(`API POST ${endpoint} Error:`, err);
      return { success: false, message: err.message || 'Network request failed' };
    }
  }

  public async put<T = any>(endpoint: string, payload?: any): Promise<ApiResponse<T>> {
    try {
      const url = this.normalizeUrl(endpoint);
      const res = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(`API PUT ${endpoint} Error:`, err);
      return { success: false, message: err.message || 'Network request failed' };
    }
  }

  public async patch<T = any>(endpoint: string, payload?: any): Promise<ApiResponse<T>> {
    try {
      const url = this.normalizeUrl(endpoint);
      const res = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(`API PATCH ${endpoint} Error:`, err);
      return { success: false, message: err.message || 'Network request failed' };
    }
  }

  public async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const url = this.normalizeUrl(endpoint);
      const res = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(`API DELETE ${endpoint} Error:`, err);
      return { success: false, message: err.message || 'Network request failed' };
    }
  }
}

export const api = new ApiService();
