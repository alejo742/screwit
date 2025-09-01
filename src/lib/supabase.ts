import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_PROJECT_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_PROJECT_URL or SUPABASE_ANON_KEY');
}

// Prevent re-creating the client on hot reloads in development
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
