
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  title: string;
  image_url: string;
  cooking_time: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  category: string;
  cuisine?: string;
  ingredients: string[];
  instructions: string[];
  created_by: string;
  created_at: string;
}

// Function to search recipes with various filters
export const searchRecipes = async ({
  searchTerm = '',
  cuisine = null,
  category = null,
  difficulty = null,
  maxTime = null,
  maxCalories = null,
  limit = 20,
  offset = 0
}: {
  searchTerm?: string;
  cuisine?: string | null;
  category?: string | null;
  difficulty?: string | null;
  maxTime?: number | null;
  maxCalories?: number | null;
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase
      .from('recipes')
      .select('*', { count: 'exact' });

    // Apply text search if provided
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%`);
    }

    // Apply filters if provided
    if (cuisine) {
      query = query.eq('cuisine', cuisine);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (maxTime) {
      query = query.lte('cooking_time', maxTime);
    }

    if (maxCalories) {
      query = query.lte('calories', maxCalories);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Order by most recent
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return { data, count };
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Function to get recipe by ID
export const getRecipeById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};

// Function to save/unsave a recipe
export const toggleSavedRecipe = async (userId: string, recipeId: string) => {
  try {
    // First check if recipe is already saved
    const { data: existingData, error: existingError } = await supabase
      .from('saved_recipes')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingData) {
      // Recipe is already saved, so unsave it
      const { error: deleteError } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', existingData.id);

      if (deleteError) {
        throw deleteError;
      }

      return { action: 'unsaved' };
    } else {
      // Recipe isn't saved, so save it
      const { error: insertError } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: userId,
          recipe_id: recipeId
        });

      if (insertError) {
        throw insertError;
      }

      return { action: 'saved' };
    }
  } catch (error) {
    console.error('Error toggling saved recipe:', error);
    throw error;
  }
};

// Function to check if a recipe is saved by user
export const isRecipeSaved = async (userId: string, recipeId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_recipes')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if recipe is saved:', error);
    throw error;
  }
};

// Function to rate a recipe
export const rateRecipe = async (userId: string, recipeId: string, rating: number) => {
  try {
    // First check if user has already rated this recipe
    const { data: existingData, error: existingError } = await supabase
      .from('recipe_ratings')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingData) {
      // Update existing rating
      const { error: updateError } = await supabase
        .from('recipe_ratings')
        .update({ rating })
        .eq('id', existingData.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Insert new rating
      const { error: insertError } = await supabase
        .from('recipe_ratings')
        .insert({
          user_id: userId,
          recipe_id: recipeId,
          rating
        });

      if (insertError) {
        throw insertError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error rating recipe:', error);
    throw error;
  }
};

// Function to get user's saved recipes
export const getSavedRecipes = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_recipes')
      .select(`
        id,
        recipes (
          id,
          title,
          image_url,
          cooking_time,
          calories,
          difficulty,
          rating
        )
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data?.map(item => item.recipes) || [];
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    throw error;
  }
};
