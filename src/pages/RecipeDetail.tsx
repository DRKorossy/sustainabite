
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Clock, 
  Fire, 
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

// Mock recipe data - in a real app, this would come from an API
const recipeData = {
  id: '1',
  title: 'Avocado & Egg Toast',
  image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
  cookingTime: 15,
  calories: 320,
  difficulty: 'Easy',
  rating: 4.7,
  servings: 1,
  description: 'Start your day with this nutrient-dense breakfast that combines creamy avocado and protein-rich eggs on whole grain toast for a perfect balance of healthy fats, protein, and complex carbohydrates.',
  ingredients: [
    '1 ripe avocado',
    '2 large eggs',
    '2 slices whole grain bread',
    '1 tbsp olive oil',
    'Salt and pepper to taste',
    'Red pepper flakes (optional)',
    'Fresh herbs (parsley or cilantro)'
  ],
  instructions: [
    'Toast the bread slices until golden brown.',
    'In a small pan, heat olive oil over medium heat and fry the eggs to your preference (sunny-side up or over easy).',
    'While the eggs are cooking, mash the avocado in a small bowl and season with salt and pepper.',
    'Spread the mashed avocado evenly over the toast slices.',
    'Place the fried eggs on top of the avocado.',
    'Sprinkle with additional salt, pepper, red pepper flakes, and fresh herbs if desired.',
    'Serve immediately and enjoy!'
  ],
  nutritionFacts: {
    calories: 320,
    protein: '14g',
    carbs: '28g',
    fat: '18g',
    fiber: '7g',
    sugar: '2g'
  },
  reviews: [
    {
      id: '1',
      user: 'Sarah M.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      comment: 'So delicious and easy to make! I added a sprinkle of feta cheese on top.'
    },
    {
      id: '2',
      user: 'James K.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4,
      comment: 'Great breakfast option. I used a multi-grain bread and it was perfect.'
    }
  ]
};

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [recipe, setRecipe] = useState(recipeData);
  const [servings, setServings] = useState(recipe.servings);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const img = new Image();
    img.src = recipe.image;
    img.onload = () => setImageLoaded(true);
  }, [recipe.image]);
  
  const addToCart = () => {
    toast({
      title: "Added to shopping cart",
      description: `Ingredients for ${recipe.title} have been added to your cart.`,
    });
  };
  
  const shareRecipe = () => {
    toast({
      title: "Share recipe",
      description: "Recipe link copied to clipboard!",
    });
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Recipe removed from your favorites." : "Recipe saved to your favorites!",
    });
  };

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
      ) : (
        <>
          {/* Hero image */}
          <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
            <img 
              src={recipe.image} 
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
          
          {/* Recipe header */}
          <div className="px-6 py-4 -mt-10 relative">
            <div className="glass-card rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl font-serif font-semibold mb-2">{recipe.title}</h1>
              
              <div className="flex flex-wrap gap-3 mt-4 mb-4">
                <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-3 py-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookingTime} mins</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-3 py-1">
                  <Fire className="w-4 h-4" />
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
          
          {/* Recipe content */}
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
                      {recipe.ingredients.map((ingredient, index) => (
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
                      {recipe.instructions.map((step, index) => (
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
                    {Object.entries(recipe.nutritionFacts).map(([key, value]) => (
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
          
          {/* Reviews section */}
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
