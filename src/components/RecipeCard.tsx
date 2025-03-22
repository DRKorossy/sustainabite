import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, ChefHat, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  className?: string;
}

const RecipeCard = ({ 
  id, 
  title, 
  image, 
  cookingTime, 
  calories, 
  difficulty, 
  rating,
  className 
}: RecipeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setImageLoaded(true);
  }, [image]);

  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };

  return (
    <Link 
      to={`/recipe/${id}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg",
        "transform hover:scale-[1.02] hover:-translate-y-1",
        "glass-card bg-white/80",
        className
      )}
    >
      <div className="w-full aspect-video overflow-hidden rounded-t-2xl image-blur-wrapper">
        <img 
          src={image} 
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            "image-blur",
            imageLoaded && "loaded"
          )}
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-serif font-medium text-lg mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-1">
            <Clock className="w-3 h-3" />
            <span>{cookingTime} mins</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-1">
            <Flame className="w-3 h-3" />
            <span>{calories} cal</span>
          </div>
          
          <div className={cn(
            "flex items-center gap-1 text-xs rounded-full px-2 py-1",
            difficultyColor[difficulty]
          )}>
            <ChefHat className="w-3 h-3" />
            <span>{difficulty}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};

export default RecipeCard;
