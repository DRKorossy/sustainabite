
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, LogIn, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await login(email, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: error || "Invalid email or password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sustainabite-cream overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sustainabite-orange/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sustainabite-purple/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />
      
      <div className="container max-w-md mx-auto px-6 py-12 relative z-10">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <h1 className="text-3xl font-serif font-bold text-sustainabite-orange">
              Sustaina<span className="text-sustainabite-purple">BITE</span>
            </h1>
            <div className="absolute -top-3 right-0">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 25 Q20 10 30 20 Q35 25 30 30 Q20 40 10 30 Q5 25 10 25Z" fill="#A0C55F" />
                <path d="M15 20 Q25 5 35 15 Q40 20 35 25 Q25 35 15 25 Q10 20 15 20Z" fill="#7CAA2D" opacity="0.8" />
              </svg>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-6 rounded-xl"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/reset-password" className="text-sm text-sustainabite-purple hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-6 rounded-xl"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 rounded-xl bg-sustainabite-purple hover:bg-sustainabite-purple/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <LogIn className="w-5 h-5 mr-2" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-sustainabite-purple hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-sustainabite-cream px-2 text-muted-foreground">Quick Access</span>
              </div>
            </div>
            
            <div className="mt-4 grid gap-2">
              <Button 
                variant="outline" 
                className="py-6 rounded-xl border border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5"
                onClick={() => {
                  setEmail('user@example.com');
                  setPassword('password123');
                }}
              >
                <Key className="w-5 h-5 mr-2" />
                Use Test Account
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="link" 
            className="text-muted-foreground" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
