
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/RecipeCard';

interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
}

interface RecentRecipesCarouselProps {
  recipes: Recipe[];
  isLoading: boolean;
}

const RecentRecipesCarousel = ({ recipes, isLoading }: RecentRecipesCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to the beginning
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(recipes.length - 1); // Loop to the end
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Limit the swipe distance
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const maxTranslate = containerWidth * 0.5;
    
    if (Math.abs(diff) < maxTranslate) {
      setTranslateX(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    // If swiped enough distance, change slide
    if (Math.abs(translateX) > 50) {
      if (translateX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    
    // Reset translation
    setTranslateX(0);
  };

  // When the current index changes, animate the carousel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const cards = container.querySelectorAll('.recipe-card');
    cards.forEach((card, index) => {
      const htmlCard = card as HTMLElement;
      
      if (index === currentIndex) {
        htmlCard.style.transform = 'scale(1)';
        htmlCard.style.opacity = '1';
        htmlCard.style.zIndex = '10';
      } else {
        htmlCard.style.transform = 'scale(0.9)';
        htmlCard.style.opacity = '0.7';
        htmlCard.style.zIndex = '0';
      }
    });
  }, [currentIndex, recipes.length]);

  // Load skeleton for loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        <div className="h-56 rounded-2xl animate-pulse bg-muted"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`flex transition-all duration-300 ease-out`} 
          style={{ 
            transform: isSwiping ? `translateX(${translateX}px)` : `translateX(-${currentIndex * 100}%)` 
          }}
        >
          {recipes.map((recipe, index) => (
            <div 
              key={recipe.id} 
              className={`recipe-card w-full flex-shrink-0 transition-all duration-300 px-1`}
              style={{ 
                transform: currentIndex === index ? 'scale(1)' : 'scale(0.9)',
                opacity: currentIndex === index ? 1 : 0.7,
                zIndex: currentIndex === index ? 10 : 0
              }}
            >
              <Link to={`/recipe/${recipe.id}`}>
                <RecipeCard
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  cookingTime={recipe.cookingTime}
                  calories={recipe.calories}
                  difficulty={recipe.difficulty}
                  rating={recipe.rating}
                  className="h-full mx-auto"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5 w-8 h-8"
          onClick={handlePrev}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        {/* Pagination dots */}
        <div className="flex gap-2">
          {recipes.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-sustainabite-purple' : 'bg-muted'}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5 w-8 h-8"
          onClick={handleNext}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecentRecipesCarousel;
