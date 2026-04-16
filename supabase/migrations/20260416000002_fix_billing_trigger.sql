-- Mettre à jour le trigger pour autoriser explicitement les administrateurs
CREATE OR REPLACE FUNCTION protect_billing_columns()
RETURNS TRIGGER AS $$
DECLARE
    user_email text;
BEGIN
    -- Obtenir l'email de l'utilisateur qui fait la requête
    -- Sur Supabase, l'email est présent dans les claims JWT
    user_email := current_setting('request.jwt.claims', true)::json->>'email';
    
    -- Si l'utilisateur est un administrateur reconnu, on autorise la modification
    IF user_email IN ('guillaumephilippe1968@gmail.com', 'marc@damoiseaux.be') THEN
        RETURN NEW;
    END IF;

    -- Sinon, pour tous les autres utilisateurs authentifiés standards (Les clients) :
    IF current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
        -- Interdire de modifier son statut premium
        IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
            RAISE EXCEPTION 'Users cannot modify their premium status';
        END IF;
        
        -- Interdire de modifier son ID de paiement Stripe
        IF NEW.stripe_payment_id IS DISTINCT FROM OLD.stripe_payment_id THEN
            RAISE EXCEPTION 'Users cannot modify their billing identifiers';
        END IF;

        -- Interdire de modifier le niveau d'accès
        IF NEW.access_tier IS DISTINCT FROM OLD.access_tier THEN
            RAISE EXCEPTION 'Users cannot modify their access tier';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
