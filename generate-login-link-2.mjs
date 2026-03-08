import { createClient } from '@supabase/supabase-js';

const url = "https://eqcjgucfpmhvxkckokwb.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxY2pndWNmcG1odnhrY2tva3diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY3MTQyMCwiZXhwIjoyMDg2MjQ3NDIwfQ.t01nN64orujOvqWdQEt6gXp59qkWTrmGuwZU5Jo1708";

const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: 'guillaumephilippe@me.com',
    });
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("MAGIC_LINK=" + data.properties.action_link);
    }
}
main();
