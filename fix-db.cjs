const fs = require('fs');
const { Client } = require('pg');

async function run() {
  try {
    const sql = fs.readFileSync('supabase/migrations/20260416000000_protect_is_premium.sql', 'utf8');
    const client = new Client("postgresql://postgres:LQMrkUlkOY8GpgE2@db.eqcjgucfpmhvxkckokwb.supabase.co:5432/postgres");
    await client.connect();
    console.log("Connected to Supabase DB");
    await client.query(sql);
    console.log("Successfully applied security trigger");
    await client.end();
  } catch(e) {
    console.error(e);
  }
}
run();
