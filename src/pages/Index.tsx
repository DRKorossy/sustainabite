
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-sustainabite-cream">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:px-12 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sustainabite-orange/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sustainabite-purple/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />
        
        {/* Logo with leaf */}
        <div className="relative flex flex-col items-center mb-8">
          <div 
            className={cn(
              "absolute -top-8 right-0 w-10 h-10 opacity-0",
              visible && "animate-fade-in animation-delay-300"
            )}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 25 Q20 10 30 20 Q35 25 30 30 Q20 40 10 30 Q5 25 10 25Z" fill="#A0C55F" />
              <path d="M15 20 Q25 5 35 15 Q40 20 35 25 Q25 35 15 25 Q10 20 15 20Z" fill="#7CAA2D" opacity="0.8" />
            </svg>
          </div>
          
          <h1 
            className={cn(
              "text-6xl sm:text-7xl md:text-8xl font-serif font-bold text-sustainabite-orange opacity-0",
              visible && "animate-fade-in"
            )}
          >
            Sustaina<span className="text-sustainabite-purple">BITE</span>
          </h1>
          
          <p 
            className={cn(
              "text-xl md:text-2xl text-foreground/80 mt-4 opacity-0 text-center",
              visible && "animate-fade-in animation-delay-100"
            )}
          >
            Sustainable meals. One bite at a time.
          </p>
        </div>
        
        {/* Food illustration */}
        <div 
          className={cn(
            "w-full max-w-md my-8 opacity-0", 
            visible && "animate-fade-up animation-delay-200"
          )}
        >
          <img 
            src="/lovable-uploads/c0130911-7f27-4c7c-bd8b-9e037184b580.png" 
            alt="Food illustration" 
            className="w-full h-auto"
          />
        </div>
        
        {/* Action button */}
        <div 
          className={cn(
            "flex flex-col gap-4 items-center mt-6 opacity-0 w-full max-w-md",
            visible && "animate-fade-up animation-delay-300"
          )}
        >
          <Button 
            onClick={() => navigate('/onboarding')}
            className="w-full py-7 rounded-full bg-sustainabite-purple hover:bg-sustainabite-purple/90 font-medium group"
            size="lg"
          >
            <span>Let's Go!</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Don't have an account? <a href="#" onClick={() => navigate('/signup')} className="text-sustainabite-purple hover:underline font-medium">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
