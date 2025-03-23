
import { useState, useEffect } from 'react';
import { ChevronRight, PlusCircle, Camera, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import CameraInput from './CameraInput';
import { useNavigate } from 'react-router-dom';

interface Grocery {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  is_perishable: boolean;
}

const GroceryList = () => {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('groceries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setGroceries(data || []);
    } catch (error) {
      console.error('Error fetching groceries:', error);
      toast({
        title: "Failed to load groceries",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageCapture = async (imageData: string, recognizedItems?: any[]) => {
    setShowCamera(false);
    
    if (recognizedItems && recognizedItems.length > 0) {
      await fetchGroceries(); // Refresh groceries list
      
      toast({
        title: "Groceries added successfully",
        description: `Added ${recognizedItems.length} items to your groceries.`,
      });
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    // Reset time components for accurate day calculation
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const filteredGroceries = groceries.filter(grocery => 
    grocery.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-4 pb-24">
      <div className="flex items-center justify-between mb-4 px-6">
        <h1 className="text-2xl font-serif font-medium">My Groceries</h1>
        
        <Button 
          size="icon"
          className="rounded-full bg-sustainabite-purple"
          onClick={() => setShowCamera(true)}
        >
          <Camera className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="px-6 mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search groceries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 py-6 rounded-xl border-muted"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sustainabite-purple mb-4" />
          <p className="text-muted-foreground">Loading your groceries...</p>
        </div>
      ) : (
        <>
          {filteredGroceries.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <PlusCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No groceries found</h3>
              <p className="text-muted-foreground mb-6">Scan groceries to add them to your list</p>
              
              <Button 
                onClick={() => setShowCamera(true)}
                className="bg-sustainabite-purple hover:bg-sustainabite-purple/90"
              >
                <Camera className="w-4 h-4 mr-2" />
                Scan Groceries
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-230px)]">
              <div className="px-6 space-y-4">
                {filteredGroceries.map(grocery => {
                  const daysUntilExpiry = grocery.expiry_date ? getDaysUntilExpiry(grocery.expiry_date) : null;
                  const isExpiring = daysUntilExpiry !== null && daysUntilExpiry <= 3;
                  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
                  
                  return (
                    <div 
                      key={grocery.id}
                      className="glass-card rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{grocery.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span>{grocery.quantity} {grocery.unit || 'units'}</span>
                          
                          {grocery.is_perishable && grocery.expiry_date && (
                            <div className="flex items-center ml-4">
                              {isExpired ? (
                                <Badge variant="destructive" className="flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Expired
                                </Badge>
                              ) : isExpiring ? (
                                <Badge variant="warning" className="flex items-center bg-amber-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {daysUntilExpiry === 0 ? 'Today' : `${daysUntilExpiry} days`}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="flex items-center bg-green-100 text-green-800 border-green-200">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {daysUntilExpiry} days
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </>
      )}
      
      {showCamera && (
        <CameraInput
          onImageCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default GroceryList;
