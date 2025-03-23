
import { supabase } from '@/integrations/supabase/client';

// Function to adjust ingredient quantities based on servings
export function adjustIngredientQuantities(ingredient: string, servingRatio: number): string {
  return ingredient.replace(/(\d+(\.\d+)?)/g, (match) => {
    const num = parseFloat(match);
    if (!isNaN(num)) {
      const adjusted = (num * servingRatio).toFixed(1);
      // Remove trailing .0 if present
      return adjusted.endsWith('.0') ? adjusted.slice(0, -2) : adjusted;
    }
    return match;
  });
}

// Function to toggle favorite/saved recipe
export async function toggleSavedRecipe(recipeId: string, userId: string, isCurrentlySaved: boolean) {
  try {
    if (isCurrentlySaved) {
      // Remove from saved recipes
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId);
      
      if (error) throw error;
      
      return { success: true, saved: false };
    } else {
      // Add to saved recipes
      const { error } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: userId,
          recipe_id: recipeId
        });
      
      if (error) throw error;
      
      return { success: true, saved: true };
    }
  } catch (error) {
    console.error('Error toggling saved recipe:', error);
    return { success: false, error };
  }
}

// Function to add recipe ingredients to cart
export async function addRecipeIngredientsToCart(recipeId: string, userId: string, servings: number = 1) {
  try {
    // First, get the recipe to access its ingredients
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('ingredients, servings')
      .eq('id', recipeId)
      .single();
    
    if (recipeError) throw recipeError;
    
    if (!recipe || !recipe.ingredients) {
      throw new Error('Recipe or ingredients not found');
    }
    
    // Calculate serving ratio
    const servingRatio = servings / (recipe.servings || 1);
    
    // Process ingredients to extract names and quantities
    const cartItems = recipe.ingredients.map((ingredient: string) => {
      // This is a simplistic parsing - a more robust parser would be needed for production
      const quantityMatch = ingredient.match(/^(\d+(\.\d+)?)/);
      const quantity = quantityMatch ? parseFloat(quantityMatch[1]) * servingRatio : 1;
      
      // Extract the item name, removing quantities and units
      const nameMatch = ingredient.match(/(?:\d+\s*\w*\s*)(.*)/);
      const itemName = nameMatch ? nameMatch[1].trim() : ingredient;
      
      return {
        name: itemName,
        quantity: Math.ceil(quantity)
      };
    });
    
    // Add ingredients to cart (simplified example)
    // In a real app, you might want to:
    // 1. Check if items already exist in cart and update quantities
    // 2. Match ingredients to actual grocery items in your database
    // 3. Handle units and conversions more carefully
    
    return { success: true, cartItems };
  } catch (error) {
    console.error('Error adding recipe ingredients to cart:', error);
    return { success: false, error };
  }
}

// Function to rate a recipe
export async function rateRecipe(recipeId: string, userId: string, rating: number) {
  try {
    // Check if user has already rated this recipe
    const { data: existingRating, error: checkError } = await supabase
      .from('recipe_ratings')
      .select('id, rating')
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingRating) {
      // Update existing rating
      const { error } = await supabase
        .from('recipe_ratings')
        .update({ rating })
        .eq('id', existingRating.id);
      
      if (error) throw error;
    } else {
      // Create new rating
      const { error } = await supabase
        .from('recipe_ratings')
        .insert({
          recipe_id: recipeId,
          user_id: userId,
          rating
        });
      
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error rating recipe:', error);
    return { success: false, error };
  }
}
