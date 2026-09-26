import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';

export type PortalType = 'MEMBER' | 'ADMIN' | 'MENTOR' | 'ORGANIZER' | 'FINANCE';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  quickSwitchUser: (presetEmail: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sovereign_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [activePortal, setActivePortal] = useState<PortalType>('MEMBER');

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('sovereign_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem('sovereign_token');
        setUser(null);
        setToken(null);
      }
    } catch {
      localStorage.removeItem('sovereign_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const res = await api.auth.login({ identifier, password });
    setIsLoading(false);

    if (res.success && res.data?.token) {
      localStorage.setItem('sovereign_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      if (res.data.user.roles.includes('SUPER_ADMIN') || res.data.user.roles.includes('ADMIN')) {
        setActivePortal('ADMIN');
      } else if (res.data.user.roles.includes('FINANCE_MANAGER')) {
        setActivePortal('FINANCE');
      } else if (res.data.user.roles.includes('ORGANIZER')) {
        setActivePortal('ORGANIZER');
      } else if (res.data.user.roles.includes('MENTOR')) {
        setActivePortal('MENTOR');
      } else {
        setActivePortal('MEMBER');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('sovereign_token');
    setToken(null);
    setUser(null);
    setActivePortal('MEMBER');
  };

  const quickSwitchUser = async (presetEmail: string) => {
    await login(presetEmail, 'Password123!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        activePortal,
        setActivePortal,
        login,
        logout,
        quickSwitchUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
