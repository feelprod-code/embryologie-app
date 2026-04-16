const { Client } = require('pg');
async function run() {
  const client = new Client("postgresql://postgres.eqcjgucfpmhvxkckokwb:LQMrkUlkOY8GpgE2@aws-1-eu-west-1.pooler.supabase.com:5432/postgres");
  await client.connect();
  
  await client.query(`
    -- Ajouter les colonnes manquantes
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS access_tier text;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;

    -- Recharger le cache du schéma de Supabase
    NOTIFY pgrst, 'reload schema';
  `);

  console.log("Successfully added columns and reloaded schema.");
  await client.end();
}
run();
