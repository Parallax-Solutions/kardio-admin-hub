import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { OpenAPI } from '@/api/generated/core/OpenAPI';
import { environment } from '@/config/environment';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  status?: 'active' | 'inactive' | 'pending';
  image?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    login: storeLogin,
    logout: storeLogout,
    fetchCurrentUser,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      OpenAPI.TOKEN = accessToken;
    }
  }, [accessToken]);

  const currentUser: User | null = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        status: 'active',
      }
    : null;

  const isAdmin = currentUser?.role === 'ADMIN';

  const login = async (email: string, password: string) => {
    await storeLogin({ email, password });
  };

  const logout = async () => {
    await storeLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
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
