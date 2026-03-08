import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY // Actually we need service_role for this, let's see if we can read it from Supabase config
);
console.log("Supabase URL:", process.env.VITE_SUPABASE_URL);
