import { useState, useEffect } from 'react';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    
    if (token && role) {
      setUser({
        id: '1',
        email: 'admin@attendance.com',
        name: 'Admin User',
        role: role as 'student' | 'staff' | 'admin'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: 'admin' | 'staff' | 'student') => {
    setLoading(true);
    try {
      // Demo login logic - replace with actual API call
      const isValidLogin = (
        (role === 'admin' && email === 'admin@attendance.com' && password === 'admin123') ||
        (role === 'staff' && email === 'staff@university.edu' && password === 'staff123') ||
        (role === 'student' && email === 'student@university.edu' && password === 'student123')
      );

      if (isValidLogin && role) {
        const token = `${role}_token_${Date.now()}`;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', role);
        
        const newUser = {
          id: '1',
          email: email,
          name: role === 'admin' ? 'Admin User' : role === 'staff' ? 'Staff User' : 'Student User',
          role: role
        };
        setUser(newUser);
        setLoading(false);
        return newUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
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