
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Bookmark, Filter, Heart } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const cuisineFilters = [
  "Italian", "Asian", "Mexican", "Mediterranean", "Indian", 
  "American", "French", "Middle Eastern", "Thai", "Japanese"
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

const savedRecipes = recipeCollection.slice(0, 3);
const createdRecipes = recipeCollection.slice(3, 5);

const Recipes = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  return (
    <div className="container max-w-5xl mx-auto px-4 pb-24 pt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-medium">My Recipes</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="w-full justify-start mb-6 bg-background/60 p-1">
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

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipeCollection.map(recipe => (
              <RecipeCard key={recipe.id} {...recipe} className="h-full" />
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
                <RecipeCard {...recipe} className="h-full" />
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
                <RecipeCard {...recipe} className="h-full" />
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
