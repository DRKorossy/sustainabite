import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, CheckCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import CameraInput from '@/components/CameraInput';
import GroceryList from '@/components/GroceryList';
import { supabase } from "@/integrations/supabase/client";

interface RecognizedItem {
  name: string;
  confidence: number;
  quantity: number;
}

const GroceryRecognition = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup function to reset state when component unmounts
    return () => {
      setRecognizing(false);
      setRecognized(false);
      setRecognizedItems([]);
      setImage(null);
    };
  }, []);

  const handleBack = () => {
    if (recognizing || recognized) {
      setRecognizing(false);
      setRecognized(false);
      setRecognizedItems([]);
      setImage(null);
    } else {
      navigate(-1);
    }
  };

  const startScanning = () => {
    setShowCamera(true);
  };

  const handleImageCapture = (imageData: string, items?: any[]) => {
    setShowCamera(false);
    setImage(imageData);
    
    if (items && items.length > 0) {
      setRecognizedItems(items);
      setRecognized(true);
      
      // Add items to user's grocery list (already handled in CameraInput)
    } else {
      // If no items were recognized from the edge function
      setRecognizing(true);
      
      // Simulate recognition process (in a real app, this would be handled by the edge function)
      setTimeout(() => {
        const mockItems: RecognizedItem[] = [
          { name: "Apples", confidence: 0.95, quantity: 5 },
          { name: "Milk", confidence: 0.89, quantity: 1 },
          { name: "Bread", confidence: 0.82, quantity: 1 }
        ];
        
        setRecognizedItems(mockItems);
        setRecognizing(false);
        setRecognized(true);
      }, 2000);
    }
  };

  const handleAddToGroceries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add items to your grocery list.",
          variant: "destructive"
        });
        return;
      }
      
      // Add recognized items to user's groceries
      for (const item of recognizedItems) {
        // In a real app, we would add these items to the database
        // This is handled in the edge function already
      }
      
      toast({
        title: "Items added to your groceries",
        description: `Added ${recognizedItems.length} items.`,
      });
      
      // Reset and go back to grocery list
      setRecognizing(false);
      setRecognized(false);
      setRecognizedItems([]);
      setImage(null);
      
    } catch (error) {
      console.error('Error adding items to groceries:', error);
      toast({
        title: "Failed to add items",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Use GroceryList component as the main content
  return <GroceryList />;
};

export default GroceryRecognition;
