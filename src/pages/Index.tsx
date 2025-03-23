
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative bg-sustainabite-orange overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 blur-3xl" />
        <div className="absolute top-2/3 left-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top curved decoration */}
        <div className="absolute -top-5 left-0 right-0 h-24 bg-white rounded-b-[50%] transform scale-x-125" />
        
        {/* Header */}
        <div className="pt-8 px-6 z-10">
          <div className="relative">
            <h1 className="text-4xl font-serif font-bold text-white text-center mt-4">
              Sustaina<span className="text-sustainabite-cream">BITE</span>
            </h1>
            <div className="absolute -top-3 right-1/2 translate-x-20">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 25 Q20 10 30 20 Q35 25 30 30 Q20 40 10 30 Q5 25 10 25Z" fill="#A0C55F" />
                <path d="M15 20 Q25 5 35 15 Q40 20 35 25 Q25 35 15 25 Q10 20 15 20Z" fill="#7CAA2D" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-between px-6 pb-16 pt-12 text-white">
          {/* Food illustration */}
          <div className="w-full max-w-md mb-8">
            <img 
              src="/lovable-uploads/c0130911-7f27-4c7c-bd8b-9e037184b580.png" 
              alt="Food illustration" 
              className="w-full h-auto rounded-3xl"
            />
          </div>
          
          <div className="text-center max-w-md mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Cook sustainably, eat better.</h2>
            <p className="text-lg text-white/80">
              Plan meals, reduce food waste, and discover recipes tailored to what you already have.
            </p>
          </div>
          
          <div className="w-full max-w-md space-y-4">
            <Button 
              asChild
              className="w-full py-6 rounded-xl bg-white text-sustainabite-orange hover:bg-white/90"
            >
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="w-full py-6 rounded-xl border-white text-white hover:bg-white/10"
            >
              <Link to="/login">
                I already have an account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
