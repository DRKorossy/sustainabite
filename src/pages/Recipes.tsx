
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChefHat, Filter, Heart, Search, X, TrendingUp } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { searchRecipes, getSavedRecipes } from "@/utils/recipeSearch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const cuisineFilters = [
  "Italian", "Asian", "Mexican", "Mediterranean", "Indian", 
  "American", "French", "Middle Eastern", "Thai", "Japanese"
];

const Recipes = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [createdRecipes, setCreatedRecipes] = useState<any[]>([]);
  const { user } = useAuth();
  
  // Refs for swipe functionality
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  useEffect(() => {
    fetchRecipes();
    if (user) {
      fetchSavedRecipes();
      fetchCreatedRecipes();
    }
  }, [user]);
  
  useEffect(() => {
    // Apply search filter when query changes
    if (searchQuery.length > 0 || selectedCuisine) {
      fetchRecipes();
    }
  }, [searchQuery, selectedCuisine]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      
      const { data, count } = await searchRecipes({
        searchTerm: searchQuery,
        cuisine: selectedCuisine || undefined,
        limit: 30
      });
      
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: 'Error fetching recipes',
        description: 'Unable to load recipes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSavedRecipes = async () => {
    try {
      if (!user) return;
      
      const data = await getSavedRecipes(user.id);
      setSavedRecipes(data || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };
  
  const fetchCreatedRecipes = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await searchRecipes({
        searchTerm: '',
        limit: 10,
        offset: 0
      });
      
      if (error) throw error;
      
      // For now, just show a subset as user's created recipes
      setCreatedRecipes(data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching created recipes:', error);
    }
  };

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const handleCuisineClick = (cuisine: string) => {
    setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine);
  };
  
  // Touch handlers for cuisine scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollAreaRef.current) return;
    setStartX(e.touches[0].clientX);
    setScrollLeft(scrollAreaRef.current.scrollLeft);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX || !scrollAreaRef.current) return;
    const x = e.touches[0].clientX;
    const walk = (startX - x) * 2; // Multiply by 2 for faster scrolling
    scrollAreaRef.current.scrollLeft = scrollLeft + walk;
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 pb-24 pt-6 animate-fade-in">
      <div className="glass-card p-4 mb-6 rounded-2xl">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes..."
              className="pl-9 pr-4 py-2 w-full bg-background/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="bg-background/80">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.map(filter => (
              <Badge key={filter} className="px-3 py-1 bg-background/80 text-foreground flex items-center gap-1">
                {filter}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full justify-start mb-6 bg-background/60 p-1">
          <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">All Recipes</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
          <TabsTrigger value="created" className="flex-1">Created</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <div 
            ref={scrollAreaRef}
            className="overflow-x-auto whitespace-nowrap pb-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="flex gap-2 p-1">
              {cuisineFilters.map(cuisine => (
                <Badge 
                  key={cuisine}
                  variant={selectedCuisine === cuisine ? "default" : "outline"} 
                  className={`px-3 py-2 cursor-pointer ${
                    selectedCuisine === cuisine 
                      ? "bg-sustainabite-purple text-white" 
                      : "hover:bg-sustainabite-purple/10"
                  }`}
                  onClick={() => handleCuisineClick(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <TabsContent value="discover" className="mt-0">
          {/* Trending Now Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-xl font-medium text-left">Trending Now</h2>
              <div className="flex items-center text-sm text-sustainabite-purple">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Most popular this week</span>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-56 rounded-2xl animate-pulse bg-muted"></div>
                <div className="h-56 rounded-2xl animate-pulse bg-muted"></div>
                <div className="h-56 rounded-2xl animate-pulse bg-muted"></div>
                <div className="h-56 rounded-2xl animate-pulse bg-muted"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipes.slice(0, 4).map(recipe => (
                  <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                    <RecipeCard 
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.image_url}
                      cookingTime={recipe.cooking_time}
                      calories={recipe.calories}
                      difficulty={recipe.difficulty}
                      rating={recipe.rating}
                      className="h-full" 
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick & Easy Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-xl font-medium text-left">Quick & Easy</h2>
              <div className="flex items-center text-sm text-sustainabite-purple">
                <Filter className="w-4 h-4 mr-1" />
                <span>Under 30 minutes</span>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-56 rounded-2xl animate-pulse bg-muted"></div>
                <div className="h-56 rounded-2xl animate-pulse bg-muted"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipes
                  .filter(recipe => recipe.cooking_time <= 30)
                  .slice(0, 2)
                  .map(recipe => (
                    <Link to={`/recipe/${recipe.id}`} key={`quick-${recipe.id}`}>
                      <RecipeCard 
                        id={recipe.id}
                        title={recipe.title}
                        image={recipe.image_url}
                        cookingTime={recipe.cooking_time}
                        calories={recipe.calories}
                        difficulty={recipe.difficulty}
                        rating={recipe.rating}
                        className="h-full" 
                      />
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sustainabite-purple" />
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map(recipe => (
                <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                  <RecipeCard 
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image_url}
                    cookingTime={recipe.cooking_time}
                    calories={recipe.calories}
                    difficulty={recipe.difficulty}
                    rating={recipe.rating}
                    className="h-full" 
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recipes found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          {!user ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Please log in to view your saved recipes.</p>
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sustainabite-purple" />
            </div>
          ) : savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-3 right-3 z-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                  <Link to={`/recipe/${recipe.id}`}>
                    <RecipeCard 
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.image_url}
                      cookingTime={recipe.cooking_time}
                      calories={recipe.calories}
                      difficulty={recipe.difficulty}
                      rating={recipe.rating}
                      className="h-full" 
                    />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't saved any recipes yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="created" className="mt-0">
          {!user ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Please log in to view your created recipes.</p>
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sustainabite-purple" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdRecipes.map(recipe => (
                <div key={recipe.id} className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-3 right-3 z-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Link to={`/recipe/${recipe.id}`}>
                    <RecipeCard 
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.image_url}
                      cookingTime={recipe.cooking_time}
                      calories={recipe.calories}
                      difficulty={recipe.difficulty}
                      rating={recipe.rating}
                      className="h-full" 
                    />
                  </Link>
                </div>
              ))}
              <div className="flex items-center justify-center h-full min-h-[300px] rounded-2xl border-2 border-dashed border-muted p-6 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                    <ChefHat className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">Create a recipe</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Share your culinary creations with the community
                  </p>
                  <Button className="mt-2">Create Recipe</Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recipes;
