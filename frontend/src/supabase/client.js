'use client'
// supabase/client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey,   {
    auth: {
      storageKey: 'supabase.auth.token',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true
  }
});
