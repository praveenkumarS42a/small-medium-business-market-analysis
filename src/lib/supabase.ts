import { createClient } from '@supabase/supabase-js';

// These must be provided in the environment variables (e.g., .env.local file)
// For this template, you can replace them with your actual Supabase URL and Anon Key.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
