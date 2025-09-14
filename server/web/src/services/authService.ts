import { apiService } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      apiService.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get user info');
  }

  logout() {
    apiService.clearToken();
  }

  isAuthenticated(): boolean {
    return !!apiService.getToken();
  }
}

export const authService = new AuthService();