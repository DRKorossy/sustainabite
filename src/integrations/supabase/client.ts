// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://elvqvoppmdobppeqcwlm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdnF2b3BwbWRvYnBwZXFjd2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTUyNjgsImV4cCI6MjA1ODAzMTI2OH0.1LOgLeaHvza-ouFrVrtFrI__u0p5plaT-hv6T7vZgyE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);