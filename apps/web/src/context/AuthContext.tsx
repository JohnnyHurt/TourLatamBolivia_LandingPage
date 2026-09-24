import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDTO } from '@tourlatam/types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserDTO | null;
  loading: boolean;
  login: (token: string, user: UserDTO) => void;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('tourlatam_admin_token');
      if (token) {
        try {
          const current = await api.getCurrentUser();
          setUser(current);
        } catch {
          localStorage.removeItem('tourlatam_admin_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: UserDTO) => {
    localStorage.setItem('tourlatam_admin_token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('tourlatam_admin_token');
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isEditor = user?.role === 'EDITOR' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isEditor }}>
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
