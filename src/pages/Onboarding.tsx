import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Clock, 
  Flame, 
  ChefHat, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface DietaryRestriction {
  id: string;
  name: string;
}

interface CookingLevel {
  id: string;
  name: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRestrictions, setSelectedRestrictions] = useState<DietaryRestriction[]>([
    { id: '1', name: 'Gluten' },
    { id: '2', name: 'Kiwi' },
    { id: '3', name: 'Seed oils' }
  ]);
  const [cookingTime, setCookingTime] = useState(20);
  const [calorieGoal, setCalorieGoal] = useState(2200);
  const [cookingLevel, setCookingLevel] = useState<string>('Medium');
  
  const levels: CookingLevel[] = [
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ];

  const handleAddRestriction = (restriction: string) => {
    if (restriction.trim() && !selectedRestrictions.some(r => r.name.toLowerCase() === restriction.toLowerCase())) {
      setSelectedRestrictions([...selectedRestrictions, { id: Date.now().toString(), name: restriction }]);
      setSearchValue('');
    }
  };

  const handleRemoveRestriction = (id: string) => {
    setSelectedRestrictions(selectedRestrictions.filter(restriction => restriction.id !== id));
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-medium mb-6">1. My dietary restrictions</h2>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for foods..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddRestriction(searchValue);
                    }
                  }}
                  className="pl-10 py-6 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6">
              {selectedRestrictions.map((restriction) => (
                <div 
                  key={restriction.id}
                  className="flex items-center gap-1 bg-sustainabite-lightPurple/30 text-sustainabite-purple rounded-full px-3 py-1.5"
                >
                  <span>{restriction.name}</span>
                  <button 
                    onClick={() => handleRemoveRestriction(restriction.id)}
                    className="ml-1 p-0.5 rounded-full hover:bg-sustainabite-purple/10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-medium mb-6">2. Preferred cooking time</h2>
            <p className="text-muted-foreground mb-8">
              Tell us what the maximum amount of time you want to spend cooking is.
            </p>
            
            <div className="px-4 mb-8">
              <div className="relative pt-6 pb-10">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>0</span>
                  <span>60+</span>
                </div>
                <Slider
                  value={[cookingTime]}
                  min={0}
                  max={60}
                  step={5}
                  onValueChange={(values) => setCookingTime(values[0])}
                  className="custom-slider"
                />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-4 text-lg font-medium text-sustainabite-purple">
                  {cookingTime} mins
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-medium mb-6">3. Calorie Goals</h2>
            <p className="text-muted-foreground mb-8">
              Tell us how many calories you want to hit each day.
            </p>
            
            <div className="w-full max-w-sm mx-auto">
              <div className="relative">
                <Flame className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(Number(e.target.value))}
                  className="pl-10 py-6 text-center text-2xl font-medium rounded-xl"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif font-medium mb-6">4. Cooking Level</h2>
            <p className="text-muted-foreground mb-8">
              Tell us how advanced you want the recipes to be.
            </p>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setCookingLevel(level.name)}
                  className={cn(
                    "flex items-center justify-center py-4 px-6 rounded-xl transition-all",
                    cookingLevel === level.name
                      ? "bg-sustainabite-purple text-white"
                      : "bg-sustainabite-lightPurple/20 text-sustainabite-purple hover:bg-sustainabite-lightPurple/30"
                  )}
                >
                  <span>{level.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative bg-sustainabite-cream overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sustainabite-orange/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sustainabite-purple/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />
      
      <div className="container max-w-md mx-auto px-6 py-8">
        <div className="flex justify-center items-center mb-8">
          <div className="relative">
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
        </div>
        
        <div className="glass-card rounded-2xl p-6 mb-8">
          {renderStep()}
        </div>
        
        <div className="flex justify-between">
          {step > 1 ? (
            <Button 
              onClick={handlePreviousStep}
              variant="outline" 
              className="px-6 py-6 rounded-xl border border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          <Button 
            onClick={handleNextStep}
            className={cn(
              "px-6 py-6 rounded-xl bg-sustainabite-purple hover:bg-sustainabite-purple/90 group",
              step === 4 && "w-full justify-center"
            )}
          >
            {step === 4 ? (
              <>Create my plan!</>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
        
        <div className="flex justify-center mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full mx-1 transition-all",
                step === i 
                  ? "bg-sustainabite-purple" 
                  : step > i
                    ? "bg-sustainabite-purple/50"
                    : "bg-sustainabite-purple/20"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
