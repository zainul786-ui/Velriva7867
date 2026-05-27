import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Log status on application boot (silent debug, completely safe)
if (isSupabaseConfigured) {
  console.log('🔌 Supabase initialized successfully. Synced with PostgreSQL.');
} else {
  console.log('🛡️ Supabase is in Offline Safe mode. LocalStorage fallback is active.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
