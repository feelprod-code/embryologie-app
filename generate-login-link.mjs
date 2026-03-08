import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY 
);

async function generateLink() {
   console.log("On ne peut générer de Magic Link par API côté serveur qu'avec la clé Service Role (Admin).");
}
generateLink();
