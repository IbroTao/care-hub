import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Heart, Lock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const success = login(credentials.username, credentials.password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to ClinicHub!",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (role: 'admin' | 'doctor' | 'patient') => {
    const demoCredentials = {
      admin: { username: 'admin1', password: 'admin123' },
      doctor: { username: 'doctor1', password: 'doctor123' },
      patient: { username: 'patient1', password: 'patient123' }
    };

    setCredentials(demoCredentials[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center medical-shadow">
            <img src="/clinichub-logo.jpg" alt="ClinicHub Logo" className="mx-auto h-30 w-auto" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">ClinicHub</h1>
            <p className="text-muted-foreground">An Health Administration & Resource Management System</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="p-6 medical-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full medical-gradient medical-shadow" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">Need an account? <Link to="/register" className="text-primary underline">Register here</Link></p>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-border">
            {/* <p className="text-sm text-muted-foreground text-center mb-3">Demo Accounts</p> */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                className="text-xs"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('doctor')}
                className="text-xs"
              >
                Doctor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('patient')}
                className="text-xs"
              >
                Patient
              </Button>
            </div>
          </div>
        </Card>

        {/* Demo Credentials Info */}
        {/* <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground text-center mb-2">Demo Credentials:</p>
          <div className="text-xs space-y-1 text-muted-foreground">
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>Doctor:</strong> doctor1 / doctor123</div>
            <div><strong>Patient:</strong> patient1 / patient123</div>
          </div>
        </Card> */}
      </div>
    </div>
  );
}