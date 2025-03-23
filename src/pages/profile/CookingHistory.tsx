
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

const CookingHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCookingHistory();
    }
  }, [user]);

  const fetchCookingHistory = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('cooking_history')
        .select(`
          id,
          cooked_at,
          recipes (
            id,
            title,
            image_url,
            cooking_time,
            difficulty
          )
        `)
        .eq('user_id', user?.id)
        .order('cooked_at', { ascending: false });
      
      if (error) throw error;
      
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching cooking history:', error);
      toast({
        title: 'Error fetching history',
        description: 'Unable to load your cooking history.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-medium mb-4">Please log in</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your cooking history.</p>
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
        <h1 className="text-2xl font-serif font-medium">Cooking History</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-sustainabite-purple" />
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map(item => (
            <div 
              key={item.id}
              className="flex items-center gap-4 p-4 bg-background rounded-lg border"
              onClick={() => navigate(`/recipe/${item.recipes.id}`)}
            >
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={item.recipes.image_url}
                  alt={item.recipes.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{item.recipes.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{item.recipes.cooking_time} mins</span>
                  <span className="mx-2">•</span>
                  <span>{item.recipes.difficulty}</span>
                </div>
                <p className="text-xs text-sustainabite-purple mt-2">
                  Cooked on {formatDate(item.cooked_at)}
                </p>
              </div>
              
              <ChevronLeft className="h-5 w-5 transform rotate-180 text-muted-foreground" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No cooking history yet</h3>
          <p className="text-muted-foreground mb-6">Start cooking recipes to build your history!</p>
          <Button onClick={() => navigate('/recipes')}>Browse Recipes</Button>
        </div>
      )}
    </div>
  );
};

export default CookingHistory;
