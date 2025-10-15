// app/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Kunci Anon dari environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lakukan pengecekan untuk memastikan environment variables sudah diisi
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required. Please check your .env.local file.");
}

// Buat dan ekspor klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);