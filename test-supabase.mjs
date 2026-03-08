import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function test() {
    console.log('Testing Supabase profiles table...');
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
            console.error('Supabase error:', error);
        } else {
            console.log('Data:', data);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

test();
