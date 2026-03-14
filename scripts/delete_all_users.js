import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables. Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAllStudents() {
  console.log("Starting deletion of student profiles and their auth users...");

  // 1. Fetch all profiles
  const { data: profiles, error: fetchError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name');

  if (fetchError) {
    console.error("Error fetching profiles:", fetchError);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log("No student profiles found to delete.");
    return;
  }

  console.log(`Found ${profiles.length} profiles. Proceeding with deletion...`);

  // 2. Iterate and delete from Auth admin API (which should cascade to the profiles table)
  let deletedCount = 0;
  let errorCount = 0;

  for (const profile of profiles) {
    console.log(`Deleting user: ${profile.email} (${profile.id})...`);
    
    // Deleting from auth.users requires service_role key
    const { error: deleteError } = await supabase.auth.admin.deleteUser(profile.id);
    
    if (deleteError) {
      console.error(`Error deleting user ${profile.id}:`, deleteError.message);
      errorCount++;
    } else {
      console.log(`Successfully deleted user ${profile.id}`);
      deletedCount++;
    }
  }

  console.log(`\nDeletion complete.`);
  console.log(`Successfully deleted: ${deletedCount}`);
  console.log(`Failed to delete: ${errorCount}`);
}

deleteAllStudents();
