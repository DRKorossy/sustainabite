
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  ChefHat, 
  ShoppingCart, 
  User, 
  MenuIcon, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Discover', path: '/discover', icon: <Search className="w-5 h-5" /> },
    { name: 'Cook', path: '/recipes', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-300",
            isActive(item.path)
              ? "text-sustainabite-purple font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </>
  );

  // Only show navbar on certain pages
  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return null;
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg transition-all duration-300 hidden md:flex justify-center",
          isScrolled && "shadow-md"
        )}
      >
        <div className="flex items-center justify-center gap-4 py-2 px-4 max-w-screen-lg w-full">
          {renderNavItems()}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg transition-all duration-300 md:hidden",
          isScrolled && "shadow-md"
        )}
      >
        <div className="flex items-center justify-between py-2 px-4">
          {renderNavItems()}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
