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
    username: 'admin1',
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
  { username: 'admin1', email: 'admin1@gmail.com', password: 'admin123', confirmPassword: 'admin123' },
  { username: 'doctor1', email: 'doctor1@gmail.com', password: 'doctor123', confirmPassword: 'doctor123' },
  { username: 'patient1', email: 'patient1@gmail.com', password: 'patient123', confirmPassword: 'patient123' }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [credentials, setCredentials] = useState(USER_CREDENTIALS);

  const register = (username: string, email: string, password: string, confirmPassword: string): boolean => {
    // Check if username or email already exists
    const exists = credentials.some(
      c => c.username === username || c.email === email
    );
    
    if (exists) {
      return false;
    }

    // Create new user
    const newId = String(users.length + 1);
    const newName = username.charAt(0).toUpperCase() + username.slice(1);
    const newUser: User = {
      id: newId,
      username,
      name: newName,
      role: 'patient', // Default role for new registrations
      email
    };

    // Add to users and credentials
    setUsers(prev => [...prev, newUser]);
    setCredentials(prev => [...prev, { username, email, password, confirmPassword }]);

    return true;
  };

  const login = (username: string, password: string): boolean => {
    const credential = credentials.find(
      c => c.username === username && c.password === password
    );
    
    if (credential) {
      const userData = users.find(u => u.username === username);
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