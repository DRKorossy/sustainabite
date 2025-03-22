
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SwipeOptions {
  threshold?: number; // minimum distance required for a swipe (px)
  timeout?: number;   // maximum time allowed for a swipe (ms)
}

export function useSwipeNavigation(options: SwipeOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  
  const threshold = options.threshold || 100;
  const timeout = options.timeout || 300;
  
  // Define the main app routes in order for navigation
  const mainRoutes = [
    '/dashboard',
    '/recipes',
    '/grocery-recognition',
    '/cart',
    '/profile'
  ];
  
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
      setTouchStartTime(Date.now());
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd || !touchStartTime) return;
      
      const swipeDistance = touchEnd - touchStart;
      const swipeTime = Date.now() - touchStartTime;
      
      // Only process if swipe is long enough and fast enough
      if (Math.abs(swipeDistance) > threshold && swipeTime < timeout) {
        // Check if the current path is one of our main routes
        const currentIndex = mainRoutes.indexOf(location.pathname);
        if (currentIndex === -1) return; // Not a main route
        
        if (swipeDistance > 0) {
          // Right swipe - go to previous route
          if (currentIndex > 0) {
            navigate(mainRoutes[currentIndex - 1]);
          }
        } else {
          // Left swipe - go to next route
          if (currentIndex < mainRoutes.length - 1) {
            navigate(mainRoutes[currentIndex + 1]);
          }
        }
      }
      
      // Reset
      setTouchStart(null);
      setTouchEnd(null);
      setTouchStartTime(null);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, touchStartTime, navigate, location, threshold, timeout, mainRoutes]);
}
