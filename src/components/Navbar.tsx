
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  ChefHat, 
  ShoppingCart, 
  User, 
  Carrot,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    // For home/dashboard, only match exact path
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    
    // For other paths, match if the current path starts with the item path
    // This helps with nested routes
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Recipes', path: '/recipes', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'Groceries', path: '/my-groceries', icon: <Carrot className="w-5 h-5" /> },
    { name: 'Social', path: '/social', icon: <Users className="w-5 h-5" /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  // Only show navbar on certain pages
  if (location.pathname === '/' || location.pathname === '/onboarding' || 
      location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <>
      {/* Mobile Navbar */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-lg transition-all duration-300",
          isScrolled && "shadow-md"
        )}
      >
        <div className="flex items-center justify-between px-1 py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-1 px-2 rounded-lg transition-all duration-300",
                isActive(item.path)
                  ? "text-sustainabite-purple font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
