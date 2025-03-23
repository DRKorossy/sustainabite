
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Bookmark, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getSavedRecipes } from '@/utils/recipeSearch';

const SavedRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      
      const data = await getSavedRecipes(user?.id || '');
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      toast({
        title: 'Error fetching saved recipes',
        description: 'Unable to load your saved recipes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const unsaveRecipe = async (recipeId: string) => {
    try {
      if (!user) return;
      
      const { data: savedRecipe, error: findError } = await supabase
        .from('saved_recipes')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .single();
      
      if (findError) throw findError;
      
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', savedRecipe.id);
      
      if (error) throw error;
      
      // Update UI
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      
      toast({
        title: 'Recipe unsaved',
        description: 'The recipe has been removed from your saved recipes.'
      });
    } catch (error) {
      console.error('Error unsaving recipe:', error);
      toast({
        title: 'Error unsaving recipe',
        description: 'Unable to remove recipe from saved recipes.',
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-medium mb-4">Please log in</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your saved recipes.</p>
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
        <h1 className="text-2xl font-serif font-medium">Saved Recipes</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-sustainabite-purple" />
        </div>
      ) : recipes.length > 0 ? (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <div 
              key={recipe.id}
              className="flex items-center gap-4 p-4 bg-background rounded-lg border"
            >
              <div 
                className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <h3 className="font-medium">{recipe.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span>{recipe.cooking_time} mins</span>
                  <span className="mx-2">•</span>
                  <span>{recipe.difficulty}</span>
                  <span className="mx-2">•</span>
                  <span>{recipe.calories} cal</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-sustainabite-purple"
                onClick={() => unsaveRecipe(recipe.id)}
              >
                <Heart className="h-5 w-5 fill-current" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No saved recipes yet</h3>
          <p className="text-muted-foreground mb-6">Save recipes to access them easily later!</p>
          <Button onClick={() => navigate('/recipes')}>Browse Recipes</Button>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
