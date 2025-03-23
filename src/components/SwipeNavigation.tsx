
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation';

const SwipeNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSwipe } = useSwipeNavigation();

  return null; // This component only adds swipe functionality, no visual elements
};

export default SwipeNavigation;
