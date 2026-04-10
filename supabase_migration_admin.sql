-- Exécutez ce script dans l'éditeur SQL de votre interface Supabase

-- 1. Ajout de la colonne access_tier
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS access_tier text CHECK (access_tier IN ('legacy', 'premium', 'free', 'trial'));

-- 2. Ajout de la colonne expires_at
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;

-- Note : Par défaut, vos clients actuels auront des valeurs 'null'. 
-- Vous pourrez modifier ces valeurs depuis votre nouveau tableau de bord Administrateur.
