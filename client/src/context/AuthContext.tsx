import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';

export type PortalType = 'MEMBER' | 'MENTOR' | 'ORGANIZER' | 'ADMIN';

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
  const getInitialPortal = (): PortalType => {
    const saved = localStorage.getItem('sovereign_active_portal') as PortalType | null;
    if (saved && ['MEMBER', 'MENTOR', 'ORGANIZER', 'ADMIN'].includes(saved)) {
      return saved;
    }
    return 'MEMBER';
  };

  const [activePortal, setActivePortalState] = useState<PortalType>(getInitialPortal);

  const setActivePortal = (portal: PortalType) => {
    localStorage.setItem('sovereign_active_portal', portal);
    setActivePortalState(portal);
  };

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
        const userData = res.data;
        setUser(userData);

        const roles: string[] = userData.roles || [];
        const hasAdmin = roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
        const hasOrganizer = roles.includes('ORGANIZER');
        const hasMentor = roles.includes('MENTOR');

        const savedPortal = localStorage.getItem('sovereign_active_portal') as PortalType | null;

        // If a portal was previously saved and user has permission, preserve it
        if (savedPortal === 'ADMIN' && hasAdmin) {
          setActivePortalState('ADMIN');
        } else if (savedPortal === 'ORGANIZER' && (hasOrganizer || hasAdmin)) {
          setActivePortalState('ORGANIZER');
        } else if (savedPortal === 'MENTOR' && (hasMentor || hasAdmin)) {
          setActivePortalState('MENTOR');
        } else if (savedPortal === 'MEMBER') {
          setActivePortalState('MEMBER');
        } else {
          // If no valid saved portal, default to highest privilege role
          if (hasAdmin) {
            setActivePortal('ADMIN');
          } else if (hasOrganizer) {
            setActivePortal('ORGANIZER');
          } else if (hasMentor) {
            setActivePortal('MENTOR');
          } else {
            setActivePortal('MEMBER');
          }
        }
      } else {
        localStorage.removeItem('sovereign_token');
        localStorage.removeItem('sovereign_active_portal');
        localStorage.removeItem('sovereign_current_tab');
        setUser(null);
        setToken(null);
      }
    } catch {
      localStorage.removeItem('sovereign_token');
      localStorage.removeItem('sovereign_active_portal');
      localStorage.removeItem('sovereign_current_tab');
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

      const roles: string[] = res.data.user.roles || [];
      const hasAdmin = roles.includes('SUPER_ADMIN') || roles.includes('ADMIN');
      const hasOrganizer = roles.includes('ORGANIZER');
      const hasMentor = roles.includes('MENTOR');

      const savedPortal = localStorage.getItem('sovereign_active_portal') as PortalType | null;
      let targetPortal: PortalType = 'MEMBER';

      if (savedPortal === 'ADMIN' && hasAdmin) {
        targetPortal = 'ADMIN';
      } else if (savedPortal === 'ORGANIZER' && (hasOrganizer || hasAdmin)) {
        targetPortal = 'ORGANIZER';
      } else if (savedPortal === 'MENTOR' && (hasMentor || hasAdmin)) {
        targetPortal = 'MENTOR';
      } else if (hasAdmin) {
        targetPortal = 'ADMIN';
      } else if (hasOrganizer) {
        targetPortal = 'ORGANIZER';
      } else if (hasMentor) {
        targetPortal = 'MENTOR';
      } else {
        targetPortal = 'MEMBER';
      }

      setActivePortal(targetPortal);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('sovereign_token');
    localStorage.removeItem('sovereign_active_portal');
    localStorage.removeItem('sovereign_current_tab');
    setToken(null);
    setUser(null);
    setActivePortalState('MEMBER');
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
