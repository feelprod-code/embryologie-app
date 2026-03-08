require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const res1 = await supabase.from('profiles').update({ device_id: null }).eq('email', 'guillaumephilippe@me.com');
  console.log('Update @me.com status:', res1.status, res1.error);
  
  const res2 = await supabase.from('profiles').update({ device_id: null }).eq('email', 'feelprod@free.fr');
  console.log('Update @free.fr status:', res2.status, res2.error);
}
run();
