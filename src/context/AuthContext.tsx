import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id?: string;
  userId?: string;
  _id?: string;
  adminId?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  roleId?: string;
  permissions: string[];
  organization?: string;
  avatar?: string;
  status?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activePortal: 'admin' | 'superadmin';
  setActivePortal: (portal: 'admin' | 'superadmin') => void;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (email: string) => Promise<{ success: boolean; message?: string }>;
  hasPermission: (permissionCode: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('360crm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('360crm_token');
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activePortal, setActivePortalState] = useState<'admin' | 'superadmin'>('admin');

  // Sync token to API service
  useEffect(() => {
    if (token) {
      api.setToken(token);
    }
  }, [token]);

  const setActivePortal = (portal: 'admin' | 'superadmin') => {
    setActivePortalState(portal);
  };

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('360crm_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        const u = res.data;
        setUser(u);
        localStorage.setItem('360crm_user', JSON.stringify(u));
      } else {
        // Clear invalid session
        logout();
      }
    } catch (err) {
      console.error('Error verifying user session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.success && res.data) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        api.setToken(newToken);
        localStorage.setItem('360crm_token', newToken);
        localStorage.setItem('360crm_user', JSON.stringify(newUser));

        if (newUser.role === 'SUPER_ADMIN') {
          setActivePortalState('superadmin');
        } else {
          setActivePortalState('admin');
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const switchUser = async (email: string) => {
    try {
      const res = await api.post('/auth/switch-demo', { email });
      if (res.success && res.data) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        api.setToken(newToken);
        localStorage.setItem('360crm_token', newToken);
        localStorage.setItem('360crm_user', JSON.stringify(newUser));

        if (newUser.role === 'SUPER_ADMIN') {
          setActivePortalState('superadmin');
        } else {
          setActivePortalState('admin');
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Failed to switch user' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error switching user' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    api.setToken(null);
    localStorage.removeItem('360crm_token');
    localStorage.removeItem('360crm_user');
    setActivePortalState('admin');
  };

  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;
    // Super admin has unrestricted access to all operations
    if (user.role === 'SUPER_ADMIN') return true;

    // Full Admin has broad access to standard operations
    if (user.role === 'ADMIN' && !permissionCode.startsWith('superadmin.')) return true;

    const permissions = user.permissions || [];
    if (permissions.includes('*')) return true;
    return permissions.includes(permissionCode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        activePortal,
        setActivePortal,
        login,
        logout,
        switchUser,
        hasPermission,
        refreshUser,
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
