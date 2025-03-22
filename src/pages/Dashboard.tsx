
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChefHat, 
  Clock, 
  Fire, 
  Utensils, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecipeCard from '@/components/RecipeCard';
import { cn } from '@/lib/utils';

// Mock data for recipes
const mockRecipes = [
  {
    id: '1',
    title: 'Avocado & Egg Toast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 15,
    calories: 320,
    difficulty: 'Easy' as const,
    rating: 4.7,
    category: 'breakfast'
  },
  {
    id: '2',
    title: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 25,
    calories: 450,
    difficulty: 'Medium' as const,
    rating: 4.5,
    category: 'lunch'
  },
  {
    id: '3',
    title: 'Grilled Salmon with Asparagus',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 30,
    calories: 520,
    difficulty: 'Medium' as const,
    rating: 4.8,
    category: 'dinner'
  },
  {
    id: '4',
    title: 'Berry Protein Smoothie',
    image: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 5,
    calories: 280,
    difficulty: 'Easy' as const,
    rating: 4.6,
    category: 'breakfast'
  },
  {
    id: '5',
    title: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 20,
    calories: 380,
    difficulty: 'Medium' as const,
    rating: 4.4,
    category: 'dinner'
  },
  {
    id: '6',
    title: 'Chickpea Salad Wrap',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    cookingTime: 10,
    calories: 350,
    difficulty: 'Easy' as const,
    rating: 4.3,
    category: 'lunch'
  }
];

// Mock categories
const categories = [
  { id: 'all', name: 'All', icon: <Utensils className="w-4 h-4" /> },
  { id: 'breakfast', name: 'Breakfast', icon: <ChefHat className="w-4 h-4" /> },
  { id: 'lunch', name: 'Lunch', icon: <Clock className="w-4 h-4" /> }, 
  { id: 'dinner', name: 'Dinner', icon: <Fire className="w-4 h-4" /> }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredRecipes, setFilteredRecipes] = useState(mockRecipes);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Filter recipes based on search and category
    const filtered = mockRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    
    setFilteredRecipes(filtered);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-sustainabite-cream pb-24">
      {/* Header */}
      <header className="bg-sustainabite-cream glass-card sticky top-0 z-30 py-4 px-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-semibold mr-2">
              <span className="text-sustainabite-orange">Sustaina</span>
              <span className="text-sustainabite-purple">BITE</span>
            </h1>
            <div className="-mt-4">
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 25 Q20 10 30 20 Q35 25 30 30 Q20 40 10 30 Q5 25 10 25Z" fill="#A0C55F" />
                <path d="M15 20 Q25 5 35 15 Q40 20 35 25 Q25 35 15 25 Q10 20 15 20Z" fill="#7CAA2D" opacity="0.8" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5"
              onClick={() => navigate('/filters')}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-5 rounded-xl"
          />
        </div>
      </header>
      
      <main className="px-6 py-4">
        {/* Category filters */}
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-2 w-max">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant="outline"
                className={cn(
                  "rounded-full flex gap-2 py-5 border-sustainabite-purple/30 transition-all",
                  activeCategory === category.id 
                    ? "bg-sustainabite-purple text-white" 
                    : "text-sustainabite-purple hover:bg-sustainabite-purple/5"
                )}
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
        
        {/* Personalized section */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-medium">Personalized for you</h2>
            <Button 
              variant="link" 
              className="text-sustainabite-purple font-medium p-0"
              onClick={() => navigate('/discover')}
            >
              See all
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <div className="h-64 rounded-2xl animate-pulse bg-muted"></div>
                <div className="h-64 rounded-2xl animate-pulse bg-muted"></div>
              </>
            ) : (
              filteredRecipes.slice(0, 2).map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  cookingTime={recipe.cookingTime}
                  calories={recipe.calories}
                  difficulty={recipe.difficulty}
                  rating={recipe.rating}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Today's meals */}
        <div className="mt-10">
          <h2 className="text-xl font-serif font-medium mb-4">Today's meals</h2>
          
          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="w-full mb-4 h-auto bg-muted rounded-xl p-1">
              <TabsTrigger 
                value="breakfast" 
                className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-sustainabite-purple rounded-lg"
              >
                Breakfast
              </TabsTrigger>
              <TabsTrigger 
                value="lunch" 
                className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-sustainabite-purple rounded-lg"
              >
                Lunch
              </TabsTrigger>
              <TabsTrigger 
                value="dinner" 
                className="flex-1 py-2 data-[state=active]:bg-white data-[state=active]:text-sustainabite-purple rounded-lg"
              >
                Dinner
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="breakfast" className="pt-2">
              {isLoading ? (
                <div className="h-64 rounded-2xl animate-pulse bg-muted"></div>
              ) : (
                <RecipeCard
                  {...mockRecipes.find(r => r.category === 'breakfast') || mockRecipes[0]}
                />
              )}
            </TabsContent>
            
            <TabsContent value="lunch" className="pt-2">
              {isLoading ? (
                <div className="h-64 rounded-2xl animate-pulse bg-muted"></div>
              ) : (
                <RecipeCard
                  {...mockRecipes.find(r => r.category === 'lunch') || mockRecipes[1]}
                />
              )}
            </TabsContent>
            
            <TabsContent value="dinner" className="pt-2">
              {isLoading ? (
                <div className="h-64 rounded-2xl animate-pulse bg-muted"></div>
              ) : (
                <RecipeCard
                  {...mockRecipes.find(r => r.category === 'dinner') || mockRecipes[2]}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Recent recipes */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-medium">Recent recipes</h2>
            <Button 
              variant="link" 
              className="text-sustainabite-purple font-medium p-0"
              onClick={() => navigate('/recipes')}
            >
              View all
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              <>
                <div className="h-40 rounded-2xl animate-pulse bg-muted"></div>
                <div className="h-40 rounded-2xl animate-pulse bg-muted"></div>
              </>
            ) : (
              filteredRecipes.slice(2, 4).map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  cookingTime={recipe.cookingTime}
                  calories={recipe.calories}
                  difficulty={recipe.difficulty}
                  rating={recipe.rating}
                  className="h-full"
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
