import { createContext, useContext, useState, ReactNode } from 'react';
import { auth } from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  approved: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  getDashboardPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      console.log('Auth response:', response); // Add this for debugging

      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return response;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      getDashboardPath 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}