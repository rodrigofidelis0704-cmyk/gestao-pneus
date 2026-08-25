import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldpqtvktwvseqbbnbubr.supabase.co';
const supabasePublishableKey = 'sb_publishable_lUtyqCULWfx9ffSeJ_-lrg_LqKB6iUy';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
