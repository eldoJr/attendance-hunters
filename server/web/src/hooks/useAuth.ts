import { useState, useEffect } from 'react';
import type { User } from '../types';
import { apiService } from '../services/api';

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthMeResponse extends User {}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const response = await apiService.get<AuthMeResponse>('/auth/me');
          if (response.success && response.data) {
            setUser(response.data as User);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string, role?: 'admin' | 'staff' | 'student') => {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', { email, password, role });
      
      if (response.success && response.data) {
        const loginData = response.data as LoginResponse;
        if (loginData.token) {
          localStorage.setItem('auth_token', loginData.token);
          setUser(loginData.user);
          return loginData.user;
        }
      }
      throw new Error(response.message || 'Invalid credentials');
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await apiService.post('/auth/logout', {});
    } catch (error) {
      // Continue with logout even if API call fails
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};