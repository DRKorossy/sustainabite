
import { useState } from "react";
import { Search, Flame, ChefHat, Star, Filter, X, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const popularSearches = [
  "Healthy dinner", "Quick lunch", "Vegetarian", "High protein", 
  "Low calorie", "Gluten free", "Mediterranean", "Asian fusion"
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

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-medium text-left">Trending Now</h2>
          <div className="flex items-center text-sm text-sustainabite-purple">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Most popular this week</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {trendingRecipes.map(recipe => (
            <RecipeCard key={recipe.id} {...recipe} className="h-full" />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-medium text-left">Quick & Easy</h2>
          <div className="flex items-center text-sm text-sustainabite-purple">
            <Clock className="w-4 h-4 mr-1" />
            <span>Under 30 minutes</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {trendingRecipes.slice(0, 2).map(recipe => (
            <RecipeCard key={`quick-${recipe.id}`} {...recipe} className="h-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
