import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users data
const DUMMY_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Dr. Sarah Johnson',
    role: 'admin',
    email: 'admin@harms.healthcare'
  },
  {
    id: '2',
    username: 'doctor1',
    name: 'Dr. Michael Chen',
    role: 'doctor',
    email: 'michael.chen@harms.healthcare'
  },
  {
    id: '3',
    username: 'patient1',
    name: 'Emily Rodriguez',
    role: 'patient',
    email: 'emily.rodriguez@email.com'
  }
];

const USER_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
  { username: 'doctor1', password: 'doctor123' },
  { username: 'patient1', password: 'patient123' }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const credential = USER_CREDENTIALS.find(
      c => c.username === username && c.password === password
    );
    
    if (credential) {
      const userData = DUMMY_USERS.find(u => u.username === username);
      if (userData) {
        setUser(userData);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};