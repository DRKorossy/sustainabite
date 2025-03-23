
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create test users using Supabase auth
    const testUsers = [
      { email: "user@example.com", password: "password123", username: "testuser", fullName: "Test User" },
      { email: "chef@example.com", password: "password123", username: "masterchef", fullName: "Master Chef" },
      { email: "foodie@example.com", password: "password123", username: "foodlover", fullName: "Food Lover" }
    ];

    const createdUsers = [];

    for (const user of testUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', user.username)
        .single();

      if (!existingUser) {
        // Create user in auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true
        });

        if (authError) {
          console.error(`Error creating user ${user.email}:`, authError);
          continue;
        }

        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            username: user.username,
            full_name: user.fullName,
            dietary_restrictions: ["Vegetarian"],
            cooking_time: 30,
            calories: 2000,
            cooking_level: "Medium"
          })
          .eq('id', authUser.user.id);

        if (profileError) {
          console.error(`Error updating profile for ${user.email}:`, profileError);
        } else {
          createdUsers.push(authUser.user.id);
        }
      } else {
        console.log(`User ${user.username} already exists`);
      }
    }

    // Sample recipes data
    const recipes = [
      {
        title: "Grilled Salmon with Asparagus",
        description: "Delicious grilled salmon with fresh asparagus.",
        image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1170",
        cooking_time: 25,
        calories: 450,
        difficulty: "Medium",
        category: "Dinner",
        cuisine: "Mediterranean",
        ingredients: ["Salmon fillet", "Asparagus", "Olive oil", "Lemon", "Salt", "Pepper", "Garlic"],
        instructions: ["Preheat grill to medium-high heat", "Season salmon with salt, pepper, and garlic", "Grill for 4-5 minutes per side", "Toss asparagus in olive oil, salt, and pepper", "Grill asparagus for 3-4 minutes", "Serve salmon and asparagus with lemon wedges"]
      },
      {
        title: "Avocado Toast with Poached Egg",
        description: "Quick and nutritious breakfast option.",
        image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1280",
        cooking_time: 15,
        calories: 350,
        difficulty: "Easy",
        category: "Breakfast",
        cuisine: "American",
        ingredients: ["Whole grain bread", "Avocado", "Egg", "Salt", "Pepper", "Red pepper flakes", "Lemon juice"],
        instructions: ["Toast bread until golden brown", "Mash avocado with lemon juice, salt, and pepper", "Spread avocado on toast", "Poach egg in simmering water for 3 minutes", "Top toast with poached egg", "Season with salt, pepper, and red pepper flakes"]
      },
      {
        title: "Vegetable Stir Fry",
        description: "Quick and healthy vegetable stir fry.",
        image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170",
        cooking_time: 20,
        calories: 300,
        difficulty: "Easy",
        category: "Lunch",
        cuisine: "Asian",
        ingredients: ["Bell peppers", "Broccoli", "Carrots", "Snap peas", "Soy sauce", "Ginger", "Garlic", "Rice"],
        instructions: ["Cook rice according to package instructions", "Heat oil in a wok or large skillet", "Add garlic and ginger, cook for 30 seconds", "Add vegetables and stir fry for 5-6 minutes", "Add soy sauce and continue cooking for 1-2 minutes", "Serve over rice"]
      },
      {
        title: "Classic Beef Burger",
        description: "Juicy homemade beef burger with all the fixings.",
        image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1299",
        cooking_time: 30,
        calories: 650,
        difficulty: "Medium",
        category: "Dinner",
        cuisine: "American",
        ingredients: ["Ground beef", "Burger buns", "Lettuce", "Tomato", "Onion", "Cheese", "Ketchup", "Mustard", "Salt", "Pepper"],
        instructions: ["Mix ground beef with salt and pepper", "Form into patties", "Grill for 4-5 minutes per side", "Add cheese during the last minute", "Toast buns", "Assemble burger with toppings and condiments"]
      },
      {
        title: "Caprese Salad",
        description: "Simple and refreshing Italian salad.",
        image_url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=1287",
        cooking_time: 10,
        calories: 250,
        difficulty: "Easy",
        category: "Lunch",
        cuisine: "Italian",
        ingredients: ["Tomatoes", "Fresh mozzarella", "Fresh basil", "Olive oil", "Balsamic glaze", "Salt", "Pepper"],
        instructions: ["Slice tomatoes and mozzarella", "Arrange tomatoes and mozzarella on a plate", "Tuck basil leaves between slices", "Drizzle with olive oil and balsamic glaze", "Season with salt and pepper"]
      },
      {
        title: "Chocolate Chip Cookies",
        description: "Classic homemade chocolate chip cookies.",
        image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1164",
        cooking_time: 25,
        calories: 180,
        difficulty: "Easy",
        category: "Dessert",
        cuisine: "American",
        ingredients: ["Butter", "Brown sugar", "White sugar", "Eggs", "Vanilla extract", "Flour", "Baking soda", "Salt", "Chocolate chips"],
        instructions: ["Preheat oven to 375°F (190°C)", "Cream butter and sugars until light and fluffy", "Beat in eggs and vanilla", "Mix in dry ingredients", "Fold in chocolate chips", "Drop spoonfuls onto baking sheet", "Bake for 9-11 minutes until golden"]
      },
      {
        title: "Chicken Caesar Salad",
        description: "Classic Caesar salad with grilled chicken.",
        image_url: "https://images.unsplash.com/photo-1512852939750-1305098529bf?q=80&w=1170",
        cooking_time: 20,
        calories: 420,
        difficulty: "Easy",
        category: "Lunch",
        cuisine: "American",
        ingredients: ["Chicken breast", "Romaine lettuce", "Parmesan cheese", "Croutons", "Caesar dressing", "Lemon juice", "Olive oil", "Salt", "Pepper"],
        instructions: ["Season chicken with salt and pepper", "Grill chicken for 6-7 minutes per side until cooked through", "Slice cooked chicken", "Toss lettuce with dressing", "Top with sliced chicken, parmesan, and croutons"]
      },
      {
        title: "Mushroom Risotto",
        description: "Creamy Italian rice dish with mushrooms.",
        image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1170",
        cooking_time: 35,
        calories: 480,
        difficulty: "Hard",
        category: "Dinner",
        cuisine: "Italian",
        ingredients: ["Arborio rice", "Mushrooms", "Onion", "Garlic", "White wine", "Vegetable broth", "Parmesan cheese", "Butter", "Olive oil", "Parsley"],
        instructions: ["Sauté mushrooms in butter until browned, set aside", "Sauté onion and garlic in olive oil", "Add rice and toast for 2 minutes", "Add wine and cook until absorbed", "Add hot broth one ladle at a time, stirring until absorbed", "Continue adding broth until rice is creamy and al dente", "Stir in mushrooms, parmesan, and butter", "Garnish with parsley"]
      },
      {
        title: "Greek Yogurt Parfait",
        description: "Healthy breakfast parfait with yogurt, fruit, and granola.",
        image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1287",
        cooking_time: 5,
        calories: 280,
        difficulty: "Easy",
        category: "Breakfast",
        cuisine: "Mediterranean",
        ingredients: ["Greek yogurt", "Granola", "Honey", "Berries", "Banana", "Chia seeds"],
        instructions: ["Layer yogurt in a glass or bowl", "Add a layer of granola", "Add a layer of mixed berries and banana slices", "Drizzle with honey", "Sprinkle with chia seeds", "Repeat layers as desired"]
      },
      {
        title: "Spaghetti Carbonara",
        description: "Classic Italian pasta dish with egg and pancetta.",
        image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1171",
        cooking_time: 25,
        calories: 550,
        difficulty: "Medium",
        category: "Dinner",
        cuisine: "Italian",
        ingredients: ["Spaghetti", "Pancetta or bacon", "Eggs", "Parmesan cheese", "Black pepper", "Salt", "Garlic"],
        instructions: ["Cook spaghetti according to package instructions", "Cook pancetta or bacon until crispy", "Whisk eggs, cheese, and pepper in a bowl", "Drain pasta, reserving some pasta water", "Toss hot pasta with pancetta", "Remove from heat and quickly mix in egg mixture", "Add pasta water if needed for creaminess"]
      }
    ];

    // Add recipes
    if (createdUsers.length > 0) {
      for (const recipe of recipes) {
        // Pick a random user as the creator
        const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
        const created_by = createdUsers[randomUserIndex];
        
        // Check if recipe already exists
        const { data: existingRecipe } = await supabase
          .from('recipes')
          .select('*')
          .eq('title', recipe.title)
          .eq('created_by', created_by)
          .single();
          
        if (!existingRecipe) {
          await supabase
            .from('recipes')
            .insert([{
              ...recipe,
              created_by
            }]);
        }
      }
    }

    // Add grocery items
    const groceryItems = [
      { name: "Milk", category: "Dairy", average_price: 2.99, is_perishable: true, shelf_life_days: 7 },
      { name: "Eggs", category: "Dairy", average_price: 3.49, is_perishable: true, shelf_life_days: 21 },
      { name: "Bread", category: "Bakery", average_price: 2.49, is_perishable: true, shelf_life_days: 5 },
      { name: "Chicken Breast", category: "Meat", average_price: 5.99, is_perishable: true, shelf_life_days: 3 },
      { name: "Ground Beef", category: "Meat", average_price: 4.99, is_perishable: true, shelf_life_days: 2 },
      { name: "Salmon Fillet", category: "Seafood", average_price: 9.99, is_perishable: true, shelf_life_days: 2 },
      { name: "Apples", category: "Produce", average_price: 1.49, is_perishable: true, shelf_life_days: 14 },
      { name: "Bananas", category: "Produce", average_price: 0.59, is_perishable: true, shelf_life_days: 5 },
      { name: "Potatoes", category: "Produce", average_price: 0.99, is_perishable: true, shelf_life_days: 30 },
      { name: "Onions", category: "Produce", average_price: 0.89, is_perishable: true, shelf_life_days: 30 },
      { name: "Tomatoes", category: "Produce", average_price: 1.99, is_perishable: true, shelf_life_days: 7 },
      { name: "Lettuce", category: "Produce", average_price: 1.79, is_perishable: true, shelf_life_days: 7 },
      { name: "Yogurt", category: "Dairy", average_price: 1.29, is_perishable: true, shelf_life_days: 14 },
      { name: "Cheese", category: "Dairy", average_price: 3.99, is_perishable: true, shelf_life_days: 14 },
      { name: "Pasta", category: "Dry Goods", average_price: 1.49, is_perishable: false, shelf_life_days: 365 },
      { name: "Rice", category: "Dry Goods", average_price: 2.99, is_perishable: false, shelf_life_days: 730 },
      { name: "Cereal", category: "Dry Goods", average_price: 3.99, is_perishable: false, shelf_life_days: 180 },
      { name: "Canned Beans", category: "Canned Goods", average_price: 0.99, is_perishable: false, shelf_life_days: 1095 },
      { name: "Canned Soup", category: "Canned Goods", average_price: 1.79, is_perishable: false, shelf_life_days: 1095 },
      { name: "Canned Tuna", category: "Canned Goods", average_price: 1.29, is_perishable: false, shelf_life_days: 1095 },
      { name: "Olive Oil", category: "Oils & Condiments", average_price: 7.99, is_perishable: false, shelf_life_days: 730 },
      { name: "Flour", category: "Baking", average_price: 2.49, is_perishable: false, shelf_life_days: 365 },
      { name: "Sugar", category: "Baking", average_price: 2.29, is_perishable: false, shelf_life_days: 730 },
      { name: "Coffee", category: "Beverages", average_price: 6.99, is_perishable: false, shelf_life_days: 180 },
      { name: "Tea", category: "Beverages", average_price: 3.99, is_perishable: false, shelf_life_days: 365 },
      { name: "Orange Juice", category: "Beverages", average_price: 2.99, is_perishable: true, shelf_life_days: 7 },
      { name: "Frozen Pizza", category: "Frozen", average_price: 4.99, is_perishable: true, shelf_life_days: 180 },
      { name: "Ice Cream", category: "Frozen", average_price: 3.99, is_perishable: true, shelf_life_days: 90 },
      { name: "Frozen Vegetables", category: "Frozen", average_price: 2.49, is_perishable: true, shelf_life_days: 270 },
      { name: "Chocolate", category: "Snacks", average_price: 2.49, is_perishable: false, shelf_life_days: 180 }
    ];

    for (const item of groceryItems) {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('grocery_items')
        .select('*')
        .eq('name', item.name)
        .single();
        
      if (!existingItem) {
        await supabase
          .from('grocery_items')
          .insert([item]);
      }
    }

    // Add some sample groceries for the first user
    if (createdUsers.length > 0) {
      const firstUserId = createdUsers[0];
      
      const userGroceries = [
        { name: "Milk", quantity: 1, unit: "gallon", expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { name: "Eggs", quantity: 12, unit: "units", expiry_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { name: "Bread", quantity: 1, unit: "loaf", expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { name: "Apples", quantity: 5, unit: "units", expiry_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { name: "Pasta", quantity: 2, unit: "boxes", expiry_date: null, is_perishable: false }
      ];
      
      for (const grocery of userGroceries) {
        await supabase
          .from('groceries')
          .insert([{
            ...grocery,
            user_id: firstUserId
          }]);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Data populated successfully",
        testUsers: testUsers.map(user => ({ email: user.email, password: user.password }))
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
