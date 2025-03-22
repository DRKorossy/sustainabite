
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  Check,
  Plus,
  Trash2,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import CameraInput from '@/components/CameraInput';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock function to simulate OCR recognition
const recognizeGroceries = (imageData: string): Promise<string[]> => {
  // In a real app, this would call an OCR API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate recognition results
      resolve([
        'Tomatoes',
        'Avocado',
        'Spinach',
        'Chicken breast',
        'Brown rice',
        'Olive oil'
      ]);
    }, 1500);
  });
};

interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
}

const GroceryRecognition = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const navigate = useNavigate();

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
    setIsProcessing(true);
    
    try {
      const recognizedItems = await recognizeGroceries(imageData);
      
      // Convert to grocery items format
      const newItems = recognizedItems.map(item => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: item,
        checked: false
      }));
      
      setGroceryItems(prev => [...prev, ...newItems]);
      
      toast({
        title: "Groceries recognized",
        description: `Found ${recognizedItems.length} items in your image.`,
      });
    } catch (error) {
      toast({
        title: "Recognition failed",
        description: "We couldn't process your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleItemCheck = (id: string) => {
    setGroceryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addNewItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newItemName.trim(),
        checked: false
      };
      
      setGroceryItems(prev => [...prev, newItem]);
      setNewItemName('');
    }
  };

  const deleteItem = (id: string) => {
    setGroceryItems(prev => prev.filter(item => item.id !== id));
  };

  const findRecipes = () => {
    // In a real app, this would pass the groceries to a recipe search
    const ingredients = groceryItems.map(item => item.name).join(', ');
    toast({
      title: "Finding recipes",
      description: `Searching for recipes with: ${ingredients.substring(0, 60)}...`,
    });
    navigate('/discover?ingredients=' + encodeURIComponent(ingredients));
  };

  const addToCart = () => {
    const uncheckedItems = groceryItems.filter(item => !item.checked);
    if (uncheckedItems.length === 0) {
      toast({
        title: "No items to add",
        description: "Please uncheck items you want to add to your cart",
      });
      return;
    }
    
    // In a real app, this would add items to the shopping cart
    toast({
      title: "Added to cart",
      description: `${uncheckedItems.length} items added to your shopping cart.`,
    });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-sustainabite-cream pb-24">
      <header className="bg-sustainabite-cream glass-card sticky top-0 z-30 py-4 px-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-serif font-semibold">My Groceries</h1>
          <div className="w-10"></div> {/* Spacer to center the title */}
        </div>
      </header>
      
      <main className="px-6 py-4">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 border-4 border-sustainabite-purple border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Recognizing groceries...</p>
          </div>
        ) : (
          <>
            <div className="glass-card rounded-xl p-5 mb-6">
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Add a grocery item"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNewItem()}
                  className="flex-1"
                />
                <Button onClick={addNewItem} className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <Button 
                onClick={() => setShowCamera(true)} 
                className="w-full py-6 flex items-center justify-center gap-2 bg-sustainabite-purple hover:bg-sustainabite-purple/90"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo of Groceries</span>
              </Button>
            </div>
            
            <div className="glass-card rounded-xl p-5 mb-6">
              <h2 className="text-lg font-serif font-medium mb-4">Your Grocery Items</h2>
              
              {groceryItems.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No groceries added yet.</p>
                  <p className="text-sm mt-2">Take a photo or add items manually.</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <ul className="space-y-3">
                    {groceryItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                        <Checkbox 
                          id={`check-${item.id}`}
                          checked={item.checked}
                          onCheckedChange={() => toggleItemCheck(item.id)}
                        />
                        <label 
                          htmlFor={`check-${item.id}`}
                          className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.name}
                        </label>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>
            
            {groceryItems.length > 0 && (
              <div className="flex gap-3 mb-20">
                <Button 
                  className="flex-1 py-6"
                  onClick={findRecipes}
                >
                  Find Recipes
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 py-6 border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5"
                  onClick={addToCart}
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Add to Cart
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      {showCamera && (
        <CameraInput 
          onImageCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default GroceryRecognition;
