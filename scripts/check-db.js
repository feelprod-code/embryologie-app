import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: triggerDef, error: e1 } = await supabase.rpc('get_function_def', { function_name: 'handle_new_user' });
  console.log("Trigger Error:", e1);
  const { data: profiles, error: e2 } = await supabase.from('profiles').select('*');
  console.log("Profiles Error/Data:", e2, profiles);
}
run();
