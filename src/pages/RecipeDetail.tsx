
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

// Mock recipe data array
const allRecipes = [
  {
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
  },
  {
    id: '2',
    title: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 25,
    calories: 450,
    difficulty: 'Medium',
    rating: 4.5,
    servings: 2,
    description: 'This colorful Mediterranean quinoa bowl is packed with nutrients and flavors. A perfect balance of protein, fiber, and healthy fats makes it an ideal lunch option.',
    ingredients: [
      '1 cup quinoa, rinsed',
      '2 cups vegetable broth',
      '1 cucumber, diced',
      '1 cup cherry tomatoes, halved',
      '1/2 red onion, finely diced',
      '1/2 cup Kalamata olives, pitted and sliced',
      '1/2 cup feta cheese, crumbled',
      '1/4 cup fresh parsley, chopped',
      '3 tbsp olive oil',
      '2 tbsp lemon juice',
      '1 tsp dried oregano',
      'Salt and pepper to taste'
    ],
    instructions: [
      'In a medium saucepan, combine quinoa and vegetable broth. Bring to a boil, then reduce heat to low, cover, and simmer for 15-20 minutes until liquid is absorbed.',
      'Remove from heat and let stand for 5 minutes, then fluff with a fork and let cool slightly.',
      'In a large bowl, combine the cooked quinoa, cucumber, tomatoes, red onion, olives, feta cheese, and parsley.',
      'In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.',
      'Pour the dressing over the quinoa mixture and toss to combine.',
      'Serve immediately or refrigerate for up to 3 days.'
    ],
    nutritionFacts: {
      calories: 450,
      protein: '12g',
      carbs: '52g',
      fat: '22g',
      fiber: '8g',
      sugar: '4g'
    },
    reviews: [
      {
        id: '1',
        user: 'Emma L.',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        rating: 5,
        comment: 'Love how fresh and filling this is! Perfect for meal prep.'
      },
      {
        id: '2',
        user: 'Michael R.',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
        rating: 4,
        comment: 'Great flavors! I added some grilled chicken for extra protein.'
      }
    ]
  },
  {
    id: '3',
    title: 'Grilled Salmon with Asparagus',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 30,
    calories: 520,
    difficulty: 'Medium',
    rating: 4.8,
    servings: 2,
    description: 'A perfect dinner option that combines heart-healthy omega-3 rich salmon with crisp, nutrient-packed asparagus. This simple yet elegant meal is both satisfying and nourishing.',
    ingredients: [
      '2 salmon fillets (6 oz each)',
      '1 bunch asparagus, trimmed',
      '2 tbsp olive oil, divided',
      '2 cloves garlic, minced',
      '1 lemon, half juiced and half sliced',
      '1 tsp dried dill (or 1 tbsp fresh)',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Preheat grill or oven to 400°F (200°C).',
      'Place salmon fillets on a sheet of aluminum foil or parchment paper.',
      'In a small bowl, mix 1 tbsp olive oil, minced garlic, lemon juice, dill, salt, and pepper.',
      'Brush the salmon with the marinade and top with lemon slices.',
      'Toss asparagus with remaining olive oil, salt, and pepper.',
      'Arrange asparagus around the salmon.',
      'Fold the foil/parchment to create a sealed packet.',
      'Grill or bake for 15-20 minutes until salmon is cooked through and asparagus is tender-crisp.',
      'Serve immediately.'
    ],
    nutritionFacts: {
      calories: 520,
      protein: '42g',
      carbs: '12g',
      fat: '34g',
      fiber: '5g',
      sugar: '3g'
    },
    reviews: [
      {
        id: '1',
        user: 'David T.',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 5,
        comment: 'The salmon came out perfectly! Such an easy and healthy dinner option.'
      },
      {
        id: '2',
        user: 'Lisa H.',
        avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
        rating: 5,
        comment: 'I make this at least once a week now. So simple and delicious!'
      }
    ]
  },
  // Add more recipes to match the other recipe IDs used in the app
  {
    id: '4',
    title: 'Berry Protein Smoothie',
    image: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 5,
    calories: 280,
    difficulty: 'Easy',
    rating: 4.6,
    servings: 1,
    description: 'This delicious smoothie is packed with antioxidants, protein, and fiber to keep you energized all morning. Perfect for a quick breakfast or post-workout nutrition.',
    ingredients: [
      '1 cup mixed berries (strawberries, blueberries, raspberries)',
      '1 banana',
      '1 scoop protein powder (vanilla or unflavored)',
      '1 cup almond milk (or milk of choice)',
      '1 tbsp chia seeds',
      '1/2 cup Greek yogurt',
      'Ice cubes (optional)',
      'Honey or maple syrup to taste (optional)'
    ],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend on high speed until smooth and creamy, about 30-60 seconds.',
      'Taste and adjust sweetness if needed.',
      'Pour into a glass and enjoy immediately.'
    ],
    nutritionFacts: {
      calories: 280,
      protein: '22g',
      carbs: '38g',
      fat: '6g',
      fiber: '9g',
      sugar: '22g'
    },
    reviews: [
      {
        id: '1',
        user: 'Jennifer W.',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        rating: 5,
        comment: 'My favorite breakfast! I add a handful of spinach for extra nutrients.'
      },
      {
        id: '2',
        user: 'Ryan M.',
        avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
        rating: 4,
        comment: 'Great post-workout recovery drink. I use chocolate protein powder.'
      }
    ]
  },
  {
    id: '5',
    title: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 20,
    calories: 380,
    difficulty: 'Medium',
    rating: 4.4,
    servings: 2,
    description: 'This colorful vegetable stir fry is a versatile dish that can be customized with your favorite veggies and protein. Quick to prepare and packed with nutrients.',
    ingredients: [
      '2 cups mixed vegetables (bell peppers, broccoli, carrots, snap peas)',
      '1 small onion, sliced',
      '2 cloves garlic, minced',
      '1 tbsp ginger, grated',
      '2 tbsp vegetable oil',
      '2 tbsp soy sauce (or tamari)',
      '1 tbsp rice vinegar',
      '1 tsp sesame oil',
      '1 tsp honey or maple syrup',
      'Red pepper flakes to taste',
      '2 cups cooked brown rice or noodles',
      'Sesame seeds and green onions for garnish'
    ],
    instructions: [
      'Heat oil in a large wok or skillet over high heat.',
      'Add onion, garlic, and ginger. Stir-fry for 1 minute until fragrant.',
      'Add vegetables, starting with the firmest ones first. Stir-fry for 4-5 minutes until crisp-tender.',
      'In a small bowl, mix soy sauce, rice vinegar, sesame oil, and honey/maple syrup.',
      'Pour sauce over vegetables and toss to coat.',
      'Cook for an additional 1-2 minutes until sauce thickens slightly.',
      'Serve over cooked rice or noodles.',
      'Garnish with sesame seeds and sliced green onions.'
    ],
    nutritionFacts: {
      calories: 380,
      protein: '8g',
      carbs: '62g',
      fat: '12g',
      fiber: '8g',
      sugar: '9g'
    },
    reviews: [
      {
        id: '1',
        user: 'Ashley K.',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        rating: 4,
        comment: 'Quick, healthy dinner option! I added tofu for protein and it was delicious.'
      },
      {
        id: '2',
        user: 'Thomas J.',
        avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
        rating: 5,
        comment: 'Great way to use up veggies in the fridge. The sauce is perfect!'
      }
    ]
  },
  {
    id: '6',
    title: 'Chickpea Salad Wrap',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 10,
    calories: 350,
    difficulty: 'Easy',
    rating: 4.3,
    servings: 2,
    description: 'These plant-based wraps are perfect for a quick lunch. Packed with protein from chickpeas and loaded with fresh vegetables for a satisfying and nutritious meal.',
    ingredients: [
      '1 can (15 oz) chickpeas, drained and rinsed',
      '1/4 cup red onion, finely diced',
      '1/2 cup cucumber, diced',
      '1/2 cup cherry tomatoes, halved',
      '1/4 cup fresh parsley, chopped',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      '1 tsp cumin',
      'Salt and pepper to taste',
      '2 large whole wheat tortillas or wraps',
      '2 cups mixed greens',
      '1/4 cup hummus'
    ],
    instructions: [
      'In a medium bowl, lightly mash chickpeas with a fork, leaving some whole for texture.',
      'Add red onion, cucumber, tomatoes, and parsley to the chickpeas.',
      'In a small bowl, whisk together olive oil, lemon juice, cumin, salt, and pepper.',
      'Pour dressing over chickpea mixture and toss to combine.',
      'Spread hummus on each tortilla.',
      'Top with mixed greens and chickpea salad.',
      'Roll up tightly, tucking in the sides as you go.',
      'Cut in half and serve immediately or wrap in foil for a packed lunch.'
    ],
    nutritionFacts: {
      calories: 350,
      protein: '12g',
      carbs: '45g',
      fat: '14g',
      fiber: '11g',
      sugar: '5g'
    },
    reviews: [
      {
        id: '1',
        user: 'Olivia S.',
        avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
        rating: 4,
        comment: 'Perfect for meal prep lunches! I make a batch of the chickpea salad on Sunday.'
      },
      {
        id: '2',
        user: 'Brian L.',
        avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
        rating: 5,
        comment: 'I was skeptical about a vegetarian wrap, but this is so flavorful and filling!'
      }
    ]
  }
];

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [recipe, setRecipe] = useState<typeof allRecipes[0] | null>(null);
  const [servings, setServings] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Find the recipe by ID
    const fetchRecipe = () => {
      setIsLoading(true);
      const foundRecipe = allRecipes.find(r => r.id === id);
      
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setServings(foundRecipe.servings);
      } else {
        // If recipe not found, use the first one as fallback
        console.error(`Recipe with ID ${id} not found`);
        setRecipe(allRecipes[0]);
        setServings(allRecipes[0].servings);
      }
      
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    fetchRecipe();
  }, [id]);
  
  useEffect(() => {
    if (recipe?.image) {
      const img = new Image();
      img.src = recipe.image;
      img.onload = () => setImageLoaded(true);
    }
  }, [recipe?.image]);
  
  const addToCart = () => {
    toast({
      title: "Added to shopping cart",
      description: `Ingredients for ${recipe?.title} have been added to your cart.`,
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
          
          <div className="px-6 py-4 -mt-10 relative">
            <div className="glass-card rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl font-serif font-semibold mb-2">{recipe.title}</h1>
              
              <div className="flex flex-wrap gap-3 mt-4 mb-4">
                <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-3 py-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookingTime} mins</span>
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
