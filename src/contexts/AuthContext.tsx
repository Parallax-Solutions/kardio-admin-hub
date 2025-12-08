import { createContext, useContext, useState, ReactNode } from 'react';
import { User, mockCurrentUser } from '@/data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // For demo: you can toggle this to test non-admin view
  const [currentUser] = useState<User | null>(mockCurrentUser);

  const isAdmin = currentUser?.role === 'ADMIN';

  const logout = () => {
    // Mock logout - in real app would clear session
    console.log('Logging out...');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, logout }}>
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
