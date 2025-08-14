import { createContext, useContext, useState, ReactNode } from 'react';
import { auth } from '@/services/api';
import type { User } from '@/types';
import { UserRole } from '@/types/enums';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    getDashboardPath: () => string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    nidNumber: string;
    files: {
        nidFront: File;
        nidBack: File;
        selfieFront: File;
        selfieLeft: File;
        selfieRight: File;
    };
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email: string, password: string) => {
        const response = await auth.login(email, password);
        if (response.token && response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
        }
    };

    const logout = async () => {
        await auth.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const register = async (data: RegisterData) => {
        const { files, ...userData } = data;
        await auth.register(userData, files);
    };

    const getDashboardPath = () => {
        if (!user) return '/login';
        return user.role === UserRole.ADMIN ? '/admin/dashboard' : '/dashboard';
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            register,
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