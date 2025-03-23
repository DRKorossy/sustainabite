import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  Star, 
  Users, 
  ShoppingCart,
  ArrowLeft,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [servings, setServings] = useState(1);
  const [originalServings, setOriginalServings] = useState(1);
  const [adjustedIngredients, setAdjustedIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchRecipe(id);
      checkIfLiked(id);
    }
  }, [id, user]);
  
  useEffect(() => {
    if (recipe?.image_url) {
      const img = new Image();
      img.src = recipe.image_url;
      img.onload = () => setImageLoaded(true);
    }
  }, [recipe?.image_url]);

  useEffect(() => {
    if (recipe?.ingredients) {
      adjustIngredientsByServings();
    }
  }, [servings, recipe]);
  
  const fetchRecipe = async (recipeId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setRecipe(data);
        // Default to 2 servings if not specified
        setOriginalServings(data.servings || 2);
        setServings(data.servings || 2);
      } else {
        console.error(`Recipe with ID ${recipeId} not found`);
        toast({
          title: 'Recipe not found',
          description: 'We couldn\'t find the recipe you\'re looking for.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast({
        title: 'Error fetching recipe',
        description: 'Unable to load the recipe. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkIfLiked = async (recipeId: string) => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('saved_recipes')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .maybeSingle();
      
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking if recipe is liked:', error);
    }
  };
  
  const adjustIngredientsByServings = () => {
    if (!recipe?.ingredients || !originalServings) return;
    
    const servingRatio = servings / originalServings;
    
    const adjusted = recipe.ingredients.map((ingredient: string) => {
      // Try to match quantities in the ingredient string
      return ingredient.replace(/(\d+(\.\d+)?)/g, (match) => {
        const num = parseFloat(match);
        if (!isNaN(num)) {
          const adjusted = (num * servingRatio).toFixed(1);
          // Remove trailing .0 if present
          return adjusted.endsWith('.0') ? adjusted.slice(0, -2) : adjusted;
        }
        return match;
      });
    });
    
    setAdjustedIngredients(adjusted);
  };
  
  const toggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (isLiked) {
        // Remove from saved recipes
        const { error } = await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', id);
        
        if (error) throw error;
        
        setIsLiked(false);
        toast({
          title: "Removed from favorites",
          description: "Recipe removed from your favorites."
        });
      } else {
        // Add to saved recipes
        const { error } = await supabase
          .from('saved_recipes')
          .insert({
            user_id: user.id,
            recipe_id: id
          });
        
        if (error) throw error;
        
        setIsLiked(true);
        toast({
          title: "Added to favorites",
          description: "Recipe saved to your favorites!"
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Unable to update your favorites. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!recipe?.ingredients) {
      toast({
        title: "Error",
        description: "No ingredients found for this recipe.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // First, get matching grocery items for these ingredients
      const ingredientNames = adjustedIngredients.map(ing => {
        // Extract just the item name, removing quantities and units
        const nameMatch = ing.match(/(?:\d+\s*\w*\s*)(.*)/);
        return nameMatch ? nameMatch[1].trim() : ing;
      });
      
      // Add ingredients to cart
      toast({
        title: "Added to shopping cart",
        description: `Ingredients for ${recipe.title} have been added to your cart.`,
      });
      
      // Navigate to cart
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Unable to add ingredients to cart. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const shareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title,
        text: recipe?.description,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Share recipe",
        description: "Recipe link copied to clipboard!",
      });
    }
  };

  // If recipe is null, show loading state or error message
  if (!recipe && !isLoading) {
    return (
      <div className="min-h-screen bg-sustainabite-cream pb-24 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-medium mb-4">Recipe not found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the recipe you're looking for.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sustainabite-cream pb-24">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-muted"></div>
          <div className="p-6">
            <div className="h-8 bg-muted rounded-md max-w-xs mb-4"></div>
            <div className="h-4 bg-muted rounded-md max-w-md mb-2"></div>
            <div className="h-4 bg-muted rounded-md max-w-sm"></div>
          </div>
        </div>
      ) : recipe && (
        <>
          <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
            <img 
              src={recipe.image_url} 
              alt={recipe.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                "image-blur",
                imageLoaded && "loaded"
              )}
            />
            
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-transparent"></div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 left-4 text-white bg-black/20 backdrop-blur-md hover:bg-black/30 rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white bg-black/20 backdrop-blur-md hover:bg-black/30 rounded-full"
                onClick={toggleLike}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-red-500 text-red-500")} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white bg-black/20 backdrop-blur-md hover:bg-black/30 rounded-full"
                onClick={shareRecipe}
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="px-6 py-4 -mt-10 relative">
            <div className="glass-card rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl font-serif font-semibold mb-2">{recipe.title}</h1>
              
              <div className="flex flex-wrap gap-3 mt-4 mb-4">
                <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-3 py-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cooking_time} mins</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-3 py-1">
                  <Flame className="w-4 h-4" />
                  <span>{recipe.calories} cal</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-3 py-1">
                  <ChefHat className="w-4 h-4" />
                  <span>{recipe.difficulty}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-3 py-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{recipe.rating}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm">{recipe.description}</p>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <Tabs defaultValue="ingredients" className="w-full">
              <TabsList className="w-full mb-4 h-auto bg-muted rounded-xl p-1">
                <TabsTrigger 
                  value="ingredients" 
                  className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-sustainabite-purple rounded-lg"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger 
                  value="instructions" 
                  className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-sustainabite-purple rounded-lg"
                >
                  Steps
                </TabsTrigger>
                <TabsTrigger 
                  value="nutrition" 
                  className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-sustainabite-purple rounded-lg"
                >
                  Nutrition
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ingredients" className="pt-2">
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-sustainabite-purple" />
                      <span className="font-medium">Servings</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-l-md rounded-r-none h-8 w-8"
                        onClick={() => setServings(Math.max(1, servings - 1))}
                        disabled={servings <= 1}
                      >
                        -
                      </Button>
                      <div className="h-8 w-8 flex items-center justify-center border-y border-input">
                        {servings}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-r-md rounded-l-none h-8 w-8"
                        onClick={() => setServings(servings + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <ScrollArea className="h-[300px] pr-4">
                    <ul className="space-y-3">
                      {adjustedIngredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-sustainabite-purple mt-2"></div>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full py-6 rounded-xl bg-sustainabite-purple hover:bg-sustainabite-purple/90 font-medium"
                      onClick={addToCart}
                    >
                      <ShoppingCart className="mr-2 w-5 h-5" />
                      Add ingredients to cart
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="instructions" className="pt-2">
                <div className="glass-card rounded-xl p-5">
                  <ScrollArea className="h-[300px] pr-4">
                    <ol className="space-y-6">
                      {recipe.instructions.map((step: string, index: number) => (
                        <li key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sustainabite-purple text-white flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          <p className="mt-0.5">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="pt-2">
                <div className="glass-card rounded-xl p-5">
                  <h3 className="font-medium text-lg mb-4">Nutrition Facts</h3>
                  
                  <div className="space-y-4">
                    {recipe.nutrition_facts && Object.entries(recipe.nutrition_facts).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-medium">Reviews</h2>
              <Button 
                variant="link" 
                className="text-sustainabite-purple font-medium p-0"
              >
                See all ({recipe.reviews.length})
              </Button>
            </div>
            
            <div className="space-y-4">
              {recipe.reviews.slice(0, 2).map(review => (
                <div key={review.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={review.avatar} 
                      alt={review.user} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{review.user}</div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i}
                            className={cn(
                              "w-3 h-3", 
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 py-5 rounded-xl border border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Write a review
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeDetail;

