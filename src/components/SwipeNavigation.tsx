
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const SwipeNavigation = () => {
  useSwipeNavigation({ threshold: 80, timeout: 300 });
  const location = useLocation();
  const { toast } = useToast();
  const [hasShownTutorial, setHasShownTutorial] = useState(false);
  
  // Only show the swipe tutorial once per session
  useEffect(() => {
    const hasSeenTutorial = sessionStorage.getItem('swipeTutorialSeen');
    
    if (!hasSeenTutorial && !hasShownTutorial) {
      // Don't show tutorial on landing and onboarding pages
      if (location.pathname !== '/' && location.pathname !== '/onboarding') {
        setTimeout(() => {
          toast({
            title: "Swipe Navigation",
            description: "Swipe left or right to navigate between pages",
            duration: 4000,
          });
          sessionStorage.setItem('swipeTutorialSeen', 'true');
          setHasShownTutorial(true);
        }, 1500);
      }
    }
  }, [location.pathname, toast, hasShownTutorial]);
  
  // This is just a wrapper component that adds the swipe functionality
  // It doesn't render anything itself
  return null;
};

export default SwipeNavigation;
