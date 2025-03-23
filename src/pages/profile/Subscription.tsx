
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Star, Award, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('free');
  
  const handleUpgrade = (plan: string) => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to upgrade your subscription.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Coming Soon',
      description: 'Subscription upgrades will be available soon.',
    });
  };

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif font-medium">Subscription</h1>
      </div>
      
      <div className="mb-8">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Current Plan</h2>
            <Badge className={currentPlan === 'premium' ? 'bg-amber-500' : ''}>
              {currentPlan === 'premium' ? 'Premium' : 'Free'}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {currentPlan === 'premium' 
              ? 'You have access to all premium features.' 
              : 'Upgrade to Premium for exclusive features.'}
          </p>
          
          {currentPlan === 'premium' ? (
            <div className="flex justify-between text-sm">
              <span>Next billing date:</span>
              <span>July 1, 2025</span>
            </div>
          ) : (
            <Button 
              className="w-full bg-sustainabite-purple hover:bg-sustainabite-purple/90"
              onClick={() => handleUpgrade('premium')}
            >
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>
      
      <h2 className="text-lg font-medium mb-4">Available Plans</h2>
      
      <div className="space-y-4">
        <div className={`p-5 rounded-xl border ${
          currentPlan === 'free' ? 'border-sustainabite-purple' : 'border-border'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Free Plan</h3>
            <Badge variant="outline">
              Current
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Basic features to get you started.
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Limited recipe access</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Basic meal planning</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Standard grocery tracking</span>
            </div>
          </div>
          
          <div className="font-medium text-center">
            $0 <span className="text-sm font-normal text-muted-foreground">/ month</span>
          </div>
        </div>
        
        <div className={`p-5 rounded-xl border ${
          currentPlan === 'premium' ? 'border-sustainabite-purple' : 'border-border'
        } relative overflow-hidden`}>
          <div className="absolute -right-10 -top-10 bg-amber-500 w-20 h-20 rotate-45"></div>
          <div className="absolute right-1 top-1">
            <Star className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Premium Plan</h3>
            <Badge className="bg-amber-500">
              Best Value
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Unlock all features and premium content.
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Unlimited recipe access</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Advanced meal planning</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Priority customer support</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>No advertisements</span>
            </div>
          </div>
          
          <div className="font-medium text-center mb-4">
            $9.99 <span className="text-sm font-normal text-muted-foreground">/ month</span>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => handleUpgrade('premium')}
            disabled={currentPlan === 'premium'}
          >
            {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
