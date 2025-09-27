import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Lock, User, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();

  // Redirect to login if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      // Ensure register function does NOT auto-login the user
      const success = register(credentials.username, credentials.email, credentials.password, credentials.confirmPassword);

      if (success) {
        toast({
          title: "Registration Successful",
          description: "Please log in with your new account!",
        });
        // Reset form fields after successful registration
        setCredentials({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Redirect to login page
        navigate('/login', { replace: true });
      } else {
        toast({
          title: "Registration Failed",
          description: "Username or email already exists.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
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
        {/* Registration Form */}
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary underline">Login here</Link></p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}