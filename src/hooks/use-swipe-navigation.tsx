
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMainPage = (path: string) => {
    return ['/dashboard', '/recipes', '/my-groceries', '/social', '/cart', '/profile'].includes(path);
  };

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (!isMainPage(location.pathname)) return;

    const mainRoutes = ['/dashboard', '/recipes', '/my-groceries', '/social', '/cart', '/profile'];
    const currentIndex = mainRoutes.indexOf(location.pathname);
    
    if (currentIndex === -1) return;

    if (direction === 'left') {
      // Swipe left to go to the next page (to the right in the array)
      const nextIndex = (currentIndex + 1) % mainRoutes.length;
      navigate(mainRoutes[nextIndex]);
    } else if (direction === 'right') {
      // Swipe right to go to the previous page (to the left in the array)
      const prevIndex = (currentIndex - 1 + mainRoutes.length) % mainRoutes.length;
      navigate(mainRoutes[prevIndex]);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    let touchStartX: number | null = null;
    let touchEndX: number | null = null;
    const MIN_SWIPE_DISTANCE = 50;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStartX) {
        return;
      }
      touchEndX = e.changedTouches[0].clientX;
      handleSwipeGesture();
    };

    const handleSwipeGesture = () => {
      if (touchStartX && touchEndX) {
        const distance = touchEndX - touchStartX;
        if (Math.abs(distance) > MIN_SWIPE_DISTANCE) {
          if (distance > 0) {
            handleSwipe('right');
          } else {
            handleSwipe('left');
          }
        }
      }
      // Reset values
      touchStartX = null;
      touchEndX = null;
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleSwipe]);

  return { handleSwipe };
};

export default useSwipeNavigation;
