
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !fullName) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        full_name: fullName
      };
      
      const { success, error } = await register(email, password, userData);
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created!",
        });
        navigate('/onboarding');
      } else {
        toast({
          title: "Registration failed",
          description: error || "There was a problem creating your account.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sustainabite-orange overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sustainabite-orange/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sustainabite-purple/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />
      
      <div className="container max-w-md mx-auto px-6 py-12 relative z-10">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <h1 className="text-4xl font-serif font-bold text-white">
              Sustaina<span className="text-white font-bold">BITE</span>
            </h1>
            <div className="absolute -top-3 right-0">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 25 Q20 10 30 20 Q35 25 30 30 Q20 40 10 30 Q5 25 10 25Z" fill="#A0C55F" />
                <path d="M15 20 Q25 5 35 15 Q40 20 35 25 Q25 35 15 25 Q10 20 15 20Z" fill="#7CAA2D" opacity="0.8" />
              </svg>
            </div>
          </div>
          <p className="text-white mt-2">Sustainable meals. One bite at a time.</p>
          
          <div className="mt-6">
            <img 
              src="/lovable-uploads/266e3a86-0a6a-4f41-a9c0-56bf724be9d0.png" 
              alt="Food illustration" 
              className="w-full h-auto max-w-xs mx-auto"
            />
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6 bg-white/10 backdrop-blur-md">
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="py-6 rounded-xl bg-white/20 text-white placeholder:text-white/70 border-white/30"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-6 rounded-xl bg-white/20 text-white placeholder:text-white/70 border-white/30"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-6 rounded-xl bg-white/20 text-white border-white/30"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="py-6 rounded-xl bg-white/20 text-white border-white/30"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 rounded-xl bg-sustainabite-purple hover:bg-sustainabite-purple/90 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                Let's Go!
              </Button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-white">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
