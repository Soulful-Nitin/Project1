import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { authApi } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string; hostel?: string; room?: string }) => Promise<void>;
  logout: () => void;
  quickLoginAs: (role: 'student' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('messmeter_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('messmeter_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Failed to restore session:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    if (res.data.success && res.data.token) {
      localStorage.setItem('messmeter_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: { name: string; email: string; password: string; role?: string; hostel?: string; room?: string }) => {
    const res = await authApi.register(data);
    if (res.data.success && res.data.token) {
      localStorage.setItem('messmeter_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('messmeter_token');
    setToken(null);
    setUser(null);
  };

  const quickLoginAs = async (role: 'student' | 'admin') => {
    if (role === 'student') {
      await login('student@messmeter.com', 'student123');
    } else {
      await login('admin@messmeter.com', 'admin123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
