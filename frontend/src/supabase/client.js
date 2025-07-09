'use client'
// supabase/client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables');
}

console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey,   {
    auth: {
      storageKey: 'supabase.auth.token',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true
  }
  });
console.log('✅ Supabase client created:', supabase)
console.log('✅ Supabase auth:', supabase.auth)
