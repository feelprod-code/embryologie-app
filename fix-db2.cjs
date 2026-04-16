const fs = require('fs');
const { Client } = require('pg');

async function run() {
  try {
    const sql = fs.readFileSync('supabase/migrations/20260416000002_fix_billing_trigger.sql', 'utf8');
    const client = new Client("postgresql://postgres.eqcjgucfpmhvxkckokwb:LQMrkUlkOY8GpgE2@aws-1-eu-west-1.pooler.supabase.com:5432/postgres");
    await client.connect();
    console.log("Connected to Supabase DB via Pooler");
    await client.query(sql);
    console.log("Successfully applied security trigger patch");
    await client.end();
  } catch(e) {
    console.error(e);
  }
}
run();
