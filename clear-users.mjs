import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_ANON_KEY; // I will need the service role key to delete users

console.log("Cannot automatically delete users without the SUPABASE_SERVICE_ROLE_KEY (which is not in .env for security reasons).");
console.log("I will write a SQL query for the user instead.");
