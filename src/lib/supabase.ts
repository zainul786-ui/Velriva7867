import { createClient } from '@supabase/supabase-js';

const rawUrl = ((import.meta as any).env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '').trim();

// Sanitize URL to ensure supabase-js doesn't double-append paths
// supabase-js expects the base URL (https://yourproject.supabase.co) 
// but developers often paste the full /rest/v1 endpoint
let cleanUrl = rawUrl;
if (cleanUrl) {
  cleanUrl = cleanUrl.replace(/\/+$/, '');
  if (cleanUrl.endsWith('/rest/v1')) {
    cleanUrl = cleanUrl.substring(0, cleanUrl.length - 8);
  }
  cleanUrl = cleanUrl.replace(/\/+$/, '');
}

export const isSupabaseConfigured = Boolean(cleanUrl && supabaseAnonKey);

// Log status on application boot (silent debug, completely safe)
if (isSupabaseConfigured) {
  console.log(`🔌 Supabase sanitized and initialized: ${cleanUrl}. Synced with PostgreSQL.`);
} else {
  console.log('🛡️ Supabase is in Offline Safe mode. LocalStorage fallback is active.');
}

export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, supabaseAnonKey)
  : null;
