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
  register: (username: string, email: string, password: string, confirmPassword: string) => boolean;
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
  { username: 'admin', email: 'admin@harms.healthcare', password: 'admin123', confirmPassword: 'admin123' },
  { username: 'doctor1', email: 'michael.chen@harms.healthcare', password: 'doctor123', confirmPassword: 'doctor123' },
  { username: 'patient1', email: 'emily.rodriguez@email.com', password: 'patient123', confirmPassword: 'patient123' }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const register = (username: string, email: string, password: string, confirmPassword: string): boolean => {
    const credential = USER_CREDENTIALS.find(
      c => c.username === username && c.email === email  && c.password === password && c.confirmPassword === confirmPassword
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
      register,
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