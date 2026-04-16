-- Ajouter la colonne stripe_payment_id pour enregistrer l'identifiant Stripe et permettre les remboursements
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_payment_id text;

-- Comme pour is_premium, on s'assure que cette colonne est visible mais non-modifiable abusivement par les clients.
-- Normalement, l'update est protégé par le trigger protect_is_premium_column qui a été mis en place hier, 
-- mais nous devons nous assurer que les utilisateurs "standards" ne peuvent pas modifier cette colonne 
-- arbitrairement s'ils modifient leur propre profil.

-- Le trigger 'protect_is_premium_column' vérifiait déjà "NEW.is_premium IS DISTINCT FROM OLD.is_premium".
-- Nous devrions mettre à jour ce comportement ou créer un trigger spécifique pour interdire 
-- la modification de stripe_payment_id par l'utilisateur connecté lui-même.

CREATE OR REPLACE FUNCTION protect_billing_columns()
RETURNS TRIGGER AS $$
BEGIN
    -- Seul le Rôle de Service (le Webhook Supabase Edge Functions avec service_role_key) 
    -- ou le rôle postgres (Admin) ont le droit de modifier les champs liés à la facturation.
    IF current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
        -- Si l'utilisateur tente de modifier son statut premium
        IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
            RAISE EXCEPTION 'Users cannot modify their premium status';
        END IF;
        
        -- Si l'utilisateur tente de modifier son ID de paiement Stripe
        IF NEW.stripe_payment_id IS DISTINCT FROM OLD.stripe_payment_id THEN
            RAISE EXCEPTION 'Users cannot modify their billing identifiers';
        END IF;

        -- De même pour access_tier s'il existe
        IF NEW.access_tier IS DISTINCT FROM OLD.access_tier THEN
            RAISE EXCEPTION 'Users cannot modify their access tier';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remplacer l'ancien trigger par celui-ci plus générique
DROP TRIGGER IF EXISTS ensure_is_premium_not_updated ON public.profiles;

CREATE TRIGGER ensure_billing_not_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION protect_billing_columns();
