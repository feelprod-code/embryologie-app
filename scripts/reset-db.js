import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clean() {
  const { error } = await supabase.rpc('delete_all_users_except_admin', { admin_email: 'guillaumephilippe1968@gmail.com' });
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Database cleaned!');
  }
}

clean();
