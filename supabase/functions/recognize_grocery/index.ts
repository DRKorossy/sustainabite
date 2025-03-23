
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, userId } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // In a real app, we would use an AI model or third-party API to analyze the image
    // For now, we'll simulate grocery recognition with predefined items
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock grocery recognition results
    const recognizedItems = [
      { name: "Apples", confidence: 0.95, quantity: 5 },
      { name: "Milk", confidence: 0.89, quantity: 1 },
      { name: "Bread", confidence: 0.82, quantity: 1 }
    ];
    
    // Add streak for scanning groceries if user ID is provided
    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Get user's current streak data
        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (streakData) {
          const today = new Date().toISOString().split('T')[0];
          const lastActivity = streakData.last_activity_date ? new Date(streakData.last_activity_date).toISOString().split('T')[0] : null;
          
          // Only update if not already scanned today
          if (lastActivity !== today) {
            await supabase
              .from('user_streaks')
              .update({
                current_streak: streakData.current_streak + 1,
                max_streak: Math.max(streakData.current_streak + 1, streakData.max_streak),
                last_activity_date: today
              })
              .eq('user_id', userId);
              
            // Check if user has scanned groceries 5 times (Grocery Expert achievement)
            if (streakData.current_streak + 1 === 5) {
              const { data: achievementData } = await supabase
                .from('achievements')
                .select('id')
                .eq('name', 'Grocery Expert')
                .single();
                
              if (achievementData) {
                // Check if user already has this achievement
                const { data: existingAchievement } = await supabase
                  .from('user_achievements')
                  .select('*')
                  .eq('user_id', userId)
                  .eq('achievement_id', achievementData.id)
                  .single();
                  
                if (!existingAchievement) {
                  await supabase
                    .from('user_achievements')
                    .insert([{
                      user_id: userId,
                      achievement_id: achievementData.id
                    }]);
                }
              }
            }
          }
        }
        
        // Add recognized items to user's groceries
        for (const item of recognizedItems) {
          // Check if item already exists in user's groceries
          const { data: existingGrocery } = await supabase
            .from('groceries')
            .select('*')
            .eq('user_id', userId)
            .eq('name', item.name)
            .single();
            
          if (existingGrocery) {
            // Update quantity
            await supabase
              .from('groceries')
              .update({
                quantity: existingGrocery.quantity + item.quantity
              })
              .eq('id', existingGrocery.id);
          } else {
            // Get shelf life from grocery_items
            const { data: groceryItem } = await supabase
              .from('grocery_items')
              .select('*')
              .eq('name', item.name)
              .single();
              
            const expiryDate = groceryItem?.is_perishable 
              ? new Date(Date.now() + (groceryItem.shelf_life_days || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              : null;
              
            await supabase
              .from('groceries')
              .insert([{
                user_id: userId,
                name: item.name,
                quantity: item.quantity,
                unit: "units",
                expiry_date: expiryDate,
                is_perishable: groceryItem?.is_perishable || true
              }]);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        recognizedItems
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
