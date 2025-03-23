
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Goal {
  id: string;
  name: string;
  description: string;
  category: string;
}

const nutritionalGoals: Goal[] = [
  { 
    id: 'waste-less-food', 
    name: 'Waste Less Food', 
    description: 'Track your grocery usage and reduce food waste',
    category: 'sustainability'
  },
  { 
    id: 'eat-less-gluten', 
    name: 'Eat Less Gluten', 
    description: 'Reduce gluten intake for dietary preferences or sensitivities',
    category: 'dietary'
  },
  { 
    id: 'become-leaner', 
    name: 'Become Leaner', 
    description: 'Focus on protein-rich, calorie-controlled meals',
    category: 'fitness'
  },
  { 
    id: 'more-energy', 
    name: 'Have More Energy', 
    description: 'Balance macronutrients for sustained energy through the day',
    category: 'wellness'
  },
  { 
    id: 'reduce-meat', 
    name: 'Reduce Meat Consumption', 
    description: 'Incorporate more plant-based meals into your diet',
    category: 'sustainability'
  },
  { 
    id: 'eat-more-protein', 
    name: 'Eat More Protein', 
    description: 'Increase protein intake to support muscle growth and recovery',
    category: 'fitness'
  },
  { 
    id: 'reduce-sugar', 
    name: 'Reduce Sugar Intake', 
    description: 'Cut down on added sugars for better health',
    category: 'wellness'
  },
  { 
    id: 'eat-more-vegetables', 
    name: 'Eat More Vegetables', 
    description: 'Increase vegetable intake for better nutrition',
    category: 'wellness'
  }
];

const GoalsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserGoals();
    }
  }, [user]);

  const fetchUserGoals = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('goals')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      
      if (data?.goals) {
        setSelectedGoals(data.goals);
      }
    } catch (error) {
      console.error('Error fetching user goals:', error);
      toast({
        title: 'Error fetching goals',
        description: 'Unable to load your nutritional goals.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(current => 
      current.includes(goalId)
        ? current.filter(id => id !== goalId)
        : [...current, goalId]
    );
  };

  const saveGoals = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          goals: selectedGoals,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Goals updated',
        description: 'Your nutritional goals have been saved.',
      });
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: 'Error saving goals',
        description: 'Unable to save your nutritional goals.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-medium mb-4">Please log in</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to set your goals.</p>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif font-medium">Nutritional Goals</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Select your nutritional goals and preferences to help us personalize your experience.
      </p>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-sustainabite-purple" />
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Wellness Goals</h2>
              <div className="space-y-4">
                {nutritionalGoals
                  .filter(goal => goal.category === 'wellness')
                  .map(goal => (
                    <div key={goal.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={goal.id} 
                        checked={selectedGoals.includes(goal.id)}
                        onCheckedChange={() => handleGoalToggle(goal.id)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={goal.id}
                          className="text-base font-medium cursor-pointer"
                        >
                          {goal.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Dietary Preferences</h2>
              <div className="space-y-4">
                {nutritionalGoals
                  .filter(goal => goal.category === 'dietary')
                  .map(goal => (
                    <div key={goal.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={goal.id} 
                        checked={selectedGoals.includes(goal.id)}
                        onCheckedChange={() => handleGoalToggle(goal.id)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={goal.id}
                          className="text-base font-medium cursor-pointer"
                        >
                          {goal.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Fitness Goals</h2>
              <div className="space-y-4">
                {nutritionalGoals
                  .filter(goal => goal.category === 'fitness')
                  .map(goal => (
                    <div key={goal.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={goal.id} 
                        checked={selectedGoals.includes(goal.id)}
                        onCheckedChange={() => handleGoalToggle(goal.id)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={goal.id}
                          className="text-base font-medium cursor-pointer"
                        >
                          {goal.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Sustainability</h2>
              <div className="space-y-4">
                {nutritionalGoals
                  .filter(goal => goal.category === 'sustainability')
                  .map(goal => (
                    <div key={goal.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={goal.id} 
                        checked={selectedGoals.includes(goal.id)}
                        onCheckedChange={() => handleGoalToggle(goal.id)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={goal.id}
                          className="text-base font-medium cursor-pointer"
                        >
                          {goal.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          
          <Button 
            className="w-full py-6 bg-sustainabite-purple hover:bg-sustainabite-purple/90"
            onClick={saveGoals}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Save Goals
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
