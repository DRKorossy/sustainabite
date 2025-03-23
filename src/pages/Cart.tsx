
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  MinusCircle, 
  PlusCircle, 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  ChevronRight, 
  Tag, 
  Search,
  X,
  Clock,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  grocery_item_id: string;
}

interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  is_perishable: boolean;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>("waitrose");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCartItems();
    fetchGroceries();
  }, [user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        // Use mock data if user is not logged in
        setCartItems([
          {
            id: "1",
            name: "Organic Avocados",
            price: 3.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1775&q=80",
            category: "Produce",
            grocery_item_id: "g1"
          },
          {
            id: "2",
            name: "Free-Range Eggs (12 pack)",
            price: 4.49,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1704&q=80",
            category: "Dairy",
            grocery_item_id: "g2"
          },
          {
            id: "3",
            name: "Organic Spinach (5oz)",
            price: 2.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
            category: "Produce",
            grocery_item_id: "g3"
          },
          {
            id: "4",
            name: "Whole Grain Bread",
            price: 3.49,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
            category: "Bakery",
            grocery_item_id: "g4"
          },
        ]);
        return;
      }
      
      // Fetch cart items from Supabase
      const { data, error } = await supabase
        .from('shopping_cart')
        .select(`
          id,
          quantity,
          grocery_items (
            id,
            name,
            category,
            average_price,
            image_url
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedItems = data.map(item => ({
          id: item.id,
          name: item.grocery_items.name,
          price: item.grocery_items.average_price || 2.99,
          quantity: item.quantity,
          image: item.grocery_items.image_url || "https://images.unsplash.com/photo-1553787499-6f9133860278?q=80&w=1287&auto=format&fit=crop",
          category: item.grocery_items.category,
          grocery_item_id: item.grocery_items.id
        }));
        
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: 'Error fetching cart',
        description: 'Unable to load your shopping cart.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchGroceries = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('groceries')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setGroceries(data || []);
    } catch (error) {
      console.error('Error fetching groceries:', error);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('shopping_cart')
          .update({ quantity: newQuantity })
          .eq('id', id);
        
        if (error) throw error;
      }
      
      // Update local state
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error updating quantity',
        description: 'Unable to update item quantity.',
        variant: 'destructive'
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      if (user) {
        // Remove from Supabase
        const { error } = await supabase
          .from('shopping_cart')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      }
      
      // Remove from local state
      setCartItems(cartItems.filter((item) => item.id !== id));
      
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart.'
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error removing item',
        description: 'Unable to remove item from cart.',
        variant: 'destructive'
      });
    }
  };
  
  const handleCheckout = () => {
    setShowCheckout(true);
  };
  
  const processPayment = async () => {
    try {
      setCheckoutLoading(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If logged in, clear the shopping cart
      if (user) {
        const { error } = await supabase
          .from('shopping_cart')
          .delete()
          .eq('user_id', user.id);
        
        if (error) throw error;
      }
      
      setShowCheckout(false);
      setShowSuccess(true);
      // Clear cart
      setCartItems([]);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Payment error',
        description: 'There was a problem processing your payment.',
        variant: 'destructive'
      });
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  const findMatchingGrocery = (itemName: string) => {
    // Simplify the item name for better matching
    const simplifiedItemName = itemName.toLowerCase().replace(/\([^)]*\)/g, '').trim();
    
    return groceries.find(grocery => 
      grocery.name.toLowerCase().includes(simplifiedItemName) || 
      simplifiedItemName.includes(grocery.name.toLowerCase())
    );
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const shipping = 4.99;
  const discount = promoCode === "FIRSTORDER" ? 5 : 0;
  const total = subtotal + shipping - discount;
  
  const filteredCartItems = searchTerm
    ? cartItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cartItems;

  return (
    <div className="container max-w-5xl mx-auto px-4 pb-24 pt-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-medium">Shopping Cart</h1>
        <p className="text-muted-foreground">{cartItems.length} items from your shopping list</p>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cart items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-5 rounded-xl"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Provider selection */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Choose your provider</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button
            variant={selectedProvider === "waitrose" ? "default" : "outline"}
            className={`rounded-lg px-4 py-3 h-auto flex flex-col items-center ${
              selectedProvider === "waitrose" ? "bg-sustainabite-purple" : ""
            }`}
            onClick={() => setSelectedProvider("waitrose")}
          >
            <span className="font-bold">Waitrose</span>
            <span className="text-xs mt-1">Premium quality</span>
          </Button>
          
          <Button
            variant={selectedProvider === "tesco" ? "default" : "outline"}
            className={`rounded-lg px-4 py-3 h-auto flex flex-col items-center ${
              selectedProvider === "tesco" ? "bg-sustainabite-purple" : ""
            }`}
            onClick={() => setSelectedProvider("tesco")}
          >
            <span className="font-bold">Tesco</span>
            <span className="text-xs mt-1">Best value</span>
          </Button>
          
          <Button
            variant={selectedProvider === "ocado" ? "default" : "outline"}
            className={`rounded-lg px-4 py-3 h-auto flex flex-col items-center ${
              selectedProvider === "ocado" ? "bg-sustainabite-purple" : ""
            }`}
            onClick={() => setSelectedProvider("ocado")}
          >
            <span className="font-bold">Ocado</span>
            <span className="text-xs mt-1">Fast delivery</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sustainabite-purple mb-4" />
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          ) : filteredCartItems.length > 0 ? (
            <div className="space-y-4">
              {filteredCartItems.map((item) => {
                const matchingGrocery = findMatchingGrocery(item.name);
                const expiryDays = matchingGrocery?.expiry_date 
                  ? getDaysUntilExpiry(matchingGrocery.expiry_date) 
                  : null;
                
                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-background/80 rounded-lg border border-border">
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <Badge variant="outline" className="mb-1 text-xs">
                            {item.category}
                          </Badge>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sustainabite-purple font-medium mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                          
                          {matchingGrocery && (
                            <div className="mt-2 text-xs text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              You have {matchingGrocery.quantity} {matchingGrocery.unit || 'units'} remaining
                              {expiryDays !== null && (
                                <span className="ml-1">
                                  {expiryDays <= 0 
                                    ? '(expired)' 
                                    : `(expires in ${expiryDays} days)`}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mt-4">Your cart is empty</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Add some ingredients from your recipes to get started
              </p>
              <Button onClick={() => window.location.href = '/recipes'}>Browse Recipes</Button>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="glass-card p-6 rounded-lg sticky top-4">
            <h3 className="font-serif text-lg font-medium mb-4">Order Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium text-lg mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">Apply</Button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-sustainabite-purple" />
                <span className="text-muted-foreground">Try code <strong>FIRSTORDER</strong> for $5 off</span>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                <CreditCard className="mr-2 h-4 w-4" /> Checkout
              </Button>
              
              <div className="text-center text-xs text-muted-foreground mt-2">
                Secure payment processing
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your order with your preferred payment method.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{cartItems.length} items</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Payment Method</h3>
              <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit / Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="apple" id="apple" />
                  <Label htmlFor="apple">Apple Pay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="google" id="google" />
                  <Label htmlFor="google">Google Pay</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowCheckout(false)}
              disabled={checkoutLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={processPayment}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${total.toFixed(2)}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 flex items-center justify-center">
              <div className="bg-green-100 rounded-full p-2 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Order Confirmed!
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4 py-4">
            <p>Thank you for your purchase!</p>
            <p className="text-sm text-muted-foreground">
              Your order has been confirmed and will be delivered to you within 2-3 business days.
              A receipt has been sent to your email address.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium">Order Number</p>
              <p className="text-muted-foreground">{Math.floor(Math.random() * 1000000)}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowSuccess(false);
                window.location.href = '/dashboard';
              }}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
