
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Bookmark, Filter, Heart, Search, X, TrendingUp } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const cuisineFilters = [
  "Italian", "Asian", "Mexican", "Mediterranean", "Indian", 
  "American", "French", "Middle Eastern", "Thai", "Japanese"
];

const popularSearches = [
  "Healthy dinner", "Quick lunch", "Vegetarian", "High protein", 
  "Low calorie", "Gluten free", "Mediterranean", "Asian fusion"
];

const recipeCollection = [
  {
    id: "rec1",
    title: "Mediterranean Chickpea Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    cookingTime: 15,
    calories: 320,
    difficulty: "Easy" as const,
    rating: 4.7
  },
  {
    id: "rec2",
    title: "Lemon Garlic Butter Shrimp Pasta",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    cookingTime: 25,
    calories: 450,
    difficulty: "Medium" as const,
    rating: 4.8
  },
  {
    id: "rec3",
    title: "Spinach & Feta Stuffed Chicken",
    image: "https://images.unsplash.com/photo-1518492104633-130d5b3143bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
    cookingTime: 35,
    calories: 380,
    difficulty: "Medium" as const,
    rating: 4.9
  },
  {
    id: "rec4",
    title: "Vegetable Buddha Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
    cookingTime: 20,
    calories: 350,
    difficulty: "Easy" as const,
    rating: 4.6
  },
  {
    id: "rec5",
    title: "Teriyaki Salmon with Rice",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    cookingTime: 30,
    calories: 420,
    difficulty: "Medium" as const,
    rating: 4.8
  },
  {
    id: "rec6",
    title: "Avocado Toast with Poached Egg",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
    cookingTime: 15,
    calories: 300,
    difficulty: "Easy" as const,
    rating: 4.7
  }
];

const trendingRecipes = [
  {
    id: "trend1",
    title: "Avocado & Quinoa Power Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    cookingTime: 20,
    calories: 420,
    difficulty: "Easy" as const,
    rating: 4.8
  },
  {
    id: "trend2",
    title: "Lemon Garlic Salmon",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    cookingTime: 25,
    calories: 380,
    difficulty: "Medium" as const,
    rating: 4.9
  },
  {
    id: "trend3",
    title: "Mushroom Risotto",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    cookingTime: 35,
    calories: 450,
    difficulty: "Medium" as const,
    rating: 4.7
  },
  {
    id: "trend4",
    title: "Overnight Oats with Berries",
    image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    cookingTime: 10,
    calories: 320,
    difficulty: "Easy" as const,
    rating: 4.6
  }
];

const savedRecipes = recipeCollection.slice(0, 3);
const createdRecipes = recipeCollection.slice(3, 5);

const Recipes = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 pb-24 pt-6 animate-fade-in">
      <div className="glass-card p-4 mb-6 rounded-2xl">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for recipes, ingredients, or cuisine..."
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
          <ScrollArea className="whitespace-nowrap pb-3">
            <div className="flex gap-2">
              {cuisineFilters.map(cuisine => (
                <Badge 
                  key={cuisine}
                  variant={selectedCuisine === cuisine ? "default" : "outline"} 
                  className={`px-3 py-2 cursor-pointer ${
                    selectedCuisine === cuisine 
                      ? "bg-sustainabite-purple text-white" 
                      : "hover:bg-sustainabite-purple/10"
                  }`}
                  onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>

        <TabsContent value="discover" className="mt-0">
          {/* Popular Searches Section */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-medium mb-3 text-left">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(search => (
                <Button 
                  key={search} 
                  variant="outline" 
                  className="rounded-full text-sm bg-background/80 hover:bg-accent/80"
                  onClick={() => addFilter(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Trending Now Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-xl font-medium text-left">Trending Now</h2>
              <div className="flex items-center text-sm text-sustainabite-purple">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Most popular this week</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingRecipes.map(recipe => (
                <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                  <RecipeCard {...recipe} className="h-full" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick & Easy Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-xl font-medium text-left">Quick & Easy</h2>
              <div className="flex items-center text-sm text-sustainabite-purple">
                <Clock className="w-4 h-4 mr-1" />
                <span>Under 30 minutes</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingRecipes.slice(0, 2).map(recipe => (
                <Link to={`/recipe/${recipe.id}`} key={`quick-${recipe.id}`}>
                  <RecipeCard {...recipe} className="h-full" />
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipeCollection.map(recipe => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                <RecipeCard {...recipe} className="h-full" />
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map(recipe => (
              <div key={recipe.id} className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-3 right-3 z-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
                >
                  <Bookmark className="h-4 w-4 fill-current" />
                </Button>
                <Link to={`/recipe/${recipe.id}`}>
                  <RecipeCard {...recipe} className="h-full" />
                </Link>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="created" className="mt-0">
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
                  <RecipeCard {...recipe} className="h-full" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recipes;
